import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    id: 1,
    title: 'Custom Tees Made Just for You',
    subtitle: 'Elevate Your Wardrobe',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
    buttonText: 'Shop Now',
    buttonLink: '/shop'
  },
  {
    id: 2,
    title: 'Express Your Style',
    subtitle: 'Design Your Perfect T-Shirt',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200',
    buttonText: 'Customize Yours',
    buttonLink: '/customize'
  },
  {
    id: 3,
    title: 'Premium Quality',
    subtitle: 'Comfort Meets Style',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200',
    buttonText: 'Explore Collection',
    buttonLink: '/new-featured'
  }
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden mt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            {slides[currentSlide].title}
          </motion.h1>
          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg mb-4"
          >
            {slides[currentSlide].subtitle}
          </motion.p>
          <motion.div
            key={`buttons-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to={slides[currentSlide].buttonLink}
              className="bg-coral text-white px-6 py-2 rounded-lg font-semibold hover:bg-coral/90 transition-colors text-sm"
            >
              {slides[currentSlide].buttonText}
            </Link>
            {currentSlide === 0 && (
              <Link
                to="/customize"
                className="bg-white text-navy px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Customize Yours
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>

    </div>
  )
}

export default Hero

