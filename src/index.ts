import { connectDB } from './db'
import { PORT } from './config'
import app from './app'

connectDB()
app.listen(PORT)
console.log(`server is running at port ${PORT}`)