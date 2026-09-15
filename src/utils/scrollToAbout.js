import { MOBILE_MEDIA_QUERY, SMALL_MOBILE_MEDIA_QUERY } from './breakpoints.js'

const ABOUT_EXTRA_OFFSET = 85
/**
 * Mobile (<800): about section starts this far above the beige background edge.
 * Work ends at the same Y — menu scroll and touch-disk zones share this boundary.
 */
const ABOUT_MOBILE_TOP_GAP = 20
const WORK_TOP_GAP = 20
const WORK_BOTTOM_GAP = 30

function getHeaderOffset() {
    const topBar = document.querySelector('.top-bar')
    if (topBar?.classList.contains('top-bar--in-flow')) return 0

    const topBarInner = document.querySelector('.top-bar-inner')
    return topBarInner?.offsetHeight ?? 120
}

export { getHeaderOffset, ABOUT_MOBILE_TOP_GAP }

/** Document Y of the about beige background's top edge. */
export function getAboutBackgroundTop() {
    const aboutSection = document.getElementById('about')
    if (!aboutSection) return null
    return aboutSection.getBoundingClientRect().top + (window.scrollY || 0)
}

/**
 * Scroll Y where the about section begins (and work ends on mobile):
 * 20px above the about background on mobile; desktop uses existing bio/offset rules.
 */
export function getAboutScrollTop() {
    const aboutSection = document.getElementById('about')
    const aboutBio = document.getElementById('about-bio')
    if (!aboutSection || !aboutBio) return null

    const scrollY = window.scrollY
    const aboutTop = aboutSection.getBoundingClientRect().top + scrollY
    const bioTop = aboutBio.getBoundingClientRect().top + scrollY
    const headerOffset = getHeaderOffset()

    // Mobile: work ends / about starts 20px before the beige background edge
    // (viewport-top align; in-flow mobile chrome scrolls away with the page).
    if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
        return Math.max(0, aboutTop - ABOUT_MOBILE_TOP_GAP)
    }

    const isSmall = window.matchMedia(SMALL_MOBILE_MEDIA_QUERY).matches
    const colorTop = aboutTop - headerOffset
    const bioTopAligned = bioTop - headerOffset
    const top = isSmall ? colorTop : bioTopAligned
    return Math.max(0, top + ABOUT_EXTRA_OFFSET)
}

/**
 * Whether the viewport is in the about section for touch-disk / pager zoning.
 * Prefer the beige edge in the viewport (shared work/about line) over scroll-Y
 * math — header offset / clamp quirks were leaving the zone stuck on "work".
 */
export function isAboutSectionActive(
    scrollY = window.scrollY || document.documentElement.scrollTop || 0,
) {
    const aboutSection = document.getElementById('about')
    if (!aboutSection) return false

    const aboutRect = aboutSection.getBoundingClientRect()
    const vh = window.innerHeight || 0
    const mobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches
    // Same line as menu scroll: 20px above beige on mobile, flush on desktop.
    const edgeLine = mobile ? ABOUT_MOBILE_TOP_GAP : 0
    if (aboutRect.top <= edgeLine + 0.5) return true

    if (vh > 0) {
        const visible =
            Math.min(aboutRect.bottom, vh) - Math.max(aboutRect.top, 0)
        // About owns the zone once beige is a real share of the screen —
        // don't wait for the edge to hit the top align line.
        if (visible >= vh * 0.28) return true
    }

    const aboutTop = getAboutScrollTop()
    if (aboutTop != null && scrollY >= aboutTop - 0.5) return true

    const maxY = Math.max(0, (document.documentElement.scrollHeight || 0) - vh)
    // Pinned at the bottom but still short of aboutTop (tall viewports).
    if (vh > 0 && scrollY >= maxY - 1 && aboutRect.top < vh * 0.65) {
        return true
    }

    return false
}

/** Scroll Y that places a project per mobile/desktop nav rules. */
export function getProjectScrollTop(project) {
    if (!project) return null

    const scrollY = window.scrollY
    const rect = project.getBoundingClientRect()
    if (rect.height < 1) return null

    const setTop = rect.top + scrollY
    const setHeight = rect.height
    const viewportH = window.innerHeight

    if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
        return Math.max(0, setTop - WORK_TOP_GAP)
    }

    // Desktop: center thumbnail + caption in the viewport.
    const bottomAligned = setTop + setHeight - viewportH + WORK_BOTTOM_GAP
    if (setHeight + WORK_BOTTOM_GAP <= viewportH) {
        const centered = setTop - (viewportH - setHeight) / 2
        return Math.max(0, Math.max(centered, bottomAligned))
    }

    return Math.max(0, bottomAligned)
}

export function getWorkScrollTop() {
    const el = document.getElementById('work-first') || document.querySelector('.work .project')
    if (!el) return null
    return getProjectScrollTop(el)
}

const DEFAULT_SCROLL_DURATION = 450

let activeScrollAnimation = null

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export { easeInOutCubic }

export function cancelSmoothScroll() {
    if (activeScrollAnimation !== null) {
        cancelAnimationFrame(activeScrollAnimation)
        activeScrollAnimation = null
    }
}

export function smoothScrollTo(targetTop, { duration = DEFAULT_SCROLL_DURATION, ease = easeInOutCubic, onComplete } = {}) {
    cancelSmoothScroll()

    const startTop = window.scrollY
    const maxTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const endTop = Math.max(0, Math.min(targetTop, maxTop))
    const distance = endTop - startTop

    if (Math.abs(distance) < 1 || duration <= 0) {
        window.scrollTo(0, endTop)
        onComplete?.()
        return
    }

    const startTime = performance.now()

    const step = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / duration)
        const eased = ease(progress)

        window.scrollTo(0, startTop + distance * eased)

        if (progress < 1) {
            activeScrollAnimation = requestAnimationFrame(step)
        } else {
            activeScrollAnimation = null
            onComplete?.()
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
