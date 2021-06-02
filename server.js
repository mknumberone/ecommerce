require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))

//Kết nối mogodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true,
},err =>{
    if(err) throw err;
    console.log("Kết nối với MongoDB");
})

//Router
app.use('/user',require('./routes/useRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api',require('./routes/upload'))
app.use('/api',require('./routes/productRouter'))





//Test kết nối
// app.get('/',(req,res)=>{
//     res.json({msg:"Helloooooo"})
// })

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("Server is running on port",PORT);
})