import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Generate the JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Set expiration time
  });

  // Set the JWT token as an HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Optionally, you can also send the token in the response body
 
};

export default generateToken;
