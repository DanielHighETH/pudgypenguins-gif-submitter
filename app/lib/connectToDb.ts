import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;
const uri = "mongodb+srv://" + MONGODB_USERNAME + ":" + MONGODB_PASSWORD + "@" + MONGODB_URI + "/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


let db: any;
export default async function connectToDB(dbName: string) {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}