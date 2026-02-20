const db = require('./db');

const addParentId = async () => {
    try {
        console.log('Adding parent_id column...');
        await db.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS parent_id INTEGER;`);
        console.log('✅ Column parent_id added successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error adding column:', err);
        process.exit(1);
    }
};

addParentId();
