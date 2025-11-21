import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductCard from '../components/ProductCard'
import menBanner from '../image1/Untitled design.png'
import womenBanner from '../image1/Beige and Brown Aesthetic Fashion Facebook Cover.png'

const Shop = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products } = useProducts()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    gender: searchParams.get('gender') || 'all',
    size: 'all',
    color: 'all',
    brand: 'all',
    quality: 'all',
    minPrice: 0,
    maxPrice: 8300, // ₹8300 (100 USD * 83)
    search: searchParams.get('search') || ''
  })

  // Sync filters with URL params when they change
  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    setFilters(prev => ({
      ...prev,
      category,
      search
    }))
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.category !== 'all' && product.category !== filters.category) return false
      if (filters.gender !== 'all' && product.category !== filters.gender) return false
      if (filters.brand !== 'all' && product.brand !== filters.brand) return false
      if (filters.quality !== 'all' && product.quality !== filters.quality) return false
      if (filters.color !== 'all' && !product.colors.includes(filters.color)) return false
      if (filters.size !== 'all' && !product.sizes.includes(filters.size)) return false
      if (product.price < filters.minPrice || product.price > filters.maxPrice) return false
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) && !product.type?.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [products, filters])

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    const newSearchParams = new URLSearchParams()
    if (newFilters.category !== 'all') newSearchParams.set('category', newFilters.category)
    if (newFilters.search) newSearchParams.set('search', newFilters.search)
    navigate({ search: newSearchParams.toString() })
  }

  const handleQuickFilter = (searchTerm, originCategory = null) => {
    const params = new URLSearchParams()
    if (searchTerm) {
      params.set('search', searchTerm)
      params.set('quick', searchTerm)
      if (originCategory) {
        params.set('origin', originCategory)
      }
    } else {
      const origin = searchParams.get('origin')
      if (origin) {
        params.set('category', origin)
      }
    }
    navigate({ search: params.toString() })
  }

  const activeQuickFilter = searchParams.get('quick') || ''

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Shop T-Shirts</h1>

        {/* Men's Section Promotional Banner */}
        {filters.category === 'men' && (
          <>
            <div className="mb-8 relative overflow-hidden rounded-lg h-[300px] md:h-[380px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${menBanner})`,
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>
              <div className="relative h-full flex flex-col justify-center items-start p-5 md:p-10 text-white">
                <div className="mb-3 uppercase tracking-[0.35em] text-xs md:text-sm text-gray-300">
                  Exclusive Men’s Collection
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-3xl md:text-5xl font-black">50%</h2>
                  <div className="uppercase text-xs md:text-sm tracking-[0.4em] text-gray-200">
                    Special Offer
                  </div>
                </div>
                <p className="text-sm md:text-base mb-4 opacity-90 max-w-xl">
                  Modern silhouettes, luxe fabrics, and everyday staples tailored to perfection.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => updateFilter('category', 'men')}
                    className="bg-coral text-white px-5 py-2 rounded-lg font-semibold hover:bg-coral/90 transition-colors text-xs"
                  >
                    Shop Now
                  </button>
                  <button
                    onClick={() => {
                      updateFilter('category', 'men')
                      updateFilter('quality', 'Premium')
                    }}
                    className="bg-white text-navy px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs"
                  >
                    Explore Premium
                  </button>
                </div>
              </div>
              <div className="absolute inset-y-6 right-6 opacity-30 hidden md:block">
                <span className="text-6xl font-black text-white tracking-[0.5em]">MEN</span>
              </div>
            </div>

            {/* T-Shirts and Hoodies Options */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[350px]">
              {/* Left Section - Hoodies */}
              <div className="relative overflow-hidden rounded-lg group bg-white">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200)',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center gap-4 p-6 md:p-8 text-white text-center">
                  <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Hoodies</h2>
                  {activeQuickFilter === 'hoodie' ? (
                    <button
                      onClick={() => handleQuickFilter('')}
                      className="bg-white text-navy px-5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickFilter('hoodie', 'men')}
                      className="bg-coral text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-coral/90 transition-colors"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>

              {/* Right Section - T-Shirts */}
              <div className="relative overflow-hidden rounded-lg group bg-gray-500">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200)',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center gap-4 p-6 md:p-8 text-white text-center">
                  <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">T-Shirts</h2>
                  {activeQuickFilter === 't-shirt' ? (
                    <button
                      onClick={() => handleQuickFilter('')}
                      className="bg-white text-navy px-5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickFilter('t-shirt', 'men')}
                      className="bg-coral text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-coral/90 transition-colors"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Women's Section Promotional Banner */}
        {filters.category === 'women' && (
          <>
            <div className="mb-8 relative overflow-hidden rounded-lg h-[300px] md:h-[380px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${womenBanner})`,
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-gray-900/60" />
              </div>
              <div className="relative h-full flex flex-col justify-end items-center text-center p-4 md:p-8 text-gray-900">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => updateFilter('category', 'women')}
                    className="bg-coral text-white px-5 py-2 rounded-lg font-semibold hover:bg-coral/90 transition-colors text-xs"
                  >
                    Shop Now
                  </button>
                  <button
                    onClick={() => {
                      updateFilter('category', 'women')
                      updateFilter('quality', 'Designer')
                    }}
                    className="bg-white text-navy px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs"
                  >
                    Explore Designer
                  </button>
                </div>
              </div>
              {/* Large Brand Logo Overlay */}
              <div className="absolute top-2 right-2 opacity-20">
                <span className="text-4xl md:text-5xl font-black text-white">FUSHON</span>
              </div>
            </div>

            {/* T-Shirts and Hoodies Options */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[350px]">
              {/* Left Section - Hoodies */}
              <div className="relative overflow-hidden rounded-lg group bg-white">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200)',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center gap-4 p-6 md:p-8 text-white text-center">
                  <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Hoodies</h2>
                  {activeQuickFilter === 'hoodie' ? (
                    <button
                      onClick={() => handleQuickFilter('')}
                      className="bg-white text-navy px-5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickFilter('hoodie', 'women')}
                      className="bg-coral text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-coral/90 transition-colors"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>

              {/* Right Section - T-Shirts */}
              <div className="relative overflow-hidden rounded-lg group bg-gray-500">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200)',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center gap-4 p-6 md:p-8 text-white text-center">
                  <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">T-Shirts</h2>
                  {activeQuickFilter === 't-shirt' ? (
                    <button
                      onClick={() => handleQuickFilter('')}
                      className="bg-white text-navy px-5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickFilter('t-shirt', 'women')}
                      className="bg-coral text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-coral/90 transition-colors"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Kids Section */}
        {filters.category === 'kids' && (
          <>
            {/* T-Shirts and Hoodies Options */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[350px]">
              {/* Left Section - Hoodies */}
              <div className="relative overflow-hidden rounded-lg group bg-white">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200)',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center gap-4 p-6 md:p-8 text-white text-center">
                  <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Hoodies</h2>
                  {activeQuickFilter === 'hoodie' ? (
                    <button
                      onClick={() => handleQuickFilter('')}
                      className="bg-white text-navy px-5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickFilter('hoodie', 'kids')}
                      className="bg-coral text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-coral/90 transition-colors"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>

              {/* Right Section - T-Shirts */}
              <div className="relative overflow-hidden rounded-lg group bg-gray-500">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200)',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center gap-4 p-6 md:p-8 text-white text-center">
                  <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">T-Shirts</h2>
                  {activeQuickFilter === 't-shirt' ? (
                    <button
                      onClick={() => handleQuickFilter('')}
                      className="bg-white text-navy px-5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickFilter('t-shirt', 'kids')}
                      className="bg-coral text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-coral/90 transition-colors"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Products Grid - Show when:
            - No category filter (all products)
            - Category filter is set AND quick filter is active (showing hoodie/t-shirt products)
        */}
        {(filters.category === 'all' || activeQuickFilter !== '') && (
          <div>
              <div className="mb-4 text-gray-600">
                Showing {filteredProducts.length} products
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop

