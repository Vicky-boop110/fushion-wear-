import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    navigate('/checkout')
  }

  const getQualityBadgeColor = (quality) => {
    switch (quality) {
      case 'Designer':
        return 'bg-purple-100 text-purple-800'
      case 'Premium':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getQualityBadgeColor(product.quality)}`}>
            {product.quality}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-navy">₹{product.price.toLocaleString('en-IN')}</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-navy text-white py-2 px-4 rounded-lg hover:bg-navy/90 transition-colors text-sm font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-coral text-white py-2 px-4 rounded-lg hover:bg-coral/90 transition-colors text-sm font-medium"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

