const express = require('express');

const app = express();
const config = require('./config');

// Set up Mongoose connection
require('./db/mongoose');

// Routes
const indexRoute = require('./routes/index');
const catalogRoutes = require('./routes/catalog');
const itemRoutes = require('./routes/item');

app.use(express.json()); // Parse application/json (recognize the incoming request object as a JSON object)

// App route configuration
app.use('/', indexRoute); // Index Route
app.use('/catalogs', catalogRoutes); // Catalog Routes
app.use('/items', itemRoutes); // Item Routes

app.listen(config.PORT, () => console.log(`Listening on port: ${config.PORT}`));

module.exports = app;