const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const restaurantRouter = require('./routers/restaurantService')
const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(restaurantRouter)

app.listen(port, () => {
    console.log('Server is up and running on ' + port)
})