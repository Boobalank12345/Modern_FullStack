const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testLogin() {
  try {
    console.log('Testing admin login...')
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@admin.com',
        password: 'admin123'
      }),
    })

    const data = await response.json()
    
    console.log('Response status:', response.status)
    console.log('Response data:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ Login successful!')
      console.log('Token received:', data.token ? 'Yes' : 'No')
      console.log('User data:', data.user)
    } else {
      console.log('❌ Login failed!')
      console.log('Error message:', data.message)
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 The server might not be running. Please start it with:')
      console.log('npm run dev')
    }
  }
}

testLogin()