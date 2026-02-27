    const { ObjectId } = require("mongodb")
    const express = require('express')
    const router = express.Router()

    const options = { returnDocument: 'after' } // Return the updated document
    
    router.get('/search/:id/:searchTerm', async (req, res) => {   
      const collection = req.collection
      const { id, searchTerm } = req.params
      const data = await collection.find(
        { 
        _id: new ObjectId(id),
        'jobs.company': { $regex: searchTerm, $options: 'i' }
        },
        {
          projection: {
            _id: 1,
            jobs: {
              $filter: {
                input: '$jobs',
                as: 'job',
                cond: { $regexMatch: { input: '$$job.company', regex: searchTerm, options: 'i' } }
              }
            }
          }
        }
      ).toArray()
      if (data[0] && data[0].jobs) {
        res.json(data[0].jobs)
      } else {
        res.json([])
      }
    })
    // Update existing account password or jobs data
    router.put('/', async (req, res) => {
      const collection = req.collection
      const newData = req.body
      const filter = { email: newData.email };
      const form = newData.form

      if (form === 'forgot-password' && newData.hashedPassword) {
        const update = { $set: { hashedPassword: newData.hashedPassword }}
        const result = await collection.findOneAndUpdate(filter, update, options)
        res.json(result)
      } else if (form === 'update-jobs' && newData.jobs) {
        const update = { $set: { jobs: newData.jobs }}
        const result = await collection.findOneAndUpdate(filter, update, options)
        res.json(result)
      } else if (form === 'update-tasks' && newData.tasks) {
        const update = { $set: { tasks: newData.tasks }}
        const result = await collection.findOneAndUpdate(filter, update, options)
        res.json(result)
      } else if (form === 'update-notes' && newData.notes) {
        const update = { $set: { notes: newData.notes }}
        const result = await collection.findOneAndUpdate(filter, update, options)
        res.json(result)
      } else {
        res.json({})
      }
    })
    // Create account/sign-in/log-out
    router.post('/', async (req, res) => {
      const collection = req.collection
      const { email, form } = req.body
      if (form === 'log-out') {
        res.json({})
      } else if (form === 'sign-in') {
        const data = await collection.findOne({ email })
        res.json(data)
      } else if (form === 'create-account') {
        const newData = req.body
        const result = await collection.insertOne(newData, options)
        res.json(result)
      } else {
        res.json({})
      }
    })

    module.exports = router