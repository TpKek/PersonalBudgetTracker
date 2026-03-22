import jwt from 'jsonwebtoken'

const authenticate = (req,res,next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token)
  return res.status(401).json({ success: false, error: 'No token provided' });

  try {
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  req.user = decoded;
  next();
} catch {
  res.status(401).json({ success: false, error: 'Invalid or expired token' });
}
}

export default authenticate
