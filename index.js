const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2lzea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("megaShop").collection("products");

        // GET all products api
        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(products);
            res.send(products);
        })

        // GET single product api
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // POST create product api
        app.post("/product", async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        // PUT update product api
        app.put("/product/:id", async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedProduct = {
                $set: product
            }
            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.send(result);
        })

        // DELETE product delete api
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("server is up and running");
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
