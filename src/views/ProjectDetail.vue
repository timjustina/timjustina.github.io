<template>
  <div :class="[$style.page, overlayTopBar && $style.pageOverlayTopBar]">
    <PortfolioTopBar :transparent="overlayTopBar" />
    <main :class="[$style.main, fullWidthImages && $style.mainFullWidthImages]">
      <slot />
    </main>
    <PortfolioSiteFooter />
  </div>
</template>

<script>
import PortfolioTopBar from '../components/PortfolioTopBar.vue'
import PortfolioSiteFooter from '../components/PortfolioSiteFooter.vue'
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
    if (!hasPendingImageExpand()) return

    this.$nextTick(() => {
      const heroImg = this.$el?.querySelector('.project-hero img')
      if (heroImg) {
        finishImageExpand(heroImg)
      }
    })
  },
}
</script>

<style module>
.page {
  --page-max: 1454px;
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
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 22px;
  min-height: 100vh;
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
  font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
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

/* Hero flush to viewport top; title sits below the image */
.pageOverlayTopBar :global(.project-hero) {
  margin-top: 0;
}

.pageOverlayTopBar :global(.project-hero + .project-header) {
  margin-top: 20px;
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
  text-align: center;
}

.main :global(.project-header + .project-hero) {
  margin-top: 0;
}

.main :global(.project-hero + .project-body) {
  margin-top: 100px;
}

.main :global(.project-hero picture) {
  display: block;
  width: 100%;
}

.main :global(.project-hero img) {
  width: 100%;
  height: auto;
  display: block;
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
  font-weight: calc(400 * var(--font-weight-scale));
  font-style: normal;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #757575;
}

.main :global(.project-body h3) {
  margin: 100px 0 0;
  font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
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
  --project-media-side-pad: 39px;
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
  --project-media-side-pad: 39px;
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
  font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
  font-weight: calc(700 * var(--font-weight-scale));
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
}

@media (max-width: 480px) {
  .page {
    --page-pad: 24px;
  }
}

/* Phone layout — after desktop rules so type/spacing aren’t overridden */
@media (max-width: 600px) {
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

  .pageOverlayTopBar :global(.project-hero + .project-header) {
    margin-top: 20px;
  }

  .main :global(.project-hero) {
    margin-top: 0;
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
    font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
    font-weight: calc(400 * var(--font-weight-scale));
    font-size: calc(16px * var(--project-type-scale));
    line-height: calc(24px * var(--project-type-scale));
    color: #3c3f41;
  }

  .main :global(.project-body h2) {
    font-size: 16px;
    line-height: 30px;
    letter-spacing: -0.02em;
  }

  .main :global(.project-body h3) {
    margin-top: 52px;
    font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
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
    font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
    font-weight: calc(700 * var(--font-weight-scale));
    font-size: calc(16px * var(--project-type-scale));
    line-height: calc(24px * var(--project-type-scale));
  }

  .main :global(.project-body section + section) {
    margin-top: 52px;
  }
}
</style>
