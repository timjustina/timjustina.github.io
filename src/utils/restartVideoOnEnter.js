/**
 * Restart muted looping videos ~1s after they enter the viewport,
 * so playback begins from the start once the user has arrived.
 */
export function observeVideosRestartOnEnter(
  videos,
  { delayMs = 1000, threshold = 0.35 } = {},
) {
  const list = (Array.isArray(videos) ? videos : [videos]).filter(Boolean)
  if (!list.length || typeof IntersectionObserver === 'undefined') {
    return () => {}
  }

  const timers = new Map()

  const clearTimer = (video) => {
    const id = timers.get(video)
    if (id != null) {
      clearTimeout(id)
      timers.delete(video)
    }
  }

  const restart = (video) => {
    try {
      video.currentTime = 0
    } catch {
      // Ignore seek errors on unloaded media.
    }
    const play = video.play()
    if (play?.catch) play.catch(() => {})
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target
        clearTimer(video)
        if (!entry.isIntersecting) continue

        const id = window.setTimeout(() => {
          timers.delete(video)
          restart(video)
        }, delayMs)
        timers.set(video, id)
      }
    },
    { threshold },
  )

  for (const video of list) {
    observer.observe(video)
  }

  return () => {
    for (const video of list) clearTimer(video)
    observer.disconnect()
  }
}
