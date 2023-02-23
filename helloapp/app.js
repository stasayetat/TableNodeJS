const express = require("express");
const fs = require("fs");
const app = express();
const jsonParser = express.json();
app.use(express.static(__dirname + "/public"));
const filePath = __dirname + "/webapp/user.json";
app.get("/api/users", function (req, res) {
    console.log("Start GETTING");
   const content = fs.readFileSync(filePath, "utf8");
   const users = JSON.parse(content);
   res.send(users);
});
app.get("/api/users/:id", function (req, res) {
    console.log("Start getUSER");
    const id = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    let user = users.find(el => el.id == id);
    console.log("GetUser " + user.id);
    if(user) {
        res.send(user);
    } else {
        res.sendStatus(404).send(`No person with ${id} ID`);
    }
});
app.post("/api/users", jsonParser, function (req, res) {
    console.log("Start post");
    if(!req.body) {
        res.sendStatus(404);
    }
    const userName = req.body.name;
    const userAge = req.body.age;
    let user = {name: userName, age: userAge};
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    const id = Math.max.apply(Math, users.map(o => o.id));
    user.id = id + 1;
    users.push(user);
    data = JSON.stringify(users);
    fs.writeFileSync(filePath, data);
    res.send(user);
});
app.delete("/api/users/:id", function (req, res) {
    console.log("Start deleting");
   const id = req.params.id;
   let data = fs.readFileSync(filePath, "utf8");
   let users = JSON.parse(data);
   let index = users.findIndex(el => el.id == id);
   if(index) {
       const user = users.splice(index, 1)[0];
       data = JSON.stringify(users);
       fs.writeFileSync(filePath, data);
       res.send(user);
   } else {
       res.sendStatus(404).send("Delete was canceled");
   }
});
app.put("/api/users", jsonParser, function (req, res) {
    console.log("Start edit in DB");
   if(!req.body) {
       console.log("Body is empty");
       res.sendStatus(404);
   }
   const userId = req.body.id;
   const userName = req.body.name;
   const userAge = req.body.age;
   let data = fs.readFileSync(filePath, "utf8");
   const users = JSON.parse(data);
   let user = users.find(el => el.id == userId);
   console.log("Edit" + user);
   if(user) {
       user.age = userAge;
       user.name = userName;
       console.log(user);
       data = JSON.stringify(users);
       fs.writeFileSync(filePath, data);
       res.send(user);
   } else {
       console.log("Error with editing");
       res.sendStatus(404);
   }
});
app.listen(3000, function () {
    console.log("Server starting...");
});
