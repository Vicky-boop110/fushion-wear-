import { useState, useEffect } from 'react'
import { addressesAPI } from '../services/api'

const AddressSelector = ({ isOpen, onClose, onSelectAddress, selectedAddress }) => {
  const [pincode, setPincode] = useState(selectedAddress?.pincode || '500097')
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [editAddressForm, setEditAddressForm] = useState({
    name: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India'
  })

  // Load addresses from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedAddresses = localStorage.getItem('addresses')
      if (savedAddresses) {
        try {
          const parsed = JSON.parse(savedAddresses)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedAddresses(parsed)
          }
        } catch (e) {
          console.error('Error parsing saved addresses:', e)
        }
      }
      fetchAddresses()
    }
  }, [isOpen])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await addressesAPI.getAll()
      // Handle different response formats
      const addresses = Array.isArray(data) ? data : (data.addresses || data.data || [])
      // Persist to localStorage
      if (addresses.length > 0) {
        localStorage.setItem('addresses', JSON.stringify(addresses))
        localStorage.setItem('addresses_lastUpdated', new Date().toISOString())
      }
      setSavedAddresses(addresses)
      if (addresses.length === 0) {
        setError('No saved addresses found')
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
      setError(err.message || 'Failed to fetch addresses from backend')
      // Use persisted data if available
      const savedAddresses = localStorage.getItem('addresses')
      if (savedAddresses) {
        try {
          const parsed = JSON.parse(savedAddresses)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedAddresses(parsed)
            setError('Using cached data. Backend unavailable.')
          } else {
            setSavedAddresses([])
          }
        } catch (e) {
          console.error('Error parsing saved addresses:', e)
          setSavedAddresses([])
        }
      } else {
        setSavedAddresses([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Get the currently selected address, prioritizing saved addresses
  const getCurrentSelectedAddress = () => {
    if (selectedAddressId) {
      const saved = savedAddresses.find(addr => addr.id === selectedAddressId)
      if (saved) {
        return {
          name: saved.name,
          pincode: saved.pincode,
          fullAddress: saved.fullAddress
        }
      }
    }
    // Return selected address from props or empty object
    return selectedAddress || {
      name: '',
      pincode: '',
      fullAddress: ''
    }
  }

  const currentSelectedAddress = getCurrentSelectedAddress()

  // Sync selected address ID when modal opens
  useEffect(() => {
    if (isOpen && selectedAddress) {
      // Check if current selected address matches any saved address
      const matchedAddress = savedAddresses.find(
        addr => addr.pincode === selectedAddress.pincode && 
                addr.address === selectedAddress.address
      )
      if (matchedAddress) {
        setSelectedAddressId(matchedAddress.id)
      }
    }
  }, [isOpen, selectedAddress, savedAddresses])

  // Initialize edit form when editing starts
  useEffect(() => {
    if (isEditingAddress && currentSelectedAddress) {
      setEditAddressForm({
        name: currentSelectedAddress.name || '',
        address: currentSelectedAddress.fullAddress?.split(',')[0] || currentSelectedAddress.address || '',
        pincode: currentSelectedAddress.pincode || '',
        city: currentSelectedAddress.fullAddress?.split(',')[2]?.trim() || '',
        state: currentSelectedAddress.fullAddress?.split(',')[3]?.trim() || '',
        country: 'India'
      })
    }
  }, [isEditingAddress])

  const handleChangeClick = () => {
    setIsEditingAddress(true)
  }

  const handleSaveAddress = async () => {
    try {
      const updatedAddress = {
        name: editAddressForm.name,
        address: editAddressForm.address,
        pincode: editAddressForm.pincode,
        city: editAddressForm.city,
        state: editAddressForm.state,
        country: editAddressForm.country,
        fullAddress: `${editAddressForm.address}, ${editAddressForm.city}, ${editAddressForm.state} ${editAddressForm.pincode}, ${editAddressForm.country}`
      }

      // If editing existing address, update it
      if (selectedAddressId) {
        updatedAddress.id = selectedAddressId
        try {
          await addressesAPI.update(selectedAddressId, updatedAddress)
        } catch (err) {
          console.error('Error updating address on backend:', err)
          // Still update locally
        }
        // Update local storage
        const currentAddresses = [...savedAddresses]
        const index = currentAddresses.findIndex(addr => addr.id === selectedAddressId)
        if (index !== -1) {
          currentAddresses[index] = updatedAddress
        }
        localStorage.setItem('addresses', JSON.stringify(currentAddresses))
        setSavedAddresses(currentAddresses)
      } else {
        // Create new address
        updatedAddress.id = Date.now() // Temporary ID
        try {
          const response = await addressesAPI.create(updatedAddress)
          // Use ID from backend if available
          if (response && response.id) {
            updatedAddress.id = response.id
          }
        } catch (err) {
          console.error('Error creating address on backend:', err)
          // Still save locally
        }
        // Update local storage
        const currentAddresses = [...savedAddresses, updatedAddress]
        localStorage.setItem('addresses', JSON.stringify(currentAddresses))
        setSavedAddresses(currentAddresses)
      }

      // Refresh addresses list from backend
      await fetchAddresses()
      
      onSelectAddress(updatedAddress)
      setIsEditingAddress(false)
    } catch (err) {
      console.error('Error saving address:', err)
      alert('Address saved locally. Backend sync may have failed.')
    }
  }

  const handleCancelEdit = () => {
    setIsEditingAddress(false)
  }

  const handleEditFormChange = (e) => {
    setEditAddressForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectAddress = async (address) => {
    try {
      setSelectedAddressId(address.id)
      // Set as default address if needed
      if (address.id) {
        await addressesAPI.setDefault(address.id)
      }
      onSelectAddress(address)
      onClose()
    } catch (err) {
      console.error('Error selecting address:', err)
      // Still proceed with selection even if API call fails
      onSelectAddress(address)
      onClose()
    }
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please use the search location feature instead.')
      return
    }

    setLocationLoading(true)
    setError(null)

    try {
      // Get user's current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocode coordinates to get address
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FusionWear-Ecommerce-App' // Required by Nominatim
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch address from location')
      }

      const data = await response.json()
      const address = data.address

      // Extract address components
      const addressLine1 = [
        address.house_number,
        address.road,
        address.neighbourhood || address.suburb
      ].filter(Boolean).join(', ')

      const city = address.city || address.town || address.village || address.county || ''
      const state = address.state || address.region || ''
      const pincode = address.postcode || ''
      const country = address.country || 'India'

      // Create address object
      const locationAddress = {
        name: 'My Location',
        address: addressLine1 || address.road || '',
        city: city,
        state: state,
        pincode: pincode,
        country: country,
        fullAddress: [
          addressLine1,
          city,
          state,
          pincode,
          country
        ].filter(Boolean).join(', ')
      }

      // Update the form with location data
      setEditAddressForm({
        name: 'My Location',
        address: locationAddress.address,
        pincode: locationAddress.pincode,
        city: locationAddress.city,
        state: locationAddress.state,
        country: locationAddress.country
      })

      // Set pincode in the pincode input
      setPincode(locationAddress.pincode)

      // Auto-select this address
      onSelectAddress(locationAddress)
      
      // Show edit mode so user can review and save
      setIsEditingAddress(true)

    } catch (err) {
      console.error('Error getting current location:', err)
      let errorMessage = 'Failed to get your current location. '
      
      // Handle GeolocationPositionError codes
      if (err.code === 1) { // PERMISSION_DENIED
        errorMessage += 'Please allow location access in your browser settings.'
      } else if (err.code === 2) { // POSITION_UNAVAILABLE
        errorMessage += 'Location information is unavailable.'
      } else if (err.code === 3) { // TIMEOUT
        errorMessage += 'Location request timed out. Please try again.'
      } else {
        errorMessage += err.message || 'Please try again or use the search location feature.'
      }
      
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSearchLocation = () => {
    // Implement location search here
    alert('Location search feature will be implemented')
  }

  const handleCheckPincode = () => {
    // Implement pincode validation here
    alert(`Checking pincode: ${pincode}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Delivery Address</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Selected Location Banner */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            {!isEditingAddress ? (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-900 font-bold">
                      {currentSelectedAddress.name ? (
                        <>on - <span className="font-bold">{currentSelectedAddress.name}</span></>
                      ) : (
                        <span className="text-gray-500">No address selected</span>
                      )}
                    </p>
                    <button
                      onClick={handleChangeClick}
                      className="text-red-600 font-medium hover:text-red-700 transition-colors ml-4 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  {currentSelectedAddress.fullAddress && (
                    <p className="text-sm text-gray-700">
                      {currentSelectedAddress.fullAddress}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Address</h3>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editAddressForm.name}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={editAddressForm.pincode}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={editAddressForm.address}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={editAddressForm.city}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={editAddressForm.state}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pincode Input */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral"
                maxLength={6}
              />
              <button
                onClick={handleCheckPincode}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Check Pincode
              </button>
            </div>
          </div>

          {/* Location Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-3">
                {locationLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                ) : (
                  <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                )}
                <span className="text-red-600 font-medium">
                  {locationLoading ? 'Getting your location...' : 'Use my current location'}
                </span>
              </div>
              {!locationLoading && (
                <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>

            <button
              onClick={handleSearchLocation}
              className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-red-600 font-medium">Search location</span>
              </div>
              <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-600 font-medium">Or</span>
            </div>
          </div>

          {/* Saved Addresses */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Saved Address</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading addresses...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>Error loading addresses: {error}</p>
                <button
                  onClick={fetchAddresses}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : savedAddresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No saved addresses found.</p>
                <p className="text-sm mt-2">Add a new address using the form above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedAddresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleSelectAddress(address)}
                  className="w-full text-left p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <svg className="h-5 w-5 text-gray-700 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-bold text-gray-900">
                            {address.name}, {address.pincode}
                          </p>
                          <span className="px-2 py-0.5 bg-gray-600 text-white text-xs font-medium rounded-full">
                            {address.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{address.address}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        selectedAddressId === address.id 
                          ? 'bg-gray-700' 
                          : 'border-2 border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {selectedAddressId === address.id && (
                          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressSelector

