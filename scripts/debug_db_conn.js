const { pool } = require('../src/supabase');
console.log("DB Config details from Pool:");
console.log("Host:", pool.options.host);
console.log("Port:", pool.options.port);
console.log("User:", pool.options.user);
console.log("Database:", pool.options.database);

console.log("\nFull process.env:");
console.log(JSON.stringify(process.env, null, 2));

pool.end();
