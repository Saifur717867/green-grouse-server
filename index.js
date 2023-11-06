const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster03.tgxypoz.mongodb.net/?retryWrites=true&w=majority`;

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

    const addedJob = client.db('jobDb').collection('job');

    app.post('/jobs', async (req, res) => {
            const newJob = req.body;
            console.log(newJob)
            const result = await addedJob.insertOne(newJob);
            res.send(result)
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
    res.send("The assignment-11 server is running")
  })
  
  app.listen(port, () => {
    console.log(`The Port is : ${port}`)
  })



















// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster02.uzxvjco.mongodb.net/?retryWrites=true&w=majority`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7) await
//      client.connect();


//     const addedCars = client.db('CarsDb').collection('car');
//     const addedCart = client.db('CarsDb').collection('cart')

//     app.get('/cars', async (req, res) => {
//       const cursor = addedCars.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     })

//     app.get('/cars/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await addedCars.findOne(query);
//       res.send(result)
//     })

//     app.post('/cars', async (req, res) => {
//       const newCar = req.body;
//       console.log(newCar)
//       const result = await addedCars.insertOne(newCar);
//       res.send(result)
//     })

//     app.put('/cars/:id', async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const options = { upsert: true };
//       const updateCar = req.body;
//       const car = {
//         $set: {
//           name: updateCar.name,
//           carPhoto: updateCar.carPhoto,
//           BrandName: updateCar.BrandName,
//           BrandPhoto: updateCar.BrandPhoto,
//           category: updateCar.category,
//           price: updateCar.price,
//           Rating: updateCar.Rating,
//           Description: updateCar.Description
//         }
//       }
//       const result = await addedCars.updateOne(filter, car, options);
//       res.send(result)
//     })

//     //  my cart data 
//     app.get('/cart', async (req, res) => {
//       const cursor = addedCart.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     })

//     app.post('/cart', async (req, res) => {
//       const addCar = req.body;
//       console.log(addCar)
//       const result = await addedCart.insertOne(addCar);
//       res.send(result)
//     })

//     app.get('/cart', async (req, res) => {
//       const cursor = addedCart.findOne();
//       const result = await cursor.toArray();
//       res.send(result);
//     })

//     app.get('/cart/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: id };
//       const result = await addedCart.findOne(query);
//       res.send(result)
//     })

//     app.delete('/cart/:id', async (req, res) => {
//       const id = req.params.id;
//       console.log(id)
//       const query = { _id : id };
//       const result = await addedCart.deleteOne(query);
//       res.send(result)
//     })


//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send("The assignment-11 server is running")
// })

// app.listen(port, () => {
//   console.log(`The Port is : ${port}`)
// })

