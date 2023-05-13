const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'kacang',
  host: 'localhost',
  database: 'hw9',
  password: 'kacang',
  dialect: 'postgres'
});

module.exports = pool;