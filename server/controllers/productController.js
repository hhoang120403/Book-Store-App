import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);

    const images = req.files;

    // Upload images to cloudinary or use a default image
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imagesUrl });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      products,
      message: 'Fetched products successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    return res.status(200).json({
      success: true,
      product,
      message: 'Fetched product successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { productId, inStock } = req.body;
    await Product.findByIdAndUpdate(productId, { inStock });
    return res.status(200).json({
      success: true,
      message: 'Updated Stock successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
