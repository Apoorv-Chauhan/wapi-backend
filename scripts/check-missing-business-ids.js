/**
 * Check for Users Without Business IDs
 * 
 * This script checks for users who don't have aisensy_business_id
 * and reports them. Useful for monitoring and cron jobs.
 * 
 * Usage:
 *   node scripts/check-missing-business-ids.js
 * 
 * For cron job:
 *   0 * * * * cd /path/to/wapi-backend && node scripts/check-missing-business-ids.js >> /var/log/aisensy-check.log 2>&1
 */

import 'dotenv/config';
import { connectDB, User } from '../models/index.js';

const check = async () => {
  try {
    await connectDB();
    
    const usersWithoutBusinessId = await User.find({
      role: 'user',
      deleted_at: null,
      $or: [
        { aisensy_business_id: { $exists: false } },
        { aisensy_business_id: null },
        { aisensy_business_id: '' }
      ]
    }).select('_id email name createdAt').lean();
    
    const count = usersWithoutBusinessId.length;
    const timestamp = new Date().toISOString();
    
    if (count > 0) {
      console.log(`⚠️ [${timestamp}] ${count} users without business IDs`);
      console.log('Users:');
      usersWithoutBusinessId.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (${user.name}) - Created: ${user.createdAt}`);
      });
      console.log('');
      console.log('Run sync script to fix:');
      console.log('  node scripts/sync-production-business-ids.js');
      process.exit(1); // Exit with error code for monitoring
    } else {
      console.log(`✅ [${timestamp}] All users have business IDs`);
      process.exit(0);
    }
  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Check failed:`, error.message);
    process.exit(1);
  }
};

check();
