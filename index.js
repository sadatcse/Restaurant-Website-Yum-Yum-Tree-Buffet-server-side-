const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://sadatcse22:4duKyWccvfk346im@cluster0.htcoen1.mongodb.net/?retryWrites=true&w=majority";

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
 
    const menuCollection = client.db('Restru').collection('menu');

    app.get('/menus', async (req, res) => {
        const cursor = menuCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/menus/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }

        const result = await menuCollection.findOne(query);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('restrurant is running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})