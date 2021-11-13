const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.teo92.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('hondas_heven');
        const productCollection = database.collection('products');
        const userCollection = database.collection('users');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');

        //get api
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);


        })

        // products post

        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productCollection.insertOne(product);
            console.log(result);
            res.json(result);
        });


        //DELETE API
        app.delete('/products/:id', async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);

        });
        //get single product description
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('get id', id);
            const query = { _id: ObjectId(id) };
            const service = await productCollection.findOne(query);
            res.json(service);

        })
        //register user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);

            res.json(result)
        })

        //admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            };
            res.json({ admin: isAdmin })
        })

        //post api for add order
        app.post('/orders', async (req, res) => {

            console.log('hit the post api');

            const orders = req.body;
            console.log(orders);
            const result = await orderCollection.insertOne(orders);
            console.log(result);
            res.json(result);


        });
        //delete orders
        app.delete('/orders/:id', async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);

        });
        //get orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const products = await cursor.toArray();
            res.send(products);


        })

        //review collections
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });

        //get rivew collection
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const products = await cursor.toArray();
            res.send(products);


        })



        console.log('connected to database');
    }
    finally {

    }


}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})