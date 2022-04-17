const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const fileUpload = require('express-fileupload');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fphq6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('naimsiddiqui');
        const postsCollection = database.collection('posts');
        const usersCollection = database.collection('users');
        
        app.get('/AllPosts', async (req, res) => {
            const cursor = postsCollection.find({});
            const posts = await cursor.toArray();
            res.json(posts);
        })


        app.get('/posts', async (req, res) => {
            const email = req.query.email;
           

            const query = { email: email }

            const cursor = postsCollection.find(query);
            const posts = await cursor.toArray();
            res.json(posts);
        })

        // GET Single Post
        app.get('/AllPosts/:id', async (req, res) => {
          const id = req.params.id;
          console.log('getting specific Post', id);
          const query = { _id: ObjectId(id) };
          const SinglePost = await postsCollection.findOne(query);
          res.json(SinglePost);
      })



      // users api
      app.get('/users', async (req, res) => {
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.json(users);
    });

      


      app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        res.json(user);
    })


      app.post('/users', async (req, res) => {
          const name = req.body.name;
          const email = req.body.email;
          const pic = req.files.image;
          const picData = pic.data;
          const encodedPic = picData.toString('base64');
          const imageBuffer = Buffer.from(encodedPic, 'base64');
          const user = {
              name,
              email,
              image: imageBuffer
          }
          const result = await usersCollection.insertOne(user);
          res.json(result);
      })


        app.post('/posts', async (req, res) => {
            const displayName = req.body.displayName;
            const email = req.body.email;
            const title = req.body.title;
            const textarea = req.body.textarea;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const post = {
                displayName,
                email,
                title,
                textarea,
                image: imageBuffer
            }
            const result = await postsCollection.insertOne(post);
            console.log(result);
            res.json(result);
        })

        
        
        // DELETE API
        app.delete('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postsCollection.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        })

    } finally {
      
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})