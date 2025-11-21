import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import AddressSelector from './AddressSelector'
import menImage from '../image1/8905875565703-18.jpg'
import womenImage from '../image1/61GwQeFyvoL._AC_UY1100_.jpg'
import kidsImage from '../image1/download.jpg'

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '6-143',
    address: 'Lenin Nagar, Meerpet',
    pincode: '500097',
    fullAddress: '6-143, Lenin Nagar, Meerpet, Telangana 500097, India'
  })
  const { getCartCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleAddressClick = () => {
    setShowAddressSelector(true)
  }

  const handleSelectAddress = (address) => {
    setDeliveryAddress({
      name: address.name,
      address: address.address,
      pincode: address.pincode,
      fullAddress: address.fullAddress || `${address.address}, ${address.pincode}`
    })
    // Save to localStorage for persistence
    localStorage.setItem('deliveryAddress', JSON.stringify({
      name: address.name,
      address: address.address,
      pincode: address.pincode,
      fullAddress: address.fullAddress || `${address.address}, ${address.pincode}`
    }))
  }

  useEffect(() => {
    // Load saved address from localStorage
    const savedAddress = localStorage.getItem('deliveryAddress')
    if (savedAddress) {
      try {
        setDeliveryAddress(JSON.parse(savedAddress))
      } catch (e) {
        console.error('Error parsing saved address:', e)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const ProfileButton = ({ containerClasses = '', label }) => (
    <div className={`relative ${containerClasses}`}>
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="p-2 text-gray-700 hover:text-coral transition-colors"
        aria-label="Profile menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
      {showProfileMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout()
                  setShowProfileMenu(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
      {label && <span className="mt-1 text-xs font-medium text-gray-700">{label}</span>}
    </div>
  )

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isSticky ? 'bg-white shadow-lg' : 'bg-gradient-to-b from-rose-50 via-white to-white/90 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center justify-between h-20">
          {/* Logo + Address + Wallet */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-navy">Fusion Wear</span>
            </Link>
            <button 
              onClick={handleAddressClick}
              className="flex items-center space-x-3 rounded-2xl border border-gray-100 bg-white px-4 py-2 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                <svg className="h-5 w-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.08em] text-gray-500 font-medium">DELIVER TO</p>
                <p className="text-sm font-semibold text-gray-900">{deliveryAddress.name} - {deliveryAddress.address}</p>
              </div>
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="rounded-full bg-green-100 px-4 py-1.5 shadow-sm text-green-700 text-sm font-semibold flex items-center">
              ₹0
              <svg className="ml-1.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 4a1 1 0 011 1v1h2a1 1 0 010 2h-2v2h2a1 1 0 010 2h-2v1a1 1 0 11-2 0v-1h-2a1 1 0 010-2h2V8h-2a1 1 0 110-2h2V5a1 1 0 011-1z" />
              </svg>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-coral transition-colors">
              Home
            </Link>
            <Link to="/shop?category=men" className="text-gray-700 hover:text-coral transition-colors">
              Men
            </Link>
            <Link to="/shop?category=women" className="text-gray-700 hover:text-coral transition-colors">
              Women
            </Link>
            <Link to="/shop?category=kids" className="text-gray-700 hover:text-coral transition-colors">
              Kids
            </Link>
            <Link to="/customize" className="text-gray-700 hover:text-coral transition-colors">
              Customize
            </Link>
          </div>

          {/* Search, Cart, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral w-48"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-coral transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-coral text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Profile Icon */}
            <ProfileButton />

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile UI */}
        <div className="md:hidden pb-4 space-y-3 pt-2">
          {/* Top Bar: Logo + Search + Icons */}
          <div className="flex items-center space-x-2 px-2">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-navy flex items-center justify-center">
                <span className="text-white font-bold text-lg">FW</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product, brand..."
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral focus:bg-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-coral"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Location Bar */}
          <div className="flex items-center justify-between px-2">
            <button 
              onClick={handleAddressClick}
              className="flex items-center space-x-2 flex-1"
            >
              <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-black truncate">
                {deliveryAddress.fullAddress || `${deliveryAddress.name}, ${deliveryAddress.address}, ${deliveryAddress.pincode}`}
              </span>
            </button>
            <button 
              onClick={handleAddressClick}
              className="text-blue-600 text-sm font-medium ml-2 flex-shrink-0"
            >
              Change
            </button>
          </div>

          {/* Category Navigation */}
          <div className="flex items-center gap-4 px-2 overflow-x-auto scrollbar-hide">
            {/* Home */}
            <Link
              to="/"
              className="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                location.pathname === '/' ? 'bg-gray-200' : 'bg-gray-100'
              }`}>
                <svg className={`h-6 w-6 ${location.pathname === '/' ? 'text-black' : 'text-gray-600'}`} fill={location.pathname === '/' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className={`text-xs font-medium ${location.pathname === '/' ? 'text-black' : 'text-gray-700'}`}>Home</span>
              {location.pathname === '/' && <div className="h-0.5 w-full bg-black"></div>}
            </Link>

            {/* Men */}
            <Link
              to="/shop?category=men"
              className="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div className={`h-12 w-12 rounded-full overflow-hidden ${
                location.search.includes('category=men') ? 'ring-2 ring-black' : ''
              }`}>
                <img 
                  src={menImage} 
                  alt="Men" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className={`text-xs font-medium ${location.search.includes('category=men') ? 'text-black' : 'text-gray-700'}`}>Men</span>
              {location.search.includes('category=men') && <div className="h-0.5 w-full bg-black"></div>}
            </Link>

            {/* Women */}
            <Link
              to="/shop?category=women"
              className="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div className={`h-12 w-12 rounded-full overflow-hidden ${
                location.search.includes('category=women') ? 'ring-2 ring-black' : ''
              }`}>
                <img 
                  src={womenImage} 
                  alt="Women" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className={`text-xs font-medium ${location.search.includes('category=women') ? 'text-black' : 'text-gray-700'}`}>Women</span>
              {location.search.includes('category=women') && <div className="h-0.5 w-full bg-black"></div>}
            </Link>

            {/* Kids */}
            <Link
              to="/shop?category=kids"
              className="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div className={`h-12 w-12 rounded-full overflow-hidden ${
                location.search.includes('category=kids') ? 'ring-2 ring-black' : ''
              }`}>
                <img 
                  src={kidsImage} 
                  alt="Kids" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className={`text-xs font-medium ${location.search.includes('category=kids') ? 'text-black' : 'text-gray-700'}`}>Kids</span>
              {location.search.includes('category=kids') && <div className="h-0.5 w-full bg-black"></div>}
            </Link>

            {/* Customize */}
            <Link
              to="/customize"
              className="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                location.pathname === '/customize' ? 'bg-gray-200' : 'bg-gray-100'
              }`}>
                <svg className={`h-7 w-7 ${location.pathname === '/customize' ? 'text-black' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8M8 6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2M8 6v10h8V6M8 16v2a2 2 0 002 2h4a2 2 0 002-2v-2" />
                </svg>
              </div>
              <span className={`text-xs font-medium ${location.pathname === '/customize' ? 'text-black' : 'text-gray-700'}`}>Customize</span>
              {location.pathname === '/customize' && <div className="h-0.5 w-full bg-black"></div>}
            </Link>
          </div>
        </div>
      </div>

      {/* Address Selector Modal */}
      <AddressSelector
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSelectAddress={handleSelectAddress}
        selectedAddress={deliveryAddress}
      />
    </nav>
  )
}

export default Navbar

