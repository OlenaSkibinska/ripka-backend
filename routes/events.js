const router = require("express").Router()
const { ObjectID } = require("mongodb")
const db = require("../data/db")
const { assoc, omit, compose } = require("ramda")

const COLLECTION_NAME = "event"

//prettier-ignore
const printEvent = (data) => compose(
  // console.log(data._id),
  omit(["_id"]),
  assoc("id", data._id),
)(data)

router.post("/", async (req, res) => {
  let data = req.body

  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .insert(data)

  data = printEvent(data)

  res.send(data)
})

router.get("/", async (req, res) => {
  const { offset = 0, count = 5, q} = req.query

  let search = {}

  if(q){
    search = {
      $or: [{ name: { $regex: q } }, { category: { $regex: q }}, {organization:  { $regex: q }}]
    }
  }

  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .find(search)

  const data = await response
    .skip(Number(offset))
    .limit(Number(count))
    .toArray()

  res.send({
    meta: {
      total: await response.count()
    },
    result: data.map(printEvent)
  })
})

router.get("/:id", async (req, res) => {
  const id = req.params.id

  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .findOne({ _id: ObjectID(id) })

  res.send(printEvent(response))
})

router.patch("/:id", async (req, res) => {
  const id = req.params.id
  const data = req.body

  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: ObjectID(id) },
      { $set: data},
      { returnOriginal: false }
    )
  res.send(printEvent(response.value))
})

router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  await db
    .get()
    .collection(COLLECTION_NAME)
    .findOneAndDelete({_id: ObjectID(id)})

  res.send({ok: true});
});



module.exports = router
