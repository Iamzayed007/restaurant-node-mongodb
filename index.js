const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anawu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('restaurantDB');
        const breakfastCollection = database.collection('breakfast');
        const lunchCollection = database.collection('lunch');
        const dinnerCollection = database.collection('dinner');
        const commentsCollection = database.collection('comments');
        const orderCollection = database.collection('orders');

        //GET Products API
        app.get('/breakfast', async (req, res) => {
            const cursor = breakfastCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/lunch', async (req, res) => {
            const cursor = lunchCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/dinner', async (req, res) => {
            const cursor = dinnerCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/comments', async (req, res) => {
            const cursor = commentsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // Use POST to get data by keys
        app.post('/products/id', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await breakfastCollection.find(query).toArray();
            res.send(products);
        });

        // Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ema jon server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})