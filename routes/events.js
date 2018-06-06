const router = require("express").Router()
const bd = require("../data")

// define the home page route
router.get("/", (req, res) => {
  return res.json(bd.events.findAll(req.query))
})

router.post("/", (req, res) => {
  return res.json({
    meta: {},
    result: bd.events.insert(req.body)
  })
})

// define the about route
router.get("/:id", (req, res) => {
  return res.json({
    meta: "Ua ha ha",
    result: bd.events.findById(req.params.id)
  })
})

module.exports = router
