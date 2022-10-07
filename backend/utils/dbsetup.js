const { MongoClient } = require('mongodb');

const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://admin:${password}@cluster0.ldermok.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

// Database Name
const dbName = "blogapp";

async function connectToDB () {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const blogsCollection = db.collection("bogs");

  const findBlogs = await blogsCollection.findOne({
    title: "Creating NodeViews with content in Remirror"
  });

  console.log("Blogs: ", findBlogs);

  return 'done.';
}

module.exports = connectToDB;