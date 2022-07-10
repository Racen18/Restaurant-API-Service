const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Restaurant = require('../models/restaurantschema')
const router = express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/restaurant', async (req, res) => {
    try {
        Restaurant.insertMany(req.body).then((output) => {
            res.status(201).send(output)
        })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/restaurants', async (req, res) => {
    try {
        const restaurant = await Restaurant.find(req.body.filter)
        .limit(req.body.limit)
        .skip(req.body.limit * req.body.page)
        .sort(req.body.sort)
        res.send(restaurant)
    } catch (e) {
        res.status(404).send({ error: 'No data found' })
    }
})

router.post('/restaurant/image/:id', upload.single('image'), async (req, res) => {
    const _id = req.params.id
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        const restaurant = await Restaurant.findByIdAndUpdate(_id)
        restaurant.restaurantImage = buffer
        await restaurant.save()
        res.send(restaurant)
    } catch (e) {
        res.status(404).send({ error: e.message })
    }
})

router.get('/restaurant/search/:key', async (req, res) => {
    try {
        const data = await Restaurant.find({
            "$or": [
                { restaurantName: {$regex: req.params.key, $options: "i"} },
                { restaurantLocation: {$regex: req.params.key, $options: "i"} }
            ]
        })
        res.send(data)
    } catch (e) {
        res.status(404).send({ error: e.message })
    }
})

module.exports = router