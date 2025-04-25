// src/hooks/useDashboardMetrics.ts
'use client'
import { useState, useEffect } from 'react'

/**
 * Hook to fetch and manage individual dashboard metric values.
 */
export function useDashboardMetrics() {
  const [pendingFiles, setPendingFiles] = useState<number>(0)
  const [acceptedFiles, setAcceptedFiles] = useState<number>(0)
  const [deniedFiles, setDeniedFiles] = useState<number>(0)
  const [pointsEarned, setPointsEarned] = useState<number>(0)

  useEffect(() => {
    // TODO: replace with real API calls
    setPendingFiles(12)
    setAcceptedFiles(87)
    setDeniedFiles(5)
    setPointsEarned(152)
  }, [])

  return { pendingFiles, acceptedFiles, deniedFiles, pointsEarned }
}
