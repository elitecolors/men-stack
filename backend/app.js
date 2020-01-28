const express= require ('express');
const app = express();
const bodYParser= require ('body-parser');
const mongoose= require ('mongoose');

const postsRoutes= require('./routes/posts');

const uri = "mongodb+srv://ahmed:ZgJqmx6bUvG7mr3S@cluster0-r88gy.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodYParser.json());
mongoose.connect(uri,
  {useNewUrlParser: true,
  useUnifiedTopology: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(()=>{
  console.log('Connected to database');
}).catch(err => console.log(err));


app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods','POST,GET,DELETE,PUT,PATCH');
  next();
});

app.use("/api/posts",postsRoutes);

module.exports = app;
