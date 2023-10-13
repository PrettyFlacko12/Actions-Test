javascript
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

app.use(bodyParser.json());

app.post('/api/record', (req, res) => {
  const { userId, ipAddress } = req.body;

  MongoClient.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Error connecting to the database' });
      return;
    }

    const db = client.db();
    const collection = db.collection('users');

    collection.insertOne({ userId, ipAddress }, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).json({ error: 'Error inserting data into the database' });
        return;
      }

      res.json({ success: true });
      client.close();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
