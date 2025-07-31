import dbConnect from '../../../lib/mongodb'
import Birthday from '../../../models/Birthday'
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
      // Get all birthdays for the authenticated user
      const { page = 1, limit = 10, search = '', relationship = '', sortBy = 'nextBirthday' } = req.query

      const query = { 
        userId,
        isActive: true
      }

      // Add search filter
      if (search) {
        query.name = { $regex: search, $options: 'i' }
      }

      // Add relationship filter
      if (relationship && relationship !== 'all') {
        query.relationship = relationship
      }

      const skip = (parseInt(page) - 1) * parseInt(limit)

      let sortOptions = {}
      switch (sortBy) {
        case 'name':
          sortOptions = { name: 1 }
          break
        case 'dateOfBirth':
          sortOptions = { dateOfBirth: 1 }
          break
        case 'relationship':
          sortOptions = { relationship: 1, name: 1 }
          break
        default:
          // Sort by next birthday (upcoming first)
          sortOptions = { dateOfBirth: 1 }
      }

      const birthdays = await Birthday.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const total = await Birthday.countDocuments(query)

      // Calculate virtual fields for each birthday
      const birthdaysWithVirtuals = birthdays.map(birthday => {
        const today = new Date()
        const birthDate = new Date(birthday.dateOfBirth)
        
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }

        // Calculate next birthday
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1)
        }

        // Calculate days until birthday
        const diffTime = nextBirthday - today
        const daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
          ...birthday,
          age,
          nextBirthday,
          daysUntilBirthday
        }
      })

      res.status(200).json({
        birthdays: birthdaysWithVirtuals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      })

    } else if (req.method === 'POST') {
      // Create a new birthday
      const { name, dateOfBirth, relationship, email, phone, notes, giftIdeas, reminderSettings } = req.body

      // Validate required fields
      if (!name || !dateOfBirth) {
        return res.status(400).json({ message: 'Name and date of birth are required' })
      }

      const newBirthday = new Birthday({
        name,
        dateOfBirth: new Date(dateOfBirth),
        relationship: relationship || 'friend',
        email,
        phone,
        notes,
        giftIdeas: giftIdeas || [],
        reminderSettings: reminderSettings || { enabled: true, daysBefore: 7 },
        userId
      })

      await newBirthday.save()

      res.status(201).json({
        message: 'Birthday created successfully',
        birthday: newBirthday
      })

    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Birthdays API error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}