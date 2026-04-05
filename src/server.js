import app from './app.js'
import { Server } from 'socket.io'
import ProductManager from './managers/ProductManager.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

console.log("URI:", process.env.MONGO_URI)

const PORT = 8080

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🟢 Conectado a MongoDB"))
    .catch(err => console.log("🔴 Error Mongo:", err))

const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})

const io = new Server(httpServer)

app.set('io', io)

const manager = new ProductManager('./src/data/products.json')

io.on("connection", (socket) => {

    console.log("Cliente conectado")

    manager.getProducts().then(products => {
        socket.emit("updateProducts", products)
    })

    socket.on("addProduct", (product) => {

        manager.addProduct({
            title: product.title,
            description: "desc",
            code: Date.now().toString(),
            price: product.price,
            status: true,
            stock: 10,
            category: "general",
            thumbnails: []
        })
        .then(() => manager.getProducts())
        .then(products => {
            io.emit("updateProducts", products)
        })
    })

    socket.on("deleteProduct", async (id) => {
        await manager.deleteProduct(id)
        const products = await manager.getProducts()
        io.emit("updateProducts", products)
    })

    socket.on("disconnect", () => {
        console.log("Cliente desconectado")
    })
})