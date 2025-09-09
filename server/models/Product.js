import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    popular: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    published: { type: Number, required: true },
    pages: { type: Number, required: true },
    language: { type: String, required: true },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
