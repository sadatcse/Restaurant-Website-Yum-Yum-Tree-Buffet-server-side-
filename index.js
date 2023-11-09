const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://sadatcse123:yJXa1d8BZNWWxQxQ@cluster99.b9fi2ib.mongodb.net/?retryWrites=true&w=majority";
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
    const menuCollection = client.db('Restu').collection('Menu');
    const userCollection = client.db('Restu').collection('User');

    app.get('/menus', async (req, res) => {
        const cursor = menuCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.post('/users', async (req, res) => {
    const newuser =req.body;
    console.log(newuser);
    const result =await userCollection.insertOne(newuser);
    res.send(result);
  })



    app.post('/menus', async (req, res) => {
      const newmenus =req.body;
      console.log(newmenus);
      const result =await menuCollection.insertOne(newmenus);
      res.send(result);
    })
    
    app.get('/menus/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
    
        const result = await menuCollection.findOne(query);
        res.send(result);
    })
    app.patch('/menus/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedMenus = req.body;
    
      try {
        const result = await menuCollection.updateOne(filter, { $set: updatedMenus });
        if (result.modifiedCount === 1) {
          res.json({ message: 'Menu updated successfully' });
        } else {
          res.status(404).json({ error: 'Menu not found or not updated' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.delete('/menus/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await menuCollection.deleteOne(query);
      res.send(result);
  })

    app.get('/menuse/:email', async (req, res) => {
      const email = req.params.email;
      const query = { "food_addedby": email };
      const cursor = menuCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
  });

    app.get('/menusort', async (req, res) => {
      const cursor = menuCollection.find().sort({ order_count: -1 }); 
      const result = await cursor.toArray();
      res.send(result);

  })

  app.get('/menusCount', async (req, res) => {
    const count = await menuCollection.estimatedDocumentCount();
    res.send({ count });
  })

  app.get('/menusc/:category', async (req, res) => {
    const Category = req.params.category;
    const query = { "Food_category": Category };
    const cursor = menuCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);

});

app.get('/menusearch/:name', async (req, res) => {
  const name = req.params.name;

  if (name === 'all') {
    const cursor = menuCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  } else {
    const query = { "Food_name": { $regex: name, $options: 'i' } };
    const cursor = menuCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  }
});





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



