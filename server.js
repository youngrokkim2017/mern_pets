const express = require("express");
const { MongoClient } = require("mongodb")
let db

const app = express();
app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.static("public"))

function passwordProtected(req, res, next) {
    res.set("WWW-Authenticate", "Basic realm='Our MERN App'")
    if (req.headers.authorization == "Basic YWRtaW46YWRtaW4=") {
        next()
    } else {
        console.log(req.headers.authorization)
       res.status(401).send("try again")
    }
}

app.get("/", async (req, res) => {
    const allAnimals = await db.collection("animals").find().toArray()
    console.log(allAnimals)
    // res.send("Welcome to home page")
    res.render("home", {allAnimals})
})

// any urls after '/' is password protected
// ordering matters
app.use(passwordProtected)

app.get("/admin", (req, res) => {
    // res.send("This is the admin page")
    res.render("admin")
})

app.get("/api/animals", async (req, res) => {
    const allAnimals = await db.collection("animals").find().toArray()
    res.json(allAnimals)
})

async function start() {
    const client = new MongoClient("mongodb://root:root@localhost:27017/MernApp?&authSource=admin")
    await client.connect()
    db = client.db()
    app.listen(3000)
}

start()
