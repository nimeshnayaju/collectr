const express = require('express');
const app = express();
const config = require('./config');

// Set up Mongoose connection
require('./db/mongoose');

// Routes
const indexRoute = require('./routes/index');
const collectionRoutes = require('./routes/collection');

app.use(express.json()); // Parse application/json (recognize the incoming request object as a JSON object)

// App route configuration
app.use('/', indexRoute); // Index Route
app.use('/collections', collectionRoutes); // Collection Routes

app.listen(config.PORT, () => console.log(`Listening on port: ${config.PORT}`));

module.exports = app;