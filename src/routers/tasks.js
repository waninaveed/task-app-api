const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')


router.post('/tasks',auth ,async (req, res) => {
    // const tasks = new Task(req.body)
    const tasks = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await tasks.save()
        res.status(201).send(tasks)
    } catch (e) {
        res.send(400).send(e)
    }

    // tasks.save().then(() => {
    //     res.status(201).send(tasks)  
    // }).catch((e) => {
    //     res.send(400).send(e)
    // })
})
// GET / tasks?completed=true
//  GET / tasks?limit=10&skip=0
//  GET / tasks?sortBy=createdAt:asc/desc
//   |- createdAt: -1,  // asc 1 and desc -1
//   |- completed: -1 // -1 for true and 1 for false as default value
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }

    try{
        // const tasks = await Task.find({ 
        //     owner: req.user._id
        // }) HERE BELOW IS DIFFERENT WAY TO DO THE SAME THING POPULATE()

        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }

//    Task.find({}).then((tasks) => {
//         res.send(tasks)
//    }).catch(() => {
//         res.status(500).send(e)
//    })
})

router.get('/tasks/:id',auth ,async (req,res) => {
    const _id = req.params.id

    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne( {_id, owner:req.user._id})

        if(!task){
            return res.status(404).send(req.task)
        }
        res.send(task)
    }catch(e){
        res.send(500).send(e)
    }
    //  ABOVE CODE IS NEW USES ASYNC/AWAIT
    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send(req.task)
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.send(500).send(e)
    // })
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates!!'})
    }

    try{
        const task = await Task.findOne( { _id: req.params.id, owner: req.user._id})
      
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id', auth, async(req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task){
            return res.status(404).send(e)
        }
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
        
    }
})



module.exports = router
