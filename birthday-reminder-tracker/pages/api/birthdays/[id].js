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

    const { id } = req.query
    const userId = decoded.userId

    if (req.method === 'GET') {
      // Get a specific birthday
      const birthday = await Birthday.findOne({ 
        _id: id, 
        userId,
        isActive: true 
      }).lean()

      if (!birthday) {
        return res.status(404).json({ message: 'Birthday not found' })
      }

      // Calculate virtual fields
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

      const birthdayWithVirtuals = {
        ...birthday,
        age,
        nextBirthday,
        daysUntilBirthday
      }

      res.status(200).json({ birthday: birthdayWithVirtuals })

    } else if (req.method === 'PUT') {
      // Update a birthday
      const { name, dateOfBirth, relationship, email, phone, notes, giftIdeas, reminderSettings } = req.body

      const birthday = await Birthday.findOne({ 
        _id: id, 
        userId,
        isActive: true 
      })

      if (!birthday) {
        return res.status(404).json({ message: 'Birthday not found' })
      }

      // Update fields
      if (name) birthday.name = name
      if (dateOfBirth) birthday.dateOfBirth = new Date(dateOfBirth)
      if (relationship) birthday.relationship = relationship
      if (email !== undefined) birthday.email = email
      if (phone !== undefined) birthday.phone = phone
      if (notes !== undefined) birthday.notes = notes
      if (giftIdeas !== undefined) birthday.giftIdeas = giftIdeas
      if (reminderSettings !== undefined) birthday.reminderSettings = reminderSettings

      await birthday.save()

      res.status(200).json({
        message: 'Birthday updated successfully',
        birthday
      })

    } else if (req.method === 'DELETE') {
      // Soft delete a birthday
      const birthday = await Birthday.findOne({ 
        _id: id, 
        userId,
        isActive: true 
      })

      if (!birthday) {
        return res.status(404).json({ message: 'Birthday not found' })
      }

      birthday.isActive = false
      await birthday.save()

      res.status(200).json({ message: 'Birthday deleted successfully' })

    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Birthday API error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}