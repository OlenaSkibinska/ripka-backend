const fs = require("fs")
const data = JSON.parse(fs.readFileSync(__dirname + "/data.json", "utf8"))

const { last } = require("ramda")

const findAll = data => (query = {}) => {
  let result = data

  if (query.offset) {
    const offset = Number(query.offset)
    result = result.slice(offset)
  }

  const count = query.count ? Number(query.count) : 5
  result = result.slice(0, count)

  return { meta: { totalCount: data.length }, result }
}

const findById = data => id => data.find(user => user.id === Number(id))
const insert = (data, key) => payload => {
  const { id } = last(data[key])
  const insertion = { ...payload, id }
  data[key] = [...data[key], insertion]

  return insertion
}

const bd = {
  users: {
    findAll: findAll(data.users),
    findById: findById(data.users),
    insert: insert(data, "users")
  },

  events: {
    findAll: findAll(data.events),
    findById: findById(data.events),
    insert: insert(data, "events")
  }
}

module.exports = bd
