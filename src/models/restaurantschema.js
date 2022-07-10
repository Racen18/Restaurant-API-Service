const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    restaurantType: {
        type: String,
        required: true
    },
    restaurantStyle: {
        type: String,
        required: true
    },
    restaurantLocation: {
        type: String,
        required: true
    },
    restaurantRating: {
        type: Number
    },
    restaurantImage: {
        type: Buffer,
        default: null
    },
    restaurantContent: {
        type: String,
        default: 'Content goes here...!'
    }
})

restaurantSchema.methods.toJSON = function () {
    const restaurant = this
    const restaurantObject = restaurant.toObject()

    delete restaurantObject.restaurantImage

    return restaurantObject
}

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant