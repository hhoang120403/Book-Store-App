import User from '../models/User.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const cookieOptions = {
  httpOnly: true, // Prevent client-side javascript from accessing the cookie
  secure: process.env.APP_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
  sameSite: process.env.APP_ENV === 'production' ? 'none' : 'strict', // Controls when cookies are sent 'none' allows cross-site in production, 'strict' block cross-site by default
};

export const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Validate password and checking strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: 'Please enter a valid email',
      });
    }

    if (password.length < 6) {
      return res.json({
        success: false,
        message: 'Please enter a strong password',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      ...cookieOptions,
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      user: { email: user.email, name: user.name },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      ...cookieOptions,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      user: { email: user.email, name: user.name },
      message: 'User login successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const isAuth = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select('-password');
    return res.json({ success: true, user, message: 'User authorized' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      user,
      message: 'Internal Server Error',
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie('token', cookieOptions);
    return res.status(200).json({ success: true, message: 'Logged Out' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
