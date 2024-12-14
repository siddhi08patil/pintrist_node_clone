var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const localStratagy = require('passport-local')
const upload = require('./multer')
passport.use(new localStratagy(userModel.authenticate()))

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' },{nav:false});
});
router.get('/register', function(req, res, next) {
  res.render("register",{nav:false});
});
router.get('/profile', isLoggedIN,async function(req, res, next) {
  const user =
   await userModel
      .findOne({username:req.session.passport.user})
      .populate("posts")
  res.render("profile",{user},{nav:true});
});
router.get('/add', isLoggedIN,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});

  res.render("add",{user},{nav:true});
});
router.post('/createpost', isLoggedIN,upload.single("postimage"),async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
});
router.post('/fileupload', isLoggedIN,upload.single("image"),async function(req, res, next) {
  const user =await userModel.findOne({username:req.session.passport.user})
  user.profileimage = req.file.filename;
  await user.save();
  res.redirect('/profile',{nav:true})
});
router.post('/register', function(req, res, next) {
  const data = new userModel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact
  })
  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile",{nav:true})
    })
  })
});

router.post('/login', rpassport.authenticate("local",{
  failureRedirect:"/" ,
  successRedirect:"/profile",
}),function(req, res, next) {
});

router.get("/logout",function(req,res,next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/',{nav:false});
    });
})
function isLoggedIN(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/",{nav:false})
  }
}

module.exports = router;
