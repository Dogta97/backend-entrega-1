import { Router } from "express"
import ProductManager from "../managers/ProductManager.js"
import CartManager from "../managers/CartManager.js"

const router = Router()

const productManager = new ProductManager("./src/data/products.json")
const cartManager = new CartManager("./src/data/carts.json")

const CART_ID = "815e81e5-d705-4606-8f43-41d7ff74dc51"


router.get("/home", async (req, res) => {
    const products = await productManager.getProducts()
    res.render("home", { products })
})


router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts()
    res.render("realTimeProducts", { products })
})

router.get("/products", async (req, res) => {
    let { page = 1, limit = 5, category, stock, sort } = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    let products = await productManager.getProducts()

    if (category) {
        products = products.filter(p => p.category === category)
    }

    if (stock !== undefined && stock !== "") {
        const hasStock = stock === "true"
        products = products.filter(p => hasStock ? p.stock > 0 : p.stock === 0)
    }

    if (sort === "asc") {
        products.sort((a, b) => a.price - b.price)
    } else if (sort === "desc") {
        products.sort((a, b) => b.price - a.price)
    }

    const totalProducts = products.length
    const totalPages = Math.ceil(totalProducts / limit)

    const start = (page - 1) * limit
    const end = start + limit

    const paginatedProducts = products.slice(start, end)

    res.render("home", {
        products: paginatedProducts,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        page,
        cartId: CART_ID
    })
})


router.get("/products/:pid", async (req, res) => {
    const products = await productManager.getProducts()
    const product = products.find(p => p.id === req.params.pid)

    if (!product) return res.send("Producto no encontrado")

    res.render("productDetail", { product, cartId: CART_ID })
})


router.get("/carts/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid)

    if (!cart) return res.send("Carrito no encontrado")

    const products = await productManager.getProducts()

    const cartProducts = cart.products.map(cp => {
        const product = products.find(p => p.id === cp.product)
        return {
            ...product,
            quantity: cp.quantity
        }
    })

    res.render("cart", { products: cartProducts })
})

export default router