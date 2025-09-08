import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  const token =
    req.cookies?.adminToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    let msg = 'Invalid token';
    if (error.name === 'TokenExpiredError') msg = 'Token expired';
    return res.status(401).json({ success: false, message: msg });
  }
};

export default adminAuth;
