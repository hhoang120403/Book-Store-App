import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    next();
  } catch (error) {
    let msg = 'Invalid token';
    if (error.name === 'TokenExpiredError') msg = 'Token expired';
    return res.status(401).json({ success: false, message: msg });
  }
};

export default userAuth;
