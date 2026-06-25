import { dbConnect } from "./dbConnection/connection.js";
import app from "./index.js";
import dotenv from 'dotenv';

dotenv.config();
await dbConnect();

const PORT = process.env.PORT || 5001;
  
const server = app.listen(PORT, () => {
    console.log(`Server Running at PORT: ${PORT}`)
});

server.on('error', (err) => {
  console.error('Server error', err);
  process.exit(1);
});