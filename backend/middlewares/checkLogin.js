const jwt = require("jsonwebtoken")

exports.createToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" })
}

exports.checkAuth = (req, res, next) => {
  try {
    const cookieToken = req.cookies.token;
    const headerToken = req.headers.authorization?.split(' ')[1];
    const token = cookieToken || headerToken;

    console.log('--- Auth Debug ---');
    console.log('Origin:', req.headers.origin);
    console.log('Cookie Token:', cookieToken ? 'Present' : 'Missing');
    console.log('Header Token:', headerToken ? 'Present' : 'Missing');
    console.log('Auth Header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('Method:', req.method);
    console.log('URL:', req.url);

    if (!token) {
      console.log('Result: 401 - No token provided');
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};