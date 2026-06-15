const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Home Page
app.get("/", (req, res) => {
  fs.readdir("./files", function (err, files) {
    if (err) return res.send("Error reading files");

    res.render("index", { files: files });
  });
});

// Show Single File
app.get("/files/:filename", (req, res) => {
  fs.readFile(
    `./files/${req.params.filename}.txt`,
    "utf-8",
    function (err, filedata) {
      if (err) return res.send("File not found");

      res.render("show", {
        filename: req.params.filename,
        filedata: filedata,
      });
    },
  );
});

// Create File
app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.content,
    function (err) {
      if (err) return res.send("Error creating file");

      res.redirect("/");
    },
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
