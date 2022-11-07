const {Client} = require('pg');

const client = new Client ({
     host: "csce-315-db.engr.tamu.edu",
     user: "csce315_970_somarouthu",
     port: 5432,
     password: "130008998",
     database: "csce315_970_16",
     ssl: {
         require: true,
         rejectUnauthorized: false
     }
     });

module.exports = client;
