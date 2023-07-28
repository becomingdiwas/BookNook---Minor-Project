require('dotenv').config();

module.exports = {
  db: {
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
};
