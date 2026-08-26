const EXPAND_DURATION_MS = 700
const EXPAND_DURATION_MOBILE_MS = 1600
const EXPAND_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/* Gentler than desktop so the card→hero travel stays readable on mobile */
const EXPAND_EASE_MOBILE = 'cubic-bezier(0.33, 0.1, 0.25, 1)'
/* Start fading page chrome in before the flyer finishes */
const REVEAL_LEAD_MS = 280
/* Matches card :active / hover press-round on the portfolio thumbnails */
export const PRESS_BORDER_RADIUS = '700px 700px 20px 20px'
/* Mobile: keep the top fully rounded for the first part of the size expand */
const MOBILE_RADIUS_DELAY_MS = 420

let active = null

export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function hasPendingImageExpand() {
    return Boolean(active)
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
    style.willChange = 'top, left, width, height, border-radius'
    style.background = '#fff'

    document.body.appendChild(clone)
    document.documentElement.classList.add('image-expand-active')

    active = { clone, src, revealTimer: null }
    return active
}

export function cancelImageExpand() {
    if (!active) return
    if (active.revealTimer != null) {
        window.clearTimeout(active.revealTimer)
    }
    active.clone.remove()
    document.documentElement.classList.remove(
        'image-expand-active',
        'image-expand-settling',
        'image-expand-revealed',
    )
    active = null
}

function waitForImage(img) {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve()
    return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
    })
}

function waitForLaidOut(img, { attempts = 60 } = {}) {
    return new Promise((resolve) => {
        let left = attempts
        const tick = () => {
            const rect = img.getBoundingClientRect()
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
    if (!active || active.clone !== clone) return

    const heroImg = document.querySelector('.project-hero img')
    if (heroImg) heroImg.style.opacity = ''

    document.documentElement.classList.remove('image-expand-active')
    document.documentElement.classList.add('image-expand-settling')

    requestAnimationFrame(() => {
        document.documentElement.classList.add('image-expand-revealed')
    })
}

export async function finishImageExpand(targetImg, { duration } = {}) {
    if (!active || !targetImg) {
        cancelImageExpand()
        return
    }

    const isMobile = window.matchMedia('(max-width: 600px)').matches
    const expandMs = duration ?? (isMobile ? EXPAND_DURATION_MOBILE_MS : EXPAND_DURATION_MS)
    const ease = isMobile ? EXPAND_EASE_MOBILE : EXPAND_EASE

    const { clone } = active
    targetImg.style.opacity = '0'
    window.scrollTo(0, 0)

    await waitForImage(targetImg)
    await waitForLaidOut(targetImg)

    // Double rAF so layout after route mount is stable before measuring.
    await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve))
    })

    if (!active || active.clone !== clone) return

    window.scrollTo(0, 0)
    const to = targetImg.getBoundingClientRect()
    if (to.width <= 0 || to.height <= 0) {
        targetImg.style.opacity = ''
        cancelImageExpand()
        return
    }

    // Mobile: brief beat at the rounded card pose on the new page before growing
    if (isMobile) {
        clone.style.borderRadius = PRESS_BORDER_RADIUS
        await new Promise((resolve) => {
            window.setTimeout(resolve, 180)
        })
        if (!active || active.clone !== clone) return
    }

    void clone.offsetWidth

    const radiusDelay = isMobile ? MOBILE_RADIUS_DELAY_MS : 0
    const radiusMs = Math.max(200, expandMs - radiusDelay)

    clone.style.transition = [
        `top ${expandMs}ms ${ease}`,
        `left ${expandMs}ms ${ease}`,
        `width ${expandMs}ms ${ease}`,
        `height ${expandMs}ms ${ease}`,
        `border-radius ${radiusMs}ms ${ease} ${radiusDelay}ms`,
    ].join(', ')

    clone.style.top = `${to.top}px`
    clone.style.left = `${to.left}px`
    clone.style.width = `${to.width}px`
    clone.style.height = `${to.height}px`
    clone.style.borderRadius = '0px'

    // Crossfade page chrome in before the flyer finishes so the top bar
    // never "pops" after a dead beat at the end.
    const revealDelay = Math.max(0, expandMs - REVEAL_LEAD_MS)
    active.revealTimer = window.setTimeout(() => {
        if (active?.clone === clone) beginReveal(clone)
    }, revealDelay)

    await new Promise((resolve) => {
        let settled = false
        const done = () => {
            if (settled) return
            settled = true
            clone.removeEventListener('transitionend', onEnd)
            resolve()
        }
        const onEnd = (event) => {
            if (event.target !== clone) return
            if (event.propertyName !== 'width' && event.propertyName !== 'top') return
            done()
        }
        clone.addEventListener('transitionend', onEnd)
        setTimeout(done, expandMs + 80)
    })

    if (!active || active.clone !== clone) return

    if (active.revealTimer != null) {
        window.clearTimeout(active.revealTimer)
        active.revealTimer = null
    }
    // Ensure reveal ran even if the lead timer was late.
    if (!document.documentElement.classList.contains('image-expand-settling')) {
        beginReveal(clone)
    }

    requestAnimationFrame(() => {
        clone.remove()
        if (active?.clone === clone) active = null
        window.setTimeout(() => {
            document.documentElement.classList.remove(
                'image-expand-settling',
                'image-expand-revealed',
            )
        }, 450)
    })
}
