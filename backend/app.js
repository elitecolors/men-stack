const express= require ('express');
const app = express();
const bodYParser= require ('body-parser');
const mongoose= require ('mongoose');
const Post = require('./models/post')

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
  res.setHeader('Access-Control-Allow-Methods','POST,GET,DELETE');
  next();
});
//ZgJqmx6bUvG7mr3S
app.post("/api/posts",(req,res,next) => {
  const post=new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result=>{
    res.status(201).json({
      message: 'Post added successfuly',
      postId: result._id

    });
  });
});

app.get('/api/posts' ,(req,res,next)=>{

  Post.find().then(documents=>{
    res.status(200).json({
      message:'posts fetched ',
      posts: documents
    });
  });


});

app.delete("/api/posts:id",(req,res,next)=>{
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);

  });
res.status(200).json({
  message: 'Post deleted'
});
});

module.exports = app;
