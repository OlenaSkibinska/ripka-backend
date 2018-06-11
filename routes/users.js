const router = require("express").Router()
const { ObjectID } = require("mongodb")
const db = require("../data/db")
const { assoc, omit, compose } = require("ramda")

const COLLECTION_NAME = "user"

//prettier-ignore
const printUser = (data) => compose(
  omit(["_id"]),
  assoc("id", data._id),
)(data)

router.post("/", async (req, res) => {
  let data = req.body

  const responce = await db
    .get()
    .collection(COLLECTION_NAME)
    .insert(data)

  data = printUser(data)

  res.send(data)
})

router.get("/", async (req, res) => {
  const { offset = 0, count = 5 } = req.query

  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .find()

  const data = await response
    .skip(Number(offset))
    .limit(Number(count))
    .toArray()

  res.send({
    meta: {
      total: await response.count()
    },
    result: data.map(printUser)
  })
})

router.get("/:id", async (req, res) => {
  const id = req.params.id

  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .findOne({ _id: ObjectID(id) })

  res.send(printUser(response))
})

module.exports = router
