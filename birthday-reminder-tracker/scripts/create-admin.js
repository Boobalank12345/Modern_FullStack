const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')

// MongoDB connection URI from environment
const MONGODB_URI = 'mongodb://localhost:27017/birthday-reminder-tracker'

async function createAdminUser() {
  let client

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('Connected to MongoDB successfully!')

    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { email: 'admin@admin.com' },
        { role: 'admin' }
      ]
    })

    if (existingAdmin) {
      console.log('Admin user already exists!')
      console.log('Existing admin:', {
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role
      })
      return
    }

    // Hash the password
    console.log('Hashing password...')
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('admin123', saltRounds)

    // Create admin user object
    const adminUser = {
      name: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
      profilePicture: '',
      dateOfBirth: null,
      phone: '',
      preferences: {
        notifications: true,
        reminderDays: 7
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert admin user
    console.log('Creating admin user...')
    const result = await usersCollection.insertOne(adminUser)
    
    console.log('✅ Admin user created successfully!')
    console.log('Admin user details:')
    console.log('- Username: admin')
    console.log('- Email: admin@admin.com')
    console.log('- Password: admin123')
    console.log('- Role: admin')
    console.log('- User ID:', result.insertedId.toString())

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('MongoDB connection closed.')
    }
  }
}

// Run the script
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}

module.exports = { createAdminUser }