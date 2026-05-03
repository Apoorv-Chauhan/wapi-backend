/**
 * Fix AISensy Business ID for a Single User
 * 
 * Usage:
 *   node scripts/fix-single-user-business-id.js <email>
 * 
 * Example:
 *   node scripts/fix-single-user-business-id.js info@harshaweb.com
 */

import 'dotenv/config';
import { connectDB, User } from '../models/index.js';
import { createBusiness } from '../services/aisensy/aisensy.service.js';

const fixSingleUser = async (email) => {
  try {
    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: node scripts/fix-single-user-business-id.js <email>');
      process.exit(1);
    }

    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database\n');

    // Find the user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      deleted_at: null
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log('📋 User Details:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Phone: ${user.country_code}${user.phone}`);
    console.log(`   Current Business ID: ${user.aisensy_business_id || 'NOT SET'}\n`);

    if (user.aisensy_business_id) {
      console.log('⚠️ User already has an AISensy business ID');
      console.log('Do you want to create a new one? (This will replace the existing ID)');
      console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log('🔄 Creating AISensy business...');

    const aisensyBusiness = await createBusiness({
      display_name: user.name,
      email: user.email,
      company: user.company || user.name,
      contact: user.country_code && user.phone 
        ? `${user.country_code}${user.phone}` 
        : '+911234567890'
    });

    console.log('📦 AISensy API Response:', JSON.stringify(aisensyBusiness, null, 2));

    if (aisensyBusiness?.businessId || aisensyBusiness?.business_id) {
      const businessId = aisensyBusiness.businessId || aisensyBusiness.business_id;
      
      await User.findByIdAndUpdate(user._id, {
        aisensy_business_id: businessId
      });

      console.log('\n✅ SUCCESS!');
      console.log(`   User: ${user.email}`);
      console.log(`   Business ID: ${businessId}`);
      console.log('\nThe user can now create workspaces with AISensy projects.');
      
    } else {
      console.error('\n❌ FAILED!');
      console.error('Unexpected API response. Business ID not found in response.');
      console.error('Response:', aisensyBusiness);
      process.exit(1);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response?.data) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];
fixSingleUser(email);
