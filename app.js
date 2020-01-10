var express     =   require('express'),
    mongoose    =   require('mongoose'),
    bodyParser  =   require('body-parser'),
    methodOverride = require('method-override'),
    expressSanitizer= require('express-sanitizer');

var app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));



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

    console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body);
    console.log(req.body);

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


// EDIT route

app.get('/blogs/:id/edit',function(req,res){

    Blog.findById(req.params.id,function(err,foundBlog){

        if(err){
            res.redirect('/blogs');
        } else{

            res.render("edit",{blog : foundBlog});
        }
    });

});


// UPDATE ROUTE
app.put('/blogs/:id',function(req,res){

    req.body.blog.body=req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){

        if(err) res.redirect('/blogs');

        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })

});


// DELETE ROUTE

app.delete("/blogs/:id",function(req,res){

    // Destroy blog 

    Blog.findByIdAndRemove(req.params.id,function(err,deltedBlog){

        if(err) res.redirect('/blogs');
        else{
            res.redirect('/blogs');
        }      
    });


    // redirect somewhere
});


app.listen(3000,function(){ 
    console.log("Blog Server Started");
});