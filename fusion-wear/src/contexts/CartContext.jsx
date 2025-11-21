import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../services/api'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    try {
      setLoading(true)
      const data = await cartAPI.get()
      const cartItems = Array.isArray(data) ? data : (data.cart || data.items || data.data || [])
      if (cartItems.length > 0) {
        setCart(cartItems)
        localStorage.setItem('cart', JSON.stringify(cartItems))
      }
    } catch (err) {
      console.error('Error fetching cart:', err)
      // Use localStorage cart if backend fails
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          if (Array.isArray(parsed)) {
            setCart(parsed)
          }
        } catch (e) {
          console.error('Error parsing saved cart:', e)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setCart(parsed)
        }
      } catch (e) {
        console.error('Error parsing saved cart:', e)
      }
    }
  }, [])

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart()
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = async (product, customization = null) => {
    const cartItem = {
      id: Date.now().toString(),
      product,
      customization,
      quantity: 1,
      addedAt: new Date().toISOString()
    }
    
    // Update local state immediately
    const newCart = [...cart, cartItem]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))

    // Sync with backend
    try {
      await cartAPI.addItem({
        productId: product.id,
        product,
        customization,
        quantity: 1
      })
      // Refresh cart from backend to get proper IDs
      await fetchCart()
    } catch (err) {
      console.error('Error adding item to cart on backend:', err)
      // Keep local cart even if backend fails
    }
  }

  const removeFromCart = async (id) => {
    // Update local state immediately
    const newCart = cart.filter(item => item.id !== id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))

    // Sync with backend
    try {
      await cartAPI.removeItem(id)
    } catch (err) {
      console.error('Error removing item from cart on backend:', err)
      // Keep local cart even if backend fails
    }
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    // Update local state immediately
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    )
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))

    // Sync with backend
    try {
      await cartAPI.updateItem(id, quantity)
    } catch (err) {
      console.error('Error updating cart item on backend:', err)
      // Keep local cart even if backend fails
    }
  }

  const clearCart = async () => {
    // Update local state immediately
    setCart([])
    localStorage.removeItem('cart')

    // Sync with backend
    try {
      await cartAPI.clear()
    } catch (err) {
      console.error('Error clearing cart on backend:', err)
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const basePrice = item.product.price
      const customizationFee = item.customization ? 415 : 0 // ₹415 (5 USD * 83)
      return total + (basePrice + customizationFee) * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getCartCount,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

