const bodyparser = require('body-parser')
const express = require('express')
const { MongoClient } = require("mongodb")
const cors = require('cors')
const app = express()

const dataRoutes = require('./routes/dataRoutes')

// Connect to MongoDB
// Store this in a .env file
const uri = 'mongodb+srv://[get specific url from your mongo account].mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri)
const dbName = 'myDatabase'
const colName = 'myCollection'

app.use(cors())
//app.use(express.json())
app.use(bodyparser.json({ limit: '50mb' }))
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyparser.json())

app.use(function(req, res, next) {
  // TODO: update to match the domain you will make the request from
  res.header('Access-Control-Allow-Origin', '*') 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const options = { returnDocument: 'after' } // Return the updated document

async function connectToDB() {
  try {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(colName)

    app.use('/api/data', (req, res, next) => {
      req.db = db
      req.collection = collection
      next()
    }, dataRoutes)

  } catch (err) {
    console.error(err)
  }
}

connectToDB()

const PORT = process.env.PORT || 8080

app.listen(PORT,
    console.log(`Server started on port ${PORT}`)
)