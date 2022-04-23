const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // get all products api
        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const users = await cursor.toArray();
            console.log(users);
            res.send(users);
        })

        // POST product api
        app.post("/product", async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productCollection.insertOne(product);
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
