<template>
  <div
    ref="root"
    class="project-tldr"
    :class="{ 'project-tldr--open': open }"
  >
    <button
      type="button"
      class="project-tldr-trigger"
      :aria-expanded="open ? 'true' : 'false'"
      aria-controls="project-tldr-panel"
      @click="toggle"
    >
      <span class="project-tldr-label">TL;DR</span>
      <span class="project-tldr-icon" aria-hidden="true">
        <img
          class="project-tldr-chevron project-tldr-chevron--default"
          :src="chevronDefault"
          alt=""
          width="44"
          height="44"
        />
        <img
          class="project-tldr-chevron project-tldr-chevron--hover"
          :src="chevronHover"
          alt=""
          width="44"
          height="44"
        />
        <img
          class="project-tldr-chevron project-tldr-chevron--clicked"
          :src="chevronClicked"
          alt=""
          width="44"
          height="44"
        />
      </span>
    </button>

    <div
      class="project-tldr-panel-slot"
      :class="{ 'project-tldr-panel-slot--open': open }"
    >
      <div class="project-tldr-panel-slot-inner">
        <div
          id="project-tldr-panel"
          class="project-tldr-panel"
          role="region"
          aria-label="Case study summary"
          :aria-hidden="open ? 'false' : 'true'"
        >
          <div class="project-tldr-panel-inner">
            <div class="project-tldr-block">
              <div class="project-tldr-heading">In summary,</div>
              <ul class="project-tldr-list">
                <li v-for="(item, index) in summaryItems" :key="index">
                  <strong>{{ item.lead }}</strong> – {{ item.body }}
                </li>
              </ul>
            </div>

            <div class="project-tldr-block project-tldr-block--also">
              <div class="project-tldr-heading">Also,</div>
              <div class="project-tldr-note">
                here’s the case study formatted in
                <strong>AI-friendly Markdown</strong> – ready for plugging into
                the AI tool of your choice.
              </div>
              <button
                type="button"
                class="project-tldr-copy"
                :tabindex="open ? 0 : -1"
                @click="copyMarkdown"
              >
                Copy case study
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="project-tldr-toast">
        <div
          v-if="copied"
          class="project-tldr-toast"
          role="status"
          aria-live="polite"
        >
          Copied to clipboard :)
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
import chevronDefault from '../assets/tldr-chevron-default.svg'
import chevronHover from '../assets/tldr-chevron-hover.svg'
import chevronClicked from '../assets/tldr-chevron-clicked.svg'
import { easeInOutCubic, smoothScrollTo } from '../utils/scrollToAbout.js'
import { CASE_STUDY_MOBILE_MEDIA_QUERY } from '../utils/breakpoints.js'
const TLDR_TRIGGER_TOP_OFFSET = 60
const TLDR_SCROLL_DURATION_MS = 260

export default {
  name: 'ProjectTldrButton',
  props: {
    summaryItems: {
      type: Array,
      required: true,
    },
    markdown: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      open: false,
      copied: false,
      copyResetTimer: null,
      chevronDefault,
      chevronHover,
      chevronClicked,
    }
  },
  beforeUnmount() {
    clearTimeout(this.copyResetTimer)
  },
  methods: {
    isMobileViewport() {
      return window.matchMedia(CASE_STUDY_MOBILE_MEDIA_QUERY).matches
    },
    getOpenSectionHeight(root) {
      const liveHeight = root.getBoundingClientRect().height
      if (!this.open) return liveHeight

      const panel = root.querySelector('.project-tldr-panel')
      if (panel) {
        return Math.max(liveHeight, panel.scrollHeight)
      }

      return liveHeight
    },
    getOpenSectionScrollTop() {
      const root = this.$refs.root
      const trigger = root?.querySelector('.project-tldr-trigger')
      if (!root || !trigger) return null

      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY
      const sectionRect = root.getBoundingClientRect()
      const sectionTop = sectionRect.top + scrollY
      const sectionHeight = this.getOpenSectionHeight(root)

      if (sectionHeight > viewportHeight) {
        const triggerTop = trigger.getBoundingClientRect().top + scrollY
        return Math.max(0, triggerTop - TLDR_TRIGGER_TOP_OFFSET)
      }

      return Math.max(0, sectionTop + sectionHeight / 2 - viewportHeight / 2)
    },
    scrollOpenSectionIntoView() {
      const targetTop = this.getOpenSectionScrollTop()
      if (targetTop === null) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      smoothScrollTo(targetTop, {
        duration: reducedMotion ? 0 : TLDR_SCROLL_DURATION_MS,
        ease: easeInOutCubic,
      })
    },
    scheduleScrollOpenSectionIntoView() {
      this.$nextTick(() => {
        requestAnimationFrame(() => this.scrollOpenSectionIntoView())
      })
    },
    toggle(event) {
      const wasOpen = this.open
      this.open = !this.open

      if (!wasOpen && this.open && !this.isMobileViewport()) {
        this.scheduleScrollOpenSectionIntoView()
      }

      // Drop sticky focus/hover so pressed chevron doesn’t linger on mobile
      const trigger = event?.currentTarget
      if (trigger && typeof trigger.blur === 'function') {
        requestAnimationFrame(() => trigger.blur())
      }
    },
    showCopiedToast() {
      this.copied = true
      clearTimeout(this.copyResetTimer)
      this.copyResetTimer = setTimeout(() => {
        this.copied = false
      }, 2000)
    },
    copyWithFallback(text) {
      const el = document.createElement('textarea')
      el.value = text
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.top = '0'
      el.style.left = '0'
      el.style.width = '1px'
      el.style.height = '1px'
      el.style.padding = '0'
      el.style.border = 'none'
      el.style.outline = 'none'
      el.style.boxShadow = 'none'
      el.style.background = 'transparent'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.focus()
      el.select()
      el.setSelectionRange(0, el.value.length)
      let ok = false
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
      document.body.removeChild(el)
      return ok
    },
    async copyMarkdown() {
      const text = this.markdown
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          this.showCopiedToast()
          return
        }
      } catch {
        /* fall through to legacy copy */
      }
      if (this.copyWithFallback(text)) {
        this.showCopiedToast()
      }
    },
  },
}
</script>

<style scoped>
.project-tldr {
  --project-tldr-trigger-height: 36px;
  --project-tldr-panel-nudge: 10px;
  --project-tldr-chevron-size: 36px;
  position: relative;
  display: block;
  width: 100%;
  max-width: none;
  /* Match title → TL;DR spacing (header margin-bottom); mobile uses 100 */
  margin: 0 0 100px;
  z-index: 2;
}

.project-tldr-trigger {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  height: var(--project-tldr-trigger-height);
  /* Align with section h2 hang */
  margin-left: calc(-1 * var(--project-title-offset, 0px));
  padding: 0;
  border: 0;
  background: transparent;
  color: #000aaa;
  cursor: pointer;
  box-sizing: border-box;
}

.project-tldr-label {
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 30px;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.project-tldr-icon {
  position: relative;
  display: block;
  width: var(--project-tldr-chevron-size);
  height: var(--project-tldr-chevron-size);
  flex-shrink: 0;
}

.project-tldr-chevron {
  position: absolute;
  inset: 0;
  display: block;
  width: var(--project-tldr-chevron-size);
  height: var(--project-tldr-chevron-size);
  opacity: 0;
  transition:
    opacity 0.15s ease,
    transform 0.2s ease;
  pointer-events: none;
}

.project-tldr-chevron--default {
  opacity: 1;
}

/* Pressed state — clears on release (no sticky hover on touch) */
.project-tldr-trigger:active .project-tldr-chevron--default {
  opacity: 0;
}

.project-tldr-trigger:active .project-tldr-chevron--hover {
  opacity: 0;
}

.project-tldr-trigger:active .project-tldr-chevron--clicked {
  opacity: 1;
}

/* Real hover only — avoids sticky “pressed” chevron after tap on mobile */
@media (hover: hover) and (pointer: fine) {
  .project-tldr-trigger:hover .project-tldr-chevron--default {
    opacity: 0;
  }

  .project-tldr-trigger:hover .project-tldr-chevron--hover {
    opacity: 1;
  }
}

.project-tldr--open .project-tldr-chevron {
  transform: rotate(180deg);
}

.project-tldr-panel-slot {
  display: grid;
  grid-template-rows: 0fr;
  /* Mobile: full viewport — break out of the body column on both sides */
  width: 100vw;
  max-width: none;
  margin-left: calc(-1 * var(--project-body-left));
  transition: grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-tldr-panel-slot--open {
  grid-template-rows: 1fr;
}

.project-tldr-panel-slot-inner {
  overflow: hidden;
  min-height: 0;
}

.project-tldr-panel-slot:not(.project-tldr-panel-slot--open) .project-tldr-copy {
  visibility: hidden;
}

.project-tldr-panel {
  position: relative;
  margin-top: calc(
    -1 * (var(--project-tldr-trigger-height) + var(--project-tldr-panel-nudge))
  );
  left: 0;
  width: 100%;
  max-width: none;
  padding: calc(
      var(--project-tldr-trigger-height) + var(--project-tldr-panel-nudge) + 80px
    )
    var(--project-body-left) 52px var(--project-body-left);
  box-sizing: border-box;
  border-radius: 0;
  background: linear-gradient(
    180deg,
    rgba(242, 242, 242, 0) 33.75%,
    #f2f2f2 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.project-tldr-panel-slot--open .project-tldr-panel {
  opacity: 1;
}

.project-tldr-panel-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 52px;
  width: 100%;
  pointer-events: none;
}

.project-tldr-panel-slot--open .project-tldr-panel-inner {
  pointer-events: auto;
}

.project-tldr-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
}

.project-tldr-heading {
  margin: 0 0 0 calc(-1 * var(--project-title-offset, 0px));
  width: calc(100% + var(--project-title-offset, 0px));
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 33px;
  letter-spacing: -0.02em;
  color: #000aaa;
  vertical-align: middle;
}

.project-tldr-list {
  margin: 0;
  padding: 0;
  width: 100%;
  list-style: disc;
  list-style-position: outside;
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #2c2c2c;
  vertical-align: middle;
}

.project-tldr-list li {
  margin: 0 0 0 1.25em;
  padding: 0;
}

.project-tldr-list li + li {
  margin-top: 24px;
}

.project-tldr-list strong,
.project-tldr-note strong {
  font-family: inherit;
  font-weight: 600;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
  vertical-align: middle;
}

.project-tldr-note {
  margin: 0;
  width: 100%;
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #2c2c2c;
  vertical-align: middle;
}

.project-tldr-copy {
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 calc(-1 * var(--project-title-offset, 0px));
  padding: 12px 24px;
  min-width: 0;
  width: auto;
  max-width: 100%;
  height: 48px;
  border: 0;
  border-radius: 40px;
  isolation: isolate;
  overflow: hidden;
  background: #000aaa;
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: -0.02em;
  color: #fff;
  cursor: pointer;
  box-sizing: border-box;
  vertical-align: middle;
  transition: background 0.2s ease;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.035),
    0 4px 14px rgba(15, 23, 42, 0.045),
    0 10px 28px rgba(15, 23, 42, 0.03);
}

/* Glass edge — match portfolio CTA */
.project-tldr-copy::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.22) 5%,
    rgba(255, 255, 255, 0) 11%,
    rgba(255, 255, 255, 0) 89%,
    rgba(255, 255, 255, 0.18) 95%,
    rgba(255, 255, 255, 0.4) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 1.5px 2.5px rgba(255, 255, 255, 0.7),
    inset 0 -1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -1px 2px rgba(255, 255, 255, 0.4),
    inset 1px 0 2px rgba(255, 255, 255, 0.4),
    inset -1px 0 2px rgba(255, 255, 255, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.project-tldr-copy:active {
  background: #000444;
  transition: none;
}

@media (hover: hover) and (pointer: fine) {
  .project-tldr-copy:hover {
    background: #1a2bff;
  }
}

@media (min-width: 601px) {
  .project-tldr-label {
    font-size: 20px;
    line-height: 30px;
    font-weight: 500;
  }

  .project-tldr-heading {
    font-size: 24px;
    line-height: 36px;
  }

  .project-tldr-list {
    font-size: 16px;
    line-height: 26px;
  }

  .project-tldr-list li + li {
    margin-top: 26px;
  }

  .project-tldr-note {
    font-size: 16px;
    line-height: 24px;
  }

  .project-tldr-copy {
    font-size: 20px;
    line-height: 30px;
    font-weight: calc(500 * var(--font-weight-scale, 0.95));
  }
}

@media (min-width: 800px) {
  .project-tldr {
    --project-tldr-trigger-height: 44px;
    --project-tldr-chevron-size: 44px;
    width: 100%;
    margin: 0 0 120px;
  }

  .project-tldr-trigger {
    gap: 12px;
  }

  /* Desktop: hang left 2× and right 1× title-offset so
     - headings/CTA sit on the TL;DR line with the same inset from the box
     - list/note can span the full body text column L→R with the same inset */
  .project-tldr-panel-slot {
    width: calc(100% + 3 * var(--project-title-offset, 0px));
    max-width: none;
    margin-left: calc(-2 * var(--project-title-offset, 0px));
  }

  .project-tldr-panel {
    padding: calc(
        var(--project-tldr-trigger-height) + var(--project-tldr-panel-nudge) + 100px
      )
      var(--project-title-offset, 0px) 64px var(--project-title-offset, 0px);
    border-radius: 0 0 40px 40px;
  }

  .project-tldr-panel-inner {
    gap: 64px;
  }

  .project-tldr-heading {
    margin-left: 0;
    width: 100%;
  }

  /* Same text column for summary bullets and Also paragraph */
  .project-tldr-list,
  .project-tldr-note {
    margin-left: var(--project-title-offset, 0px);
    width: calc(100% - var(--project-title-offset, 0px));
  }

  /* Drop li indent so bullet text shares the Also paragraph left edge;
     outside markers hang into the title-offset gutter */
  .project-tldr-list li {
    margin-left: 0;
  }

  .project-tldr-copy {
    margin-left: var(--project-title-offset, 0px);
    width: 223px;
    height: 54px;
  }
}

.project-tldr-toast {
  position: fixed;
  left: 50%;
  bottom: calc(30px + env(safe-area-inset-bottom, 0px));
  z-index: 2147483646;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: min(304px, calc(100vw - 40px));
  height: 54px;
  padding: 12px 24px;
  gap: 10px;
  box-sizing: border-box;
  background: rgba(26, 26, 26, 0.9);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  transform: translateX(-50%);
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: -0.02em;
  color: #fff;
  pointer-events: none;
}

@media (min-width: 601px) {
  .project-tldr-toast {
    font-size: 20px;
    line-height: 30px;
  }
}

.project-tldr-toast-enter-active,
.project-tldr-toast-leave-active {
  transition: opacity 0.18s ease;
}

.project-tldr-toast-enter-from,
.project-tldr-toast-leave-to {
  opacity: 0;
}
</style>
