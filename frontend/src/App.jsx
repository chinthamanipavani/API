import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [dashboardResults, setDashboardResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = 'http://localhost:3000'

  useEffect(() => {
    fetchDashboardResults()
  }, [])

  const fetchDashboardResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/results/all`)
      setDashboardResults(response.data)
    } catch (err) {
      setError('Failed to load dashboard results')
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${API_BASE_URL}/api/results/search?keyword=${encodeURIComponent(keyword)}`)
      setSearchResults(response.data.results)
      fetchDashboardResults() // Refresh dashboard after search
    } catch (err) {
      setError('Failed to search GitHub repositories')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>API-Driven Mini Web App</h1>
      
      <div className="search-section">
        <h2>Search GitHub Repositories</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword (e.g., react)"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        
        {searchResults.length > 0 && (
          <div className="results">
            <h3>Search Results:</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">{result.name}</a>
                  <p>{result.description}</p>
                  <small>Language: {result.language} | Stars: {result.stars}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Stored Results Dashboard</h2>
        {dashboardResults.length > 0 ? (
          <ul>
            {dashboardResults.map((result, index) => (
              <li key={index}>
                <a href={result.url} target="_blank" rel="noopener noreferrer">{result.name}</a>
                <p>{result.description}</p>
                <small>Keyword: {result.keyword} | Language: {result.language} | Stars: {result.stars}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No stored results yet. Try searching for a keyword!</p>
        )}
      </div>
    </div>
  )
}

export default App
