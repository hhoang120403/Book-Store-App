import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB(); // Connect MongoDB
await connectCloudinary(); // Set up Cloudinary for image storage

const allowedOrigins = [process.env.FRONTEND_SERVER];

// Stripe Webhooks
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

app.use(express.json()); // Enables JSON request body parsing
app.use(cookieParser()); // Cookie parser middleware to parse HTTP request cookies => object
app.use(
  cors({
    origin: allowedOrigins, // Whitelist of allowed domains
    credentials: true, // Require for cookies/authoriztion headers
  })
);

// Define API routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send('API successfully connected');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
