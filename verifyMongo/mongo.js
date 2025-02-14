const { MongoClient } = require("mongodb");

async function testMongo() {
  try {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    console.log("✅ MongoDB Connected");
    const db = client.db("meetupDB");
    console.log(await db.collection("users").find().toArray());
    await client.close();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

testMongo();
