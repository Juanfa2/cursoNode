var express = require("express");
var Imagen = require("./models/imagenes").Imagen;
var router = express.Router();

var fs = require("fs");

var find_image = require("./middlewares/find_image");


router.get("/", function(req, res){
    Imagen.find({})
            .populate("creator")
            .exec(function(err, imagenes){
                if (err) console.log(err);
                res.render("app/home", {imagenes: imagenes});
            });   

}); 

/* REST */
router.get("/imagenes/new", function(req,res){
    res.render("app/imagenes/new");
});

router.all("/imagenes/:id*", find_image);

router.get("/imagenes/:id/edit", function(req,res){
    res.render("app/imagenes/edit");
});

router.route("/imagenes/:id")
    .get(function(req,res){
        res.render("app/imagenes/show");
    })
    .put(function(req,res){
        res.locals.imagen.title = req.body.title;
        res.locals.imagen.save(function(err){
            if(!err){
                res.render("app/imagenes/show");
            }else{
                res.render("app/imagenes/" + req.params.id +"/edit");
            }
        });
    })

    .delete(function(req,res){

        /**
         * Se puede eliminar con dos funciones
            Imagen.findById(req.params.id, function(err){
                imagen.remove();
            })
         */

        Imagen.findByIdAndDelete(req.params.id, function(err){
            if(!err){
                res.redirect("/app/imagenes");
            }else{
                console.log(err);
                res.redirect("/app/imagenes" + req.params.id);
            }
        });
    });

router.route("/imagenes")
    .get(function(req,res){
        Imagen.find({}, function(err, imagenes){
            if(err){
                res.redirect("/app");
                return;
            }
            res.render("app/imagenes/index",{imagenes:imagenes});
        });
    })
    .post(function(req,res){
        //console.log(req.files.archivo);
        var extension = req.files.archivo.name.split(".").pop();
        var data = {
            title: req.body.title,
            creator: res.locals.user._id,
            extension: extension
        };

        var imagen = new Imagen(data);
        
        imagen.save(function(err){
            if(!err){
                fs.rename(req.files.archivo.path, "./public/imagenes/"+imagen._id+"."+extension, function(err) {
                    res.redirect("/app/imagenes/"+imagen._id);
                 });
                
            }else{
                res.render(err);
            }
        });
    });

module.exports = router;