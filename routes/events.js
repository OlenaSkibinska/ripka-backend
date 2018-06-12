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
  res.send(printEvent(response))
})

router.delete("/:id", async (req, res) => {
  let data = req.body;

  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .findOneAndDelete({_id: ObjectID(data._id)}
    );
  res.send(printEvent(response));
});

router.get('/name_like=:name', async (req, res) => {
  let name = req.params.name;
  console.log(req.params.name)
  const response = await db
    .get()
    .collection(COLLECTION_NAME)
    .findOne({"name": name});

  res.send(response);
});


module.exports = router
