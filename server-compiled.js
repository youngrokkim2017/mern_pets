(()=>{var e={860:e=>{"use strict";e.exports=require("express")},13:e=>{"use strict";e.exports=require("mongodb")}},t={};function o(n){var r=t[n];if(void 0!==r)return r.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,o),s.exports}(()=>{const e=o(860),{MongoClient:t}=o(13);let n;const r=e();r.set("view engine","ejs"),r.set("views","./views"),r.use(e.static("public")),r.get("/",(async(e,t)=>{const o=await n.collection("animals").find().toArray();console.log(o),t.render("home",{allAnimals:o})})),r.get("/admin",((e,t)=>{t.render("admin")})),async function(){const e=new t("mongodb://root:root@localhost:27017/MernApp?&authSource=admin");await e.connect(),n=e.db(),r.listen(3e3)}()})()})();