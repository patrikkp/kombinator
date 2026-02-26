import { useRef, useCallback, useState } from 'react'

export function useTilt(maxDeg = 3) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 })

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setStyle({ rotateX: -y * maxDeg * 2, rotateY: x * maxDeg * 2 })
    },
    [maxDeg]
  )

  const handleLeave = useCallback(() => {
    setStyle({ rotateX: 0, rotateY: 0 })
  }, [])

  return { ref, style, handleMove, handleLeave }
}