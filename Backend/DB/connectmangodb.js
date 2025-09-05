import mangoose from 'mongoose';

const connectMangoDB = async()=>{
    try {
        await mangoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected successfully');
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectMangoDB;