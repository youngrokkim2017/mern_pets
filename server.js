const express = require("express");
const { MongoClient, ObjectId } = require("mongodb")
const multer = require("multer")
const upload = multer() // for letting users upload files
const sanitizeHTML = require("sanitize-html")
const fse = require("fs-extra")
const sharp = require("sharp")
const path = require("path")
// packages for server side react
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const AnimalCard = require('./src/components/AnimalCard').default

let db

// when app launches, check if public/uploaded-photos exists
fse.ensureDirSync(path.join("public", "uploaded-photos"))

const app = express();
app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.static("public"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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

    const generatedHTML = ReactDOMServer.renderToString(
        <div className="container">
            <div className="animal-grid mb-3">
                {allAnimals.map(animal => (
                    <AnimalCard 
                        key={animal._id} 
                        name={animal.name} 
                        species={animal.species} 
                        photo={animal.photo} 
                        id={animal._id} 
                        readOnly={true}
                    />
                ))}
            </div>
            <p><a href="/admin">Login / manage animal listing</a></p>
        </div>
    )

    // res.send("Welcome to home page")
    // res.render("home", { allAnimals })
    res.render("home", { generatedHTML })
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
    if (req.file) {
        // file is coming from multer
        const photoFileName = `${Date.now()}.jpg`

        // resize file
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photoFileName))

        // add photo to object in database
        req.cleanData.photo = photoFileName
    }

    console.log(req.body)
    const info = await db.collection("animals").insertOne(req.cleanData)
    const newAnimal = await db.collection("animals").findOne({_id: new ObjectId(info.insertedId)})
    res.send(newAnimal)
})

app.delete("/animal/:id", async (req, res) => {
    // check id is a string
    if (typeof req.params.id !== "string") req.params.id = ""

    // remove photo from file 
    const doc = await db.collection("animals").findOne({_id: new ObjectId(req.params.id)})
    if (doc.photo) {
        fse.remove(path.join("public", "uploaded-photos", doc.photo))
    }
    
    db.collection("animals").deleteOne({_id: new ObjectId(req.params.id)})
    res.send("Deleted animal")
})

app.post("/update-animal", upload.single("photo"), ourCleanup, async (req, res) => {
    if (req.file) {
        // if uploading a new photo
        const photoFileName = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photoFileName))
        req.cleanData.photo = photoFileName
        // update database
        const photoInfo = await db.collection("animals").findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        if (photoInfo.value.photo) {
            fse.remove(path.join("public", "uploaded-photos", photoInfo.value.photo))
        }
        res.send(photoFileName)
    } else {
        //  if not uploadeding new photo
        db.collection("animals").findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        res.send(false)
    }
})

function ourCleanup(req, res, next) {
    if (typeof req.body.name !== "string") req.body.name = ""
    if (typeof req.body.species !== "string") req.body.species = ""
    if (typeof req.body._id !== "string") req.body._id = ""

    req.cleanData = {
        name: sanitizeHTML(req.body.name.trim(), {allowedTags: [], allowedAttributes: {}}),
        species: sanitizeHTML(req.body.species.trim(), {allowedTags: [], allowedAttributes: {}}),
    }

    next()
}

async function start() {
    const client = new MongoClient("mongodb://root:root@localhost:27017/MernApp?&authSource=admin")
    await client.connect()
    db = client.db()
    app.listen(3000)
}

start()
