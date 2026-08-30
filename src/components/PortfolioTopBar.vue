<template>
    <div class="portfolio-top-bar">
        <header
            class="top-bar"
            :class="{
                'top-bar--hidden': topBarHidden && !isInFlowMobileHome,
                'top-bar--transparent': isTransparent,
                'top-bar--in-flow': isInFlowMobileHome,
                'top-bar--nav-hero-align': navHeroAlign,
            }"
        >
            <div class="top-bar-inner">
                <div ref="topBarContent" class="top-bar-content">
                    <router-link to="/" class="logo-block">
                        <img class="logo" :src="logo" alt="Tim Justina Yeung" />
                    </router-link>
                    <nav ref="nav" class="nav">
                        <router-link
                            :to="{ path: '/', hash: '#work-first' }"
                            class="nav-link nav-link--stacked nav-link--work"
                            @click="onWorkClick"
                        >
                            <span class="nav-link-text"><span ref="workW" class="nav-link-w">W</span>ork</span>
                            <img class="nav-indicator" :src="menuHover" alt="" aria-hidden="true" />
                        </router-link>
                        <router-link
                            :to="{ path: '/', hash: '#about' }"
                            class="nav-link nav-link--stacked nav-link--about"
                            @click="onAboutClick"
                        >
                            <span class="nav-link-text">About</span>
                            <img class="nav-indicator" :src="menuHover" alt="" aria-hidden="true" />
                        </router-link>
                    </nav>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
import logo from '../assets/TjyCutoutLogo.svg'
import menuHover from '../assets/menu_hover.svg'
import { MOBILE_MEDIA_QUERY } from '../utils/breakpoints.js'
import { scrollToAbout, scrollToWork } from '../utils/scrollToAbout.js'

const SECTION_HASHES = new Set(['#about', '#work-first', '#work'])
const SECTION_JUMP_EVENT = 'portfolio-section-jump'

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
            menuHover,
            navAlignObserver: null,
            topBarHidden: false,
            lastScrollY: 0,
            scrollTicking: false,
            overHero: true,
            isMobileViewport: false,
        }
    },
    computed: {
        isTransparent() {
            return this.transparent && (this.alwaysTransparent || this.overHero)
        },
        isInFlowMobileHome() {
            return this.$route.path === '/' && this.isMobileViewport
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
        this.updateHeroOverlap()

        this.$nextTick(() => {
            this.updateNavDecorAlign()
            this.updateHeroOverlap()
            if (this.$refs.topBarContent) {
                this.navAlignObserver = new ResizeObserver(() => this.updateNavDecorAlign())
                this.navAlignObserver.observe(this.$refs.topBarContent)
            }
            document.fonts?.ready?.then(() => this.updateNavDecorAlign())
        })
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll)
        window.removeEventListener('resize', this.onResize)
        window.removeEventListener(SECTION_JUMP_EVENT, this.onSectionJump)
        this.navAlignObserver?.disconnect()
    },
    methods: {
        syncMobileTopBarState() {
            this.isMobileViewport = window.matchMedia(MOBILE_MEDIA_QUERY).matches
            if (this.isInFlowMobileHome) {
                this.topBarHidden = false
            }
        },
        onResize() {
            this.syncMobileTopBarState()
            this.updateNavDecorAlign()
            this.updateHeroOverlap()
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
                    this.lastScrollY = window.scrollY
                    this.scrollTicking = false
                    return
                }

                const y = window.scrollY
                const delta = y - this.lastScrollY

                if (y <= 0) {
                    this.topBarHidden = false
                } else if (delta > 5 && y > this.getTopBarHeight()) {
                    this.topBarHidden = true
                } else if (delta < -5) {
                    this.topBarHidden = false
                }

                this.updateHeroOverlap()
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
        updateNavDecorAlign() {
            if (
                !this.navHeroAlign ||
                window.matchMedia(MOBILE_MEDIA_QUERY).matches
            ) {
                this.$el?.style.removeProperty('--nav-work-w-center')
                return
            }

            const wEl = this.$refs.workW
            if (!wEl) return

            this.$el.style.setProperty(
                '--nav-work-w-center',
                `${wEl.getBoundingClientRect().width / 2}px`
            )
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
    background: #fff;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    /* Cover subpixel seam where content peeks through during slide */
    box-shadow: 0 1px 0 0 #fff;
    transition:
        transform 0.3s ease,
        background-color 0.25s ease,
        box-shadow 0.25s ease;
}

.top-bar--transparent {
    background: transparent;
    box-shadow: none;
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

@media (min-width: 1085px) {
    .top-bar--nav-hero-align .nav {
        position: absolute;
        left: calc(var(--portfolio-decor-line-x) - var(--nav-work-w-center, 0px));
        top: calc(var(--top-bar-edge-pad-right) + 19px);
        height: var(--top-bar-nav-height);
    }
}

.nav-link {
    font-family: 'Work Sans', sans-serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    color: var(--brand);
    text-decoration: none;
}

.nav-link:active {
    color: var(--brand-active);
}

.nav-link--stacked {
    position: relative;
    display: block;
    height: 30px;
    padding: 0;
    overflow: hidden;
    transform-origin: bottom center;
    transition: height 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-link--stacked:hover,
.nav-link--stacked:focus-visible {
    height: 38px;
    overflow: visible;
}

.nav-link--stacked > span:first-child,
.nav-link--stacked > .nav-link-text {
    display: block;
    height: 30px;
    line-height: 30px;
}

.nav-indicator {
    position: absolute;
    top: 28px;
    left: 50%;
    display: block;
    width: 16px;
    height: 8px;
    opacity: 0;
    transform: translateX(-50%) scaleY(0);
    transform-origin: top center;
    transition:
        opacity 0.22s ease,
        transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-link--stacked:hover .nav-indicator,
.nav-link--stacked:focus-visible .nav-indicator {
    opacity: 1;
    transform: translateX(-50%) scaleY(1);
}

@media (max-width: 1084px) {
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
        margin-top: 20px;
    }

    .logo {
        width: 111px;
        height: 56px;
    }

    .nav-link {
        font-size: 20px;
        line-height: 30px;
    }

    .nav-link--stacked > span:first-child,
    .nav-link--stacked > .nav-link-text {
        height: 30px;
        line-height: 30px;
    }
}
</style>
