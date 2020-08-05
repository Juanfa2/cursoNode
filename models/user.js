var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/fotos");

/*
TIPOS DE DATOS DE MONGO A TRAVES DE MONGOOSE
String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array
*/
var sexo = ["M", "F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Coloca un email valido"];
var password_validation={
    validator: function(p){
        return this.password_confirm == p;
    },
    message:"Las contraseñas no son iguales"
};
var user_schema = new Schema({
    name: String, 
    username: {
                type: String, 
                required: true, 
                maxlength:[50, "Username muy grande"]
              },
    email: {
                type: String, 
                required:"El correo es obligatorio",
                match:email_match
            },
    password: {
                type: String, 
                minlength:[8, "El password es muy corto"],
                validate:password_validation
              },
    age: {
            type:Number, 
            min: [4,"La edad no puede ser menor que 4"], 
            max: [100, "La edad no puede ser mayor a 100"]
        },
    date_of_birth: Date,
    sex: {
            type: String, 
            enum:{
                    values:sexo, 
                    message:"Opcion no valida"
                 }
         }
});

user_schema.virtual("password_confirmation").get(function(){
    return this.password_confirm;
}).set(function(password){
    this.password_confirm = password;
});

var User = mongoose.model("User", user_schema);

module.exports.User = User;