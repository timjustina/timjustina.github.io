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
                    <p class="hero-intro">
                        <span class="hero-intro-lead">Tim Justina Yeung is a </span><strong class="hero-intro-em">Product Designer</strong> with a background in Neuroscience and research.
                        She deeply enjoys understanding complex problems and providing creative solutions
                        <strong class="hero-intro-em hero-intro-em--keep">for people :)</strong>
                    </p>
                </div>
                <a class="cta-button" href="mailto:design@timjustina.com">Drop me a line</a>
            </section>

            <section id="work" class="work">
                <article
                    id="work-first"
                    class="project project--featured"
                    @mouseenter="liftHeroLine"
                    @mouseleave="dropHeroLine"
                    @focusin="liftHeroLine"
                    @focusout="onFeaturedFocusOut"
                >
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

                <article class="project project--offset project--upcoming">
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

                <article class="project project--upcoming">
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

        <section id="about" class="about" @mouseenter="startAboutBallDrop">
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
                        For the nerds: a <a href="https://journals.biologists.com/dev/article/151/24/dev204256/363461/Short-range-Fgf-signalling-patterns-hindbrain" class="about-link">link</a> to my past life in
                        developmental neurobiology
                        (research paper).
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
</template>

<script>
import dashboardHero from '../assets/1_dashboard/0_dashboard_hero_detail-2400.jpg'
import multiplatformHero from '../assets/2_multiplatform/0_multiplatform_hero.jpg'
import marketplaceHero from '../assets/3_marketplace/0_marketplace_hero.jpg'
import aboutPhoto from '../assets/portrait.jpg'
import lineAnimation from '../assets/line_animation.svg'
import lineAnimationTall from '../assets/line_animation_tall.svg'
import aboutSquiggle from '../assets/squiggle_3.svg'
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
            aboutSquiggle,
            aboutBallDropped: false,
            heroLinePhase: 'rest',
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
        this.syncAboutBallPosition()
        window.addEventListener('resize', this.onHeroDecorResize, { passive: true })
        document.fonts?.ready?.then(() => {
            this.syncHeroDecorHeight()
            this.syncAboutBallPosition()
        })

        const aboutBio = this.$el?.querySelector('.about-bio')
        if (aboutBio) {
            this.aboutBallObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => this.syncAboutBallPosition())
            })
            this.aboutBallObserver.observe(aboutBio)
        }
    },
    beforeUnmount() {
        this.heroDecorObserver?.disconnect()
        this.aboutBallObserver?.disconnect()
        window.removeEventListener('resize', this.onHeroDecorResize)
        this.getHeroLineEl()?.removeEventListener('transitionend', this.onHeroLineReturnEnd)
    },
    methods: {
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
        startAboutBallDrop() {
            if (this.aboutBallDropped) return
            this.syncAboutBallPosition()
            this.aboutBallDropped = true
        },
        syncAboutBallPosition() {
            const about = this.$el?.querySelector('.about')
            const bio = this.$el?.querySelector('.about-bio')
            if (!about || !bio) return

            const aboutRect = about.getBoundingClientRect()
            const bioRect = bio.getBoundingClientRect()
            const styles = getComputedStyle(about)
            const ballSize =
                parseFloat(styles.getPropertyValue('--about-ball-size')) || 56
            const gap = 16
            const maxX = about.clientWidth - ballSize - 16
            const x = Math.max(
                16,
                Math.min(bioRect.right - aboutRect.left + gap, maxX)
            )
            about.style.setProperty('--about-ball-x', `${Math.round(x)}px`)
        },
        onHeroDecorResize() {
            requestAnimationFrame(() => {
                this.syncHeroDecorHeight()
                this.syncAboutBallPosition()
            })
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
    --project-w: min(776px, 100%);
    --project-w-wide: min(876px, 100%);
    --project-stack-gap: clamp(120px, calc(120px + (100vw - 997px) * 30 / 457), 150px);
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
    --hero-cta-gap: 98px;
    --hero-squiggle-left: 121px;
    --hero-squiggle-width: 56px;
    --hero-cta-width: 233px;
    /* 696px from the left edge of the first project image (content left) */
    --hero-cta-left: 696px;
    margin-bottom: clamp(231px, calc(238px - (100vw - 997px) * 7 / 457), 238px);
}

.hero-intro-wrap {
    --hero-intro-left: calc(var(--hero-squiggle-left) + var(--hero-squiggle-width) + 23px);
    position: relative;
    max-width: min(840px, calc(100% - var(--hero-intro-left)));
    margin: clamp(98px, calc(98px + (100vw - 997px) * 15 / 457), 113px) 0 0
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
    transition: transform var(--hero-line-return-duration) ease;
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
    width: var(--project-w-wide);
    max-width: 100%;
    margin-top: var(--project-stack-gap);
}

.project-image-link {
    position: relative;
    z-index: 1;
    display: block;
    text-decoration: none;
}

.project-image-wrap {
    position: relative;
    z-index: 1;
    display: block;
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

.project:not(.project--upcoming):hover .project-image,
.project:not(.project--upcoming):focus-within .project-image {
    border-radius: 700px 700px 20px 20px;
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
    transition: color 0.25s ease;
}

.project:hover .project-title-link,
.project:focus-within .project-title-link {
    color: var(--brand);
}

.project-description {
    margin: 16px 0 0;
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 25px;
    color: var(--muted);
}

.project-year {
    flex-shrink: 0;
    margin-left: auto;
    font-family: 'Fira Code', monospace;
    font-size: 18px;
    font-weight: calc(500 * var(--font-weight-scale));
    line-height: 27px;
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

.about-location-text {
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
    color: var(--text);
}

.about-link {
    color: var(--brand);
}

.about-ball {
    --about-ball-size: 59px;
    --about-ball-height: 56px;
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
        max-width: 840px;
        margin: 113px 0 0 var(--hero-intro-left);
    }

    .hero-decor {
        top: 7px;
    }

    .hero {
        margin-bottom: 220px;
    }

    .cta-button {
        margin-top: var(--hero-cta-gap);
        width: var(--hero-cta-width);
        min-width: 0;
        height: 57px;
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

@media (max-width: 600px) {
    .portfolio-page {
        --page-pad: 20px;
        --top-bar-height: 86px;
        --hero-logo-gap: 64px;
        /* Logo top 20px + 46px tall in the 86px bar */
        --top-bar-logo-inset: 20px;
    }

    .hero {
        --hero-cta-gap: 84px;
        min-height: 0;
    }

    .hero-decor {
        display: none;
    }

    .portfolio-main {
        padding: var(--top-bar-height) var(--page-pad) 0;
        box-sizing: border-box;
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

    .hero-intro-lead {
        display: inline;
    }

    .cta-button {
        --hero-cta-width: 225px;
        width: var(--hero-cta-width);
        height: 49px;
        min-height: 49px;
        min-width: var(--hero-cta-width);
        margin-left: max(0px, calc(100% - var(--hero-cta-width)));
        padding: 8px 20px;
        font-size: 22px;
        line-height: 33px;
    }

    .work {
        gap: 80px;
        width: 100%;
    }

    .project,
    .project--featured,
    .project--offset,
    .project:last-child {
        width: 100%;
        max-width: 100%;
        margin-top: 0;
        margin-left: 0;
    }

    .project-image-link,
    .project-image-wrap,
    .project-image {
        width: 100%;
        max-width: 100%;
        height: auto;
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

    .project-description {
        margin-top: 11px;
        max-width: 100%;
        font-family: 'Fira Code', monospace;
        font-size: 16px;
        font-weight: calc(400 * var(--font-weight-scale));
        line-height: 25px;
        color: #757575;
    }

    .project-year {
        margin-left: auto;
        flex-shrink: 0;
        font-family: 'Fira Code', monospace;
        font-size: 18px;
        font-weight: calc(500 * var(--font-weight-scale));
        line-height: 27px;
        color: #757575;
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
