import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'

const ProductPreview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addToCart } = useCart()

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [products, id]
  )

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '')
      setSelectedColor(product.colors[0] || '')
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-navy mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">
            The item you are looking for may have been moved or no longer exists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
            >
              Go Back
            </button>
            <Link
              to="/shop"
              className="px-6 py-3 rounded-lg bg-coral text-white font-semibold hover:bg-coral/90"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, selectedColor })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-coral mb-6 inline-flex items-center gap-2"
        >
          <span>&larr;</span>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl shadow-md p-6 lg:p-10">
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Quality: {product.quality}</span>
              <span>Category: {product.category}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.brand}</p>
              <p className="text-4xl font-semibold text-navy">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
                        selectedSize === size
                          ? 'border-navy bg-navy text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Select Color</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color ? 'border-coral' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Premium craftsmanship meets everyday comfort. Each piece is tailored with breathable fabrics,
                durable stitching, and ready for your personalized touch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy/90"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-coral text-white py-3 rounded-lg font-semibold hover:bg-coral/90"
                >
                  Buy Now
                </button>
              </div>

              <button
                onClick={() => navigate(`/customize?product=${product.id}`)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Customize this Product
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">You may also like</h2>
              <Link to="/shop" className="text-sm font-medium text-coral hover:text-coral/80">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-navy font-semibold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPreview


