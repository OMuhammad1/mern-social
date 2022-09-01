const router = require("express").Router();
const User = require("../models/user")
const bcrypt = require("bcrypt")

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            //automatically set all inputs inside body
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account updated")
        }
        catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            //function finds id and deltes if found 
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted")
        }
        catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})



//get user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //we dont want a user to be able to see ALL info available, so hide some, other contains all 
        //info about user (except for pass,updatedAt) so return other 
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
})

//follow 
router.put("/:id/follow", async (req, res) => {
    //no following urself
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                //push data into respective arrays
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { following: req.params.id } })
                res.status(200).json("user is now followed")
            } else {
                res.status(403).json("you already follow the user")
            }

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant follow yourself")
    }
})

//unfollow 
router.put("/:id/unfollow", async (req, res) => {
    //no following urself
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                //push data into respective arrays
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { following: req.params.id } })
                res.status(200).json("user is now unfollowed")
            } else {
                res.status(403).json("you do not follow the user")
            }

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant unfollow yourself")
    }
})



module.exports = router