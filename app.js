const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const express=require("express");

const app=express();

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});


app.listen(3000,function(req,res)
{
  console.log("I am listening")

})

//now create a schema
const schema={
  title:String,
  article:String,
}

const Article=mongoose.model("Article",schema);

//for articles

app.route("/articles")
.get(function(req,res)
{
  Article.find(function(err,result)
{
  if(!err)
  res.send(result);
  else
  res.send(err);
})
})
.post(function(req,res)
{
  const newarticle=new Article({
    title:(req.query.title),
    article:(req.query.article),
  })
  newarticle.save();
  res.send("recieved");

})
.delete(function(req,res)
{
  Article.deleteMany(function(err)
{
  if(!err)
  res.send("Deleted Successfully");
  else
res.send(err);

})
});

//for specfic articles

app.route("/articles/:findarticle")
.get(function(req,res)
{
  //we need to find this specified articles out of all the stores articles
  Article.findOne({title:req.params.findarticle},function(err,foundarticle)
{
  if(foundarticle)
  res.send(foundarticle);
  else
  res.send("Article Not found 404");

})
})
.put(function(req,res)
{

Article.updateOne(
  {title:req.params.findarticle},//this is the condition
  {title:req.query.title, article:req.query.article},// what we put now
  {overwrite:true},
  function(err,foundarticle)
  {
res.send("Successfully");
  }
)
})
.patch(function(req,res)
{
  Article.updateOne(
    {title:req.params.findarticle},
    {$set:{article:req.query.article}},
    function(err,changedArticle)
    {
      res.send("Successfully");
    }
  )
})
.delete(function(req,res)
{
  Article.deleteOne(
    {title:req.params.findarticle},
    function(err)
    {
      if(!err)
      res.send("Successfully");
      else
      res.send("Unsuccessful");
    }
  )
})
