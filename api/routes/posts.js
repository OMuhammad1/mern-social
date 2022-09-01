const router = require("express").Router();
const Post = require("../models/Post")
const User = require("../models/user");



//create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }

})
//update post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne( {$set: req.body} );
            res.status(200).json("Post updated")
        } else {
            res.status(403).json("You cant update someone elese spost ")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne( {$set: req.body} );
            res.status(200).json("Post deleted")
        } else {
            res.status(403).json("You cant delete someone elese spost ")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

//like a post
router.put("/:id/like", async (req,res) => {
    try { 
        const post = await Post.findById(req.params.id)
        //check array if already liked
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("post liked")
        } else {
            //unlilke post
            await post.updateOne({$pull: {likes:req.body.userId }})
            res.status(200).json("post unliked")
        }
    } catch (err) {
        res.status(500).json(err)
    }


})

//get a post
router.get("/:id", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch(err) {
        res.status(500).json(err)
    }
})

//get timeline posts 
router.get("/timeline/all", async (req,res) => {
    try {
        //use promise for multiple promises 
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({userId: currentUser._id });
        //use promsie all when doing loop
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        //spread operator
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;