
/******************************************************************************************/
/*                                US STATES Node.js REST API                              */
/******************************************************************************************/

/*
PROJECT TITLE:          Final Project: states
VERSION or DATE:        May 5, 2022
AUTHOR:                 Donna Tiu
ORGANIZATION:           Fort Hays State University
                        INF 653 Back-End Web Development I
PURPOSE OF PROJECT:     The purpose of this project is to reinforce the knowledge from the 
                        assigned readings and assignments relating to Node.js for server-
                        side code.
OBJECTIVES:             Build a Node.js REST API for US States data using both Express and 
                        MongoDB.
PROBLEM DESCRIPTION:    • DATA: Create a MongoDB collection
                        • DEPLOYMENT: Host your project with a free glitch.com account
                        • REST API: 
                            - GET requests
                            - POST request
                            - PATCH request
                            - DELETE request
*/

// Import .env file
// Parse .env file and set environment vars defined in that file 
// in process.env
require('dotenv').config();

// Imports
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

// Establish Port as PORT value in process.env or 3500
const PORT = process.env.PORT || 3500;

// Connect to states database in MongoDB
connectDB();

// Use Cross Origin Resource Sharing
app.use(cors());

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json 
app.use(express.json());

// To serve static files such as images, CSS files, and JavaScript files, 
// use the express.static built-in middleware function in Express
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
    // Root project URL
    app.use('/', require('./routes/root'));  
    // REST API root URL           
    app.use('/states', require('./routes/api/states')); 
    // Additional API endpoints are added to the /states/ route.

// Catch-all to serve a 404 status if the route does not exist
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Listen for requests ONLY if successfully connected (open event)
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});