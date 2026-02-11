import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js'

const router = Router()
const manager = new ProductManager('./src/data/products.json')

router.get('/', async (req, res) => {
  res.json(await manager.getProducts())
})

router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(req.params.pid)
  if (!product) return res.status(404).send('Producto no encontrado')
  res.json(product)
})

router.post('/', async (req, res) => {
  const product = await manager.addProduct(req.body)
  res.status(201).json(product)
})

router.put('/:pid', async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body)
  if (!updated) return res.status(404).send('Producto no encontrado')
  res.json(updated)
})

router.delete('/:pid', async (req, res) => {
  await manager.deleteProduct(req.params.pid)
  res.sendStatus(204)
})

export default router
