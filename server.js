const express = require("express");
const fs = require("fs");
const path = require("path");
// const cors = require('cors');

const app = express();
const PORT = 3000;

// middlewares
app.use(express.json());

// http requests
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/todos", (req, res) => {
  fs.readFile("./todos.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    const todos = JSON.parse(data);
    // res.status(201).json(todos);
    res.status(200).json(todos);
  });
});

app.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 10000),
    title: req.body.title,
    description: req.body.description,
  };

  fs.readFile("./todos.json", "utf-8", (err, data) => {
    if (err) res.status(500).send(err);
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
      if (err) res.status(500).json({ Error: "Error while writing file...!" });
      res.status(201).json(newTodo);
    });
  });
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);

    const matchingId = findIndex(todos, id);

    const newArray = removeIndex(todos, matchingId);
    fs.writeFile("./todos.json", JSON.stringify(newArray), (err) => {
      if (err) throw err;
      res.status(200).json({ message: `id: ${id}. Item deleted From File...!` });
    });
  });
});

function findIndex(arr, id) {
  for (let index = 0; index < arr.length; index++) {
    const itemId = arr[index].id;
    if (itemId === id) {
      return id;
    }
  }
  return -1;
}
function removeIndex(arr, matchingId) {
  const newArray = [];
  for (let index = 0; index < arr.length; index++) {
    if (arr[index].id !== matchingId) newArray.push(arr[index]);
  }
  return newArray;
}

// app Listening PORT
app.listen(PORT, () => {
  console.log(`app running on http://localhost:${PORT}`);
});
