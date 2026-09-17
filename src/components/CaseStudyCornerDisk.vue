<template>
    <Teleport to="body">
        <template v-if="eligible">
            <span
                class="cs-corner-disk cs-corner-disk--frost"
                :class="{
                    'cs-corner-disk--visible': visible,
                    'cs-corner-disk--menu': menuChrome,
                    'cs-corner-disk--pill': menuChrome,
                }"
                :style="frostStyle"
                aria-hidden="true"
            />
            <span
                class="cs-corner-disk cs-corner-disk--dot"
                :class="{ 'cs-corner-disk--visible': visible }"
                :style="dotStyle"
                aria-hidden="true"
            />
            <nav
                v-if="expand > 0.08 && visible"
                class="cs-corner-disk-menu"
                :style="menuStyle"
                aria-label="Portfolio sections"
            >
                <router-link
                    v-for="(item, index) in menuItems"
                    :key="item.id"
                    class="cs-corner-disk-menu__item"
                    :to="item.to"
                    :style="menuItemStyle(item, index)"
                    @click="onMenuItemClick"
                >{{ item.label }}</router-link>
            </nav>
            <span
                class="cs-corner-disk-hit"
                :style="hitStyle"
                aria-hidden="true"
                @pointerdown="onHitPointerDown"
                @pointerup="onHitPointerUp"
                @pointercancel="onHitPointerCancel"
            />
        </template>
    </Teleport>
</template>

<script>
import { CASE_STUDY_MOBILE_MEDIA_QUERY } from '../utils/breakpoints.js'

const FINE_POINTER_MQ = '(hover: hover) and (pointer: fine)'
const EDGE_GAP_PX = 20
const IDLE_SIZE = 48
const IDLE_DOT = 8
const MENU_DOT = 4
const HIT_SIZE = 56
/** Phase 1: idle frost slides left to the open-menu center. */
const TRAVEL_MS = 220
/** Phase 2: frost blooms into the dual Work/About pill. */
const EXPAND_MS = 440
/**
 * Bloom starts this far through the travel (0…1) so slide → expand
 * crossfades instead of hard-cutting.
 */
const BLOOM_AT_TRAVEL = 0.52
/** Close: start sliding home once the pill has mostly collapsed. */
const TRAVEL_HOME_AT_COLLAPSE = 0.4
const OUTSIDE_CLOSE_GUARD_MS = 420
const LABEL_GAP_PX = 20
const FROST_OUTER_GAP_PX = 20
const EXPAND_OVERSHOOT = 1.035
const FROST_OVERSHOOT = 1.28
const FROST_DIP_PX = 10
const FROST_DIP_UNTIL = 0.2

const LABEL_FALLBACK = { Work: 48, About: 58 }

function prefersReducedMotion() {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
}

function isTouchDiskEnvironment() {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia(CASE_STUDY_MOBILE_MEDIA_QUERY).matches &&
        !window.matchMedia(FINE_POINTER_MQ).matches &&
        !prefersReducedMotion()
    )
}

/** Quintic smoothstep — soft acceleration / deceleration for continuous motion. */
function smootherstep(t) {
    const x = Math.max(0, Math.min(1, t))
    return x * x * x * (x * (x * 6 - 15) + 10)
}

function expandEase(t, opening) {
    const x = Math.max(0, Math.min(1, t))
    if (!opening) return smootherstep(x)
    // Soft overshoot then settle — gentler than the portfolio punch.
    const c1 = EXPAND_OVERSHOOT
    const c3 = c1 + 1
    const raw = 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
    // Blend with smootherstep so the first half doesn't snap.
    return smootherstep(x) * 0.35 + raw * 0.65
}

/** Slide: snappy ease-out so the dart left/right feels quick. */
function travelEase(t) {
    const x = Math.max(0, Math.min(1, t))
    return 1 - (1 - x) ** 2.2
}

function frostExpandEase(t) {
    const x = Math.max(0, Math.min(1, t))
    const c1 = FROST_OVERSHOOT
    const c3 = c1 + 1
    const raw = 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
    return smootherstep(x) * 0.4 + raw * 0.6
}

function frostOpenDipPx(t) {
    if (t <= 0 || t >= FROST_DIP_UNTIL) return 0
    return Math.sin((t / FROST_DIP_UNTIL) * Math.PI) * FROST_DIP_PX
}

function measureLabelWidths() {
    if (typeof document === 'undefined') return { ...LABEL_FALLBACK }
    const probe = document.createElement('span')
    probe.style.cssText =
        'position:absolute;visibility:hidden;pointer-events:none;white-space:nowrap;' +
        'font-family:"Work Sans",sans-serif;font-size:18px;font-weight:500;line-height:30px;'
    document.body.appendChild(probe)
    const out = {}
    for (const label of Object.keys(LABEL_FALLBACK)) {
        probe.textContent = label
        out[label] = Math.max(1, Math.ceil(probe.offsetWidth))
    }
    probe.remove()
    return out
}

function dualFrostMetrics(widths) {
    const blueR = MENU_DOT / 2
    const gap = LABEL_GAP_PX
    const outer = FROST_OUTER_GAP_PX
    const workW = widths.Work || LABEL_FALLBACK.Work
    const aboutW = widths.About || LABEL_FALLBACK.About
    const height = IDLE_SIZE
    const idleR = height / 2
    const left = outer + workW + gap + blueR
    const right = outer + aboutW + gap + blueR
    return { width: left + right, height, left, right, halfH: idleR }
}

function placeRadial(base, side, deg, gap, width) {
    const centerR = gap + width / 2
    const rad = (deg * Math.PI) / 180
    const rot = side === 'left' ? deg - 180 : deg
    return {
        ...base,
        x: `${Math.cos(rad) * centerR}px`,
        y: `${Math.sin(rad) * centerR}px`,
        rot: `${rot}deg`,
    }
}

export default {
    name: 'CaseStudyCornerDisk',
    data() {
        return {
            eligible: false,
            /** 0…1 idle-corner → open-center slide (runs before frost bloom). */
            travel: 0,
            expand: 0,
            expandLinear: 0,
            expandOpening: false,
            menuOpen: false,
            popping: false,
            labelWidths: { ...LABEL_FALLBACK },
            pos: { x: 0, y: 0 },
            idlePos: { x: 0, y: 0 },
            openPos: { x: 0, y: 0 },
            pointerId: null,
            pointerStart: { x: 0, y: 0 },
            outsideCloseBound: false,
            outsideCloseUntil: 0,
            expandRaf: null,
            mq: null,
        }
    },
    computed: {
        visible() {
            return this.eligible
        },
        menuChrome() {
            return this.expand > 0.02
        },
        isOpen() {
            return this.menuOpen || this.expand > 0.02 || this.travel > 0.02
        },
        frostMetrics() {
            return dualFrostMetrics(this.labelWidths)
        },
        menuItems() {
            const blueR = MENU_DOT / 2
            const gap = blueR + LABEL_GAP_PX
            const workW = this.labelWidths.Work || LABEL_FALLBACK.Work
            const aboutW = this.labelWidths.About || LABEL_FALLBACK.About
            return [
                placeRadial(
                    {
                        id: 'work',
                        label: 'Work',
                        to: { path: '/', hash: '#work' },
                    },
                    'left',
                    180,
                    gap,
                    workW,
                ),
                placeRadial(
                    {
                        id: 'about',
                        label: 'About',
                        to: { path: '/', hash: '#about' },
                    },
                    'right',
                    0,
                    gap,
                    aboutW,
                ),
            ]
        },
        liveFrost() {
            const idleR = IDLE_SIZE / 2
            const { left: openL, right: openR, height: openH } = this.frostMetrics
            const expandT = this.expand
            let blend
            let dip = 0
            if (this.popping && this.expandOpening) {
                const u = this.expandLinear
                blend = frostExpandEase(u)
                dip = frostOpenDipPx(u)
            } else {
                blend = Math.min(Math.max(expandT, 0), 1.15)
            }
            const left = idleR + (openL - idleR) * blend - dip * 0.15
            const right = idleR + (openR - idleR) * blend - dip * 0.15
            const height = Math.max(IDLE_SIZE / 2, IDLE_SIZE + (openH - IDLE_SIZE) * blend - dip)
            return {
                left: Math.max(IDLE_SIZE / 4, left),
                right: Math.max(IDLE_SIZE / 4, right),
                width: Math.max(IDLE_SIZE, left + right),
                height,
            }
        },
        frostStyle() {
            const { x, y } = this.pos
            const menuOpen = this.menuChrome
            let sizeW
            let sizeH
            let marginL
            if (menuOpen) {
                const live = this.liveFrost
                sizeW = live.width
                sizeH = live.height
                marginL = -Math.max(IDLE_SIZE / 2, live.left)
            } else {
                sizeW = IDLE_SIZE
                sizeH = IDLE_SIZE
                marginL = -IDLE_SIZE / 2
            }
            const halfH = sizeH / 2
            return {
                transform: `translate3d(${x}px, ${y}px, 0)`,
                width: `${sizeW}px`,
                height: `${sizeH}px`,
                margin: `${-halfH}px 0 0 ${marginL}px`,
            }
        },
        dotStyle() {
            const { x, y } = this.pos
            const expandT = Math.min(1, Math.max(0, this.expand))
            const size = IDLE_DOT + (MENU_DOT - IDLE_DOT) * expandT
            const half = size / 2
            return {
                transform: `translate3d(${x}px, ${y}px, 0)`,
                width: `${size}px`,
                height: `${size}px`,
                margin: `${-half}px 0 0 ${-half}px`,
                zIndex: this.menuChrome ? 10005 : undefined,
            }
        },
        menuStyle() {
            const { x, y } = this.pos
            return {
                transform: `translate3d(${x}px, ${y}px, 0)`,
            }
        },
        hitStyle() {
            const { x, y } = this.pos
            const expandT = Math.min(1, Math.max(0, this.expand))
            const dot = IDLE_DOT + (MENU_DOT - IDLE_DOT) * expandT
            const size = expandT > 0.02 ? Math.max(HIT_SIZE, dot + 12) : HIT_SIZE
            const half = size / 2
            return {
                transform: `translate3d(${x}px, ${y}px, 0)`,
                width: `${size}px`,
                height: `${size}px`,
                margin: `${-half}px 0 0 ${-half}px`,
                zIndex: expandT > 0.02 ? 10006 : 10003,
            }
        },
    },
    mounted() {
        this.syncEligible()
        this.mq = window.matchMedia(CASE_STUDY_MOBILE_MEDIA_QUERY)
        this.fineMq = window.matchMedia(FINE_POINTER_MQ)
        this.reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
        this.onMqChange = () => this.syncEligible()
        this.mq.addEventListener('change', this.onMqChange)
        this.fineMq.addEventListener('change', this.onMqChange)
        this.reduceMq.addEventListener('change', this.onMqChange)
        window.addEventListener('resize', this.onResize, { passive: true })
        this.labelWidths = measureLabelWidths()
        document.fonts?.ready?.then(() => {
            this.labelWidths = measureLabelWidths()
            this.layoutParkPositions()
        })
        this.layoutParkPositions()
    },
    beforeUnmount() {
        this.unbindOutsideClose()
        if (this.expandRaf != null) cancelAnimationFrame(this.expandRaf)
        this.mq?.removeEventListener('change', this.onMqChange)
        this.fineMq?.removeEventListener('change', this.onMqChange)
        this.reduceMq?.removeEventListener('change', this.onMqChange)
        window.removeEventListener('resize', this.onResize)
    },
    methods: {
        /**
         * Labels compress into the blue center with expand — matches frost speed.
         */
        menuItemStyle(item, index) {
            const t = Math.max(0, Math.min(1, this.expand))
            // Collapse: steep so words vanish ahead of the frost.
            // Open: gentler so labels bloom with the pill.
            const closing = this.popping && !this.expandOpening
            const compress = closing
                ? Math.max(0, Math.min(1, t * t * t * 2.2))
                : Math.max(0, Math.min(1, Math.pow(t, 0.75)))
            const x0 = parseFloat(item.x) || 0
            const y0 = parseFloat(item.y) || 0
            const towardCenter = x0 < 0
            const origin = towardCenter ? 'right center' : 'left center'
            const rot = item.rot || '0deg'
            return {
                '--menu-i': index,
                left: `${x0 * compress}px`,
                top: `${y0 * compress}px`,
                opacity: compress,
                transformOrigin: origin,
                transform: `translate(-50%, -50%) rotate(${rot}) scaleX(${compress}) scaleY(${0.85 + 0.15 * compress})`,
                pointerEvents: compress > 0.4 ? 'auto' : 'none',
            }
        },
        syncEligible() {
            const next = isTouchDiskEnvironment()
            if (next === this.eligible) return
            this.eligible = next
            if (next) {
                this.layoutParkPositions()
                this.pos = { ...this.idlePos }
            } else {
                this.closeMenu({ instant: true })
            }
        },
        onResize() {
            if (!this.eligible) return
            this.layoutParkPositions()
            this.syncPosFromTravel()
        },
        /**
         * Idle disk in the lower-right corner. Open dual pill keeps its right
         * edge on that same corner — blue center sits at openPos after travel.
         */
        layoutParkPositions() {
            if (typeof window === 'undefined') return
            const gap = EDGE_GAP_PX
            const idleR = IDLE_SIZE / 2
            const vw = window.innerWidth
            const vh = window.innerHeight
            const idleX = vw - gap - idleR
            const idleY = vh - gap - idleR
            const metrics = this.frostMetrics
            this.idlePos = { x: Math.round(idleX), y: Math.round(idleY) }
            this.openPos = {
                x: Math.round(vw - gap - metrics.right),
                y: Math.round(idleY),
            }
        },
        /** Travel drives the slide; expand blooms in place at openPos. */
        syncPosFromTravel() {
            const t = Math.min(1, Math.max(0, this.travel))
            this.pos = {
                x: this.idlePos.x + (this.openPos.x - this.idlePos.x) * t,
                y: this.idlePos.y,
            }
        },
        openMenu() {
            this.layoutParkPositions()
            this.labelWidths = measureLabelWidths()
            this.layoutParkPositions()
            this.outsideCloseUntil = performance.now() + OUTSIDE_CLOSE_GUARD_MS
            this.bindOutsideClose()
            this.animateOpen()
        },
        closeMenu(options = {}) {
            this.unbindOutsideClose()
            if (this.expand <= 0.02 && this.travel <= 0.02 && !this.menuOpen) return
            if (options.instant || prefersReducedMotion()) {
                this.cancelAnim()
                this.travel = 0
                this.expand = 0
                this.expandLinear = 0
                this.expandOpening = false
                this.menuOpen = false
                this.popping = false
                this.pos = { ...this.idlePos }
                return
            }
            this.animateClose()
        },
        toggleMenu() {
            if (this.isOpen) this.closeMenu()
            else this.openMenu()
        },
        cancelAnim() {
            if (this.expandRaf != null) {
                cancelAnimationFrame(this.expandRaf)
                this.expandRaf = null
            }
        },
        /**
         * Open: frost slides left, then blooms — phases overlap so the handoff
         * reads as one continuous motion instead of two beats.
         */
        animateOpen() {
            this.cancelAnim()
            if (prefersReducedMotion()) {
                this.travel = 1
                this.expand = 1
                this.expandLinear = 1
                this.expandOpening = false
                this.popping = false
                this.menuOpen = true
                this.syncPosFromTravel()
                return
            }

            const travelFrom = this.travel
            const expandFrom = this.expand
            const travelSpan = Math.max(0.001, 1 - travelFrom)
            const expandSpan = Math.max(0.001, 1 - expandFrom)
            // Total clock: travel duration + remaining bloom after the overlap point.
            const bloomLead = TRAVEL_MS * (1 - BLOOM_AT_TRAVEL)
            const totalMs = TRAVEL_MS + Math.max(0, EXPAND_MS - bloomLead)
            const start = performance.now()
            this.popping = true
            this.expandOpening = true

            const tick = (now) => {
                const elapsed = now - start
                const travelT = Math.min(1, elapsed / TRAVEL_MS)
                this.travel = travelFrom + travelSpan * travelEase(travelT)
                this.syncPosFromTravel()

                const bloomElapsed = elapsed - TRAVEL_MS * BLOOM_AT_TRAVEL
                if (bloomElapsed > 0) {
                    const u = Math.min(1, bloomElapsed / EXPAND_MS)
                    this.expandLinear = u
                    this.expand = expandFrom + expandSpan * expandEase(u, true)
                }

                if (elapsed < totalMs) {
                    this.expandRaf = requestAnimationFrame(tick)
                    return
                }
                this.expandRaf = null
                this.travel = 1
                this.expand = 1
                this.expandLinear = 1
                this.expandOpening = false
                this.popping = false
                this.menuOpen = true
                this.syncPosFromTravel()
            }
            this.expandRaf = requestAnimationFrame(tick)
        },
        /** Close: collapse and slide home overlap the same way. */
        animateClose() {
            this.cancelAnim()
            if (prefersReducedMotion()) {
                this.travel = 0
                this.expand = 0
                this.expandLinear = 0
                this.expandOpening = false
                this.popping = false
                this.menuOpen = false
                this.syncPosFromTravel()
                return
            }

            const expandFrom = this.expand
            const travelFrom = this.travel
            this.popping = true
            this.expandOpening = false
            this.menuOpen = false

            const collapseMs = expandFrom > 0.02 ? EXPAND_MS : 0
            const homeLead = collapseMs * (1 - TRAVEL_HOME_AT_COLLAPSE)
            const totalMs =
                collapseMs +
                (travelFrom > 0.02 ? Math.max(0, TRAVEL_MS - homeLead) : 0)
            const start = performance.now()

            if (totalMs <= 0) {
                this.travel = 0
                this.expand = 0
                this.expandLinear = 0
                this.popping = false
                this.syncPosFromTravel()
                this.unbindOutsideClose()
                return
            }

            const tick = (now) => {
                const elapsed = now - start

                if (collapseMs > 0) {
                    const u = Math.min(1, elapsed / collapseMs)
                    this.expandLinear = u
                    this.expand = expandFrom * (1 - expandEase(u, false))
                } else {
                    this.expand = 0
                    this.expandLinear = 0
                }

                const homeElapsed =
                    collapseMs > 0
                        ? elapsed - collapseMs * TRAVEL_HOME_AT_COLLAPSE
                        : elapsed
                if (homeElapsed > 0 && travelFrom > 0.02) {
                    const t = Math.min(1, homeElapsed / TRAVEL_MS)
                    this.travel = travelFrom * (1 - travelEase(t))
                    this.syncPosFromTravel()
                }

                if (elapsed < totalMs) {
                    this.expandRaf = requestAnimationFrame(tick)
                    return
                }
                this.expandRaf = null
                this.travel = 0
                this.expand = 0
                this.expandLinear = 0
                this.expandOpening = false
                this.popping = false
                this.syncPosFromTravel()
                this.unbindOutsideClose()
            }
            this.expandRaf = requestAnimationFrame(tick)
        },
        bindOutsideClose() {
            if (this.outsideCloseBound) return
            this.outsideCloseBound = true
            // Next tick so the opening tap does not immediately dismiss.
            this.$nextTick(() => {
                if (!this.outsideCloseBound) return
                document.addEventListener('pointerdown', this.onOutsidePointerDown, true)
            })
        },
        unbindOutsideClose() {
            if (!this.outsideCloseBound) return
            this.outsideCloseBound = false
            document.removeEventListener('pointerdown', this.onOutsidePointerDown, true)
        },
        onOutsidePointerDown(event) {
            if (performance.now() < this.outsideCloseUntil) return
            if (!this.isOpen) return
            const t = event.target
            if (!(t instanceof Element)) {
                this.closeMenu()
                return
            }
            if (t.closest('.cs-corner-disk-menu') || t.closest('.cs-corner-disk-hit')) {
                return
            }
            this.closeMenu()
        },
        onHitPointerDown(event) {
            if (event.pointerType === 'mouse' && event.button !== 0) return
            event.preventDefault()
            event.stopPropagation()
            this.pointerId = event.pointerId
            this.pointerStart = { x: event.clientX, y: event.clientY }
            try {
                event.currentTarget?.setPointerCapture?.(event.pointerId)
            } catch {
                /* ignore */
            }
        },
        onHitPointerUp(event) {
            if (this.pointerId != null && event.pointerId !== this.pointerId) return
            const dx = event.clientX - this.pointerStart.x
            const dy = event.clientY - this.pointerStart.y
            this.pointerId = null
            if (Math.hypot(dx, dy) > 10) return
            this.toggleMenu()
        },
        onHitPointerCancel() {
            this.pointerId = null
        },
        onMenuItemClick() {
            // Snap shut before router navigation so the pill never travels half-open.
            this.closeMenu({ instant: true })
        },
    },
}
</script>

<style>
.cs-corner-disk {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    box-sizing: border-box;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    will-change: transform;
    transition:
        opacity 0.32s ease,
        visibility 0.32s ease;
}

.cs-corner-disk--visible {
    visibility: visible;
    opacity: 1;
}

.cs-corner-disk--frost {
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.9),
        inset 0 -1px 1px rgba(0, 10, 170, 0.06),
        0 0 5px rgba(0, 10, 170, 0.16),
        0 0 10px rgba(0, 10, 170, 0.095),
        0 0 16px rgba(0, 10, 170, 0.05),
        0 0 22px rgba(0, 10, 170, 0.028);
    z-index: 10002;
    isolation: isolate;
    transition: none;
}

.cs-corner-disk--frost::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(255, 255, 255, 0.32);
    -webkit-backdrop-filter: blur(3.5px) saturate(1.4);
    backdrop-filter: blur(3.5px) saturate(1.4);
    pointer-events: none;
}

.cs-corner-disk--frost.cs-corner-disk--menu {
    transition: none !important;
}

.cs-corner-disk--frost.cs-corner-disk--menu::before {
    background: rgba(255, 255, 255, 0.34);
    -webkit-backdrop-filter: blur(5px) saturate(1.45);
    backdrop-filter: blur(5px) saturate(1.45);
}

.cs-corner-disk--pill {
    border-radius: 9999px;
}

.cs-corner-disk--dot {
    border-radius: 50%;
    background: #000aaa;
    z-index: 10003;
}

.cs-corner-disk-hit {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10003;
    border-radius: 50%;
    touch-action: none;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    background: transparent;
}

.cs-corner-disk-menu {
    --brand: #000aaa;
    --brand-active: #000444;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10004;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
}

.cs-corner-disk-menu__item {
    position: absolute;
    display: block;
    width: max-content;
    min-height: 44px;
    margin: 0;
    padding: 7px 0;
    box-sizing: border-box;
    font-family: 'Work Sans', sans-serif;
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: var(--brand);
    text-decoration: none;
    white-space: nowrap;
    pointer-events: auto;
    opacity: 0;
    will-change: transform, opacity;
    transition: none;
}

.cs-corner-disk-menu__item:active {
    color: var(--brand-active);
}

@media (prefers-reduced-motion: reduce) {
    .cs-corner-disk {
        transition: none;
    }
}
</style>
