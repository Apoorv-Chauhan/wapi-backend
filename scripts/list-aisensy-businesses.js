/**
 * List all AISensy businesses
 * Helps debug email matching issues
 */

import 'dotenv/config';
import { getAllBusinesses } from '../services/aisensy/aisensy.service.js';

const listBusinesses = async () => {
  try {
    console.log('🔄 Fetching all businesses from AISensy...\n');
    const businesses = await getAllBusinesses();
    
    console.log(`✅ Found ${businesses?.length || 0} businesses\n`);
    console.log('================================================');
    console.log('Business List');
    console.log('================================================\n');

    if (businesses && Array.isArray(businesses)) {
      businesses.forEach((business, index) => {
        console.log(`${index + 1}. ${business.display_name || 'N/A'}`);
        console.log(`   Business ID: ${business.business_id || business.id}`);
        console.log(`   Email: ${business.email || 'N/A'}`);
        console.log(`   Username: ${business.user_name || 'N/A'}`);
        console.log(`   Company: ${business.company || 'N/A'}`);
        console.log(`   Contact: ${business.contact || 'N/A'}`);
        console.log(`   Active: ${business.active}`);
        console.log(`   Projects: ${business.project_ids?.length || 0}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listBusinesses();
