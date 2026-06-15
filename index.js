const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Home Page
app.get("/", (req, res) => {
  const userFolder = `./files/${req.sessionID}`;

  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }

  fs.readdir(userFolder, (err, files) => {
    if (err) return res.send("Error reading files");

    res.render("index", { files });
  });
});

// Show Single File
app.get("/files/:filename", (req, res) => {
  const userFolder = `./files/${req.sessionID}`;

  fs.readFile(
    `${userFolder}/${req.params.filename}.txt`,
    "utf-8",
    (err, filedata) => {
      if (err) return res.send("File not found");

      res.render("show", {
        filename: req.params.filename,
        filedata,
      });
    }
  );
});

// Create File
app.post("/create", (req, res) => {
  const userFolder = `./files/${req.sessionID}`;

  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }

  fs.writeFile(
    `${userFolder}/${req.body.title.split(" ").join("")}.txt`,
    req.body.content,
    (err) => {
      if (err) return res.send("Error creating file");

      res.redirect("/");
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});