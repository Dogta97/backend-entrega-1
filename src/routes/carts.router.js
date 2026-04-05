import { Router } from 'express'
import CartModel from '../models/Cart.model.js'

const router = Router()


router.post('/', async (req, res) => {
  const cart = await CartModel.create({ products: [] })
  res.status(201).json(cart)
})


router.get('/:cid', async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate('products.product')

  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  res.json(cart)
})

router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params

  const cart = await CartModel.findById(cid)
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  const existing = cart.products.find(
    p => p.product.toString() === pid
  )

  if (existing) {
    existing.quantity++
  } else {
    cart.products.push({ product: pid, quantity: 1 })
  }

  await cart.save()
  res.json(cart)
})


router.delete('/:cid/products/:pid', async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)

  cart.products = cart.products.filter(
    p => p.product.toString() !== req.params.pid
  )

  await cart.save()
  res.json(cart)
})

router.put('/:cid', async (req, res) => {
  const { products } = req.body

  const cart = await CartModel.findByIdAndUpdate(
    req.params.cid,
    { products },
    { new: true }
  )

  res.json(cart)
})

router.put('/:cid/products/:pid', async (req, res) => {
  const { quantity } = req.body

  const cart = await CartModel.findById(req.params.cid)

  const product = cart.products.find(
    p => p.product.toString() === req.params.pid
  )

  if (product) {
    product.quantity = quantity
  }

  await cart.save()
  res.json(cart)
})


router.delete('/:cid', async (req, res) => {
  const cart = await CartModel.findByIdAndUpdate(
    req.params.cid,
    { products: [] },
    { new: true }
  )

  res.json({ message: 'Carrito vaciado', cart })
})

export default router