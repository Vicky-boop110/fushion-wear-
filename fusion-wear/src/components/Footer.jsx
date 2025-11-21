import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fusion Wear</h3>
            <p className="text-gray-400">
              Custom T-shirts made just for you. Express your style with premium quality and endless customization options.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/shop?category=men" className="hover:text-white">Men</Link></li>
              <li><Link to="/shop?category=women" className="hover:text-white">Women</Link></li>
              <li><Link to="/shop?category=kids" className="hover:text-white">Kids</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/customize" className="hover:text-white">Customize</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>support@fusionwear.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Fashion Street<br />New York, NY 10001</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Fusion Wear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

