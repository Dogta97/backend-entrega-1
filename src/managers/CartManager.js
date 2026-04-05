import fs from 'fs'
import crypto from 'crypto'

export default class CartManager {
  constructor(path) {
    this.path = path
  }

  async getCarts() {
    if (!fs.existsSync(this.path)) return []
    const data = await fs.promises.readFile(this.path, 'utf-8')
    return JSON.parse(data)
  }

  async createCart() {
    const carts = await this.getCarts()

    const newCart = {
      id: crypto.randomUUID(),
      products: []
    }

    carts.push(newCart)
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))

    return newCart
  }

  async getCartById(id) {
    const carts = await this.getCarts()
    return carts.find(c => c.id === id)
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts()
    const cart = carts.find(c => c.id === cid)

    if (!cart) return null

    const productIndex = cart.products.findIndex(p => p.product === pid)

    if (productIndex === -1) {
      cart.products.push({ product: pid, quantity: 1 })
    } else {
      cart.products[productIndex].quantity++
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
    return cart
  }

  async removeProductFromCart(cid, pid) {
    const carts = await this.getCarts()
    const cart = carts.find(c => c.id === cid)

    if (!cart) return null

    cart.products = cart.products.filter(p => p.product !== pid)

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
    return cart
  }

  async updateCart(cid, products) {
    const carts = await this.getCarts()
    const cart = carts.find(c => c.id === cid)

    if (!cart) return null

    cart.products = products

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
    return cart
  }

  async updateProductQuantity(cid, pid, quantity) {
    const carts = await this.getCarts()
    const cart = carts.find(c => c.id === cid)

    if (!cart) return null

    const product = cart.products.find(p => p.product === pid)
    if (!product) return null

    product.quantity = quantity

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
    return cart
  }

  async clearCart(cid) {
    const carts = await this.getCarts()
    const cart = carts.find(c => c.id === cid)

    if (!cart) return null

    cart.products = []

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
    return cart
  }
}