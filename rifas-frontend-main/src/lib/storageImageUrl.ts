/**
 * Convierte una URL de imagen del storage del backend a una ruta same-origin
 * para evitar ERR_BLOCKED_BY_RESPONSE.NotSameOrigin.
 * Next.js reescribe /storage/* al backend.
 * Acepta: URL completa con /storage/, URL con otro path, o solo nombre de archivo.
 */
const IMAGE_EXT = /\.(jpe?g|png|gif|webp)(\?|#|$)/i

export function getStorageImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null
  const trimmed = url.trim()

  // Ya es ruta same-origin
  if (trimmed.startsWith('/storage/')) return trimmed

  // URL completa que contiene /storage/ -> extraer path
  if (trimmed.includes('/storage/')) {
    const match = trimmed.match(/\/storage\/([^?#]+)/)
    if (match) return `/storage/${match[1]}`
  }

  // URL completa (http(s)://...) -> extraer último segmento del path como nombre de archivo
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const pathname = new URL(trimmed).pathname
      const filename = pathname.replace(/^\/+/, '').split('/').pop()
      if (filename && IMAGE_EXT.test(filename)) return `/storage/${filename}`
    } catch {
      // URL mal formada
    }
  }

  // Solo nombre de archivo (ej. "rifa-1771619173811.jpeg")
  if (!trimmed.includes('/') && IMAGE_EXT.test(trimmed)) return `/storage/${trimmed}`

  // Path relativo tipo "storage/xxx" o "/uploads/xxx.jpeg"
  const pathSegment = trimmed.replace(/^\/+/, '').split('/').pop()
  if (pathSegment && IMAGE_EXT.test(pathSegment)) return `/storage/${pathSegment}`

  return trimmed
}
