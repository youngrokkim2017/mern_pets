const express = require("express");
const { MongoClient, ObjectId } = require("mongodb")
const multer = require("multer")
const upload = multer() // for letting users upload files
const sanitizeHTML = require("sanitize-html")
let db

const app = express();
app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.static("public"))

app.use(express.json())
spp.use(express.urlencoded({ extended: false }))

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

app.post("/create-animal", upload.single("photo"),  ourCleanup, async (req,res) => {
    console.log(req.body)
    const info = await db.collection("animals").insertOne(req.cleanData)
    const newAnimal = await db.collection("animals").findOne({_id: new ObjectId(info.insertedId)})
    res.send(newAnimal)
})

function ourCleanup(req, res, next) {
    if (typeof req.body.name !== "string") req.body.name = ""
    if (typeof req.body.species !== "string") req.body.species = ""
    if (typeof req.body._id !== "string") req.body._id = ""

    req.cleanData = {
        name: sanitizeHTML(rew.body.name.trim(), {allowedTags: [], allowedAttributes: {}}),
        species: sanitizeHTML(rew.body.species.trim(), {allowedTags: [], allowedAttributes: {}}),
    }
}

async function start() {
    const client = new MongoClient("mongodb://root:root@localhost:27017/MernApp?&authSource=admin")
    await client.connect()
    db = client.db()
    app.listen(3000)
}

start()
