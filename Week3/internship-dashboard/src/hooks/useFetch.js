import { useState, useEffect, useCallback } from 'react'

/**
 * useFetch — A reusable data fetching hook.
 * 
 * Features:
 * - Manages loading, error, and data states automatically
 * - Uses AbortController to cancel requests if the component unmounts
 *   (prevents memory leaks and "setState on unmounted component" warnings)
 * - Provides a refetch function for retry buttons
 * 
 * @param {string} url — The URL to fetch
 * @returns {Object} { data, loading, error, refetch }
 * 
 * @example
 * const { data, loading, error, refetch } = useFetch('https://api.example.com/users')
 */
export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const refetch = useCallback(() => {
    setRetryCount((c) => c + 1)
  }, [])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, { signal: controller.signal })

        if (!isMounted) return

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const json = await response.json()
        if (!isMounted) return

        setData(json)
      } catch (err) {
        if (!isMounted) return
        if (err.name !== 'AbortError') {
          setError(err.message || 'An unexpected error occurred')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [url, retryCount])

  return { data, loading, error, refetch }
}