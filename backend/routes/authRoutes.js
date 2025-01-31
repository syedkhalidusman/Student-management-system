import express from'express'
import bcrypt from'bcryptjs'
import jwt from'jsonwebtoken'
import User from'../models/User.js'
import authenticateToken from'../middleware/authenticateToken.js'; // Import the middleware

const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user and save to DB
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign In Route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get the current user data (protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ username: user.name }); // Send back the user's name
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

export default router;
