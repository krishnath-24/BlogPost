// require all the modules
const express     =  require('express'),
      bodyParser  =  require('body-parser'),   
      mongoose    =  require('mongoose'),
      app         =  express();



// tell the app to use body parser
app.use(bodyParser.urlencoded({extended:true}));


// configure mongoose
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true,useUnifiedTopology: true });

//set the view engine
app.set("view engine","ejs");

// set up the static folder for stylesheet
app.use(express.static('public'));

// create the blog schema
const blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body: String,
    created: {type:Date, default:Date.now }
});

var Blog = mongoose.model("Blog",blogSchema);


//Restful routes

app.get('/',function(req,res){
    res.redirect('/blogs');
});


app.get('/blogs',function(req,res){
    
    Blog.find({},function(err,blogs){

        if(err){
            console.log(err);
        } else{ 
            res.render("index",{blogs: blogs});
        }
    });
});




//create the server
app.listen(3000,function(){
    console.log("Blog Post listening on port 3000");
});
