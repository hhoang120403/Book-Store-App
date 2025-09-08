import jwt from 'jsonwebtoken';

const cookieOptions = {
  httpOnly: true, // Prevent client-side javascript from accessing the cookie
  secure: process.env.APP_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
  sameSite: process.env.APP_ENV === 'production' ? 'none' : 'strict', // Controls when cookies are sent 'none' allows cross-site in production, 'strict' block cross-site by default
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.cookie('adminToken', token, {
        ...cookieOptions,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Admin login successfully',
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid Credentials',
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const isAdminAuth = async (req, res) => {
  try {
    return res.json({ success: true, message: 'Admin authorized' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('adminToken', cookieOptions);
    return res.status(200).json({ success: true, message: 'Admin Logged Out' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
