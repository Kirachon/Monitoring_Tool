/**
 * Test script for certificate request endpoints
 * Run with: node test-certificate-endpoint.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('='.repeat(60));
  console.log('Testing Certificate Request Endpoints');
  console.log('='.repeat(60));

  try {
    // Step 1: Login as employee
    console.log('\n1. Logging in as employee...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'employee',
      password: 'Employee123!'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.data.token;
    console.log('✓ Login successful');
    console.log(`  Token: ${token.substring(0, 20)}...`);

    // Step 2: Test GET /api/certificates/my-requests
    console.log('\n2. Testing GET /api/certificates/my-requests...');
    try {
      const getResponse = await axios.get(`${BASE_URL}/api/certificates/my-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✓ GET /api/certificates/my-requests successful');
      console.log(`  Status: ${getResponse.status}`);
      console.log(`  Requests found: ${getResponse.data.data?.length || 0}`);
      if (getResponse.data.data?.length > 0) {
        console.log(`  Sample request:`, JSON.stringify(getResponse.data.data[0], null, 2));
      }
    } catch (error) {
      console.log('✗ GET /api/certificates/my-requests failed');
      console.log(`  Status: ${error.response?.status || 'N/A'}`);
      console.log(`  Error: ${error.response?.data?.error?.message || error.message}`);
      throw error;
    }

    // Step 3: Test POST /api/certificates/request
    console.log('\n3. Testing POST /api/certificates/request...');
    try {
      const postResponse = await axios.post(`${BASE_URL}/api/certificates/request`, {
        certificateType: 'Certificate of Employment',
        purpose: 'Bank Loan Application',
        additionalDetails: 'Test request from automated script'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✓ POST /api/certificates/request successful');
      console.log(`  Status: ${postResponse.status}`);
      console.log(`  Request ID: ${postResponse.data.data?.id}`);
      console.log(`  Certificate Type: ${postResponse.data.data?.certificateType}`);
      console.log(`  Status: ${postResponse.data.data?.status}`);
    } catch (error) {
      console.log('✗ POST /api/certificates/request failed');
      console.log(`  Status: ${error.response?.status || 'N/A'}`);
      console.log(`  Error: ${error.response?.data?.error?.message || error.message}`);
      throw error;
    }

    // Step 4: Verify the request was created
    console.log('\n4. Verifying request was created...');
    const verifyResponse = await axios.get(`${BASE_URL}/api/certificates/my-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✓ Verification successful');
    console.log(`  Total requests: ${verifyResponse.data.data?.length || 0}`);

    console.log('\n' + '='.repeat(60));
    console.log('✓ All tests passed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('✗ Tests failed!');
    console.log('='.repeat(60));
    console.error('\nError details:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run tests
testEndpoints();

