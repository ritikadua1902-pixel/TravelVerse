
const bcrypt = require('bcrypt');
const Users = require("../models/users.js");
const { createToken } = require("../middlewares/checkLogin.js");

exports.getRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const checkExist = await Users.findOne({ email });
    if (checkExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      name,
      email,
      password: hashedPassword
    });

    
    const token = createToken({ id: user._id, email: user.email, role: user.role });

   
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
   return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });


  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

   
    const token = createToken({ id: user._id, email: user.email, role: user.role });

   
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};