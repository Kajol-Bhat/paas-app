
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/mydatabase'; // Update with your MongoDB connection URI

let collection; // Declare collection globally

// Connect to MongoDB
MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db();
    collection = db.collection('mycollection'); // Update with your collection name

    // Start the server inside the connection callback
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Serve static files from the 'public' directory
    app.use(express.static('public'));

    // Define routes
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/feature', (req, res) => {
      res.sendFile(__dirname + '/public/feature.html');
    });

    app.get('/pricing', (req, res) => {
      res.sendFile(__dirname + '/public/pricing.html');
    });

    app.get('/about', (req, res) => {
      res.sendFile(__dirname + '/public/about.html');
    });

    // Example route with MongoDB interaction
    app.get('/data', (req, res) => {
      collection.find().toArray()
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          console.error('Error fetching data from MongoDB:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
