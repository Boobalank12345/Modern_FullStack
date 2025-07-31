import bcrypt from 'bcryptjs'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import { verifyToken } from '../../../utils/auth'

export default async function handler(req, res) {
  try {
    await dbConnect()

    // Verify authentication
    const decoded = verifyToken(req)
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userId = decoded.userId

    if (req.method === 'GET') {
      // Get user profile
      const user = await User.findById(userId).select('-password').lean()
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({ user })

    } else if (req.method === 'PUT') {
      // Update user profile
      const { 
        name, 
        email, 
        phone, 
        dateOfBirth, 
        profilePicture, 
        preferences,
        currentPassword,
        newPassword 
      } = req.body

      const user = await User.findById(userId)
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // If updating password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to set new password' })
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ message: 'Current password is incorrect' })
        }

        // Validate new password
        if (newPassword.length < 6) {
          return res.status(400).json({ message: 'New password must be at least 6 characters' })
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 12)
      }

      // Update other fields
      if (name) user.name = name.trim()
      if (email) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ 
          email: email.toLowerCase(), 
          _id: { $ne: userId } 
        })
        if (existingUser) {
          return res.status(409).json({ message: 'Email is already taken' })
        }
        user.email = email.toLowerCase().trim()
      }
      if (phone !== undefined) user.phone = phone ? phone.trim() : undefined
      if (dateOfBirth !== undefined) {
        user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined
      }
      if (profilePicture !== undefined) user.profilePicture = profilePicture
      if (preferences) {
        user.preferences = {
          ...user.preferences,
          ...preferences
        }
      }

      await user.save()

      // Return updated user data (without password)
      const updatedUser = await User.findById(userId).select('-password').lean()

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
      })

    } else if (req.method === 'DELETE') {
      // Delete user account (soft delete by deactivating)
      const user = await User.findById(userId)
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Instead of deleting, we could deactivate the account
      // For now, we'll actually delete the user and their birthdays
      await User.findByIdAndDelete(userId)
      
      // Also delete all birthdays associated with this user
      const Birthday = require('../../../models/Birthday').default
      await Birthday.deleteMany({ userId })

      res.status(200).json({ message: 'Account deleted successfully' })

    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Profile API error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      })
    }

    res.status(500).json({ message: 'Internal server error' })
  }
}