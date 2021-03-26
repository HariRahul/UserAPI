const express = require("express");
const app = express();
const bodyparser = require("body-parser");
var fs = require('fs');

const port = process.env.PORT || 3200;

//Middle ware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

/**
 * creating a New order
 */

app.post("/new_user", (req, res) => {
  const order = req.body;

  var users1 = JSON.parse(fs.readFileSync('items.json', 'utf8'));
  var users = users1["users"];

  if (order.user_name || order.user_age || order.user_gender) {
    users.push({
      id: users.length + 1,
      name: order.user_name,
      age: order.user_age,
      gender: order.user_gender
    });

    console.log();

    users1["users"]=users;
    let data = JSON.stringify(users1);
    fs.writeFileSync('items.json',data);

    res.status(200).json({
      message: "User created successfully"
    });

  } 
  else {
    res.status(401).json({
      message: "Invalid user creation"
    });
  }
});

/**
 *  Getting All orders
 */

app.get("/get_users", (req, res) => {
  var obj = JSON.parse(fs.readFileSync('items.json', 'utf8'));
  res.status(200).send(obj["users"]);
});

/**
 * Update order
 */
app.put("/user/:id", (req, res) => {
  const user_id = req.params.id;
  const user_update = req.body;

  var users1 = JSON.parse(fs.readFileSync('items.json', 'utf8'));
  var users = users1["users"];

  for (let user of users) {
    if (user.id == user_id) {
      if (user_update.user_name != null || undefined)
        user.name = user_update.user_name;
      if (user_update.user_age != null || undefined)
        user.age = user_update.user_age;
      if (user_update.user_gender != null || undefined)
        user.gender = user_update.user_gender;

      users1["users"] = users;

      let data = JSON.stringify(users1);
      fs.writeFileSync('items.json',data);

      return res
        .status(200)
        .json({ message: "Updated Succesfully", data: user });
    }
  }

  res.status(404).json({ message: "Invalid user Id" });
});

/**
 * Delete Order
 */
app.delete("/user/:id", (req, res) => {
  const order_id = req.params.id;

  var users1 = JSON.parse(fs.readFileSync('items.json', 'utf8'));
  var users = users1["users"];

  for (let user of users) {
    if (user.id == order_id) {
      users.splice(users.indexOf(user), 1);

      users1["users"] = users;
      let data = JSON.stringify(users1);
      fs.writeFileSync('items.json',data);

      return res.status(200).json({
        message: "Deleted Successfully"
      });
    }
  }

  res.status(404).json({ message: "Invalid user Id" });
});

app.listen(port, () => {
  console.log(`running at port ${port}`);
});