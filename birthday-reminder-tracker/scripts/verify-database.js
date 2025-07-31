// Load environment variables
require('dotenv').config({ path: '.env.local' })

const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')

// MongoDB connection URI from environment
const MONGODB_URI = process.env.MONGODB_URI

async function verifyDatabase() {
  let client

  try {
    console.log('🔍 Verifying Birthday Reminder Tracker Database...')
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB successfully!')

    const db = client.db()
    const usersCollection = db.collection('users')
    const birthdaysCollection = db.collection('birthdays')

    // ==========================================
    // VERIFY ADMIN USER
    // ==========================================
    console.log('\n👤 Admin User Verification:')
    
    const adminUser = await usersCollection.findOne({ 
      email: 'admin@admin.com',
      role: 'admin'
    })

    if (!adminUser) {
      console.log('❌ Admin user not found!')
      return
    }

    console.log('✅ Admin user found!')
    console.log('   ID:', adminUser._id.toString())
    console.log('   Name:', adminUser.name)
    console.log('   Email:', adminUser.email)
    console.log('   Role:', adminUser.role)
    console.log('   Created:', adminUser.createdAt)

    // Test password verification
    const isPasswordValid = await bcrypt.compare('admin123', adminUser.password)
    if (isPasswordValid) {
      console.log('✅ Password verification: PASSED')
    } else {
      console.log('❌ Password verification: FAILED')
    }

    // ==========================================
    // VERIFY BIRTHDAY DATA
    // ==========================================
    console.log('\n🎂 Birthday Data Verification:')
    
    const birthdays = await birthdaysCollection.find({ 
      userId: adminUser._id 
    }).sort({ dateOfBirth: 1 }).toArray()

    console.log(`📊 Total birthdays for admin: ${birthdays.length}`)

    if (birthdays.length > 0) {
      console.log('\n🎉 Birthday Records:')
      birthdays.forEach((birthday, index) => {
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
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        console.log(`   ${index + 1}. ${birthday.name}`)
        console.log(`      📅 DOB: ${birthDate.toDateString()}`)
        console.log(`      🎂 Age: ${age} years old`)
        console.log(`      👥 Relationship: ${birthday.relationship}`)
        console.log(`      📧 Email: ${birthday.email || 'Not provided'}`)
        console.log(`      📱 Phone: ${birthday.phone || 'Not provided'}`)
        console.log(`      📝 Notes: ${birthday.notes || 'No notes'}`)
        console.log(`      🎁 Gift Ideas: ${birthday.giftIdeas.length > 0 ? birthday.giftIdeas.join(', ') : 'None'}`)
        console.log(`      ⏰ Days until birthday: ${daysUntil}`)
        console.log(`      🔔 Reminder: ${birthday.reminderSettings.daysBefore} days before`)
        console.log(`      ✅ Active: ${birthday.isActive}`)
        console.log('')
      })

      // Show upcoming birthdays (next 30 days)
      const upcomingBirthdays = birthdays.filter(birthday => {
        const today = new Date()
        const birthDate = new Date(birthday.dateOfBirth)
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1)
        }
        const diffTime = nextBirthday - today
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return daysUntil <= 30
      }).sort((a, b) => {
        const today = new Date()
        const aDate = new Date(a.dateOfBirth)
        const bDate = new Date(b.dateOfBirth)
        const aNext = new Date(today.getFullYear(), aDate.getMonth(), aDate.getDate())
        const bNext = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate())
        if (aNext < today) aNext.setFullYear(today.getFullYear() + 1)
        if (bNext < today) bNext.setFullYear(today.getFullYear() + 1)
        return aNext - bNext
      })

      if (upcomingBirthdays.length > 0) {
        console.log('🔔 Upcoming Birthdays (Next 30 Days):')
        upcomingBirthdays.forEach(birthday => {
          const today = new Date()
          const birthDate = new Date(birthday.dateOfBirth)
          const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1)
          }
          const diffTime = nextBirthday - today
          const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          console.log(`   🎂 ${birthday.name} - ${daysUntil} days (${nextBirthday.toDateString()})`)
        })
      } else {
        console.log('📅 No upcoming birthdays in the next 30 days')
      }
    }

    // ==========================================
    // DATABASE STATISTICS
    // ==========================================
    console.log('\n📊 Database Statistics:')
    const totalUsers = await usersCollection.countDocuments()
    const totalAdmins = await usersCollection.countDocuments({ role: 'admin' })
    const totalRegularUsers = await usersCollection.countDocuments({ role: 'user' })
    const totalBirthdays = await birthdaysCollection.countDocuments()
    const activeBirthdays = await birthdaysCollection.countDocuments({ isActive: true })

    console.log(`   👥 Total users: ${totalUsers}`)
    console.log(`   👑 Admin users: ${totalAdmins}`)
    console.log(`   👤 Regular users: ${totalRegularUsers}`)
    console.log(`   🎂 Total birthdays: ${totalBirthdays}`)
    console.log(`   ✅ Active birthdays: ${activeBirthdays}`)

    // ==========================================
    // RELATIONSHIP BREAKDOWN
    // ==========================================
    console.log('\n👥 Relationship Breakdown:')
    const relationshipStats = await birthdaysCollection.aggregate([
      { $match: { userId: adminUser._id, isActive: true } },
      { $group: { _id: '$relationship', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    relationshipStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`)
    })

    console.log('\n✅ Database verification completed!')
    console.log('\n📋 Ready to use:')
    console.log('   🌐 URL: http://localhost:3001/login')
    console.log('   📧 Email: admin@admin.com')
    console.log('   🔑 Password: admin123')

  } catch (error) {
    console.error('❌ Database verification failed:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('\n📡 MongoDB connection closed.')
    }
  }
}

// Run the verification
if (require.main === module) {
  verifyDatabase()
    .then(() => {
      console.log('✅ Verification script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Verification script failed:', error)
      process.exit(1)
    })
}

module.exports = { verifyDatabase }