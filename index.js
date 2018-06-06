const app = require("express")()
const cors = require("cors")
const bodyParser = require("body-parser")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const usersRoutes = require("./routes/users")
const eventsRoutes = require("./routes/events")

const PORT = 8080

app.use(cors())

app.use("/api/users", usersRoutes)
app.use("/api/events", eventsRoutes)

app.listen(PORT, () => console.log(`Go to http://localhost:${PORT}/`))
