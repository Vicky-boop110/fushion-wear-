import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { SketchPicker } from 'react-color'
import tShirtFront from '../image1/BELLA___CANVAS_3413_Solid_White_Triblend_Front_High_2b9fe5e2-84bc-4bdf-8396-e6acb098f918-removebg-preview.png'
import tShirtBack from '../image1/24940123_55672345_600-removebg-preview.png'
import hoodieFront from '../image1/download-removebg-preview.png'
import hoodieBack from '../image1/images-removebg-preview.png'

const createInitialDesignState = () => ({
  uploadedImage: null,
  imagePosition: { x: 50, y: 50 },
  imageSize: 100,
  imageRotation: 0,
  customText: '',
  textFont: 'Arial',
  textColor: '#000000',
  textPosition: { x: 50, y: 60 }
})

const Customize = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addToCart } = useCart()
  
  const productId = searchParams.get('product')
  const baseProduct = productId ? products.find(p => p.id === productId) : null

  const [selectedGender, setSelectedGender] = useState(baseProduct?.category || 'men')
  const [shirtType, setShirtType] = useState(baseProduct?.id || '1')
  const [apparelType, setApparelType] = useState(baseProduct?.type || 't-shirt')
  const [shirtColor, setShirtColor] = useState('white')
  const [shirtSize, setShirtSize] = useState('M')
  const [designs, setDesigns] = useState({
    front: createInitialDesignState(),
    back: createInitialDesignState()
  })
  const [activeSide, setActiveSide] = useState('front')
  const [dragSide, setDragSide] = useState('front')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isDragging, setIsDragging] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [shirtImageLoaded, setShirtImageLoaded] = useState(false)
  const shirtImageRef = useRef(null)
  const uploadedImageRef = useRef(null) // Cache uploaded images

  const canvasRef = useRef(null)

  const apparelOptions = [
    { value: 't-shirt', label: 'T-Shirts' },
    { value: 'hoodie', label: 'Hoodies' }
  ]

  const apparelProducts = products.filter(p => p.type === apparelType)
  const genderProducts = apparelProducts.filter(p => p.category === selectedGender)
  const selectionPool = genderProducts.length ? genderProducts : apparelProducts
  const selectedProduct = selectionPool.find(p => p.id === shirtType) || selectionPool[0] || products[0]

  const shirtColors = {
    white: '#FFFFFF',
    black: '#000000',
    navy: '#0f1724',
    gray: '#808080',
    red: '#FF0000',
    blue: '#0000FF',
    green: '#008000',
    yellow: '#FFD700',
    orange: '#FFA500',
    pink: '#FFC0CB',
    purple: '#800080',
    maroon: '#800000',
    olive: '#808000',
    teal: '#008080',
    cyan: '#00FFFF',
    lime: '#00FF00',
    brown: '#A52A2A',
    beige: '#F5F5DC',
    coral: '#FF7F50',
    salmon: '#FA8072',
    gold: '#FFD700',
    silver: '#C0C0C0',
    indigo: '#4B0082',
    violet: '#8A2BE2',
    turquoise: '#40E0D0',
    khaki: '#F0E68C'
  }

  const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS']
  const supportsDualSides = apparelType === 't-shirt' || apparelType === 'hoodie'
  const activeDesign = designs[activeSide] || createInitialDesignState()
  const {
    uploadedImage,
    imagePosition,
    imageSize,
    imageRotation,
    customText,
    textFont,
    textColor,
    textPosition
  } = activeDesign

  const updateDesignSide = (side, updater) => {
    setDesigns(prev => {
      const current = prev[side] || createInitialDesignState()
      const nextState = updater(current)
      return {
        ...prev,
        [side]: nextState
      }
    })
  }

  const setActiveDesignValues = (updates) => {
    updateDesignSide(activeSide, current => ({
      ...current,
      ...updates
    }))
  }

  useEffect(() => {
    if (!supportsDualSides && activeSide !== 'front') {
      setActiveSide('front')
    }
  }, [supportsDualSides, activeSide])

  // T-shirt base images - different images for front and back
  const tShirtImages = {
    front: tShirtFront,
    back: tShirtBack
  }

  // Hoodie base images - different images for front and back
  const hoodieImages = {
    front: hoodieFront,
    back: hoodieBack
  }

  // Load apparel base image - use different image based on apparel type and side
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setShirtImageLoaded(true)
      shirtImageRef.current = img
      updatePreview()
    }
    img.onerror = () => {
      console.error('Failed to load apparel image')
      setShirtImageLoaded(false)
    }
    // Use appropriate image based on apparel type and active side
    const images = apparelType === 'hoodie' ? hoodieImages : tShirtImages
    const imageUrl = images[activeSide] || images.front
    img.src = imageUrl
  }, [activeSide, apparelType])

  useEffect(() => {
    if (shirtImageLoaded) {
      updatePreview()
    }
  }, [shirtColor, designs, activeSide, shirtImageLoaded, apparelType])

  // Clear uploaded image cache when switching sides
  useEffect(() => {
    uploadedImageRef.current = null
  }, [activeSide])

  useEffect(() => {
    if (!baseProduct) return
    if (baseProduct.category) {
      setSelectedGender(baseProduct.category)
    }
    if (baseProduct.type) {
      setApparelType(baseProduct.type)
    }
    if (baseProduct.id) {
      setShirtType(baseProduct.id)
    }
  }, [baseProduct])

  useEffect(() => {
    const currentProduct = selectionPool.find(p => p.id === shirtType)
    if (!currentProduct && selectionPool[0]) {
      setShirtType(selectionPool[0].id)
    }
  }, [selectionPool, shirtType])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker && !event.target.closest('.color-picker-container')) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showColorPicker])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const targetSide = activeSide
    const reader = new FileReader()
    reader.onloadend = () => {
      const imageData = reader.result
      // Cache the image
      const img = new Image()
      img.onload = () => {
        uploadedImageRef.current = img
        updateDesignSide(targetSide, current => ({
          ...current,
          uploadedImage: imageData
        }))
      }
      img.src = imageData
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (type, e) => {
    setIsDragging(type)
    setDragStart({ x: e.clientX, y: e.clientY })
    setDragSide(activeSide)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    if (isDragging === 'image') {
      updateDesignSide(dragSide, current => ({
        ...current,
        imagePosition: {
          x: Math.max(0, Math.min(100, current.imagePosition.x + deltaX / 5)),
          y: Math.max(0, Math.min(100, current.imagePosition.y + deltaY / 5))
        }
      }))
    } else if (isDragging === 'text') {
      updateDesignSide(dragSide, current => ({
        ...current,
        textPosition: {
          x: Math.max(0, Math.min(100, current.textPosition.x + deltaX / 5)),
          y: Math.max(0, Math.min(100, current.textPosition.y + deltaY / 5))
        }
      }))
    }

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, dragSide])

  const updatePreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = 400
    canvas.height = 500

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw apparel base image (t-shirt or hoodie) on a temporary canvas
    // This allows us to apply color only to the t-shirt, not to overlays
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')
    
    // Clear the temp canvas with transparent background
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)

    if (shirtImageRef.current && shirtImageLoaded) {
      // Draw the apparel image (t-shirt or hoodie) on temp canvas
      // This preserves the transparency of the image
      tempCtx.drawImage(shirtImageRef.current, 0, 0, tempCanvas.width, tempCanvas.height)
      
      // Apply color change ONLY to the apparel based on selected color
      // Use pixel-level manipulation to only color t-shirt pixels (non-transparent areas)
      const selectedColor = shirtColors[shirtColor] || shirtColors.white
        
      // Parse the color to RGB values
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 }
      }
      
      const colorRgb = hexToRgb(selectedColor)
      const isBlack = shirtColor === 'black'
      const isWhite = shirtColor === 'white'
      const isDark = ['black', 'navy', 'maroon', 'indigo', 'violet', 'brown'].includes(shirtColor)
      const isLight = ['gray', 'beige', 'silver', 'khaki'].includes(shirtColor)
      const isBright = ['yellow', 'orange', 'pink', 'cyan', 'lime', 'coral', 'salmon', 'turquoise', 'gold'].includes(shirtColor)
      
      // Get image data to manipulate pixels directly
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
      const data = imageData.data
      
      // Apply color only to non-transparent pixels (t-shirt area)
      // Use a threshold to ensure we only modify actual t-shirt pixels, not edge artifacts
      const alphaThreshold = 10 // Only modify pixels with alpha > 10
      
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3]
        if (alpha > alphaThreshold) { // Only process pixels that are actually part of the t-shirt
          if (isWhite) {
            // For white, keep original colors (no change needed)
            // But ensure it's bright white
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
            if (brightness < 200) {
              // Lighten slightly to ensure it looks white
              data[i] = Math.min(255, data[i] + 20)
              data[i + 1] = Math.min(255, data[i + 1] + 20)
              data[i + 2] = Math.min(255, data[i + 2] + 20)
            }
          } else if (isBlack) {
            // For black, set to pure black but preserve the alpha channel
            // This ensures only the t-shirt shape is colored, not the background
            data[i] = 0     // R
            data[i + 1] = 0 // G
            data[i + 2] = 0 // B
            // Keep original alpha - this is crucial to maintain transparency
          } else {
            // For other colors, use better color blending
            const originalR = data[i]
            const originalG = data[i + 1]
            const originalB = data[i + 2]
            
            // Calculate brightness of original pixel (0-255)
            const brightness = (originalR * 0.299 + originalG * 0.587 + originalB * 0.114)
            
            // Normalize brightness to 0-1 range
            const normalizedBrightness = brightness / 255
            
            // Use different blending strategies based on color type
            let blendFactor
            if (isDark) {
              // For dark colors like navy, maroon, indigo, use stronger blend
              blendFactor = 0.75
            } else if (isLight) {
              // For light colors like gray, beige, silver, use lighter blend
              blendFactor = 0.55
            } else if (isBright) {
              // For bright/vibrant colors like yellow, orange, pink, use medium-strong blend
              blendFactor = 0.7
            } else {
              // For standard colors (red, blue, green, purple, teal, olive), use medium blend
              blendFactor = 0.65
            }
            
            // Apply color while preserving brightness for texture
            // This maintains shadows and highlights
            const targetR = colorRgb.r * normalizedBrightness
            const targetG = colorRgb.g * normalizedBrightness
            const targetB = colorRgb.b * normalizedBrightness
            
            data[i] = Math.round(targetR * blendFactor + originalR * (1 - blendFactor))
            data[i + 1] = Math.round(targetG * blendFactor + originalG * (1 - blendFactor))
            data[i + 2] = Math.round(targetB * blendFactor + originalB * (1 - blendFactor))
            
            // Ensure values are within valid range
            data[i] = Math.max(0, Math.min(255, data[i]))
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1]))
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2]))
          }
          // Keep original alpha channel
        }
      }
      
      tempCtx.putImageData(imageData, 0, 0)
      
      // Draw the colored t-shirt to the main canvas
      // Use source-over to preserve transparency
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(tempCanvas, 0, 0)
      ctx.restore()
    } else {
      // Fallback: Draw simple shirt shape if image not loaded
      ctx.fillStyle = shirtColors[shirtColor] || shirtColors.white
      ctx.fillRect(50, 100, 300, 350)
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.strokeRect(50, 100, 300, 350)
      ctx.fillStyle = shirtColors[shirtColor] || shirtColors.white
      ctx.fillRect(20, 120, 50, 80)
      ctx.fillRect(330, 120, 50, 80)
      ctx.strokeRect(20, 120, 50, 80)
      ctx.strokeRect(330, 120, 50, 80)
    }

    // Draw uploaded image - ensure it's drawn with normal composite operation
    // so it's not affected by the t-shirt color
    if (uploadedImage) {
      // Use cached image if available, otherwise load it
      const img = uploadedImageRef.current || new Image()
      
      const drawImage = () => {
        ctx.save()
        // Explicitly set to source-over to ensure image is drawn normally
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1.0
        const centerX = 200
        const centerY = 275
        const offsetX = (imagePosition.x - 50) * 3
        const offsetY = (imagePosition.y - 50) * 3
        ctx.translate(centerX + offsetX, centerY + offsetY)
        ctx.rotate((imageRotation * Math.PI) / 180)
        const size = imageSize * 2
        ctx.drawImage(img, -size / 2, -size / 2, size, size)
        ctx.restore()
      }

      if (img.complete && img.naturalWidth > 0) {
        // Image already loaded, draw immediately
        drawImage()
      } else {
        // Image not loaded yet, wait for it
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          uploadedImageRef.current = img
          // Redraw the entire canvas with the loaded image
          const canvas = canvasRef.current
          if (canvas) {
            const ctx = canvas.getContext('2d')
            // Redraw everything
            updatePreview()
          }
        }
        img.onerror = () => {
          console.error('Failed to load image')
        }
        if (!img.src) {
          img.src = uploadedImage
        }
      }
    }

    // Draw custom text - ensure it's drawn with normal composite operation
    // so it's not affected by the t-shirt color
    if (customText) {
      ctx.save()
      // Explicitly set to source-over to ensure text is drawn normally
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1.0
      ctx.font = `24px ${textFont}`
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const centerX = 200
      const centerY = 275
      const offsetX = (textPosition.x - 50) * 3
      const offsetY = (textPosition.y - 50) * 3
      ctx.fillText(customText, centerX + offsetX, centerY + offsetY)
      ctx.restore()
    }
  }

  const handleSave = () => {
    if (!selectedProduct) return

    const customization = {
      shirtType: selectedProduct.id,
      gender: selectedGender,
      shirtColor,
      shirtSize,
      sides: designs,
      activeSide,
      primaryDesign: designs[activeSide]
    }

    addToCart(selectedProduct, customization)
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Customize Your Apparel</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customization Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shirt Selection */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Choose Your Shirt</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {apparelOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setApparelType(option.value)}
                        className={`py-2 rounded-lg border font-medium ${
                          apparelType === option.value
                            ? 'bg-navy text-white border-navy'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['men', 'women', 'kids'].map(gender => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setSelectedGender(gender)}
                        className={`py-2 rounded-lg border font-medium capitalize ${
                          selectedGender === gender
                            ? 'bg-navy text-white border-navy'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                  <select
                    value={shirtType}
                    onChange={(e) => setShirtType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {selectionPool.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ₹{product.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(shirtColors).map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setShirtColor(color)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          shirtColor === color ? 'border-coral' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: shirtColors[color] }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={shirtSize}
                    onChange={(e) => setShirtSize(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {(selectedProduct?.sizes || []).map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-semibold">Upload Logo/Image</h2>
                <span className="text-sm text-gray-500 capitalize">
                  {supportsDualSides ? `${activeSide} side` : 'front side'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              />
              {uploadedImage && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {imageSize}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={imageSize}
                      onChange={(e) => setActiveDesignValues({ imageSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation: {imageRotation}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={imageRotation}
                      onChange={(e) => setActiveDesignValues({ imageRotation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={() => setActiveDesignValues({ uploadedImage: null })}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Text Customization */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-semibold">Add Custom Text</h2>
                <span className="text-sm text-gray-500 capitalize">
                  {supportsDualSides ? `${activeSide} side` : 'front side'}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setActiveDesignValues({ customText: e.target.value })}
                    placeholder="Enter your text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                  <select
                    value={textFont}
                    onChange={(e) => setActiveDesignValues({ textFont: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {fonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <div className="relative color-picker-container">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: textColor }}
                        />
                        <span>{textColor}</span>
                      </div>
                    </button>
                    {showColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <SketchPicker
                          color={textColor}
                            onChange={(color) => setActiveDesignValues({ textColor: color.hex })}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {customText && (
                  <button
                      onClick={() => setActiveDesignValues({ customText: '' })}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Clear Text
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex gap-2 items-center">
                  {supportsDualSides ? (
                    <div className="flex gap-2">
                      {['front', 'back'].map(side => (
                        <button
                          key={side}
                          type="button"
                          onClick={() => setActiveSide(side)}
                          className={`px-4 py-2 rounded-lg border font-medium capitalize ${
                            activeSide === side
                              ? 'bg-navy text-white border-navy'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {side}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Front Side</span>
                  )}
                </div>
              </div>
              <div className="relative border-2 border-gray-300 rounded-lg p-8 bg-gray-100 flex items-center justify-center">
                  <div className="relative" style={{ width: '400px', height: '500px' }}>
                    <canvas
                      ref={canvasRef}
                      className="border border-gray-300 bg-white"
                      style={{ width: '100%', height: '100%' }}
                    />
                    {uploadedImage && (
                      <div
                        className="absolute cursor-move"
                        style={{
                          left: `${imagePosition.x}%`,
                          top: `${imagePosition.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: `${imageSize}px`,
                          height: `${imageSize}px`
                        }}
                        onMouseDown={(e) => handleMouseDown('image', e)}
                      >
                        <div className="w-full h-full border-2 border-dashed border-coral bg-white/50" />
                      </div>
                    )}
                    {customText && (
                      <div
                        className="absolute cursor-move"
                        style={{
                          left: `${textPosition.x}%`,
                          top: `${textPosition.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={(e) => handleMouseDown('text', e)}
                      >
                        <div className="px-2 py-1 border-2 border-dashed border-blue-500 bg-white/50">
                          {customText}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-coral text-white py-3 px-6 rounded-lg hover:bg-coral/90 font-semibold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customize

