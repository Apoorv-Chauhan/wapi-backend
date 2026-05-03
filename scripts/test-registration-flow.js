/**
 * Test Registration Flow
 * 
 * This script tests the complete registration flow including AISensy business creation
 * to help debug why business IDs aren't being saved in production.
 * 
 * Usage:
 *   node scripts/test-registration-flow.js
 */

import 'dotenv/config';
import { connectDB, User } from '../models/index.js';
import { getOrCreateBusiness } from '../services/aisensy/aisensy.service.js';
import bcrypt from 'bcryptjs';

const testRegistration = async () => {
  try {
    console.log('================================================');
    console.log('Registration Flow Test');
    console.log('================================================\n');

    // Check environment
    console.log('1. Checking environment configuration...');
    console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
    console.log('   AISENSY_BASE_URL:', process.env.AISENSY_BASE_URL || '❌ Not set');
    console.log('   AISENSY_API_KEY:', process.env.AISENSY_API_KEY ? '✅ Set' : '❌ Not set');
    console.log('   AISENSY_PARTNER_ID:', process.env.AISENSY_PARTNER_ID || '❌ Not set');
    console.log('');

    // Connect to database
    console.log('2. Connecting to database...');
    await connectDB();
    const dbName = process.env.MONGODB_URI?.split('/').pop().split('?')[0] || 'unknown';
    console.log(`   ✅ Connected to database: ${dbName}\n`);

    // Create test user data
    const testEmail = `test-${Date.now()}@example.com`;
    const testData = {
      name: 'Test User Registration',
      email: testEmail,
      country_code: '+91',
      phone: '9999999999',
      company: 'Test Company',
      password: 'Test@123'
    };

    console.log('3. Creating test user...');
    console.log('   Email:', testData.email);
    console.log('   Name:', testData.name);
    console.log('');

    // Hash password
    const hashedPassword = await bcrypt.hash(testData.password, 10);

    // Create user
    const newUser = await User.create({
      name: testData.name,
      email: testData.email,
      country_code: testData.country_code,
      phone: testData.phone,
      company: testData.company,
      role: 'user',
      password: hashedPassword
    });

    console.log('   ✅ User created in database');
    console.log('   User ID:', newUser._id);
    console.log('   Business ID (before AISensy):', newUser.aisensy_business_id || 'null');
    console.log('');

    // Test AISensy business creation
    console.log('4. Creating/fetching AISensy business...');
    
    try {
      const aisensyBusiness = await getOrCreateBusiness({
        display_name: testData.name,
        email: testData.email,
        company: testData.company,
        contact: `${testData.country_code}${testData.phone}`
      });

      console.log('   ✅ AISensy API call successful');
      console.log('   Business ID:', aisensyBusiness.businessId || aisensyBusiness.business_id);
      console.log('   Is Existing:', aisensyBusiness.isExisting);
      console.log('');

      // Save business ID to user
      console.log('5. Saving business ID to user...');
      const businessId = aisensyBusiness.businessId || aisensyBusiness.business_id;
      
      if (businessId) {
        console.log('   Business ID to save:', businessId);
        
        // Method 1: Update existing document
        newUser.aisensy_business_id = businessId;
        const savedUser = await newUser.save();
        
        console.log('   ✅ User.save() completed');
        console.log('   Business ID after save:', savedUser.aisensy_business_id);
        console.log('');

        // Verify by fetching from database
        console.log('6. Verifying database update...');
        const verifyUser = await User.findById(newUser._id).select('email aisensy_business_id');
        
        console.log('   ✅ Fetched user from database');
        console.log('   Email:', verifyUser.email);
        console.log('   Business ID in DB:', verifyUser.aisensy_business_id);
        console.log('   Match:', verifyUser.aisensy_business_id === businessId ? '✅ YES' : '❌ NO');
        console.log('');

        if (verifyUser.aisensy_business_id === businessId) {
          console.log('✅ SUCCESS! Business ID saved correctly\n');
        } else {
          console.log('❌ FAILED! Business ID not saved correctly\n');
          console.log('Expected:', businessId);
          console.log('Got:', verifyUser.aisensy_business_id);
          console.log('');
        }

        // Cleanup
        console.log('7. Cleaning up test user...');
        await User.findByIdAndDelete(newUser._id);
        console.log('   ✅ Test user deleted\n');

      } else {
        console.log('   ❌ No business ID returned from AISensy');
        console.log('   Response:', aisensyBusiness);
        console.log('');
      }

    } catch (aisensyError) {
      console.error('   ❌ AISensy error:', aisensyError.message);
      console.error('   Response:', aisensyError.response?.data);
      console.error('   Status:', aisensyError.response?.status);
      console.log('');

      // Cleanup even on error
      console.log('7. Cleaning up test user...');
      await User.findByIdAndDelete(newUser._id);
      console.log('   ✅ Test user deleted\n');
    }

    console.log('================================================');
    console.log('Test Complete');
    console.log('================================================');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Run the test
testRegistration();
