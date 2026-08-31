<template>
    <div
        class="portfolio-page"
        :class="{
            'portfolio-page--reveal': pageRevealed,
            'portfolio-page--settled': pageEntranceDone,
            'portfolio-page--hero-cursor': heroCursorHideNative,
        }"
    >
    <Teleport to="body">
        <div
            v-if="heroCursorEligible"
            class="hero-intro-cursor-magnifier"
            :style="heroCursorMagnifierWindowStyle"
            aria-hidden="true"
        >
            <div class="hero-intro-cursor-magnifier__content" :style="heroCursorMagnifierContentStyle">
                <div ref="heroCursorMirrorRoot" class="hero-intro-cursor-magnifier__clone-host" />
            </div>
        </div>
        <span
            v-if="heroCursorEligible"
            class="hero-intro-cursor-ball hero-intro-cursor-ball--glass"
            :class="{
                'hero-intro-cursor-ball--visible': heroCursorGlassVisible,
                'hero-intro-cursor-ball--in-range': heroCursorInRange,
                'hero-intro-cursor-ball--in-range-tight': heroCursorRangeTight,
            }"
            :style="heroCursorGlassStyle"
            aria-hidden="true"
        />
        <span
            v-if="heroCursorEligible"
            class="hero-intro-cursor-ball hero-intro-cursor-ball--dot"
            :class="{
                'hero-intro-cursor-ball--visible': heroCursorVisible,
                'hero-intro-cursor-ball--in-range': heroCursorInRange,
            }"
            :style="heroCursorBallStyle"
            aria-hidden="true"
        />
    </Teleport>
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
                :style="{ transform: loadingSplashFrameTransform }"
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
        <PortfolioTopBar transparent always-transparent nav-hero-align />

        <p
            class="hero-location"
            :class="{ 'hero-location--visible': heroLocationVisible && pageRevealed }"
            aria-label="London / Barcelona"
        >
            <span class="hero-location-icon-wrap" aria-hidden="true">
                <svg class="hero-location-icon" width="13" height="20" viewBox="0 0 13 20" fill="none" aria-hidden="true">
                    <path
                        d="M6.5 0C2.91 0 0 2.91 0 6.5C0 11.38 6.5 20 6.5 20S13 11.38 13 6.5C13 2.91 10.09 0 6.5 0ZM6.5 8.75C5.26 8.75 4.25 7.74 4.25 6.5C4.25 5.26 5.26 4.25 6.5 4.25C7.74 4.25 8.75 5.26 8.75 6.5C8.75 7.74 7.74 8.75 6.5 8.75Z"
                        fill="currentColor"
                    />
                </svg>
            </span>
            <span class="hero-location-text">London / Barcelona</span>
        </p>

        <main class="portfolio-main">
            <section class="hero">
                <div class="hero-intro-wrap">
                    <div class="hero-decor-anchor" aria-hidden="true"></div>
                    <div
                        class="hero-decor portfolio-fly portfolio-fly--from-right"
                        :class="{ 'hero-decor--hidden': heroDecorHidden }"
                        aria-hidden="true"
                    >
                        <picture>
                            <img
                                class="hero-decor-line"
                                :class="{
                                    'hero-decor-line--bouncing': heroLinePhase === 'bouncing',
                                    'hero-decor-line--up': heroLinePhase === 'up',
                                    'hero-decor-line--knot-clipped': heroLineKnotClipped,
                                }"
                                :src="lineAnimationExtended"
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
                            <span class="hero-intro-lead">I'm Tim Justina Yeung, a </span><strong class="hero-intro-em hero-intro-em--keep">Product Designer</strong> with a background in Neuroscience and research.
                            I deeply enjoy understanding complex problems and providing creative solutions
                            <strong class="hero-intro-em hero-intro-em--keep">for people <span class="hero-intro-afterthought"><span class="hero-intro-afterthought-char">:</span><span class="hero-intro-afterthought-char">)</span><span class="hero-intro-afterthought-cursor" aria-hidden="true"></span></span></strong>
                        </template>
                    </p>
                </div>
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
                            alt="IoT Adherence Analytics for Caregivers"
                        />
                    </router-link>
                    <div class="project-caption">
                        <router-link
                            to="/work/DashboardDesign"
                            class="project-caption-link"
                            @pointerdown="onFeaturedProjectPress"
                            @pointerup="onFeaturedProjectPressEnd"
                            @pointercancel="onFeaturedProjectPressEnd"
                            @click="onFeaturedProjectNavigate"
                        >
                            <div class="project-caption-header">
                                <h2 class="project-title">
                                    IoT Adherence Analytics for Caregivers
                                </h2>
                                <span class="project-year">2026</span>
                            </div>
                            <p class="project-description">
                                0‑to‑1 design of a caregiver‑facing dashboard for a primary user's account, helping caregivers better understand their client's needs
                            </p>
                        </router-link>
                    </div>
                </article>

                <article class="project project--offset project--upcoming portfolio-fly portfolio-fly--from-left">
                    <div class="project-image-wrap">
                        <img
                            class="project-image"
                            :src="multiplatformHero"
                            alt="IoT Home Medication Solution"
                        />
                        <div class="project-upcoming-overlay" aria-hidden="true">
                            <span class="project-upcoming-label">Writing up ...</span>
                        </div>
                    </div>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                IoT Home Medication Solution
                            </h2>
                            <span class="project-year">2024</span>
                        </div>
                        <p class="project-description">
                            End-to-end design and redesign of human-machine interface, web and mobile app features of an IoT medication adherence platform
                        </p>
                    </div>
                </article>

                <article
                    id="work-last"
                    class="project project--upcoming portfolio-fly portfolio-fly--from-right"
                    @mouseenter="liftHeroLine"
                    @mouseleave="dropHeroLine"
                    @focusin="liftHeroLine"
                    @focusout="onFeaturedFocusOut"
                >
                    <div class="project-image-wrap">
                        <img
                            class="project-image"
                            :src="marketplaceHero"
                            alt="Art Curation and Marketplace"
                        />
                        <div class="project-upcoming-overlay" aria-hidden="true">
                            <span class="project-upcoming-label">Writing up ...</span>
                        </div>
                    </div>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                Art Curation and Marketplace
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

        <span
            class="about-line-bridge"
            :class="{
                'about-line-bridge--retract': bridgeSyncMode === 'retract',
                'about-line-bridge--extend': bridgeSyncMode === 'extend',
            }"
            aria-hidden="true"
        >
            <img
                class="about-line-bridge-img portfolio-decor-line-img"
                :src="lineAnimationExtended"
                alt=""
            />
        </span>

        <section
            id="about"
            class="about"
            :class="{ 'about--reveal': aboutRevealed, 'about--settled': aboutEntranceDone }"
        >
            <span
                class="about-line"
                :class="{ 'about-line--knot-clipped': heroLineKnotClipped }"
                aria-hidden="true"
            >
                <img
                    class="about-line-img portfolio-decor-line-img"
                    :src="lineAnimationExtended"
                    alt=""
                />
            </span>
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
                        At work, value a good team. Figure out
                        context, metrics and specs before jumping in. High tolerance for ambiguity. Think critically. Very comfortable with data.
                        Interrogate LLMs.
                        <br><br>
                        Like to work out in free time - old books and films for the brain,
                        gym and swim for the rest. Drink wild beers on cheat days. Love a good conversation. Can't help
                        learning new things all the time.
                        <br><br>
                        For the nerds: a <a href="https://journals.biologists.com/dev/article/151/24/dev204256/363461/Short-range-Fgf-signalling-patterns-hindbrain" class="about-link">link</a> to my past life in
                        developmental neurobiology
                        (research paper).
                    </p>
                    <div class="about-actions portfolio-fly portfolio-fly--from-left">
                        <div class="about-actions-row">
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
import lineAnimationExtended from '../assets/line_animation_extended.svg'
import aboutSquiggle from '../assets/squiggle_3.svg'
import loadingNormal from '../assets/loading/loading_normal.svg'
import loadingFolded from '../assets/loading/loading_folded.svg'
import menuLogo from '../assets/TjyCutoutLogo.svg'
import cvUrl from '../assets/Tim Justina Yeung CV-2.pdf'
import PortfolioTopBar from '../components/PortfolioTopBar.vue'
import PortfolioSiteFooter from '../components/PortfolioSiteFooter.vue'
import { scrollToPortfolioHash } from '../utils/scrollToAbout.js'
import { DESKTOP_MEDIA_QUERY, MOBILE_MEDIA_QUERY, SMALL_MOBILE_MEDIA_QUERY, CASE_STUDY_DESKTOP_MEDIA_QUERY } from '../utils/breakpoints.js'
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
const PORTFOLIO_DECOR_LINE_SYNCED_EVENT = 'portfolio-decor-line-synced'
const HERO_CURSOR_MAGNIFY_BOOST = 0.25
const HERO_CURSOR_LAYER_Z = 10002
const HERO_CURSOR_HOVER_LOCK_PAD = 8
const HERO_CURSOR_DOT_SIZE = 8
const HERO_CURSOR_GLASS_IDLE_SIZE = 46
const HERO_CURSOR_GLASS_HOVER_EXTRA = 18
const HERO_CURSOR_HOLLOW_END = 0.42
const HERO_CURSOR_RANGE_END_SIZE = 32
const HERO_CURSOR_RANGE_POP = 1.32
const HERO_CURSOR_RANGE_DOT_PEAK = 1.85
const HERO_CURSOR_RANGE_EXPAND_END = 0.28
const HERO_CURSOR_MIRROR_FIXED_SELECTORS = ['.top-bar']
const HERO_CURSOR_MIRROR_HOVER_ANCESTORS = ['.project', '.project--upcoming']

function isHeroCursorEnvironment() {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
}

function getHeroCursorInitialPos() {
    return {
        x: Math.round(window.innerWidth / 2),
        y: Math.round(window.innerHeight / 2),
    }
}

const HERO_CURSOR_HOVER_TARGET_SELECTOR = [
    'a[href]',
    'button:not(:disabled)',
    '[role="button"]',
    'label',
    'input:not(:disabled)',
    'textarea:not(:disabled)',
    'select:not(:disabled)',
    '.cta-button',
    '.nav-link',
    '.project-image-link',
    '.project-caption-link',
    '.about-action-btn',
    '.footer-email',
    '.project-tldr-trigger',
].join(', ')

function heroCursorHoverMorph(hoverMix) {
    if (hoverMix <= 0) return { hollow: 0, expand: 0 }
    if (hoverMix <= HERO_CURSOR_HOLLOW_END) {
        const t = hoverMix / HERO_CURSOR_HOLLOW_END
        return { hollow: t * t, expand: 0 }
    }
    const t = (hoverMix - HERO_CURSOR_HOLLOW_END) / (1 - HERO_CURSOR_HOLLOW_END)
    return { hollow: 1, expand: 1 - (1 - t) * (1 - t) }
}

function heroCursorDistanceToRect(x, y, rect) {
    const cx = Math.max(rect.left, Math.min(x, rect.right))
    const cy = Math.max(rect.top, Math.min(y, rect.bottom))
    return Math.hypot(x - cx, y - cy)
}

function heroCursorRangeSmoothstep(t) {
    const x = Math.max(0, Math.min(1, t))
    return x * x * (3 - 2 * x)
}

function heroCursorRangeBounceOut(t) {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) return n1 * t * t
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
    return n1 * (t -= 2.625 / d1) * t + 0.984375
}

function heroCursorRangeEaseOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

function heroCursorRangeGlassSize(outSize, rangeMix) {
    if (rangeMix <= 0.001) return outSize
    if (rangeMix >= 1) return HERO_CURSOR_RANGE_END_SIZE

    const peakSize = outSize * HERO_CURSOR_RANGE_POP
    if (rangeMix <= HERO_CURSOR_RANGE_EXPAND_END) {
        const t = rangeMix / HERO_CURSOR_RANGE_EXPAND_END
        const eased = heroCursorRangeEaseOutBack(t)
        return outSize + (peakSize - outSize) * eased
    }

    const t = (rangeMix - HERO_CURSOR_RANGE_EXPAND_END) / (1 - HERO_CURSOR_RANGE_EXPAND_END)
    const shrink = heroCursorRangeBounceOut(t)
    return HERO_CURSOR_RANGE_END_SIZE + (peakSize - HERO_CURSOR_RANGE_END_SIZE) * (1 - shrink)
}

function heroCursorRangeDotVisual(rangeMix) {
    if (rangeMix <= 0) return { scale: 1, opacity: 1 }
    if (rangeMix >= 1) return { scale: 0, opacity: 0 }

    const peakScale = HERO_CURSOR_RANGE_DOT_PEAK
    let scale
    if (rangeMix <= HERO_CURSOR_RANGE_EXPAND_END) {
        const t = rangeMix / HERO_CURSOR_RANGE_EXPAND_END
        scale = 1 + (peakScale - 1) * heroCursorRangeEaseOutBack(t)
    } else {
        const t = (rangeMix - HERO_CURSOR_RANGE_EXPAND_END) / (1 - HERO_CURSOR_RANGE_EXPAND_END)
        scale = peakScale * (1 - heroCursorRangeBounceOut(t))
    }

    const fadeStart = HERO_CURSOR_RANGE_EXPAND_END * 0.55
    let opacity = 1
    if (rangeMix > fadeStart) {
        const t = (rangeMix - fadeStart) / (1 - fadeStart)
        opacity = Math.max(0, 1 - heroCursorRangeBounceOut(t))
    }

    return { scale, opacity }
}

function heroCursorGlassOuterSize(hoverMix, rangeMix) {
    const fullHover = HERO_CURSOR_GLASS_IDLE_SIZE + HERO_CURSOR_GLASS_HOVER_EXTRA
    if (rangeMix > 0.001) {
        const outSize = HERO_CURSOR_GLASS_IDLE_SIZE + HERO_CURSOR_GLASS_HOVER_EXTRA * hoverMix
        return heroCursorRangeGlassSize(outSize, rangeMix)
    }
    if (hoverMix <= 0) return HERO_CURSOR_GLASS_IDLE_SIZE
    const { hollow, expand } = heroCursorHoverMorph(hoverMix)
    if (expand <= 0) {
        return (
            HERO_CURSOR_GLASS_IDLE_SIZE +
            (HERO_CURSOR_DOT_SIZE - HERO_CURSOR_GLASS_IDLE_SIZE) * hollow
        )
    }
    return HERO_CURSOR_DOT_SIZE + (fullHover - HERO_CURSOR_DOT_SIZE) * expand
}

function parseCssTimeSec(styles, prop, fallback) {
    const raw = styles.getPropertyValue(prop).trim()
    if (!raw) return fallback
    const n = parseFloat(raw)
    return Number.isFinite(n) ? n : fallback
}

function parseCssPx(styles, prop, fallback) {
    const raw = styles.getPropertyValue(prop).trim()
    if (!raw) return fallback
    const n = parseFloat(raw)
    return Number.isFinite(n) ? n : fallback
}

const PROJECT_CAPTION_LINE_GAP = 30

const HERO_INTRO_PARTS = [
    { text: "I'm Tim Justina Yeung, a ", em: false },
    { text: 'Product Designer', em: true, keep: true },
    {
        text: ' with a background in Neuroscience and research. I deeply enjoy understanding complex problems and providing creative solutions ',
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
            lineAnimationExtended,
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
            heroLineKnotClipped: false,
            aboutLineBridgeSynced: false,
            bridgeSyncMode: null,
            heroLineClipSettled: false,
            // JS-owned so we can measure while hidden, then show after sync (avoids <800px flash)
            heroDecorHidden:
                typeof window !== 'undefined' &&
                window.matchMedia(MOBILE_MEDIA_QUERY).matches,
            heroLocationVisible: false,
            heroLocationScrollTicking: false,
            firstProjectPrefetchStarted: false,
            firstProjectPrefetchIdleId: null,
            aboutLocationClipRaf: null,
            featuredExpandPending: false,
            featuredExpandTimer: null,
            featuredPressClearTimer: null,
            featuredPressAt: 0,
            heroIntroParts: HERO_INTRO_BUILT,
            heroIntroPlain: HERO_INTRO_PLAIN,
            // Letter cascade on all breakpoints; reduced motion keeps static block text.
            heroIntroLetterMode:
                typeof window !== 'undefined' &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            heroIntroPointerRaf: null,
            heroIntroPointer: null,
            heroIntroActivePointerId: null,
            heroIntroTapLingerTimer: null,
            heroIntroTouchStart: null,
            heroIntroTouchMode: null,
            heroIntroTouchGuardActive: false,
            heroCursorActive: isHeroCursorEnvironment(),
            heroCursorInRange: false,
            heroCursorRangeTight: false,
            heroCursorRangeMix: 0,
            heroCursorHoverMix: 0,
            heroCursorOverHover: false,
            heroCursorPos: isHeroCursorEnvironment() ? getHeroCursorInitialPos() : { x: 0, y: 0 },
            heroCursorGlassPos: isHeroCursorEnvironment() ? getHeroCursorInitialPos() : { x: 0, y: 0 },
            heroCursorGlassRaf: null,
            heroCursorMagnifierLayout: null,
            heroCursorMirrorClone: null,
            heroCursorMirrorHoverTarget: 0,
            heroCursorHoverLockEl: null,
        }
    },
    computed: {
        heroIntroFinePointer() {
            return (
                typeof window !== 'undefined' &&
                window.matchMedia('(hover: hover) and (pointer: fine)').matches
            )
        },
        heroCursorEligible() {
            return this.heroIntroLetterMode && this.heroIntroFinePointer
        },
        heroCursorBootLocked() {
            return this.showLoadingSplash || this.logoHandoff || !this.pageEntranceDone
        },
        heroCursorHideNative() {
            return this.heroCursorEligible && (this.heroCursorActive || this.heroCursorBootLocked)
        },
        heroCursorVisible() {
            return this.heroCursorEligible && (this.heroCursorActive || this.heroCursorBootLocked)
        },
        heroCursorGlassVisible() {
            return this.heroCursorVisible && !this.heroCursorBootLocked
        },
        heroCursorBallStyle() {
            if (!this.heroCursorVisible) {
                return {
                    opacity: 0,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                }
            }

            const { x, y } = this.heroCursorPos
            const rangeMix = this.heroCursorRangeMix
            const hoverMix = this.heroCursorInRange ? 0 : this.heroCursorHoverMix

            let size = HERO_CURSOR_DOT_SIZE
            let scale = 1
            let opacity = 1
            let background = '#000aaa'
            let borderWidth = 0

            if (rangeMix > 0.001) {
                const dotVisual = heroCursorRangeDotVisual(rangeMix)
                scale = dotVisual.scale
                opacity = dotVisual.opacity
            } else if (hoverMix > 0) {
                const { hollow, expand } = heroCursorHoverMorph(hoverMix)
                if (expand <= 0) {
                    background = `rgba(0, 10, 170, ${1 - hollow})`
                    borderWidth = hollow * 1.5
                } else {
                    size = heroCursorGlassOuterSize(hoverMix, rangeMix)
                    background = 'transparent'
                    borderWidth = 1.5 + expand * 0.35
                    opacity = 1 - expand * expand
                }
            }

            const half = size / 2
            return {
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                width: `${size}px`,
                height: `${size}px`,
                margin: `${-half}px 0 0 ${-half}px`,
                background,
                border: borderWidth > 0.01 ? `${borderWidth}px solid #000aaa` : 'none',
                boxSizing: 'border-box',
                opacity,
                visibility: opacity < 0.02 && scale < 0.02 ? 'hidden' : 'visible',
            }
        },
        heroCursorGlassStyle() {
            if (!this.heroCursorGlassVisible) {
                return {
                    opacity: 0,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                }
            }

            const { x, y } = this.heroCursorGlassPos
            const rangeMix = this.heroCursorRangeMix
            const hoverMix = this.heroCursorInRange ? 0 : this.heroCursorHoverMix
            const size = heroCursorGlassOuterSize(hoverMix, rangeMix)
            const half = size / 2
            return {
                transform: `translate3d(${x}px, ${y}px, 0)`,
                '--hero-cursor-hover-mix': hoverMix,
                '--hero-cursor-range-mix': rangeMix,
                width: `${size}px`,
                height: `${size}px`,
                margin: `${-half}px 0 0 ${-half}px`,
            }
        },
        heroCursorMagnifierWindowStyle() {
            if (this.heroCursorBootLocked) {
                return {
                    opacity: 0,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                }
            }

            const layout = this.heroCursorMagnifierLayout
            if (!layout) {
                return {
                    opacity: 0,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                }
            }

            return {
                position: 'fixed',
                left: `${layout.windowLeft}px`,
                top: `${layout.windowTop}px`,
                width: `${layout.size}px`,
                height: `${layout.size}px`,
                borderRadius: '50%',
                overflow: 'hidden',
                opacity: layout.opacity,
                visibility: layout.opacity > 0.02 ? 'visible' : 'hidden',
                pointerEvents: 'none',
                zIndex: HERO_CURSOR_LAYER_Z - 1,
            }
        },
        heroCursorMagnifierContentStyle() {
            const layout = this.heroCursorMagnifierLayout
            if (!layout || typeof window === 'undefined') return {}

            return {
                position: 'absolute',
                left: `${layout.half - layout.cx}px`,
                top: `${layout.half - layout.cy}px`,
                width: `${window.innerWidth}px`,
                height: `${window.innerHeight}px`,
                transform: `scale(${layout.scale})`,
                transformOrigin: `${layout.cx}px ${layout.cy}px`,
            }
        },
        loadingSplashFrameTransform() {
            return `rotate(${this.loadingRotationDeg}deg)`
        },
    },
    watch: {
        heroCursorHideNative() {
            this.syncHeroCursorDocumentClass()
        },
    },
    mounted() {
        if (this.heroCursorEligible) {
            this.syncHeroCursorDocumentClass()
        }

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

        this.heroIntroLetterMq = window.matchMedia(MOBILE_MEDIA_QUERY)
        this.heroIntroReduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
        this.onHeroIntroLetterMqChange = () => {
            this.onMobileHeroLayoutChange()
        }
        this.heroIntroLetterMq.addEventListener('change', this.onHeroIntroLetterMqChange)
        this.heroIntroReduceMq.addEventListener('change', this.onHeroIntroLetterMqChange)

        if (this.pageEntranceDone) {
            this.$nextTick(() => this.lockHeroViewportHeight())
        }

        this.onHeroPointerMove = (event) => this.onHeroPointerMoveHandler(event)
        this.onHeroPointerDown = (event) => this.onHeroPointerDownHandler(event)
        this.onHeroPointerUp = (event) => this.onHeroPointerUpHandler(event)
        this.onHeroPointerEndHandler = () => this.onHeroPointerEndHandlerImpl()
        this.onHeroPointerLeaveWindow = (event) => {
            if (event.relatedTarget != null) return
            const { clientX: x, clientY: y } = event
            const margin = 2
            if (
                x >= -margin &&
                y >= -margin &&
                x <= window.innerWidth + margin &&
                y <= window.innerHeight + margin
            ) {
                return
            }
            this.onHeroPointerEndHandlerImpl()
        }
        this.onHeroPointerScroll = () => this.onHeroPointerScrollHandler()
        this.onHeroTouchMove = (event) => this.onHeroTouchMoveHandler(event)
        this.onHeroPointerEnter = (event) => {
            if (!this.isHeroIntroFinePointer() || event.pointerType !== 'mouse') return
            if (!this.heroIntroLetterMode) return
            this.updateHeroFinePointer(event.clientX, event.clientY, {
                introEffects: this.canHeroIntroPointerPlay(),
            })
        }
        if (this.heroIntroLetterMode && this.isHeroIntroFinePointer()) {
            this.primeHeroCursor()
        }
        window.addEventListener('pointermove', this.onHeroPointerMove, { passive: true })
        document.addEventListener('pointerenter', this.onHeroPointerEnter, { passive: true })
        window.addEventListener('pointerdown', this.onHeroPointerDown, { passive: true })
        window.addEventListener('pointerup', this.onHeroPointerUp, { passive: true })
        window.addEventListener('pointercancel', this.onHeroPointerUp, { passive: true })
        window.addEventListener('blur', this.onHeroPointerEndHandler)
        document.addEventListener('mouseout', this.onHeroPointerLeaveWindow)
        window.addEventListener('scroll', this.onHeroPointerScroll, { passive: true, capture: true })
        this.onMobileHeroOrientation = () => {
            window.setTimeout(() => this.lockHeroViewportHeight(), 250)
        }
        window.addEventListener('orientationchange', this.onMobileHeroOrientation)

        this.heroDecorObserver = new ResizeObserver(() => {
            this.beginHeroDecorResizeClip()
            requestAnimationFrame(() => {
                this.syncHeroDecorHeight()
                this.endHeroDecorResizeClip()
            })
        })

        const main = this.$el?.querySelector('.portfolio-main')
        const work = this.$el?.querySelector('.work')
        const workFirst = this.$el?.querySelector('#work-first')
        const workLast = this.$el?.querySelector('#work-last')
        const heroIntro = this.$el?.querySelector('.hero-intro')
        if (main) {
            this.heroDecorObserver.observe(main)
        }
        if (work) {
            this.heroDecorObserver.observe(work)
        }
        if (workFirst) {
            this.heroDecorObserver.observe(workFirst)
        }
        if (workLast) {
            this.heroDecorObserver.observe(workLast)
        }
        if (heroIntro) {
            this.heroDecorObserver.observe(heroIntro)
        }

        const heroDecor = this.$el?.querySelector('.hero-decor')
        if (heroDecor) {
            heroDecor.addEventListener('animationend', this.onHeroDecorFlyEnd)
        }

        for (const article of [workFirst, workLast]) {
            const heroImage = article?.querySelector('.project-image')
            if (heroImage && !heroImage.complete) {
                heroImage.addEventListener('load', () => this.syncHeroDecorHeight(), { once: true })
            }
        }

        this.syncDecorLineX()
        this.syncHeroDecorHeight()
        this.syncProjectCaptionLineOffset()
        this.syncAboutBallPosition()
        this.syncAboutLocationTextClip()
        window.addEventListener('resize', this.onHeroDecorResize, { passive: true })
        window.addEventListener('scroll', this.onAboutBallScroll, { passive: true })
        window.addEventListener('scroll', this.onHeroLocationScroll, { passive: true })
        document.fonts?.ready?.then(() => {
            this.syncHeroDecorHeight()
            this.syncProjectCaptionLineOffset()
            this.syncAboutBallPosition()
            this.syncAboutLocationTextClip()
            if (!this.pageRevealed) {
                this.syncHeroIntroCharColumns()
            }
            if (sectionHash) {
                this.jumpToSectionHash(sectionHash)
            }
        })

        const aboutInner = this.$el?.querySelector('.about-inner')
        if (aboutInner) {
            this.aboutLocationClipObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => this.syncAboutLocationTextClip())
            })
            this.aboutLocationClipObserver.observe(aboutInner)
        }

        const aboutBio = this.$el?.querySelector('.about-bio')
        if (aboutBio) {
            this.aboutBallObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => this.syncAboutBallPosition())
            })
            this.aboutBallObserver.observe(aboutBio)
        }

        // Work jumps use the normal IO reveal; About jumps start the slide-in after scroll.
        if (sectionHash !== '#about') {
            this.setupAboutReveal()
        }
        this.setupProjectScrollFade(sectionHash)
        this.setupHeroLocationVisibility()
        this.scheduleFirstProjectPrefetch()

        if (sectionHash) {
            this.$nextTick(() => {
                requestAnimationFrame(() => {
                    this.syncHeroDecorHeight()
                    this.syncAboutBallPosition()
                    this.syncAboutLocationTextClip()
                    this.jumpToSectionHash(sectionHash)
                    this.publishDecorLineAlign()
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
        document.documentElement.classList.remove('portfolio-hero-cursor')
        this.heroDecorObserver?.disconnect()
        this.aboutBallObserver?.disconnect()
        this.aboutLocationClipObserver?.disconnect()
        this.stopAboutLocationTextClipPoll()
        this.aboutRevealObserver?.disconnect()
        this.projectFadeObserver?.disconnect()
        this.heroLocationObserver?.disconnect()
        window.removeEventListener('resize', this.onHeroDecorResize)
        window.removeEventListener('scroll', this.onAboutBallScroll)
        window.removeEventListener('scroll', this.onHeroLocationScroll)
        this.heroIntroLetterMq?.removeEventListener('change', this.onHeroIntroLetterMqChange)
        this.heroIntroReduceMq?.removeEventListener('change', this.onHeroIntroLetterMqChange)
        if (this.heroIntroPointerRaf != null) cancelAnimationFrame(this.heroIntroPointerRaf)
        if (this.heroIntroScrollRaf != null) cancelAnimationFrame(this.heroIntroScrollRaf)
        this.stopHeroCursorGlassFollow()
        clearTimeout(this.heroIntroTapLingerTimer)
        this.disableHeroIntroTouchGuard()
        this.clearHeroIntroPointerShift()
        window.removeEventListener('pointermove', this.onHeroPointerMove)
        document.removeEventListener('pointerenter', this.onHeroPointerEnter)
        window.removeEventListener('pointerdown', this.onHeroPointerDown)
        window.removeEventListener('pointerup', this.onHeroPointerUp)
        window.removeEventListener('pointercancel', this.onHeroPointerUp)
        window.removeEventListener('orientationchange', this.onMobileHeroOrientation)
        this.clearHeroViewportHeight()
        window.removeEventListener('blur', this.onHeroPointerEndHandler)
        document.removeEventListener('mouseout', this.onHeroPointerLeaveWindow)
        window.removeEventListener('scroll', this.onHeroPointerScroll, { capture: true })
        this.getHeroLineEl()?.removeEventListener('transitionend', this.onHeroLineReturnEnd)
        this.$el?.querySelector('.hero-decor')?.removeEventListener('animationend', this.onHeroDecorFlyEnd)
        if (this.firstProjectPrefetchIdleId != null && 'cancelIdleCallback' in window) {
            cancelIdleCallback(this.firstProjectPrefetchIdleId)
        }
    },
    methods: {
        onFeaturedProjectPress(event) {
            if (event.pointerType === 'mouse' && event.button !== 0) return
            if (prefersReducedMotion()) return
            if (!window.matchMedia(SMALL_MOBILE_MEDIA_QUERY).matches) return
            const article = event.currentTarget.closest('.project')
            clearTimeout(this.featuredPressClearTimer)
            this.featuredPressClearTimer = null
            // Keep round while pressed; release clears it unless a navigate starts
            article?.classList.add('project--press-expand')
            this.featuredPressAt = performance.now()
        },
        onFeaturedProjectPressEnd(event) {
            if (!window.matchMedia(SMALL_MOBILE_MEDIA_QUERY).matches) return
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
            clearTimeout(this.featuredExpandTimer)
            this.featuredPressClearTimer = null
            this.featuredExpandTimer = null
            this.featuredExpandPending = false
            this.featuredPressAt = 0

            const shell =
                article.querySelector('.project-image-link') ||
                article.querySelector('.project-image-wrap') ||
                img
            const rect = shell.getBoundingClientRect()
            if (rect.width <= 0 || rect.height <= 0) {
                article?.classList.remove('project--press-expand')
                this.$router.push('/work/DashboardDesign')
                return
            }

            // Same expand path on mobile and desktop
            const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches
            if (isMobile) article.classList.add('project--press-expand')

            startImageExpand({
                src: img.currentSrc || img.src,
                rect,
                borderRadius: isMobile
                    ? PRESS_BORDER_RADIUS
                    : getComputedStyle(img).borderRadius || '20px',
            })
            img.style.opacity = '0'

            this.$router.push('/work/DashboardDesign').catch(() => {
                img.style.opacity = ''
                article?.classList.remove('project--press-expand')
                cancelImageExpand()
            })
        },
        jumpToSectionHash(hash) {
            scrollToPortfolioHash(hash, { duration: 0 })
            // Keep top bar hidden after the instant jump (no scroll delta to trigger it).
            window.dispatchEvent(new Event('portfolio-section-jump'))
            if (hash === '#work' || hash === '#work-first') {
                this.revealAllProjects()
            }
            this.$nextTick(() => {
                requestAnimationFrame(() => this.updateHeroLocationVisibility())
            })
            if (hash !== '#about' || this.aboutRevealed) return

            // Start the about slide-in after the jump so it animates into place.
            this.aboutRevealed = true
            this.scheduleAboutEntranceEnd()
        },
        setupProjectScrollFade(sectionHash = '') {
            const projects = [...(this.$el?.querySelectorAll('.work .project') ?? [])]
            if (!projects.length) return

            if (prefersReducedMotion()) {
                this.revealAllProjects()
                return
            }

            // Deep-link into work: show cards immediately (no fade after jump).
            if (sectionHash === '#work' || sectionHash === '#work-first') {
                this.revealAllProjects()
                return
            }

            // Desktop work cards (800px+): no scroll fade; narrower mobile uses observer below.
            if (window.matchMedia(CASE_STUDY_DESKTOP_MEDIA_QUERY).matches) {
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
                const rect = project.getBoundingClientRect()
                const inViewport = rect.top < window.innerHeight && rect.bottom > 0
                if (inViewport) {
                    project.classList.add('project--in-view')
                } else {
                    project.classList.add('project--scroll-fade')
                    this.projectFadeObserver.observe(project)
                }
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

            const isMobileAbout = window.matchMedia(SMALL_MOBILE_MEDIA_QUERY).matches

            this.aboutRevealObserver = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0]
                    if (!entry) return

                    if (isMobileAbout) {
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
                isMobileAbout
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
            const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches
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
            this.syncDecorLineX()
            this.publishDecorLineAlign()
            this.schedulePageEntranceSettle()
            scrollToPortfolioHash(this.$route.hash)
        },
        schedulePageEntranceSettle() {
            if (this.pageEntranceDone || this.pageEntranceSettleScheduled) return
            this.pageEntranceSettleScheduled = true

            if (prefersReducedMotion()) {
                this.markPageEntranceDone()
                this.$nextTick(() => {
                    requestAnimationFrame(() => this.publishDecorLineAlign())
                })
                return
            }

            // Lock the line fly-in once the entrance sequence finishes
            this.scheduleHeroLineClipSettle()

            // Wait until the longest hero motion finishes.
            let settleMs = 2300
            const intro = this.$el?.querySelector('.hero-intro')

            if (this.heroIntroLetterMode) {
                const pageStyles = getComputedStyle(this.$el)
                const introStyles = intro ? getComputedStyle(intro) : pageStyles
                const ctaDelay = parseCssTimeSec(pageStyles, '--cta-fly-delay', 0.08)
                const ctaDuration = parseCssTimeSec(pageStyles, '--cta-fly-duration', 1.25)
                const ctaEnd = ctaDelay + ctaDuration
                const lineFlyDurationRaw = pageStyles.getPropertyValue('--hero-line-fly-duration').trim()
                const lineFlyDelay = parseCssTimeSec(pageStyles, '--hero-line-fly-delay', 0.08)
                const lineFlyDuration = lineFlyDurationRaw ? parseFloat(lineFlyDurationRaw) : 0
                const cascadeStart = parseCssTimeSec(
                    introStyles,
                    '--hero-intro-cascade-start',
                    lineFlyDurationRaw ? lineFlyDelay + lineFlyDuration + 0.14 : 0.04
                )
                const cascadeEnd = parseCssTimeSec(introStyles, '--hero-intro-cascade-end', ctaEnd)
                const charDuration = parseCssTimeSec(introStyles, '--hero-intro-char-duration', 0.85)
                const slowestLineMult = 1.1
                const maxDelay = Math.max(
                    cascadeStart,
                    cascadeEnd - charDuration * slowestLineMult
                )
                const afterthoughtStart =
                    Math.max(cascadeEnd, maxDelay + charDuration * slowestLineMult) +
                    0.22 +
                    0.1 +
                    0.05
                settleMs = Math.ceil((afterthoughtStart + charDuration + 0.15) * 1000)
            } else {
                settleMs = 300
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
            this.syncHeroCursorDocumentClass()
            this.lockHeroViewportHeight()
            this.syncHeroDecorHeight()
            this.syncProjectCaptionLineOffset()
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

            // Fly-in duration (+ buffer) — knot stays clipped; no clip-path reveal on load
            clearTimeout(this.heroLineClipSettleTimer)
            this.heroLineClipSettleTimer = setTimeout(() => {
                line.removeEventListener('transitionend', this.onHeroLineClipSettleEnd)
                this.markHeroLineClipSettled()
            }, 1300)
        },
        markHeroLineClipSettled() {
            clearTimeout(this.heroLineClipSettleTimer)
            this.heroLineClipSettleTimer = null
            if (this.heroLineClipSettled) return
            this.heroLineClipSettled = true
            this.getHeroLineEl()?.classList.add('hero-decor-line--settled')
            this.publishDecorLineAlign()
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
            const nextLetter = !this.heroIntroReduceMq.matches
            const letterChanged = nextLetter !== this.heroIntroLetterMode
            const leavingMobile = this.heroDecorHidden && !isMobile

            if (isMobile) {
                this.heroDecorHidden = true
                this.heroLocationVisible = false
                if (letterChanged) this.heroIntroLetterMode = nextLetter
                this.syncProjectCaptionLineOffset()
                this.$nextTick(() => this.lockHeroViewportHeight())
                return
            }

            this.lockHeroViewportHeight()

            if (letterChanged) this.heroIntroLetterMode = nextLetter

            // Tablet↔desktop letter/motion-only: sync without hiding the line
            if (!leavingMobile) {
                this.beginHeroDecorResizeClip()
                this.$nextTick(() => {
                    this.syncHeroDecorHeight()
                    this.syncProjectCaptionLineOffset()
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
                        this.lockHeroViewportHeight()
                        this.syncHeroDecorHeight()
                        this.syncProjectCaptionLineOffset()
                        this.syncAboutBallPosition()
                        this.syncAboutLocationTextClip()
                        if (this.heroIntroLetterMode && !this.pageRevealed) {
                            this.syncHeroIntroCharColumns()
                        }
                        this.heroDecorHidden = false
                        this.endHeroDecorResizeClip()
                        this.updateHeroLocationVisibility()
                        this.publishDecorLineAlign()
                    })
                })
            })
        },
        setupHeroLocationVisibility() {
            const workFirst = this.$el?.querySelector('#work-first')
            if (!workFirst) return

            this.heroLocationObserver = new IntersectionObserver(
                () => this.updateHeroLocationVisibility(),
                { threshold: [0, 1] },
            )
            this.heroLocationObserver.observe(workFirst)
            this.updateHeroLocationVisibility()
        },
        updateHeroLocationVisibility() {
            if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
                this.heroLocationVisible = false
                return
            }

            const workFirst = this.$el?.querySelector('#work-first')
            if (!workFirst) {
                this.heroLocationVisible = false
                return
            }

            const top = workFirst.getBoundingClientRect().top
            // Sub-pixel slack: 100svh can sit slightly below window.innerHeight on some viewports
            this.heroLocationVisible = top >= window.innerHeight - 1
        },
        onHeroLocationScroll() {
            if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) return
            if (this.heroLocationScrollTicking) return
            this.heroLocationScrollTicking = true
            requestAnimationFrame(() => {
                this.updateHeroLocationVisibility()
                this.heroLocationScrollTicking = false
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
        lockHeroViewportHeight() {
            if (!this.pageEntranceDone) {
                this.clearHeroViewportHeight()
                return
            }

            const isMobile = this.heroIntroLetterMq?.matches

            if (isMobile) {
                this.$el?.style.removeProperty('--desktop-hero-min-height')
                const pageStyles = getComputedStyle(this.$el)
                const topBarHeight = parseCssPx(pageStyles, '--top-bar-height', 86)
                const height = Math.max(0, Math.round(window.innerHeight - topBarHeight))
                this.$el?.style.setProperty('--mobile-hero-height', `${height}px`)
            } else if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
                this.$el?.style.removeProperty('--mobile-hero-height')
                this.$el?.style.setProperty(
                    '--desktop-hero-min-height',
                    `${Math.round(window.innerHeight)}px`,
                )
            } else {
                this.clearHeroViewportHeight()
            }

            this.updateHeroLocationVisibility()
        },
        clearHeroViewportHeight() {
            this.$el?.style.removeProperty('--mobile-hero-height')
            this.$el?.style.removeProperty('--desktop-hero-min-height')
        },
        getHeroLineEl() {
            return this.$el?.querySelector('.hero-decor-line')
        },
        canHeroIntroPointerPlay() {
            return (
                this.heroIntroLetterMode &&
                this.pageEntranceDone &&
                !prefersReducedMotion() &&
                typeof window !== 'undefined'
            )
        },
        isHeroIntroFinePointer() {
            return (
                typeof window !== 'undefined' &&
                window.matchMedia('(hover: hover) and (pointer: fine)').matches
            )
        },
        isHeroIntroMobileTouch() {
            return this.heroIntroLetterMq?.matches ?? false
        },
        getHeroCursorZonePad(intro, introStyles) {
            const normalPad = parseCssPx(introStyles, '--hero-cursor-zone-pad-default', 80)
            const tightPad = parseCssPx(introStyles, '--hero-cursor-zone-pad-tight', 4)
            const proximity = parseCssPx(introStyles, '--hero-cursor-nav-proximity', 80)

            if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
                return normalPad
            }

            const introRect = intro.getBoundingClientRect()
            const navLinks = document.querySelectorAll('.nav-link--work, .nav-link--about')

            for (const nav of navLinks) {
                const navRect = nav.getBoundingClientRect()
                if (navRect.height === 0) continue
                if (introRect.top - navRect.bottom < proximity) {
                    return tightPad
                }
            }

            return normalPad
        },
        getHeroIntroRangeProximityMix(x, y) {
            const intro = this.$el?.querySelector('.hero-intro')
            if (!intro) return 0

            const introStyles = getComputedStyle(intro)
            const outerPad = parseCssPx(introStyles, '--hero-cursor-zone-pad-default', 80)
            const innerPad = parseCssPx(introStyles, '--hero-cursor-zone-pad-tight', 4)
            const distance = heroCursorDistanceToRect(
                x,
                y,
                intro.getBoundingClientRect()
            )

            if (distance >= outerPad) return 0
            if (distance <= innerPad) return 1

            const linear = (outerPad - distance) / (outerPad - innerPad)
            return heroCursorRangeSmoothstep(linear)
        },
        isHeroIntroPointerTight(x, y) {
            const intro = this.$el?.querySelector('.hero-intro')
            if (!intro) return false

            const introStyles = getComputedStyle(intro)
            const innerPad = parseCssPx(introStyles, '--hero-cursor-zone-pad-tight', 4)
            const distance = heroCursorDistanceToRect(
                x,
                y,
                intro.getBoundingClientRect()
            )
            return distance <= innerPad
        },
        isHeroIntroPointerNear(x, y) {
            const intro = this.$el?.querySelector('.hero-intro')
            if (!intro) return false

            const introStyles = getComputedStyle(intro)
            const zonePad = this.getHeroCursorZonePad(intro, introStyles)
            const rect = intro.getBoundingClientRect()
            return (
                x >= rect.left - zonePad &&
                x <= rect.right + zonePad &&
                y >= rect.top - zonePad &&
                y <= rect.bottom + zonePad
            )
        },
        classifyHeroIntroTouchGesture(event) {
            const start = this.heroIntroTouchStart
            if (!start) return 'stroke'
            if (event.pointerType === 'pen') return 'stroke'

            const intro = this.$el?.querySelector('.hero-intro.hero-intro--chars')
            const styles = intro ? getComputedStyle(intro) : null
            const swipeMinTravel = styles
                ? parseCssPx(styles, '--hero-intro-swipe-min-travel', 22)
                : 22
            const swipeVerticalMin = styles
                ? parseCssPx(styles, '--hero-intro-swipe-vertical-min', 30)
                : 30
            const swipeRatio = styles ? parseCssPx(styles, '--hero-intro-swipe-ratio', 1.65) : 1.65

            const dx = event.clientX - start.x
            const dy = event.clientY - start.y
            const absDx = Math.abs(dx)
            const absDy = Math.abs(dy)
            const travel = Math.hypot(dx, dy)

            if (travel < swipeMinTravel) return 'stroke'
            if (absDy > absDx * swipeRatio && absDy > swipeVerticalMin) return 'swipe'
            if (absDx >= absDy * 0.7) return 'stroke'

            return 'swipe'
        },
        setHeroIntroStrokeActive(active) {
            this.$el
                ?.querySelector('.hero-intro.hero-intro--chars')
                ?.classList.toggle('hero-intro--stroke-active', active)
        },
        enterHeroIntroSwipeMode(pointerId) {
            this.heroIntroTouchMode = 'swipe'
            this.disableHeroIntroTouchGuard()
            this.releaseHeroIntroPointerCapture(pointerId)
            this.setHeroIntroStrokeActive(false)
            this.heroIntroPointer = null
            if (this.heroIntroPointerRaf != null) {
                cancelAnimationFrame(this.heroIntroPointerRaf)
                this.heroIntroPointerRaf = null
            }
            this.clearHeroIntroPointerShift()
        },
        enableHeroIntroTouchGuard() {
            if (this.heroIntroTouchGuardActive) return
            this.heroIntroTouchGuardActive = true
            window.addEventListener('touchmove', this.onHeroTouchMove, { passive: false })
        },
        disableHeroIntroTouchGuard() {
            if (!this.heroIntroTouchGuardActive) return
            this.heroIntroTouchGuardActive = false
            window.removeEventListener('touchmove', this.onHeroTouchMove)
        },
        onHeroTouchMoveHandler(event) {
            if (this.heroIntroActivePointerId == null) return
            if (this.heroIntroTouchMode === 'swipe') return

            const touch = [...event.changedTouches].find(
                (t) => t.identifier === this.heroIntroActivePointerId
            ) ?? [...event.touches].find(
                (t) => t.identifier === this.heroIntroActivePointerId
            )
            if (!touch) return

            const probe = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                pointerType: 'touch',
            }

            if (this.classifyHeroIntroTouchGesture(probe) === 'swipe') {
                this.enterHeroIntroSwipeMode(this.heroIntroActivePointerId)
                return
            }

            const start = this.heroIntroTouchStart
            if (start) {
                const absDx = Math.abs(touch.clientX - start.x)
                const absDy = Math.abs(touch.clientY - start.y)
                // Vertical drift → let the browser scroll; keep push via pointermove
                if (absDy > absDx * 1.05 && absDy > 10) return
            }

            if (this.isHeroIntroPointerNear(touch.clientX, touch.clientY)) {
                event.preventDefault()
            }
        },
        captureHeroIntroPointer(event) {
            const intro = this.$el?.querySelector('.hero-intro')
            if (!intro?.setPointerCapture || intro.hasPointerCapture?.(event.pointerId)) return
            try {
                intro.setPointerCapture(event.pointerId)
            } catch {
                /* pointer may already be captured elsewhere */
            }
        },
        releaseHeroIntroPointerCapture(pointerId) {
            if (pointerId == null) return
            const intro = this.$el?.querySelector('.hero-intro')
            if (!intro?.releasePointerCapture || !intro.hasPointerCapture?.(pointerId)) return
            try {
                intro.releasePointerCapture(pointerId)
            } catch {
                /* ignore */
            }
        },
        isHeroCursorOverHoverTarget(x, y) {
            return this.getHeroCursorHoverTargetElement(x, y) != null
        },
        getHeroCursorHoverTargetElement(x, y) {
            if (typeof document === 'undefined') return null

            const lock = this.heroCursorHoverLockEl
            if (lock?.isConnected) {
                const rect = lock.getBoundingClientRect()
                const pad = HERO_CURSOR_HOVER_LOCK_PAD
                if (
                    x >= rect.left - pad &&
                    x <= rect.right + pad &&
                    y >= rect.top - pad &&
                    y <= rect.bottom + pad
                ) {
                    return lock
                }
                this.heroCursorHoverLockEl = null
            }

            const stack =
                document.elementsFromPoint?.(x, y) ??
                [document.elementFromPoint(x, y)].filter(Boolean)

            for (const el of stack) {
                if (!(el instanceof Element)) continue
                if (el.closest('.hero-intro-cursor-ball, .hero-intro-cursor-magnifier')) continue

                const target = el.closest(HERO_CURSOR_HOVER_TARGET_SELECTOR)
                if (target) {
                    this.heroCursorHoverLockEl = target
                    return target
                }

                if (getComputedStyle(el).cursor === 'pointer') {
                    this.heroCursorHoverLockEl = el
                    return el
                }
            }

            return null
        },
        getMirrorNodeForLive(liveEl, cloneRoot, sourceRoot) {
            if (!(liveEl instanceof Element) || !cloneRoot || !sourceRoot) return null

            const path = []
            let node = liveEl
            while (node && node !== sourceRoot) {
                const parent = node.parentElement
                if (!parent) return null
                path.unshift(Array.prototype.indexOf.call(parent.children, node))
                node = parent
            }
            if (node !== sourceRoot) return null

            let mirror = cloneRoot
            for (const index of path) {
                mirror = mirror.children[index]
                if (!mirror) break
            }
            if (mirror instanceof Element) return mirror

            return this.findMirrorNodeFallback(liveEl, cloneRoot, sourceRoot)
        },
        findMirrorNodeFallback(liveEl, cloneRoot, sourceRoot) {
            if (!(liveEl instanceof Element) || !cloneRoot || !sourceRoot) return null

            if (liveEl.id) {
                const byId = cloneRoot.querySelector(`#${CSS.escape(liveEl.id)}`)
                if (byId instanceof Element) return byId
            }

            if (liveEl instanceof HTMLAnchorElement) {
                const href = liveEl.getAttribute('href')
                if (href) {
                    const matches = [...cloneRoot.querySelectorAll(`a[href="${CSS.escape(href)}"]`)]
                    if (matches.length === 1) return matches[0]
                    const label = liveEl.textContent?.trim()
                    if (label) {
                        const labeled = matches.find((node) => node.textContent?.trim() === label)
                        if (labeled) return labeled
                    }
                }
            }

            const tag = liveEl.tagName.toLowerCase()
            const classSelector = [...liveEl.classList]
                .map((className) => `.${CSS.escape(className)}`)
                .join('')
            const candidates = cloneRoot.querySelectorAll(`${tag}${classSelector}`)
            for (const candidate of candidates) {
                if (
                    Math.abs(candidate.offsetTop - liveEl.offsetTop) <= 1 &&
                    Math.abs(candidate.offsetLeft - liveEl.offsetLeft) <= 1
                ) {
                    return candidate
                }
            }

            return null
        },
        clearHeroCursorMirrorHoverState() {
            const clone = this.heroCursorMirrorClone
            if (!clone) return

            clone.querySelectorAll('.hero-cursor-mirror-hover').forEach((el) => {
                el.classList.remove('hero-cursor-mirror-hover')
            })
        },
        syncHeroCursorMirrorHoverState(x, y) {
            const clone = this.heroCursorMirrorClone
            const source = this.$el?.classList?.contains('portfolio-page') ? this.$el : null
            if (!clone || !source) {
                this.clearHeroCursorMirrorHoverState()
                return
            }

            this.clearHeroCursorMirrorHoverState()

            const liveTarget = this.getHeroCursorHoverTargetElement(x, y)
            if (!liveTarget) return

            const liveNodes = [liveTarget]
            for (const selector of HERO_CURSOR_MIRROR_HOVER_ANCESTORS) {
                const ancestor = liveTarget.closest(selector)
                if (ancestor) liveNodes.push(ancestor)
            }

            for (const liveNode of liveNodes) {
                const mirrorNode = this.getMirrorNodeForLive(liveNode, clone, source)
                mirrorNode?.classList.add('hero-cursor-mirror-hover')
            }
        },
        syncHeroCursorDocumentClass() {
            if (this.heroCursorHideNative) {
                document.documentElement.classList.add('portfolio-hero-cursor')
            } else {
                document.documentElement.classList.remove('portfolio-hero-cursor')
            }
        },
        primeHeroCursor() {
            if (!this.heroIntroLetterMode || !this.isHeroIntroFinePointer()) return
            this.heroCursorActive = true
            this.syncHeroCursorDocumentClass()
            this.startHeroCursorGlassFollow()
        },
        updateHeroFinePointer(x, y, { introEffects = true } = {}) {
            const inRange = introEffects && this.isHeroIntroPointerNear(x, y)
            const wasActive = this.heroCursorActive

            this.heroCursorPos = { x, y }
            this.heroCursorActive = true
            this.syncHeroCursorDocumentClass()
            this.heroCursorInRange = inRange
            this.heroCursorRangeTight = inRange && this.isHeroIntroPointerTight(x, y)
            this.heroCursorOverHover = !inRange && this.isHeroCursorOverHoverTarget(x, y)
            const magnifierVisible =
                !inRange &&
                (this.heroCursorOverHover || this.heroCursorHoverMix > 0.02)

            if (!wasActive || magnifierVisible) {
                this.heroCursorGlassPos = { x, y }
            }

            this.startHeroCursorGlassFollow()

            if (inRange) {
                this.heroIntroPointer = { x, y }
                if (this.heroIntroPointerRaf != null) return
                this.heroIntroPointerRaf = requestAnimationFrame(() => {
                    this.heroIntroPointerRaf = null
                    this.applyHeroIntroPointerShift()
                })
                return
            }

            if (this.heroIntroPointerRaf != null) {
                cancelAnimationFrame(this.heroIntroPointerRaf)
                this.heroIntroPointerRaf = null
            }
            this.heroIntroPointer = null
            this.clearHeroIntroPointerShift()
        },
        startHeroCursorGlassFollow() {
            if (this.heroCursorGlassRaf != null) return

            const tick = () => {
                this.heroCursorGlassRaf = null
                if (!this.heroCursorActive) return

                const { x: tx, y: ty } = this.heroCursorPos
                const proximityTarget = this.getHeroIntroRangeProximityMix(tx, ty)
                const rangeLerp = proximityTarget >= this.heroCursorRangeMix ? 0.14 : 0.17
                this.heroCursorRangeMix +=
                    (proximityTarget - this.heroCursorRangeMix) * rangeLerp

                const hoverTarget =
                    !this.heroCursorInRange && this.isHeroCursorOverHoverTarget(tx, ty) ? 1 : 0
                const magnifierVisible =
                    !this.heroCursorInRange &&
                    (hoverTarget === 1 || this.heroCursorHoverMix > 0.02)
                const { x: gx, y: gy } = this.heroCursorGlassPos
                const transitionBoost =
                    this.heroCursorRangeMix * (1 - this.heroCursorRangeMix) * 4
                const follow = this.heroCursorInRange
                    ? 0.34 + transitionBoost * 0.55
                    : 0.13 + this.heroCursorRangeMix * 0.22 + transitionBoost * 0.35
                const nx = gx + (tx - gx) * follow
                const ny = gy + (ty - gy) * follow

                // Keep the hover magnifier and its ring on one layer — no trailing ghost.
                if (magnifierVisible) {
                    this.heroCursorGlassPos = { x: tx, y: ty }
                } else if (this.heroCursorInRange && Math.hypot(tx - nx, ty - ny) < 0.4) {
                    this.heroCursorGlassPos = { x: tx, y: ty }
                } else {
                    this.heroCursorGlassPos = { x: nx, y: ny }
                }

                this.heroCursorOverHover = hoverTarget === 1
                const hoverLerp = this.heroCursorInRange ? 0.3 : 0.16
                this.heroCursorHoverMix += (hoverTarget - this.heroCursorHoverMix) * hoverLerp
                this.heroCursorRangeTight =
                    this.heroCursorInRange && this.isHeroIntroPointerTight(tx, ty)

                if (hoverTarget === 1 && this.heroCursorMirrorHoverTarget !== 1) {
                    this.refreshHeroCursorMirror()
                }
                this.heroCursorMirrorHoverTarget = hoverTarget
                this.updateHeroCursorMagnifierLayout()

                this.heroCursorGlassRaf = requestAnimationFrame(tick)
            }

            this.heroCursorGlassRaf = requestAnimationFrame(tick)
        },
        stopHeroCursorGlassFollow() {
            if (this.heroCursorGlassRaf == null) return
            cancelAnimationFrame(this.heroCursorGlassRaf)
            this.heroCursorGlassRaf = null
            this.destroyHeroCursorMirror()
        },
        refreshHeroCursorMirror() {
            const root = this.$refs.heroCursorMirrorRoot
            const source = this.$el?.classList?.contains('portfolio-page') ? this.$el : null
            if (!root || !source) return

            this.clearHeroCursorMirrorHoverState()
            root.innerHTML = ''
            const clone = source.cloneNode(true)
            clone.setAttribute('aria-hidden', 'true')
            clone.classList.add('hero-intro-cursor-mirror-clone')
            clone.querySelectorAll('.hero-intro-cursor-ball, .hero-intro-cursor-magnifier').forEach(
                (el) => el.remove()
            )
            root.appendChild(clone)
            this.heroCursorMirrorClone = clone
            this.syncHeroCursorMirrorClone()
        },
        syncHeroCursorMirrorClone() {
            const source = this.$el?.classList?.contains('portfolio-page') ? this.$el : null
            const clone = this.heroCursorMirrorClone
            if (!source || !clone) return null

            const sourceRect = source.getBoundingClientRect()
            clone.style.position = 'absolute'
            clone.style.left = `${sourceRect.left}px`
            clone.style.top = `${sourceRect.top}px`
            clone.style.width = `${source.offsetWidth}px`
            clone.style.minHeight = `${source.offsetHeight}px`

            for (const selector of HERO_CURSOR_MIRROR_FIXED_SELECTORS) {
                const live = source.querySelector(selector)
                const mirrored = clone.querySelector(selector)
                if (!live || !mirrored) continue

                const liveRect = live.getBoundingClientRect()
                mirrored.style.position = 'absolute'
                mirrored.style.left = `${liveRect.left - sourceRect.left}px`
                mirrored.style.top = `${liveRect.top - sourceRect.top}px`
                mirrored.style.width = `${liveRect.width}px`
                mirrored.style.height = `${liveRect.height}px`
                mirrored.style.right = 'auto'
                mirrored.style.bottom = 'auto'
            }

            return sourceRect
        },
        updateHeroCursorMagnifierLayout() {
            const rangeMix = this.heroCursorRangeMix
            const hoverMix = this.heroCursorInRange ? 0 : this.heroCursorHoverMix
            const { expand } = heroCursorHoverMorph(hoverMix)
            if (expand <= 0.02 || !this.heroCursorMirrorClone) {
                this.heroCursorMagnifierLayout = null
                this.clearHeroCursorMirrorHoverState()
                return
            }

            const scale = 1 + HERO_CURSOR_MAGNIFY_BOOST * expand
            const { x, y } = this.heroCursorGlassPos
            const size = heroCursorGlassOuterSize(hoverMix, rangeMix)
            const half = size / 2

            this.syncHeroCursorMirrorClone()
            this.syncHeroCursorMirrorHoverState(
                this.heroCursorGlassPos.x,
                this.heroCursorGlassPos.y
            )

            this.heroCursorMagnifierLayout = {
                windowLeft: x - half,
                windowTop: y - half,
                size,
                half,
                scale,
                cx: x,
                cy: y,
                opacity: expand * (1 - rangeMix),
            }
        },
        destroyHeroCursorMirror() {
            this.clearHeroCursorMirrorHoverState()
            const root = this.$refs.heroCursorMirrorRoot
            if (root) root.innerHTML = ''
            this.heroCursorMirrorClone = null
            this.heroCursorMagnifierLayout = null
            this.heroCursorMirrorHoverTarget = 0
        },
        setHeroIntroPointer(x, y, { showBall = false, immediate = false } = {}) {
            if (showBall) {
                this.heroCursorPos = { x, y }
                this.heroCursorActive = true
            }
            this.heroIntroPointer = { x, y }

            if (this.isHeroIntroMobileTouch()) {
                if (immediate) {
                    if (this.heroIntroPointerRaf != null) {
                        cancelAnimationFrame(this.heroIntroPointerRaf)
                        this.heroIntroPointerRaf = null
                    }
                    this.applyHeroIntroPointerShift()
                    return
                }
                if (this.heroIntroPointerRaf != null) return
                this.heroIntroPointerRaf = requestAnimationFrame(() => {
                    this.heroIntroPointerRaf = null
                    this.applyHeroIntroPointerShift()
                })
                return
            }

            if (this.heroIntroPointerRaf != null) return
            this.heroIntroPointerRaf = requestAnimationFrame(() => {
                this.heroIntroPointerRaf = null
                this.applyHeroIntroPointerShift()
            })
        },
        clearHeroIntroTapLinger() {
            clearTimeout(this.heroIntroTapLingerTimer)
            this.heroIntroTapLingerTimer = null
        },
        releaseHeroIntroMobileTouch({ linger = false, pointerId = null } = {}) {
            this.disableHeroIntroTouchGuard()
            this.releaseHeroIntroPointerCapture(pointerId ?? this.heroIntroActivePointerId)
            this.heroIntroTouchStart = null
            this.heroIntroTouchMode = null
            this.heroIntroActivePointerId = null
            this.setHeroIntroStrokeActive(false)
            if (this.heroIntroPointerRaf != null) {
                cancelAnimationFrame(this.heroIntroPointerRaf)
                this.heroIntroPointerRaf = null
            }

            if (!linger || !this.heroIntroPointer) {
                this.clearHeroIntroTapLinger()
                this.heroIntroPointer = null
                this.clearHeroIntroPointerShift()
                return
            }

            this.applyHeroIntroPointerShift()
            this.clearHeroIntroTapLinger()
            const intro = this.$el?.querySelector('.hero-intro.hero-intro--chars')
            const lingerMs = intro
                ? parseCssPx(getComputedStyle(intro), '--hero-intro-tap-linger', 260)
                : 260
            this.heroIntroTapLingerTimer = setTimeout(() => {
                this.heroIntroTapLingerTimer = null
                this.heroIntroPointer = null
                this.setHeroIntroStrokeActive(false)
                this.clearHeroIntroPointerShift()
            }, lingerMs)
        },
        onHeroPointerEndHandlerImpl() {
            if (this.heroCursorBootLocked) return

            this.disableHeroIntroTouchGuard()
            this.releaseHeroIntroPointerCapture(this.heroIntroActivePointerId)
            this.heroIntroTouchStart = null
            this.heroIntroTouchMode = null
            this.setHeroIntroStrokeActive(false)
            this.clearHeroIntroTapLinger()
            this.heroIntroActivePointerId = null
            this.heroCursorActive = false
            this.heroCursorInRange = false
            this.heroCursorRangeTight = false
            this.heroCursorRangeMix = 0
            this.heroCursorHoverMix = 0
            this.heroCursorOverHover = false
            this.heroCursorHoverLockEl = null
            this.syncHeroCursorDocumentClass()
            this.stopHeroCursorGlassFollow()
            if (this.heroIntroPointerRaf != null) {
                cancelAnimationFrame(this.heroIntroPointerRaf)
                this.heroIntroPointerRaf = null
            }
            this.heroIntroPointer = null
            this.clearHeroIntroPointerShift()
        },
        onHeroPointerDownHandler(event) {
            if (!this.canHeroIntroPointerPlay()) return
            if (!this.isHeroIntroMobileTouch()) return
            if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return
            if (!this.isHeroIntroPointerNear(event.clientX, event.clientY)) return

            this.clearHeroIntroTapLinger()
            this.heroIntroActivePointerId = event.pointerId
            this.heroIntroTouchStart = { x: event.clientX, y: event.clientY }
            this.heroIntroTouchMode = 'stroke'
            this.setHeroIntroStrokeActive(true)
            this.captureHeroIntroPointer(event)
            if (event.pointerType === 'touch') {
                this.enableHeroIntroTouchGuard()
            }
            this.setHeroIntroPointer(event.clientX, event.clientY, { immediate: true })
        },
        onHeroPointerUpHandler(event) {
            if (this.heroIntroActivePointerId !== event.pointerId) return
            if (this.isHeroIntroMobileTouch()) {
                const wasStroke = this.heroIntroTouchMode === 'stroke'
                this.releaseHeroIntroMobileTouch({
                    linger: wasStroke,
                    pointerId: event.pointerId,
                })
                return
            }
            this.onHeroPointerEndHandlerImpl()
        },
        onHeroPointerMoveHandler(event) {
            if (this.isHeroIntroFinePointer() && event.pointerType === 'mouse' && this.heroIntroLetterMode) {
                this.updateHeroFinePointer(event.clientX, event.clientY, {
                    introEffects: this.canHeroIntroPointerPlay(),
                })
                return
            }

            if (!this.canHeroIntroPointerPlay()) return

            if (
                this.isHeroIntroMobileTouch() &&
                this.heroIntroActivePointerId === event.pointerId
            ) {
                if (this.heroIntroTouchMode === 'swipe') return

                const gesture = this.classifyHeroIntroTouchGesture(event)
                if (gesture === 'swipe') {
                    this.enterHeroIntroSwipeMode(event.pointerId)
                    return
                }

                this.heroIntroTouchMode = 'stroke'
                this.setHeroIntroStrokeActive(true)
                this.setHeroIntroPointer(event.clientX, event.clientY)
            }
        },
        onHeroPointerScrollHandler() {
            if (!this.canHeroIntroPointerPlay()) return
            if (!this.isHeroIntroFinePointer()) return
            if (!this.heroCursorActive) return

            if (this.heroCursorMirrorHoverTarget === 1) {
                this.refreshHeroCursorMirror()
            }

            if (this.heroIntroScrollRaf != null) return
            this.heroIntroScrollRaf = requestAnimationFrame(() => {
                this.heroIntroScrollRaf = null

                if (!this.heroCursorActive) return

                const { x, y } = this.heroCursorPos
                this.updateHeroFinePointer(x, y)
            })
        },
        applyHeroIntroPointerShift() {
            const intro = this.$el?.querySelector('.hero-intro.hero-intro--chars')
            const pointer = this.heroIntroPointer
            if (!intro || !pointer) return

            const introStyles = getComputedStyle(intro)
            const radius = parseCssPx(introStyles, '--hero-intro-hover-radius', 160)
            const maxShift = parseCssPx(introStyles, '--hero-intro-hover-shift', 84)
            const maxLift = parseCssPx(introStyles, '--hero-intro-hover-lift', 32)
            const forceExp = parseCssPx(introStyles, '--hero-intro-hover-force-exp', 2.65)
            const liftExp = parseCssPx(introStyles, '--hero-intro-hover-lift-exp', 2.2)
            const minForce = parseCssPx(introStyles, '--hero-intro-hover-min-force', 0)
            const radiusExitMult = parseCssPx(introStyles, '--hero-intro-hover-radius-exit-mult', 1)
            const { x, y } = pointer

            for (const el of intro.querySelectorAll('.hero-intro-char')) {
                const rect = el.getBoundingClientRect()
                if (rect.width <= 0 || rect.height <= 0) {
                    el.classList.remove('hero-intro-char--pushed')
                    el.style.removeProperty('--hero-intro-push-x')
                    el.style.removeProperty('--hero-intro-push-y')
                    continue
                }

                const cx = rect.left + rect.width / 2
                const cy = rect.top + rect.height / 2
                const dx = cx - x
                const dy = cy - y
                const dist = Math.hypot(dx, dy)
                const wasPushed = el.classList.contains('hero-intro-char--pushed')
                const effectiveRadius = wasPushed ? radius * radiusExitMult : radius

                if (dist < effectiveRadius) {
                    const t = dist <= 0 ? 1 : 1 - dist / radius
                    const force = Math.max(t ** forceExp, minForce) * maxShift
                    const lift = Math.max(t ** liftExp, minForce) * maxLift
                    let nx
                    let ny
                    if (dist <= 0.5) {
                        nx = 0
                        ny = -1
                    } else {
                        nx = dx / dist
                        ny = dy / dist
                    }
                    el.classList.add('hero-intro-char--pushed')
                    el.style.setProperty('--hero-intro-push-x', `${nx * force}px`)
                    el.style.setProperty('--hero-intro-push-y', `${ny * force - lift}px`)
                } else {
                    el.classList.remove('hero-intro-char--pushed')
                    el.style.removeProperty('--hero-intro-push-x')
                    el.style.removeProperty('--hero-intro-push-y')
                }
            }
        },
        clearHeroIntroPointerShift() {
            this.heroIntroPointer = null
            const intro = this.$el?.querySelector('.hero-intro.hero-intro--chars')
            if (!intro) return
            for (const el of intro.querySelectorAll('.hero-intro-char')) {
                el.classList.remove('hero-intro-char--pushed')
                el.style.removeProperty('--hero-intro-push-x')
                el.style.removeProperty('--hero-intro-push-y')
            }
        },
        liftHeroLine() {
            if (this.heroLinePhase === 'bouncing' || this.heroLinePhase === 'up') return
            const line = this.getHeroLineEl()
            if (line) {
                line.removeEventListener('transitionend', this.onHeroLineReturnEnd)
                line.style.removeProperty('transform')
            }
            if (!this.heroLineKnotClipped) {
                this.heroLineKnotClipped = true
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

            if (this.heroLineKnotClipped) {
                this.heroLineKnotClipped = false
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
            line.style.transition = `transform ${duration} ease, clip-path 0.35s ease`
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
            if (!window.matchMedia(SMALL_MOBILE_MEDIA_QUERY).matches) return
            if (prefersReducedMotion()) return

            const footer = this.$el?.querySelector('.site-footer')
            const threshold = footer?.offsetHeight || 120
            const doc = document.documentElement
            const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight)
            if (remaining <= threshold) {
                this.startAboutBallDrop()
            }
        },
        startAboutBallDrop() {
            if (this.aboutBallDropped) return
            if (!window.matchMedia(SMALL_MOBILE_MEDIA_QUERY).matches) return
            if (prefersReducedMotion()) return
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
            if (!window.matchMedia(SMALL_MOBILE_MEDIA_QUERY).matches) return
            // Skip while about fly-ins are running — mutating those elements
            // to measure was restarting the entrance animations.
            if (this.aboutRevealed && !this.aboutEntranceDone) return

            const about = this.$el?.querySelector('.about')
            if (!about) return

            about.style.removeProperty('--about-ball-x')
        },
        onHeroDecorResize() {
            this.beginHeroDecorResizeClip()
            requestAnimationFrame(() => {
                this.lockHeroViewportHeight()
                this.syncDecorLineX()
                this.syncHeroDecorHeight()
                this.syncProjectCaptionLineOffset()
                this.syncAboutBallPosition()
                this.syncAboutLocationTextClip()
                if (!this.pageRevealed) {
                    this.syncHeroIntroCharColumns()
                }
                this.endHeroDecorResizeClip()
                this.updateHeroLocationVisibility()
            })
        },
        /**
         * Left-biased stagger with per-letter random jitter. Delays are scaled
         * so the last letter finishes with the CTA button fly-in.
         */
        syncHeroIntroCharColumns() {
            if (!this.heroIntroLetterMode) return

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
            const ctaDelay = parseCssTimeSec(pageStyles, '--cta-fly-delay', 0.08)
            const ctaDuration =
                parseCssTimeSec(pageStyles, '--cta-fly-duration', 0) ||
                parseCssTimeSec(pageStyles, '--fly-duration', 1.25)
            const ctaEnd = ctaDelay + ctaDuration
            const lineFlyDurationRaw = pageStyles.getPropertyValue('--hero-line-fly-duration').trim()
            const lineFlyDelay = parseCssTimeSec(pageStyles, '--hero-line-fly-delay', 0.08)
            const lineFlyDuration = lineFlyDurationRaw ? parseFloat(lineFlyDurationRaw) : 0
            const cascadeStart = parseCssTimeSec(
                introStyles,
                '--hero-intro-cascade-start',
                lineFlyDurationRaw ? lineFlyDelay + lineFlyDuration + 0.14 : 0.04
            )
            const cascadeEnd = parseCssTimeSec(introStyles, '--hero-intro-cascade-end', ctaEnd)
            const charDuration = parseCssTimeSec(introStyles, '--hero-intro-char-duration', 0.85)
            const minDelay = cascadeStart
            const slowestLineMult = 1.1
            const maxDelay = Math.max(
                minDelay,
                cascadeEnd - charDuration * slowestLineMult
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

            // ":)" pops in after the cascade — a small beat later, like an afterthought
            const afterthoughtBase =
                Math.max(cascadeEnd, maxDelay + charDuration * slowestLineMult) + 0.22
            afterthoughtChars.forEach((el, idx) => {
                const delay = afterthoughtBase + idx * 0.1 + Math.random() * 0.05
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
            const workLastAnchor = this.$el?.querySelector('#work-last .project-image-wrap')
            if (!decor || !heroIntro || !workLastAnchor) {
                return
            }

            if (window.getComputedStyle(decor).display === 'none') {
                return
            }
            if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
                return
            }

            const wrap = decor.parentElement
            const imageTop = workLastAnchor.getBoundingClientRect().top
            const offset =
                parseFloat(getComputedStyle(decor).getPropertyValue('--hero-decor-bottom-offset')) || 0

            const introRect = heroIntro.getBoundingClientRect()
            const wrapTop = wrap.getBoundingClientRect().top
            const decorStyles = getComputedStyle(decor)
            const topOffset =
                parseFloat(decorStyles.getPropertyValue('--hero-decor-top-offset')) || 0
            const belowIntroGap =
                parseFloat(decorStyles.getPropertyValue('--hero-decor-below-intro-gap')) || 0
            const clipTop =
                belowIntroGap > 0 ? introRect.bottom + belowIntroGap : introRect.top + topOffset
            decor.style.top = `${Math.round(clipTop - wrapTop)}px`

            const height = Math.round(imageTop - clipTop) + offset

            if (height > 0) {
                decor.style.setProperty('--hero-decor-height', `${height}px`)
            }

            this.syncAboutLineBridge()
        },
        onHeroDecorFlyEnd(event) {
            if (!String(event.animationName).includes('portfolio-fly-from-right')) return
            this.publishDecorLineAlign()
        },
        syncDecorLineX() {
            if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) return

            const anchor = this.$el?.querySelector('.hero-decor-anchor')
            if (!anchor || window.getComputedStyle(anchor).display === 'none') return

            const pageLeft = this.$el.getBoundingClientRect().left
            const strokeX = parseCssPx(getComputedStyle(this.$el), '--hero-decor-line-stroke-x', 34)
            const anchorRect = anchor.getBoundingClientRect()
            this.$el.style.setProperty(
                '--portfolio-decor-line-x',
                `${Math.round(anchorRect.left - pageLeft + strokeX)}px`,
            )
        },
        publishDecorLineAlign() {
            if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) return
            if (this.heroDecorHidden) return

            const anchor = this.$el?.querySelector('.hero-decor-anchor')
            if (!anchor || window.getComputedStyle(anchor).display === 'none') return

            this.syncDecorLineX()
            this.syncHeroDecorHeight()
            requestAnimationFrame(() => {
                window.dispatchEvent(new Event(PORTFOLIO_DECOR_LINE_SYNCED_EVENT))
            })
        },
        syncAboutLineBridge() {
            const bridge = this.$el?.querySelector('.about-line-bridge')
            const about = this.$el?.querySelector('.about')
            const aboutLine = this.$el?.querySelector('.about-line')
            const decor = this.$el?.querySelector('.hero-decor')
            const workLastAnchor = this.$el?.querySelector('#work-last .project-image-wrap')

            if (!bridge || !about || !decor || !workLastAnchor) return
            if (window.getComputedStyle(decor).display === 'none') return
            if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
                bridge.style.height = '0px'
                return
            }

            const pageTop = this.$el.getBoundingClientRect().top
            this.syncDecorLineX()

            const workLastBottom = workLastAnchor.getBoundingClientRect().bottom
            const aboutLineTop = (aboutLine ?? about).getBoundingClientRect().top - pageTop
            const bridgeOverlap = 2
            const bridgeTop = Math.floor(workLastBottom - pageTop)
            const bridgeBottom = Math.ceil(aboutLineTop) + bridgeOverlap
            const bridgeHeight = Math.max(0, bridgeBottom - bridgeTop)

            bridge.style.setProperty('--bridge-bottom', `${bridgeBottom}px`)
            bridge.style.setProperty('--bridge-h', `${bridgeHeight}px`)
            bridge.style.clipPath = 'inset(0 0 0 0)'
            if (!this.aboutLineBridgeSynced) {
                void bridge.offsetWidth
                this.aboutLineBridgeSynced = true
            }
        },
        syncProjectCaptionLineOffset() {
            const root = this.$el
            if (!root) return

            const captions = root.querySelectorAll('.work .project-caption')
            if (!captions.length) return

            if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
                for (const caption of captions) {
                    caption.style.removeProperty('--project-caption-line-offset')
                }
                return
            }

            const pageStyles = getComputedStyle(root)
            const strokeX = parseCssPx(pageStyles, '--hero-decor-line-stroke-x', 34)
            const lineWidth = parseCssPx(pageStyles, '--hero-decor-line-width', 2)
            const segments = []

            const decor = root.querySelector('.hero-decor')
            if (decor && getComputedStyle(decor).display !== 'none' && !this.heroDecorHidden) {
                const decorRect = decor.getBoundingClientRect()
                if (decorRect.height > 0) {
                    segments.push({
                        top: decorRect.top,
                        bottom: decorRect.bottom,
                        lineLeft: decorRect.left + strokeX,
                        lineRight: decorRect.left + strokeX + lineWidth,
                    })
                }
            }

            if (!this.heroLineKnotClipped) {
                const bridge = root.querySelector('.about-line-bridge')
                if (bridge && getComputedStyle(bridge).display !== 'none') {
                    const bridgeHeight =
                        parseFloat(getComputedStyle(bridge).getPropertyValue('--bridge-h')) || 0
                    if (bridgeHeight > 0) {
                        const bridgeRect = bridge.getBoundingClientRect()
                        if (bridgeRect.height > 0) {
                            segments.push({
                                top: bridgeRect.top,
                                bottom: bridgeRect.bottom,
                                lineLeft: bridgeRect.left + strokeX,
                                lineRight: bridgeRect.left + strokeX + lineWidth,
                            })
                        }
                    }
                }
            }

            for (const caption of captions) {
                const capRect = caption.getBoundingClientRect()
                let offset = 0

                for (const segment of segments) {
                    if (segment.bottom <= capRect.top || segment.top >= capRect.bottom) continue
                    if (segment.lineLeft >= capRect.right) continue

                    const clearance = capRect.left - segment.lineRight
                    if (clearance >= PROJECT_CAPTION_LINE_GAP) continue

                    offset = Math.max(
                        offset,
                        Math.ceil(segment.lineRight + PROJECT_CAPTION_LINE_GAP - capRect.left),
                    )
                }

                if (offset > 0) {
                    caption.style.setProperty('--project-caption-line-offset', `${offset}px`)
                } else {
                    caption.style.removeProperty('--project-caption-line-offset')
                }
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
    --font-weight-scale: 0.98;
    --text: #2c2c2c;
    --muted: #757575;
    --title: #4d4d4d;
    --about-muted: #928a81;
    --about-location-color: #928a81;
    --about-location-icon-fill: #b9b4ae;
    --about-bg: #f4f2f1;
    --page-max: 1454px;
    /* Cap pad at 100px; only drop toward 39px once content is 939px (offset slide exhausted) */
    --page-pad: max(39px, min(100px, calc((100vw - 939px) / 2)));
    --project-w: min(939px, 100%);
    --project-w-wide: min(1060px, 100%);
    --project-stack-gap: clamp(120px, calc(120px + (100vw - 997px) * 30 / 457), 150px);
    --top-bar-height: 120px;
    --top-bar-logo-height: 52px;
    --top-bar-nav-height: 30px;
    --top-bar-edge-pad-right: calc((var(--top-bar-height) - var(--top-bar-nav-height)) / 2);
    --top-bar-logo-inset: calc((var(--top-bar-height) - var(--top-bar-logo-height)) / 2);
    --hero-logo-gap: 150px;
    --hero-squiggle-left: clamp(
        120px,
        calc(120px + (100vw - 997px) * 1 / 457),
        121px
    );
    --hero-squiggle-width: 56px;
    /* SVG stroke is centered on x=35; match the 2px border-left left edge at x=34 */
    --hero-decor-line-stroke-x: 34px;
    --hero-decor-line-width: 2px;
    --hero-decor-line-natural-height: 3200px;
    --portfolio-main-inset-left: max(0px, (100vw - var(--page-max)) / 2);
    --hero-intro-left: calc(var(--hero-squiggle-left) + var(--hero-squiggle-width) + 23px);
    --portfolio-decor-line-x: calc(
        var(--portfolio-main-inset-left) + var(--page-pad) + var(--hero-squiggle-left) +
            var(--hero-decor-line-stroke-x)
    );
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

.portfolio-page--reveal .project--featured.portfolio-fly--from-right:not(.project--scroll-fade),
.portfolio-page--reveal
    .project--upcoming:not(.project--offset).portfolio-fly--from-right:not(.project--scroll-fade) {
    animation: portfolio-fly-from-right var(--fly-duration) var(--fly-ease) 0.08s both;
}

/* Squiggle snappier; paragraph a touch slower — not in lockstep */
.portfolio-page--reveal .hero-decor.portfolio-fly--from-right {
    animation: portfolio-fly-from-right var(--hero-line-fly-duration, 1.05s) var(--fly-ease)
        var(--hero-line-fly-delay, 0.08s) both;
}

.portfolio-page--reveal .hero-intro.portfolio-fly--from-right:not(.hero-intro--chars) {
    animation: portfolio-fly-from-right 1.55s var(--fly-ease) 0.08s both;
}

.portfolio-page--reveal .project--offset.portfolio-fly--from-left:not(.project--scroll-fade) {
    animation: portfolio-fly-from-left var(--fly-duration) var(--fly-ease) 0.08s both;
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
}

.portfolio-page--settled .portfolio-main .project.portfolio-fly:not(.project--scroll-fade),
.portfolio-page--settled .portfolio-main .project.portfolio-fly.project--scroll-fade.project--in-view {
    opacity: 1;
}

/* Mobile: off-screen case studies fade in on scroll; desktop shows all immediately */
.portfolio-page--reveal .project.portfolio-fly.project--scroll-fade,
.portfolio-page--settled .portfolio-main .project.portfolio-fly.project--scroll-fade {
    opacity: 0;
    transform: none;
    animation: none !important;
    transition: opacity 0.55s ease-out;
    will-change: opacity;
}

.portfolio-page--reveal .project.portfolio-fly.project--scroll-fade.project--in-view,
.portfolio-page--settled .portfolio-main .project.portfolio-fly.project--scroll-fade.project--in-view {
    opacity: 1;
    will-change: auto;
}

.portfolio-page--settled .hero-intro--chars .hero-intro-char {
    opacity: 1;
    transform: none;
    animation: none !important;
    will-change: auto;
}

@media (hover: hover) and (pointer: fine) {
    .hero-intro.hero-intro--chars {
        --hero-cursor-zone-pad-default: 80px;
        --hero-cursor-zone-pad-tight: 4px;
        --hero-cursor-nav-proximity: 80px;
        --hero-intro-hover-radius: 160px;
        --hero-intro-hover-shift: 84px;
        --hero-intro-hover-lift: 32px;
        --hero-intro-hover-force-exp: 2.65;
        --hero-intro-hover-lift-exp: 2.2;
        --hero-intro-hover-knock-mult: 0.55;
    }

    /* Float back at cascade pace (per-letter --hero-intro-char-duration from assemble) */
    .portfolio-page--settled .hero-intro--chars .hero-intro-char {
        transform: translate3d(0, 0, 0);
        transition: transform var(--hero-intro-char-duration, 0.85s) var(--fly-ease);
        will-change: transform;
    }

    /* Knock outward in slow motion, same easing as the cascade fly-in */
    .portfolio-page--settled .hero-intro--chars .hero-intro-char.hero-intro-char--pushed {
        transform: translate3d(
            var(--hero-intro-push-x, 0),
            var(--hero-intro-push-y, 0),
            0
        );
        transition: transform
            calc(var(--hero-intro-char-duration, 0.85s) * var(--hero-intro-hover-knock-mult, 0.42))
            var(--fly-ease);
    }
}

@media (max-width: 799px) {
    .hero-intro.hero-intro--chars {
        --hero-intro-tap-linger: 280ms;
        --hero-intro-swipe-min-travel: 20px;
        --hero-intro-swipe-vertical-min: 36px;
        --hero-intro-swipe-ratio: 1.7;
        --hero-cursor-zone-pad-default: 80px;
        --hero-cursor-zone-pad-tight: 4px;
        --hero-cursor-nav-proximity: 80px;
        --hero-intro-hover-radius: 160px;
        --hero-intro-hover-shift: 102px;
        --hero-intro-hover-lift: 38px;
        --hero-intro-hover-force-exp: 1.45;
        --hero-intro-hover-lift-exp: 1.25;
        --hero-intro-hover-min-force: 0;
        --hero-intro-hover-radius-exit-mult: 1.08;
        --hero-intro-hover-knock-mult: 0.34;
        touch-action: pan-y;
    }

    /* Direct follow while stroking — CSS transitions fight per-frame updates and vibrate */
    .portfolio-page--settled .hero-intro--chars.hero-intro--stroke-active .hero-intro-char {
        transition: none;
    }

    .portfolio-page--settled .hero-intro--chars .hero-intro-char {
        transform: translate3d(0, 0, 0);
        transition: transform var(--hero-intro-char-duration, 0.85s) var(--fly-ease);
        will-change: transform;
    }

    .portfolio-page--settled .hero-intro--chars .hero-intro-char.hero-intro-char--pushed {
        transform: translate3d(
            var(--hero-intro-push-x, 0),
            var(--hero-intro-push-y, 0),
            0
        );
        transition: transform
            calc(var(--hero-intro-char-duration, 0.85s) * var(--hero-intro-hover-knock-mult, 0.42))
            var(--fly-ease);
    }
}

.hero-intro-cursor-ball {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    border-radius: 50%;
    box-sizing: border-box;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    will-change: transform;
}

.hero-intro-cursor-ball--glass {
    width: 46px;
    height: 46px;
    margin: -23px 0 0 -23px;
    background: transparent;
    border: calc(1px - 0.5px * var(--hero-cursor-hover-mix, 0)) solid
        color-mix(
            in srgb,
            rgba(255, 255, 255, 0.85) calc((1 - var(--hero-cursor-hover-mix, 0)) * 100%),
            rgba(0, 10, 170, 0.7) calc(var(--hero-cursor-hover-mix, 0) * 100%)
        );
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, calc(0.9 * (1 - var(--hero-cursor-hover-mix, 0)))),
        inset 0 -1px 1px rgba(0, 10, 170, calc(0.06 * (1 - var(--hero-cursor-hover-mix, 0)))),
        0 0 4px rgba(0, 10, 170, calc(0.11 * (1 - var(--hero-cursor-hover-mix, 0)))),
        0 0 8px rgba(0, 10, 170, calc(0.065 * (1 - var(--hero-cursor-hover-mix, 0)))),
        0 0 13px rgba(0, 10, 170, calc(0.032 * (1 - var(--hero-cursor-hover-mix, 0)))),
        0 0 18px rgba(0, 10, 170, calc(0.016 * (1 - var(--hero-cursor-hover-mix, 0)))),
        0 0 calc(2px - 1px * var(--hero-cursor-hover-mix, 0))
            rgba(0, 10, 170, calc(0.44 * var(--hero-cursor-hover-mix, 0))),
        0 0 calc(1px + 2px * var(--hero-cursor-hover-mix, 0))
            rgba(0, 10, 170, calc(0.3 * var(--hero-cursor-hover-mix, 0))),
        0 0 calc(2px + 3px * var(--hero-cursor-hover-mix, 0))
            rgba(0, 10, 170, calc(0.16 * var(--hero-cursor-hover-mix, 0))),
        0 0 calc(3px + 4px * var(--hero-cursor-hover-mix, 0))
            rgba(0, 10, 170, calc(0.065 * var(--hero-cursor-hover-mix, 0))),
        0 0 calc(5px + 5px * var(--hero-cursor-hover-mix, 0))
            rgba(0, 10, 170, calc(0.022 * var(--hero-cursor-hover-mix, 0))),
            0 0 calc(7px + 6px * var(--hero-cursor-hover-mix, 0))
            rgba(0, 10, 170, calc(0.007 * var(--hero-cursor-hover-mix, 0)));
    z-index: 10002;
    isolation: isolate;
}

.hero-intro-cursor-magnifier__content {
    pointer-events: none;
}

.hero-intro-cursor-magnifier__clone-host,
.hero-intro-cursor-mirror-clone {
    pointer-events: none;
}

.hero-intro-cursor-ball--glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(255, 255, 255, 0.28);
    -webkit-backdrop-filter: blur(calc(2.5px + 1.5px * var(--hero-cursor-range-mix, 0)))
        saturate(1.35);
    backdrop-filter: blur(calc(2.5px + 1.5px * var(--hero-cursor-range-mix, 0))) saturate(1.35);
    opacity: calc(
        var(--hero-cursor-range-mix, 0) +
            (1 - var(--hero-cursor-range-mix, 0)) * (1 - var(--hero-cursor-hover-mix, 0))
    );
    pointer-events: none;
}

.hero-intro-cursor-ball--glass.hero-intro-cursor-ball--in-range::before {
    background: rgba(255, 255, 255, 0.28);
}

.hero-intro-cursor-ball--glass.hero-intro-cursor-ball--in-range {
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.9),
        inset 0 -1px 1px rgba(0, 10, 170, 0.06),
        0 0 2px rgba(0, 10, 170, 0.2),
        0 0 4px rgba(0, 10, 170, 0.15),
        0 0 7px rgba(0, 10, 170, 0.11),
        0 0 11px rgba(0, 10, 170, 0.078),
        0 0 16px rgba(0, 10, 170, 0.052),
        0 0 23px rgba(0, 10, 170, 0.032),
        0 0 32px rgba(0, 10, 170, 0.018),
        0 0 44px rgba(0, 10, 170, 0.008);
}

.hero-intro-cursor-ball--glass.hero-intro-cursor-ball--in-range.hero-intro-cursor-ball--in-range-tight {
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.9),
        inset 0 -1px 1px rgba(0, 10, 170, 0.06),
        0 0 3px rgba(0, 10, 170, 0.35),
        0 0 6px rgba(0, 10, 170, 0.26),
        0 0 10px rgba(0, 10, 170, 0.19),
        0 0 16px rgba(0, 10, 170, 0.13),
        0 0 24px rgba(0, 10, 170, 0.085),
        0 0 34px rgba(0, 10, 170, 0.055),
        0 0 48px rgba(0, 10, 170, 0.032),
        0 0 64px rgba(0, 10, 170, 0.016);
}

.hero-intro-cursor-ball--dot {
    width: 8px;
    height: 8px;
    margin: -4px 0 0 -4px;
    background: #000aaa;
    transform-origin: center center;
    z-index: 10003;
}

.hero-intro-cursor-ball--visible {
    visibility: visible;
}

.hero-intro-cursor-ball--glass.hero-intro-cursor-ball--visible {
    opacity: 1;
}

.hero-intro-cursor-ball--dot.hero-intro-cursor-ball--visible {
    opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
    :global(html.portfolio-hero-cursor),
    :global(html.portfolio-hero-cursor body),
    :global(html.portfolio-hero-cursor) *,
    .portfolio-page--hero-cursor,
    .portfolio-page--hero-cursor * {
        cursor: none !important;
    }
}

.portfolio-page--settled .hero-decor-line--knot-clipped:not(.hero-decor-line--bouncing):not(.hero-decor-line--up),
.portfolio-page--settled
    .hero-decor-line.hero-decor-line--settled.hero-decor-line--knot-clipped:not(.hero-decor-line--bouncing):not(.hero-decor-line--up) {
    clip-path: inset(0 0 45px 0);
    transition: transform var(--hero-line-return-duration) ease;
}

.about-heading.portfolio-fly--from-left {
    --fly-distance: min(56vw, 480px);
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
    .portfolio-page--reveal .hero-intro--chars .hero-intro-char,
    .hero-intro-afterthought-char {
        max-width: none;
        opacity: 1;
        transform: none;
        animation: none;
        will-change: auto;
    }

    .hero-intro-afterthought-cursor {
        display: none;
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

@media (min-width: 800px) {
    .loading-splash {
        display: block;
    }

    /* Align top half of frame (the mark) with .portfolio-top-bar .logo */
    .loading-splash-frame {
        position: fixed;
        top: var(--top-bar-logo-inset);
        left: var(--top-bar-logo-inset);
        width: calc(var(--top-bar-logo-height) * 2);
        height: calc(var(--top-bar-logo-height) * 2);
    }
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
    z-index: 1;
    isolation: isolate;
    width: 100%;
    max-width: var(--page-max);
    margin: 0 auto;
    padding: var(--top-bar-height) var(--page-pad) 0;
    box-sizing: border-box;
}

.about-line-bridge {
    --hero-line-bounce-duration: 1.2s;
    --hero-line-return-duration: 0.4s;
    --bridge-bottom: 0px;
    --bridge-h: 0px;
    position: absolute;
    left: calc(var(--portfolio-decor-line-x) - var(--hero-decor-line-stroke-x));
    top: calc(var(--bridge-bottom) - var(--bridge-h));
    width: var(--hero-squiggle-width);
    height: var(--bridge-h);
    overflow: hidden;
    pointer-events: none;
    z-index: 2;
    clip-path: inset(0 0 0 0);
    transition: none;
    display: none;
}

.about-line-bridge--retract {
    animation: about-line-bridge-retract var(--hero-line-bounce-duration) forwards;
}

.about-line-bridge--extend {
    transition: clip-path var(--hero-line-return-duration) ease;
}

@media (min-width: 800px) {
    .about-line-bridge {
        display: block;
    }
}

.hero-location {
    display: none;
}

.hero {
    position: relative;
    z-index: 1;
    --hero-intro-max-width: 850px;
    --hero-cta-gap: 110px;
    --hero-cta-height: 57px;
    --hero-cta-width: 233px;
    /* 903px from the left edge of the first project image (content left) */
    --hero-cta-left: 862px;
    /* Text bottom → first image (CTA lives in the about section on desktop) */
    --hero-text-to-image: 437px;
    margin-bottom: var(--hero-text-to-image);
    overflow: visible;
}

.hero-intro-wrap {
    /* Match viewport-left→line stroke on the text box’s right edge */
    --hero-intro-right: calc(var(--hero-squiggle-left) + var(--hero-decor-line-stroke-x));
    position: relative;
    max-width: min(var(--hero-intro-max-width), calc(100% - var(--hero-intro-left)));
    margin: var(--hero-logo-gap) 0 0
        var(--hero-intro-left);
}

/* Resting decor-line X for nav/header sync — not affected by fly-in transform */
.hero-decor-anchor {
    position: absolute;
    top: 0;
    left: calc(var(--hero-squiggle-left) - var(--hero-intro-left));
    width: var(--hero-squiggle-width);
    height: 0;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
}

.hero-decor {
    --hero-line-lift: 72px;
    --hero-line-bounce-1: 2.2*30px;
    --hero-line-bounce-2: 2.2*12.75px;
    --hero-line-bounce-3: 2.2*5.25px;
    --hero-line-bounce-4: 2.2*2.25px;
    --hero-line-bounce-duration: 1.2s;
    --hero-line-return-duration: 0.4s;
    --hero-decor-height: 487px;
    --hero-decor-bottom-offset: 65px;
    --hero-decor-top-offset: 7px;
    --hero-decor-below-intro-gap: 0;
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

.hero-decor::after {
    content: '';
    position: absolute;
    top: 0;
    left: var(--hero-decor-line-stroke-x);
    z-index: 1;
    width: var(--hero-decor-line-width);
    height: var(--hero-decor-line-width);
    border-radius: 50%;
    background: var(--brand);
    pointer-events: none;
}

.hero-decor picture {
    display: contents;
}

.hero-decor-line,
.portfolio-decor-line-img {
    position: absolute;
    left: 0;
    display: block;
    width: var(--hero-squiggle-width);
    min-width: var(--hero-squiggle-width);
    max-width: var(--hero-squiggle-width);
    height: var(--hero-decor-line-natural-height);
    min-height: var(--hero-decor-line-natural-height);
    object-fit: none;
}

.hero-decor-line {
    bottom: 0;
    object-position: left bottom;
    transform: translateY(0);
    clip-path: inset(0);
    transition: transform var(--hero-line-return-duration) ease;
}

.portfolio-decor-line-img {
    top: 0;
    object-position: left top;
}

.about-line {
    position: absolute;
    left: calc(var(--portfolio-decor-line-x) - var(--hero-decor-line-stroke-x));
    top: calc(140px - var(--about-gap));
    z-index: 2;
    width: var(--hero-squiggle-width);
    height: var(--about-photo-h);
    overflow: hidden;
    pointer-events: none;
}

.hero-decor-line--knot-clipped:not(.hero-decor-line--bouncing):not(.hero-decor-line--up) {
    clip-path: inset(0 0 45px 0);
}

.portfolio-page--reveal .hero-decor-line {
    transition: transform var(--hero-line-return-duration) ease;
}

/* After entrance: ease into clipped knot once the bounce has been triggered */
.portfolio-page--reveal
    .hero-decor-line.hero-decor-line--settled.hero-decor-line--knot-clipped:not(.hero-decor-line--bouncing):not(.hero-decor-line--up) {
    clip-path: inset(0 0 45px 0);
    transition:
        transform var(--hero-line-return-duration) ease,
        clip-path 0.35s ease;
}

/* While viewport/layout is syncing, hide the knot so it can’t flash in the CTA gap */
.hero-decor.hero-decor--resizing .hero-decor-line--knot-clipped:not(.hero-decor-line--bouncing):not(.hero-decor-line--up) {
    clip-path: inset(0 0 45px 0);
    transition: transform var(--hero-line-return-duration) ease;
}

/* Mobile / breakpoint handoff: invisible but still layout-measurable */
.hero-decor.hero-decor--hidden {
    visibility: hidden;
    opacity: 0;
}

.hero-decor-line--bouncing {
    clip-path: inset(0);
    transition: none;
    animation: hero-line-bounce-up var(--hero-line-bounce-duration) forwards;
}

.hero-decor-line--up {
    clip-path: inset(0);
    transform: translateY(calc(-1 * var(--hero-line-lift)));
    transition: none;
}

@keyframes about-line-bridge-retract {
    0% {
        clip-path: inset(0 0 0 0);
    }

    22% {
        clip-path: inset(97% 0 0 0);
    }

    38% {
        clip-path: inset(76% 0 0 0);
    }

    49% {
        clip-path: inset(93% 0 0 0);
    }

    60% {
        clip-path: inset(84% 0 0 0);
    }

    67% {
        clip-path: inset(96% 0 0 0);
    }

    73% {
        clip-path: inset(91% 0 0 0);
    }

    78% {
        clip-path: inset(98.5% 0 0 0);
    }

    100% {
        clip-path: inset(100% 0 0 0);
    }
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
    font-size: 25px;
    font-style: normal;
    font-weight: 400;
    line-height: 37.5px;
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

.hero-intro-word-space {
    white-space: pre;
}

.hero-intro-em {
    color: var(--brand);
    font-weight: 600;
    white-space: nowrap;
}

.hero-intro-em--keep {
    white-space: nowrap;
}

.hero-intro-afterthought {
    display: inline;
    color: var(--brand);
    font-weight: 600;
}

.hero-intro-afterthought-char {
    display: inline;
}

.hero-intro-char--afterthought {
    color: var(--brand);
    font-weight: 600;
}

.hero-intro-afterthought-cursor {
    display: none;
}

/* Desktop: type ":)" after the block fly-in — cursor first, then one char at a time */
@media (min-width: 800px) {
    .hero-intro {
        --hero-intro-fly-end: 1.63s; /* 0.08s delay + 1.55s duration */
        --hero-intro-afterthought-beat: 0.06s;
        --hero-intro-afterthought-start: calc(
            var(--hero-intro-fly-end) + var(--hero-intro-afterthought-beat)
        );
        --hero-intro-type-cursor-lead: 0.18s;
        --hero-intro-type-char-2-gap: 0.38s; /* brief beat between : and ) */
        --hero-intro-type-char-1-at: var(--hero-intro-type-cursor-lead);
        --hero-intro-type-char-2-at: calc(
            var(--hero-intro-type-cursor-lead) + var(--hero-intro-type-char-2-gap)
        );
        --hero-intro-type-cursor-post-blink: 1.06s;
        --hero-intro-type-end: calc(
            var(--hero-intro-afterthought-start) + var(--hero-intro-type-char-2-at) +
                var(--hero-intro-type-cursor-post-blink)
        );
    }

    .hero-intro-afterthought-char {
        display: inline-block;
        max-width: 0;
        overflow: hidden;
        vertical-align: bottom;
        opacity: 0;
    }

    .hero-intro-afterthought-cursor {
        display: inline-block;
        width: 0.1em;
        min-width: 2px;
        height: 0.92em;
        margin-left: 0.04em;
        background: transparent;
        box-shadow: inset 2px 0 0 0 var(--brand);
        vertical-align: -0.1em;
        opacity: 0;
        overflow: hidden;
        /* Always occupy the slot — hide visually, never collapse width */
        visibility: hidden;
    }

    .portfolio-page--reveal .hero-intro-afterthought-char:nth-child(1) {
        animation: hero-intro-char-reveal 0.02s steps(1, end)
            calc(var(--hero-intro-afterthought-start) + var(--hero-intro-type-char-1-at)) forwards;
    }

    .portfolio-page--reveal .hero-intro-afterthought-char:nth-child(2) {
        animation: hero-intro-char-reveal 0.02s steps(1, end)
            calc(var(--hero-intro-afterthought-start) + var(--hero-intro-type-char-2-at)) forwards;
    }

    .portfolio-page--reveal .hero-intro-afterthought-cursor {
        visibility: visible;
        --hero-intro-type-cursor-post-at: calc(
            var(--hero-intro-afterthought-start) + var(--hero-intro-type-char-2-at)
        );
        animation:
            hero-intro-cursor-on 0.001s linear var(--hero-intro-afterthought-start) forwards,
            hero-intro-cursor-blink var(--hero-intro-type-char-2-at) step-end
                var(--hero-intro-afterthought-start) forwards,
            hero-intro-cursor-post-on 0.001s linear var(--hero-intro-type-cursor-post-at)
                forwards,
            hero-intro-cursor-blink var(--hero-intro-type-cursor-post-blink) step-end
                var(--hero-intro-type-cursor-post-at) 1 forwards,
            hero-intro-cursor-off 0.001s linear var(--hero-intro-type-end) forwards;
    }

    .portfolio-page--settled .hero-intro-afterthought-char {
        max-width: none;
        opacity: 1;
        animation: none !important;
    }

    .portfolio-page--settled .hero-intro-afterthought-cursor {
        opacity: 0;
        visibility: hidden;
        box-shadow: none;
    }
}

@keyframes hero-intro-char-reveal {
    to {
        opacity: 1;
        max-width: 1ch;
    }
}

@keyframes hero-intro-cursor-on {
    to {
        opacity: 1;
    }
}

@keyframes hero-intro-cursor-post-on {
    to {
        opacity: 1;
        box-shadow: inset 2px 0 0 0 var(--brand);
    }
}

@keyframes hero-intro-cursor-blink {
    0%,
    45% {
        box-shadow: inset 2px 0 0 0 var(--brand);
    }

    50%,
    95% {
        box-shadow: none;
    }

    100% {
        box-shadow: inset 2px 0 0 0 var(--brand);
    }
}

@keyframes hero-intro-cursor-off {
    to {
        opacity: 0;
        visibility: hidden;
        box-shadow: none;
    }
}

.hero-intro-lead {
    display: inline;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    width: var(--hero-cta-width);
    max-width: 100%;
    min-width: 0;
    height: var(--hero-cta-height);
    border-radius: 100px;
    background: var(--brand);
    font-family: 'Fira Code', monospace;
    font-size: 22px;
    font-weight: 500;
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
    margin-left: auto;
}

.project:last-child {
    width: var(--project-w-wide);
    max-width: 100%;
}

.project + .project {
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
    overflow: hidden;
    border-radius: 20px;
    isolation: isolate;
    background: #fff;
    transition: border-radius 0.45s ease;
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
    border-radius: 20px;
    background: #fff;
    transition: border-radius 0.45s ease;
}

.project-image-wrap .project-image {
    border-radius: 0;
    transition: none;
}

/* Touch: press feedback — clears on release so the radius can ease back */
.project:active .project-image-link .project-image,
.project:active .project-image-wrap {
    border-radius: 700px 700px 20px 20px;
}

/* Pointer devices: hover / focus (avoid sticky hover on touch) */
@media (hover: hover) and (pointer: fine) {
    .project:hover .project-image-link .project-image,
    .project:focus-within .project-image-link .project-image,
    .project:hover .project-image-wrap,
    .project:focus-within .project-image-wrap {
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
    background: rgba(255, 255, 255, 0.88);
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
    font-weight: 500;
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

@media (min-width: 800px) {
    .project-caption {
        padding-left: var(--project-caption-line-offset, 0px);
        transition: padding-left 0.4s ease;
    }
}

.project-caption-header {
    display: flex;
    align-items: flex-start;
    gap: 0;
    padding-top: 2px;
}

.project-title {
    flex: 0 1 629px;
    min-width: 0;
    margin: 0;
    font-family: 'Work Sans', sans-serif;
    font-size: 18px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 27px;
    color: var(--title);
    transition: color 0.25s ease;
}

.project-caption-link {
    display: block;
    color: inherit;
    text-decoration: none;
}

.project-caption-link .project-title {
    /* Match thumbnail border-radius timing */
    transition: color 0.45s ease;
}

/* Touch / press: blue while held, eases back on release (same as thumbnail) */
.project:not(.project--upcoming):active .project-caption-link .project-title {
    color: var(--brand);
}

/* Pointer devices: hover / focus */
@media (hover: hover) and (pointer: fine) {
    .project:hover .project-caption-link .project-title,
    .project:focus-within .project-caption-link .project-title {
        color: var(--brand);
    }
}

.project-description {
    margin: 16px 0 0;
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    letter-spacing: -0.02em;
    color: var(--muted);
}

@media (min-width: 800px) {
    .project-caption {
        min-height: 95px;
    }
}

.project-year {
    flex-shrink: 0;
    margin-left: auto;
    font-family: 'Fira Code', monospace;
    font-size: 18px;
    font-weight: 500;
    line-height: 27px;
    letter-spacing: -0.02em;
    color: var(--muted);
}

.about {
    position: relative;
    z-index: 0;
    width: 100%;
    --about-gap: 340px;
    --about-text-gap: 39px;
    --about-bio-cta-gap: calc(var(--about-text-gap) * 1.5);
    --about-extra-bio-cta-gap: calc(var(--about-bio-cta-gap) - var(--about-text-gap));
    --about-bottom-pad-base: clamp(180px, calc(180px + (100vw - 997px) * 100 / 457), 280px);
    --about-bottom-pad: calc(var(--about-bottom-pad-base) - var(--about-extra-bio-cta-gap));
    --about-image-text-gap: clamp(32px, calc(32px + (100vw - 997px) * 32 / 457), 64px);
    --about-photo-w: clamp(281px, calc(281px + (100vw - 997px) * 12 / 457), 293px);
    --about-photo-h: clamp(402px, calc(402px + (100vw - 997px) * 18 / 457), 420px);
    --about-photo-col-w: calc(2 * var(--about-image-text-gap) + var(--about-photo-w));
    --about-inner-max-w: clamp(800px, calc(800px + (100vw - 997px) * 187 / 457), 987px);
    --about-top-pad: 80px;
    --about-bio-indent: 24px;
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
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: var(--about-photo-col-w) 1fr;
    gap: 0;
    max-width: var(--about-inner-max-w);
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    align-items: start;
}

.about-photo-column {
    display: flex;
    flex-direction: column;
    padding-left: var(--about-image-text-gap);
    box-sizing: border-box;
}

.about-line--knot-clipped {
    border-radius: 1px 1px 0 0;
}

.about-photo {
    position: relative;
    z-index: 1;
    width: var(--about-photo-w);
    height: var(--about-photo-h);
    border-radius: 20px;
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
    margin: 0 0 var(--about-text-gap) 20px;
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
    font-family: 'Work Sans', sans-serif;
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
    margin: 0 0 var(--about-text-gap);
    font-family: 'Work Sans', sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 27px;
    letter-spacing: -0.02em;
    color: #928a81;
}

.about-bio {
    margin: 0 0 0 var(--about-bio-indent);
    max-width: clamp(455px, calc(455px + (100vw - 997px) * 37 / 457), 492px);
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
    letter-spacing: -0.02em;
    color: var(--text);
}

.about-link {
    color: var(--brand);
}

.about-ball {
    display: none;
}

.about-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-top: var(--about-bio-cta-gap);
    padding: 0;
}

.about-actions-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 20px;
}

.about-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    height: 54px;
    padding: 12px 24px;
    border-radius: 60px;
    background: var(--brand);
    font-family: 'Work Sans', sans-serif;
    font-size: 20px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 30px;
    white-space: nowrap;
    color: #fff;
    text-decoration: none;
    box-sizing: border-box;
    transition: background 0.2s ease;
}

.about-action-btn:hover {
    background: var(--brand-hover);
}

.about-action-btn:active {
    background: var(--brand-active);
    transition: none;
}

/* ≥1454px: Final content artboard spacing */
@media (min-width: 1454px) {
    .hero {
        /* 920px keeps "complex" on the second line at 25px / full artboard width */
        --hero-intro-max-width: 920px;
    }

    .hero-decor {
        top: 7px;
    }

    .work {
        gap: 0;
    }

    .portfolio-page {
        --project-w: 939px;
        --project-w-wide: 1060px;
    }

    .project + .project {
        margin-top: 150px;
    }

    .project-description {
        margin-top: 16px;
    }

    .about {
        --about-gap: 340px;
        --about-bottom-pad-base: 280px;
        margin-top: 340px;
        padding: var(--about-top-pad) 0 var(--about-bottom-pad);
    }

    .about-inner {
        grid-template-columns: 421px 1fr;
        max-width: 987px;
    }

    .about-photo-column {
        padding-left: var(--about-image-text-gap);
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
        margin: 0 0 var(--about-text-gap);
    }

    .about-bio {
        max-width: 492px;
    }

    .about-location {
        margin: 0 0 var(--about-text-gap) 20px;
    }
}

/* Desktop: centre hero intro on the viewport Y axis; line + work follow via layout + JS */
@media (min-width: 800px) {
    .hero-location {
        position: fixed;
        right: var(--top-bar-edge-pad-right);
        bottom: var(--top-bar-edge-pad-right);
        z-index: 99;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        margin: 0;
        padding: 0;
        pointer-events: none;
        color: var(--muted);
        opacity: 0;
        visibility: hidden;
        transition:
            opacity 0.3s ease,
            visibility 0.3s ease;
    }

    .hero-location--visible {
        opacity: 0.6;
        visibility: visible;
    }

    .hero-location-icon-wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        flex: none;
    }

    .hero-location-icon {
        display: block;
        width: 13px;
        height: 20px;
        flex: none;
    }

    .hero-location-icon :deep(path) {
        fill: currentColor;
    }

    .hero-location-text {
        font-family: 'Work Sans', sans-serif;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 30px;
        color: currentColor;
        flex: none;
        white-space: nowrap;
    }

    .portfolio-page {
        --hero-line-fly-delay: 0.08s;
        --hero-line-fly-duration: 1.05s;
        /* Line lands first (1.13s); cascade starts on a short beat after */
        --hero-intro-cascade-start: 1.27s;
        --hero-intro-cascade-end: 3.62s;
    }

    .hero-intro.hero-intro--chars.portfolio-fly {
        --hero-intro-char-duration: 1.15s;
    }

    .hero {
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* Lock to innerHeight after load so work stays below the fold (100svh can be shorter) */
        min-height: var(--desktop-hero-min-height, 100svh);
        margin-top: calc(-1 * var(--top-bar-height));
        margin-bottom: 100px;
        box-sizing: border-box;
    }

    .hero-intro-wrap {
        margin-top: 0;
        margin-right: var(--hero-intro-right);
        /* Flex child: let horizontal margins define width (mirrors line↔viewport-left) */
        max-width: none;
        width: auto;
    }

    .about-location {
        display: none;
    }
}

/* 800–1084px: intro ⅓ down viewport (logo↔location edges); deco line stacks below */
@media (min-width: 800px) and (max-width: 1084px) {
    .hero {
        justify-content: flex-start;
        padding-top: 33.333vh;
    }

    .hero-intro-wrap {
        --hero-logo-work-gap: 80px;
        --hero-decor-left: calc(
            var(--top-bar-logo-inset) + 104px + var(--hero-logo-work-gap) -
                var(--portfolio-main-inset-left) - var(--hero-decor-line-stroke-x)
        );
        width: calc(100% + 2 * var(--page-pad));
        max-width: none;
        margin-left: calc(-1 * var(--page-pad));
        margin-right: calc(-1 * var(--page-pad));
        padding-left: var(--top-bar-logo-inset);
        padding-right: var(--top-bar-edge-pad-right);
        box-sizing: border-box;
    }

    .hero-decor {
        --hero-decor-below-intro-gap: 80px;
        left: var(--hero-decor-left);
    }

    .hero-decor-anchor {
        left: var(--hero-decor-left);
    }
}

@media (min-width: 1085px) and (min-height: 800px) {
    .hero-intro-wrap {
        transform: translateY(-2vh);
    }
}

@media (max-width: 799px) {
    .portfolio-page {
        --page-pad: 20px;
        --top-bar-height: 86px;
        --hero-logo-gap: 74px;
        /* Logo top 20px + 50.4px tall (20% bigger) in the 86px bar */
        --top-bar-logo-inset: 20px;
        --mobile-block-gap: calc(2 * 84px - 25px - 20px - 15px);
        /* Longer CTA window so letter assemble has room and still lands together */
        --cta-fly-delay: 0.1s;
        --cta-fly-duration: 2.05s;
        --hero-intro-cascade-start: 0.04s;
        --hero-intro-cascade-end: 2.15s;
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
        margin-bottom: 120px;
    }

    .portfolio-main {
        padding: 0 var(--page-pad) 0;
        box-sizing: border-box;
    }

    .project--featured {
        scroll-margin-top: 0;
    }

    .hero-intro-wrap {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        /* Before load: fill viewport; after load: lock pixels so URL-bar show/hide won't shift intro */
        min-height: var(--mobile-hero-height, calc(100svh - var(--top-bar-height)));
        height: var(--mobile-hero-height, auto);
        max-width: 100%;
        width: 100%;
        margin: 0;
        padding-bottom: var(--page-pad);
        box-sizing: border-box;
    }

    .hero-intro-wrap:has(.hero-intro--chars) {
        width: calc(100% + 2 * var(--page-pad));
        max-width: none;
        margin-left: calc(-1 * var(--page-pad));
        margin-right: calc(-1 * var(--page-pad));
        padding-left: var(--page-pad);
        padding-right: var(--page-pad);
        overflow: visible;
    }

    .hero-decor {
        display: none;
    }

    .about-line-bridge {
        display: none;
    }

    .about-line {
        display: none;
    }
}

/* ≤799px: square work cards and stacked project layout */
@media (max-width: 799px) {
    .portfolio-page {
        --project-w: 100%;
        --project-w-wide: 100%;
        --project-stack-gap: 80px;
    }

    .work {
        gap: 0;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        align-items: stretch;
    }

    /* Mobile: no fly-in; off-screen cards use scroll fade */
    .portfolio-page--reveal .project.portfolio-fly:not(.project--scroll-fade),
    .portfolio-page--settled .portfolio-main .project.portfolio-fly:not(.project--scroll-fade) {
        opacity: 1;
        transform: none;
        animation: none !important;
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
        margin-top: var(--project-stack-gap);
    }

    .project-image-link,
    .project-image-wrap {
        width: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        border-radius: 20px;
        transition: border-radius 0.45s ease;
    }

    .project:active .project-image-link,
    .project:active .project-image-wrap,
    .project--press-expand .project-image-link,
    .project--press-expand .project-image-wrap,
    .project--press-expand .project-image {
        border-radius: 700px 700px 20px 20px;
    }

    @media (hover: hover) and (pointer: fine) {
        .project:hover .project-image-link,
        .project:hover .project-image-wrap,
        .project:focus-within .project-image-link,
        .project:focus-within .project-image-wrap {
            border-radius: 700px 700px 20px 20px;
        }
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
    }

    .project-caption-header {
        padding-top: 0;
        gap: 0;
        width: 100%;
    }

    /* Match desktop Fira Code weights — plain integers avoid scale snapping to lighter faces */
    .cta-button,
    .project-upcoming-label,
    .project-year {
        font-weight: 500;
    }

    .project-description {
        font-weight: 400;
    }
}

/* 601–799px: mobile hero + tablet about/text tweaks */
@media (min-width: 601px) and (max-width: 799px) {
    .about {
        --about-gap: 340px;
        --about-bottom-pad-base: 180px;
        margin-top: 340px;
        padding: var(--about-top-pad) 0 var(--about-bottom-pad);
    }

    .about-inner {
        grid-template-columns: 345px 1fr;
        max-width: 800px;
        padding: 0;
    }

    .about-photo-column {
        padding-left: var(--about-image-text-gap);
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
        line-height: 25px;
    }
}

/* 601–799px: mobile layout with desktop text sizes */
@media (min-width: 601px) and (max-width: 799px) {
    .hero-intro {
        font-size: 25px;
        line-height: 37.5px;
    }

    .project-description {
        margin: 16px 0 0;
        line-height: 25px;
    }
}

/* ≤600px: smaller type and mobile about layout */
@media (max-width: 600px) {
    #about {
        scroll-margin-top: 0;
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

    .about-ball {
        --about-ball-size: 49px;
        --about-ball-height: 46px;
        display: block;
        position: absolute;
        left: auto;
        right: 0;
        bottom: 0;
        z-index: 5;
        width: var(--about-ball-size);
        height: var(--about-ball-height);
        pointer-events: none;
        opacity: 0;
        transform: translate3d(0, -1100px, 0) rotate(0deg);
        transform-origin: center center;
    }

    .about-ball--dropped {
        opacity: 1;
    }

    .about-inner {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
        --about-side-pad: var(--page-pad);
        padding: 0 var(--about-side-pad);
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

    .about-bio {
        margin: calc(var(--about-content-shift) + var(--about-photo-h) + var(--about-stack-gap)) 0 0;
        max-width: 100%;
        font-size: 16px;
        line-height: 25px;
        font-weight: 400;
    }

    .about-actions {
        margin-top: 96px;
    }

    .hero-intro {
        max-width: 100%;
        font-size: 22px;
        line-height: 33px;
    }

    .project-caption {
        margin-top: 28px;
    }

    .project-title {
        flex: 1 1 auto;
        max-width: none;
        font-family: 'Work Sans', sans-serif;
        font-size: 18px;
        font-weight: calc(500 * var(--font-weight-scale));
        line-height: 27px;
        color: #4d4d4d;
    }

    .project-description {
        margin-top: 20px;
        max-width: 100%;
        font-family: 'Fira Code', monospace;
        font-size: 16px;
        font-weight: 400;
        line-height: 25px;
        letter-spacing: -0.02em;
        color: #757575;
    }

    .project-year {
        margin-left: auto;
        flex-shrink: 0;
        font-family: 'Fira Code', monospace;
        font-size: 18px;
        font-weight: 500;
        line-height: 27px;
        letter-spacing: -0.02em;
        color: #757575;
    }
}
</style>

<style>
/* Magnifier clone: mirror interactive hover styles (clone cannot use :hover). */
.hero-intro-cursor-mirror-clone .about-action-btn.hero-cursor-mirror-hover,
.hero-intro-cursor-mirror-clone .cta-button.hero-cursor-mirror-hover {
    background: var(--brand-hover) !important;
}

.hero-intro-cursor-mirror-clone .footer-email.hero-cursor-mirror-hover {
    color: var(--brand) !important;
}

.hero-intro-cursor-mirror-clone .project.hero-cursor-mirror-hover .project-caption-link .project-title {
    color: var(--brand) !important;
}

.hero-intro-cursor-mirror-clone .project.hero-cursor-mirror-hover .project-image-link .project-image,
.hero-intro-cursor-mirror-clone .project.hero-cursor-mirror-hover .project-image-wrap {
    border-radius: 700px 700px 20px 20px;
}

.hero-intro-cursor-mirror-clone .project--upcoming.hero-cursor-mirror-hover .project-upcoming-overlay {
    opacity: 1;
}

/* Unscoped so the keyframe name isn't rewritten away from the animation. */
@media (max-width: 600px) {
    .about-ball.about-ball--dropped {
        animation: about-ball-fall 1.75s linear forwards;
    }
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
