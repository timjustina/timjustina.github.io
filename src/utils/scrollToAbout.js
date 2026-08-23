const ABOUT_EXTRA_OFFSET = 85
const SMALL_SCREEN_QUERY = '(max-width: 600px)'

function getHeaderOffset() {
    const topBar = document.querySelector('.top-bar')
    if (topBar?.classList.contains('top-bar--in-flow')) return 0

    const topBarInner = document.querySelector('.top-bar-inner')
    return topBarInner?.offsetHeight ?? 120
}

export { getHeaderOffset }

export function getAboutScrollTop() {
    const aboutSection = document.getElementById('about')
    const aboutBio = document.getElementById('about-bio')
    if (!aboutSection || !aboutBio) return null

    const scrollY = window.scrollY
    const aboutTop = aboutSection.getBoundingClientRect().top + scrollY
    const bioTop = aboutBio.getBoundingClientRect().top + scrollY
    const isSmall = window.matchMedia(SMALL_SCREEN_QUERY).matches
    const headerOffset = getHeaderOffset()

    const colorTop = aboutTop - headerOffset
    const bioTopAligned = bioTop - headerOffset

    const top = isSmall ? colorTop : bioTopAligned
    return Math.max(0, top + ABOUT_EXTRA_OFFSET)
}

export function getWorkScrollTop() {
    const el = document.getElementById('work-first') || document.getElementById('work')
    if (!el) return null
    const headerOffset = getHeaderOffset()
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset)
}

const DEFAULT_SCROLL_DURATION = 450

let activeScrollAnimation = null

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function smoothScrollTo(targetTop, { duration = DEFAULT_SCROLL_DURATION } = {}) {
    if (activeScrollAnimation !== null) {
        cancelAnimationFrame(activeScrollAnimation)
        activeScrollAnimation = null
    }

    const startTop = window.scrollY
    const maxTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const endTop = Math.max(0, Math.min(targetTop, maxTop))
    const distance = endTop - startTop

    if (Math.abs(distance) < 1 || duration <= 0) {
        window.scrollTo(0, endTop)
        return
    }

    const startTime = performance.now()

    const step = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / duration)
        const eased = easeInOutCubic(progress)

        window.scrollTo(0, startTop + distance * eased)

        if (progress < 1) {
            activeScrollAnimation = requestAnimationFrame(step)
        } else {
            activeScrollAnimation = null
        }
    }

    activeScrollAnimation = requestAnimationFrame(step)
}

export function scrollToAbout(options = {}) {
    const top = getAboutScrollTop()
    if (top === null) return false

    smoothScrollTo(top, options)
    return true
}

export function scrollToWork(options = {}) {
    const top = getWorkScrollTop()
    if (top === null) return false

    smoothScrollTo(top, options)
    return true
}

/** Scroll to the portfolio section for a home-page hash, if any. */
export function scrollToPortfolioHash(hash, options = {}) {
    if (hash === '#about') return scrollToAbout(options)
    if (hash === '#work-first' || hash === '#work') return scrollToWork(options)
    return false
}
