import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PARTNER_ID = process.env.AISENSY_PARTNER_ID;
const API_KEY = process.env.AISENSY_API_KEY;
const BASE_URL = process.env.AISENSY_BASE_URL;
const ASSISTANT_ID = process.env.AISENSY_ASSISTANT_ID;

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-AiSensy-Partner-API-Key': API_KEY,
};

async function testAiSensyFlow() {
  console.log('🧪 Testing AiSensy Integration Flow\n');
  console.log('Configuration:');
  console.log('- Partner ID:', PARTNER_ID);
  console.log('- Base URL:', BASE_URL);
  console.log('- Assistant ID:', ASSISTANT_ID);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    // Step 1: Create a test business
    console.log('📝 Step 1: Creating test business...');
    const businessData = {
      display_name: 'Test Business ' + Date.now(),
      email: `test${Date.now()}@example.com`,
      company: 'Test Company',
      contact: '+919999999999',
      timezone: 'Asia/Calcutta GMT+05:30',
      currency: 'INR',
      companySize: '10 - 20',
      password: 'Temp@123',
    };

    const businessRes = await axios.post(
      `${BASE_URL}/partner-apis/v1/partner/${PARTNER_ID}/business`,
      businessData,
      { headers }
    );

    const businessId = businessRes.data.business_id || businessRes.data.id;
    console.log('✅ Business created:', businessId);
    console.log('   Response:', JSON.stringify(businessRes.data, null, 2));
    console.log('\n' + '-'.repeat(60) + '\n');

    // Step 2: Create a project
    console.log('📁 Step 2: Creating project...');
    const projectRes = await axios.post(
      `${BASE_URL}/partner-apis/v1/partner/${PARTNER_ID}/business/${businessId}/project`,
      { name: 'Test Project ' + Date.now() },
      { headers }
    );

    const projectId = projectRes.data.project_id || projectRes.data.id;
    console.log('✅ Project created:', projectId);
    console.log('   Response:', JSON.stringify(projectRes.data, null, 2));
    console.log('\n' + '-'.repeat(60) + '\n');

    // Step 3: Verify business status
    console.log('🔍 Step 3: Checking business status...');
    const businessCheckRes = await axios.get(
      `${BASE_URL}/partner-apis/v1/partner/${PARTNER_ID}/business/${businessId}`,
      { headers }
    );

    console.log('📊 Business Status:');
    console.log('   Active:', businessCheckRes.data.active);
    console.log('   Email:', businessCheckRes.data.email);
    console.log('   Project IDs:', businessCheckRes.data.project_ids);
    console.log('   Full Response:', JSON.stringify(businessCheckRes.data, null, 2));
    console.log('\n' + '-'.repeat(60) + '\n');

    // Step 4: Generate WABA link
    console.log('🔗 Step 4: Generating WABA link...');
    const wabaLinkRes = await axios.post(
      `${BASE_URL}/partner-apis/v1/partner/${PARTNER_ID}/generate-waba-link`,
      {
        businessId,
        projectId,
        assistantId: ASSISTANT_ID,
        setup: {
          business: {
            name: businessData.display_name,
            email: businessData.email,
            phone: {
              code: 91,
              number: '9999999999',
            },
            website: 'https://test-business.com',
            address: {
              streetAddress1: 'Test Address',
              city: 'Mumbai',
              state: 'Maharashtra',
              zipPostal: '400001',
              country: 'IN',
            },
            timezone: 'UTC+05:30',
          },
          phone: {
            displayName: businessData.display_name,
            category: 'OTHER',
            description: '',
          },
        },
      },
      { headers }
    );

    console.log('✅ WABA Link generated successfully!');
    console.log('   URL:', wabaLinkRes.data.embeddedSignupURL);
    console.log('\n' + '='.repeat(60) + '\n');

    console.log('🎯 Summary:');
    console.log('   Business ID:', businessId);
    console.log('   Project ID:', projectId);
    console.log('   Business Active:', businessCheckRes.data.active);
    console.log('   WABA Link:', wabaLinkRes.data.embeddedSignupURL);
    console.log('\n📋 Next Step: Open the WABA link in a browser and check if it shows the same error.');
    console.log('   If it does, this confirms the issue is with AiSensy\'s platform, not our code.');

  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error('   Message:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAiSensyFlow();
