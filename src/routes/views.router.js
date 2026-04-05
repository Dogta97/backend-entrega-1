import { Router } from 'express'
import ProductModel from '../models/Product.model.js'
import CartModel from '../models/Cart.model.js'

const router = Router()


router.get('/products', async (req, res) => {
  const { page = 1, limit = 10, category, status, sort } = req.query

  let query = {}

  if (category) query.category = category
  if (status) query.status = status === "true"

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    lean: true
  }

  const result = await ProductModel.paginate(query, options)

  res.render('products', {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    currentPage: result.page
  })
})



router.get('/products/:pid', async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean()

  if (!product) {
    return res.status(404).send('Producto no encontrado')
  }

  res.render('productDetail', { product })
})


router.get('/carts/:cid', async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate('products.product')
    .lean()

  if (!cart) {
    return res.status(404).send('Carrito no encontrado')
  }

  res.render('cart', { cart })
})

export default router