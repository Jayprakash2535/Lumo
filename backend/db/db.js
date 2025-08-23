import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
function connect()
{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>
    {
        console.log("connected to database");
        
    })
    .catch(error=>{
        console.log(error);
        
    })
}
export default connect