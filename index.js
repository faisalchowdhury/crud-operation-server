const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.0o3jxdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("user_profile").command({ ping: 1 });
    console.log("pinged ,Db Connected");

    const db = client.db("user_profile");
    const collection = db.collection("user");

    //Show all users

    app.get("/users", async (req, res) => {
      const cursor = collection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    // Add User

    app.post("/users", async (req, res) => {
      const document = req.body;
      const result = await collection.insertOne(document);
      res.send(result);
    });

    //update user

    app.get("/update-user/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const userData = await collection.findOne(query);

      res.send(userData);
    });

    app.put("/update-user/:id", async (req, res) => {
      const userId = req.params.id;
      const updateData = req.body;

      const query = { _id: new ObjectId(userId) };
      const document = {
        $set: updateData,
      };

      const result = await collection.updateOne(query, document);

      res.send(result);
    });

    // Delete User

    app.delete("/user-delete/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };

      const result = await collection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is working");
});

app.listen(port, () => {
  console.log("server running on port ", port);
});
