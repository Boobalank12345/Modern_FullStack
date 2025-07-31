import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle user login
    try {
      await dbConnect()

      const { email, password } = req.body

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      // Find user by email (only regular users, not admins)
      const user = await User.findOne({ 
        email: email.toLowerCase(),
        role: 'user'
      })
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid user credentials' })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid user credentials' })
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
        message: 'User login successful',
        token,
        user: userData,
      })

    } catch (error) {
      console.error('User login error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    // Handle user registration
    try {
      await dbConnect()

      const { name, email, password, dateOfBirth, phone } = req.body

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' })
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists with this email' })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create new user
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        phone,
      })

      await newUser.save()

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser._id, 
          email: newUser.email,
          role: newUser.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Return user data (without password) and token
      const userData = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
        preferences: newUser.preferences,
      }

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userData,
      })

    } catch (error) {
      console.error('User registration error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}