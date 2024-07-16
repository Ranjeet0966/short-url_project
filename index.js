const express = require('express');
const {connectToMongoDb} = require('./connect')
const urlRoute = require("./routes/url");
const URL=require('./models/index');
const app = express();

const PORT = 8001;

app.use(express.json());

app.get("/test",(req, res)=>{
    return res.end("<h1>Hey from server</h1>")
    
});
app.use("/url", urlRoute);

app.get('/:shortId', async(req,res)=>{
    const shortId = req.params.shortId;
    const entry= await URL.findOneAndUpdate({
        shortId
    }, 
{
    $push: {
        visitHistory:{
            
          timestamp:  Date.now(),
        }
    },
});
res.redirect(entry.redirectURL) 
})

connectToMongoDb('mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@atlascluster.sw1lvwy.mongodb.net/short-url')
.then(()=> console.log('mongoDB connected'));



app.listen(PORT, ()=> console.log('server started'));
