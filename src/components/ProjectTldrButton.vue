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
        <svg
          class="project-tldr-chevron"
          width="12"
          height="7"
          viewBox="0 0 12 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 5.5L11 1.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>

    <div
      v-show="open"
      id="project-tldr-panel"
      class="project-tldr-panel"
      role="region"
      aria-label="Case study summary"
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
            <strong>AI-friendly Markdown</strong> – ready for plugging into the
            AI tool of your choice.
          </div>
          <button
            type="button"
            class="project-tldr-copy"
            @click="copyMarkdown"
          >
            Copy case study
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="copied"
        class="project-tldr-toast"
        role="status"
        aria-live="polite"
      >
        Copied to clipboard :)
      </div>
    </Teleport>
  </div>
</template>

<script>
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
    }
  },
  beforeUnmount() {
    clearTimeout(this.copyResetTimer)
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    async copyMarkdown() {
      try {
        await navigator.clipboard.writeText(this.markdown)
        this.copied = true
        clearTimeout(this.copyResetTimer)
        this.copyResetTimer = setTimeout(() => {
          this.copied = false
        }, 2000)
      } catch {
        /* ignore — clipboard may be blocked */
      }
    },
  },
}
</script>

<style scoped>
.project-tldr {
  display: none;
}

@media (min-width: 601px) {
  .project-tldr {
    --project-tldr-trigger-height: 36px;
    --project-tldr-panel-nudge: 10px;
    position: relative;
    display: block;
    width: 100%;
    margin: 0 0 120px;
    z-index: 2;
  }

  .project-tldr-trigger {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    width: 110px;
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
    font-weight: calc(400 * var(--font-weight-scale, 0.95));
    font-size: 20px;
    line-height: 30px;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .project-tldr-icon {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border: 2px solid currentColor;
    border-radius: 20px;
    flex-shrink: 0;
  }

  .project-tldr-chevron {
    display: block;
    transition: transform 0.2s ease;
  }

  .project-tldr--open .project-tldr-chevron {
    transform: rotate(180deg);
  }

  .project-tldr-panel {
    position: relative;
    /* Pull up under the trigger so the gradient starts at the button */
    margin-top: calc(
      -1 * (var(--project-tldr-trigger-height) + var(--project-tldr-panel-nudge))
    );
    /* Body text width + section title hang, hanging left with the titles */
    left: calc(-1 * var(--project-title-offset));
    width: calc(100% + var(--project-title-offset));
    /* trigger overlap + 32px to “In summary,”; 64px below copy button */
    padding: calc(
        var(--project-tldr-trigger-height) + var(--project-tldr-panel-nudge) + 32px
      )
      0 64px var(--project-title-offset);
    box-sizing: border-box;
    border-radius: 12px;
    background: linear-gradient(
      180deg,
      rgba(242, 242, 242, 0) 33.75%,
      #f2f2f2 100%
    );
    pointer-events: none;
  }

  .project-tldr-panel-inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 64px;
    width: 100%;
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
    font-size: 24px;
    line-height: 36px;
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
    font-size: 16px;
    line-height: 26px;
    letter-spacing: -0.02em;
    color: #2c2c2c;
  }

  .project-tldr-list li {
    margin: 0 0 0 1.25em;
    padding: 0;
  }

  .project-tldr-list li + li {
    margin-top: 26px;
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
    font-size: 16px;
    line-height: 24px;
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
    width: 223px;
    height: 54px;
    border: 0;
    border-radius: 40px;
    background: #000aaa;
    font-family: 'Fira Code', monospace;
    font-style: normal;
    font-weight: calc(500 * var(--font-weight-scale, 0.95));
    font-size: 20px;
    line-height: 30px;
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
}

.project-tldr-toast {
  position: fixed;
  left: 50%;
  top: 66.666vh;
  z-index: 10000;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 304px;
  height: 54px;
  padding: 12px 24px;
  gap: 10px;
  box-sizing: border-box;
  background: #1a1a1a;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  transform: translate(-50%, -50%);
  font-family: 'Fira Code', monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.02em;
  color: #fff;
  pointer-events: none;
}
</style>
