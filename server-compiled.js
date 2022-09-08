(()=>{var e={860:e=>{"use strict";e.exports=require("express")},470:e=>{"use strict";e.exports=require("fs-extra")},13:e=>{"use strict";e.exports=require("mongodb")},738:e=>{"use strict";e.exports=require("multer")},109:e=>{"use strict";e.exports=require("sanitize-html")},441:e=>{"use strict";e.exports=require("sharp")},17:e=>{"use strict";e.exports=require("path")}},t={};function o(a){var i=t[a];if(void 0!==i)return i.exports;var n=t[a]={exports:{}};return e[a](n,n.exports,o),n.exports}(()=>{const e=o(860),{MongoClient:t,ObjectId:a}=o(13),i=o(738)(),n=o(109),s=o(470),l=o(441),r=o(17);let d;s.ensureDirSync(r.join("public","uploaded-photos"));const c=e();function p(e,t,o){"string"!=typeof e.body.name&&(e.body.name=""),"string"!=typeof e.body.species&&(e.body.species=""),"string"!=typeof e.body._id&&(e.body._id=""),e.cleanData={name:n(rew.body.name.trim(),{allowedTags:[],allowedAttributes:{}}),species:n(rew.body.species.trim(),{allowedTags:[],allowedAttributes:{}})}}c.set("view engine","ejs"),c.set("views","./views"),c.use(e.static("public")),c.use(e.json()),c.use(e.urlencoded({extended:!1})),c.get("/",(async(e,t)=>{const o=await d.collection("animals").find().toArray();console.log(o),t.render("home",{allAnimals:o})})),c.use((function(e,t,o){t.set("WWW-Authenticate","Basic realm='Our MERN App'"),"Basic YWRtaW46YWRtaW4="==e.headers.authorization?o():(console.log(e.headers.authorization),t.status(401).send("try again"))})),c.get("/admin",((e,t)=>{t.render("admin")})),c.get("/api/animals",(async(e,t)=>{const o=await d.collection("animals").find().toArray();t.json(o)})),c.post("/create-animal",i.single("photo"),p,(async(e,t)=>{if(e.file){const t=`${Date.now()}.jpg`;await l(e.file.buffer).resize(844,456).jpeg({quality:60}).toFile(r.join("public","uploaded-photos",t)),e.cleanData.photo=t}console.log(e.body);const o=await d.collection("animals").insertOne(e.cleanData),i=await d.collection("animals").findOne({_id:new a(o.insertedId)});t.send(i)})),c.delete("/animal/:id",(async(e,t)=>{"string"!=typeof e.params.id&&(e.params.id="");const o=await d.collection("animals").findOne({_id:new a(e.params.id)});o.photo&&s.remove(r.join("public","uploaded-photos",o.photo)),d.collection("animals").deleteOne({_id:new a(e.params.id)}),t.send("Deleted animal")})),c.post("/update-animal",i.single("photo"),p,(async(e,t)=>{if(e.file){const o=`${Date.now()}.jpg`;await l(e.file.buffer).resize(844,456).jpeg({quality:60}).toFile(r.join("public","uploaded-photos",o)),e.cleanData.photo=o;const i=await d.collection("animals").findOneAndUpdate({_id:new a(e.body._id)},{$set:e.cleanData});i.value.photo&&s.remove(r.join("public","uploaded-photos",i.value.photo)),t.send(o)}else d.collection("animals").findOneAndUpdate({_id:new a(e.body._id)},{$set:e.cleanData}),t.send(!1)})),async function(){const e=new t("mongodb://root:root@localhost:27017/MernApp?&authSource=admin");await e.connect(),d=e.db(),c.listen(3e3)}()})()})();