// Load environment variables
require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...')
    console.log('MONGODB_URI:', process.env.MONGODB_URI)
    
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    })
    
    console.log('✅ MongoDB connected successfully!')
    
    // Test if we can access the collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('Available collections:', collections.map(c => c.name))
    
    // Test User model
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      role: String
    }))
    
    const adminUser = await User.findOne({ role: 'admin' })
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.name, adminUser.email)
    } else {
      console.log('❌ No admin user found')
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('MongoDB connection closed.')
  }
}

testConnection()