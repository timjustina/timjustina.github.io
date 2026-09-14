/** Mobile work-thumb crop parallax from device orientation. */

const NEUTRAL_BETA = 45
const MAX_ANGLE = 28
const MAX_SHIFT_X_PX = 90
const MAX_SHIFT_Y_PX = 48
const LERP = 0.14

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n))
}

function screenAngle() {
    if (typeof window === 'undefined') return 0
    const orient = window.screen?.orientation?.angle
    if (typeof orient === 'number') return orient
    if (typeof window.orientation === 'number') return window.orientation
    return 0
}

/** Remap beta/gamma into UI x/y for the current screen rotation. */
export function remapOrientation(beta, gamma) {
    const angle = ((screenAngle() % 360) + 360) % 360
    let x = gamma
    let y = beta - NEUTRAL_BETA
    if (angle === 90) {
        x = beta - NEUTRAL_BETA
        y = -gamma
    } else if (angle === 270 || angle === -90) {
        x = -(beta - NEUTRAL_BETA)
        y = gamma
    } else if (angle === 180) {
        x = -gamma
        y = -(beta - NEUTRAL_BETA)
    }
    return { x, y }
}

export function orientationToShift(beta, gamma) {
    if (beta == null || gamma == null || Number.isNaN(beta) || Number.isNaN(gamma)) {
        return { x: 0, y: 0 }
    }
    const { x, y } = remapOrientation(beta, gamma)
    const nx = clamp(x / MAX_ANGLE, -1, 1)
    const ny = clamp(y / MAX_ANGLE, -1, 1)
    // Negate so tilting left reveals more of the left side of the image.
    return {
        x: -nx * MAX_SHIFT_X_PX,
        y: -ny * MAX_SHIFT_Y_PX,
    }
}

export function lerpTilt(current, target, amount = LERP) {
    const dx = target.x - current.x
    const dy = target.y - current.y
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        return { x: target.x, y: target.y, settled: true }
    }
    return {
        x: current.x + dx * amount,
        y: current.y + dy * amount,
        settled: false,
    }
}

export function needsOrientationPermission() {
    return (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
    )
}

export async function requestOrientationPermission() {
    if (!needsOrientationPermission()) return 'granted'
    try {
        const state = await DeviceOrientationEvent.requestPermission()
        return state === 'granted' ? 'granted' : 'denied'
    } catch {
        return 'denied'
    }
}

export function supportsDeviceOrientation() {
    return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
}
