import dotenv from "dotenv";
dotenv.config();

const username = process.env.MYUSERNAME;
const password = process.env.MYPASSWORD;

if (!username || !password) {
  throw new Error("Missing MongoDB Credentials");
}

export const connectionString = `mongodb+srv://${username}:${password}@cluster0.kuiv3vv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
