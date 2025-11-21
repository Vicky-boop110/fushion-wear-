import { useLocation, Link } from 'react-router-dom'

const OrderConfirmation = () => {
  const location = useLocation()
  const orderDetails = location.state?.orderDetails

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-navy mb-4">Order Not Found</h1>
          <Link to="/" className="text-coral hover:text-coral/80">Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-navy mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <div className="text-left space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                <p className="text-gray-600">Order Total: <span className="font-semibold text-navy">₹{Math.round(orderDetails.total).toLocaleString('en-IN')}</span></p>
                <p className="text-gray-600">Items: {orderDetails.cart.length}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping To</h3>
                <p className="text-gray-600">
                  {orderDetails.shippingInfo.firstName} {orderDetails.shippingInfo.lastName}<br />
                  {orderDetails.shippingInfo.address}<br />
                  {orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.zipCode}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Custom Designs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orderDetails.cart.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="font-medium text-sm">{item.product.name}</p>
                  {item.customization && (
                    <p className="text-xs text-coral mt-1">✓ Customized</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-coral text-white px-8 py-3 rounded-lg font-semibold hover:bg-coral/90"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation

