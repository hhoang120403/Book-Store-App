import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import stripe from 'stripe';

const currency = 'usd';
const deliveryCharges = 10;
const taxPercentage = 0.02;

export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
      });
    }

    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    let subtotal = 0;

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      const itemTotal = product.offerPrice * item.quantity;
      subtotal += itemTotal;
    }

    const taxAmount = subtotal * taxPercentage;
    const totalAmount = taxAmount + deliveryCharges + subtotal;

    await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentMethod: 'COD',
    });

    // Clear user cart
    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({
      success: true,
      message: 'Order Placed successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
      });
    }

    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    let subtotal = 0;
    let productData = [];

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      const itemTotal = product.offerPrice * item.quantity;
      subtotal += itemTotal;
    }

    const taxAmount = subtotal * taxPercentage;
    const totalAmount = taxAmount + deliveryCharges + subtotal;

    const order = await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentMethod: 'Stripe',
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create line items for stripe
    let line_items = productData.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // Add tax as separate line items
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Tax (2%)',
        },
        unit_amount: Math.round(taxAmount * 100),
      },
      quantity: 1,
    });

    // Add delivery charges as separate line items
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Deliver Charges',
        },
        unit_amount: Math.round(deliveryCharges * 100),
      },
      quantity: 1,
    });

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      url: session.url,
      message: 'Processing checkout',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// Stripe webhooks for verifying payment through stripe
export const stripeWebhooks = async (req, res) => {
  // Stripe gateway initialization
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;

      // Mark order as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      // Clear user cart
      await User.findByIdAndUpdate(userId, { cartData: {} });

      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_itent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;

      // Delete the order if payment is failed
      await Order.findByIdAndDelete(orderId);

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return res.json({
    success: true,
    message: '',
  });
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      $or: [{ paymentMethod: 'COD' }, { isPaid: true }],
    })
      .populate('items.product address')
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        message: 'No orders found',
      });
    }

    return res.status(200).json({
      success: true,
      orders,
      message: 'Fetched user orders successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentMethod: 'COD' }, { isPaid: true }],
    })
      .populate('items.product address')
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        message: 'No orders found',
      });
    }

    return res.status(200).json({
      success: true,
      orders,
      message: 'Fetched all orders successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const updateState = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
