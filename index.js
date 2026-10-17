import express, { json } from 'express'
import { dpConnection } from './database/dp.js'
import { userRouter } from './routers/user.router.js'
import { couponRouter } from './routers/coupon.router.js'
import { categoryRouter } from "./routers/category.router.js"
import { brandRouter } from './routers/brand.router.js'
import { productRouter } from './routers/product.router.js'
import { reviewRouter } from "./routers/review.router.js"
import { subcategoryRouter } from './routers/subcategory.router.js'
import dotenv from 'dotenv'

const app = express()
const port = 5000


dotenv.config()
dpConnection()

app.use(express.json())
app.use('/api/v1', brandRouter)
app.use('/api/v1', categoryRouter)
app.use('/api/v1', couponRouter)
app.use('/api/v1', productRouter)
app.use('/api/v1', reviewRouter)
app.use('/api/v1', subcategoryRouter)
app.use('/users', userRouter)

app.get('/', (req, res) => res.send('Hello AHMED!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))