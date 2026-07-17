<template>
  <div :class="$style.page">
    <PortfolioTopBar />
    <main :class="[$style.main, fullWidthImages && $style.mainFullWidthImages]">
      <slot />
    </main>
    <PortfolioSiteFooter />
  </div>
</template>

<script>
import PortfolioTopBar from '../components/PortfolioTopBar.vue'
import PortfolioSiteFooter from '../components/PortfolioSiteFooter.vue'

export default {
  name: 'ProjectDetail',
  components: { PortfolioTopBar, PortfolioSiteFooter },
  props: {
    fullWidthImages: {
      type: Boolean,
      default: false,
    },
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
  padding: 0;
}

.main :global(.project-body) {
  width: min(var(--project-content-w), calc(100vw - 40px));
  max-width: var(--project-content-w);
  margin-left: max(20px, calc(50% - var(--project-content-w) / 2 + var(--project-content-offset)));
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

.main :global(.project-body section) {
  overflow: visible;
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

.main :global(.project-body section h2 + *) {
  margin-top: 48px;
}

.main :global(.project-body .project-role p) {
  margin: 0;
}

.main :global(.project-body .project-role h2 + p) {
  margin-top: 48px;
}

.main :global(.project-body .project-role ul) {
  margin: 34px 0 0;
  padding-left: 1.1em;
  list-style-type: disc;
  list-style-position: outside;
}

.main :global(.project-body .project-role li) {
  padding-left: 0.15em;
}

.main :global(.project-body .project-role li::marker) {
  color: #3c3f41;
}

.main :global(.project-body h2) {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-weight: calc(400 * var(--font-weight-scale));
  font-style: normal;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #757575;
}

.main :global(.project-body h3) {
  margin: 48px 0 0;
  font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
  font-weight: calc(400 * var(--font-weight-scale));
  font-style: normal;
  font-size: 30px;
  line-height: 45px;
  letter-spacing: -0.02em;
  color: #2c2c2c;
  vertical-align: middle;
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

.main :global(.project-body ul) {
  margin: 0 0 34px;
  padding: 0;
  list-style: none;
}

.main :global(.project-body ul li + li) {
  margin-top: 0;
}

.main :global(.full-image) {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1100px;
  width: min(1100px, calc(100vw - 40px));
  margin: var(--project-media-gap) 0;
  text-align: center;
}

.main :global(.full-image:has(> video)) {
  line-height: 0;
  overflow: hidden;
}

.main :global(.hero-image) {
  width: 100vw;
  max-width: 100vw;
}

.mainFullWidthImages :global(.full-image:not(.hero-image):not(.project-hero)) {
  width: min(calc(var(--page-max) - 2 * var(--page-pad)), calc(100vw - 2 * var(--page-pad)));
  max-width: calc(var(--page-max) - 2 * var(--page-pad));
  left: 50%;
  transform: translateX(-50%);
}

.mainFullWidthImages :global(.project-body .full-image),
.mainFullWidthImages :global(.project-body .video-pair) {
  width: min(calc(var(--page-max) - 2 * var(--page-pad)), calc(100vw - 2 * var(--page-pad)));
  max-width: calc(var(--page-max) - 2 * var(--page-pad));
  position: relative;
  left: calc(50% - var(--project-content-offset));
  transform: translate3d(-50%, 0, 0);
  margin: var(--project-media-gap) 0;
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
  color: #757575;
  margin-top: 12px;
  text-align: left;
}

.main :global(.highlight) {
  color: #f20606;
}

@media (max-width: 480px) {
  .page {
    --page-pad: 24px;
  }
}

/* Phone layout — after desktop rules so type/spacing aren’t overridden */
@media (max-width: 560px) {
  .page {
    --project-content-offset: 0px;
    --top-bar-height: 86px;
    --page-pad: 20px;
    --project-media-gap: 52px;
  }

  .main :global(.project-header) {
    margin-top: calc(var(--top-bar-height) + 64px);
    margin-bottom: 52px;
  }

  .main :global(.project-hero) {
    margin-top: 0;
  }

  .main :global(.project-hero + .project-body) {
    margin-top: 52px;
  }

  .main :global(.project-body) {
    margin-left: auto;
    margin-right: auto;
    padding: 0 20px;
    width: min(320px, calc(100% - 40px));
    max-width: 320px;
    font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
    font-weight: calc(400 * var(--font-weight-scale));
    font-size: 16px;
    line-height: 24px;
    color: #3c3f41;
  }

  .main :global(.project-body h2) {
    font-size: 16px;
    line-height: 30px;
    letter-spacing: -0.02em;
  }

  .main :global(.project-body section h2 + *),
  .main :global(.project-body .project-role h2 + p),
  .main :global(.project-body h2 + h3),
  .main :global(.project-body h3 + p) {
    margin-top: 32px;
  }

  .main :global(.project-body h3) {
    margin-top: 32px;
    font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
    font-weight: calc(400 * var(--font-weight-scale));
    font-size: 22px;
    line-height: 27px;
    letter-spacing: -0.02em;
    color: #2c2c2c;
  }

  .main :global(.project-body p) {
    margin: 0 0 24px;
    font-size: 16px;
    line-height: 24px;
  }

  .main :global(.project-body p:last-child) {
    margin-bottom: 0;
  }

  .main :global(.project-body strong) {
    font-family: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
    font-weight: calc(700 * var(--font-weight-scale));
    font-size: 16px;
    line-height: 24px;
  }

  .main :global(.project-body section + section) {
    margin-top: 52px;
  }
}
</style>
