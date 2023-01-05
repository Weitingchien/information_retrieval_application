require('dotenv').config();
const path = require('path');
const express = require('express');
const client = require('./elasticsearch/connection');

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`Server Started On ${PORT}`));

module.exports = app;
