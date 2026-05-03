/**
 * Migration Script: Fix Missing AISensy Business IDs
 * 
 * This script creates AISensy businesses for users who don't have one.
 * Run this to fix existing users who were created before AISensy integration
 * or whose business creation failed during registration.
 * 
 * Usage:
 *   node scripts/fix-missing-aisensy-business-ids.js
 */

import 'dotenv/config';
import { connectDB, User } from '../models/index.js';
import { createBusiness } from '../services/aisensy/aisensy.service.js';

const fixMissingBusinessIds = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database\n');

    // Find users without aisensy_business_id
    const usersWithoutBusinessId = await User.find({
      aisensy_business_id: { $exists: false },
      deleted_at: null,
      role: 'user' // Only fix regular users, not agents or admins
    }).select('_id name email phone country_code company');

    console.log(`📊 Found ${usersWithoutBusinessId.length} users without AISensy business ID\n`);

    if (usersWithoutBusinessId.length === 0) {
      console.log('✅ All users already have AISensy business IDs');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (const user of usersWithoutBusinessId) {
      console.log(`\n🔄 Processing user: ${user.email} (${user._id})`);
      
      try {
        // Create AISensy business
        const aisensyBusiness = await createBusiness({
          display_name: user.name,
          email: user.email,
          company: user.company || user.name,
          contact: user.country_code && user.phone 
            ? `${user.country_code}${user.phone}` 
            : '+911234567890' // Fallback if phone is missing
        });

        // Update user with business ID
        if (aisensyBusiness?.businessId || aisensyBusiness?.business_id) {
          const businessId = aisensyBusiness.businessId || aisensyBusiness.business_id;
          
          await User.findByIdAndUpdate(user._id, {
            aisensy_business_id: businessId
          });

          console.log(`✅ Created business for ${user.email}: ${businessId}`);
          successCount++;
        } else {
          console.log(`⚠️ Unexpected response for ${user.email}:`, aisensyBusiness);
          failCount++;
          errors.push({
            userId: user._id,
            email: user.email,
            error: 'Unexpected API response',
            response: aisensyBusiness
          });
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Failed to create business for ${user.email}:`, error.message);
        failCount++;
        errors.push({
          userId: user._id,
          email: user.email,
          error: error.message,
          response: error.response?.data
        });
      }
    }

    console.log('\n================================================');
    console.log('Migration Summary');
    console.log('================================================');
    console.log(`Total users processed: ${usersWithoutBusinessId.length}`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach((err, index) => {
        console.log(`\n${index + 1}. ${err.email} (${err.userId})`);
        console.log(`   Error: ${err.error}`);
        if (err.response) {
          console.log(`   Response:`, JSON.stringify(err.response, null, 2));
        }
      });
    }

    console.log('\n✅ Migration completed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
fixMissingBusinessIds();
