/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import 'dotenv/config';
import { User } from './src/models/user.model.js';
import { Token } from './src/models/token.model.js';
import { client } from './src/utils/db.js';

async function syncDB() {
  try {
    const forceSync = process.env.DB_FORCE === 'true';

    await client.sync({ force: forceSync });

    console.log(`Database synced successfully (force: ${forceSync})`);
  } catch (error) {
    console.error('Failed to sync database:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

syncDB();
