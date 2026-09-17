const EXPAND_DURATION_MS = 700
const EXPAND_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const REVEAL_LEAD_MS = 220
export const PRESS_BORDER_RADIUS = '700px 700px 20px 20px'

const ACTIVE_KEY = '__tjImageExpand'

function getActive() {
    return window[ACTIVE_KEY] || null
}

function setActive(next) {
    window[ACTIVE_KEY] = next
}

export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function hasPendingImageExpand() {
    return Boolean(getActive()?.clone?.isConnected)
}

export function startImageExpand({ src, rect, borderRadius = '0px' }) {
    cancelImageExpand()

    const clone = document.createElement('img')
    clone.src = src
    clone.alt = ''
    clone.setAttribute('aria-hidden', 'true')
    clone.className = 'image-expand-clone'
    clone.decoding = 'async'

    const { style } = clone
    style.position = 'fixed'
    style.top = `${rect.top}px`
    style.left = `${rect.left}px`
    style.width = `${rect.width}px`
    style.height = `${rect.height}px`
    style.objectFit = 'cover'
    style.objectPosition = 'center top'
    style.borderRadius = borderRadius
    // Below the fixed top bar (z-index 100) so nav stays visible over the expand
    style.zIndex = '90'
    style.margin = '0'
    style.padding = '0'
    style.border = 'none'
    style.display = 'block'
    style.pointerEvents = 'none'
    style.boxSizing = 'border-box'
    style.background = '#fff'
    style.transition = 'none'
    style.willChange = 'top, left, width, height, border-radius'

    document.body.appendChild(clone)
    document.documentElement.classList.add('image-expand-active')

    setActive({
        clone,
        src,
        revealTimer: null,
        fromRect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        },
        borderRadius,
    })
    return getActive()
}

export function cancelImageExpand() {
    const active = getActive()
    if (!active) return
    if (active.revealTimer != null) {
        window.clearTimeout(active.revealTimer)
    }
    active.clone?.remove()
    document.documentElement.classList.remove(
        'image-expand-active',
        'image-expand-settling',
        'image-expand-revealed',
    )
    setActive(null)
}

function waitForImage(img) {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve()
    return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
    })
}

function waitForLaidOut(el, { attempts = 90 } = {}) {
    return new Promise((resolve) => {
        let left = attempts
        const tick = () => {
            const rect = el.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
                resolve(rect)
                return
            }
            left -= 1
            if (left <= 0) {
                resolve(rect)
                return
            }
            requestAnimationFrame(tick)
        }
        tick()
    })
}

function beginReveal(clone) {
    const active = getActive()
    if (!active || active.clone !== clone) return

    const heroImg = document.querySelector('.project-hero img')
    if (heroImg) heroImg.style.opacity = ''

    document.documentElement.classList.remove('image-expand-active')
    document.documentElement.classList.add('image-expand-settling')

    requestAnimationFrame(() => {
        document.documentElement.classList.add('image-expand-revealed')
    })
}

function waitForTransition(el, propertyNames, fallbackMs) {
    return new Promise((resolve) => {
        let settled = false
        const done = () => {
            if (settled) return
            settled = true
            el.removeEventListener('transitionend', onEnd)
            resolve()
        }
        const onEnd = (event) => {
            if (event.target !== el) return
            if (!propertyNames.includes(event.propertyName)) return
            done()
        }
        el.addEventListener('transitionend', onEnd)
        window.setTimeout(done, fallbackMs)
    })
}

/**
 * Morph the flyer into the visible `.project-hero` frame.
 * Same timing/ease on mobile and desktop. object-fit: cover keeps image aspect.
 */
export async function finishImageExpand(targetImg, { duration = EXPAND_DURATION_MS } = {}) {
    const active = getActive()
    if (!active?.clone || !targetImg) {
        cancelImageExpand()
        return
    }

    const { clone, fromRect, borderRadius } = active
    targetImg.style.opacity = '0'
    window.scrollTo(0, 0)

    await waitForImage(targetImg)

    const heroFrame =
        targetImg.closest('.project-hero') ||
        targetImg.parentElement ||
        targetImg
    await waitForLaidOut(heroFrame)

    await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve))
    })

    if (getActive()?.clone !== clone) return

    window.scrollTo(0, 0)
    const to = heroFrame.getBoundingClientRect()
    if (to.width <= 0 || to.height <= 0 || fromRect.width <= 0 || fromRect.height <= 0) {
        targetImg.style.opacity = ''
        cancelImageExpand()
        return
    }

    clone.style.transition = 'none'
    clone.style.objectFit = 'cover'
    clone.style.objectPosition = 'center top'
    clone.style.top = `${fromRect.top}px`
    clone.style.left = `${fromRect.left}px`
    clone.style.width = `${fromRect.width}px`
    clone.style.height = `${fromRect.height}px`
    clone.style.borderRadius = borderRadius
    void clone.offsetWidth

    clone.style.transition = [
        `top ${duration}ms ${EXPAND_EASE}`,
        `left ${duration}ms ${EXPAND_EASE}`,
        `width ${duration}ms ${EXPAND_EASE}`,
        `height ${duration}ms ${EXPAND_EASE}`,
        `border-radius ${duration}ms ${EXPAND_EASE}`,
    ].join(', ')
    void clone.offsetWidth

    clone.style.top = `${to.top}px`
    clone.style.left = `${to.left}px`
    clone.style.width = `${to.width}px`
    clone.style.height = `${to.height}px`
    clone.style.borderRadius = '0px'

    active.revealTimer = window.setTimeout(() => {
        if (getActive()?.clone === clone) beginReveal(clone)
    }, Math.max(0, duration - REVEAL_LEAD_MS))

    await waitForTransition(clone, ['width', 'height', 'top'], duration + 120)

    if (getActive()?.clone !== clone) return

    if (active.revealTimer != null) {
        window.clearTimeout(active.revealTimer)
        active.revealTimer = null
    }
    if (!document.documentElement.classList.contains('image-expand-settling')) {
        beginReveal(clone)
    }

    requestAnimationFrame(() => {
        clone.remove()
        if (getActive()?.clone === clone) setActive(null)
        window.setTimeout(() => {
            document.documentElement.classList.remove(
                'image-expand-settling',
                'image-expand-revealed',
            )
        }, 450)
    })
}
