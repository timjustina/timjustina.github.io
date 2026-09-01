export function parseCssPx(styles, prop, fallback) {
    const raw = styles.getPropertyValue(prop).trim()
    if (!raw) return fallback
    const n = parseFloat(raw)
    return Number.isFinite(n) ? n : fallback
}

export function distanceToRect(x, y, rect) {
    if (rect.width <= 0 || rect.height <= 0) return Infinity
    const dx = Math.max(rect.left - x, 0, x - rect.right)
    const dy = Math.max(rect.top - y, 0, y - rect.bottom)
    return Math.hypot(dx, dy)
}

const DEFAULT_PUSH_OPTIONS = {
    charSelector: '[data-push-char]',
    pushedClass: 'push-char--pushed',
    pushXProp: '--push-char-x',
    pushYProp: '--push-char-y',
    radiusVar: '--push-char-hover-radius',
    shiftVar: '--push-char-hover-shift',
    liftVar: '--push-char-hover-lift',
    forceExpVar: '--push-char-hover-force-exp',
    liftExpVar: '--push-char-hover-lift-exp',
    minForceVar: '--push-char-hover-min-force',
    radiusExitMultVar: '--push-char-hover-radius-exit-mult',
}

export function applyPointerCharShift(root, pointer, options = {}) {
    const opts = { ...DEFAULT_PUSH_OPTIONS, ...options }
    if (!root || !pointer) return

    const styles = getComputedStyle(root)
    const radius = parseCssPx(styles, opts.radiusVar, 160)
    const maxShift = parseCssPx(styles, opts.shiftVar, 84)
    const maxLift = parseCssPx(styles, opts.liftVar, 32)
    const forceExp = parseCssPx(styles, opts.forceExpVar, 2.65)
    const liftExp = parseCssPx(styles, opts.liftExpVar, 2.2)
    const minForce = parseCssPx(styles, opts.minForceVar, 0)
    const radiusExitMult = parseCssPx(styles, opts.radiusExitMultVar, 1)
    const { x, y } = pointer

    for (const el of root.querySelectorAll(opts.charSelector)) {
        const rect = el.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) {
            el.classList.remove(opts.pushedClass)
            el.style.removeProperty(opts.pushXProp)
            el.style.removeProperty(opts.pushYProp)
            continue
        }

        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = cx - x
        const dy = cy - y
        const dist = Math.hypot(dx, dy)
        const wasPushed = el.classList.contains(opts.pushedClass)
        const effectiveRadius = wasPushed ? radius * radiusExitMult : radius

        if (dist < effectiveRadius) {
            const t = dist <= 0 ? 1 : 1 - dist / radius
            const force = Math.max(t ** forceExp, minForce) * maxShift
            const lift = Math.max(t ** liftExp, minForce) * maxLift
            let nx
            let ny
            if (dist <= 0.5) {
                nx = 0
                ny = -1
            } else {
                nx = dx / dist
                ny = dy / dist
            }
            el.classList.add(opts.pushedClass)
            el.style.setProperty(opts.pushXProp, `${nx * force}px`)
            el.style.setProperty(opts.pushYProp, `${ny * force - lift}px`)
        } else {
            el.classList.remove(opts.pushedClass)
            el.style.removeProperty(opts.pushXProp)
            el.style.removeProperty(opts.pushYProp)
        }
    }
}

export function clearPointerCharShift(root, options = {}) {
    const opts = { ...DEFAULT_PUSH_OPTIONS, ...options }
    if (!root) return

    for (const el of root.querySelectorAll(opts.charSelector)) {
        el.classList.remove(opts.pushedClass)
        el.style.removeProperty(opts.pushXProp)
        el.style.removeProperty(opts.pushYProp)
    }
}
