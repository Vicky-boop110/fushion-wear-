import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const userData = await login(email, password)
      console.log('Login successful:', userData)
      setLoading(false)
      navigate('/author')
    } catch (err) {
      setLoading(false)
      // Show specific error message from backend if available
      const errorMessage = err.message || 'Invalid email or password'
      setError(errorMessage)
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pb-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-navy mb-6 text-center">Login</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base break-words">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white py-3 px-6 rounded-lg hover:bg-coral/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-coral hover:text-coral/80 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

