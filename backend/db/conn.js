const { MongoClient } = require("mongodb");

const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://admin:${password}@cluster0.ldermok.mongodb.net/?retryWrites=true&w=majority`;

// Database Name
const dbName = "blogapp";

let connect;

function connectToDB() {
  MongoClient.connect(uri)
    .then((client) => {
      console.log('Connected successfully to mongodb server');

      connect = client.db(dbName);
    })
    .catch((err) => {
      // Printing the error message
      console.log(err.Message);
    });
}

module.exports = {
  connectToDB,
  getBlogsCollection: function() {
    // Connect to collection
    const blogsCollection = connect.collection("blogs");

    return blogsCollection;
  },
};
