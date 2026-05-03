/**
 * Sync AISensy Business IDs from AISensy to Database
 * 
 * This script fetches existing businesses from AISensy and updates
 * the database with the correct business IDs for users.
 * 
 * Usage:
 *   node scripts/sync-aisensy-business-ids.js
 */

import 'dotenv/config';
import { connectDB, User } from '../models/index.js';
import { getAllBusinesses, getOrCreateBusiness } from '../services/aisensy/aisensy.service.js';

const syncBusinessIds = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database\n');

    // Find users without aisensy_business_id
    const usersWithoutBusinessId = await User.find({
      $or: [
        { aisensy_business_id: { $exists: false } },
        { aisensy_business_id: null },
        { aisensy_business_id: '' }
      ],
      deleted_at: null,
      role: 'user' // Only fix regular users
    }).select('_id name email phone country_code company');

    console.log(`📊 Found ${usersWithoutBusinessId.length} users without AISensy business ID\n`);

    if (usersWithoutBusinessId.length === 0) {
      console.log('✅ All users already have AISensy business IDs');
      process.exit(0);
    }

    // Fetch all businesses from AISensy
    console.log('🔄 Fetching all businesses from AISensy...');
    const businesses = await getAllBusinesses();
    console.log(`✅ Fetched ${businesses?.length || 0} businesses from AISensy\n`);

    // Create a map of email -> business for quick lookup
    const businessMap = new Map();
    if (businesses && Array.isArray(businesses)) {
      businesses.forEach(business => {
        const email = (business.email || business.user_name || '').toLowerCase().trim();
        if (email) {
          businessMap.set(email, business);
        }
      });
    }

    let successCount = 0;
    let failCount = 0;
    let existingCount = 0;
    let createdCount = 0;
    const errors = [];

    for (const user of usersWithoutBusinessId) {
      console.log(`\n🔄 Processing user: ${user.email} (${user._id})`);
      
      try {
        const normalizedEmail = user.email.toLowerCase().trim();
        
        // Check if business exists in our fetched list
        const existingBusiness = businessMap.get(normalizedEmail);
        
        let businessId;
        let isExisting = false;

        if (existingBusiness) {
          // Use existing business
          businessId = existingBusiness.business_id || existingBusiness.id;
          isExisting = true;
          console.log(`✅ Found existing business in AISensy: ${businessId}`);
          existingCount++;
        } else {
          // Create new business
          console.log(`📝 No existing business found, creating new one...`);
          const aisensyBusiness = await getOrCreateBusiness({
            display_name: user.name,
            email: user.email,
            company: user.company || user.name,
            contact: user.country_code && user.phone 
              ? `${user.country_code}${user.phone}` 
              : '+911234567890'
          });

          businessId = aisensyBusiness.businessId || aisensyBusiness.business_id;
          isExisting = aisensyBusiness.isExisting;
          
          if (isExisting) {
            existingCount++;
          } else {
            createdCount++;
          }
        }

        // Update user with business ID
        if (businessId) {
          await User.findByIdAndUpdate(user._id, {
            aisensy_business_id: businessId
          });

          console.log(`✅ ${isExisting ? 'Linked existing' : 'Created new'} business for ${user.email}: ${businessId}`);
          successCount++;
        } else {
          console.log(`⚠️ No business ID returned for ${user.email}`);
          failCount++;
          errors.push({
            userId: user._id,
            email: user.email,
            error: 'No business ID returned'
          });
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Failed to process ${user.email}:`, error.message);
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
    console.log('Sync Summary');
    console.log('================================================');
    console.log(`Total users processed: ${usersWithoutBusinessId.length}`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`   - Linked existing: ${existingCount}`);
    console.log(`   - Created new: ${createdCount}`);
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

    console.log('\n✅ Sync completed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
};

// Run the sync
syncBusinessIds();
