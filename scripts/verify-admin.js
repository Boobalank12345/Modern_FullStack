const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')

// MongoDB connection URI from environment
const MONGODB_URI = 'mongodb://localhost:27017/birthday-reminder-tracker'

async function verifyAdminUser() {
  let client

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('Connected to MongoDB successfully!')

    const db = client.db()
    const usersCollection = db.collection('users')

    // Find admin user
    const adminUser = await usersCollection.findOne({ 
      email: 'admin@admin.com',
      role: 'admin'
    })

    if (!adminUser) {
      console.log('❌ Admin user not found!')
      return
    }

    console.log('✅ Admin user found!')
    console.log('Admin user details:')
    console.log('- ID:', adminUser._id.toString())
    console.log('- Name:', adminUser.name)
    console.log('- Email:', adminUser.email)
    console.log('- Role:', adminUser.role)
    console.log('- Created:', adminUser.createdAt)

    // Test password verification
    console.log('\nTesting password verification...')
    const isPasswordValid = await bcrypt.compare('admin123', adminUser.password)
    
    if (isPasswordValid) {
      console.log('✅ Password verification successful!')
      console.log('The admin user can login with:')
      console.log('- Email: admin@admin.com')
      console.log('- Password: admin123')
    } else {
      console.log('❌ Password verification failed!')
    }

    // Count total users
    const totalUsers = await usersCollection.countDocuments()
    const totalAdmins = await usersCollection.countDocuments({ role: 'admin' })
    
    console.log('\nDatabase statistics:')
    console.log('- Total users:', totalUsers)
    console.log('- Total admins:', totalAdmins)

  } catch (error) {
    console.error('❌ Error verifying admin user:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('\nMongoDB connection closed.')
    }
  }
}

// Run the script
if (require.main === module) {
  verifyAdminUser()
    .then(() => {
      console.log('Verification completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Verification failed:', error)
      process.exit(1)
    })
}

module.exports = { verifyAdminUser }