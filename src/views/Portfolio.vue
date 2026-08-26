<template>
    <div
        class="portfolio-page"
        :class="{
            'portfolio-page--reveal': pageRevealed,
            'portfolio-page--settled': pageEntranceDone,
        }"
    >
        <div
            v-if="showLoadingSplash || logoHandoff"
            class="loading-splash"
            :class="{ 'loading-splash--handoff': logoHandoff }"
            aria-busy="true"
            aria-live="polite"
            aria-label="Loading"
        >
            <img
                v-show="!logoHandoff"
                class="loading-splash-frame"
                :class="{ 'loading-splash-frame--rotating': loadingRotating }"
                :src="loadingFrames[loadingFrameIndex]"
                :style="{ transform: `rotate(${loadingRotationDeg}deg)` }"
                alt=""
                width="84"
                height="84"
            />
            <img
                v-if="logoHandoff"
                class="loading-splash-handoff-logo"
                :src="menuLogo"
                :style="logoHandoffStyle"
                alt=""
                width="84"
                height="42"
                @transitionend="onLogoHandoffTransitionEnd"
            />
        </div>

        <div
            class="portfolio-content"
            :class="{ 'portfolio-content--logo-handoff': logoHandoff }"
            :aria-hidden="(showLoadingSplash || logoHandoff) && !pageRevealed ? 'true' : undefined"
        >
        <PortfolioTopBar />

        <main class="portfolio-main">
            <section class="hero">
                <div class="hero-intro-wrap">
                    <div
                        class="hero-decor portfolio-fly portfolio-fly--from-right"
                        :class="{ 'hero-decor--hidden': heroDecorHidden }"
                        aria-hidden="true"
                    >
                        <picture>
                            <source
                                media="(min-width: 998px)"
                                :srcset="lineAnimationTall"
                            />
                            <source
                                media="(max-width: 997px)"
                                :srcset="lineAnimationTall"
                            />
                            <img
                                class="hero-decor-line"
                                :class="{
                                    'hero-decor-line--bouncing': heroLinePhase === 'bouncing',
                                    'hero-decor-line--up': heroLinePhase === 'up',
                                }"
                                :src="lineAnimation"
                                alt=""
                                @animationend="onHeroLineBounceEnd"
                            />
                        </picture>
                    </div>
                    <p
                        class="hero-intro portfolio-fly portfolio-fly--from-right"
                        :class="{ 'hero-intro--chars': heroIntroLetterMode }"
                        :aria-label="heroIntroLetterMode ? heroIntroPlain : undefined"
                    >
                        <template v-if="heroIntroLetterMode">
                            <span class="hero-intro-chars" aria-hidden="true">
                                <component
                                    :is="part.em ? 'strong' : 'span'"
                                    v-for="(part, partIndex) in heroIntroParts"
                                    :key="partIndex"
                                    :class="{
                                        'hero-intro-em': part.em,
                                        'hero-intro-em--keep': part.keep,
                                    }"
                                >
                                    <template v-for="(token, tokenIndex) in part.tokens" :key="tokenIndex">
                                        <span class="hero-intro-word">
                                            <span
                                                v-for="ch in token.chars"
                                                :key="ch.i"
                                                class="hero-intro-char"
                                                :class="{
                                                    'hero-intro-char--afterthought': ch.afterthought,
                                                }"
                                            >{{ ch.c }}</span><span
                                                v-if="token.trailing"
                                                class="hero-intro-word-space"
                                            >{{ token.trailing }}</span>
                                        </span>
                                    </template>
                                </component>
                            </span>
                        </template>
                        <template v-else>
                            <span class="hero-intro-lead">Tim Justina Yeung is a </span><strong class="hero-intro-em">Product Designer</strong> with a background in Neuroscience and research.
                            She deeply enjoys understanding complex problems and providing creative solutions
                            <strong class="hero-intro-em hero-intro-em--keep">for people :)</strong>
                        </template>
                    </p>
                </div>
                <a class="cta-button portfolio-fly portfolio-fly--from-left" href="mailto:design@timjustina.com">Drop me a line</a>
            </section>

            <section id="work" class="work">
                <article
                    id="work-first"
                    class="project project--featured portfolio-fly portfolio-fly--from-right"
                    @mouseenter="liftHeroLine"
                    @mouseleave="dropHeroLine"
                    @focusin="liftHeroLine"
                    @focusout="onFeaturedFocusOut"
                >
                    <router-link
                        to="/work/DashboardDesign"
                        class="project-image-link"
                        @pointerdown="onFeaturedProjectPress"
                        @pointerup="onFeaturedProjectPressEnd"
                        @pointercancel="onFeaturedProjectPressEnd"
                        @click="onFeaturedProjectNavigate"
                    >
                        <img
                            class="project-image"
                            :src="dashboardHero"
                            width="2400"
                            height="1352"
                            decoding="async"
                            fetchpriority="high"
                            alt="IoT Adherence Analytics for Caregivers: Dashboard Design"
                        />
                    </router-link>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                <router-link
                                    to="/work/DashboardDesign"
                                    class="project-title-link"
                                    @pointerdown="onFeaturedProjectPress"
                                    @pointerup="onFeaturedProjectPressEnd"
                                    @pointercancel="onFeaturedProjectPressEnd"
                                    @click="onFeaturedProjectNavigate"
                                >
                                    IoT Adherence Analytics for Caregivers: Dashboard Design
                                </router-link>
                            </h2>
                            <span class="project-year">2026</span>
                        </div>
                        <p class="project-description">
                            0‑to‑1 design of a caregiver‑facing dashboard for a primary user's account, helping caregivers better understand their client's needs
                        </p>
                    </div>
                </article>

                <article class="project project--offset project--upcoming portfolio-fly portfolio-fly--from-left">
                    <div class="project-image-wrap">
                        <img
                            class="project-image"
                            :src="multiplatformHero"
                            alt="Home Medication Solution: IoT Multiplatform Design"
                        />
                        <div class="project-upcoming-overlay" aria-hidden="true">
                            <span class="project-upcoming-label">Writing up ...</span>
                        </div>
                    </div>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                Home Medication Solution: IoT Multiplatform Design
                            </h2>
                            <span class="project-year">2024</span>
                        </div>
                        <p class="project-description">
                            End-to-end design and redesign of human-machine interface, web and mobile app features of an IoT medication adherence platform
                        </p>
                    </div>
                </article>

                <article class="project project--upcoming portfolio-fly portfolio-fly--from-right">
                    <div class="project-image-wrap">
                        <img
                            class="project-image"
                            :src="marketplaceHero"
                            alt="Art Curation and Marketplace: Mobile App Design"
                        />
                        <div class="project-upcoming-overlay" aria-hidden="true">
                            <span class="project-upcoming-label">Writing up ...</span>
                        </div>
                    </div>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                Art Curation and Marketplace: Mobile App Design
                            </h2>
                            <span class="project-year">2019</span>
                        </div>
                        <p class="project-description">
                            0-to-1 design of a mobile-first peer-to-peer marketplace where users can curate, buy and sell artworks
                        </p>
                    </div>
                </article>
            </section>
        </main>

        <section
            id="about"
            class="about"
            :class="{ 'about--reveal': aboutRevealed, 'about--settled': aboutEntranceDone }"
        >
            <span class="about-line portfolio-fly portfolio-fly--from-right" aria-hidden="true" />
            <div class="about-inner">
                <div class="about-photo-column portfolio-fly portfolio-fly--from-left">
                    <img
                        v-if="aboutPhoto"
                        class="about-photo"
                        :src="aboutPhoto"
                        alt="Tim Justina Yeung"
                    />
                    <div v-else class="about-photo about-photo--placeholder" />
                </div>
                <div id="about-bio" class="about-text-column">
                    <div class="about-intro">
                        <h2 class="about-heading portfolio-fly portfolio-fly--from-left">About Tim ( 湉 )</h2>
                        <p class="about-location portfolio-fly portfolio-fly--from-right">
                            <span class="about-location-icon-wrap" aria-hidden="true">
                                <svg class="about-location-icon" width="13" height="20" viewBox="0 0 13 20" fill="none" aria-hidden="true">
                                    <path
                                        d="M6.5 0C2.91 0 0 2.91 0 6.5C0 11.38 6.5 20 6.5 20S13 11.38 13 6.5C13 2.91 10.09 0 6.5 0ZM6.5 8.75C5.26 8.75 4.25 7.74 4.25 6.5C4.25 5.26 5.26 4.25 6.5 4.25C7.74 4.25 8.75 5.26 8.75 6.5C8.75 7.74 7.74 8.75 6.5 8.75Z"
                                        fill="#B9B4AE"
                                    />
                                </svg>
                            </span>
                            <span class="about-location-text-wrap">
                                <span class="about-location-text">London / Barcelona</span>
                                <span class="about-location-text-white-stack" aria-hidden="true">
                                    <span class="about-location-text-white-inner">
                                        <span class="about-location-text about-location-text--glow">London / Barcelona</span>
                                        <span class="about-location-text about-location-text--soft">London / Barcelona</span>
                                        <span class="about-location-text about-location-text--white">London / Barcelona</span>
                                    </span>
                                </span>
                            </span>
                        </p>
                    </div>
                    <p class="about-bio portfolio-fly portfolio-fly--from-left">
                        Started in the east, ended up in the west. Started in academia, ended up in the
                        real world. Started as a curious child, ended up a very curious adult. Trained to
                        solve problems with no precedent.
                        <br><br>
                        At work, value a good team. Understand
                        context, metrics and specs before jumping in. UX-focused. Very comfortable with data.
                        Interrogate LLMs.
                        <br><br>
                        Like to work out in free time - old books and films for the brain,
                        gym and swim for the rest of the body. Drink wild beers on cheat days. Bilingual in
                        English and Chinese. Speak a bit of Spanish. Love a good conversation. Can't help
                        learning new things all the time.
                        <br><br>
                        For the nerds: a <a href="https://journals.biologists.com/dev/article/151/24/dev204256/363461/Short-range-Fgf-signalling-patterns-hindbrain" class="about-link">link</a> to my past life in
                        developmental neurobiology
                        (research paper).
                    </p>
                </div>
                <div class="about-actions portfolio-fly portfolio-fly--from-left">
                    <a
                        href="https://www.linkedin.com/in/timjustinayeung"
                        class="about-action-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >Linkedin</a>
                    <a
                        :href="cvUrl"
                        class="about-action-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >CV</a>
                </div>
            </div>
            <img
                class="about-ball"
                :class="{ 'about-ball--dropped': aboutBallDropped }"
                :src="aboutSquiggle"
                alt=""
                width="59"
                height="56"
                aria-hidden="true"
            />
        </section>

        <PortfolioSiteFooter />
        </div>
    </div>
</template>

<script>
import dashboardHero from '../assets/1_dashboard/0_dashboard_hero_detail-2400.jpg'
import multiplatformHero from '../assets/2_multiplatform/0_multiplatform_hero.jpg'
import marketplaceHero from '../assets/3_marketplace/0_marketplace_hero.jpg'
import aboutPhoto from '../assets/portrait.jpg'
import lineAnimation from '../assets/line_animation.svg'
import lineAnimationTall from '../assets/line_animation_tall.svg'
import aboutSquiggle from '../assets/squiggle_3.svg'
import loadingNormal from '../assets/loading/loading_normal.svg'
import loadingFolded from '../assets/loading/loading_folded.svg'
import menuLogo from '../assets/TjyCutoutLogo.svg'
import cvUrl from '../assets/Tim Justina Yeung CV-2.pdf'
import PortfolioTopBar from '../components/PortfolioTopBar.vue'
import PortfolioSiteFooter from '../components/PortfolioSiteFooter.vue'
import { scrollToPortfolioHash } from '../utils/scrollToAbout.js'
import {
    cancelImageExpand,
    prefersReducedMotion,
    PRESS_BORDER_RADIUS,
    startImageExpand,
} from '../utils/imageExpandTransition.js'

const LOADING_FRAME_MS = 500
const LOADING_PAUSE_MS = 250
const LOADING_ROTATE_MS = 800
const LOADING_MAX_ITERATIONS = 6
const LOGO_HANDOFF_MS = 850
const LOGO_HANDOFF_REVEAL_LEAD_MS = 140
const LOGO_HANDOFF_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const PORTFOLIO_SECTION_HASHES = new Set(['#about', '#work-first', '#work'])

const HERO_INTRO_PARTS = [
    { text: 'Tim Justina Yeung is a ', em: false },
    { text: 'Product Designer', em: true },
    {
        text: ' with a background in Neuroscience and research. She deeply enjoys understanding complex problems and providing creative solutions ',
        em: false,
    },
    { text: 'for people :)', em: true, keep: true, afterthoughtSuffix: ':)' },
]

function buildHeroIntroParts(parts) {
    let i = 0
    const built = parts.map((part) => ({
        em: Boolean(part.em),
        keep: Boolean(part.keep),
        tokens: [],
    }))

    // Trailing spaces hang off the previous word so a wrap never starts with
    // whitespace (avoids a leftover indent like before "and research").
    let prevWord = null
    parts.forEach((part, partIndex) => {
        const chunks = String(part.text)
            .split(/(\s+)/)
            .filter((token) => token.length > 0)

        for (const token of chunks) {
            if (/^\s+$/.test(token)) {
                if (prevWord) {
                    prevWord.trailing += token
                }
                continue
            }

            const isAfterthought =
                Boolean(part.afterthoughtSuffix) && token === part.afterthoughtSuffix
            const word = {
                type: 'word',
                chars: Array.from(token).map((c) => ({
                    c,
                    i: i++,
                    afterthought: isAfterthought,
                })),
                trailing: '',
            }
            built[partIndex].tokens.push(word)
            prevWord = word
        }
    })

    return built
}

const HERO_INTRO_BUILT = buildHeroIntroParts(HERO_INTRO_PARTS)
const HERO_INTRO_PLAIN = HERO_INTRO_PARTS.map((part) => part.text).join('')

export default {
    name: 'Portfolio',
    components: { PortfolioTopBar, PortfolioSiteFooter },
    data() {
        return {
            dashboardHero,
            multiplatformHero,
            marketplaceHero,
            aboutPhoto,
            lineAnimation,
            lineAnimationTall,
            aboutSquiggle,
            loadingFrames: [loadingNormal, loadingFolded],
            menuLogo,
            cvUrl,
            showLoadingSplash: true,
            logoHandoff: false,
            logoHandoffStyle: null,
            logoHandoffTimer: null,
            logoHandoffRevealTimer: null,
            loadingFrameIndex: 0,
            loadingIteration: 0,
            loadingTimer: null,
            loadingRotationDeg: 0,
            loadingRotating: false,
            pageRevealed: false,
            pageEntranceDone: false,
            aboutRevealed: false,
            aboutEntranceDone: false,
            pendingAboutBallDrop: false,
            aboutBallDropped: false,
            heroLinePhase: 'rest',
            heroLineClipSettled: false,
            // JS-owned so we can measure while hidden, then show after sync (avoids 600px flash)
            heroDecorHidden:
                typeof window !== 'undefined' &&
                window.matchMedia('(max-width: 600px)').matches,
            firstProjectPrefetchStarted: false,
            firstProjectPrefetchIdleId: null,
            aboutLocationClipRaf: null,
            featuredExpandPending: false,
            featuredExpandTimer: null,
            featuredPressClearTimer: null,
            featuredPressAt: 0,
            heroIntroParts: HERO_INTRO_BUILT,
            heroIntroPlain: HERO_INTRO_PLAIN,
            // Letter cascade is mobile-only; desktop keeps the original block fly-in.
            heroIntroLetterMode:
                typeof window !== 'undefined' &&
                window.matchMedia('(max-width: 600px)').matches &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        }
    },
    mounted() {
        const sectionHash = PORTFOLIO_SECTION_HASHES.has(this.$route.hash)
            ? this.$route.hash
            : ''

        // Arriving from a case study (or deep link) with Work/About: skip splash
        // and jump straight to the section once layout is ready.
        if (sectionHash) {
            this.showLoadingSplash = false
            this.pageRevealed = true
            this.pageEntranceDone = true
            this.heroLineClipSettled = true
        } else {
            document.documentElement.classList.add('portfolio-booting')
        }

        this.heroIntroLetterMq = window.matchMedia('(max-width: 600px)')
        this.heroIntroReduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
        this.onHeroIntroLetterMqChange = () => {
            this.onMobileHeroLayoutChange()
        }
        this.heroIntroLetterMq.addEventListener('change', this.onHeroIntroLetterMqChange)
        this.heroIntroReduceMq.addEventListener('change', this.onHeroIntroLetterMqChange)

        this.heroDecorObserver = new ResizeObserver(() => {
            this.beginHeroDecorResizeClip()
            requestAnimationFrame(() => {
                this.syncHeroDecorHeight()
                this.endHeroDecorResizeClip()
            })
        })

        const main = this.$el?.querySelector('.portfolio-main')
        const workFirst = this.$el?.querySelector('#work-first')
        const heroIntro = this.$el?.querySelector('.hero-intro')
        if (main) {
            this.heroDecorObserver.observe(main)
        }
        if (workFirst) {
            this.heroDecorObserver.observe(workFirst)
        }
        if (heroIntro) {
            this.heroDecorObserver.observe(heroIntro)
        }

        const heroImage = workFirst?.querySelector('.project-image')
        if (heroImage && !heroImage.complete) {
            heroImage.addEventListener('load', () => this.syncHeroDecorHeight(), { once: true })
        }

        this.syncHeroDecorHeight()
        this.syncAboutBallPosition()
        this.syncAboutLocationTextClip()
        window.addEventListener('resize', this.onHeroDecorResize, { passive: true })
        window.addEventListener('scroll', this.onAboutBallScroll, { passive: true })
        document.fonts?.ready?.then(() => {
            this.syncHeroDecorHeight()
            this.syncAboutBallPosition()
            this.syncAboutLocationTextClip()
            if (!this.pageRevealed) {
                this.syncHeroIntroCharColumns()
            }
            if (sectionHash) {
                this.jumpToSectionHash(sectionHash)
            }
        })

        const aboutBio = this.$el?.querySelector('.about-bio')
        if (aboutBio) {
            this.aboutBallObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => this.syncAboutBallPosition())
            })
            this.aboutBallObserver.observe(aboutBio)
        }

        const aboutInner = this.$el?.querySelector('.about-inner')
        if (aboutInner) {
            this.aboutLocationClipObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => this.syncAboutLocationTextClip())
            })
            this.aboutLocationClipObserver.observe(aboutInner)
        }

        // Work jumps use the normal IO reveal; About jumps start the slide-in after scroll.
        if (sectionHash !== '#about') {
            this.setupAboutReveal()
        }
        this.setupProjectScrollFade(sectionHash)
        this.scheduleFirstProjectPrefetch()

        if (sectionHash) {
            this.$nextTick(() => {
                requestAnimationFrame(() => {
                    this.syncHeroDecorHeight()
                    this.syncAboutBallPosition()
                    this.syncAboutLocationTextClip()
                    this.jumpToSectionHash(sectionHash)
                })
            })
        } else {
            this.scheduleLoadingAdvance()
        }

        if (this.pageRevealed) {
            this.schedulePageEntranceSettle()
            if (this.pageEntranceDone) {
                this.$nextTick(() => {
                    this.getHeroLineEl()?.classList.add('hero-decor-line--settled')
                })
            }
        }
    },
    beforeUnmount() {
        this.clearLoadingTimer()
        this.clearLogoHandoffTimer()
        clearTimeout(this.aboutEntranceTimer)
        clearTimeout(this.heroLineClipSettleTimer)
        clearTimeout(this.pageEntranceSettleTimer)
        clearTimeout(this.heroDecorResizeClipTimer)
        clearTimeout(this.featuredExpandTimer)
        clearTimeout(this.featuredPressClearTimer)
        this.getHeroLineEl()?.removeEventListener('transitionend', this.onHeroLineClipSettleEnd)
        document.documentElement.classList.remove('portfolio-booting')
        this.heroDecorObserver?.disconnect()
        this.aboutBallObserver?.disconnect()
        this.aboutLocationClipObserver?.disconnect()
        this.stopAboutLocationTextClipPoll()
        this.aboutRevealObserver?.disconnect()
        this.projectFadeObserver?.disconnect()
        window.removeEventListener('resize', this.onHeroDecorResize)
        window.removeEventListener('scroll', this.onAboutBallScroll)
        this.heroIntroLetterMq?.removeEventListener('change', this.onHeroIntroLetterMqChange)
        this.heroIntroReduceMq?.removeEventListener('change', this.onHeroIntroLetterMqChange)
        this.getHeroLineEl()?.removeEventListener('transitionend', this.onHeroLineReturnEnd)
        if (this.firstProjectPrefetchIdleId != null && 'cancelIdleCallback' in window) {
            cancelIdleCallback(this.firstProjectPrefetchIdleId)
        }
    },
    methods: {
        onFeaturedProjectPress(event) {
            if (event.pointerType === 'mouse' && event.button !== 0) return
            if (prefersReducedMotion()) return
            if (!window.matchMedia('(max-width: 600px)').matches) return
            const article = event.currentTarget.closest('.project')
            clearTimeout(this.featuredPressClearTimer)
            this.featuredPressClearTimer = null
            // Keep round while pressed; release clears it unless a navigate starts
            article?.classList.add('project--press-expand')
            this.featuredPressAt = performance.now()
        },
        onFeaturedProjectPressEnd(event) {
            if (!window.matchMedia('(max-width: 600px)').matches) return
            // pointerup fires before click — delay the undo so a real tap can
            // cancel it and keep the round for the expand.
            if (this.featuredExpandPending) return
            const article = event.currentTarget.closest('.project')
            clearTimeout(this.featuredPressClearTimer)
            this.featuredPressClearTimer = window.setTimeout(() => {
                this.featuredPressClearTimer = null
                if (this.featuredExpandPending) return
                article?.classList.remove('project--press-expand')
                this.featuredPressAt = 0
            }, 80)
        },
        onFeaturedProjectNavigate(event) {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            if (event.button != null && event.button !== 0) return
            if (prefersReducedMotion()) return
            if (this.featuredExpandPending) return

            const article = event.currentTarget.closest('.project')
            const img = article?.querySelector('.project-image')
            if (!img) return

            event.preventDefault()
            clearTimeout(this.featuredPressClearTimer)
            this.featuredPressClearTimer = null

            const beginExpand = () => {
                this.featuredExpandPending = false
                clearTimeout(this.featuredExpandTimer)
                this.featuredExpandTimer = null
                this.featuredPressAt = 0

                const rect = img.getBoundingClientRect()
                if (rect.width <= 0 || rect.height <= 0) {
                    article?.classList.remove('project--press-expand')
                    this.$router.push('/work/DashboardDesign')
                    return
                }

                startImageExpand({
                    src: img.currentSrc || img.src,
                    rect,
                    borderRadius: PRESS_BORDER_RADIUS,
                })
                img.style.opacity = '0'

                this.$router.push('/work/DashboardDesign').catch(() => {
                    img.style.opacity = ''
                    article?.classList.remove('project--press-expand')
                    cancelImageExpand()
                })
            }

            // Mobile: stay on portfolio until press-round has had its full 0.45s
            // from finger-down, plus a short beat at the fully-rounded pose.
            if (window.matchMedia('(max-width: 600px)').matches) {
                this.featuredExpandPending = true
                article.classList.add('project--press-expand')
                if (!this.featuredPressAt) this.featuredPressAt = performance.now()

                const ROUND_MS = 450
                const HOLD_MS = 200
                const elapsed = performance.now() - this.featuredPressAt
                const wait = Math.max(0, ROUND_MS - elapsed) + HOLD_MS
                this.featuredExpandTimer = window.setTimeout(beginExpand, wait)
                return
            }

            beginExpand()
        },
        jumpToSectionHash(hash) {
            scrollToPortfolioHash(hash, { duration: 0 })
            // Keep top bar hidden after the instant jump (no scroll delta to trigger it).
            window.dispatchEvent(new Event('portfolio-section-jump'))
            if (hash === '#work' || hash === '#work-first') {
                this.revealAllProjects()
            }
            if (hash !== '#about' || this.aboutRevealed) return

            // Start the about slide-in after the jump so it animates into place.
            this.aboutRevealed = true
            this.scheduleAboutEntranceEnd()
        },
        setupProjectScrollFade(sectionHash = '') {
            const projects = [...(this.$el?.querySelectorAll('.work .project') ?? [])]
            if (!projects.length) return

            const isMobile = window.matchMedia('(max-width: 600px)').matches
            if (!isMobile || prefersReducedMotion()) {
                this.revealAllProjects()
                return
            }

            // Deep-link into work: show cards immediately (no fade after jump).
            if (sectionHash === '#work' || sectionHash === '#work-first') {
                this.revealAllProjects()
                return
            }

            this.projectFadeObserver = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (!entry.isIntersecting) continue
                        entry.target.classList.add('project--in-view')
                        this.projectFadeObserver?.unobserve(entry.target)
                    }
                },
                {
                    root: null,
                    threshold: 0.12,
                    rootMargin: '0px 0px -6% 0px',
                }
            )
            for (const project of projects) {
                this.projectFadeObserver.observe(project)
            }
        },
        revealAllProjects() {
            this.projectFadeObserver?.disconnect()
            this.projectFadeObserver = null
            for (const project of this.$el?.querySelectorAll('.work .project') ?? []) {
                project.classList.add('project--in-view')
            }
        },
        setupAboutReveal() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.aboutRevealed = true
                this.aboutEntranceDone = true
                return
            }

            const about = this.$el?.querySelector('#about')
            if (!about) return

            const isMobile = window.matchMedia('(max-width: 600px)').matches

            this.aboutRevealObserver = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0]
                    if (!entry) return

                    if (isMobile) {
                        // Start once the beige about background fills 1/3 of the viewport
                        const viewportHeight = entry.rootBounds?.height ?? 0
                        const visibleHeight = entry.intersectionRect.height
                        if (viewportHeight <= 0 || visibleHeight < viewportHeight / 3) return
                    } else if (!entry.isIntersecting) {
                        return
                    }

                    this.aboutRevealed = true
                    this.aboutRevealObserver?.disconnect()
                    this.aboutRevealObserver = null
                    this.scheduleAboutEntranceEnd()
                },
                isMobile
                    ? {
                          root: null,
                          // Dense steps so we can measure visible height as it scrolls in
                          threshold: Array.from({ length: 21 }, (_, i) => i / 20),
                          rootMargin: '0px',
                      }
                    : {
                          root: null,
                          threshold: 0.2,
                          rootMargin: '0px 0px -12% 0px',
                      }
            )
            this.aboutRevealObserver.observe(about)
        },
        scheduleAboutEntranceEnd() {
            clearTimeout(this.aboutEntranceTimer)
            const page = this.$el
            const durationMs =
                (parseFloat(getComputedStyle(page).getPropertyValue('--fly-duration')) || 1.25) *
                1000
            // Longest about stagger is photo at 0.18s
            this.pollAboutLocationTextClip()
            this.aboutEntranceTimer = setTimeout(() => {
                this.aboutEntranceDone = true
                this.stopAboutLocationTextClipPoll()
                this.syncAboutBallPosition()
                this.syncAboutLocationTextClip()
                if (this.pendingAboutBallDrop) {
                    this.pendingAboutBallDrop = false
                    this.startAboutBallDrop()
                }
            }, durationMs + 200)
        },
        clearLoadingTimer() {
            if (this.loadingTimer != null) {
                clearTimeout(this.loadingTimer)
                this.loadingTimer = null
            }
        },
        clearLogoHandoffTimer() {
            if (this.logoHandoffTimer != null) {
                clearTimeout(this.logoHandoffTimer)
                this.logoHandoffTimer = null
            }
            if (this.logoHandoffRevealTimer != null) {
                clearTimeout(this.logoHandoffRevealTimer)
                this.logoHandoffRevealTimer = null
            }
        },
        areMainPageImagesLoaded() {
            const imgs = [...this.$el.querySelectorAll('.portfolio-content img')]
            if (!imgs.length) return false
            return imgs.every((img) => img.complete)
        },
        finishLoadingSplash() {
            this.clearLoadingTimer()
            const isMobile = window.matchMedia('(max-width: 600px)').matches
            if (!isMobile || prefersReducedMotion()) {
                this.completeLoadingHandoff()
                return
            }
            this.startLogoHandoff()
        },
        startLogoHandoff() {
            const frame = this.$el?.querySelector('.loading-splash-frame')
            const dest = this.$el?.querySelector('.portfolio-top-bar .logo')
            if (!frame || !dest) {
                this.completeLoadingHandoff()
                return
            }

            const from = frame.getBoundingClientRect()
            const to = dest.getBoundingClientRect()
            if (from.width <= 0 || to.width <= 0 || to.height <= 0) {
                this.completeLoadingHandoff()
                return
            }

            // loading_normal sits in an 84×84 canvas with the mark in the top half
            const startW = from.width
            const startH = from.height / 2
            const startL = from.left
            const startT = from.top

            this.logoHandoffStyle = {
                left: `${startL}px`,
                top: `${startT}px`,
                width: `${startW}px`,
                height: `${startH}px`,
                transform: 'translate(0, 0) scale(1, 1)',
                transition: 'none',
            }
            this.logoHandoff = true

            this.clearLogoHandoffTimer()
            this.logoHandoffTimer = setTimeout(() => {
                this.completeLoadingHandoff()
            }, LOGO_HANDOFF_MS + 40)

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!this.logoHandoff) return
                    const dx = to.left - startL
                    const dy = to.top - startT
                    const sx = to.width / startW
                    const sy = to.height / startH
                    this.logoHandoffStyle = {
                        left: `${startL}px`,
                        top: `${startT}px`,
                        width: `${startW}px`,
                        height: `${startH}px`,
                        transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
                        transition: `transform ${LOGO_HANDOFF_MS}ms ${LOGO_HANDOFF_EASE}`,
                    }

                    const revealAt = Math.max(0, LOGO_HANDOFF_MS - LOGO_HANDOFF_REVEAL_LEAD_MS)
                    this.logoHandoffRevealTimer = setTimeout(() => {
                        this.beginPageReveal()
                    }, revealAt)
                })
            })
        },
        onLogoHandoffTransitionEnd(event) {
            if (event.propertyName !== 'transform') return
            this.completeLoadingHandoff()
        },
        beginPageReveal() {
            if (this.pageRevealed) return
            document.documentElement.classList.remove('portfolio-booting')
            this.syncHeroDecorHeight()
            this.syncAboutBallPosition()
            this.syncAboutLocationTextClip()
            this.syncHeroIntroCharColumns()
            this.pageRevealed = true
            this.schedulePageEntranceSettle()
            scrollToPortfolioHash(this.$route.hash)
        },
        schedulePageEntranceSettle() {
            if (this.pageEntranceDone || this.pageEntranceSettleScheduled) return
            this.pageEntranceSettleScheduled = true

            if (prefersReducedMotion()) {
                this.markPageEntranceDone()
                return
            }

            // Also settle the line knot as soon as its clip reveal ends
            this.scheduleHeroLineClipSettle()

            // Wait until the longest hero motion finishes — on mobile that's the
            // ":)" afterthought (CTA end + beat + char fly), not just the CTA.
            let settleMs = 2300
            if (window.matchMedia('(max-width: 600px)').matches) {
                const pageStyles = getComputedStyle(this.$el)
                const intro = this.$el?.querySelector('.hero-intro')
                const introStyles = intro ? getComputedStyle(intro) : pageStyles
                const ctaDelay =
                    parseFloat(pageStyles.getPropertyValue('--cta-fly-delay')) || 0.1
                const ctaDuration =
                    parseFloat(pageStyles.getPropertyValue('--cta-fly-duration')) || 2.05
                const charDuration =
                    parseFloat(introStyles.getPropertyValue('--hero-intro-char-duration')) ||
                    0.85
                // Matches syncHeroIntroCharColumns: ctaEnd + 0.22 + idx*0.1 + jitter
                const afterthoughtStart = ctaDelay + ctaDuration + 0.22 + 0.1 + 0.05
                settleMs = Math.ceil((afterthoughtStart + charDuration + 0.15) * 1000)
            }

            clearTimeout(this.pageEntranceSettleTimer)
            this.pageEntranceSettleTimer = setTimeout(() => {
                this.markPageEntranceDone()
            }, settleMs)
        },
        markPageEntranceDone() {
            clearTimeout(this.pageEntranceSettleTimer)
            this.pageEntranceSettleTimer = null
            if (this.pageEntranceDone) return
            this.pageEntranceDone = true
            this.markHeroLineClipSettled()
        },
        scheduleHeroLineClipSettle() {
            if (this.heroLineClipSettled || this.heroLineClipSettleScheduled) return
            this.heroLineClipSettleScheduled = true

            if (prefersReducedMotion()) {
                this.markHeroLineClipSettled()
                return
            }

            const line = this.getHeroLineEl()
            if (!line) {
                this.markHeroLineClipSettled()
                return
            }

            this.onHeroLineClipSettleEnd = (event) => {
                if (event.propertyName !== 'clip-path') return
                line.removeEventListener('transitionend', this.onHeroLineClipSettleEnd)
                this.markHeroLineClipSettled()
            }
            line.addEventListener('transitionend', this.onHeroLineClipSettleEnd)

            // 1.15s delay + 0.7s clip reveal (+ buffer) — fallback if transitionend is skipped
            clearTimeout(this.heroLineClipSettleTimer)
            this.heroLineClipSettleTimer = setTimeout(() => {
                line.removeEventListener('transitionend', this.onHeroLineClipSettleEnd)
                this.markHeroLineClipSettled()
            }, 2000)
        },
        markHeroLineClipSettled() {
            clearTimeout(this.heroLineClipSettleTimer)
            this.heroLineClipSettleTimer = null
            if (this.heroLineClipSettled) return
            this.heroLineClipSettled = true
            this.getHeroLineEl()?.classList.add('hero-decor-line--settled')
        },
        beginHeroDecorResizeClip({ force = false } = {}) {
            if (!force && !this.heroLineClipSettled) return
            this.$el?.querySelector('.hero-decor')?.classList.add('hero-decor--resizing')
            clearTimeout(this.heroDecorResizeClipTimer)
        },
        endHeroDecorResizeClip() {
            clearTimeout(this.heroDecorResizeClipTimer)
            // Debounce so continuous resize / breakpoint settles before showing the knot
            this.heroDecorResizeClipTimer = setTimeout(() => {
                this.$el?.querySelector('.hero-decor')?.classList.remove('hero-decor--resizing')
                this.heroDecorResizeClipTimer = null
            }, 150)
        },
        onMobileHeroLayoutChange() {
            const isMobile = this.heroIntroLetterMq.matches
            const nextLetter =
                isMobile && !this.heroIntroReduceMq.matches
            const letterChanged = nextLetter !== this.heroIntroLetterMode
            const leavingMobile = this.heroDecorHidden && !isMobile

            if (isMobile) {
                this.heroDecorHidden = true
                if (letterChanged) this.heroIntroLetterMode = nextLetter
                return
            }

            if (letterChanged) this.heroIntroLetterMode = nextLetter

            // Tablet↔desktop letter/motion-only: sync without hiding the line
            if (!leavingMobile) {
                this.beginHeroDecorResizeClip()
                this.$nextTick(() => {
                    this.syncHeroDecorHeight()
                    if (this.heroIntroLetterMode && !this.pageRevealed) {
                        this.syncHeroIntroCharColumns()
                    }
                    this.endHeroDecorResizeClip()
                })
                return
            }

            // Leaving mobile → tablet/desktop: keep line invisible until height matches layout
            this.heroDecorHidden = true
            this.beginHeroDecorResizeClip({ force: true })

            this.$nextTick(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        this.syncHeroDecorHeight()
                        this.syncAboutBallPosition()
                        this.syncAboutLocationTextClip()
                        if (this.heroIntroLetterMode && !this.pageRevealed) {
                            this.syncHeroIntroCharColumns()
                        }
                        this.heroDecorHidden = false
                        this.endHeroDecorResizeClip()
                    })
                })
            })
        },
        completeLoadingHandoff() {
            if (!this.showLoadingSplash && !this.logoHandoff) return
            this.clearLoadingTimer()
            this.clearLogoHandoffTimer()
            this.showLoadingSplash = false
            this.logoHandoff = false
            this.logoHandoffStyle = null
            document.documentElement.classList.remove('portfolio-booting')
            if (!this.pageRevealed) {
                this.beginPageReveal()
            }
        },
        scheduleLoadingAdvance() {
            this.clearLoadingTimer()
            this.loadingTimer = setTimeout(() => {
                // Only leave while on normal — right before folded would appear,
                // so the last thing shown is always the logo.
                if (this.loadingFrameIndex === 0) {
                    if (
                        this.areMainPageImagesLoaded() ||
                        this.loadingIteration >= LOADING_MAX_ITERATIONS
                    ) {
                        this.finishLoadingSplash()
                        return
                    }

                    // normal → folded
                    this.loadingRotating = false
                    this.loadingFrameIndex = 1
                    this.scheduleLoadingAdvance()
                    return
                }

                // After folded hold, full 360° spin, then back to normal
                this.rotateLoadingFullTurn()
            }, LOADING_FRAME_MS)
        },
        rotateLoadingFullTurn() {
            this.clearLoadingTimer()
            this.loadingRotating = true
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Full turn counterclockwise
                    this.loadingRotationDeg -= 360
                })
            })

            // Spin, pause, then return to normal (exit check happens there)
            this.loadingTimer = setTimeout(() => {
                this.loadingRotating = false

                this.loadingTimer = setTimeout(() => {
                    this.$nextTick(() => {
                        this.loadingIteration += 1
                        this.loadingFrameIndex = 0
                        this.scheduleLoadingAdvance()
                    })
                }, LOADING_PAUSE_MS)
            }, LOADING_ROTATE_MS)
        },
        waitForImage(img) {
            if (!img || img.complete) return Promise.resolve()
            return new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true })
                img.addEventListener('error', resolve, { once: true })
            })
        },
        scheduleFirstProjectPrefetch() {
            const upcomingImages = [
                ...this.$el.querySelectorAll('.project--upcoming .project-image'),
            ]
            Promise.all(upcomingImages.map((img) => this.waitForImage(img))).then(() => {
                this.prefetchFirstProject()
            })
        },
        prefetchFirstProject() {
            if (this.firstProjectPrefetchStarted) return
            this.firstProjectPrefetchStarted = true

            const run = () => {
                this.firstProjectPrefetchIdleId = null
                import('../prefetch/dashboardDesign.js')
                    .then((mod) => mod.prefetchDashboardDesign())
                    .catch(() => {})
            }

            if ('requestIdleCallback' in window) {
                this.firstProjectPrefetchIdleId = requestIdleCallback(run, { timeout: 2000 })
            } else {
                setTimeout(run, 200)
            }
        },
        getHeroLineEl() {
            return this.$el?.querySelector('.hero-decor-line')
        },
        liftHeroLine() {
            if (this.heroLinePhase === 'bouncing' || this.heroLinePhase === 'up') return
            const line = this.getHeroLineEl()
            if (line) {
                line.removeEventListener('transitionend', this.onHeroLineReturnEnd)
                line.style.removeProperty('transform')
            }
            this.heroLinePhase = 'bouncing'
        },
        onHeroLineBounceEnd(event) {
            if (!String(event.animationName).includes('hero-line-bounce-up')) return
            if (this.heroLinePhase !== 'bouncing') return
            this.heroLinePhase = 'up'
        },
        dropHeroLine() {
            if (this.heroLinePhase === 'rest') return
            const line = this.getHeroLineEl()
            if (!line) {
                this.heroLinePhase = 'rest'
                return
            }

            // Freeze the animated position, then ease down (removing animation alone would jump).
            const computed = getComputedStyle(line).transform
            const duration =
                getComputedStyle(line).getPropertyValue('--hero-line-return-duration').trim() || '3s'
            line.style.transition = 'none'
            if (computed && computed !== 'none') {
                line.style.transform = computed
            }
            this.heroLinePhase = 'rest'
            void line.offsetWidth
            line.style.transition = `transform ${duration} ease`
            line.removeEventListener('transitionend', this.onHeroLineReturnEnd)
            line.addEventListener('transitionend', this.onHeroLineReturnEnd)
            requestAnimationFrame(() => {
                line.style.transform = 'translateY(0)'
            })
        },
        onHeroLineReturnEnd(event) {
            if (event.propertyName !== 'transform') return
            const line = event.currentTarget
            if (this.heroLinePhase === 'rest') {
                line.style.removeProperty('transform')
                line.style.removeProperty('transition')
            }
            line.removeEventListener('transitionend', this.onHeroLineReturnEnd)
        },
        onFeaturedFocusOut(event) {
            if (!event.currentTarget.contains(event.relatedTarget)) {
                this.dropHeroLine()
            }
        },
        onAboutBallScroll() {
            if (this.aboutBallDropped) return
            const footer = this.$el?.querySelector('.site-footer')
            const threshold = footer?.offsetHeight || 120
            const doc = document.documentElement
            const remaining =
                doc.scrollHeight - (window.scrollY + window.innerHeight)
            if (remaining <= threshold) {
                this.startAboutBallDrop()
            }
        },
        startAboutBallDrop() {
            if (this.aboutBallDropped) return
            // Don't start the drop while the about slide-in is still moving
            if (this.aboutRevealed && !this.aboutEntranceDone) {
                this.pendingAboutBallDrop = true
                return
            }
            this.syncAboutBallPosition()
            this.aboutBallDropped = true
            window.removeEventListener('scroll', this.onAboutBallScroll)
        },
        syncAboutBallPosition() {
            // Skip while about fly-ins are running — mutating those elements
            // to measure was restarting the entrance animations.
            if (this.aboutRevealed && !this.aboutEntranceDone) return

            const about = this.$el?.querySelector('.about')
            if (!about) return

            if (window.matchMedia('(max-width: 600px)').matches) {
                about.style.removeProperty('--about-ball-x')
                return
            }

            const bio = this.$el?.querySelector('.about-bio')
            if (!bio) return

            const aboutRect = about.getBoundingClientRect()
            const bioRect = bio.getBoundingClientRect()
            const styles = getComputedStyle(about)
            const ballSize =
                parseFloat(styles.getPropertyValue('--about-ball-size')) || 49
            const gap = 16
            const maxX = about.clientWidth - ballSize - 16
            const x = Math.max(
                16,
                Math.min(bioRect.right - aboutRect.left + gap, maxX)
            )
            about.style.setProperty('--about-ball-x', `${Math.round(x)}px`)
        },
        onHeroDecorResize() {
            this.beginHeroDecorResizeClip()
            requestAnimationFrame(() => {
                this.syncHeroDecorHeight()
                this.syncAboutBallPosition()
                this.syncAboutLocationTextClip()
                if (!this.pageRevealed) {
                    this.syncHeroIntroCharColumns()
                }
                this.endHeroDecorResizeClip()
            })
        },
        /**
         * Left-biased stagger with per-letter random jitter. Delays are scaled
         * so the last letter finishes with the CTA button fly-in.
         */
        syncHeroIntroCharColumns() {
            if (!window.matchMedia('(max-width: 600px)').matches) return
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

            const intro = this.$el?.querySelector('.hero-intro')
            if (!intro) return

            const chars = [...intro.querySelectorAll('.hero-intro-char')]
            if (!chars.length) return

            const mainChars = chars.filter(
                (el) => !el.classList.contains('hero-intro-char--afterthought')
            )
            const afterthoughtChars = chars.filter((el) =>
                el.classList.contains('hero-intro-char--afterthought')
            )

            const pageStyles = getComputedStyle(this.$el)
            const introStyles = getComputedStyle(intro)
            const ctaDelay =
                parseFloat(pageStyles.getPropertyValue('--cta-fly-delay')) || 0.08
            const ctaDuration =
                parseFloat(pageStyles.getPropertyValue('--cta-fly-duration')) ||
                parseFloat(pageStyles.getPropertyValue('--fly-duration')) ||
                1.25
            const ctaEnd = ctaDelay + ctaDuration
            const charDuration =
                parseFloat(introStyles.getPropertyValue('--hero-intro-char-duration')) ||
                0.85
            const minDelay = 0.04
            const slowestLineMult = 1.1
            const maxDelay = Math.max(
                minDelay,
                ctaEnd - charDuration * slowestLineMult
            )

            const introRect = intro.getBoundingClientRect()
            const measure = (el) => {
                const rect = el.getBoundingClientRect()
                return {
                    x: rect.left - introRect.left,
                    y: rect.top - introRect.top,
                }
            }

            let colW = 0
            for (const el of mainChars) {
                const w = el.getBoundingClientRect().width
                if (w > 0) {
                    colW = w
                    break
                }
            }
            if (colW <= 0) colW = 10

            const lineH =
                parseFloat(introStyles.lineHeight) || Math.max(colW * 1.5, 20)

            const lineDuration = (lineIndex, lineCount) => {
                if (lineCount <= 1) return charDuration
                const t = lineIndex / (lineCount - 1)
                // First line quickest; later lines only slightly slower
                const mult = 0.86 + t * (slowestLineMult - 0.86)
                return charDuration * mult
            }

            if (mainChars.length) {
                const positions = mainChars.map(measure)
                const minX = Math.min(...positions.map((p) => p.x))
                const minY = Math.min(...positions.map((p) => p.y))
                const lineIndices = positions.map((p) =>
                    Math.max(0, Math.round((p.y - minY) / lineH))
                )
                const lineCount = Math.max(...lineIndices) + 1

                const scores = positions.map((pos, idx) => {
                    const col = Math.max(0, (pos.x - minX) / colW)
                    const line = lineIndices[idx]
                    // Soft left bias + scatter; lower lines start earlier in the window
                    return col * 0.9 + line * 0.45 + Math.random() * 5.5
                })
                const minScore = Math.min(...scores)
                const maxScore = Math.max(...scores)
                const scoreRange = maxScore - minScore || 1

                mainChars.forEach((el, idx) => {
                    const t = (scores[idx] - minScore) / scoreRange
                    const shaped = 1 - (1 - t) ** 1.55
                    const delay = minDelay + shaped * (maxDelay - minDelay)
                    const duration = lineDuration(lineIndices[idx], lineCount)
                    el.style.setProperty('--hero-intro-char-duration', `${duration.toFixed(3)}s`)
                    el.style.setProperty('--hero-intro-char-delay', `${delay.toFixed(3)}s`)
                })
            }

            // ":)" pops in after the CTA — a small beat later, like an afterthought
            afterthoughtChars.forEach((el, idx) => {
                const delay = ctaEnd + 0.22 + idx * 0.1 + Math.random() * 0.05
                el.style.removeProperty('--hero-intro-char-duration')
                el.style.setProperty('--hero-intro-char-delay', `${delay.toFixed(3)}s`)
            })
        },
        readElementTranslateX(el) {
            const t = getComputedStyle(el).transform
            if (!t || t === 'none') return 0
            try {
                return new DOMMatrixReadOnly(t).m41
            } catch {
                return 0
            }
        },
        syncAboutLocationTextClip() {
            const wrap = this.$el?.querySelector('.about-location-text-wrap')
            const text = wrap?.querySelector(
                '.about-location-text:not(.about-location-text--glow):not(.about-location-text--soft):not(.about-location-text--white)'
            )
            const location = this.$el?.querySelector('.about-location')
            const photo = this.$el?.querySelector('.about-photo-column')
            if (!wrap || !text || !location || !photo) return

            if (!window.matchMedia('(max-width: 600px)').matches) {
                wrap.style.removeProperty('--about-location-split')
                wrap.style.removeProperty('--about-location-split-px')
                location.style.removeProperty('--about-location-overlap-nudge')
                return
            }

            const textRect = text.getBoundingClientRect()
            const photoRect = photo.getBoundingClientRect()
            if (textRect.width <= 0) return

            const currentNudge =
                parseFloat(getComputedStyle(location).getPropertyValue('--about-location-overlap-nudge')) || 0
            // Strip fly-in translates so nudge targets the resting layout, not mid-animation poses
            const locTx = this.readElementTranslateX(location)
            const photoTx = this.readElementTranslateX(photo)

            let nudge = 0
            // Shift location right when needed so overlap reaches at least mid-"o" in Barcelona
            const label = text.textContent || ''
            const oIndex = label.indexOf('Barcelona') + 6
            const textNode = text.firstChild
            if (textNode && textNode.nodeType === Node.TEXT_NODE && oIndex >= 6 && oIndex < label.length) {
                const range = document.createRange()
                range.setStart(textNode, oIndex)
                range.setEnd(textNode, oIndex + 1)
                const oRect = range.getBoundingClientRect()
                range.detach?.()
                if (oRect.width > 0) {
                    const midOResting = oRect.left + oRect.width / 2 - locTx - currentNudge
                    const photoLeftResting = photoRect.left - photoTx
                    if (photoLeftResting > midOResting) {
                        nudge = photoLeftResting - midOResting
                    }
                }
            }

            if (nudge > 0) {
                location.style.setProperty('--about-location-overlap-nudge', `${nudge}px`)
            } else {
                location.style.removeProperty('--about-location-overlap-nudge')
            }

            // Color split follows the live (possibly mid-flight) overlap
            const splitPx = Math.min(textRect.width, Math.max(0, photoRect.left - textRect.left))
            const splitPct = (splitPx / textRect.width) * 100
            wrap.style.setProperty('--about-location-split', `${splitPct}%`)
            wrap.style.setProperty('--about-location-split-px', `${splitPx}px`)
        },
        pollAboutLocationTextClip() {
            this.stopAboutLocationTextClipPoll()
            const tick = () => {
                this.syncAboutLocationTextClip()
                if (this.aboutRevealed && !this.aboutEntranceDone) {
                    this.aboutLocationClipRaf = requestAnimationFrame(tick)
                } else {
                    this.aboutLocationClipRaf = null
                }
            }
            tick()
        },
        stopAboutLocationTextClipPoll() {
            if (this.aboutLocationClipRaf != null) {
                cancelAnimationFrame(this.aboutLocationClipRaf)
                this.aboutLocationClipRaf = null
            }
        },
        syncHeroDecorHeight() {
            const decor = this.$el?.querySelector('.hero-decor')
            const heroIntro = this.$el?.querySelector('.hero-intro')
            const workFirstImage = this.$el?.querySelector('#work-first .project-image-link')
            if (!decor || !heroIntro || !workFirstImage) return

            if (window.getComputedStyle(decor).display === 'none') return

            const isWide = window.matchMedia('(min-width: 998px)').matches
            const wrap = decor.parentElement
            const imageTop = workFirstImage.getBoundingClientRect().top
            const offset =
                parseFloat(getComputedStyle(decor).getPropertyValue('--hero-decor-bottom-offset')) || 0

            let clipTop

            if (isWide) {
                const introAnchor = heroIntro.querySelector('.hero-intro-em') ?? heroIntro
                const introTop = introAnchor.getBoundingClientRect().top
                const wrapTop = wrap.getBoundingClientRect().top
                const topOffset =
                    parseFloat(getComputedStyle(decor).getPropertyValue('--hero-decor-top-offset')) || 0
                clipTop = introTop + topOffset
                decor.style.top = `${Math.round(clipTop - wrapTop)}px`
            } else {
                decor.style.removeProperty('top')
                clipTop = decor.getBoundingClientRect().top
            }

            const height = Math.round(imageTop - clipTop) + offset

            if (height > 0) {
                decor.style.setProperty('--hero-decor-height', `${height}px`)
            }
        },
    },
}
</script>

<style scoped>
.portfolio-page {
    --brand: #000aaa;
    --brand-hover: #1a2bff;
    --brand-active: #000444;
    --text: #2c2c2c;
    --muted: #757575;
    --title: #4d4d4d;
    --about-muted: #928a81;
    --about-location-color: #928a81;
    --about-location-icon-fill: #b9b4ae;
    --about-bg: #f4f2f1;
    --page-max: 1454px;
    /* Cap pad at 100px; only drop toward 39px once content is 776px (offset slide exhausted) */
    --page-pad: max(39px, min(100px, calc((100vw - 776px) / 2)));
    --project-w: min(776px, 100%);
    --project-w-wide: min(876px, 100%);
    --project-stack-gap: clamp(120px, calc(120px + (100vw - 997px) * 30 / 457), 150px);
    --top-bar-height: 120px;
    --fly-distance: min(42vw, 360px);
    --fly-duration: 1.25s;
    --fly-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --cta-fly-delay: 0.08s;
    --cta-fly-duration: var(--fly-duration);

    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100vh;
    background: #fff;
    color: var(--text);
    overflow-x: hidden;
    overflow-x: clip;
}

.portfolio-fly {
    opacity: 0;
    will-change: transform, opacity;
}

.portfolio-fly--from-right {
    transform: translate3d(var(--fly-distance), 0, 0);
}

.portfolio-fly--from-left {
    transform: translate3d(calc(-1 * var(--fly-distance)), 0, 0);
}

.portfolio-page--reveal .project--featured.portfolio-fly--from-right,
.portfolio-page--reveal .project--upcoming:not(.project--offset).portfolio-fly--from-right {
    animation: portfolio-fly-from-right var(--fly-duration) var(--fly-ease) 0.08s both;
}

/* Squiggle snappier; paragraph a touch slower — not in lockstep */
.portfolio-page--reveal .hero-decor.portfolio-fly--from-right {
    animation: portfolio-fly-from-right 1.05s var(--fly-ease) 0.08s both;
}

.portfolio-page--reveal .hero-intro.portfolio-fly--from-right {
    animation: portfolio-fly-from-right 1.55s var(--fly-ease) 0.08s both;
}

.portfolio-page--reveal .cta-button.portfolio-fly--from-left,
.portfolio-page--reveal .project--offset.portfolio-fly--from-left {
    animation: portfolio-fly-from-left var(--fly-duration) var(--fly-ease) 0.08s both;
}

.portfolio-page--reveal .cta-button.portfolio-fly--from-left {
    animation: portfolio-fly-from-left var(--cta-fly-duration) var(--fly-ease) var(--cta-fly-delay)
        both;
}

/* Lock hero/work fly-ins after first play — resize must not restart them */
.portfolio-page--settled .portfolio-main .portfolio-fly:not(.project) {
    opacity: 1;
    transform: none;
    animation: none !important;
    will-change: auto;
}

.portfolio-page--settled .portfolio-main .project.portfolio-fly {
    transform: none;
    animation: none !important;
    will-change: auto;
    opacity: 1;
}

.portfolio-page--settled .hero-intro--chars .hero-intro-char {
    opacity: 1;
    transform: none;
    animation: none !important;
    will-change: auto;
}

.portfolio-page--settled .hero-decor-line,
.portfolio-page--settled .hero-decor-line.hero-decor-line--settled {
    clip-path: inset(0);
    transition: transform var(--hero-line-return-duration) ease;
}

.about-heading.portfolio-fly--from-left {
    --fly-distance: min(56vw, 480px);
}

.about--reveal .about-line.portfolio-fly--from-right {
    animation: portfolio-fly-from-right 0.95s var(--fly-ease) -0.12s both;
}

.about--reveal .about-heading.portfolio-fly--from-left {
    animation: portfolio-fly-from-left 0.95s var(--fly-ease) -0.12s both;
}

.about--reveal .about-location.portfolio-fly--from-right {
    animation: portfolio-fly-from-right var(--fly-duration) var(--fly-ease) 0.12s both;
}

.about--reveal .about-bio.portfolio-fly--from-left {
    animation: portfolio-fly-from-left var(--fly-duration) var(--fly-ease) 0.16s both;
}

.about--reveal .about-actions.portfolio-fly--from-left {
    animation: portfolio-fly-from-left var(--fly-duration) var(--fly-ease) 0.2s both;
}

.about--reveal .about-photo-column.portfolio-fly--from-left {
    animation: portfolio-fly-from-left var(--fly-duration) var(--fly-ease) 0.18s both;
}

/* Lock final pose so later layout syncs can't replay the entrance */
.about--settled .portfolio-fly {
    opacity: 1;
    transform: none;
    animation: none !important;
    will-change: auto;
}

@media (prefers-reduced-motion: reduce) {
    .portfolio-fly,
    .portfolio-page--reveal .portfolio-fly,
    .about--reveal .portfolio-fly,
    .hero-intro--chars .hero-intro-char,
    .portfolio-page--reveal .hero-intro--chars .hero-intro-char {
        opacity: 1;
        transform: none;
        animation: none;
        will-change: auto;
    }

    .hero-decor-line,
    .portfolio-page--reveal .hero-decor-line {
        clip-path: none;
        transition: transform var(--hero-line-return-duration) ease;
    }
}

@keyframes portfolio-fly-from-right {
    from {
        opacity: 0;
        transform: translate3d(var(--fly-distance, 220px), 0, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes portfolio-fly-from-left {
    from {
        opacity: 0;
        transform: translate3d(calc(-1 * var(--fly-distance, 220px)), 0, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

.loading-splash {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    transition: background-color 0.32s ease;
}

.loading-splash--handoff {
    background-color: transparent;
    pointer-events: none;
}

.loading-splash-frame {
    width: 84px;
    height: 84px;
    display: block;
    transform-origin: center center;
}

.loading-splash-frame--rotating {
    transition: transform 800ms linear;
}

.loading-splash-handoff-logo {
    position: fixed;
    z-index: 10001;
    display: block;
    transform-origin: top left;
    will-change: transform;
    pointer-events: none;
}

.portfolio-content--logo-handoff :deep(.logo) {
    opacity: 0;
}

:global(html.portfolio-booting),
:global(html.portfolio-booting body) {
    overflow: hidden;
}

.portfolio-main {
    position: relative;
    width: 100%;
    max-width: var(--page-max);
    margin: 0 auto;
    padding: var(--top-bar-height) var(--page-pad) 0;
    box-sizing: border-box;
}

.hero {
    position: relative;
    z-index: 1;
    --hero-cta-gap: 110px;
    --hero-cta-height: 57px;
    --hero-squiggle-left: 121px;
    --hero-squiggle-width: 56px;
    --hero-cta-width: 233px;
    /* 746px from the left edge of the first project image (content left) */
    --hero-cta-left: 786px;
    /* Text bottom → first image = cta gap + cta height + CTA→image margin */
    --hero-text-to-image: 387px;
    margin-bottom: calc(var(--hero-text-to-image) - var(--hero-cta-gap) - var(--hero-cta-height));
}

.hero-intro-wrap {
    --hero-intro-left: calc(var(--hero-squiggle-left) + var(--hero-squiggle-width) + 23px);
    position: relative;
    max-width: min(850px, calc(100% - var(--hero-intro-left)));
    margin: 110px 0 0
        var(--hero-intro-left);
}

.hero-decor {
    --hero-line-lift: 100px;
    --hero-line-bounce-1: 2.2*30px;
    --hero-line-bounce-2: 2.2*12.75px;
    --hero-line-bounce-3: 2.2*5.25px;
    --hero-line-bounce-4: 2.2*2.25px;
    --hero-line-bounce-duration: 1.2s;
    --hero-line-return-duration: 0.4s;
    --hero-decor-height: 487px;
    --hero-decor-bottom-offset: 50px;
    --hero-decor-top-offset: 7px;
    --hero-decor-line-natural-height: 818px;
    position: absolute;
    top: 7px;
    right: auto;
    left: calc(var(--hero-squiggle-left) - var(--hero-intro-left));
    z-index: 0;
    width: var(--hero-squiggle-width);
    height: var(--hero-decor-height);
    overflow: hidden;
    pointer-events: none;
}

.hero-decor picture {
    display: contents;
}

.hero-decor-line {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 56px;
    min-width: 56px;
    max-width: 56px;
    height: var(--hero-decor-line-natural-height);
    min-height: var(--hero-decor-line-natural-height);
    object-fit: none;
    object-position: left bottom;
    transform: translateY(0);
    /* Hide the bottom knot so the shaft reads as a straight line while flying in */
    clip-path: inset(0 0 45px 0);
    transition: transform var(--hero-line-return-duration) ease;
}

.portfolio-page--reveal .hero-decor-line {
    clip-path: inset(0);
    transition:
        transform var(--hero-line-return-duration) ease,
        clip-path 0.7s cubic-bezier(0.22, 1, 0.36, 1) 1.15s;
}

/* After entrance: lock knot visible with no clip-path transition (avoids replay on resize) */
.portfolio-page--reveal .hero-decor-line.hero-decor-line--settled {
    clip-path: inset(0);
    transition: transform var(--hero-line-return-duration) ease;
}

/* While viewport/layout is syncing, hide the knot so it can’t flash in the CTA gap */
.hero-decor.hero-decor--resizing .hero-decor-line {
    clip-path: inset(0 0 45px 0);
    transition: transform var(--hero-line-return-duration) ease;
}

/* Mobile / breakpoint handoff: invisible but still layout-measurable */
.hero-decor.hero-decor--hidden {
    visibility: hidden;
    opacity: 0;
}

.hero-decor-line--bouncing {
    transition: none;
    animation: hero-line-bounce-up var(--hero-line-bounce-duration) forwards;
}

.hero-decor-line--up {
    transform: translateY(calc(-1 * var(--hero-line-lift)));
    transition: none;
}

@keyframes hero-line-bounce-up {
    0% {
        transform: translateY(0);
    }

    22% {
        transform: translateY(calc(-1 * var(--hero-line-lift) - var(--hero-line-bounce-1)));
    }

    38% {
        transform: translateY(calc(-1 * var(--hero-line-lift)));
    }

    49% {
        transform: translateY(calc(-1 * var(--hero-line-lift) - var(--hero-line-bounce-2)));
    }

    60% {
        transform: translateY(calc(-1 * var(--hero-line-lift)));
    }

    67% {
        transform: translateY(calc(-1 * var(--hero-line-lift) - var(--hero-line-bounce-3)));
    }

    73% {
        transform: translateY(calc(-1 * var(--hero-line-lift)));
    }

    78% {
        transform: translateY(calc(-1 * var(--hero-line-lift) - var(--hero-line-bounce-4)));
    }

    100% {
        transform: translateY(calc(-1 * var(--hero-line-lift)));
    }
}

.hero-intro {
    position: relative;
    z-index: 1;
    margin: 0;
    font-family: 'Fira Code', monospace;
    font-size: 22px;
    font-style: normal;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 33px;
    letter-spacing: -0.02em;
    color: var(--muted);
    font-synthesis: none;
}

.hero-intro-chars {
    display: inline;
}

.hero-intro-word {
    display: inline-block;
    white-space: nowrap;
}

.hero-intro-char {
    display: inline-block;
}

.hero-intro-word-space {
    white-space: pre;
}

.hero-intro-em {
    color: var(--brand);
    font-weight: calc(600 * var(--font-weight-scale));
}

.hero-intro-em--keep {
    white-space: nowrap;
}

.hero-intro-lead {
    display: inline;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: var(--hero-cta-gap);
    margin-left: min(
        var(--hero-cta-left),
        max(0px, calc(100% - var(--hero-cta-width)))
    );
    padding: 12px 24px;
    width: var(--hero-cta-width);
    max-width: 100%;
    min-width: 0;
    height: var(--hero-cta-height);
    border-radius: 100px;
    background: var(--brand);
    font-family: 'Fira Code', monospace;
    font-size: 22px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 33px;
    letter-spacing: -0.02em;
    color: #fff;
    text-decoration: none;
    box-sizing: border-box;
    transition: background 0.2s ease;
}

.cta-button:hover {
    background: var(--brand-hover);
}

.cta-button:active {
    background: var(--brand-active);
    transition: none;
}

.work {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
}

.project {
    position: relative;
    z-index: 1;
    width: var(--project-w);
    max-width: 100%;
    min-width: 0;
}

.project--featured {
    width: var(--project-w);
    max-width: 100%;
    scroll-margin-top: var(--top-bar-height);
}

.project--offset {
    width: var(--project-w);
    max-width: 100%;
    margin-top: var(--project-stack-gap);
    margin-left: auto;
}

.project:last-child {
    width: var(--project-w-wide);
    max-width: 100%;
    margin-top: var(--project-stack-gap);
}

.project-image-link {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    text-decoration: none;
}

.project-image-wrap {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
}

.project-image-link picture {
    display: block;
    width: 100%;
}

.project-image {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 12px 12px 12px 12px;
    background: #fff;
    transition: border-radius 0.45s ease;
}

/* Touch: press feedback — clears on release so the radius can ease back */
.project:not(.project--upcoming):active .project-image {
    border-radius: 700px 700px 20px 20px;
}

/* Pointer devices: hover / focus (avoid sticky hover on touch) */
@media (hover: hover) and (pointer: fine) {
    .project:not(.project--upcoming):hover .project-image,
    .project:not(.project--upcoming):focus-within .project-image {
        border-radius: 700px 700px 20px 20px;
    }
}

.project-upcoming-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
}

.project--upcoming:hover .project-upcoming-overlay,
.project--upcoming:focus-within .project-upcoming-overlay {
    opacity: 1;
}

.project-upcoming-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 152px;
    height: 27px;
    background: rgba(255, 255, 255, 0.1);
    font-family: 'Fira Code', monospace;
    font-style: normal;
    font-weight: calc(500 * var(--font-weight-scale));
    font-size: 18px;
    line-height: 27px;
    letter-spacing: -0.02em;
    color: #757575;
}

.project--upcoming {
    cursor: default;
}

.project--upcoming .project-title {
    color: var(--title);
}

.project-caption {
    position: relative;
    margin-top: 30px;
}

.project-caption-header {
    display: flex;
    align-items: flex-start;
    gap: 0;
    padding-top: 2px;
}

.project-title {
    flex: 0 1 520px;
    min-width: 0;
    margin: 0;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 18px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 27px;
    color: var(--title);
    transition: color 0.25s ease;
}

.project-title-link {
    color: inherit;
    text-decoration: none;
    /* Match thumbnail border-radius timing */
    transition: color 0.45s ease;
}

/* Touch / press: blue while held, eases back on release (same as thumbnail) */
.project:not(.project--upcoming):active .project-title-link {
    color: var(--brand);
}

/* Pointer devices: hover / focus */
@media (hover: hover) and (pointer: fine) {
    .project:hover .project-title-link,
    .project:focus-within .project-title-link {
        color: var(--brand);
    }
}

.project-description {
    margin: 16px 0 0;
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 25px;
    letter-spacing: -0.02em;
    color: var(--muted);
}

.project-year {
    flex-shrink: 0;
    margin-left: auto;
    font-family: 'Fira Code', monospace;
    font-size: 18px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 27px;
    letter-spacing: -0.02em;
    color: var(--muted);
}

.about {
    position: relative;
    width: 100%;
    --about-gap: 340px;
    --about-image-text-gap: clamp(32px, calc(32px + (100vw - 997px) * 32 / 457), 64px);
    --about-bottom-pad: clamp(180px, calc(180px + (100vw - 997px) * 100 / 457), 280px);
    --about-top-pad: 80px;
    margin-top: var(--about-gap);
    padding: var(--about-top-pad) 0 var(--about-bottom-pad);
    background: var(--about-bg);
    box-sizing: border-box;
    overflow: visible;
    scroll-margin-top: var(--top-bar-height);
}

#about-bio {
    scroll-margin-top: var(--top-bar-height);
}

.about-inner {
    display: grid;
    grid-template-columns: clamp(345px, calc(345px + (100vw - 997px) * 46 / 457), 391px) 1fr;
    gap: 0;
    max-width: clamp(800px, calc(800px + (100vw - 997px) * 157 / 457), 957px);
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    align-items: start;
}

.about-photo-column {
    display: flex;
    flex-direction: column;
    padding-left: clamp(32px, calc(32px + (100vw - 997px) * 2 / 457), 34px);
    box-sizing: border-box;
}

.about-line {
    position: absolute;
    left: calc((100vw - clamp(800px, calc(800px + (100vw - 997px) * 157 / 457), 957px)) / 2 + clamp(0px, calc((100vw - 997px) * 2 / 457), 2px));
    top: calc(140px - var(--about-gap));
    z-index: 1;
    display: block;
    width: 0;
    height: 400px;
    border-left: 2px solid var(--brand);
    pointer-events: none;
}

.about-photo {
    position: relative;
    z-index: 1;
    width: clamp(281px, calc(281px + (100vw - 997px) * 12 / 457), 293px);
    height: clamp(402px, calc(402px + (100vw - 997px) * 18 / 457), 420px);
    border-radius: 12px;
    object-fit: cover;
    display: block;
}

.about-photo--placeholder {
    background: #e8e4e1;
}

.about-location {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    width: auto;
    margin: 0 0 39px;
    padding: 0;
    box-sizing: border-box;
    flex: none;
}

.about-location-icon-wrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    flex: none;
}

.about-location-icon {
    display: block;
    width: 13px;
    height: 20px;
    flex: none;
}

.about-location-icon :deep(path) {
    fill: var(--about-location-icon-fill);
}

.about-location-text-wrap {
    position: relative;
    flex: none;
}

.about-location-text {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 27px;
    color: var(--about-location-color);
    flex: none;
}

.about-location-text-white-stack,
.about-location-text--glow,
.about-location-text--soft,
.about-location-text--white {
    display: none;
}

.about-text-column {
    padding-top: 100px;
}

.about-intro {
    display: contents;
}

.about-heading {
    margin: 0 0 39px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 27px;
    letter-spacing: -0.02em;
    color: #928a81;
}

.about-bio {
    margin: 0;
    max-width: clamp(455px, calc(455px + (100vw - 997px) * 37 / 457), 492px);
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 26px;
    letter-spacing: -0.02em;
    color: var(--text);
}

.about-link {
    color: var(--brand);
}

.about-ball {
    --about-ball-size: 49px;
    --about-ball-height: 46px;
    position: absolute;
    left: var(--about-ball-x, 50%);
    bottom: 0;
    z-index: 5;
    width: var(--about-ball-size);
    height: var(--about-ball-height);
    display: block;
    pointer-events: none;
    opacity: 0;
    transform: translate3d(0, -1100px, 0) rotate(0deg);
    transform-origin: center center;
}

.about-ball--dropped {
    opacity: 1;
}

.about-actions {
    display: none;
}

/* ≥1454px: Final content artboard spacing */
@media (min-width: 1454px) {
    .hero-intro-wrap {
        max-width: 850px;
        margin: 110px 0 0 var(--hero-intro-left);
    }

    .hero-decor {
        top: 7px;
    }

    .cta-button {
        margin-top: var(--hero-cta-gap);
        width: var(--hero-cta-width);
        min-width: 0;
        height: var(--hero-cta-height);
    }

    .work {
        gap: 0;
    }

    .portfolio-page {
        --project-w: 776px;
        --project-w-wide: 876px;
    }

    .project--offset,
    .project:last-child {
        margin-top: 150px;
    }

    .project-description {
        margin-top: 16px;
    }

    .about {
        --about-gap: 340px;
        --about-bottom-pad: 280px;
        margin-top: 340px;
        padding: var(--about-top-pad) 0 var(--about-bottom-pad);
    }

    .about-inner {
        grid-template-columns: 391px 1fr;
        max-width: 957px;
    }

    .about-photo-column {
        padding-left: 34px;
        box-sizing: border-box;
    }

    .about-photo,
    .about-photo--placeholder {
        width: 293px;
        height: 420px;
    }

    .about-text-column {
        padding-top: 100px;
    }

    .about-heading {
        margin: 0 0 39px;
    }

    .about-bio {
        max-width: 492px;
        margin-left: 0;
    }

    .about-location {
        margin: 0 0 39px;
    }
}

/* ≤997px: 997px artboard lock before tablet layout */
@media (max-width: 997px) {
    .portfolio-page {
        --hero-logo-gap: 118px;
        /* Logo sits above the bar bottom: (120px bar − 50px nav block) / 2 */
        --top-bar-logo-inset: 35px;
    }

    .hero {
        margin-bottom: 220px;
    }

    .hero-intro-wrap {
        max-width: 100%;
        margin: var(--hero-logo-gap) 0 0;
    }

    .hero-decor {
        top: calc(100% + var(--hero-cta-gap));
        right: auto;
        left: 61px;
    }

    .cta-button {
        margin-left: min(615px, max(0px, calc(100% - 233px)));
    }

    .project--offset {
        margin-top: 120px;
        margin-left: 0;
    }

    .project:last-child {
        margin-top: 120px;
    }

    .project-description {
        line-height: 25px;
    }

    .about {
        --about-gap: 340px;
        --about-bottom-pad: 180px;
        margin-top: 340px;
        padding: var(--about-top-pad) 0 var(--about-bottom-pad);
    }

    .about-inner {
        grid-template-columns: 345px 1fr;
        max-width: 800px;
        padding: 0;
    }

    .about-photo-column {
        padding-left: 32px;
    }

    .about-line {
        left: calc((100vw - 800px) / 2);
    }

    .about-photo,
    .about-photo--placeholder {
        width: 281px;
        height: 402px;
    }

    .about-text-column {
        padding-top: 100px;
        padding-right: var(--about-image-text-gap);
    }

    .about-heading {
        margin: 0 0 32px;
    }

    .about-bio {
        max-width: 455px;
        margin-left: 0;
        line-height: 25px;
    }
}

@media (max-width: 600px) {
    .portfolio-page {
        --page-pad: 20px;
        --top-bar-height: 86px;
        --hero-logo-gap: 74px;
        --project-w: 100%;
        --project-w-wide: 100%;
        /* Logo top 20px + 50.4px tall (20% bigger) in the 86px bar */
        --top-bar-logo-inset: 20px;
        /* Same gap: CTA → first image, and last project text → about */
        --mobile-block-gap: calc(2 * 84px - 25px - 20px - 15px);
        /* Longer CTA window so letter assemble has room and still lands together */
        --cta-fly-delay: 0.1s;
        --cta-fly-duration: 2.05s;
    }

    .portfolio-content {
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }

    .portfolio-main {
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }

    .hero {
        --hero-cta-gap: 84px;
        margin-bottom: calc(2 * var(--mobile-block-gap));
        min-height: 0;
    }

    .portfolio-main {
        padding: 0 var(--page-pad) 0;
        box-sizing: border-box;
    }

    .project--featured,
    #about {
        scroll-margin-top: 0;
    }

    .hero-intro-wrap {
        max-width: 100%;
        width: 100%;
        margin: var(--hero-logo-gap) 0 0;
    }

    .hero-intro {
        max-width: 100%;
        font-size: 22px;
        line-height: 33px;
    }

    /*
     * Letter cascade: wide stagger so glyphs trickle in like an assemble,
     * last letter still landing with the CTA.
     */
    .hero-intro.hero-intro--chars.portfolio-fly {
        --hero-intro-char-duration: 0.85s;
        opacity: 1;
        transform: none;
        will-change: auto;
    }

    .portfolio-page--reveal .hero-intro.hero-intro--chars.portfolio-fly--from-right {
        animation: none;
        opacity: 1;
        transform: none;
    }

    .hero-intro--chars .hero-intro-char {
        --hero-intro-char-delay: 0.04s;
        opacity: 0;
        transform: translate3d(var(--fly-distance), 0, 0);
        will-change: transform, opacity;
    }

    .portfolio-page--reveal .hero-intro--chars .hero-intro-char {
        animation: portfolio-fly-from-right var(--hero-intro-char-duration, 0.85s) var(--fly-ease)
            var(--hero-intro-char-delay) both;
    }

    .cta-button {
        --hero-cta-width: 225px;
        width: var(--hero-cta-width);
        height: 54px;
        min-height: 54px;
        min-width: var(--hero-cta-width);
        margin-left: max(0px, calc(100% - var(--hero-cta-width)));
        padding: 12px 24px;
        font-size: 20px;
        line-height: 30px;
        white-space: nowrap;
    }

    .work {
        gap: 0;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        align-items: stretch;
    }

    /* Mobile: no fly-in; quick fade when each case study scrolls into view */
    .portfolio-page--reveal .project.portfolio-fly,
    .portfolio-page--settled .portfolio-main .project.portfolio-fly {
        opacity: 0;
        transform: none;
        animation: none !important;
        transition: opacity 0.55s ease-out;
        will-change: opacity;
    }

    .portfolio-page--reveal .project.portfolio-fly.project--in-view,
    .portfolio-page--settled .portfolio-main .project.portfolio-fly.project--in-view {
        opacity: 1;
        will-change: auto;
    }

    .project,
    .project--featured,
    .project--offset,
    .project:last-child {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        margin-top: 0;
        margin-left: 0;
    }

    .project + .project {
        margin-top: 80px;
    }

    .project-image-link,
    .project-image-wrap {
        width: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        border-radius: 12px;
        transition: border-radius 0.45s ease;
    }

    .project:not(.project--upcoming):active .project-image-link,
    .project:not(.project--upcoming):active .project-image-wrap,
    .project--press-expand .project-image-link,
    .project--press-expand .project-image-wrap,
    .project--press-expand .project-image {
        border-radius: 700px 700px 20px 20px;
    }

    .project-image {
        width: 100%;
        max-width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
    }

    .project-caption {
        width: 100%;
        max-width: 100%;
        margin-top: 28px;
    }

    .project-caption-header {
        padding-top: 0;
        gap: 0;
        width: 100%;
    }

    .project-title {
        flex: 1 1 auto;
        max-width: none;
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 18px;
        font-weight: calc(500 * var(--font-weight-scale));
        line-height: 27px;
        color: #4d4d4d;
    }

    /* Thumbnail only — title tap must not navigate */
    .project-title-link {
        pointer-events: none;
        cursor: default;
    }

    .project-description {
        margin-top: 20px;
        max-width: 100%;
        font-family: 'Fira Code', monospace;
        font-size: 16px;
        font-weight: calc(400 * var(--font-weight-scale));
        line-height: 25px;
        letter-spacing: -0.02em;
        color: #757575;
    }

    .project-year {
        margin-left: auto;
        flex-shrink: 0;
        font-family: 'Fira Code', monospace;
        font-size: 18px;
        font-weight: calc(500 * var(--font-weight-scale));
        line-height: 27px;
        letter-spacing: -0.02em;
        color: #757575;
    }

    .about {
        margin-top: calc(2 * var(--mobile-block-gap));
        --about-bottom-pad: 326px;
        --about-photo-h: 288px;
        --about-stack-gap: 50px;
        --about-heading-location-gap: 32px;
        --about-content-shift: 50px;
        padding: var(--about-top-pad) 0 var(--about-bottom-pad);
    }

    .about-inner {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
        --about-side-pad: var(--page-pad);
        padding: 0 var(--about-side-pad);
    }

    .about-line {
        display: none;
    }

    /* Photo: right-aligned, behind heading/location */
    .about-photo-column {
        display: block;
        position: absolute;
        top: var(--about-content-shift);
        right: var(--about-side-pad);
        z-index: 0;
        width: 201px;
        height: var(--about-photo-h);
        margin: 0;
        padding: 0;
    }

    .about-photo,
    .about-photo--placeholder {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .about-text-column {
        display: block;
        position: relative;
        z-index: 1;
        padding-top: 0;
    }

    /* Heading + location overlay the photo; bio stays below it */
    .about-intro {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        max-width: calc(100% - 100px);
    }

    .about-heading {
        margin: 0 0 var(--about-heading-location-gap);
        max-width: 100%;
    }

    .about-location {
        box-sizing: border-box;
        width: auto;
        max-width: 100%;
        margin: 0;
        padding: 0;
        top: 10px;
        left: calc(5px + var(--about-location-overlap-nudge, 0px));
    }

    .about-location-text-wrap {
        --about-location-white-scale: 1.07;
    }

    .about-location-text:not(.about-location-text--glow):not(.about-location-text--soft):not(.about-location-text--white) {
        position: relative;
        z-index: 1;
        /* Gray only on the left; white comes from the scaled photo-side stack */
        background-image: linear-gradient(
            to right,
            var(--about-location-color) 0,
            var(--about-location-color) var(--about-location-split, 100%),
            transparent var(--about-location-split, 100%),
            transparent 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    }

    /*
     * White stack: clipped to the photo side, then scaled from the photo edge
     * so every overlapping glyph (not just a cut letter) enlarges together.
     * Top/right/bottom padding lets soft blur + edge glow bleed; left stays hard at the photo edge.
     */
    .about-location-text-white-stack {
        --about-location-glow-pad: 12px;
        display: block;
        position: absolute;
        left: var(--about-location-split-px, 100%);
        top: calc(-1 * var(--about-location-glow-pad));
        z-index: 2;
        overflow: hidden;
        padding: var(--about-location-glow-pad) var(--about-location-glow-pad) var(--about-location-glow-pad) 0;
        box-sizing: content-box;
        transform: scale(var(--about-location-white-scale));
        transform-origin: left center;
        pointer-events: none;
        user-select: none;
    }

    .about-location-text-white-inner {
        display: block;
        position: relative;
        margin-left: calc(-1 * var(--about-location-split-px, 0px));
    }

    .about-location-text--glow,
    .about-location-text--soft,
    .about-location-text--white {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        white-space: nowrap;
    }

    .about-location-text--glow {
        z-index: 0;
        color: transparent;
        -webkit-text-fill-color: transparent;
        /* Near-edge → wall wash (#CDC6BE): darker core fades into photo light */
        text-shadow:
            0 0 0.5px rgba(130, 122, 114, 0.95),
            0 0 1.25px rgba(148, 140, 132, 0.8),
            0 0 2.5px rgba(163, 156, 148, 0.6),
            0 0 4px rgba(205, 198, 190, 0.45),
            0 0 7px rgba(205, 198, 190, 0.28),
            0 0 11px rgba(205, 198, 190, 0.14);
    }

    .about-location-text--soft {
        z-index: 1;
        color: #fffef2;
        -webkit-text-fill-color: #fffef2;
        /* Steep white falloff: softens the glyph edge, stays inside the dark rim */
        filter: blur(0.28px);
        text-shadow:
            0 0 0.2px rgba(255, 254, 242, 1),
            0 0 0.45px rgba(255, 254, 242, 0.65),
            0 0 0.7px rgba(255, 254, 242, 0.15);
    }

    .about-location-text--white {
        z-index: 2;
        position: relative;
        color: #fff;
        -webkit-text-fill-color: #fff;
    }

    .about-location-icon :deep(path) {
        fill: var(--about-location-icon-fill);
    }

    /* Original spot: just below the photo */
    .about-bio {
        margin-top: calc(var(--about-content-shift) + var(--about-photo-h) + var(--about-stack-gap));
        max-width: 100%;
        font-size: 16px;
        line-height: 25px;
    }

    .about-actions {
        display: flex;
        gap: 31px;
        margin-top: 96px;
        padding-left: 0;
    }

    .about-ball {
        left: auto;
        right: 0;
    }

    .about-action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 54px;
        padding: 12px 24px;
        border-radius: 60px;
        background: var(--brand);
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 20px;
        font-weight: calc(500 * var(--font-weight-scale));
        line-height: 30px;
        color: #fff;
        text-decoration: none;
        box-sizing: border-box;
    }

    .about-action-btn:active {
        background: var(--brand-active);
    }

}
</style>

<style>
/* Unscoped so the keyframe name isn’t rewritten away from the animation. */
.about-ball.about-ball--dropped {
    animation: about-ball-fall 1.75s linear forwards;
}

@keyframes about-ball-fall {
    /* Fall + 4 decaying bounces left, rolling counter-clockwise */
    0% {
        opacity: 1;
        transform: translate3d(0, -1100px, 0) rotate(0deg);
        animation-timing-function: cubic-bezier(0.55, 0.05, 0.8, 0.4);
    }

    /* First impact */
    40% {
        transform: translate3d(0, 0, 0) rotate(-460deg);
        animation-timing-function: ease-out;
    }

    /* Bounce 1 */
    49% {
        transform: translate3d(-15px, -78px, 0) rotate(-510deg);
        animation-timing-function: ease-in;
    }

    57% {
        transform: translate3d(-29px, 0, 0) rotate(-550deg);
        animation-timing-function: ease-out;
    }

    /* Bounce 2 */
    64% {
        transform: translate3d(-39px, -34px, 0) rotate(-585deg);
        animation-timing-function: ease-in;
    }

    71% {
        transform: translate3d(-49px, 0, 0) rotate(-615deg);
        animation-timing-function: ease-out;
    }

    /* Bounce 3 */
    77% {
        transform: translate3d(-55px, -15px, 0) rotate(-640deg);
        animation-timing-function: ease-in;
    }

    83% {
        transform: translate3d(-62px, 0, 0) rotate(-660deg);
        animation-timing-function: ease-out;
    }

    /* Bounce 4 → settle */
    88% {
        transform: translate3d(-66px, -6px, 0) rotate(-675deg);
        animation-timing-function: ease-in;
    }

    93%,
    100% {
        opacity: 1;
        transform: translate3d(-70px, 0, 0) rotate(-690deg);
    }
}
</style>
