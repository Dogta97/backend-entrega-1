import { Router } from 'express'
import ProductModel from '../models/Product.model.js'
import CartModel from '../models/Cart.model.js'

const router = Router()


router.get('/products', async (req, res) => {
  const { page = 1 } = req.query

  const result = await ProductModel.paginate({}, { page, limit: 10 })

  res.render('products', {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage
  })
})

router.get('/products/:pid', async (req, res) => {
  const product = await ProductModel.findById(req.params.pid)

  res.render('productDetail', { product })
})


router.get('/carts/:cid', async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate('products.product')

  res.render('cart', { cart })
})

export default router