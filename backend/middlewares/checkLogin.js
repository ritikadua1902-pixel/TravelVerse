const jwt = require("jsonwebtoken")

exports.createToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" })
}

exports.checkAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};