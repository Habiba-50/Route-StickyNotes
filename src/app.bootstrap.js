
import {  port } from '../config/config.service.js'
import { golbalErrorHandeling } from './common/utils/index.js'
import { connectDB } from './DB/connection.db.js'
import { userRouter } from './modules/index.js'
import express from 'express'
import { noteRouter } from './modules/index.js'

async function bootstrap() {
    const app = express()
    //convert buffer data
    app.use(express.json())

    //DB connection
    await connectDB()
    
    //application routing
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/users', userRouter)
    app.use('/notes', noteRouter)


    //invalid routing
    app.use('{/*dummy}', (req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use(golbalErrorHandeling)
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap