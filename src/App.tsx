import { useState, useEffect } from 'react'
import { Results } from './types'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import MigrationProgress from './components/MigrationProgress'
import ComponentBreakdown from './components/ComponentBreakdown'
import DirectoryList from './components/DirectoryList'
import RefreshButton from './components/RefreshButton'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'

function App() {
  const [data, setData] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async (forceReload = false) => {
    if (forceReload) {
      setLoading(true)
      setError(null)
    }

    try {
      const response = await fetch('results.json?' + Date.now())

      if (!response.ok) {
        throw new Error('Results file not found. Please run the analysis script first.')
      }

      const jsonData = await response.json()
      setData(jsonData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => loadData(false), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-5">
      <div className="max-w-7xl mx-auto">
        <Header />

        {loading && <LoadingState />}

        {error && !loading && <ErrorState message={error} />}

        {data && !loading && (
          <>
            <div className="text-center text-white mb-8 text-sm opacity-80">
              Last updated: {new Date(data.timestamp).toLocaleString()}
            </div>

            <StatsCards summary={data.summary} />
            <MigrationProgress summary={data.summary} />
            <ComponentBreakdown summary={data.summary} />
            <DirectoryList byDirectory={data.byDirectory} />
          </>
        )}

        <RefreshButton onRefresh={() => loadData(true)} />
      </div>
    </div>
  )
}

export default App
