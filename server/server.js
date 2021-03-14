const express = require('express');

const app = express();
const cors = require('cors');
const config = require('./config');

// Set up Mongoose connection
require('./db/mongoose');

// Routes
const indexRoute = require('./routes/index');
const catalogRoutes = require('./routes/catalog');
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/user');

app.use(express.json()); // Parse application/json (recognize the incoming request object as a JSON object)
app.use(cors());

// App route configuration
app.use('/', indexRoute); // Index Route
app.use('/catalogs', catalogRoutes); // Catalog Routes
app.use('/items', itemRoutes); // Item Routes
app.use('/users', userRoutes); // User Routes

app.listen(config.port, () => console.log(`Listening on port: ${config.port}`));

module.exports = app;
