const User = require('../models/userModel'); // Adjust the path as necessary
const { generateToken } = require('../middleware/authMiddleware'); // Adjust the path as necessary

// Signup Controller
const signup = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;
  if(!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword){
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const user = await User.create({ firstName, lastName, email, phoneNumber, password, confirmPassword });
    const token = generateToken(user._id);
    res.status(201).json({user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email ||!password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login };
