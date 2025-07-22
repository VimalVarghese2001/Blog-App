const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Jwt = require("jsonwebtoken")
const Bcrypt = require("bcrypt")
const userModel = require("./models/users")

let app = Express()

app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://vimal:123@cluster0.c5iuy69.mongodb.net/blogAppD?retryWrites=true&w=majority&appName=Cluster0")


//Sign In
app.post("/signIn",async(req,res)=>{
    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
        (items)=>{

            if (items.length>0) {


                const passworValidator=Bcrypt.compareSync(req.body.password,items[0].password)
                if (passworValidator) {
                    Jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                        (error,token)=>{

                            if (error) {
                                res.json({"Status":"error","errorMessage":error})

                            } else {
                                 res.json({"Status":"success","token":token,"userId":items[0]._id})
                            }
                        })

                    
                } else {
                    res.json({"status":"Incorrect Password"})
                }

                
            } else {
                res.json({"Status":"Invalid Email Id"})
            }
        }
    ).catch()
})



//Sign Up
app.post("/signUp", async (req, res) => {
    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword




    userModel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {
                res.json({ "status": "email id already exist" })
            }
            else {

                let result = new userModel(input)
                result.save()
                res.json({ "status": "success" })

            }

        }
    ).catch(
        (error) => { }
    )

})

app.listen(3030, () => {
    console.log("Server Started")
})
