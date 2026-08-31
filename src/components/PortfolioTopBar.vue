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
            }"
        >
            <div class="top-bar-inner">
                <div ref="topBarContent" class="top-bar-content">
                    <router-link to="/" class="logo-block">
                        <img class="logo" :src="logo" alt="Tim Justina Yeung" />
                    </router-link>
                    <nav ref="nav" class="nav" :class="{ 'nav--hidden': !showNav }">
                        <router-link
                            :to="{ path: '/', hash: '#work-first' }"
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
        '$route'() {
            this.syncMobileTopBarState()
        },
    },
    created() {
        this.syncMobileTopBarState()
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

                if (y <= 0) {
                    this.topBarHidden = false
                    this.topBarRecalled = false
                } else if (delta > 5 && y > this.getTopBarHeight()) {
                    this.topBarHidden = true
                } else if (delta < -5) {
                    this.topBarHidden = false
                    this.topBarRecalled = true
                }

                this.updateHeroOverlap()
                this.syncWorkLineTextClip()
                this.startWorkLineClipPoll()
                this.lastScrollY = y
                this.scrollTicking = false
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
}

.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    height: var(--top-bar-height);
    background: rgba(255, 255, 255, 0.20);
    backdrop-filter: blur(28px) saturate(2);
    -webkit-backdrop-filter: blur(28px) saturate(2);
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-bottom: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
    transition:
        transform 0.3s ease,
        background-color 0.25s ease,
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        backdrop-filter 0.25s ease,
        -webkit-backdrop-filter 0.25s ease;
}

.top-bar--transparent {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-bottom: none;
    box-shadow: none;
}

.top-bar--glass {
    background: rgba(255, 255, 255, 0.20);
    backdrop-filter: blur(28px) saturate(2);
    -webkit-backdrop-filter: blur(28px) saturate(2);
    border-bottom: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.top-bar--hidden {
    transform: translate3d(0, -100%, 0);
}

.top-bar--in-flow {
    position: static;
    height: auto;
    transform: none;
    box-shadow: none;
    transition: none;
}

.top-bar-inner {
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

@media (max-width: 799px) {
    .nav-link--work,
    .nav-link--about {
        display: none;
    }

    .portfolio-top-bar {
        --top-bar-height: 86px;
        --top-bar-edge-pad-left: 20px;
        --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
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
/* Magnifier frost overlay — same spec as .top-bar, outside the scaled clone layer. */
.hero-intro-cursor-magnifier__top-bar-frost {
    background: rgba(255, 255, 255, 0.20);
    backdrop-filter: blur(28px) saturate(2);
    -webkit-backdrop-filter: blur(28px) saturate(2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
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
    background: rgba(255, 255, 255, 0.20);
    backdrop-filter: blur(28px) saturate(2);
    -webkit-backdrop-filter: blur(28px) saturate(2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
</style>
