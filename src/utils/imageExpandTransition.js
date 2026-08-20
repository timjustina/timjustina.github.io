const EXPAND_DURATION_MS = 700
const EXPAND_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

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
    style.zIndex = '10001'
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

    active = { clone, src }
    return active
}

export function cancelImageExpand() {
    if (!active) return
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

export async function finishImageExpand(targetImg, { duration = EXPAND_DURATION_MS } = {}) {
    if (!active || !targetImg) {
        cancelImageExpand()
        return
    }

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

    void clone.offsetWidth

    clone.style.transition = [
        `top ${duration}ms ${EXPAND_EASE}`,
        `left ${duration}ms ${EXPAND_EASE}`,
        `width ${duration}ms ${EXPAND_EASE}`,
        `height ${duration}ms ${EXPAND_EASE}`,
        `border-radius ${duration}ms ${EXPAND_EASE}`,
    ].join(', ')

    clone.style.top = `${to.top}px`
    clone.style.left = `${to.left}px`
    clone.style.width = `${to.width}px`
    clone.style.height = `${to.height}px`
    clone.style.borderRadius = '0px'

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
        setTimeout(done, duration + 120)
    })

    if (!active || active.clone !== clone) return

    targetImg.style.opacity = ''
    document.documentElement.classList.remove('image-expand-active')
    document.documentElement.classList.add('image-expand-settling')

    requestAnimationFrame(() => {
        clone.remove()
        if (active?.clone === clone) active = null
        document.documentElement.classList.add('image-expand-revealed')
        window.setTimeout(() => {
            document.documentElement.classList.remove(
                'image-expand-settling',
                'image-expand-revealed',
            )
        }, 500)
    })
}
