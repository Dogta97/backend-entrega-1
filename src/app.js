import express from "express"
import handlebars from "express-handlebars"
import viewsRouter from './routes/views.router.js'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")
app.use('/', viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

export default app