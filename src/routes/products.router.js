import { Router } from 'express'
import ProductModel from '../models/Product.model.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, sort } = req.query

    let query = {}

    if (category) {
      query.category = category
    }

    if (status !== undefined) {
      query.status = status === "true"
    }

    let options = {
      page: parseInt(page),
      limit: parseInt(limit)
    }

  
    if (sort === "asc") {
      options.sort = { price: 1 }
    } else if (sort === "desc") {
      options.sort = { price: -1 }
    }

    const result = await ProductModel.paginate(query, options)

    res.json(result)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



router.get('/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid)

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(product)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



router.post('/', async (req, res) => {
  try {
    const product = await ProductModel.create(req.body)
    res.status(201).json(product)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



router.put('/:pid', async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(updated)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.pid)

    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json({ message: 'Producto eliminado' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router