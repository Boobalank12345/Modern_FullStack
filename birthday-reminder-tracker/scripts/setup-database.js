// Load environment variables
require('dotenv').config({ path: '.env.local' })

const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')

// MongoDB connection URI from environment
const MONGODB_URI = process.env.MONGODB_URI

async function setupDatabase() {
  let client

  try {
    console.log('🚀 Setting up Birthday Reminder Tracker Database...')
    console.log('📡 Connecting to MongoDB...')
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB successfully!')

    const db = client.db()
    const usersCollection = db.collection('users')
    const birthdaysCollection = db.collection('birthdays')

    // ==========================================
    // STEP 1: CREATE ADMIN USER
    // ==========================================
    console.log('\n👤 Setting up Admin User...')
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { email: 'admin@admin.com' },
        { role: 'admin' }
      ]
    })

    let adminUserId
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists!')
      console.log('   Name:', existingAdmin.name)
      console.log('   Email:', existingAdmin.email)
      console.log('   Role:', existingAdmin.role)
      adminUserId = existingAdmin._id
    } else {
      // Hash the password
      console.log('🔐 Hashing admin password...')
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
      console.log('💾 Creating admin user...')
      const result = await usersCollection.insertOne(adminUser)
      adminUserId = result.insertedId
      
      console.log('✅ Admin user created successfully!')
      console.log('   Username: admin')
      console.log('   Email: admin@admin.com')
      console.log('   Password: admin123')
      console.log('   Role: admin')
      console.log('   User ID:', adminUserId.toString())
    }

    // ==========================================
    // STEP 2: CREATE SAMPLE BIRTHDAY DATA
    // ==========================================
    console.log('\n🎂 Setting up Sample Birthday Data...')
    
    // Check if birthdays already exist for admin
    const existingBirthdays = await birthdaysCollection.countDocuments({ userId: adminUserId })
    
    if (existingBirthdays > 0) {
      console.log(`ℹ️  Found ${existingBirthdays} existing birthdays for admin user`)
    }

    // Sample birthday data
    const sampleBirthdays = [
      {
        name: 'John Smith',
        dateOfBirth: new Date('1990-03-15'),
        relationship: 'friend',
        email: 'john.smith@example.com',
        phone: '+1-555-0101',
        notes: 'Loves chocolate cake and video games',
        giftIdeas: ['Gaming headset', 'Chocolate cake', 'Gift card'],
        reminderSettings: {
          enabled: true,
          daysBefore: 7
        },
        userId: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sarah Johnson',
        dateOfBirth: new Date('1985-07-22'),
        relationship: 'family',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0102',
        notes: 'Sister - loves books and coffee',
        giftIdeas: ['Novel', 'Coffee beans', 'Bookmarks'],
        reminderSettings: {
          enabled: true,
          daysBefore: 14
        },
        userId: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mike Wilson',
        dateOfBirth: new Date('1992-12-08'),
        relationship: 'colleague',
        email: 'mike.wilson@company.com',
        phone: '+1-555-0103',
        notes: 'Work colleague - enjoys sports',
        giftIdeas: ['Sports equipment', 'Team jersey'],
        reminderSettings: {
          enabled: true,
          daysBefore: 3
        },
        userId: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Emma Davis',
        dateOfBirth: new Date('1988-05-30'),
        relationship: 'friend',
        email: 'emma.davis@example.com',
        phone: '+1-555-0104',
        notes: 'Best friend since college - loves art',
        giftIdeas: ['Art supplies', 'Museum tickets', 'Painting'],
        reminderSettings: {
          enabled: true,
          daysBefore: 10
        },
        userId: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Robert Brown',
        dateOfBirth: new Date('1975-11-12'),
        relationship: 'family',
        email: 'robert.brown@example.com',
        phone: '+1-555-0105',
        notes: 'Uncle - loves fishing and outdoors',
        giftIdeas: ['Fishing gear', 'Outdoor equipment'],
        reminderSettings: {
          enabled: true,
          daysBefore: 7
        },
        userId: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Insert sample birthdays
    console.log('💾 Adding sample birthday records...')
    for (let i = 0; i < sampleBirthdays.length; i++) {
      const birthday = sampleBirthdays[i]
      
      // Check if this birthday already exists
      const existingBirthday = await birthdaysCollection.findOne({
        userId: adminUserId,
        name: birthday.name,
        dateOfBirth: birthday.dateOfBirth
      })

      if (!existingBirthday) {
        const result = await birthdaysCollection.insertOne(birthday)
        console.log(`   ✅ Added: ${birthday.name} (${birthday.dateOfBirth.toDateString()}) - ID: ${result.insertedId}`)
      } else {
        console.log(`   ℹ️  Skipped: ${birthday.name} (already exists)`)
      }
    }

    // ==========================================
    // STEP 3: VERIFY SETUP
    // ==========================================
    console.log('\n🔍 Verifying Database Setup...')
    
    // Count records
    const totalUsers = await usersCollection.countDocuments()
    const totalAdmins = await usersCollection.countDocuments({ role: 'admin' })
    const totalBirthdays = await birthdaysCollection.countDocuments({ userId: adminUserId })
    
    console.log('📊 Database Statistics:')
    console.log(`   Total users: ${totalUsers}`)
    console.log(`   Total admins: ${totalAdmins}`)
    console.log(`   Total birthdays for admin: ${totalBirthdays}`)

    // Test password verification
    console.log('\n🔐 Testing Admin Login...')
    const adminUser = await usersCollection.findOne({ email: 'admin@admin.com' })
    const isPasswordValid = await bcrypt.compare('admin123', adminUser.password)
    
    if (isPasswordValid) {
      console.log('✅ Admin password verification successful!')
    } else {
      console.log('❌ Admin password verification failed!')
    }

    // Show upcoming birthdays
    console.log('\n🎂 Sample Birthday Data:')
    const birthdays = await birthdaysCollection.find({ userId: adminUserId }).toArray()
    birthdays.forEach(birthday => {
      const today = new Date()
      const birthDate = new Date(birthday.dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      console.log(`   🎉 ${birthday.name} - ${birthDate.toDateString()} (Age: ${age}) - ${birthday.relationship}`)
    })

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('   URL: http://localhost:3001/login')
    console.log('   Email: admin@admin.com')
    console.log('   Password: admin123')
    console.log('\n🚀 You can now start using the Birthday Reminder Tracker!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('\n📡 MongoDB connection closed.')
    }
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Setup script failed:', error)
      process.exit(1)
    })
}

module.exports = { setupDatabase }