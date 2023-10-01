const express = require("express")
const body=require("body-parser")
const session= require("express-session")
const cookieParser=require("cookie-parser")
const morgan=require("morgan")
const mongoose=require('mongoose')
const app=express()

app.use(body.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.static("images"))
// app.use(cookieParser())
// app.use(session({
//   key:'user_sid',
//   secret:"thisIsRandomStuff",
//   resave:false,
//   saveUninitialized:false,
//   cookie:{
//     expires:500000  //expired in 5 days
//   }
// }))
// app.use((req,res,next)=>{
//   if(req.session.user& req.session.user_id){
//     res.redirect("site")
//   }
//   next()
// })
// var sessionChecker=(req,res,next)=>{
//   if(req.session.user&& req.cookies.user_id){
//     res.redirect("/site")
//   }
//   else{
//     next()
//   }
// }
// app.get('/',sessionChecker,(req,res)=>{
//   res.redirect("/login")
// })
app.set('view engine','ejs')


mongoose.connect("mongodb+srv://jeevanvjijo07:123!@#qweQWE@cluster0.fzipibh.mongodb.net/Tweetlify",{useNewUrlParser:true})


//User schema
const User=new mongoose.Schema({
    UserName:{
      type:String,
      unique:true,
      required:true
    },
    Email:{
      type:String,
      unique:true,
      required:true
    },

    Password:{
      type:String,
      required:true
    }
})
//user model
const Usermodel=mongoose.model("User-pass",User) 

//notes schema
const Note=new mongoose.Schema({
  Note:String,
  Email:String
})
//notes model
const Notemodel=mongoose.model("Notes",Note)


//private schema
const private=new mongoose.Schema({
  Note:String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User-pass' // Reference to the User model
  }

})

//private model
const Privatemodel=mongoose.model("Private-note",private)

app.get("/",function(req,res){
    res.render('index')
    
})


app.post("/login",async function(req,res){
    const Email1=req.body.email
    const Password1=req.body.password
    try {
        const user =await Usermodel.findOne({ Email:Email1, Password:Password1 })
        if (user) {
          const username= user.UserName         
          res.redirect('/site?username='+username)
          console.log("done")
        } else {
          res.send("Invalid email or password" )
        }
      } catch (error) {
        console.error("Error checking login:", error);
      }
})


app.post("/register",async function(req,res){
  var UserName=req.body.userName
  var Email=req.body.email1
  var Password=req.body.password1
  const old_user =await Usermodel.findOne({ Email:Email, UserName:UserName })
  if(old_user){
    res.send('<script>alert("The account is already present");window.location.href="/";</script>')
  }
  else{
    const saver=new Usermodel({
      UserName:UserName,
      Email:Email,
      Password:Password   
    })
    saver.save().then(()=>{
      res.send('<script>alert("Registered Successfully. Please Login"); window.location.href = "/";</script>');
    })      
    .catch((error)=>{
      console.error("Error saving user:", error);
      res.send("An error occurred during registration.");
    });
  }
});


app.get('/site',async function(req,res){
  Notemodel.find().then((result)=>{
    
    Username=req.query.username
    res.render('site',{username:Username,notes:result})
  })
  // Usermodel.find().then((result)=>{
  //   Username=result.findOne({Email:'jeevan@123'})
  //   console.log(username)
  })

  // const notes = await Notemodel.find();
  // const users = await Usermodel.find({});
  // let username = '';
  // username = users.UserName;
  // console.log(users)
  // res.render('site', { username: username, notes: notes });

//})


app.get('/about',function(req,res){
  res.render("about")
})


app.get('/contact',function(req,res){
  res.render("contact")
})


app.post('/note',async function(req,res){
  var Note=req.body.note
  const Noter= new Notemodel({Note:Note})
  Noter.save()
  res.redirect('/site')
}) 


app.listen(3000,function(){
    console.log("server is up")
})


app.post('/private',async function(req,res){
  var Note=req.body.note
  const Noter= new Privatemodel({Note:Note})
  Noter.save()
  res.redirect('/site')
}) 
