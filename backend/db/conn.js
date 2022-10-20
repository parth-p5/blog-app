const { MongoClient } = require("mongodb");

const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://admin:${password}@cluster0.ldermok.mongodb.net/?retryWrites=true&w=majority`;

// Database Name
const dbName = "blogapp";

let blogsCollection;

function connectToDB() {
  MongoClient.connect(uri)
    .then((client) => {
      console.log('Connected successfully to mongodb server');

      const connect = client.db(dbName);

      // Connect to collection
      blogsCollection = connect.collection("blogs");
    })
    .catch((err) => {
      // Printing the error message
      console.log(err.Message);
    });
}

module.exports = {
  connectToDB,
  getBlogsCollection: function() {
    return blogsCollection;
  },
};
