//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();
const encryptKey = "Jamesbond";
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(encrypt,{secret: encryptKey, encryptedFields: ['password']});

const userModel = mongoose.model('User',userSchema);

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  var inpUserName = req.body.username;
  var inpPassword = req.body.password;
  var user = new userModel({
    email: inpUserName,
    password: inpPassword
  });
  user.save(function(err){
    if(!err){
      res.render('secrets');
    }else{
      console.log(err);
      res.send(err);
    }
  })
});

app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  var inpUserName = req.body.username;
  var inpPassword = req.body.password;
  userModel.findOne({email:inpUserName},function(err,searchResult){
    if(!err){
      if(searchResult.password === inpPassword){
        res.render('secrets');
      }else{
        res.send("Entered password is wrong. Please try again !!")
      }
    }else{
      console.log(err);
      res.send(err);
    }
  })
});


app.get("/",function(req,res){
  res.render("home");
});





var port = process.env.PORT;
if(!port){
  port = 3000;
}
app.listen(port, function(){
  console.log("Server successfully started on port " + port);
});
