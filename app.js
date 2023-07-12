//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my blog 😊, a hub for the latest tools, technologies, and talks in the ever-evolving world of technology. Here, I dive deep into the realms of innovation, exploring cutting-edge advancements, and bringing you insights on the latest trends shaping the tech landscape. My mission is to keep you informed and inspired, providing you with valuable knowledge and resources to navigate the rapidly changing technological landscape. Whether you are a tech enthusiast, a developer, a business professional, or simply curious about the latest breakthroughs, my blog is designed to cater to your thirst for knowledge.";
const aboutContent = "At my blog, I cover a wide range of topics, including emerging technologies, software development, artificial intelligence, cybersecurity, data science, cloud computing, and more. I create in-depth articles, tutorials, reviews, and thought-provoking pieces to keep you up-to-date with the rapidly evolving tech landscape. I committed to providing accurate and reliable information, backed by extensive research and industry expertise. Thank you for being a part of my blog. I thrilled to have you here, and I hope you find MY content informative, engaging, and thought-provoking. Stay connected, stay curious, and explore the limitless possibilities that technology has to offer 💡🎉.";
const contactContent = "I love to hear from you! Your feedback, questions, and ideas are important to me. If you have any inquiries, suggestions for topics you'd like me to cover, or simply want to get in touch, please feel free to contact me. I value your engagement and strive to provide a responsive and welcoming environment. You can reach me through the following channels: Email: [****************@gmail.com], Phone: [+91-XXXXXXXXXX].";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.post("/delete", function(req,res){
  const idDelete= req.body.button;
    Post.findByIdAndRemove(idDelete,function(err){
      if(!err){
        console.log("successfully deleted");
      }
      res.redirect("/");
    });
});

app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/edit/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId }, function(err, post){
    res.render("edit", {
      title: post.title,
      content: post.content,
      postId: post._id,
    });
  });
});

app.post("/edit/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOneAndUpdate(
    {_id: requestedPostId},
    {title: req.body.postTitle, content: req.body.postBody},
    function(err, post){
      if (!err){
        res.redirect("/");
      }
    }
  );
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
