const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

const db = require("./data/db")

const MONOGO_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/ripka"
const PORT = process.env.PORT || 8080

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// API
const usersRoutes = require("./routes/users")
const eventsRoutes = require("./routes/events")

app.use("/api/users", usersRoutes)
app.use("/api/events", eventsRoutes)

// Application static routes
app.use(express.static(path.resolve("build")))

app.use("/*", (req, res) => res.sendFile(path.join(__dirname, "build", "index.html")))

db.connect(MONOGO_URL, err => {
  if (err) return console.log("Unable to connect to Mongo.")
  console.log("Connected to mongo")
  startApp(app)
})

const startApp = app => {
  app.listen(PORT, err => {
    if (err) return console.log("something bad happened", err)
    console.log(`Server is listening on http://localhost:${PORT}/`)
  })
}
