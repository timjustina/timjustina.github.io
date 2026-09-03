<template>
  <div :class="[$style.page, overlayTopBar && $style.pageOverlayTopBar]">
    <PortfolioTopBar :transparent="overlayTopBar" nav-hero-align />
    <main :class="[$style.main, fullWidthImages && $style.mainFullWidthImages]">
      <slot />
    </main>
    <PortfolioSiteFooter />
  </div>
</template>

<script>
import PortfolioTopBar from '../components/PortfolioTopBar.vue'
import PortfolioSiteFooter from '../components/PortfolioSiteFooter.vue'
import { CASE_STUDY_MOBILE_MEDIA_QUERY } from '../utils/breakpoints.js'
import {
  finishImageExpand,
  hasPendingImageExpand,
} from '../utils/imageExpandTransition.js'

export default {
  name: 'ProjectDetail',
  components: { PortfolioTopBar, PortfolioSiteFooter },
  props: {
    fullWidthImages: {
      type: Boolean,
      default: false,
    },
    overlayTopBar: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // Lock mobile hero height to the initial viewport so URL-bar show/hide
    // (vh changes on scroll) doesn't make the image look like it's zooming.
    this.lockMobileHeroHeight()
    window.addEventListener('orientationchange', this.onMobileHeroOrientation)

    if (!hasPendingImageExpand()) return

    this.$nextTick(() => {
      const heroImg =
        this.$el?.querySelector('.project-hero img') ||
        document.querySelector('.project-hero img')
      if (heroImg) finishImageExpand(heroImg)
    })
  },
  beforeUnmount() {
    window.removeEventListener('orientationchange', this.onMobileHeroOrientation)
    this.clearMobileHeroHeight()
  },
  methods: {
    onMobileHeroOrientation() {
      window.setTimeout(() => this.lockMobileHeroHeight(), 250)
    },
    lockMobileHeroHeight() {
      if (!window.matchMedia(CASE_STUDY_MOBILE_MEDIA_QUERY).matches) {
        this.clearMobileHeroHeight()
        return
      }
      const px = Math.round(window.innerHeight * 1.25)
      this.$el?.style?.setProperty('--project-hero-mobile-height', `${px}px`)
    },
    clearMobileHeroHeight() {
      this.$el?.style?.removeProperty('--project-hero-mobile-height')
    },
  },
}
</script>

<style module>
.page {
  --page-max: 1454px;
  /* Match portfolio homepage nav alignment (Work sits on the decor line). */
  --portfolio-main-inset-left: max(0px, (100vw - var(--page-max)) / 2);
  --portfolio-nav-page-pad: max(39px, min(100px, calc((100vw - 939px) / 2)));
  --portfolio-hero-squiggle-left: clamp(
    120px,
    calc(120px + (100vw - 997px) * 1 / 457),
    121px
  );
  --portfolio-decor-line-stroke-x: 34px;
  --portfolio-decor-line-x: calc(
    var(--portfolio-main-inset-left) + var(--portfolio-nav-page-pad) +
      var(--portfolio-hero-squiggle-left) + var(--portfolio-decor-line-stroke-x)
  );
  --page-pad: clamp(100px, calc(100px + (100vw - 997px) * 40 / 457), 140px);
  --project-content-w: 668px;
  --project-content-offset: 22.5px;
  --project-media-gap: 100px;
  /* Match portfolio about → footer spacing */
  --project-bottom-pad: clamp(180px, calc(180px + (100vw - 997px) * 100 / 457), 280px);
  --project-edge-pad: 20px;
  --project-title-hang: 52px;
  --project-rule-inset: 24px;
  --top-bar-height: 120px;
  background: #fff;
  color: #3c3f41;
  font-family: 'Work Sans', sans-serif;
  font-size: 22px;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-x: clip;
}

.main {
  max-width: none;
  margin: 0;
  padding: 0 0 var(--project-bottom-pad);
}

/* Avoid stacking media gap on top of the page bottom pad */
.main :global(.project-body > section:last-child > .full-image:last-child),
.main :global(.project-body > section:last-child > .video-pair:last-child) {
  margin-bottom: 0;
}

.main :global(.project-body) {
  /* Use vw (not %) so hang math stays viewport-relative on h2.
     Keep room for edge pad + gray-rule gap so line↔text spacing stays 24px. */
  --project-body-left: max(
    calc(var(--project-edge-pad) + var(--project-rule-inset)),
    calc(50vw - var(--project-content-w) / 2 + var(--project-content-offset))
  );
  --project-space-left: max(
    0px,
    calc(var(--project-body-left) - var(--project-edge-pad))
  );
  --project-rule-offset: var(--project-rule-inset);
  --project-title-offset: clamp(
    var(--project-rule-inset),
    var(--project-space-left),
    var(--project-title-hang)
  );
  width: min(
    var(--project-content-w),
    calc(100vw - var(--project-body-left) - var(--project-edge-pad))
  );
  max-width: var(--project-content-w);
  margin-left: var(--project-body-left);
  margin-right: auto;
  overflow: visible;
  font-family: 'Work Sans', sans-serif;
  font-weight: calc(400 * var(--font-weight-scale));
  font-style: normal;
  font-size: 22px;
  line-height: 37px;
  letter-spacing: 0;
  color: #3c3f41;
}

.main :global(.project-header) {
  margin-top: calc(var(--top-bar-height, 120px) + 160px);
}

/* Hero flush to viewport top; frosted panel between image and title */
.pageOverlayTopBar {
  --project-hero-glass-panel-height: 140px;
  --project-hero-glass-image-cover: calc(2 * var(--project-hero-glass-panel-height));
  --project-hero-glass-side-inset: 40px;
  --project-hero-title-line-height: 48px;
  --project-hero-title-line-count: 2;
  --project-hero-title-overlap: calc(
    0.5 * var(--project-hero-title-line-count) * var(--project-hero-title-line-height)
  );
  /* Room for the closing glass under the last paragraph */
  --project-bottom-pad: calc(var(--project-hero-glass-image-cover) + 40px);
}

.pageOverlayTopBar :global(.project-hero) {
  margin-top: 0;
  position: relative;
  z-index: 0;
}

.pageOverlayTopBar :global(.project-hero img),
.pageOverlayTopBar :global(.project-hero picture) {
  position: relative;
  z-index: 0;
}

/* Fade hero only under the glass footprint on the image */
.pageOverlayTopBar :global(.project-hero)::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: 1;
  width: calc(100vw - 2 * var(--project-hero-glass-side-inset));
  height: var(--project-hero-glass-panel-height);
  transform: translate3d(-50%, 0, 0);
  border-radius: 0;
  background: linear-gradient(
    to bottom,
    transparent 0,
    transparent 40%,
    rgba(255, 255, 255, 0.85) 60%,
    #fff 75%,
    #fff 100%
  );
  pointer-events: none;
}

.pageOverlayTopBar :global(.project-hero + .project-header) {
  position: relative;
  z-index: 2;
  margin-top: calc(-1 * var(--project-hero-title-overlap));
  isolation: isolate;
}

.pageOverlayTopBar :global(.project-hero + .project-header)::before {
  content: '';
  position: absolute;
  left: 50%;
  top: calc(-1 * (var(--project-hero-glass-panel-height) - var(--project-hero-title-overlap)));
  z-index: 0;
  width: calc(100vw - 2 * var(--project-hero-glass-side-inset));
  height: var(--project-hero-glass-image-cover);
  transform: translate3d(-50%, 0, 0);
  border-radius: 40px 40px 0 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(52px) saturate(2.5);
  -webkit-backdrop-filter: blur(52px) saturate(2.5);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    inset 0 -1px 0 rgba(255, 255, 255, 0.3),
    0 6px 24px rgba(15, 23, 42, 0.05);
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.58) 48%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.58) 48%,
    transparent 100%
  );
  pointer-events: none;
}

.pageOverlayTopBar :global(.project-hero + .project-header .project-header-title),
.pageOverlayTopBar :global(.project-hero + .project-header .project-header-meta) {
  position: relative;
  z-index: 1;
}

.pageOverlayTopBar :global(.project-hero + .project-header .project-header-title) {
  font-family: 'Fira Code', monospace;
  font-weight: calc(400 * var(--font-weight-scale));
  letter-spacing: -0.02em;
}

/* Closing glass — grey wash behind, fade under glass, glass on top */
.pageOverlayTopBar .main {
  position: relative;
}

.pageOverlayTopBar :global(.project-body) {
  position: relative;
  z-index: 1;
  isolation: isolate;
}

.pageOverlayTopBar :global(.project-body > *) {
  position: relative;
  z-index: 2;
}

/* Full-bleed grey wash (on main so body can host fade + glass) */
.pageOverlayTopBar .main::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 0;
  width: 100vw;
  height: calc(
    var(--project-bottom-pad) + var(--project-hero-glass-image-cover) +
      var(--project-hero-glass-panel-height)
  );
  pointer-events: none;
  /* Soft white→grey around the text bottom; soft grey→white into the footer */
  background: linear-gradient(
    180deg,
    rgba(224, 224, 224, 0)
      calc(var(--project-hero-glass-image-cover) + var(--project-hero-glass-panel-height) - 180px),
    #e0e0e0
      calc(var(--project-hero-glass-image-cover) + var(--project-hero-glass-panel-height) + 110px),
    #e0e0e0 78%,
    #fff 100%
  );
}

.pageOverlayTopBar :global(.project-body)::before,
.pageOverlayTopBar :global(.project-body)::after {
  content: '';
  position: absolute;
  top: calc(100% - var(--project-hero-glass-panel-height));
  left: calc(-1 * var(--project-body-left) + var(--project-hero-glass-side-inset));
  width: calc(100vw - 2 * var(--project-hero-glass-side-inset));
  height: var(--project-hero-glass-image-cover);
  border-radius: 0 0 40px 40px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  pointer-events: none;
}

/* Fade box under the glass — same footprint + 40px bottom corners */
.pageOverlayTopBar :global(.project-body)::before {
  z-index: 0;
  background: linear-gradient(
    to bottom,
    #fff 0%,
    rgba(255, 255, 255, 0.85) 40%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.58) 48%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.58) 48%,
    transparent 100%
  );
}

.pageOverlayTopBar :global(.project-body)::after {
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(52px) saturate(2.5);
  -webkit-backdrop-filter: blur(52px) saturate(2.5);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    inset 0 -1px 0 rgba(255, 255, 255, 0.3),
    0 6px 24px rgba(15, 23, 42, 0.05);
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.58) 48%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.58) 48%,
    transparent 100%
  );
}

@media (min-width: 800px) {
  .pageOverlayTopBar :global(.project-hero + .project-header) {
    width: calc(100vw - 78px);
    max-width: calc(100vw - 78px);
  }

  .pageOverlayTopBar :global(.project-hero + .project-header .project-header-title) {
    width: 100%;
    max-width: 100%;
    font-size: 32px;
    line-height: 48px;
  }
}

.main :global(.project-body section) {
  overflow: visible;
}

/* Vertical rule beside body text + h3 subtitles (not h2 titles or media) */
.main :global(.project-body section > h3),
.main :global(.project-body section > p:not(.caption)),
.main :global(.project-body section > ul),
.main :global(.project-body section > ol) {
  position: relative;
}

.main :global(.project-body section > h3)::before,
.main :global(.project-body section > p:not(.caption))::before,
.main :global(.project-body section > ul)::before,
.main :global(.project-body section > ol)::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--project-rule-offset));
  top: 11px;
  bottom: 5px;
  width: 1px;
  background: #bababa;
  pointer-events: none;
}

/* Bridge gaps between consecutive text blocks so the rule reads continuous.
   Extra 11px so the bridge meets the next block’s top inset. */
.main :global(.project-body section > h3:has(+ p:not(.caption)))::before {
  bottom: -49px;
}

.main :global(.project-body section > p:not(.caption):has(+ p:not(.caption)))::before {
  bottom: -45px;
}

.main :global(.project-body section > p:not(.caption):has(+ ul))::before,
.main :global(.project-body section > p:not(.caption):has(+ ol))::before {
  bottom: -43px;
}

.main :global(.project-body section > ul:has(+ p:not(.caption)))::before,
.main :global(.project-body section > ol:has(+ p:not(.caption)))::before,
.main :global(.project-body section > ul:has(+ ul))::before,
.main :global(.project-body section > ul:has(+ ol))::before,
.main :global(.project-body section > ol:has(+ ul))::before,
.main :global(.project-body section > ol:has(+ ol))::before {
  bottom: -43px;
}

.main :global(.project-hero) {
  width: 100vw;
  max-width: 100vw;
  margin: 0 calc(50% - 50vw);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.pageOverlayTopBar :global(.project-hero) {
  overflow-x: hidden;
  overflow-y: visible;
}

.main :global(.project-header + .project-hero) {
  margin-top: 0;
}

.main :global(.project-hero + .project-body) {
  margin-top: 100px;
}

.main :global(.project-hero picture) {
  display: block;
  flex-shrink: 0;
  width: auto;
  max-width: none;
}

.main :global(.project-hero img) {
  /* Keep intrinsic size; centre-crop when wider than the viewport */
  width: auto;
  max-width: none;
  height: auto;
  display: block;
  flex-shrink: 0;
}

.main :global(.project-body section + section) {
  margin-top: 84px;
}

.main :global(.project-body .project-tldr-list) {
  margin: 0;
  padding: 0;
  list-style: disc;
  list-style-position: outside;
}

.main :global(.project-body .project-tldr-list li) {
  padding-left: 0;
}

.main :global(.project-body .project-tldr-list strong),
.main :global(.project-body .project-tldr-note strong) {
  font-family: 'Fira Code', monospace;
  font-weight: 600;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: -0.02em;
}

.main :global(.project-body #results) {
  scroll-margin-top: calc(var(--top-bar-height, 120px) + 24px);
}

.main :global(.project-body section h2 + *) {
  margin-top: 48px;
}

.main :global(.project-body .project-role p) {
  margin: 0;
}

.main :global(.project-body .project-role h2 + p) {
  margin-top: 48px;
}

.main :global(.project-body h2) {
  /* Hang left up to 52px; tuck in with the gray rule, never past edge padding */
  margin: 0 0 0 calc(-1 * var(--project-title-offset));
  font-family: 'Fira Code', monospace;
  font-weight: 400;
  font-style: normal;
  font-size: 22px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #757575;
}

.main :global(.project-body section > h2:not(:first-child)) {
  margin-top: 100px;
}

.main :global(.project-body h3) {
  margin: 100px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-weight: calc(400 * var(--font-weight-scale));
  font-style: normal;
  font-size: 30px;
  line-height: 45px;
  letter-spacing: -0.02em;
  color: #2c2c2c;
  vertical-align: middle;
}

.main :global(.project-body h2 + h3) {
  margin-top: 48px;
}

.main :global(.project-body h3 + p) {
  margin-top: 38px;
}

.main :global(.project-body p) {
  margin: 0 0 34px;
}

.main :global(.project-body p:last-child) {
  margin-bottom: 0;
}

.main :global(.project-body p:has(+ ul)),
.main :global(.project-body p:has(+ ol)) {
  margin-bottom: 0;
}

.main :global(.project-body ul),
.main :global(.project-body ol) {
  margin: 32px 0;
  padding: 0 0 0 52px;
  list-style-position: outside;
  list-style-type: disc;
}

.main :global(.project-body li) {
  padding-left: 6px;
}

.main :global(.project-body li + li) {
  margin-top: 18px;
}

.main :global(.project-body .project-role li + li) {
  margin-top: 0;
}

.main :global(.project-body li::marker) {
  color: #3c3f41;
}

.main :global(.project-body li > p) {
  margin: 0 0 34px;
}

.main :global(.project-body li > p:last-child) {
  margin-bottom: 0;
}

.main :global(.project-body li > strong:first-child:has(+ p)),
.main :global(.project-body li > em:first-child:has(+ p)) {
  display: block;
  font-style: italic;
  font-weight: calc(400 * var(--font-weight-scale));
  margin-bottom: 12px;
}

.main :global(.full-image) {
  /* Break out of the text column and center on the viewport so L/R margins match */
  --project-media-width: min(1100px, calc(100vw - 40px));
  position: relative;
  left: auto;
  width: var(--project-media-width);
  max-width: 1100px;
  margin: var(--project-media-gap) 0;
  margin-left: calc(
    (100vw - var(--project-media-width)) / 2 - var(--project-body-left)
  );
  padding: 0;
  border: 0;
  text-align: center;
  transform: none;
}

.main :global(.full-image--captioned) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  overflow: visible;
  line-height: normal;
}

.main :global(.full-image--captioned .caption) {
  margin: 0;
  text-align: left;
}

.main :global(.full-image-media) {
  display: block;
  width: 100%;
  line-height: 0;
  overflow: hidden;
  border: 0;
}

.main :global(.full-image-media > .project-video),
.main :global(.full-image-media > video) {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
  border: 0;
  outline: none;
  /* No scale — it was eating into the caption gap */
  transform: none;
}

.main :global(.hero-image) {
  width: 100vw;
  max-width: 100vw;
}

.mainFullWidthImages :global(.full-image:not(.hero-image):not(.project-hero)) {
  --project-media-side-pad: 20px;
  --project-media-width: calc(100vw - 2 * var(--project-media-side-pad));
  width: var(--project-media-width);
  max-width: none;
  left: auto;
  margin-left: calc(
    (100vw - var(--project-media-width)) / 2 - var(--project-body-left)
  );
  transform: none;
}

.mainFullWidthImages :global(.project-body .full-image),
.mainFullWidthImages :global(.project-body .video-pair) {
  --project-media-side-pad: 20px;
  --project-media-width: calc(100vw - 2 * var(--project-media-side-pad));
  width: var(--project-media-width);
  max-width: none;
  position: relative;
  left: auto;
  margin: var(--project-media-gap) 0;
  margin-left: calc(
    (100vw - var(--project-media-width)) / 2 - var(--project-body-left)
  );
  transform: none;
}

.mainFullWidthImages :global(.project-body .full-image .caption),
.mainFullWidthImages :global(.project-body .video-pair .caption) {
  text-align: left;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 0;
  margin-left: 0;
  margin-right: 0;
}

.main :global(.full-image > video),
.main :global(.full-image > .project-video),
.main :global(.video-pair .project-video) {
  display: block;
  border: 0;
  outline: none;
  vertical-align: top;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1.004);
  transform-origin: center center;
}

.main :global(.full-image > video),
.main :global(.full-image > .project-video) {
  width: 100%;
  height: auto;
  max-width: 100%;
}

.main :global(.full-image picture) {
  display: block;
  width: 100%;
}

.main :global(.full-image img) {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: contain;
  image-rendering: auto;
}

.main :global(.project-body strong) {
  font-family: 'Work Sans', sans-serif;
  font-weight: calc(600 * var(--font-weight-scale));
  font-style: normal;
  font-size: 22px;
  line-height: 37px;
  letter-spacing: 0;
}

.main :global(.caption) {
  font-family: 'Fira Code', monospace;
  font-weight: calc(400 * var(--font-weight-scale));
  font-size: 14px;
  letter-spacing: -0.02em;
  color: #757575;
  margin-top: 42px;
  text-align: left;
}

.main :global(.highlight) {
  color: #f20606;
}

@media (max-width: 997px) {
  .page {
    --project-bottom-pad: 180px;
  }

  .pageOverlayTopBar {
    --project-bottom-pad: calc(var(--project-hero-glass-image-cover) + 40px);
  }
}

@media (max-width: 480px) {
  .page {
    --page-pad: 24px;
  }
}

/* Phone layout — after desktop rules so type/spacing aren’t overridden */
@media (width < 800px) {
  .page {
    --project-content-offset: 0px;
    --top-bar-height: 86px;
    --page-pad: 20px;
    --project-media-gap: 52px;
    --project-bottom-pad: 276px;
    --project-type-scale: 1.25;
  }

  .main :global(.project-header) {
    margin-top: calc(var(--top-bar-height) + 64px);
    margin-bottom: 52px;
  }

  .pageOverlayTopBar {
    --project-hero-glass-panel-height: 100px;
    --project-hero-glass-image-cover: calc(2 * var(--project-hero-glass-panel-height));
    --project-hero-title-line-height: 30px;
    --project-hero-title-line-count: 2;
    --project-hero-title-overlap: calc(
      0.5 * var(--project-hero-title-line-count) * var(--project-hero-title-line-height)
    );
    --project-bottom-pad: calc(var(--project-hero-glass-image-cover) + 40px);
  }

  .main :global(.project-hero) {
    margin-top: 0;
    /* Prefer locked px (set once on mount); svh avoids URL-bar scroll jump */
    height: 125vh;
    height: 125svh;
    height: var(--project-hero-mobile-height, 125svh);
    max-height: none;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .main :global(.project-hero picture),
  .main :global(.project-hero img) {
    /* Always 1/4 taller than the viewport; centre-crop horizontally */
    width: auto;
    height: 125vh;
    height: 125svh;
    height: var(--project-hero-mobile-height, 125svh);
    max-height: none;
    max-width: none;
    flex-shrink: 0;
    object-fit: cover;
    object-position: center top;
  }

  .main :global(.project-hero + .project-body) {
    margin-top: 52px;
  }

  .main :global(.project-body) {
    /* Same geometry as desktop: gray-line↔left-edge === text↔right-edge.
       Rule sits in the left inset; text column is capped at 320px and the
       (rule + text) block is centered when the viewport is wider. */
    --project-text-width: min(
      320px,
      calc(100vw - 2 * var(--project-edge-pad) - var(--project-rule-inset))
    );
    --project-side: max(
      var(--project-edge-pad),
      calc((100vw - var(--project-text-width) - var(--project-rule-inset)) / 2)
    );
    --project-body-left: calc(var(--project-side) + var(--project-rule-inset));
    --project-space-left: max(
      0px,
      calc(var(--project-body-left) - var(--project-edge-pad))
    );
    --project-rule-offset: min(var(--project-rule-inset), var(--project-space-left));
    --project-title-offset: clamp(
      var(--project-rule-offset),
      var(--project-space-left),
      var(--project-title-hang)
    );
    margin-left: var(--project-body-left);
    margin-right: auto;
    padding: 0;
    width: var(--project-text-width);
    max-width: 320px;
    font-family: 'Work Sans', sans-serif;
    font-weight: calc(400 * var(--font-weight-scale));
    font-size: calc(16px * var(--project-type-scale));
    line-height: calc(24px * var(--project-type-scale));
    color: #3c3f41;
  }

  .main :global(.project-body h2) {
    font-size: 18px;
    line-height: 30px;
    letter-spacing: -0.02em;
  }

  .main :global(.project-body section > h2:not(:first-child)) {
    margin-top: 52px;
  }

  .main :global(.project-body h3) {
    margin-top: 52px;
    font-family: 'Work Sans', sans-serif;
    font-weight: calc(400 * var(--font-weight-scale));
    font-size: 24px;
    line-height: calc(27px * 24 / 22);
    letter-spacing: -0.02em;
    color: #2c2c2c;
  }

  .main :global(.project-body p:not(.caption)) {
    margin-bottom: 24px;
    font-size: calc(16px * var(--project-type-scale));
    line-height: calc(24px * var(--project-type-scale));
  }

  /* After p rule so margin-top isn’t zeroed by a margin shorthand */
  .main :global(.project-body section h2 + *),
  .main :global(.project-body .project-role h2 + p),
  .main :global(.project-body h2 + h3),
  .main :global(.project-body h3 + p) {
    margin-top: 32px;
  }

  /* Same caption:body ratio as desktop (14/22) */
  .main :global(.project-body .caption),
  .main :global(.caption) {
    font-size: calc(16px * 14 / 22 * var(--project-type-scale));
    line-height: calc(24px * 14 / 22 * var(--project-type-scale));
    margin-top: 16px;
  }

  /* Captioned figures use gap, not margin — keep margin cleared after the rule above */
  .main :global(.full-image--captioned) {
    gap: 17px;
  }

  .main :global(.full-image--captioned .caption) {
    margin-top: 0;
  }

  .main :global(.project-body section > p:not(.caption):has(+ p:not(.caption)))::before {
    bottom: -35px;
  }

  .main :global(.project-body section > h3:has(+ p:not(.caption)))::before {
    bottom: -43px;
  }

  .main :global(.project-body li + li) {
    margin-top: 12px;
  }

  .main :global(.project-body .project-role li + li) {
    margin-top: 0;
  }

  .main :global(.project-body p:last-child) {
    margin-bottom: 0;
  }

  .main :global(.project-body strong) {
    font-family: 'Work Sans', sans-serif;
    font-weight: calc(600 * var(--font-weight-scale));
    font-size: calc(16px * var(--project-type-scale));
    line-height: calc(24px * var(--project-type-scale));
  }

  .main :global(.project-body section + section) {
    margin-top: 52px;
  }
}
</style>
