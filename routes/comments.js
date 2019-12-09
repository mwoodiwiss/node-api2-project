const express = require("express");
const db = require("../data/db");
const router = express.Router({
    mergeParams: true
});

router.get("/", (req, res) => {
    db.findPostComments(req.params.id)
		.then(comments => {
			res.status(201).json(comments)
		})
		.catch(err => {
			res.status(500).json({
				message: "Could not get post comments",
			})
		})
  });

  router.post("/", (req, res) => {
    if (!req.body.text) {
      return res.status(400).json({ message: "Missing comment" })
    } if (!req.body.post_id) {
      return res.status(400).json({ message: "Missing post id"})
    }
  
    db.insertComment(req.body)
      .then(comment => {
        res.status(201).json(comment)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Error adding the comment",
          message: `${error}`
        })
      })
  })



module.exports = router;