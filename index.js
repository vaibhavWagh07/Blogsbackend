const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient,ObjectId } = require('mongodb');
const cors = require('cors');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

const mongoURI = 'mongodb+srv://vaibhav:1234@cluster0.sk5rubx.mongodb.net/recrutoryBlogs?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('connection successfull')
}).catch((err)=> console.log(err));

// testing api
app.get('/msgDisplay', (req, res) => {
    res.status(200).send({
        msg: "APIs are working successfully"
    })
});

// get all blogs
app.get('/api/blogs', async (req, res) => {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db('recrutoryBlogs'); 
        const collection = db.collection('blogs'); 

        const blogs = await collection.find({}).toArray(); // Fetch all blog documents
        res.json(blogs);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close(); 
    }
});

// get blogs using Id
app.get('/api/blogs/:id', async (req, res) => {
    const id  = req.params;
    console.log('Received blog ID:', id);

    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('recrutoryBlogs'); // Make sure 'blogDB' is your actual database name
        const collection = db.collection('blogs');

        // Here we use ObjectId to convert the id from string to ObjectId format
        const blog = await collection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.json(blog);
        await client.close();
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// posting api for blogs
app.post('/sendBlogs', async (req, res) => {
    const formData = req.body;

    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db('recrutoryBlogs'); 
        const collection1 = db.collection('blogs');

        await collection1.insertOne(formData);
        res.status(200).send('OK');
        
        await client.close();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});