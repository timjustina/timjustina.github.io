<template>
    <div class="portfolio-top-bar">
        <header class="top-bar" :class="{ 'top-bar--hidden': topBarHidden }">
            <div class="top-bar-inner">
                <div ref="topBarContent" class="top-bar-content">
                    <router-link to="/" class="logo-block">
                        <img class="logo" :src="logo" alt="" />
                        <span ref="logoName" class="logo-name">TIM JUSTINA YEUNG</span>
                    </router-link>
                    <button
                        type="button"
                        class="menu-toggle"
                        aria-label="Open menu"
                        :aria-expanded="menuOpen"
                        @click="menuOpen = !menuOpen"
                    >
                        <span /><span /><span />
                    </button>
                    <nav ref="nav" class="nav" :class="{ 'nav--compact': navCompact }">
                        <router-link
                            :to="{ path: '/', hash: '#work-first' }"
                            class="nav-link nav-link--stacked nav-link--work"
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
                        <a
                            href="https://www.linkedin.com/in/timjustinayeung"
                            class="nav-link nav-link--stacked"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Linkedin</span>
                            <img class="nav-indicator" :src="menuHover" alt="" aria-hidden="true" />
                        </a>
                        <a href="#" class="nav-link nav-link--stacked">
                            <span>CV</span>
                            <img class="nav-indicator" :src="menuHover" alt="" aria-hidden="true" />
                        </a>
                    </nav>
                </div>
            </div>
        </header>

        <nav
            class="mobile-nav"
            :class="{ 'mobile-nav--open': menuOpen }"
            aria-label="Mobile navigation"
        >
            <router-link
                :to="{ path: '/', hash: '#work-first' }"
                class="mobile-nav-link"
                @click="menuOpen = false"
            >Work</router-link>
            <router-link
                :to="{ path: '/', hash: '#about' }"
                class="mobile-nav-link"
                @click="onAboutClick"
            >About</router-link>
            <a
                href="https://www.linkedin.com/in/timjustinayeung"
                class="mobile-nav-link"
                target="_blank"
                rel="noopener noreferrer"
                @click="menuOpen = false"
            >Linkedin</a>
            <a href="#" class="mobile-nav-link" @click="menuOpen = false">CV</a>
        </nav>

        <div
            v-if="menuOpen"
            class="mobile-nav-backdrop"
            aria-hidden="true"
            @click="menuOpen = false"
        />
    </div>
</template>

<script>
import logo from '../assets/TjyCutoutLogo.svg'
import menuHover from '../assets/menu_hover.svg'
import { scrollToAbout } from '../utils/scrollToAbout.js'

export default {
    name: 'PortfolioTopBar',
    data() {
        return {
            logo,
            menuHover,
            menuOpen: false,
            navCompact: false,
            fullNavWidth: null,
            navGapObserver: null,
            topBarHidden: false,
            lastScrollY: 0,
            scrollTicking: false,
        }
    },
    mounted() {
        this.lastScrollY = window.scrollY
        window.addEventListener('scroll', this.onScroll, { passive: true })

        this.$nextTick(() => {
            this.updateNavCompact()
            if (this.$refs.topBarContent) {
                this.navGapObserver = new ResizeObserver(() => this.updateNavCompact())
                this.navGapObserver.observe(this.$refs.topBarContent)
            }
            document.fonts?.ready?.then(() => this.updateNavCompact())
        })
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll)
        this.navGapObserver?.disconnect()
    },
    methods: {
        onScroll() {
            if (this.scrollTicking) return
            this.scrollTicking = true

            requestAnimationFrame(() => {
                const y = window.scrollY
                const delta = y - this.lastScrollY

                if (y <= 0) {
                    this.topBarHidden = false
                } else if (delta > 5 && y > 120) {
                    this.topBarHidden = true
                    this.menuOpen = false
                } else if (delta < -5) {
                    this.topBarHidden = false
                }

                this.lastScrollY = y
                this.scrollTicking = false
            })
        },
        onAboutClick(event) {
            this.menuOpen = false

            if (this.$route.path !== '/') return

            if (this.$route.hash === '#about') {
                event.preventDefault()
            }

            this.$nextTick(() => {
                requestAnimationFrame(() => scrollToAbout())
            })
        },
        updateNavCompact() {
            const content = this.$refs.topBarContent
            const name = this.$refs.logoName
            const nav = this.$refs.nav
            if (!content || !name || !nav) return

            if (!this.navCompact) {
                this.fullNavWidth = nav.offsetWidth
            }

            const fullWidth = this.fullNavWidth ?? nav.offsetWidth
            const contentRect = content.getBoundingClientRect()
            const nameRect = name.getBoundingClientRect()
            const gapIfFull =
                contentRect.width - fullWidth - (nameRect.right - contentRect.left)

            this.navCompact = gapIfFull < 312
        },
    },
}
</script>

<style scoped>
.portfolio-top-bar {
    --brand: #000aaa;
    --font-weight-scale: 0.95;
    --page-max: 1454px;
    --page-pad: clamp(100px, calc(100px + (100vw - 997px) * 40 / 457), 140px);
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
    transition: transform 0.3s ease;
}

.top-bar--hidden {
    transform: translateY(-100%);
}

.top-bar-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: var(--page-max);
    height: 120px;
    margin: 0 auto;
    padding: 0 var(--page-pad);
    box-sizing: border-box;
}

.top-bar-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 40px;
    width: 100%;
}

.menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    width: 31px;
    height: 27px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.menu-toggle span {
    display: block;
    width: 31px;
    height: 2px;
    background: var(--brand);
}

.mobile-nav {
    display: none;
}

.mobile-nav-backdrop {
    display: none;
}

.logo-block {
    display: flex;
    align-items: flex-end;
    gap: 28px;
    text-decoration: none;
    color: inherit;
}

.logo {
    width: 87px;
    height: 46px;
    flex-shrink: 0;
}

.logo-name {
    margin-bottom: 5px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 18px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 27px;
    color: var(--brand);
}

.nav {
    display: flex;
    align-items: flex-end;
    gap: 40px;
    height: 45px;
}

.nav-link {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 18px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 27px;
    color: var(--brand);
    text-decoration: none;
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

.nav--compact .nav-link--work,
.nav--compact .nav-link--about {
    display: none;
}

@media (max-width: 767px) {
    .menu-toggle {
        display: flex;
    }

    .nav {
        display: none;
    }

    .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: 32px;
        position: fixed;
        top: 120px;
        right: var(--page-pad);
        z-index: 110;
        padding: 0;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-8px);
        transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .mobile-nav--open {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
    }

    .mobile-nav-link {
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 18px;
        font-weight: calc(500 * var(--font-weight-scale));
        line-height: 27px;
        letter-spacing: -0.02em;
        color: var(--brand);
        text-decoration: none;
    }

    .mobile-nav-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 105;
        background: transparent;
    }
}

@media (max-width: 480px) {
    .top-bar-inner {
        padding: 0 24px;
    }

    .mobile-nav {
        right: 24px;
    }
}
</style>
