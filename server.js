import express from 'express'
import cors from 'cors';
import { dbConn } from './database/dbConnection.js'
import { bootstrap } from './src/modules/bootstrap.js'
import { globalError } from './src/middleware/globalError.js'
import { AppError } from './src/utils/appError.js'
// import dotenv from "dotenv"
// dotenv.config()
import 'dotenv/config'
const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(express.json())
bootstrap(app)
app.use('*', (req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404))
})
app.use(globalError)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))