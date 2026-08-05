<template>
  <div class="project-tldr" :class="{ 'project-tldr--open': open }">
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
    toggle() {
      this.open = !this.open
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
  /* On mobile, don’t inherit the body 320px cap — span to the page edge pad */
  width: calc(100vw - var(--project-body-left) - var(--project-edge-pad));
  max-width: none;
  margin: 0 0 52px;
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
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #000aaa;
  cursor: pointer;
  box-sizing: border-box;
}

.project-tldr-trigger:active {
  color: #000444;
}

.project-tldr-label {
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
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

.project-tldr-trigger:hover .project-tldr-chevron--default,
.project-tldr-trigger:active .project-tldr-chevron--default {
  opacity: 0;
}

.project-tldr-trigger:hover .project-tldr-chevron--hover {
  opacity: 1;
}

.project-tldr-trigger:active .project-tldr-chevron--hover {
  opacity: 0;
}

.project-tldr-trigger:active .project-tldr-chevron--clicked {
  opacity: 1;
}

.project-tldr--open .project-tldr-chevron {
  transform: rotate(180deg);
}

.project-tldr-panel-slot {
  display: grid;
  grid-template-rows: 0fr;
  /* Left: gray-line overhang; right: flush with project body */
  width: calc(100% + var(--project-title-offset, 0px));
  margin-left: calc(-1 * var(--project-title-offset, 0px));
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
  padding: calc(
      var(--project-tldr-trigger-height) + var(--project-tldr-panel-nudge) + 32px
    )
    var(--project-title-offset, 0px) 64px var(--project-title-offset, 0px);
  box-sizing: border-box;
  border-radius: 12px;
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
  gap: 64px;
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
  margin: 0;
  width: 100%;
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #000aaa;
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
  font-size: 14px;
  line-height: 22px;
  letter-spacing: -0.02em;
  color: #2c2c2c;
}

.project-tldr-list li {
  margin: 0 0 0 1.25em;
  padding: 0;
}

.project-tldr-list li + li {
  margin-top: 22px;
}

.project-tldr-list strong,
.project-tldr-note strong {
  font-family: inherit;
  font-weight: 700;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
}

.project-tldr-note {
  margin: 0;
  width: 100%;
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.02em;
  color: #2c2c2c;
}

.project-tldr-copy {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 12px 24px;
  min-width: 0;
  width: auto;
  max-width: 100%;
  height: 48px;
  border: 0;
  border-radius: 40px;
  background: #000aaa;
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.02em;
  color: #fff;
  cursor: pointer;
  box-sizing: border-box;
  transition: background 0.2s ease;
}

.project-tldr-copy:hover {
  background: #1a2bff;
}

.project-tldr-copy:active {
  background: #000444;
  transition: none;
}

@media (min-width: 601px) {
  .project-tldr {
    --project-tldr-trigger-height: 44px;
    --project-tldr-chevron-size: 44px;
    width: 100%;
    margin: 0 0 120px;
  }

  .project-tldr-trigger {
    gap: 12px;
  }

  .project-tldr-label {
    font-size: 20px;
    line-height: 30px;
    font-weight: calc(400 * var(--font-weight-scale, 0.95));
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
    width: 223px;
    height: 54px;
    font-size: 20px;
    line-height: 30px;
    font-weight: calc(500 * var(--font-weight-scale, 0.95));
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
  background: rgba(26, 26, 26, 0.85);
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
