const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'KAMERO_RESEARCH_DB',
    password: '27dd19ac.',
    port: 5432,
});

module.exports = pool;
