const { json } = require("body-parser");
const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

//Hämtar datan

app.get("/mountains", (req, res) => {
  fs.readFile("data.json", function (err, data) {
    if (err) {
      res.status(404).send("error");
    }
    const mountains = JSON.parse(data);

    res.send(mountains);
    return;
  });
});

//Lägger till ny data

app.post("/mountains/add", (req, res) => {
  fs.readFile("data.json", function (err, data) {
    if (err) {
      res.status(404).send("error");
    }
    const mountains = JSON.parse(data);

    let newdata = req.body;

    mountains.push(newdata);

    fs.writeFile("data.json",JSON.stringify(mountains, null, 2), function (err) {
        if (err) {
          res.status(404).send("error");
        } else {
          res.send(mountains);
        }
      }
    );
    return;
  });
});

//Tar bort data

app.delete("/mountains/:id", (req, res) => {
  fs.readFile("data.json", function (err, data) {
    if (err) {
      res.status(404).send("Couldn't delete");
    } else {
      const mountains = JSON.parse(data);
      const id = mountains.find((mountains) => mountains.id == req.params.id);
      const index = mountains.indexOf(id);

      if (index >= 0) {
        mountains.splice(index, 1);
      } else {
        res.status(404).send("Couldn't find id");
      }

      fs.writeFile("data.json",JSON.stringify(mountains, null, 2), function (err) {
          if (err) {
            res.status(404).send("error");
          } else {
            res.status(200).send(mountains);
          }
        }
      );
    }
  });
});

// Uppdatera

app.put("/mountains/:id", (req, res) => {
  fs.readFile("data.json", function (err, data) {
    const mountains = JSON.parse(data);
    const id = mountains.find((mountains) => mountains.id == req.params.id);

    if (id >= 0) {
      res.status(404).send("id was not found");
    } else {
      mountains.find((id) => {
        if (id.id == req.params.id) {
          (id.name = req.body.name),
            (id.hight = req.body.hight),
            (id.country = req.body.country);
        }
      });
    }
    fs.writeFile("data.json",JSON.stringify(mountains, null, 2), function (err) {
        if (err) {
          res.status(404).send("error");
        } else {
          res.status(200).send(mountains);
        }
      }
    );
  });
});

app.listen(3000, () => console.log("Server is up!"));
