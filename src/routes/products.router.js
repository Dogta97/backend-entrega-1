import { Router } from 'express'
import ProductModel from '../models/Product.model.js'

const router = Router()

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category, status, sort } = req.query

  let query = {}

  if (category) query.category = category
  if (status) query.status = status === "true"

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}
  }

  const result = await ProductModel.paginate(query, options)

  res.json(result)
})

router.get('/:pid', async (req, res) => {
  const product = await ProductModel.findById(req.params.pid)
  if (!product) return res.status(404).send('Producto no encontrado')
  res.json(product)
})

router.post('/', async (req, res) => {
  const product = await ProductModel.create(req.body)
  res.status(201).json(product)
})

router.put('/:pid', async (req, res) => {
  const updated = await ProductModel.findByIdAndUpdate(
    req.params.pid,
    req.body,
    { new: true }
  )
  if (!updated) return res.status(404).send('Producto no encontrado')
  res.json(updated)
})

router.delete('/:pid', async (req, res) => {
  await ProductModel.findByIdAndDelete(req.params.pid)
  res.sendStatus(204)
})

export default router