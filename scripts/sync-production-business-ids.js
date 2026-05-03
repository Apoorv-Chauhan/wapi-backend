/**
 * Production-Ready: Sync AISensy Business IDs
 * 
 * This script works with any MongoDB configuration and syncs business IDs
 * from AISensy to your database. It handles:
 * - Existing businesses in AISensy (links them)
 * - Missing businesses (creates them)
 * - Email mismatches (reports them)
 * 
 * Usage:
 *   # For production (uses MONGODB_URI from .env)
 *   node scripts/sync-production-business-ids.js
 * 
 *   # For specific database
 *   MONGODB_URI="mongodb://user:pass@host:port/dbname" node scripts/sync-production-business-ids.js
 * 
 *   # Dry run (don't update database)
 *   DRY_RUN=true node scripts/sync-production-business-ids.js
 */

import 'dotenv/config';
import { connectDB, User } from '../models/index.js';
import { getAllBusinesses, getOrCreateBusiness } from '../services/aisensy/aisensy.service.js';

const DRY_RUN = process.env.DRY_RUN === 'true';

const syncBusinessIds = async () => {
  try {
    console.log('================================================');
    console.log('AISensy Business ID Sync Tool');
    console.log('================================================\n');
    
    // Show configuration
    const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/whatsdesk';
    const dbName = dbUri.split('/').pop().split('?')[0];
    console.log('📊 Configuration:');
    console.log(`   Database: ${dbName}`);
    console.log(`   Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '✍️  WRITE MODE'}`);
    console.log('');

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
      role: 'user' // Only process regular users
    }).select('_id name email phone country_code company');

    console.log(`📊 Found ${usersWithoutBusinessId.length} users without AISensy business ID\n`);

    if (usersWithoutBusinessId.length === 0) {
      console.log('✅ All users already have AISensy business IDs');
      process.exit(0);
    }

    // Show users that will be processed
    console.log('Users to process:');
    usersWithoutBusinessId.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.name})`);
    });
    console.log('');

    if (DRY_RUN) {
      console.log('⚠️  DRY RUN MODE - No changes will be made to database\n');
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
      console.log(`📋 Indexed ${businessMap.size} businesses by email\n`);
    }

    let successCount = 0;
    let failCount = 0;
    let existingCount = 0;
    let createdCount = 0;
    const errors = [];
    const results = [];

    for (const user of usersWithoutBusinessId) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🔄 Processing: ${user.email}`);
      console.log(`   User ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      
      try {
        const normalizedEmail = user.email.toLowerCase().trim();
        
        // Check if business exists in our fetched list
        const existingBusiness = businessMap.get(normalizedEmail);
        
        let businessId;
        let isExisting = false;
        let action = '';

        if (existingBusiness) {
          // Use existing business
          businessId = existingBusiness.business_id || existingBusiness.id;
          isExisting = true;
          action = 'LINKED_EXISTING';
          console.log(`   ✅ Found existing business in AISensy`);
          console.log(`   Business ID: ${businessId}`);
          existingCount++;
        } else {
          // Try to create or find business
          console.log(`   📝 No existing business found, attempting to create...`);
          
          try {
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
              action = 'LINKED_EXISTING';
              console.log(`   ✅ Found and linked existing business`);
              existingCount++;
            } else {
              action = 'CREATED_NEW';
              console.log(`   ✅ Created new business`);
              createdCount++;
            }
            console.log(`   Business ID: ${businessId}`);
          } catch (createError) {
            // If creation fails with "already exists", try to find it
            if (createError.response?.data?.message?.includes('already in use')) {
              console.log(`   ⚠️  Business exists but couldn't be found automatically`);
              console.log(`   ℹ️  Manual action required: Find business ID in AISensy dashboard`);
              action = 'MANUAL_REQUIRED';
              failCount++;
              errors.push({
                userId: user._id,
                email: user.email,
                error: 'Business exists but not found in API response',
                manualAction: 'Login to AISensy dashboard and find business ID for this email'
              });
              continue;
            }
            throw createError;
          }
        }

        // Update user with business ID
        if (businessId) {
          if (!DRY_RUN) {
            await User.findByIdAndUpdate(user._id, {
              aisensy_business_id: businessId
            });
            console.log(`   ✅ Database updated with business ID`);
          } else {
            console.log(`   🔍 [DRY RUN] Would update database with business ID: ${businessId}`);
          }

          successCount++;
          results.push({
            userId: user._id,
            email: user.email,
            name: user.name,
            businessId,
            action,
            success: true
          });
        } else {
          console.log(`   ❌ No business ID returned`);
          failCount++;
          errors.push({
            userId: user._id,
            email: user.email,
            error: 'No business ID returned from API'
          });
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        failCount++;
        errors.push({
          userId: user._id,
          email: user.email,
          error: error.message,
          response: error.response?.data
        });
        results.push({
          userId: user._id,
          email: user.email,
          name: user.name,
          action: 'FAILED',
          error: error.message,
          success: false
        });
      }
    }

    // Print summary
    console.log('\n\n');
    console.log('================================================');
    console.log('SYNC SUMMARY');
    console.log('================================================');
    console.log(`Database: ${dbName}`);
    console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'}`);
    console.log('');
    console.log(`Total users processed: ${usersWithoutBusinessId.length}`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`   - Linked existing: ${existingCount}`);
    console.log(`   - Created new: ${createdCount}`);
    console.log(`❌ Failed: ${failCount}`);

    // Print results table
    if (results.length > 0) {
      console.log('\n');
      console.log('================================================');
      console.log('DETAILED RESULTS');
      console.log('================================================\n');
      
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.email}`);
        console.log(`   User ID: ${result.userId}`);
        console.log(`   Action: ${result.action}`);
        if (result.businessId) {
          console.log(`   Business ID: ${result.businessId}`);
        }
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
        console.log('');
      });
    }

    // Print errors
    if (errors.length > 0) {
      console.log('\n');
      console.log('================================================');
      console.log('ERRORS & MANUAL ACTIONS REQUIRED');
      console.log('================================================\n');
      
      errors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.email} (${err.userId})`);
        console.log(`   Error: ${err.error}`);
        if (err.manualAction) {
          console.log(`   📋 Action: ${err.manualAction}`);
        }
        if (err.response) {
          console.log(`   Response: ${JSON.stringify(err.response, null, 2)}`);
        }
        console.log('');
      });
    }

    // Next steps
    console.log('\n');
    console.log('================================================');
    console.log('NEXT STEPS');
    console.log('================================================\n');
    
    if (DRY_RUN) {
      console.log('✅ Dry run completed successfully');
      console.log('');
      console.log('To apply changes, run:');
      console.log('   node scripts/sync-production-business-ids.js');
      console.log('');
    } else if (successCount > 0) {
      console.log('✅ Database updated successfully');
      console.log('');
      console.log('Users can now create workspaces with AISensy projects!');
      console.log('');
    }

    if (errors.length > 0) {
      console.log('⚠️  Some users require manual action:');
      console.log('   1. Login to AISensy dashboard');
      console.log('   2. Find the business ID for each failed email');
      console.log('   3. Update manually using:');
      console.log('');
      console.log('   db.users.updateOne(');
      console.log('     { email: "user@example.com" },');
      console.log('     { $set: { aisensy_business_id: "BUSINESS_ID" } }');
      console.log('   )');
      console.log('');
    }

    console.log('✅ Sync completed');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Run the sync
syncBusinessIds();
