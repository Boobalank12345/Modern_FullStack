import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (without password) and token
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      preferences: user.preferences,
    }

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData,
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}