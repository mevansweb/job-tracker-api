    const express = require('express')
    const router = express.Router()

    const options = { returnDocument: 'after' } // Return the updated document
    
    router.get('/:id', async (req, res) => {   
      const collection = req.collection
      const { id } = req.params
      const data = await collection.find({ id: id })
      res.json(data)
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