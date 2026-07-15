<template>
    <div class="portfolio-page">
        <PortfolioTopBar />

        <main class="portfolio-main">
            <section class="hero">
                <div class="hero-intro-wrap">
                    <div class="hero-decor" aria-hidden="true">
                        <img class="hero-decor-line" :src="lineAnimation" alt="" />
                    </div>
                    <p class="hero-intro">
                        <strong class="hero-intro-em">Product Designer</strong> with a background in Neuroscience and research.
                        Deeply enjoy understanding complex problems and providing creative solutions
                        <strong class="hero-intro-em">for people :)</strong>
                    </p>
                </div>
                <a class="cta-button" href="mailto:design@timjustina.com">Drop me a line</a>
            </section>

            <section id="work" class="work">
                <article id="work-first" class="project project--featured">
                    <router-link to="/project/MedicationDashboard" class="project-image-link">
                        <img
                            class="project-image"
                            :src="dashboardHero"
                            alt="IoT Adherence Analytics for Caregivers: Dashboard Design"
                        />
                    </router-link>
                    <div class="project-caption">
                        <div class="project-caption-header">
                            <h2 class="project-title">
                                <router-link to="/project/MedicationDashboard" class="project-title-link">
                                    IoT Adherence Analytics for Caregivers: Dashboard Design
                                </router-link>
                            </h2>
                            <span class="project-year">2026</span>
                        </div>
                        <p class="project-description">
                            0‑to‑1 design of a caregiver‑facing dashboard for a primary user's account,
                            helping caregivers better understand their client's needs
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
                            Redesigned workflows, human-machine interface, web + mobile app features of an IoT
                            medication adherence platform
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
                    <p class="about-location">
                        <span class="about-location-icon-wrap" aria-hidden="true">
                            <svg class="about-location-icon" width="13" height="20" viewBox="0 0 13 20" fill="none">
                                <path
                                    d="M6.5 0C2.91 0 0 2.91 0 6.5C0 11.38 6.5 20 6.5 20S13 11.38 13 6.5C13 2.91 10.09 0 6.5 0ZM6.5 8.75C5.26 8.75 4.25 7.74 4.25 6.5C4.25 5.26 5.26 4.25 6.5 4.25C7.74 4.25 8.75 5.26 8.75 6.5C8.75 7.74 7.74 8.75 6.5 8.75Z"
                                    fill="#928A81"
                                />
                            </svg>
                        </span>
                        <span class="about-location-text">London / Barcelona</span>
                    </p>
                </div>
                <div id="about-bio" class="about-text-column">
                    <h2 class="about-heading">About Tim ( 湉 )</h2>
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
        </section>

        <footer class="site-footer">
            <a href="mailto:design@timjustina.com" class="footer-email">design@timjustina.com</a>
            <span class="footer-divider" aria-hidden="true" />
            <span class="footer-copy">© 2026 Tim Justina Yeung</span>
        </footer>
    </div>
</template>

<script>
import dashboardHero from '../assets/0_dashboard_hero.jpg'
import multiplatformHero from '../assets/0_multiplateform_hero.jpg'
import marketplaceHero from '../assets/0_marketplace_hero.jpg'
import aboutPhoto from '../assets/portrait.jpg'
import lineAnimation from '../assets/line_animation.svg'
import PortfolioTopBar from '../components/PortfolioTopBar.vue'

export default {
    name: 'Portfolio',
    components: { PortfolioTopBar },
    data() {
        return {
            dashboardHero,
            multiplatformHero,
            marketplaceHero,
            aboutPhoto,
            lineAnimation,
        }
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
    --about-bg: #f4f2f1;
    --font-weight-scale: 0.98;
    --page-max: 1454px;
    --page-pad: clamp(100px, calc(100px + (100vw - 997px) * 40 / 457), 140px);
    --project-w: min(798px, 100%);
    --project-stack-gap: clamp(120px, calc(120px + (100vw - 997px) * 20 / 457), 140px);

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
    padding: 120px var(--page-pad) 0;
    box-sizing: border-box;
}

.hero {
    position: relative;
    z-index: 1;
    margin-bottom: clamp(231px, calc(238px - (100vw - 997px) * 7 / 457), 238px);
}

.hero-intro-wrap {
    position: relative;
    max-width: min(754px, calc(100% - 288px));
    margin: clamp(98px, calc(98px + (100vw - 997px) * 24 / 457), 122px) 0 0 288px;
}

.hero-decor {
    --hero-line-lift: 33px;
    position: absolute;
    top: 6px;
    right: calc(100% + 42px);
    z-index: 0;
    width: 56px;
    height: 532px;
    overflow: hidden;
    pointer-events: none;
}

.hero-decor-line {
    display: block;
    width: 56px;
    height: 518px;
    transition: transform 0.45s ease;
}

.portfolio-main:has(.project--featured:hover) .hero-decor-line,
.portfolio-main:has(.project--featured:focus-within) .hero-decor-line {
    transform: translateY(calc(-1 * var(--hero-line-lift)));
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

.cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 90px;
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
    scroll-margin-top: 120px;
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
    margin-top: var(--about-gap);
    padding: 80px 0 clamp(90px, calc(90px + (100vw - 997px) * 90 / 457), 180px);
    background: var(--about-bg);
    box-sizing: border-box;
    overflow: visible;
    scroll-margin-top: 120px;
}

#about-bio {
    scroll-margin-top: 120px;
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
    width: 208px;
    height: 30px;
    margin: 64px 0 0 clamp(-20px, calc(-20px - (100vw - 997px) * 14 / 457), -34px);
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

.about-location-text {
    width: 174px;
    height: 27px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-style: normal;
    font-weight: calc(400 * var(--font-weight-scale));
    font-size: 18px;
    line-height: 27px;
    color: var(--about-muted);
    flex: none;
}

.about-text-column {
    padding-top: 100px;
}

.about-heading {
    margin: 0 0 64px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 18px;
    font-weight: calc(400 * var(--font-weight-scale));
    line-height: 27px;
    letter-spacing: -0.02em;
    color: var(--about-muted);
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

.about-actions {
    display: none;
}

.site-footer {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    height: 120px;
    padding-top: 54px;
    padding-bottom: 0;
    box-sizing: border-box;
    background: #fff;
}

.footer-email,
.footer-copy {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 14px;
    font-weight: calc(300 * var(--font-weight-scale));
    line-height: 21px;
    color: var(--muted);
}

.footer-email {
    text-decoration: none;
}

.footer-email:hover {
    color: var(--brand);
}

.footer-divider {
    width: 1px;
    height: 21px;
    background: var(--muted);
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
        margin-top: 90px;
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
        margin-top: 340px;
        padding: 80px 0 180px;
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
        margin: 0 0 64px;
    }

    .about-bio {
        max-width: 566px;
        margin-left: 0;
    }

    .about-location {
        margin-top: 64px;
        margin-left: -34px;
    }

    .site-footer {
        align-items: flex-start;
        padding-top: 54px;
        padding-bottom: 0;
    }

    .footer-divider {
        height: 21px;
    }
}

/* ≤997px: 997px artboard lock before tablet layout */
@media (max-width: 997px) {
    .hero {
        margin-bottom: 238px;
    }

    .hero-intro-wrap {
        max-width: 100%;
        margin: 98px 0 0;
    }

    .hero-decor {
        top: calc(100% + 84px);
        right: auto;
        left: 122px;
    }

    .cta-button {
        margin-top: 90px;
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
        margin-top: 340px;
        padding: 80px 0 90px;
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

    .about-location {
        margin: 64px 0 0 -20px;
    }

    .about-text-column {
        padding-top: 100px;
    }

    .about-heading {
        margin: 0 0 64px;
    }

    .about-bio {
        max-width: 455px;
        margin-left: 0;
        line-height: 25px;
    }
}

/* Tablet: ≤767px (768px artboard) */
@media (max-width: 767px) {
    .hero-intro-wrap {
        max-width: min(629px, 100%);
        margin: 80px 0 0;
    }

    .hero-decor {
        --hero-line-lift: 31px;
        --hero-squiggle-cta-gap: 125px;
        top: calc(100% + 42px);
        right: auto;
        left: max(
            calc(233px + var(--hero-squiggle-cta-gap)),
            calc(100% - 114px - 56px)
        );
        height: 318px;
    }

    .hero {
        min-height: 0;
        margin-bottom: 80px;
    }

    .cta-button {
        margin-top: 90px;
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
        padding: 80px 0 138px;
    }

    .about-inner {
        grid-template-columns: 1fr;
        position: relative;
        padding: 0 var(--page-pad);
    }

    .about-photo-column {
        align-items: flex-start;
        padding-left: 0;
    }

    .about-photo,
    .about-photo--placeholder {
        width: 201px;
        height: auto;
        aspect-ratio: 348 / 498;
    }

    .about-line {
        display: none;
    }

    .about-text-column {
        padding-top: 32px;
    }

    .about-heading {
        margin: 0 0 32px;
    }

    .about-bio {
        margin-left: 0;
        max-width: none;
    }

    .about-actions {
        display: flex;
        grid-column: 1 / -1;
        gap: 40px;
        margin-top: 48px;
        padding-left: 57px;
    }

    .about-action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 24px;
        height: 54px;
        border-radius: 60px;
        background: var(--brand);
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 18px;
        font-weight: calc(500 * var(--font-weight-scale));
        line-height: 27px;
        color: #fff;
        text-decoration: none;
        box-sizing: border-box;
    }

    .site-footer {
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding-bottom: 40px;
    }

    .footer-divider {
        width: 30px;
        height: 1px;
    }
}

@media (max-width: 480px) {
    .portfolio-main {
        padding: 120px 24px 0;
    }

    .hero-decor {
        display: none;
    }

    .about-inner {
        padding: 0 24px;
    }

    .about-actions {
        padding-left: 0;
        flex-wrap: wrap;
    }
}
</style>
