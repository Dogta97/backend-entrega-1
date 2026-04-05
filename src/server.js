import app from './app.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ProductModel from './models/Product.model.js'

dotenv.config({ path: './.env' })

console.log("URI:", process.env.MONGO_URI)

const PORT = 8080

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
    .then(() => console.log("🟢 Conectado a MongoDB"))
    .catch(err => console.log("🔴 Error Mongo:", err))

const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})

const io = new Server(httpServer)

app.set('io', io)

io.on("connection", async (socket) => {

    console.log("Cliente conectado")

    const products = await ProductModel.find()
    socket.emit("updateProducts", products)

    socket.on("addProduct", async (product) => {

        await ProductModel.create({
            title: product.title,
            description: "desc",
            code: Date.now().toString(),
            price: product.price,
            status: true,
            stock: 10,
            category: "general",
            thumbnails: []
        })

        const updatedProducts = await ProductModel.find()
        io.emit("updateProducts", updatedProducts)
    })

    socket.on("deleteProduct", async (id) => {
        await ProductModel.findByIdAndDelete(id)
        const products = await ProductModel.find()
        io.emit("updateProducts", products)
    })

    socket.on("disconnect", () => {
        console.log("Cliente desconectado")
    })
})