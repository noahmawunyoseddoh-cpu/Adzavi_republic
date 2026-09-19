import mongoose from "mongoose";
import dns from "dns";

// Node's built-in DNS resolver sometimes fails to read Windows' network
// settings correctly, which breaks the SRV lookup MongoDB Atlas connection
// strings rely on (even though the OS itself can resolve it fine via
// nslookup). Explicitly pointing Node at public DNS servers works around it.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;