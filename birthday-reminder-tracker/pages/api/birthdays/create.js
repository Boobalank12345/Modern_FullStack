import dbConnect from '../../../lib/mongodb'
import Birthday from '../../../models/Birthday'
import { verifyToken } from '../../../utils/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Verify authentication
    const decoded = verifyToken(req)
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userId = decoded.userId
    const { 
      name, 
      dateOfBirth, 
      relationship, 
      email, 
      phone, 
      notes, 
      giftIdeas, 
      reminderSettings 
    } = req.body

    // Validate required fields
    if (!name || !dateOfBirth) {
      return res.status(400).json({ message: 'Name and date of birth are required' })
    }

    // Validate date of birth
    const birthDate = new Date(dateOfBirth)
    if (isNaN(birthDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date of birth' })
    }

    // Check if birthday is not in the future
    const today = new Date()
    if (birthDate > today) {
      return res.status(400).json({ message: 'Date of birth cannot be in the future' })
    }

    // Check for duplicate birthday for the same user
    const existingBirthday = await Birthday.findOne({
      userId,
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      dateOfBirth: birthDate,
      isActive: true
    })

    if (existingBirthday) {
      return res.status(409).json({ 
        message: 'A birthday with this name and date already exists' 
      })
    }

    // Create new birthday
    const newBirthday = new Birthday({
      name: name.trim(),
      dateOfBirth: birthDate,
      relationship: relationship || 'friend',
      email: email ? email.toLowerCase().trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
      giftIdeas: giftIdeas || [],
      reminderSettings: {
        enabled: reminderSettings?.enabled !== undefined ? reminderSettings.enabled : true,
        daysBefore: reminderSettings?.daysBefore || 7
      },
      userId
    })

    await newBirthday.save()

    // Calculate virtual fields for response
    const today2 = new Date()
    let age = today2.getFullYear() - birthDate.getFullYear()
    const monthDiff = today2.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today2.getDate() < birthDate.getDate())) {
      age--
    }

    const nextBirthday = new Date(today2.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    if (nextBirthday < today2) {
      nextBirthday.setFullYear(today2.getFullYear() + 1)
    }

    const diffTime = nextBirthday - today2
    const daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const birthdayWithVirtuals = {
      ...newBirthday.toObject(),
      age,
      nextBirthday,
      daysUntilBirthday
    }

    res.status(201).json({
      message: 'Birthday created successfully',
      birthday: birthdayWithVirtuals
    })

  } catch (error) {
    console.error('Create birthday error:', error)
    
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