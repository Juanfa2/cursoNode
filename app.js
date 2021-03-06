var express = require("express"),
    app = express(), bodyParser = require("body-parser");

var User = require("./models/user").User;
//var session= require("express-session");
var cookieSession= require("cookie-session");
var router_app = require("./routes_app");
var session_middleware= require("./middlewares/session");

var methodOverride = require("method-override");

var formidable = require("express-form-data");

app.use("/public", express.static('public'));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
/*
app.use(session({
    secret: "gimnasia1234",
    resave: false,
    saveUninitialized: false
}));
*/

app.use(cookieSession({
  name:"session",
  keys: ["llave-1", "llave-2"]
}));


app.use(formidable.parse({
    keepExtensions: true
}));


app.use(methodOverride("_method"));


app.set("view engine", "jade");

app.get("/", function(req, res){
    console.log(req.session.user_id);
    res.render("index");
});

app.get("/signup", function(req, res){
    /*
    User.find(function(err,doc){
        console.log(doc);
        res.render("signup");
    });
    */
    res.render("signup");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/users", function(req,res){

    var user = new User({email:req.body.email, 
                        password: req.body.password, 
                        password_confirmation: req.body.password_confirmation,  
                        username: req.body.username
                        });
    //Promises
    user.save().then(function(us){
        res.send("El usuario se guardo con exito");
    },function(err){
        if(err){
            console.log(String(err));
            res.send("No se pudo guardar el usuario");
        }
    });


/*
    NO PROMISES
    user.save(function(err){
        if(err){
            console.log(String(err));
        }
        res.send("Guardamos tus datos");
    });
*/
    
});

app.post("/sessions", function(req, res){
    /*
    RECUPERO UN USUARIO Y VEO SI EXISTE O NO.
    User.findOne({email:req.body.email ,password:req.body.password }, function(err, docs){
        if(Object.keys(docs).length === 0){             //pregunta si el documento esta vacio
            res.send("El usuario no existe"); 
        }else{
            console.log(docs);
            res.send("Bienvenido "+docs[0].username+" !!");
        }
        
    });
    */
   User.findOne({email:req.body.email ,password:req.body.password }, function(err, user){
        req.session.user_id = user._id;
        //res.send("Bienvenido "+user.username+" !!");
        res.redirect("/app");
        
    });

});

app.use("/app", session_middleware);
app.use("/app",router_app);

app.listen(8080);