//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// Mongoose reruire
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// MONGOOSE CONNECT
mongoose.connect("mongodb://localhost:27017/todolistDB" , {useNewUrlParser:true})
.then( () => console.log("Connected... "))
.catch( (err) => console.log(err));

// NEW SCHEMA
const itemsSchema = {
  name : String
};

const Item = mongoose.model('Item' , itemsSchema);

const item1 = new Item({
  name:'Welcome '
});

const item2 = new Item({
  name:'To add Hit + '
});

const item3 = new Item({
  name:'To delelte Hit - '
});

const defaultItems = [item1 , item2 ,item3];

const listSchema = {
  name:String,
  items: [itemsSchema]
};

const List = mongoose.model("List" , listSchema);

// Item.insertMany(defaultItems , function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Succesfully Inserted ');
//   }
// })


app.get("/", function(req, res) {

// const day = date.getDate();
//   res.render("list", {listTitle: day, newListItems: items});

 Item.find({} , function(err , foundItems){

// TO INSERT DEFAULT ITEMS JUST ONE TIME AFTER RESTARTING THE SERVER
// 

if (foundItems.length == 0) {
  Item.insertMany(defaultItems , function(err){
  if (err) {
    console.log(err);
  } else {
    console.log('Succesfully Inserted ');
  }
  });
  res.redirect("/");
}else{
  res.render("list", {listTitle: "Today", newListItems: foundItems});
}

 });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  });

  item.save();

  res.redirect("/");

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function(req,res){
 const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId , function(err){
    if(!err) {
      console.log("Successfully Deleted ... ");
      res.redirect("/");
    }
  });
 
});

app.get("/:customListName" , function(res,req){
  const customListName = req.params.customListName;

  const list = new List({
    name: customListName,
    items: defaultItems
  });


  list.save();

});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
