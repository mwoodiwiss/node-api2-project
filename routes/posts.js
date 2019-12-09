const express = require("express");
const commentsRouter = require("./comments");
const db = require("../data/db");
const router = express.Router();

router.use("/:id/comments", commentsRouter);

router.get("/", (req, res) => {
  db.find()
    .then(posts => res.json(posts))
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(201).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.post("/", (req, res) => {
    if (!req.body.title) {
      return res.status(400).json({ message: "Missing post title" })
    } if (!req.body.contents) {
      return res.status(400).json({ message: "Missing post contents"})
    }
  
    db.insert(req.body)
      .then(post => {
        res.status(201).json(post)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Error adding the post",
        })
      })
  })

router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  if (!comment.text || !comment.post_id) {
    return res.status(400).json({
      errorMessage: "Please provide the text and post id for the comment."
    });
  }
  db.findById(comment.post_id).then(comment => {
    if (comment) {
      db.insert({ comment })
        .then(comment => {
          res.status(201).json(comment);
        })
        .catch(error =>
          res.status(500).json({
            message:
              "There was an error while saving the comment to the database"
          })
        );
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  });
});

router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({ message: "An error occured..." });
  }

  db.findById(req.params.id)
    .then(post => {
      if (post) {
        return db.update(req.params.id, { title, contents });
      }
      res.status(404).json({ message: "User not found" });
    })
    .then(() => db.findById(req.params.id))
    .then(data => res.json(data))
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.delete("/:id", async (req, res) => {
  db.findById(req.params.id)
    .then(async post => {
      if (post) {
        await db.remove(req.params.id);
        return post;
      }
      res.status(404).json({ message: "User not found" });
    })
    .then(data => res.json(data))
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

module.exports = router;
