const MOBILE_SNAP_MQ = '(max-width: 799px)'
const HTML_SNAP_CLASS = 'portfolio-work-snap'
const HTML_SNAP_ACTIVE_CLASS = 'portfolio-work-snap--active'

let suppressUntil = 0
let mq = null
let rootEl = null
let isDisabled = () => false
let onScroll = null
let onMqChange = null
let scrollRaf = null

export function suppressMobileProjectScrollSnap(ms = 900) {
    suppressUntil = performance.now() + ms
    document.documentElement.classList.remove(HTML_SNAP_ACTIVE_CLASS)
    window.setTimeout(() => syncSnapActiveState(), ms)
}

function syncSnapClass() {
    const html = document.documentElement
    const enabled = mq?.matches && !isDisabled()

    html.classList.toggle(HTML_SNAP_CLASS, enabled)
    if (!enabled) {
        html.classList.remove(HTML_SNAP_ACTIVE_CLASS)
    } else {
        syncSnapActiveState()
    }
}

function syncSnapActiveState() {
    const html = document.documentElement
    if (!html.classList.contains(HTML_SNAP_CLASS)) return
    if (performance.now() < suppressUntil || isDisabled()) {
        html.classList.remove(HTML_SNAP_ACTIVE_CLASS)
        return
    }

    const work = rootEl?.querySelector('.work')
    if (!work) {
        html.classList.remove(HTML_SNAP_ACTIVE_CLASS)
        return
    }

    const rect = work.getBoundingClientRect()
    const vh = window.innerHeight
    // Engage section snap once work fills the upper viewport (leaving hero freely scrollable).
    const active = rect.top <= vh * 0.45 && rect.bottom > vh * 0.12
    html.classList.toggle(HTML_SNAP_ACTIVE_CLASS, active)
}

function onScrollHandler() {
    if (scrollRaf != null) return
    scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null
        syncSnapActiveState()
    })
}

function attachListeners() {
    if (onScroll) return
    onScroll = onScrollHandler
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
}

function detachListeners() {
    if (scrollRaf != null) {
        cancelAnimationFrame(scrollRaf)
        scrollRaf = null
    }
    if (onScroll) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        onScroll = null
    }
    document.documentElement.classList.remove(HTML_SNAP_CLASS, HTML_SNAP_ACTIVE_CLASS)
}

function syncEnabledState() {
    if (mq?.matches) {
        attachListeners()
        syncSnapClass()
    } else {
        detachListeners()
    }
}

/** Enable mobile case-study section snap (≤799px). Returns teardown. */
export function setupMobileProjectScrollSnap({ root, isDisabled: disabledCheck } = {}) {
    teardownMobileProjectScrollSnap()

    rootEl = root ?? document
    isDisabled = disabledCheck ?? (() => false)
    mq = window.matchMedia(MOBILE_SNAP_MQ)

    onMqChange = () => syncEnabledState()
    mq.addEventListener('change', onMqChange)
    syncEnabledState()

    return teardownMobileProjectScrollSnap
}

export function teardownMobileProjectScrollSnap() {
    mq?.removeEventListener('change', onMqChange)
    mq = null
    onMqChange = null
    rootEl = null
    isDisabled = () => false
    detachListeners()
}
