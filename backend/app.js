// Import des packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
// Import des routes
const postRoutes = require('./routes/post-route');
const userRoutes = require('./routes/user-route');

const app = express();
require('dotenv').config();
// Mongoose
mongoose.connect(process.env.MONGO_ACCESS,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch((error) => {
        console.log(error);
        console.log('Connexion à MongoDB échec')
    });

// Express

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/posts', postRoutes);
app.use('/api/auth', userRoutes);

app.use(helmet());

module.exports = app;

