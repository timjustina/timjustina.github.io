<template>
    <div class="portfolio-top-bar">
        <header
            class="top-bar"
            :class="{
                'top-bar--hidden': topBarHidden && !isInFlowMobileHome,
                'top-bar--transparent': isTransparent,
                'top-bar--glass': topBarRecalled && !isInFlowMobileHome,
                'top-bar--in-flow': isInFlowMobileHome,
                'top-bar--nav-hero-align': navHeroAlign,
                'top-bar--snap': topBarSnap,
            }"
        >
            <div class="top-bar-inner">
                <div ref="topBarContent" class="top-bar-content">
                    <router-link to="/" class="logo-block" @click="onLogoClick">
                        <img class="logo" :src="logo" alt="Tim Justina Yeung" />
                    </router-link>
                    <nav ref="nav" class="nav" :class="{ 'nav--hidden': !showNav }">
                        <router-link
                            :to="{ path: '/', hash: '#work' }"
                            class="nav-link nav-link--work"
                            @click="onWorkClick"
                        >
                            <span class="nav-link-text"><span ref="workW" class="nav-link-w">W</span>ork</span>
                        </router-link>
                        <router-link
                            :to="{ path: '/', hash: '#about' }"
                            class="nav-link nav-link--about"
                            @click="onAboutClick"
                        >
                            <span class="nav-link-text">About</span>
                        </router-link>
                    </nav>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
import logo from '../assets/TjyCutoutLogo.svg'
import { MOBILE_MEDIA_QUERY } from '../utils/breakpoints.js'
import { scrollToAbout, scrollToWork } from '../utils/scrollToAbout.js'

function parseCssPx(styles, prop, fallback) {
    const value = parseFloat(styles.getPropertyValue(prop))
    return Number.isFinite(value) ? value : fallback
}

function rectsOverlap(a, b) {
    return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
}

function getDecorLineStrokeSegments(page, pageStyles) {
    const pageRect = page.getBoundingClientRect()
    const lineX = parseCssPx(pageStyles, '--portfolio-decor-line-x', 0)
    const lineWidth = parseCssPx(pageStyles, '--hero-decor-line-width', 2)
    const strokeX = parseCssPx(pageStyles, '--hero-decor-line-stroke-x', 34)
    const segments = []

    const decor = document.querySelector('.hero-decor')
    const lineEl = document.querySelector('.hero-decor-line')
    if (
        decor &&
        lineEl &&
        !decor.classList.contains('hero-decor--hidden') &&
        window.getComputedStyle(lineEl).display !== 'none'
    ) {
        const decorRect = decor.getBoundingClientRect()
        const lineRect = lineEl.getBoundingClientRect()
        if (decorRect.height > 0) {
            segments.push({
                left: pageRect.left + lineX,
                right: pageRect.left + lineX + lineWidth,
                top: Math.max(decorRect.top, lineRect.top),
                bottom: Math.min(decorRect.bottom, lineRect.bottom),
            })
        }
    }

    const bridge = document.querySelector('.about-line-bridge')
    if (bridge && window.getComputedStyle(bridge).display !== 'none') {
        const bridgeRect = bridge.getBoundingClientRect()
        if (bridgeRect.height > 0) {
            segments.push({
                left: bridgeRect.left + strokeX,
                right: bridgeRect.left + strokeX + lineWidth,
                top: bridgeRect.top,
                bottom: bridgeRect.bottom,
            })
        }
    }

    const aboutLine = document.querySelector('.about-line')
    if (aboutLine && window.getComputedStyle(aboutLine).display !== 'none') {
        const aboutRect = aboutLine.getBoundingClientRect()
        if (aboutRect.height > 0) {
            segments.push({
                left: aboutRect.left + strokeX,
                right: aboutRect.left + strokeX + lineWidth,
                top: aboutRect.top,
                bottom: aboutRect.bottom,
            })
        }
    }

    return segments.filter((segment) => segment.bottom > segment.top && segment.right > segment.left)
}

const SECTION_HASHES = new Set(['#about', '#work-first', '#work'])
const SECTION_JUMP_EVENT = 'portfolio-section-jump'
const DECOR_LINE_SYNCED_EVENT = 'portfolio-decor-line-synced'

export default {
    name: 'PortfolioTopBar',
    props: {
        transparent: {
            type: Boolean,
            default: false,
        },
        alwaysTransparent: {
            type: Boolean,
            default: false,
        },
        navHeroAlign: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            logo,
            navAlignObserver: null,
            decorLineSynced: false,
            navWorkWReady: false,
            topBarHidden: false,
            topBarRecalled: false,
            topBarSnap: false,
            lastScrollY: 0,
            scrollTicking: false,
            overHero: true,
            isMobileViewport: false,
            workLineClipRaf: null,
        }
    },
    computed: {
        isTransparent() {
            if (!this.transparent || this.topBarRecalled) return false
            return this.alwaysTransparent || this.overHero
        },
        isInFlowMobileHome() {
            return this.$route.path === '/' && this.isMobileViewport
        },
        showNav() {
            if (!this.navHeroAlign || window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
                return true
            }
            if (!this.decorLineSynced) return false
            return this.navWorkWReady
        },
    },
    watch: {
        '$route'(to, from) {
            this.syncMobileTopBarState()
            this.syncDecorLineSyncState(to, from)
        },
    },
    created() {
        this.syncMobileTopBarState()
        this.syncDecorLineSyncState(this.$route)
        // Arrive on Work/About (e.g. from a case study) with the bar already tucked away.
        if (SECTION_HASHES.has(this.$route.hash) && !this.isInFlowMobileHome) {
            this.topBarHidden = true
        }
    },
    mounted() {
        this.lastScrollY = window.scrollY
        window.addEventListener('scroll', this.onScroll, { passive: true })
        window.addEventListener('resize', this.onResize, { passive: true })
        window.addEventListener(SECTION_JUMP_EVENT, this.onSectionJump)
        window.addEventListener(DECOR_LINE_SYNCED_EVENT, this.onDecorLineSynced)
        this.updateHeroOverlap()

        this.$nextTick(() => {
            this.updateNavDecorAlign()
            this.updateHeroOverlap()
            if (this.$refs.topBarContent) {
                this.navAlignObserver = new ResizeObserver(() => {
                    this.updateNavDecorAlign()
                    this.syncWorkLineTextClip()
                })
                this.navAlignObserver.observe(this.$refs.topBarContent)
            }
            document.fonts?.ready?.then(() => {
                this.updateNavDecorAlign()
                this.syncWorkLineTextClip()
                this.startWorkLineClipPoll()
            })
            this.syncWorkLineTextClip()
            this.startWorkLineClipPoll()
        })
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll)
        window.removeEventListener('resize', this.onResize)
        window.removeEventListener(SECTION_JUMP_EVENT, this.onSectionJump)
        window.removeEventListener(DECOR_LINE_SYNCED_EVENT, this.onDecorLineSynced)
        this.navAlignObserver?.disconnect()
        this.stopWorkLineClipPoll()
    },
    methods: {
        syncMobileTopBarState() {
            this.isMobileViewport = window.matchMedia(MOBILE_MEDIA_QUERY).matches
            if (this.isInFlowMobileHome) {
                this.topBarHidden = false
                this.topBarRecalled = false
            }
        },
        syncDecorLineSyncState(to = this.$route, from = null) {
            if (!this.navHeroAlign) return

            // Case studies don't align to the home decor line — show nav immediately.
            if (to.path !== '/') {
                this.decorLineSynced = true
                return
            }

            // Only re-gate the nav when arriving on home from another route.
            // Hash-only changes (/ → /#work) must not hide Work/About.
            if (from && from.path !== '/') {
                this.decorLineSynced = false
            }
        },
        onResize() {
            this.syncMobileTopBarState()
            this.updateNavDecorAlign()
            this.updateHeroOverlap()
            this.syncWorkLineTextClip()
            this.startWorkLineClipPoll()
        },
        onSectionJump() {
            if (this.isInFlowMobileHome) return
            this.topBarHidden = true
            this.lastScrollY = window.scrollY
            this.updateHeroOverlap()
        },
        onScroll() {
            if (this.scrollTicking) return
            this.scrollTicking = true

            requestAnimationFrame(() => {
                if (this.isInFlowMobileHome) {
                    this.topBarHidden = false
                    this.updateHeroOverlap()
                    this.syncWorkLineTextClip()
                    this.startWorkLineClipPoll()
                    this.lastScrollY = window.scrollY
                    this.scrollTicking = false
                    return
                }

                const y = window.scrollY
                const delta = y - this.lastScrollY
                this.updateHeroOverlap()

                // Home hero top: bar is already present — snap with no slide.
                const atHomeHeroTop =
                    this.$route.path === '/' && this.overHero && y <= 1
                if (atHomeHeroTop || y <= 0) {
                    this.snapShowTopBarAtTop()
                } else if (delta > 5 && y > this.getTopBarHeight()) {
                    this.topBarHidden = true
                } else if (delta < -5) {
                    // Home hero: no scroll-up recall — bar stays tucked away.
                    if (!(this.$route.path === '/' && this.overHero)) {
                        this.topBarHidden = false
                        this.topBarRecalled = true
                    }
                }

                // Home hero: if a recalled bar scrolls back into the hero, tuck it away.
                if (
                    this.$route.path === '/' &&
                    this.overHero &&
                    this.topBarRecalled &&
                    !atHomeHeroTop
                ) {
                    this.topBarHidden = true
                    this.topBarRecalled = false
                }
                this.syncWorkLineTextClip()
                this.startWorkLineClipPoll()
                this.lastScrollY = y
                this.scrollTicking = false
            })
        },
        snapShowTopBarAtTop() {
            if (!this.topBarHidden && !this.topBarRecalled) return

            const el = this.$el?.querySelector('.top-bar')
            if (el) {
                el.style.transition = 'none'
                // Force style flush so transform won't animate when unhiding.
                void el.offsetHeight
            }

            this.topBarSnap = true
            this.topBarHidden = false
            this.topBarRecalled = false

            this.$nextTick(() => {
                const bar = this.$el?.querySelector('.top-bar')
                if (bar) {
                    void bar.offsetHeight
                    bar.style.transition = ''
                }
                this.topBarSnap = false
            })
        },
        updateHeroOverlap() {
            if (!this.transparent) {
                this.overHero = false
                return
            }

            const hero =
                document.querySelector('.project-hero') ||
                document.querySelector('.portfolio-page .hero')
            if (!hero) {
                this.overHero = false
                return
            }

            // Transparent while any part of the hero still sits under the fixed bar.
            this.overHero = hero.getBoundingClientRect().bottom > 0
        },
        onLogoClick(event) {
            // Already on the home page — full reload so the intro plays again.
            // Use a clean `/` so a leftover Work/About hash doesn't jump back there.
            if (this.$route.path === '/') {
                event.preventDefault()
                if (this.$route.hash) {
                    window.location.assign(this.$router.resolve('/').href)
                } else {
                    window.location.reload()
                }
            }
        },
        onWorkClick(event) {
            // From a case study, let the router navigate; Portfolio scrolls after ready.
            if (this.$route.path !== '/') return

            if (this.$route.hash === '#work-first' || this.$route.hash === '#work') {
                event.preventDefault()
            }

            this.$nextTick(() => {
                requestAnimationFrame(() => scrollToWork())
            })
        },
        onAboutClick(event) {
            // From a case study, let the router navigate; Portfolio scrolls after ready.
            if (this.$route.path !== '/') return

            if (this.$route.hash === '#about') {
                event.preventDefault()
            }

            this.$nextTick(() => {
                requestAnimationFrame(() => scrollToAbout())
            })
        },
        onDecorLineSynced() {
            this.decorLineSynced = true
            this.updateNavDecorAlign()
            this.syncWorkLineTextClip()
            this.startWorkLineClipPoll()
        },
        updateNavDecorAlign() {
            if (
                !this.navHeroAlign ||
                window.matchMedia(MOBILE_MEDIA_QUERY).matches
            ) {
                this.$el?.style.removeProperty('--nav-work-w-center')
                return
            }

            const wEl = this.$refs.workW
            if (!wEl) {
                this.navWorkWReady = false
                return
            }

            const workW = wEl.getBoundingClientRect().width
            this.navWorkWReady = workW > 0
            this.$el.style.setProperty('--nav-work-w-center', `${workW / 2}px`)
            this.syncWorkLineTextClip()
        },
        clearWorkLineTextClip() {
            const workLink = this.$el?.querySelector('.nav-link--work')
            if (!workLink) return

            workLink.classList.remove('nav-link--line-overlap')
            workLink.style.removeProperty('--nav-work-line-clip-left')
            workLink.style.removeProperty('--nav-work-line-clip-right')
        },
        syncWorkLineTextClip() {
            const workLink = this.$el?.querySelector('.nav-link--work')
            const workText = workLink?.querySelector('.nav-link-text')
            if (!workLink || !workText) return

            if (
                !this.navHeroAlign ||
                window.matchMedia(MOBILE_MEDIA_QUERY).matches ||
                !this.isTransparent
            ) {
                this.clearWorkLineTextClip()
                return
            }

            const page = document.querySelector('.portfolio-page')
            if (!page) {
                this.clearWorkLineTextClip()
                return
            }

            const pageStyles = getComputedStyle(page)
            const textRect = workText.getBoundingClientRect()
            if (textRect.width <= 0 || textRect.height <= 0) {
                this.clearWorkLineTextClip()
                return
            }

            const segments = getDecorLineStrokeSegments(page, pageStyles)
            let clipLeft = Infinity
            let clipRight = -Infinity
            let hasOverlap = false

            for (const segment of segments) {
                if (!rectsOverlap(textRect, segment)) continue

                const left = Math.max(0, segment.left - textRect.left)
                const right = Math.min(textRect.width, segment.right - textRect.left)
                if (right <= left) continue

                hasOverlap = true
                clipLeft = Math.min(clipLeft, left)
                clipRight = Math.max(clipRight, right)
            }

            if (!hasOverlap || clipRight <= clipLeft) {
                this.clearWorkLineTextClip()
                return
            }

            workLink.classList.add('nav-link--line-overlap')
            workLink.style.setProperty('--nav-work-line-clip-left', `${clipLeft}px`)
            workLink.style.setProperty('--nav-work-line-clip-right', `${clipRight}px`)
        },
        shouldPollWorkLineClip() {
            return (
                this.navHeroAlign &&
                !window.matchMedia(MOBILE_MEDIA_QUERY).matches &&
                this.isTransparent &&
                this.$route.path === '/'
            )
        },
        startWorkLineClipPoll() {
            if (!this.shouldPollWorkLineClip()) {
                this.stopWorkLineClipPoll()
                return
            }
            if (this.workLineClipRaf != null) return

            const tick = () => {
                this.syncWorkLineTextClip()
                if (this.shouldPollWorkLineClip()) {
                    this.workLineClipRaf = requestAnimationFrame(tick)
                } else {
                    this.workLineClipRaf = null
                }
            }
            tick()
        },
        stopWorkLineClipPoll() {
            if (this.workLineClipRaf != null) {
                cancelAnimationFrame(this.workLineClipRaf)
                this.workLineClipRaf = null
            }
            this.clearWorkLineTextClip()
        },
        getTopBarHeight() {
            return this.$el?.querySelector('.top-bar-inner')?.offsetHeight ?? 120
        },
    },
}
</script>

<style scoped>
.portfolio-top-bar {
    --brand: #000aaa;
    --brand-active: #000444;
    --font-weight-scale: 0.95;
    --top-bar-height: 120px;
    --top-bar-logo-height: 52px;
    --top-bar-nav-height: 30px;
    /* Left matches logo→top; right matches nav text→top */
    --top-bar-edge-pad-left: calc((var(--top-bar-height) - var(--top-bar-logo-height)) / 2);
    --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
    /* Digital frost: tiny grid, each cell a slightly different opacity */
    --top-bar-frost-base: rgba(255, 255, 255, 0.12);
    --top-bar-frost-tile: auto 100%;
    --top-bar-frost-noise: url("data:image/png;base64,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");
}

.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    height: var(--top-bar-height);
    background: var(--top-bar-frost-base);
    backdrop-filter: blur(28px) saturate(2);
    -webkit-backdrop-filter: blur(28px) saturate(2);
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-bottom: none;
    box-shadow: none;
    /* Do not transition backdrop-filter — compositor rebuilds (e.g. magnifier
       glass) briefly drop blur; animating it back reads as a sharp flash. */
    transition:
        transform 0.3s ease,
        background-color 0.25s ease,
        border-color 0.25s ease,
        box-shadow 0.25s ease;
}

/* Pixel frost overlay — fill only (not a mask), so backdrop blur stays alive */
.top-bar::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: var(--top-bar-frost-noise);
    background-size: var(--top-bar-frost-tile);
    background-repeat: no-repeat;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}

.top-bar--transparent {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-bottom: none;
    box-shadow: none;
}

.top-bar--transparent::before {
    content: none;
}

.top-bar--glass {
    background: var(--top-bar-frost-base);
    backdrop-filter: blur(28px) saturate(2);
    -webkit-backdrop-filter: blur(28px) saturate(2);
    border-bottom: none;
    box-shadow: none;
}

.top-bar--glass::before {
    content: '';
}

.top-bar--hidden {
    transform: translate3d(0, -100%, 0);
}

.top-bar--snap {
    transition: none;
}

.top-bar--in-flow {
    position: static;
    height: auto;
    transform: none;
    box-shadow: none;
    transition: none;
}

.top-bar-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: var(--top-bar-height);
    padding: 0 var(--top-bar-edge-pad-right) 0 var(--top-bar-edge-pad-left);
    box-sizing: border-box;
}

.top-bar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    width: 100%;
}

.logo-block {
    display: flex;
    align-items: center;
    padding: 20px;
    margin: -20px;
    text-decoration: none;
    color: inherit;
}

.logo {
    width: 104px;
    height: 52px;
    flex-shrink: 0;
}

.nav {
    display: flex;
    align-items: center;
    gap: 40px;
    height: 30px;
}

@media (min-width: 800px) {
    .top-bar--nav-hero-align .nav {
        position: absolute;
        left: calc(var(--portfolio-decor-line-x) - var(--nav-work-w-center, 0px));
        top: calc(var(--top-bar-edge-pad-right) + 19px);
        height: var(--top-bar-nav-height);
        opacity: 1;
        transition:
            opacity 0.3s ease,
            visibility 0.3s ease;
    }

    .nav--hidden {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
    }
}

.nav-link {
    font-family: 'Work Sans', sans-serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    padding: 10px;
    margin: -10px;
    color: var(--brand);
    text-decoration: none;
}

.nav-link:active {
    color: var(--brand-active);
}

@media (min-width: 800px) {
    .top-bar--nav-hero-align .nav-link--work.nav-link--line-overlap .nav-link-text {
        background-image: linear-gradient(
            to right,
            var(--brand) 0,
            var(--brand) var(--nav-work-line-clip-left, 0px),
            #fff var(--nav-work-line-clip-left, 0px),
            #fff var(--nav-work-line-clip-right, 0px),
            var(--brand) var(--nav-work-line-clip-right, 0px),
            var(--brand) 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    }

    .top-bar--nav-hero-align .nav-link--work.nav-link--line-overlap:active .nav-link-text {
        background-image: linear-gradient(
            to right,
            var(--brand-active) 0,
            var(--brand-active) var(--nav-work-line-clip-left, 0px),
            #fff var(--nav-work-line-clip-left, 0px),
            #fff var(--nav-work-line-clip-right, 0px),
            var(--brand-active) var(--nav-work-line-clip-right, 0px),
            var(--brand-active) 100%
        );
    }
}

@media (width < 800px) {
    .nav-link--work,
    .nav-link--about {
        display: none;
    }

    .portfolio-top-bar {
        --top-bar-height: 86px;
        --top-bar-edge-pad-left: 20px;
        --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
    }

    /* Mobile: always clear — no frosted glass */
    .top-bar,
    .top-bar--glass,
    .top-bar--transparent {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border-bottom: none;
        box-shadow: none;
    }

    .top-bar::before,
    .top-bar--glass::before {
        content: none;
    }

    .top-bar-inner {
        align-items: stretch;
        padding: 0 var(--top-bar-edge-pad-right) 0 var(--top-bar-edge-pad-left);
    }

    .top-bar-content {
        align-items: center;
        gap: 0;
    }

    .logo-block {
        align-self: flex-start;
        margin: 0 -20px -20px -20px;
    }

    .logo {
        width: 111px;
        height: 56px;
    }

    .nav-link {
        font-size: 20px;
        line-height: 30px;
    }

}
</style>

<style>
/* Magnifier frost overlay — outside the scaled clone layer.
   Blur comes from a clipped filter:blur() copy of the magnifier page (not
   backdrop-filter), so it matches the live bar without the sharp flash. */
.hero-intro-cursor-magnifier__top-bar-frost {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
    border-bottom: none;
    transition: none;
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.hero-intro-cursor-magnifier__top-bar-frost.top-bar--transparent {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
}

.hero-intro-cursor-magnifier__top-bar-frost.top-bar--glass {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
}

.hero-intro-cursor-magnifier__top-bar-frost-tint {
    background-color: rgba(255, 255, 255, 0.12);
    background-image: url("data:image/png;base64,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");
    background-size: auto 100%;
    background-repeat: no-repeat;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}

@media (width < 800px) {
    .hero-intro-cursor-magnifier__top-bar-frost,
    .hero-intro-cursor-magnifier__top-bar-frost.top-bar--glass,
    .hero-intro-cursor-magnifier__top-bar-frost.top-bar--transparent {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
    }

    .hero-intro-cursor-magnifier__top-bar-frost-tint {
        background: transparent;
    }
}
</style>
