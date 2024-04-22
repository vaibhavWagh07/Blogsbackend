// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const { MongoClient,ObjectId } = require('mongodb');
// const cors = require('cors');
// const { default: mongoose } = require('mongoose');
// const compression = require('compression')

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use(cors());
// app.use(compression());

// const mongoURI = 'mongodb+srv://vaibhav:1234@cluster0.sk5rubx.mongodb.net/recrutoryBlogs?retryWrites=true&w=majority&appName=Cluster0';
// mongoose.connect(mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
//     console.log('connection successfull')
// }).catch((err)=> console.log(err));

// // testing api
// app.get('/msgDisplay', (req, res) => {
//     res.status(200).send({
//         msg: "APIs are working successfully"
//     })
// });

// // get all blogs
// app.get('/api/blogs', async (req, res) => {
//     const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         await client.connect();
//         const db = client.db('recrutoryBlogs'); 
//         const collection = db.collection('blogs'); 

//         const blogs = await collection.find({}).toArray(); // Fetch all blog documents
//         res.json(blogs);
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).send('Internal Server Error');
//     } finally {
//         await client.close(); 
//     }
// });

// // get blogs using Id
// app.get('/api/blogs/:id', async (req, res) => {
//     const id  = req.params;
//     console.log('Received blog ID:', id);

//     try {
//         const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//         await client.connect();
//         const db = client.db('recrutoryBlogs'); // Make sure 'blogDB' is your actual database name
//         const collection = db.collection('blogs');

//         // Here we use ObjectId to convert the id from string to ObjectId format
//         const blog = await collection.findOne({ _id: new ObjectId(id) });

//         if (!blog) {
//             return res.status(404).send('Blog not found');
//         }
//         res.json(blog);
//         await client.close();

//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// //function for date in blogs
// function getCurrentDate() {
//     const currentDate = new Date();
//     const day = currentDate.getDate();
//     const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const month = monthNames[currentDate.getMonth()];
//     const year = currentDate.getFullYear();
//     return `${day} ${month} ${year}`;
// }


// // posting api for blogs
// app.post('/sendBlogs', async (req, res) => {
//     const formData = req.body;
//     formData.date = getCurrentDate();

//     try {
//         const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//         await client.connect();

//         const db = client.db('recrutoryBlogs'); 
//         const collection1 = db.collection('blogs');

//         await collection1.insertOne(formData);
//         res.status(200).send('OK');
        
//         await client.close();
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // patch api for blogs
// app.patch("/api/blogs/:id", async (req, res) => {
//     const updates = req.body;
//     const id = req.params.id;
  
//     // Check if the provided ID is valid
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid ID format" });
//     }
  
//     try {
//       const client = new MongoClient(mongoURI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
  
//       await client.connect();
//       const db = client.db("recrutoryBlogs");
//       const collection = db.collection("blogs");
  
//       const result = await collection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: updates }
//       );
  
//       if (result.matchedCount === 0) {
//         return res.status(404).json({ error: "No matching document found" });
//       }
  
//       if (result.modifiedCount === 0) {
//         return res
//           .status(200)
//           .json({ message: "No changes made", details: result });
//       }
  
//       res.status(200).json({ message: "Update successful", details: result });
//     } catch (err) {
//       console.error("Database update error:", err);
//       res
//         .status(500)
//         .json({ error: "Could not update the data", details: err.message });
//     }
//   });


// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// // api on render https://blogsbackend-l09l.onrender.com

// ------------------------------------trying new api code for reducing the time
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.use(compression());

const mongoURI = 'mongodb+srv://vaibhav:1234@cluster0.sk5rubx.mongodb.net/recrutoryBlogs?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => console.error(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Schema and Model using Mongoose
const blogSchema = new mongoose.Schema({
});

const Blog = mongoose.model('Blog', blogSchema);

// Testing API
app.get('/msgDisplay', (req, res) => {
  res.status(200).send({
    msg: "APIs are working successfully"
  });
});

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get blogs using Id
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    res.json(blog);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Posting API for blogs
app.post('/sendBlogs', async (req, res) => {
  try {
    const formData = req.body;
    formData.date = getCurrentDate(); // Assuming getCurrentDate() is defined

    const newBlog = await Blog.create(formData);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Patch API for blogs
app.patch("/api/blogs/:id", async (req, res) => {
  try {
    const updates = req.body;
    const id = req.params.id;

    // Check if the provided ID is valid
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ error: "No matching document found" });
    }

    res.status(200).json({ message: "Update successful", updatedBlog });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
