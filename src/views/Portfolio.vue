<template>
    <div class="portfolio-page">
        <PortfolioTopBar />

        <main class="portfolio-main">
            <section class="hero">
                <div class="hero-intro-wrap">
                    <div class="hero-decor" aria-hidden="true">
                        <picture>
                            <source
                                media="(min-width: 998px)"
                                :srcset="lineAnimationTall"
                            />
                            <source
                                media="(max-width: 997px)"
                                :srcset="lineAnimationTall"
                            />
                            <img class="hero-decor-line" :src="lineAnimation" alt="" />
                        </picture>
                    </div>
                    <p class="hero-intro">
                        <span class="hero-intro-lead">Tim Justina Yeung is a </span><strong class="hero-intro-em">Product Designer</strong> with a background in Neuroscience and research.
                        Deeply enjoy understanding complex problems and providing creative solutions
                        <strong class="hero-intro-em hero-intro-em--keep">for people :)</strong>
                    </p>
                </div>
                <a class="cta-button" href="mailto:design@timjustina.com">Drop me a line</a>
            </section>

            <section id="work" class="work">
                <article id="work-first" class="project project--featured">
                    <router-link to="/work/DashboardDesign" class="project-image-link">
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
                                <router-link to="/work/DashboardDesign" class="project-title-link">
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

                <article class="project project--offset">
                    <router-link to="/project/MultiplatformSolution" class="project-image-link">
                        <img
                            class="project-image"
                            :src="multiplatformHero"
                            alt="Home Medication Solution: IoT Multiplatform Design"
                        />
                    </router-link>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                <router-link to="/project/MultiplatformSolution" class="project-title-link">
                                    Home Medication Solution: IoT Multiplatform Design
                                </router-link>
                            </h2>
                            <span class="project-year">2024</span>
                        </div>
                        <p class="project-description">
                            Redesigned workflows, human-machine interface, web + mobile app features of an IoT medication adherence platform
                        </p>
                    </div>
                </article>

                <article class="project">
                    <router-link to="/project/art-curation" class="project-image-link">
                        <img
                            class="project-image"
                            :src="marketplaceHero"
                            alt="Art Curation and Marketplace: Mobile App Design"
                        />
                    </router-link>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                <router-link to="/project/art-curation" class="project-title-link">
                                    Art Curation and Marketplace: Mobile App Design
                                </router-link>
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

        <section id="about" class="about">
            <span class="about-line" aria-hidden="true" />
            <div class="about-inner">
                <div class="about-photo-column">
                    <img
                        v-if="aboutPhoto"
                        class="about-photo"
                        :src="aboutPhoto"
                        alt="Tim Justina Yeung"
                    />
                    <div v-else class="about-photo about-photo--placeholder" />
                </div>
                <div id="about-bio" class="about-text-column">
                    <h2 class="about-heading">About Tim ( 湉 )</h2>
                    <p class="about-location">
                        <span class="about-location-icon-wrap" aria-hidden="true">
                            <svg class="about-location-icon" width="13" height="20" viewBox="0 0 13 20" fill="none" aria-hidden="true">
                                <path
                                    d="M6.5 0C2.91 0 0 2.91 0 6.5C0 11.38 6.5 20 6.5 20S13 11.38 13 6.5C13 2.91 10.09 0 6.5 0ZM6.5 8.75C5.26 8.75 4.25 7.74 4.25 6.5C4.25 5.26 5.26 4.25 6.5 4.25C7.74 4.25 8.75 5.26 8.75 6.5C8.75 7.74 7.74 8.75 6.5 8.75Z"
                                    fill="#B9B4AE"
                                />
                            </svg>
                        </span>
                        <span class="about-location-text">London / Barcelona</span>
                    </p>
                    <p class="about-bio">
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
                        <span ref="nerdsLine" class="about-nerds">
                            For the nerds: a <a href="https://journals.biologists.com/dev/article/151/24/dev204256/363461/Short-range-Fgf-signalling-patterns-hindbrain" class="about-link">link</a> to my past life in
                            developmental neurobiology
                            (research paper).
                        </span>
                    </p>
                </div>
                <div class="about-actions">
                    <a
                        href="https://www.linkedin.com/in/timjustinayeung"
                        class="about-action-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >Linkedin</a>
                    <a href="#" class="about-action-btn">CV</a>
                </div>
            </div>
            <span
                ref="aboutBall"
                class="about-ball"
                :class="{ 'about-ball--settled': aboutBallPhase === 'settled' }"
                aria-hidden="true"
            />
        </section>

        <PortfolioSiteFooter />
    </div>
</template>

<script>
import dashboardHero from '../assets/1_dashboard/0_dashboard_hero_detail-2400.jpg'
import multiplatformHero from '../assets/2_multiplatform/0_multiplatform_hero.jpg'
import marketplaceHero from '../assets/3_marketplace/0_marketplace_hero.jpg'
import aboutPhoto from '../assets/portrait.jpg'
import lineAnimation from '../assets/line_animation.svg'
import lineAnimationTall from '../assets/line_animation_tall.svg'
import PortfolioTopBar from '../components/PortfolioTopBar.vue'
import PortfolioSiteFooter from '../components/PortfolioSiteFooter.vue'

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
            aboutBallPhase: 'idle',
        }
    },
    mounted() {
        this.heroDecorObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => this.syncHeroDecorHeight())
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
        window.addEventListener('resize', this.onHeroDecorResize, { passive: true })
        document.fonts?.ready?.then(() => this.syncHeroDecorHeight())
        this.observeNerdsLine()
    },
    beforeUnmount() {
        this.heroDecorObserver?.disconnect()
        this.nerdsLineObserver?.disconnect()
        window.removeEventListener('resize', this.onHeroDecorResize)
    },
    methods: {
        observeNerdsLine() {
            const nerdsLine = this.$refs.nerdsLine
            if (!nerdsLine || typeof IntersectionObserver === 'undefined') return

            this.nerdsLineObserver = new IntersectionObserver(
                ([entry]) => {
                    if (!entry?.isIntersecting || this.aboutBallPhase !== 'idle') return
                    this.nerdsLineObserver?.disconnect()
                    this.startAboutBallDrop()
                },
                {
                    threshold: 0.15,
                    rootMargin: '0px 0px -12% 0px',
                }
            )
            this.nerdsLineObserver.observe(nerdsLine)
        },
        startAboutBallDrop() {
            const ball = this.$refs.aboutBall
            const about = this.$el?.querySelector('.about')
            if (!ball || !about || this.aboutBallPhase !== 'idle') return

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.aboutBallPhase = 'settled'
                return
            }

            this.aboutBallPhase = 'dropping'

            const size = ball.offsetHeight || 56
            const bottomPad =
                parseFloat(getComputedStyle(about).getPropertyValue('--about-bottom-pad')) || 180
            const restOffset = Math.min(120, Math.max(48, bottomPad * 0.35))
            const endTop = Math.max(size, about.getBoundingClientRect().bottom - restOffset - size)
            const startTop = -size

            ball.style.position = 'fixed'
            ball.style.left = '50%'
            ball.style.top = `${startTop}px`
            ball.style.bottom = 'auto'
            ball.style.opacity = '1'
            ball.style.transform = 'translateX(-50%)'

            const animation = ball.animate(
                [
                    { top: `${startTop}px` },
                    { top: `${endTop}px`, offset: 0.78 },
                    { top: `${endTop - 18}px`, offset: 0.86 },
                    { top: `${endTop + 6}px`, offset: 0.93 },
                    { top: `${endTop}px` },
                ],
                {
                    duration: 1650,
                    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                    fill: 'forwards',
                }
            )

            animation.onfinish = () => {
                ball.style.removeProperty('position')
                ball.style.removeProperty('left')
                ball.style.removeProperty('top')
                ball.style.removeProperty('bottom')
                ball.style.removeProperty('opacity')
                ball.style.removeProperty('transform')
                this.aboutBallPhase = 'settled'
            }
        },
        onHeroDecorResize() {
            requestAnimationFrame(() => this.syncHeroDecorHeight())
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
    --page-pad: clamp(100px, calc(100px + (100vw - 997px) * 40 / 457), 140px);
    --project-w: min(798px, 100%);
    --project-stack-gap: clamp(120px, calc(120px + (100vw - 997px) * 20 / 457), 140px);
    --top-bar-height: 120px;

    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #fff;
    color: var(--text);
}

.portfolio-main {
    position: relative;
    max-width: var(--page-max);
    margin: 0 auto;
    padding: var(--top-bar-height) var(--page-pad) 0;
    box-sizing: border-box;
}

.hero {
    position: relative;
    z-index: 1;
    --hero-cta-gap: 90px;
    margin-bottom: clamp(231px, calc(238px - (100vw - 997px) * 7 / 457), 238px);
}

.hero-intro-wrap {
    position: relative;
    max-width: min(754px, calc(100% - 288px));
    margin: clamp(98px, calc(98px + (100vw - 997px) * 24 / 457), 122px) 0 0 288px;
}

.hero-decor {
    --hero-line-lift: 100px;
    --hero-line-bounce-1: 2.2*30px;
    --hero-line-bounce-2: 2.2*12.75px;
    --hero-line-bounce-3: 2.2*5.25px;
    --hero-line-bounce-4: 2.2*2.25px;
    --hero-line-bounce-duration: 1.2s;
    --hero-line-return-duration: 0.35s;
    --hero-decor-height: 532px;
    --hero-decor-bottom-offset: 50px;
    --hero-decor-top-offset: 6px;
    --hero-decor-line-natural-height: 818px;
    position: absolute;
    top: 6px;
    right: calc(100% + 42px);
    z-index: 0;
    width: 56px;
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
    transition: transform var(--hero-line-return-duration) ease-out;
}

.portfolio-main:has(.project--featured:hover) .hero-decor-line,
.portfolio-main:has(.project--featured:focus-within) .hero-decor-line {
    transition: none;
    animation: hero-line-bounce-up var(--hero-line-bounce-duration) forwards;
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
    letter-spacing: 0;
    color: var(--muted);
    font-synthesis: none;
}

.hero-intro-em {
    color: var(--brand);
    font-weight: calc(600 * var(--font-weight-scale));
}

.hero-intro-em--keep {
    white-space: nowrap;
}

.hero-intro-lead {
    display: none;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: var(--hero-cta-gap);
    margin-left: min(
        clamp(565px, calc(565px + (100vw - 997px) * 192 / 457), 757px),
        max(0px, calc(100% - 233px))
    );
    padding: 12px 24px;
    width: 233px;
    max-width: 100%;
    min-width: 0;
    height: 57px;
    border-radius: 100px;
    background: var(--brand);
    font-family: 'Fira Code', monospace;
    font-size: 22px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 33px;
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
    width: var(--project-w);
    max-width: 100%;
    margin-top: var(--project-stack-gap);
}

.project-image-link {
    position: relative;
    z-index: 1;
    display: block;
    text-decoration: none;
}

.project-image-link picture {
    display: block;
    width: 100%;
}

.project-image {
    position: relative;
    z-index: 1;
    width: var(--project-w);
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 12px 12px 12px 12px;
    background: #fff;
    transition: border-radius 0.45s ease;
}

.project:hover .project-image,
.project:focus-within .project-image {
    border-radius: 700px 700px 20px 20px;
}

.project:last-child:hover .project-image,
.project:last-child:focus-within .project-image {
    border-radius: 10000px 10000px 300px 300px;
}

.project-caption {
    position: relative;
    margin-top: 28px;
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
    transition: color 0.25s ease;
}

.project:hover .project-title-link,
.project:focus-within .project-title-link {
    color: var(--brand);
}

.project-description {
    margin: 17px 0 0;
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: clamp(25px, calc(25px + (100vw - 997px) / 457), 26px);
    color: var(--muted);
}

.project-year {
    flex-shrink: 0;
    margin-left: auto;
    font-family: 'Fira Code', monospace;
    font-size: 20px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 30px;
    color: var(--muted);
}

.about {
    position: relative;
    width: 100%;
    --about-gap: 340px;
    --about-image-text-gap: clamp(32px, calc(32px + (100vw - 997px) * 32 / 457), 64px);
    --about-bottom-pad: clamp(180px, calc(180px + (100vw - 997px) * 180 / 457), 360px);
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
    margin: 0 0 32px;
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

.about-location-text {
    width: 174px;
    height: 27px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 27px;
    color: var(--about-location-color);
    flex: none;
}

.about-text-column {
    padding-top: 100px;
}

.about-heading {
    margin: 0 0 32px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 27px;
    letter-spacing: -0.36px;
    color: #928a81;
}

.about-bio {
    margin: 0;
    max-width: clamp(455px, calc(455px + (100vw - 997px) * 111 / 457), 566px);
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: clamp(25px, calc(25px + (100vw - 997px) / 457), 26px);
    color: var(--text);
}

.about-link {
    color: var(--brand);
}

.about-ball {
    --about-ball-size: 56px;
    --about-ball-rest-bottom: clamp(48px, calc(var(--about-bottom-pad) * 0.35), 120px);
    position: absolute;
    left: 50%;
    bottom: var(--about-ball-rest-bottom);
    z-index: 5;
    width: var(--about-ball-size);
    height: var(--about-ball-size);
    border-radius: 50%;
    background: var(--brand);
    pointer-events: none;
    opacity: 0;
    transform: translateX(-50%);
}

.about-ball--settled {
    opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
    .about-ball--settled {
        opacity: 1;
    }
}

.about-actions {
    display: none;
}

/* ≥1454px: Final content artboard spacing */
@media (min-width: 1454px) {
    .hero-intro-wrap {
        max-width: min(754px, calc(100% - 288px));
        margin: 122px 0 0 288px;
    }

    .hero-decor {
        top: 9px;
    }

    .hero {
        margin-bottom: 231px;
    }

    .cta-button {
        margin-top: var(--hero-cta-gap);
        margin-left: min(757px, max(0px, calc(100% - 233px)));
        width: 233px;
        min-width: 0;
        height: 57px;
    }

    .work {
        gap: 0;
    }

    .project--offset,
    .project:last-child {
        margin-top: 140px;
    }

    .project-description {
        margin-top: 17px;
    }

    .about {
        --about-gap: 340px;
        --about-bottom-pad: 360px;
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
        max-width: 566px;
        margin-left: 0;
    }

    .about-location {
        margin: 0 0 39px;
    }
}

/* ≤997px: 997px artboard lock before tablet layout */
@media (max-width: 997px) {
    .portfolio-page {
        --hero-logo-gap: 98px;
        /* Logo sits above the bar bottom: (120px bar − 50px nav block) / 2 */
        --top-bar-logo-inset: 35px;
    }

    .hero {
        margin-bottom: calc(2 * var(--hero-cta-gap));
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
        margin-left: min(565px, max(0px, calc(100% - 233px)));
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

/* Tablet: ≤767px (768px artboard) */
@media (max-width: 767px) {
    .portfolio-page {
        --hero-logo-gap: 80px;
    }

    .hero-intro-wrap {
        max-width: min(629px, 100%);
    }

    .hero-decor {
        --hero-line-lift: 31px;
        right: auto;
        left: calc(100% - 40px - 56px);
    }

    .hero {
        min-height: 0;
    }

    .cta-button {
        margin-top: var(--hero-cta-gap);
        margin-left: 0;
        min-width: 233px;
        width: fit-content;
        height: 57px;
    }

    .work {
        gap: 80px;
    }

    .project,
    .project--featured,
    .project--offset,
    .project:last-child {
        width: 100%;
        max-width: 100%;
    }

    .project--offset,
    .project:last-child {
        margin-top: 0;
        margin-left: 0;
    }

    .project-image,
    .project--featured .project-image,
    .project--offset .project-image,
    .project:last-child .project-image {
        height: auto;
    }

    .about {
        margin-top: 80px;
        --about-bottom-pad: 276px;
        padding: var(--about-top-pad) 0 var(--about-bottom-pad);
    }

    .about-inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        --about-side-pad: var(--page-pad);
        padding: 0 var(--about-side-pad);
    }

    .about-photo-column,
    .about-text-column {
        display: contents;
    }

    .about-line {
        display: none;
    }

    .about-heading {
        order: 2;
        margin: var(--about-top-pad) 0 32px;
    }

    .about-photo,
    .about-photo--placeholder {
        order: 1;
        width: 201px;
        height: 288px;
    }

    .about-location {
        order: 3;
        box-sizing: border-box;
        width: calc(100% + 2 * var(--about-side-pad));
        max-width: 100vw;
        margin: 0 0 0 calc(-1 * var(--about-side-pad));
        padding-left: var(--about-side-pad);
    }

    .about-location-icon-wrap {
        width: 13px;
        height: 20px;
        justify-content: flex-start;
    }

    .about-location-text {
        color: var(--about-location-color);
    }

    .about-location-icon :deep(path) {
        fill: var(--about-location-icon-fill);
    }

    .about-bio {
        order: 4;
        margin-top: 32px;
        max-width: 100%;
        font-size: 16px;
        line-height: 25px;
    }

    .about-actions {
        order: 5;
        display: flex;
        gap: 31px;
        margin-top: 96px;
        padding-left: 0;
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
}

@media (max-width: 620px) {
    .hero-decor {
        display: none;
    }
}

@media (max-width: 560px) {
    .portfolio-page {
        --page-pad: 20px;
        --top-bar-height: 100px;
        --hero-logo-gap: 22px;
        /* Logo top 20px + 46px tall in the 100px bar */
        --top-bar-logo-inset: 34px;
    }

    .hero {
        --hero-cta-gap: 60px;
    }

    .portfolio-main {
        padding: var(--top-bar-height) 20px 0;
    }

    .hero-intro-wrap {
        max-width: 100%;
    }

    .hero-intro {
        max-width: 100%;
        font-size: 22px;
        line-height: 33px;
    }

    .cta-button {
        width: 225px;
        height: 49px;
        min-height: 49px;
        margin-left: 0;
        padding: 8px 20px;
        font-size: 22px;
        line-height: 33px;
    }

    .work {
        gap: 80px;
    }

    .project-caption {
        margin-top: 20px;
    }

    .project-caption-header {
        padding-top: 0;
    }

    .project-title {
        font-size: 18px;
        line-height: 27px;
    }

    .project-description {
        margin-top: 16px;
        font-size: 16px;
        line-height: 25px;
    }

    .project-year {
        font-size: 18px;
        line-height: 27px;
    }

}
</style>
