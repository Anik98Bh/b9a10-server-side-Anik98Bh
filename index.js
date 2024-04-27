const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT||5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgrphar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristsCollection = client.db("touristDB").collection('tourist');
    const countryCollection = client.db("countryDB").collection('country');

    app.get('/tourists', async (req, res) => {
        const cursor = touristsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/tourists/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await touristsCollection.findOne(query);
        res.send(result);
    })

   

    app.post('/tourists', async (req, res) => {
        const newTourists = req.body;
        const result = await touristsCollection.insertOne(newTourists);
        res.send(result);
    })

    app.get('/myList/:email', async (req, res) => {
        const email=req.params.email;
        console.log(email);
        const result = await touristsCollection.find({userEmail:email}).toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Tourists Spot Server Is Running')
})

app.listen(port, () => {
  console.log(`Tourists Spot is running on port ${port}`)
})