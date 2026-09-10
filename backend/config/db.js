import dns from 'dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8']);

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log('MongoDB connected');
}