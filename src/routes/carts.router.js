import { Router } from 'express'
import CartManager from '../managers/CartManager.js'

const router = Router()
const manager = new CartManager('./src/data/carts.json')

router.post('/', async (req, res) => {
  const cart = await manager.createCart()
  res.status(201).json(cart)
})

router.get('/:cid', async (req, res) => {
  const cart = await manager.getCartById(req.params.cid)
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  res.json(cart)
})

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await manager.addProductToCart(req.params.cid, req.params.pid)
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  res.json(cart)
})


router.delete('/:cid/products/:pid', async (req, res) => {
  const cart = await manager.removeProductFromCart(req.params.cid, req.params.pid)
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  res.json(cart)
})


router.put('/:cid', async (req, res) => {
  const { products } = req.body

  const cart = await manager.updateCart(req.params.cid, products)
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  res.json(cart)
})


router.put('/:cid/products/:pid', async (req, res) => {
  const { quantity } = req.body

  const cart = await manager.updateProductQuantity(
    req.params.cid,
    req.params.pid,
    quantity
  )

  if (!cart) return res.status(404).json({ error: 'Producto o carrito no encontrado' })

  res.json(cart)
})


router.delete('/:cid', async (req, res) => {
  const cart = await manager.clearCart(req.params.cid)
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  res.json({ message: 'Carrito vaciado', cart })
})

export default router