import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: String,
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: Number,
  category: String,
  thumbnails: [String]
});

// 🔥 plugin de paginación
productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(productCollection, productSchema);

export default ProductModel;