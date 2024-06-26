const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors({
  origin: ['https://serene-tarsier-5ff748.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster03.tgxypoz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const verifyToken = async (req, res, next) =>{
//   const token = req.cookies?.token;
//   if(!token){
//     return res.status(401).send({message: 'unauthorized access'})
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if(err){
//       return res.status(401).send({message: 'unauthorized access'})
//     }
//     req.user = decoded;
//     next();
//   })
// }


// const signer = async (req, res, next) => {
//   console.log('call:', req.host, req.originalUrl)
//   next();
// }



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7) await
    client.connect();

    const addedJob = client.db('jobDb').collection('job');
    const orderBid = client.db('jobDb').collection('bid');

    // auth related api jwt 
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, 'process.env.ACCESS_TOKEN_SECRET', { expiresIn: '1h' })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })

    // secure: process.env.NODE_ENV === 'production', 
    // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

    app.post('/jwt', async (req, res) => {
      const signInUser = req.body;
      console.log(signInUser);
      const token = jwt.sign(signInUser, 'process.env.ACCESS_TOKEN_SECRET', { expiresIn: '1h' })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })

    app.get('/webCategory', async (req, res) => {
      const cursor = addedJob.find({ category: "Web Design and Development" });
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/graphicsCategory', async (req, res) => {
      const cursor = addedJob.find({ category: "Graphics Design" });
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/marketingCategory', async (req, res) => {
      const cursor = addedJob.find({ category: "Digital Marketing" });
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/Jobs', async (req, res) => {
      console.log(req.query.email)
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = addedJob.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/jobs', async (req, res) => {
      const cursor = addedJob.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/jobs', async (req, res) => {
      const newJob = req.body;
      console.log(newJob)
      const result = await addedJob.insertOne(newJob);
      res.send(result)
    })

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedJob.findOne(query);
      res.send(result)
    })

    // up to date jobs 

    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateJob = req.body;
      const job = {
        $set: {
          title: updateJob.title,
          photo: updateJob.photo,
          minimumPrice: updateJob.minimumPrice,
          maximumPrice: updateJob.maximumPrice,
          category: updateJob.category,
          deadline: updateJob.deadline,
          Description: updateJob.Description
        }
      }
      const result = await addedJob.updateOne(filter, job, options);
      res.send(result)
    })

    // delete crud operation 

    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await addedJob.deleteOne(query);
      res.send(result)
    })

    // order bid section 
    app.post('/bids', async (req, res) => {
      const bidJob = req.body;
      console.log(bidJob)
      const result = await orderBid.insertOne(bidJob);
      res.send(result)
    })

    app.get('/bids', async (req, res) => {
      console.log(req.query.email)
      console.log('got token from client site', req.cookies.token)
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = orderBid.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/bids', async (req, res) => {
      const bidItems = req.body;
      console.log(bidItems)
      const result = await orderBid.find().toArray();
      res.send(result);
    })

    app.get('/bids/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderBid.findOne(query);
      res.send(result)
    })

    app.patch('/bids/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateBid = req.body;
      console.log(updateBid);
      const updateDoc = {
        $set: {
          status: updateBid.status
        },
      };
      const result = await orderBid.updateOne(query, updateDoc);
      res.send(result)
    })

    app.patch('/bids/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateBidReject = req.body;
      console.log(updateBid);
      const updateDoc = {
        $set: {
          status: updateBidReject.reject
        },
      };
      const result = await orderBid.updateOne(query, updateDoc);
      res.send(result)
    })

    app.patch('/bids/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateComplete = req.body;
      console.log(updateBid);
      const updateDoc = {
        $set: {
          status: updateComplete.complete
        },
      };
      const result = await orderBid.updateOne(query, updateDoc);
      res.send(result)
    })

    app.delete('/bids/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await orderBid.deleteOne(query);
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
