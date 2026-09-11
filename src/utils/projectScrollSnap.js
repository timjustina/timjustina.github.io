import { MOBILE_MEDIA_QUERY } from './breakpoints.js'
import {
    cancelSmoothScroll,
    easeInOutCubic,
    getAboutScrollTop,
    smoothScrollTo,
} from './scrollToAbout.js'

const WORK_TOP_GAP = 20
const WORK_BOTTOM_GAP = 30
const SNAP_AT_PX = 14
const SNAP_DURATION_MIN = 380
const SNAP_DURATION_MAX = 620
/** Ignore tiny trackpad / Magic Mouse jitter while moving the pointer. */
const WHEEL_INTENT_PX = 18
/** Cap one wheel event so a Magic Mouse blip can't commit alone. */
const WHEEL_MAX_STEP_PX = 36
/** Need this much accumulated delta in one gesture before leaving a stop. */
const WHEEL_COMMIT_PX = 90
const WHEEL_COMMIT_DOWN_PX = 130
const WHEEL_GESTURE_IDLE_MS = 120
/** On the intro, downward needs a real flick — pointer drift must not jump to work. */
const WHEEL_COMMIT_INTRO_DOWN_PX = 220
const WHEEL_COMMIT_INTRO_UP_PX = 90
const TOUCH_SWIPE_PX = 36
const TOUCH_SWIPE_INTRO_DOWN_PX = 120

let suppressUntil = 0
let animating = false
let rootEl = null
let isDisabled = () => false
let touchStartY = 0
let touchStartX = 0
let touchTracking = false
let wheelAccum = 0
let wheelGestureTimer = null
let onWheel = null
let onTouchStart = null
let onTouchEnd = null
let onTouchCancel = null

export function suppressProjectScrollSnap(ms = 900) {
    suppressUntil = performance.now() + ms
    animating = false
    wheelAccum = 0
    clearTimeout(wheelGestureTimer)
    wheelGestureTimer = null
    cancelSmoothScroll()
}

function isMobile() {
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

/** Scroll Y that places a project per mobile/desktop rules. */
export function getProjectSnapScrollTop(project) {
    if (!project) return null

    const scrollY = window.scrollY
    const rect = project.getBoundingClientRect()
    if (rect.height < 1) return null

    const setTop = rect.top + scrollY
    const setHeight = rect.height
    const viewportH = window.innerHeight

    if (isMobile()) {
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

function getSnapTargets() {
    const projects = [...(rootEl?.querySelectorAll?.('.work .project') ?? [])]
    const maxTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const targets = [0]

    for (const project of projects) {
        const top = getProjectSnapScrollTop(project)
        if (top == null) continue
        targets.push(Math.max(0, Math.min(top, maxTop)))
    }

    const aboutTop = getAboutScrollTop()
    if (aboutTop != null) {
        targets.push(Math.max(0, Math.min(aboutTop, maxTop)))
    }

    return targets
}

function isInSnapZone(scrollY, targets) {
    if (targets.length < 2) return false
    const last = targets[targets.length - 1]
    const vh = window.innerHeight
    // Through About landing; release once past it into the footer.
    return scrollY <= last + vh * 0.35
}

/** Next/previous stop in the gesture direction. null = release to native scroll. */
function pickNeighborTarget(scrollY, targets, dir) {
    if (!targets.length) return null

    // Largest stop at or just above the current scroll position.
    let i = 0
    for (let j = 0; j < targets.length; j++) {
        if (targets[j] <= scrollY + SNAP_AT_PX) i = j
    }

    if (dir > 0) {
        // On About (last stop) — free-scroll the rest of the section / footer.
        if (i >= targets.length - 1) return null
        return targets[i + 1]
    }

    // dir < 0
    if (scrollY <= targets[0] + SNAP_AT_PX) return null
    // Between i and i+1 → return to i; exactly on i → go to i-1
    if (scrollY > targets[i] + SNAP_AT_PX) return targets[i]
    return targets[Math.max(i - 1, 0)]
}

function snapDuration(distance) {
    const d = Math.abs(distance)
    return Math.round(
        Math.min(SNAP_DURATION_MAX, Math.max(SNAP_DURATION_MIN, 280 + d * 0.28))
    )
}

function animateTo(targetTop) {
    const startTop = window.scrollY
    const distance = targetTop - startTop
    if (Math.abs(distance) < 2) return

    animating = true
    wheelAccum = 0
    clearTimeout(wheelGestureTimer)
    wheelGestureTimer = null
    const duration = snapDuration(distance)
    suppressUntil = performance.now() + duration + 80

    smoothScrollTo(targetTop, {
        duration,
        ease: easeInOutCubic,
        onComplete: () => {
            animating = false
        },
    })
}

function trySnapInDirection(dir, event) {
    if (!dir) return false
    if (isDisabled()) return false
    if (performance.now() < suppressUntil && animating) {
        event?.preventDefault?.()
        return true
    }
    if (animating) {
        event?.preventDefault?.()
        return true
    }
    if (performance.now() < suppressUntil) return false

    const scrollY = window.scrollY
    const targets = getSnapTargets()
    if (!isInSnapZone(scrollY, targets)) return false

    const targetTop = pickNeighborTarget(scrollY, targets, dir)
    if (targetTop == null) return false
    if (Math.abs(scrollY - targetTop) < 2) return false

    event?.preventDefault?.()
    animateTo(targetTop)
    return true
}

function resetWheelGestureSoon() {
    clearTimeout(wheelGestureTimer)
    wheelGestureTimer = window.setTimeout(() => {
        wheelGestureTimer = null
        wheelAccum = 0
    }, WHEEL_GESTURE_IDLE_MS)
}

function onWheelHandler(event) {
    if (event.ctrlKey) return // allow pinch-zoom
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return

    // While a section animation is running, swallow wheel so native scroll can't fight it.
    if (animating) {
        event.preventDefault()
        return
    }

    if (isDisabled()) return
    if (performance.now() < suppressUntil) return

    const scrollY = window.scrollY
    const targets = getSnapTargets()
    if (!isInSnapZone(scrollY, targets)) {
        wheelAccum = 0
        return
    }

    // Pixel deltas from trackpads; line/page modes need scaling.
    let dy = event.deltaY
    if (event.deltaMode === 1) dy *= 16
    else if (event.deltaMode === 2) dy *= window.innerHeight

    if (Math.abs(dy) < WHEEL_INTENT_PX) return
    // Clamp so one noisy event can't satisfy the commit threshold alone.
    dy = Math.sign(dy) * Math.min(Math.abs(dy), WHEEL_MAX_STEP_PX)

    // Same-direction gestures accumulate; reversing resets.
    if (wheelAccum !== 0 && Math.sign(wheelAccum) !== Math.sign(dy)) {
        wheelAccum = 0
    }
    wheelAccum += dy
    resetWheelGestureSoon()

    const onIntro = scrollY <= SNAP_AT_PX
    const goingDown = wheelAccum > 0
    let need = WHEEL_COMMIT_PX
    if (onIntro) {
        need = goingDown ? WHEEL_COMMIT_INTRO_DOWN_PX : WHEEL_COMMIT_INTRO_UP_PX
    } else if (goingDown) {
        need = WHEEL_COMMIT_DOWN_PX
    }

    if (Math.abs(wheelAccum) < need) {
        // Hold mid-section paging; on the intro, let tiny native scroll through
        // so pointer noise can't jump — only a real flick commits.
        if (!onIntro) event.preventDefault()
        return
    }

    const dir = goingDown ? 1 : -1
    wheelAccum = 0
    trySnapInDirection(dir, event)
}

function onTouchStartHandler(event) {
    if (event.touches.length !== 1) {
        touchTracking = false
        return
    }
    touchTracking = true
    touchStartY = event.touches[0].clientY
    touchStartX = event.touches[0].clientX
}

function onTouchEndHandler(event) {
    if (!touchTracking) return
    touchTracking = false

    const touch = event.changedTouches?.[0]
    if (!touch) return

    const dy = touchStartY - touch.clientY
    const dx = touchStartX - touch.clientX
    const onIntro = window.scrollY <= SNAP_AT_PX
    const goingDown = dy > 0
    const swipeNeed =
        onIntro && goingDown ? TOUCH_SWIPE_INTRO_DOWN_PX : TOUCH_SWIPE_PX
    if (Math.abs(dy) < swipeNeed) return
    if (Math.abs(dy) < Math.abs(dx)) return

    const dir = goingDown ? 1 : -1

    // Kill residual touch momentum, then glide in one motion.
    const y = window.scrollY
    window.scrollTo(0, y)
    cancelSmoothScroll()

    trySnapInDirection(dir, null)
}

function attachListeners() {
    if (onWheel) return

    onWheel = onWheelHandler
    onTouchStart = onTouchStartHandler
    onTouchEnd = onTouchEndHandler
    onTouchCancel = () => {
        touchTracking = false
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchCancel, { passive: true })
}

function detachListeners() {
    animating = false
    touchTracking = false
    wheelAccum = 0
    clearTimeout(wheelGestureTimer)
    wheelGestureTimer = null
    cancelSmoothScroll()

    if (onWheel) {
        window.removeEventListener('wheel', onWheel)
        onWheel = null
    }
    if (onTouchStart) {
        window.removeEventListener('touchstart', onTouchStart)
        onTouchStart = null
    }
    if (onTouchEnd) {
        window.removeEventListener('touchend', onTouchEnd)
        onTouchEnd = null
    }
    if (onTouchCancel) {
        window.removeEventListener('touchcancel', onTouchCancel)
        onTouchCancel = null
    }
}

/** Enable hero → work project snap. Returns teardown. */
export function setupProjectScrollSnap({ root, isDisabled: disabledCheck } = {}) {
    teardownProjectScrollSnap()

    rootEl = root ?? document
    isDisabled = disabledCheck ?? (() => false)

    attachListeners()

    return teardownProjectScrollSnap
}

export function teardownProjectScrollSnap() {
    rootEl = null
    isDisabled = () => false
    detachListeners()
}
