import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('authToken')
    
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
      } catch (e) {
        console.error('Error parsing saved user:', e)
      }
    }
    
    // Verify token with backend
    if (savedToken) {
      verifyUser()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      console.error('Error verifying user:', err)
      // Clear invalid session
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      console.log('Login API response:', response)
      
      // Extract user data from response
      const userData = response.user || response
      const token = response.token || response.accessToken
      
      if (!userData || !token) {
        throw new Error('Invalid response from server')
      }
      
      // Save token to localStorage
      localStorage.setItem('authToken', token)
      
      // Ensure userData has required fields
      if (!userData.id && !userData._id) {
        throw new Error('User data is missing required fields')
      }
      
      // Save user to localStorage
      const userToSave = {
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
      }
      
      setUser(userToSave)
      localStorage.setItem('user', JSON.stringify(userToSave))
      
      console.log('User logged in successfully:', userToSave)
      return userToSave
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup({ name, email, password })
      const userData = response.user || response
      const token = response.token || response.accessToken
      
      if (token) {
        localStorage.setItem('authToken', token)
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (err) {
      console.error('Signup error:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

