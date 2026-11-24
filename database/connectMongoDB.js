import { MongoClient, ObjectId } from "mongodb";

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

const dbName = "community";

await client.connect();

const db = client.db(dbName);

process.on("exit", () => {
    client.close();
});

export default {
    requestsCollection: db.collection("requests"),
    ObjectId,
};
