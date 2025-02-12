import mongoose from "mongoose";
export const connectDb= async()=>
{
    try{
        await mongoose.connect(process.env.conn)
    }
    catch(e){
        console.log(e);
    }
}