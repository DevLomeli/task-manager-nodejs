const express = require("express");
require("./db/mongoose");

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();
const port = process.env.PORT || 3000;

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please upload a word document"));
    }
    cb(undefined, true);

    // cb(new Error("File must be a PDF"));
    // cb(undefined, true);
    // cb(undefined, false);
  },
});

app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is on port " + port);
});

// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
// const task = await Task.findById("6010dbda61404c201cc73f22");
// await task.populate("owner").execPopulate();
// console.log(task.owner);

//   const user = await User.findById("6010db5261404c201cc73f20");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };

// main();
