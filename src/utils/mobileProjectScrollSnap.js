import { cancelSmoothScroll, smoothScrollTo } from './scrollToAbout.js'

const MOBILE_SNAP_MQ = '(max-width: 799px)'
const MOBILE_SNAP_PAD = 20
const MOBILE_SNAP_IDLE_MS = 150
const MOBILE_SNAP_MIN_DELTA = 3
const MOBILE_SNAP_DURATION = 520

/** Slow start, then accelerates — like resistance being overcome. */
export function easeResistanceOvercome(t) {
    return t * t * t
}

let suppressUntil = 0
let idleTimer = null
let touchActive = false
let mq = null
let rootEl = null
let isDisabled = () => false
let onScroll = null
let onTouchStart = null
let onTouchEnd = null
let onMqChange = null

export function suppressMobileProjectScrollSnap(ms = 900) {
    suppressUntil = performance.now() + ms
    clearTimeout(idleTimer)
    idleTimer = null
}

function getProjectThumbnail(project) {
    return project.querySelector('.project-image-link') || project.querySelector('.project-image-wrap')
}

function getSnapTargets() {
    const projects = rootEl?.querySelectorAll('.work .project') ?? []
    const scrollY = window.scrollY
    const targets = []

    for (const project of projects) {
        const thumb = getProjectThumbnail(project)
        if (!thumb) continue
        const top = thumb.getBoundingClientRect().top + scrollY - MOBILE_SNAP_PAD
        targets.push(Math.max(0, top))
    }

    return targets
}

function isInWorkSnapZone(scrollY, targets) {
    if (!targets.length) return false

    const first = targets[0]
    const last = targets[targets.length - 1]
    const vh = window.innerHeight

    return scrollY >= first - vh * 0.35 && scrollY <= last + vh * 0.85
}

function pickNearestTarget(scrollY, targets) {
    const maxTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    let nearest = Math.max(0, Math.min(targets[0], maxTop))
    let minDist = Math.abs(scrollY - nearest)

    for (const raw of targets) {
        const target = Math.max(0, Math.min(raw, maxTop))
        const dist = Math.abs(scrollY - target)
        if (dist < minDist) {
            minDist = dist
            nearest = target
        }
    }

    return nearest
}

function scheduleSnap() {
    clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => {
        idleTimer = null
        runSnap()
    }, MOBILE_SNAP_IDLE_MS)
}

function runSnap() {
    if (!mq?.matches) return
    if (touchActive) return
    if (performance.now() < suppressUntil) return
    if (isDisabled()) return

    const scrollY = window.scrollY
    const targets = getSnapTargets()
    if (!targets.length || !isInWorkSnapZone(scrollY, targets)) return

    const targetTop = pickNearestTarget(scrollY, targets)
    if (Math.abs(scrollY - targetTop) < MOBILE_SNAP_MIN_DELTA) return

    suppressUntil = performance.now() + MOBILE_SNAP_DURATION + 80
    smoothScrollTo(targetTop, {
        duration: MOBILE_SNAP_DURATION,
        ease: easeResistanceOvercome,
    })
}

function attachListeners() {
    if (!rootEl || onScroll) return

    onScroll = () => {
        if (!mq?.matches) return
        if (touchActive) return
        scheduleSnap()
    }

    onTouchStart = () => {
        touchActive = true
        clearTimeout(idleTimer)
        idleTimer = null
        cancelSmoothScroll()
    }

    onTouchEnd = () => {
        touchActive = false
        scheduleSnap()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
}

function detachListeners() {
    clearTimeout(idleTimer)
    idleTimer = null
    touchActive = false
    cancelSmoothScroll()

    if (onScroll) {
        window.removeEventListener('scroll', onScroll)
        onScroll = null
    }
    if (onTouchStart) {
        window.removeEventListener('touchstart', onTouchStart)
        onTouchStart = null
    }
    if (onTouchEnd) {
        window.removeEventListener('touchend', onTouchEnd)
        window.removeEventListener('touchcancel', onTouchEnd)
        onTouchEnd = null
    }
}

function syncEnabledState() {
    if (mq?.matches) {
        attachListeners()
    } else {
        detachListeners()
    }
}

/** Enable mobile case-study scroll snap (≤799px). Returns teardown. */
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
