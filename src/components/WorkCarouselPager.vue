<template>
    <Teleport to="body">
        <button
            v-if="eligible"
            type="button"
            class="work-carousel-pager"
            :class="{ 'work-carousel-pager--visible': active && inWorkCarousel }"
            :aria-label="`Next project, ${activeIndex + 1} of ${count}`"
            @click="advance"
        >
            <div
                class="work-carousel-pager__frost"
                :style="frostMaskStyle"
                aria-hidden="true"
            />
            <span
                v-for="index in count"
                :key="index"
                class="work-carousel-pager__dot"
                :class="{ 'work-carousel-pager__dot--active': index - 1 === activeIndex }"
                aria-hidden="true"
            />
        </button>
    </Teleport>
</template>

<script>
import { SMALL_MOBILE_MEDIA_QUERY } from '../utils/breakpoints.js'
import { isAboutSectionActive } from '../utils/scrollToAbout.js'

/** Matches `HERO_TOUCH_DISK_EDGE_GAP_PX` in Portfolio.vue (mobile logo / disk inset). */
const TOUCH_DISK_EDGE_GAP_PX = 20
/** Idle frosted touch-disk diameter. */
const PAGER_HEIGHT_PX = 46
/** Idle blue center of the touch disk. */
const DOT_SIZE_PX = 8

export default {
    name: 'WorkCarouselPager',
    props: {
        /** Touch-disk mode and currently in the work zone. */
        active: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            eligible: false,
            inWorkCarousel: false,
            activeIndex: 0,
            count: 3,
            edgeGapPx: TOUCH_DISK_EDGE_GAP_PX,
        }
    },
    computed: {
        /**
         * SVG alpha mask: white = frost, transparent = hole (evenodd).
         * Inactive dots punch clear through to the page; active keeps frost under the fill.
         */
        frostMaskStyle() {
            // Mask matches the frost padding box (inside the 1px rim), not the
            // border-box — otherwise the pill caps stretch and can read as a gap.
            const border = 1
            const h = PAGER_HEIGHT_PX - 2 * border
            const gap = TOUCH_DISK_EDGE_GAP_PX
            const dot = DOT_SIZE_PX
            const n = Math.max(1, this.count)
            const w = 2 * gap + n * dot + Math.max(0, n - 1) * gap
            const cy = h / 2
            const r = dot / 2

            // Evenodd path: opaque pill with transparent punched holes.
            // Outer shape must be a pill in the mask itself — rectangular masks
            // leave hard L/R edges with backdrop-filter (border-radius alone isn't enough).
            const rx = h / 2
            let d =
                `M0,${rx}` +
                `A${rx},${rx} 0 0 1 ${rx},0` +
                `H${w - rx}` +
                `A${rx},${rx} 0 0 1 ${w},${rx}` +
                `V${h - rx}` +
                `A${rx},${rx} 0 0 1 ${w - rx},${h}` +
                `H${rx}` +
                `A${rx},${rx} 0 0 1 0,${h - rx}` +
                `Z`
            for (let i = 0; i < n; i++) {
                if (i === this.activeIndex) continue
                const cx = gap + dot / 2 + i * (dot + gap)
                d +=
                    `M${cx - r},${cy}` +
                    `a${r},${r} 0 1,0 ${r * 2},0` +
                    `a${r},${r} 0 1,0 ${-r * 2},0`
            }

            const svg =
                `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
                `<path fill="white" fill-rule="evenodd" d="${d}"/>` +
                `</svg>`

            const image = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
            return {
                WebkitMaskImage: image,
                maskImage: image,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
            }
        },
    },
    watch: {
        active(next) {
            if (next) {
                this.$nextTick(() => {
                    this.bindWorkScroll()
                    this.updateFromScroll()
                })
            } else {
                this.clearWrapAnimation()
                this.unbindWorkScroll()
                this.inWorkCarousel = false
            }
        },
    },
    mounted() {
        this.smallMobileMq = window.matchMedia(SMALL_MOBILE_MEDIA_QUERY)
        this.onSmallMobileChange = () => this.syncEligible()
        this.smallMobileMq.addEventListener('change', this.onSmallMobileChange)
        this.syncEligible()
        if (this.active) {
            this.$nextTick(() => {
                this.bindWorkScroll()
                this.updateFromScroll()
            })
        }
    },
    beforeUnmount() {
        this.smallMobileMq?.removeEventListener('change', this.onSmallMobileChange)
        this.clearWrapAnimation()
        this.unbindWorkScroll()
    },
    methods: {
        syncEligible() {
            const next = this.smallMobileMq?.matches ?? false
            this.eligible = next
            if (next && this.active) {
                this.bindWorkScroll()
                this.updateFromScroll()
            } else {
                this.clearWrapAnimation()
                this.unbindWorkScroll()
                this.inWorkCarousel = false
            }
        },
        getWorkEl() {
            return document.getElementById('work')
        },
        getRealSlots(work) {
            return [...work.querySelectorAll(':scope > .work-slot:not(.work-slot--wrap-clone)')]
        },
        bindWorkScroll() {
            if (!this.eligible) return
            const work = this.getWorkEl()
            if (!work) return

            if (this.workEl !== work) {
                if (this.workEl && this.onWorkScroll) {
                    this.workEl.removeEventListener('scroll', this.onWorkScroll)
                }
                this.workEl = work
                this.onWorkScroll = () => this.queueUpdateFromScroll()
                work.addEventListener('scroll', this.onWorkScroll, { passive: true })
                this.count = Math.max(1, this.getRealSlots(work).length)
            }

            if (!this.onWindowScroll) {
                this.onWindowScroll = () => this.queueUpdateFromScroll()
                window.addEventListener('scroll', this.onWindowScroll, {
                    passive: true,
                    capture: true,
                })
                window.addEventListener('resize', this.onWindowScroll, { passive: true })
            }
            this.updateFromScroll()
        },
        unbindWorkScroll() {
            if (this.workEl && this.onWorkScroll) {
                this.workEl.removeEventListener('scroll', this.onWorkScroll)
            }
            this.workEl = null
            this.onWorkScroll = null
            if (this.onWindowScroll) {
                window.removeEventListener('scroll', this.onWindowScroll, { capture: true })
                window.removeEventListener('resize', this.onWindowScroll)
                this.onWindowScroll = null
            }
        },
        queueUpdateFromScroll() {
            if (this.scrollTicking) return
            this.scrollTicking = true
            requestAnimationFrame(() => {
                this.updateFromScroll()
                this.scrollTicking = false
            })
        },
        updateFromScroll() {
            const work = this.workEl || this.getWorkEl()
            if (!work) {
                this.inWorkCarousel = false
                return
            }
            const slots = this.getRealSlots(work)
            if (!slots.length) {
                this.inWorkCarousel = false
                return
            }
            this.count = slots.length
            // While looping past the last slot onto a clone, keep the last dot lit.
            if (!this.wrapAnimating) {
                const workRect = work.getBoundingClientRect()
                // Snap origin: left padding edge of the strip.
                const origin = workRect.left + (parseFloat(getComputedStyle(work).paddingLeft) || 0)
                let best = 0
                let bestDist = Infinity
                for (let i = 0; i < slots.length; i++) {
                    const dist = Math.abs(slots[i].getBoundingClientRect().left - origin)
                    if (dist < bestDist) {
                        bestDist = dist
                        best = i
                    }
                }
                this.activeIndex = best
            }

            // Pill only while the work strip is still on-screen — not through the
            // white gap before about (zone can stay "work" until 20px above beige).
            const workRect = work.getBoundingClientRect()
            const vh = window.innerHeight || 0
            const workStillInView =
                workRect.bottom > PAGER_HEIGHT_PX + TOUCH_DISK_EDGE_GAP_PX &&
                workRect.top < vh
            const y = window.scrollY || document.documentElement.scrollTop || 0
            this.inWorkCarousel = workStillInView && !isAboutSectionActive(y)
        },
        slotScrollLeft(work, slot) {
            const workRect = work.getBoundingClientRect()
            const pad = parseFloat(getComputedStyle(work).paddingLeft) || 0
            const slotLeft = slot.getBoundingClientRect().left - workRect.left + work.scrollLeft
            return Math.max(0, slotLeft - pad)
        },
        goTo(index) {
            const work = this.workEl || this.getWorkEl()
            if (!work) return
            const slot = this.getRealSlots(work)[index]
            if (!slot) return
            work.scrollTo({
                left: this.slotScrollLeft(work, slot),
                behavior: 'smooth',
            })
        },
        advance() {
            if (this.wrapAnimating) return
            const work = this.workEl || this.getWorkEl()
            if (!work) return
            const slots = this.getRealSlots(work)
            if (slots.length < 2) return

            const next = this.activeIndex + 1
            if (next < slots.length) {
                this.goTo(next)
                return
            }
            this.wrapAroundToFirst(work, slots)
        },
        wrapAroundToFirst(work, slots) {
            this.clearWrapAnimation()
            const first = slots[0]
            if (!first) return

            const clone = first.cloneNode(true)
            clone.classList.add('work-slot--wrap-clone')
            clone.setAttribute('aria-hidden', 'true')
            clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
            clone.querySelectorAll('a').forEach((el) => {
                el.removeAttribute('href')
                el.setAttribute('tabindex', '-1')
            })
            work.appendChild(clone)
            this.wrapClone = clone
            this.wrapAnimating = true
            this.activeIndex = slots.length - 1

            const finish = () => {
                if (!this.wrapAnimating) return
                this.wrapAnimating = false
                if (this.wrapScrollEndHandler) {
                    work.removeEventListener('scrollend', this.wrapScrollEndHandler)
                    this.wrapScrollEndHandler = null
                }
                if (this.wrapFallbackTimer != null) {
                    clearTimeout(this.wrapFallbackTimer)
                    this.wrapFallbackTimer = null
                }
                if (this.wrapSafetyTimer != null) {
                    clearTimeout(this.wrapSafetyTimer)
                    this.wrapSafetyTimer = null
                }
                // Instantly reseat on the real first slide, then drop the clone.
                work.scrollTo({ left: this.slotScrollLeft(work, first), behavior: 'auto' })
                clone.remove()
                this.wrapClone = null
                this.activeIndex = 0
                this.updateFromScroll()
            }

            this.wrapScrollEndHandler = finish
            work.addEventListener('scrollend', finish, { once: true })

            const targetLeft = this.slotScrollLeft(work, clone)
            const pollDone = () => {
                if (!this.wrapAnimating) return
                if (Math.abs(work.scrollLeft - targetLeft) <= 2) {
                    finish()
                    return
                }
                this.wrapFallbackTimer = setTimeout(pollDone, 50)
            }
            // Safety net if scrollend never fires; poll until near target, then force.
            this.wrapFallbackTimer = setTimeout(pollDone, 120)
            this.wrapSafetyTimer = setTimeout(() => {
                if (this.wrapAnimating) finish()
            }, 1200)

            requestAnimationFrame(() => {
                work.scrollTo({
                    left: targetLeft,
                    behavior: 'smooth',
                })
            })
        },
        clearWrapAnimation() {
            if (this.wrapFallbackTimer != null) {
                clearTimeout(this.wrapFallbackTimer)
                this.wrapFallbackTimer = null
            }
            if (this.wrapSafetyTimer != null) {
                clearTimeout(this.wrapSafetyTimer)
                this.wrapSafetyTimer = null
            }
            const work = this.workEl || this.getWorkEl()
            if (work && this.wrapScrollEndHandler) {
                work.removeEventListener('scrollend', this.wrapScrollEndHandler)
            }
            this.wrapScrollEndHandler = null
            this.wrapClone?.remove()
            this.wrapClone = null
            this.wrapAnimating = false
            work?.querySelectorAll(':scope > .work-slot--wrap-clone').forEach((el) => el.remove())
        },
    },
}
</script>

<style scoped>
.work-carousel-pager {
    /* Height matches idle frosted touch-disk diameter (46px). */
    --pager-height: 46px;
    /* Dot matches idle blue center of the touch disk (8px). */
    --pager-dot: 8px;
    /* Same inset as the touch disk (`HERO_TOUCH_DISK_EDGE_GAP_PX`). */
    --pager-edge-gap: v-bind(edgeGapPx + 'px');
    /* Shared glass rim: outer pill + punched holes. */
    --pager-rim: 1px solid rgba(255, 255, 255, 0.85);
    --brand: #000aaa;
    /* Match work/about corner frost-disk outer glow. */
    --pager-glow:
        0 0 5px rgba(0, 10, 170, 0.16),
        0 0 10px rgba(0, 10, 170, 0.095),
        0 0 16px rgba(0, 10, 170, 0.05),
        0 0 22px rgba(0, 10, 170, 0.028);
    --pager-glow-inset:
        inset 0 0 5px rgba(0, 10, 170, 0.16),
        inset 0 0 10px rgba(0, 10, 170, 0.095),
        inset 0 0 16px rgba(0, 10, 170, 0.05),
        inset 0 0 22px rgba(0, 10, 170, 0.028);

    position: fixed;
    z-index: 10000;
    left: var(--pager-edge-gap);
    bottom: var(--pager-edge-gap);
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--pager-edge-gap);
    height: var(--pager-height);
    margin: 0;
    padding: 0 var(--pager-edge-gap);
    border-radius: 999px;
    border: var(--pager-rim);
    background: transparent;
    box-shadow: var(--pager-glow);
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(6px);
    transition:
        opacity 0.28s ease,
        visibility 0.28s ease,
        transform 0.28s ease;
}

.work-carousel-pager:focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 3px;
}

.work-carousel-pager__frost {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    /* Match work/about corner frost disk (`--section-frost`). */
    background: rgba(255, 255, 255, 0.32);
    -webkit-backdrop-filter: blur(3.5px) saturate(1.4);
    backdrop-filter: blur(3.5px) saturate(1.4);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.9),
        inset 0 -1px 1px rgba(0, 10, 170, 0.06);
    pointer-events: none;
    z-index: 0;
    /* Same stacking context trick as the touch-disk frost. */
    isolation: isolate;
}

.work-carousel-pager--visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
}

.work-carousel-pager__dot {
    position: relative;
    z-index: 1;
    flex: none;
    box-sizing: border-box;
    width: var(--pager-dot);
    height: var(--pager-dot);
    border-radius: 50%;
    /* Pill outer glow mirrored inside the punched hole. */
    box-shadow: var(--pager-glow-inset);
    background-color: transparent;
    pointer-events: none;
    transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease;
}

.work-carousel-pager__dot--active {
    background: var(--brand);
    box-shadow: none;
}
</style>
