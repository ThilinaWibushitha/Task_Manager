const db = require('./db');

const createTables = async () => {
    try {
        console.log('Initializing Database...');

        // Users Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        emp_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        dept VARCHAR(50) DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Users table ready');

        // Tasks Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        emp_id VARCHAR(50) REFERENCES users(emp_id),
        name VARCHAR(100) NOT NULL,
        project VARCHAR(100) NOT NULL,
        date DATE DEFAULT CURRENT_DATE,
        deadline VARCHAR(50),
        assigned TEXT,
        completed TEXT,
        pending TEXT,
        time_spent VARCHAR(50),
        signature VARCHAR(100) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Tasks table ready');

        console.log('Database initialization complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error initializing database:', err);
        process.exit(1);
    }
};

createTables();
