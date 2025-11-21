import { createContext, useContext, useState, useEffect } from 'react'
import { productsAPI } from '../services/api'

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products from backend API only (MongoDB)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productsAPI.getAll()
        // Handle different response formats
        const productsList = Array.isArray(data) ? data : (data.products || data.data || [])
        if (productsList.length === 0) {
          setError('No products found')
          setProducts([])
        } else {
          setProducts(productsList)
        }
      } catch (err) {
        console.error('Error fetching products from backend:', err)
        setError(err.message || 'Failed to fetch products from backend')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductsByCategory = (category) => {
    if (!category || category === 'all') return products
    return products.filter(p => p.category === category)
  }

  const getFeaturedProducts = () => {
    // Filter products that have isFeatured: true from MongoDB
    return products.filter(p => p.isFeatured === true).slice(0, 4)
  }

  const refreshProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsAPI.getAll()
      const productsList = Array.isArray(data) ? data : (data.products || data.data || [])
      if (productsList.length === 0) {
        setError('No products found')
        setProducts([])
      } else {
        setProducts(productsList)
      }
    } catch (err) {
      console.error('Error refreshing products:', err)
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      getProductsByCategory,
      getFeaturedProducts,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  )
}

