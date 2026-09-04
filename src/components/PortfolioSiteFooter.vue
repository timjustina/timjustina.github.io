<template>
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-contact">
                <strong
                    ref="titleRoot"
                    class="footer-contact-title"
                    :class="{ 'footer-contact-title--push': pushEnabled }"
                    :aria-label="titleText"
                >
                    <span v-if="pushEnabled" class="footer-contact-chars" aria-hidden="true">
                        <span
                            v-for="(char, index) in titleChars"
                            :key="index"
                            class="footer-contact-char"
                            data-push-char
                        >{{ char }}</span>
                    </span>
                    <template v-else>{{ titleText }}</template>
                </strong>
                <a href="mailto:design@timjustina.com" class="footer-email">design@timjustina.com</a>
            </div>
            <span class="footer-copy">© 2026 Tim Justina Yeung</span>
        </div>
    </footer>
</template>

<script>
import {
    applyPointerCharShift,
    clearPointerCharShift,
    distanceToRect,
    parseCssPx,
} from '../utils/pushText.js'
import { MOBILE_MEDIA_QUERY } from '../utils/breakpoints.js'

const FINE_POINTER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)'

export default {
    name: 'PortfolioSiteFooter',
    data() {
        return {
            titleText: 'Drop me a line :))',
            pointer: null,
            lastPointer: null,
            pointerRaf: null,
            touchPointerId: null,
            strokeActive: false,
            mobileTouchMq:
                typeof window !== 'undefined' ? window.matchMedia(MOBILE_MEDIA_QUERY) : null,
            finePointerMq:
                typeof window !== 'undefined'
                    ? window.matchMedia(FINE_POINTER_MEDIA_QUERY)
                    : null,
            reducedMotionMq:
                typeof window !== 'undefined'
                    ? window.matchMedia('(prefers-reduced-motion: reduce)')
                    : null,
        }
    },
    computed: {
        titleChars() {
            return [...this.titleText]
        },
        pushEnabled() {
            return typeof window !== 'undefined' && !this.reducedMotionMq?.matches
        },
        finePointer() {
            return this.finePointerMq?.matches ?? false
        },
        mobileTouch() {
            return this.mobileTouchMq?.matches ?? false
        },
    },
    mounted() {
        if (!this.pushEnabled) return

        this.onPointerMove = (event) => this.handlePointerMove(event)
        this.onPointerDown = (event) => this.handlePointerDown(event)
        this.onPointerUp = (event) => this.handlePointerUp(event)
        this.onScroll = () => this.handleScroll()

        window.addEventListener('pointermove', this.onPointerMove, { passive: true })
        window.addEventListener('scroll', this.onScroll, { passive: true })
        if (this.mobileTouch) {
            window.addEventListener('pointerdown', this.onPointerDown, { passive: true })
            window.addEventListener('pointerup', this.onPointerUp, { passive: true })
            window.addEventListener('pointercancel', this.onPointerUp, { passive: true })
        }
    },
    beforeUnmount() {
        if (!this.pushEnabled) return

        window.removeEventListener('pointermove', this.onPointerMove)
        window.removeEventListener('scroll', this.onScroll)
        window.removeEventListener('pointerdown', this.onPointerDown)
        window.removeEventListener('pointerup', this.onPointerUp)
        window.removeEventListener('pointercancel', this.onPointerUp)
        this.clearShift()
    },
    methods: {
        getTitleRoot() {
            return this.$refs.titleRoot ?? null
        },
        setStrokeActive(active) {
            this.strokeActive = active
            this.getTitleRoot()?.classList.toggle('footer-contact-title--stroke-active', active)
        },
        isNearPointer(x, y) {
            const root = this.getTitleRoot()
            if (!root) return false

            const styles = getComputedStyle(root)
            const pad = parseCssPx(styles, '--push-char-zone-pad', 4)
            return distanceToRect(x, y, root.getBoundingClientRect()) <= pad
        },
        scheduleApply({ immediate = false } = {}) {
            if (immediate) {
                if (this.pointerRaf != null) {
                    cancelAnimationFrame(this.pointerRaf)
                    this.pointerRaf = null
                }
                applyPointerCharShift(this.getTitleRoot(), this.pointer)
                return
            }

            if (this.pointerRaf != null) return
            this.pointerRaf = requestAnimationFrame(() => {
                this.pointerRaf = null
                applyPointerCharShift(this.getTitleRoot(), this.pointer)
            })
        },
        clearShift() {
            if (this.pointerRaf != null) {
                cancelAnimationFrame(this.pointerRaf)
                this.pointerRaf = null
            }
            this.pointer = null
            this.setStrokeActive(false)
            clearPointerCharShift(this.getTitleRoot())
        },
        updatePointerFromCoords(x, y) {
            this.lastPointer = { x, y }

            if (this.isNearPointer(x, y)) {
                this.pointer = { x, y }
                this.scheduleApply({ immediate: this.mobileTouch && this.strokeActive })
                return
            }

            if (this.pointer) {
                this.clearShift()
            }
        },
        handlePointerMove(event) {
            if (this.finePointer) {
                if (event.pointerType !== 'mouse') return
                this.updatePointerFromCoords(event.clientX, event.clientY)
                return
            }

            if (
                this.mobileTouch &&
                this.touchPointerId != null &&
                event.pointerId === this.touchPointerId
            ) {
                this.updatePointerFromCoords(event.clientX, event.clientY)
            }
        },
        handlePointerDown(event) {
            if (!this.mobileTouch) return
            if (!this.isNearPointer(event.clientX, event.clientY)) return

            this.touchPointerId = event.pointerId
            this.setStrokeActive(true)
            this.updatePointerFromCoords(event.clientX, event.clientY)
        },
        handlePointerUp(event) {
            if (this.touchPointerId != null && event.pointerId !== this.touchPointerId) return

            this.touchPointerId = null
            this.clearShift()
        },
        handleScroll() {
            if (!this.lastPointer) return
            const { x, y } = this.lastPointer
            this.updatePointerFromCoords(x, y)
        },
    },
}
</script>

<style scoped>
.site-footer {
    --brand: #000aaa;
    --muted: #757575;
    --top-bar-height: 120px;
    --top-bar-logo-height: 52px;
    --top-bar-nav-height: 30px;
    --top-bar-edge-pad-left: calc((var(--top-bar-height) - var(--top-bar-logo-height)) / 2);
    --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
    --footer-edge-pad-vertical: var(--top-bar-edge-pad-left);

    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    min-height: 128px;
    padding: var(--footer-edge-pad-vertical) var(--top-bar-edge-pad-right) var(--footer-edge-pad-vertical)
        var(--top-bar-edge-pad-left);
    box-sizing: border-box;
    background: #fff;
}

.footer-inner {
    --footer-item-gap: 12px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
}

.footer-contact {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--footer-item-gap);
}

.footer-contact-title {
    margin: 0;
    font-family: 'Fira Code', monospace;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 36px;
    letter-spacing: -0.02em;
    color: var(--brand);
    font-synthesis: none;
}

.footer-contact-title--push {
    --push-char-duration: 0.85s;
    --push-char-zone-pad: 4px;
    --push-char-zone-pad-tight: 1px;
    --push-char-hover-radius: 160px;
    --push-char-hover-shift: 84px;
    --push-char-hover-lift: 32px;
    --push-char-hover-force-exp: 2.65;
    --push-char-hover-lift-exp: 2.2;
    --push-char-hover-min-force: 0;
    --push-char-hover-radius-exit-mult: 1;
    --push-char-hover-knock-mult: 0.55;
    --push-char-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.footer-contact-chars {
    display: inline;
}

.footer-contact-char {
    display: inline-block;
    white-space: pre;
}

@media (hover: hover) and (pointer: fine) {
    .footer-contact-title--push .footer-contact-char {
        transform: translate3d(0, 0, 0);
        transition: transform var(--push-char-duration, 0.85s) var(--push-char-ease);
        will-change: transform;
    }

    .footer-contact-title--push .footer-contact-char.push-char--pushed {
        transform: translate3d(var(--push-char-x, 0), var(--push-char-y, 0), 0);
        transition: transform
            calc(var(--push-char-duration, 0.85s) * var(--push-char-hover-knock-mult, 0.55))
            var(--push-char-ease);
    }
}

@media (width < 800px) {
    .footer-contact-title--push {
        --push-char-hover-radius: 160px;
        --push-char-hover-shift: 102px;
        --push-char-hover-lift: 38px;
        --push-char-hover-force-exp: 1.45;
        --push-char-hover-lift-exp: 1.25;
        --push-char-hover-radius-exit-mult: 1.08;
        --push-char-hover-knock-mult: 0.34;
        touch-action: pan-y;
    }

    .footer-contact-title--push.footer-contact-title--stroke-active .footer-contact-char {
        transition: none;
    }

    .footer-contact-title--push .footer-contact-char {
        transform: translate3d(0, 0, 0);
        transition: transform var(--push-char-duration, 0.85s) var(--push-char-ease);
        will-change: transform;
    }

    .footer-contact-title--push .footer-contact-char.push-char--pushed {
        transform: translate3d(var(--push-char-x, 0), var(--push-char-y, 0), 0);
        transition: transform
            calc(var(--push-char-duration, 0.85s) * var(--push-char-hover-knock-mult, 0.34))
            var(--push-char-ease);
    }
}

.footer-email,
.footer-copy {
    font-family: 'Work Sans', sans-serif;
    font-size: 20px;
    font-weight: 300;
    line-height: 27px;
    color: var(--muted);
    white-space: nowrap;
    flex-shrink: 0;
}

.footer-email {
    text-decoration: underline;
    text-decoration-thickness: 0.8px;
    text-underline-offset: 3px;
}

.footer-email:hover {
    color: var(--brand);
}

@media (width < 800px) {
    .site-footer {
        --top-bar-height: 86px;
        --top-bar-edge-pad-left: 20px;
        --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
        --footer-edge-pad-vertical: var(--top-bar-edge-pad-left);
        min-height: 0;
        padding: var(--footer-edge-pad-vertical) var(--top-bar-edge-pad-right) var(--footer-edge-pad-vertical)
            var(--top-bar-edge-pad-left);
    }

    .footer-inner {
        --footer-item-gap: 12px;
        flex-direction: column;
        align-items: stretch;
    }

    .footer-email,
    .footer-copy {
        font-size: 18px;
    }

    .footer-copy {
        align-self: flex-end;
        margin-top: 80px;
    }
}

@media (max-width: 600px) {
    .footer-contact-title {
        font-size: 22px;
        line-height: 33px;
    }
}
</style>
