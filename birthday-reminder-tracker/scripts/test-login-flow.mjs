// Test the complete login flow
import fetch from 'node-fetch'

async function testLoginFlow() {
  try {
    console.log('Testing complete login flow...')
    
    // Test admin login
    console.log('\n--- Testing Admin Login API ---')
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@admin.com',
        password: 'admin123'
      }),
    })

    if (!loginResponse.ok) {
      console.log('❌ Login failed with status:', loginResponse.status)
      const errorText = await loginResponse.text()
      console.log('Error response:', errorText)
      return
    }

    const loginData = await loginResponse.json()
    console.log('✅ Login successful!')
    console.log('User data:', {
      name: loginData.user.name,
      email: loginData.user.email,
      role: loginData.user.role
    })

    const token = loginData.token
    console.log('✅ JWT token received')

    // Test authenticated API call
    console.log('\n--- Testing Authenticated API Call ---')
    const birthdaysResponse = await fetch('http://localhost:3001/api/birthdays?limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!birthdaysResponse.ok) {
      console.log('❌ Birthdays API failed with status:', birthdaysResponse.status)
      const errorText = await birthdaysResponse.text()
      console.log('Error response:', errorText)
      return
    }

    const birthdaysData = await birthdaysResponse.json()
    console.log('✅ Birthdays API call successful!')
    console.log('Birthdays found:', birthdaysData.birthdays.length)

    // Test creating a birthday
    console.log('\n--- Testing Create Birthday API ---')
    const createResponse = await fetch('http://localhost:3001/api/birthdays/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User',
        dateOfBirth: '1990-05-15',
        relationship: 'friend',
        email: 'test@example.com',
        notes: 'Test birthday entry'
      })
    })

    if (!createResponse.ok) {
      console.log('❌ Create birthday failed with status:', createResponse.status)
      const errorText = await createResponse.text()
      console.log('Error response:', errorText)
      return
    }

    const createData = await createResponse.json()
    console.log('✅ Birthday created successfully!')
    console.log('Created birthday:', {
      name: createData.birthday.name,
      age: createData.birthday.age,
      daysUntilBirthday: createData.birthday.daysUntilBirthday
    })

    console.log('\n--- Test Summary ---')
    console.log('✅ Admin login: OK')
    console.log('✅ JWT token: OK')
    console.log('✅ Authenticated API calls: OK')
    console.log('✅ Create birthday: OK')
    console.log('\n🎉 All tests passed! The API is working correctly.')
    console.log('\nTo use the application:')
    console.log('1. Go to http://localhost:3001/login')
    console.log('2. Login with: admin@admin.com / admin123')
    console.log('3. You should be redirected to the dashboard')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\nMake sure the Next.js development server is running:')
    console.log('npm run dev')
  }
}

testLoginFlow()