//bcrypt (makes passwords invisible)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")



dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, () => {
    console.log("Connect to mongos")
});

//middleware, body parser
app.use(express.json());
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)



//the "first comma is for the page name"
app.get("/",(req,res)=> {
    res.send("welcome")
})

app.get("/users",(req,res)=> {
    res.send("welcome to users page")
})


app.listen(7800, () => {
    console.log("baackend working")
})