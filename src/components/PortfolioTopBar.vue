<template>
    <div class="portfolio-top-bar">
        <header
            class="top-bar"
            :class="{
                'top-bar--hidden': topBarHidden && !isInFlowMobileHome,
                'top-bar--transparent': isTransparent,
                'top-bar--in-flow': isInFlowMobileHome,
            }"
        >
            <div class="top-bar-inner">
                <div ref="topBarContent" class="top-bar-content">
                    <router-link to="/" class="logo-block">
                        <img class="logo" :src="logo" alt="Tim Justina Yeung" />
                    </router-link>
                    <nav ref="nav" class="nav" :class="{ 'nav--compact': navCompact }">
                        <router-link
                            :to="{ path: '/', hash: '#work-first' }"
                            class="nav-link nav-link--stacked nav-link--work"
                            @click="onWorkClick"
                        >
                            <span>Work</span>
                            <img class="nav-indicator" :src="menuHover" alt="" aria-hidden="true" />
                        </router-link>
                        <router-link
                            :to="{ path: '/', hash: '#about' }"
                            class="nav-link nav-link--stacked nav-link--about"
                            @click="onAboutClick"
                        >
                            <span>About</span>
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
    },
    data() {
        return {
            logo,
            menuHover,
            navCompact: false,
            fullNavWidth: null,
            navGapObserver: null,
            topBarHidden: false,
            lastScrollY: 0,
            scrollTicking: false,
            overHero: true,
            isMobileViewport: false,
        }
    },
    computed: {
        isTransparent() {
            return this.transparent && this.overHero
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
            this.updateNavCompact()
            this.updateHeroOverlap()
            if (this.$refs.topBarContent) {
                this.navGapObserver = new ResizeObserver(() => this.updateNavCompact())
                this.navGapObserver.observe(this.$refs.topBarContent)
            }
            document.fonts?.ready?.then(() => this.updateNavCompact())
        })
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll)
        window.removeEventListener('resize', this.onResize)
        window.removeEventListener(SECTION_JUMP_EVENT, this.onSectionJump)
        this.navGapObserver?.disconnect()
    },
    methods: {
        syncMobileTopBarState() {
            this.isMobileViewport = window.matchMedia('(max-width: 799px)').matches
            if (this.isInFlowMobileHome) {
                this.topBarHidden = false
            }
        },
        onResize() {
            this.syncMobileTopBarState()
            this.updateNavCompact()
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

            const hero = document.querySelector('.project-hero')
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
        updateNavCompact() {
            if (window.matchMedia('(max-width: 799px)').matches) {
                this.navCompact = false
                return
            }

            const content = this.$refs.topBarContent
            const logoBlock = content?.querySelector('.logo-block')
            const nav = this.$refs.nav
            if (!content || !logoBlock || !nav) return

            if (!this.navCompact) {
                this.fullNavWidth = nav.offsetWidth
            }

            const fullWidth = this.fullNavWidth ?? nav.offsetWidth
            const contentRect = content.getBoundingClientRect()
            const logoRect = logoBlock.getBoundingClientRect()
            const gapIfFull =
                contentRect.width - fullWidth - (logoRect.right - contentRect.left)

            // Tighter threshold for the two-link nav; compact keeps Work/About visible
            // and only tightens spacing, like LinkedIn/CV did before.
            this.navCompact = gapIfFull < 120
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
    --top-bar-nav-height: 27px;
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
    background: #fff;
    transform: translateY(0);
    transition:
        transform 0.3s ease,
        background-color 0.25s ease;
}

.top-bar--transparent {
    background: transparent;
}

.top-bar--hidden {
    transform: translateY(-100%);
}

.top-bar--in-flow {
    position: static;
    transform: none;
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
    height: 27px;
    transition: gap 0.22s ease;
}

.nav--compact {
    gap: 24px;
}

.nav-link {
    font-family: 'Work Sans', sans-serif;
    font-size: 18px;
    font-weight: 500;
    line-height: 27px;
    color: var(--brand);
    text-decoration: none;
}

.nav-link:active {
    color: var(--brand-active);
}

.nav-link--stacked {
    position: relative;
    display: block;
    height: 27px;
    padding: 0;
    overflow: hidden;
    transform-origin: bottom center;
    transition: height 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-link--stacked:hover,
.nav-link--stacked:focus-visible {
    height: 35px;
    overflow: visible;
}

.nav-link--stacked > span:first-child {
    display: block;
    height: 27px;
    line-height: 27px;
}

.nav-indicator {
    position: absolute;
    top: 25px;
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
        margin-top: 20px;
    }

    .logo {
        width: 111px;
        height: 56px;
    }

    .nav-link {
        font-size: 18px;
        line-height: 27px;
    }

    .nav-link--stacked > span:first-child {
        height: 27px;
        line-height: 27px;
    }
}
</style>
