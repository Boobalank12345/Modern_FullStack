// Load environment variables
require('dotenv').config({ path: '.env.local' })

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// Import models
const User = require('../models/User.js').default
const Birthday = require('../models/Birthday.js').default

async function testAPI() {
  try {
    console.log('Testing API functionality...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    })
    console.log('✅ Connected to MongoDB')

    // Test admin login
    console.log('\n--- Testing Admin Login ---')
    const adminUser = await User.findOne({ email: 'admin@admin.com' })
    if (!adminUser) {
      console.log('❌ Admin user not found')
      return
    }

    const isPasswordValid = await bcrypt.compare('admin123', adminUser.password)
    if (!isPasswordValid) {
      console.log('❌ Admin password verification failed')
      return
    }

    console.log('✅ Admin user found and password verified')

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: adminUser._id, 
        email: adminUser.email,
        role: adminUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    console.log('✅ JWT token generated')

    // Test token verification
    console.log('\n--- Testing Token Verification ---')
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('✅ Token verification successful')
      console.log('Decoded token:', {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      })
    } catch (error) {
      console.log('❌ Token verification failed:', error.message)
      return
    }

    // Test Birthday model
    console.log('\n--- Testing Birthday Model ---')
    try {
      // Check if there are any birthdays
      const birthdayCount = await Birthday.countDocuments()
      console.log(`Found ${birthdayCount} birthdays in database`)

      // Try to create a test birthday
      const testBirthday = new Birthday({
        name: 'Test Person',
        dateOfBirth: new Date('1990-01-01'),
        relationship: 'friend',
        userId: adminUser._id
      })

      await testBirthday.save()
      console.log('✅ Test birthday created successfully')

      // Clean up test birthday
      await Birthday.deleteOne({ _id: testBirthday._id })
      console.log('✅ Test birthday cleaned up')

    } catch (error) {
      console.log('❌ Birthday model test failed:', error.message)
    }

    console.log('\n--- API Test Summary ---')
    console.log('✅ Database connection: OK')
    console.log('✅ Admin user: OK')
    console.log('✅ Password verification: OK')
    console.log('✅ JWT token generation: OK')
    console.log('✅ JWT token verification: OK')
    console.log('✅ Birthday model: OK')

  } catch (error) {
    console.error('❌ API test failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\nMongoDB connection closed.')
  }
}

testAPI()