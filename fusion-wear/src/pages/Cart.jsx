import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const shipping = 500 // ₹500 (5.99 USD * 83 ≈ 500)
  const tax = getTotalPrice() * 0.1
  const total = getTotalPrice() + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-navy mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <Link
              to="/shop"
              className="bg-coral text-white px-8 py-3 rounded-lg font-semibold hover:bg-coral/90 inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => {
              const itemPrice = item.product.price + (item.customization ? 415 : 0)
              return (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full sm:w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.product.brand} - {item.product.quality}</p>
                      {item.customization && (
                        <div className="mb-2 text-sm text-coral">
                          ✓ Customized Design
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-medium text-gray-700">Quantity:</label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-navy">
                            ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-red-500 hover:text-red-700 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shipping.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{Math.round(tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-semibold text-navy">
                    <span>Total</span>
                    <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-coral text-white py-3 px-6 rounded-lg hover:bg-coral/90 font-semibold mb-4"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/shop"
                className="block text-center text-gray-600 hover:text-coral"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

