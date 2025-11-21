import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import { useProducts } from '../contexts/ProductContext'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'

const Home = () => {
  const { getFeaturedProducts, loading, products } = useProducts()
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const featured = getFeaturedProducts()
      setFeaturedProducts(featured)
    }
  }, [products]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-navy">New & Featured</h2>
            <Link
              to="/shop"
              className="text-coral hover:text-coral/80 font-semibold"
            >
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

