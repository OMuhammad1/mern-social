const router = require("express").Router();
const User = require("../models/user")
//synch function to hide passwords
const bcrypt = require("bcrypt")

//Register 
router.post("/register", async (req, res) => {
    //use try/catch when using asynch/await
    try {
        //generate pass (process with salt and hash is used to hash the password)
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt)

        //async process so need to add await/async, run code without freezing the rest 
        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        //save user and return response 
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }

});

//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("User not found");

        const validPass = await bcrypt.compare(req.body.password, user.password)
        !validPass && res.status(400).send("wrong pass")

        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router