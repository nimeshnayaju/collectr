const express = require('express');
const app = express();
const config = require('./config');

// Set up Mongoose connection
require('./db/mongoose');

// Routes
const indexRoute = require('./routes/index');

// App route configuration
app.use('/', indexRoute); // Index Route

app.listen(config.PORT, () => console.log(`Listening on port: ${config.PORT}`));