import User from '../models/User.js';

export const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required',
      });
    }

    const userData = await User.findById(userId);
    const cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({
      success: true,
      cartData,
      message: 'Added to Cart successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.userId;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required',
      });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid itemId or quantity',
      });
    }

    const userData = await User.findById(userId);
    const cartData = userData.cartData;

    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    await User.findByIdAndUpdate(userId, { cartData });
    return res.status(200).json({
      success: true,
      cartData,
      message: 'Updated Cart successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
