const MongoClient = require("mongodb").MongoClient
const DB_NAME = "ripka" //TODO: fix this shit

let db = null

exports.connect = (url, done) => {
  if (db) return done()

  MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err)
    db = client.db(DB_NAME)
    done()
  })
}

exports.get = () => db
