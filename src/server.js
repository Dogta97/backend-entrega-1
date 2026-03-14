import app from './app.js'
import { Server } from 'socket.io'
import ProductManager from './managers/ProductManager.js'

const PORT = 8080

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
})

const io = new Server(httpServer)

app.set('io', io)

const manager = new ProductManager('./src/data/products.json')


io.on("connection", (socket) => {

    console.log("Cliente conectado")


    manager.getProducts().then(products => {

        console.log("PRODUCTOS:", products)

        socket.emit("updateProducts", products)

    })


    socket.on("addProduct", (product) => {

        console.log("LLEGO PRODUCTO:", product)

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

            console.log("NUEVA LISTA:", products)

            io.emit("updateProducts", products)

        })

    })


    // ✅ DELETE PRODUCTO

    socket.on("deleteProduct", async (id) => {

        console.log("ELIMINAR:", id)

        await manager.deleteProduct(id)

        const products = await manager.getProducts()

        io.emit("updateProducts", products)

    })


    socket.on("disconnect", () => {

        console.log("Cliente desconectado")

    })

})