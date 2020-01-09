var express     =   require('express'),
    mongoose    =   require('mongoose'),
    bodyParser  =   require('body-parser');

var app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost/restful_blog_app",{
    useNewUrlParser:true,
    useUnifiedTopology: true 
});


const blogSchema = new mongoose.Schema({

    title: String,
    image : String,
    body : String,
    created : {
          type: Date,
        default : Date.now()
    }
});

const Blog =mongoose.model("Blog",blogSchema);


//create the home route to the index route
app.get('/',function(req,res){
    res.redirect('/blogs');
})

// create the INDEX route
app.get('/blogs',function(req,res){

    Blog.find({},function(err,blogs){

        if(!err) res.render("index",{blogs : blogs});
        else {
            console.log(err);
        }
    });

});

//create the NEW Blog route
app.get('/blog/new',function(req,res){
    res.render("new");
});

// set the CREATE route here
app.post('/blogs',function(req,res){

    // create the blog
    Blog.create(req.body.blog,function(err,newBlog){

        if(err) res.render('new');
    
        //redirect to the index
        else res.redirect('/');
    });

});

// SHOW route
app.get('/blogs/:id',function(req,res){

    Blog.findById(req.params.id,function(err,foundBlog){

        if(err){
            res.redirect("/blogs");
        } else{

            res.render("show",{blog : foundBlog});
        }
    })

});





app.listen(3000,function(){
    console.log("Blog Server Started");
});