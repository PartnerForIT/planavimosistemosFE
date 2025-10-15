import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const useQuery = (params) => {
  const { search } = useLocation()
  return useMemo(() => {
    const all = Object.fromEntries(new URLSearchParams(search).entries())
    return params.reduce((acc, item) => {
      const [key, defaultValue] = item.split(':')
      const value = isNaN(Number(all[key])) ? all[key] : Number(all[key])
      return {
        ...acc,
        [key]: value || defaultValue,
      }
    }, {})
  }, [search])
}
