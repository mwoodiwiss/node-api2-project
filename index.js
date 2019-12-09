const express = require("express")
const postsRouter = require("./routes/posts")
const server = express()

server.use(express.json())
server.use("/api/posts", postsRouter)

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`App is listening on port ${port}`));
