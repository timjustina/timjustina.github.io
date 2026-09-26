<template>
  <div class="full-image">
    <button
      v-show="!isOpen"
      type="button"
      class="zoomable-trigger"
      :aria-label="`View full size: ${alt}`"
      @click="open($event)"
    >
      <img ref="preview" :src="displaySrc" :alt="alt" class="preview" />
    </button>
    <p v-if="caption" class="caption">{{ caption }}</p>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="lightbox"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="alt"
      >
        <button type="button" class="lightbox-close" aria-label="Close" @click.stop="close">×</button>
        <div class="lightbox-stage" @click="close">
          <img :src="lightboxSrc" :alt="alt" class="lightbox-img" @load="onLightboxLoad" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
/** Crop once the artwork is within this many px of the text block width. */
const TEXT_BLOCK_SLACK_PX = 40

export default {
  name: 'ZoomableImage',
  props: {
    src: { type: String, required: true },
    tightSrc: { type: String, default: '' },
    /** Fraction of the full image width that is artwork, excluding white margin. */
    contentWidthRatio: { type: Number, default: 1 },
    zoomSrc: { type: String, default: '' },
    alt: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  data() {
    return {
      isOpen: false,
      savedScroll: 0,
      pendingScroll: null,
      lightboxSrc: '',
      useTight: false,
    }
  },
  computed: {
    displaySrc() {
      return this.useTight && this.tightSrc ? this.tightSrc : this.src
    },
  },
  created() {
    this.useTight = this.estimateUseTight()
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
    this.resizeObserver = new ResizeObserver(() => this.syncTightCrop())
    this.resizeObserver.observe(this.$el)
    this.syncTightCrop()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
    this.resizeObserver?.disconnect()
    this.unlockScroll()
  },
  methods: {
    open(event) {
      const preview = this.$refs.preview
      if (!preview) return

      const previewRect = preview.getBoundingClientRect()
      const ratioX = this.clamp((event.clientX - previewRect.left) / previewRect.width, 0, 1)
      const ratioY = this.clamp((event.clientY - previewRect.top) / previewRect.height, 0, 1)
      const viewX = event.clientX
      const viewY = event.clientY

      this.savedScroll = window.scrollY
      this.lightboxSrc = this.resolveLightboxSrc()
      this.isOpen = true
      document.body.style.overflow = 'hidden'

      this.pendingScroll = { ratioX, ratioY, viewX, viewY }
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.applyPendingScroll()
        })
      })
    },
    onLightboxLoad() {
      this.applyPendingScroll()
    },
    applyPendingScroll() {
      if (!this.pendingScroll) return
      const { ratioX, ratioY, viewX, viewY } = this.pendingScroll
      this.scrollToPoint(ratioX, ratioY, viewX, viewY)
    },
    scrollToPoint(ratioX, ratioY, viewX, viewY) {
      const lightbox = this.$refs.lightbox
      const img = lightbox?.querySelector('.lightbox-img')
      if (!lightbox || !img) return

      const lbRect = lightbox.getBoundingClientRect()
      lightbox.scrollLeft = this.clamp(
        ratioX * img.scrollWidth - (viewX - lbRect.left),
        0,
        Math.max(0, lightbox.scrollWidth - lightbox.clientWidth)
      )
      lightbox.scrollTop = this.clamp(
        ratioY * img.scrollHeight - (viewY - lbRect.top),
        0,
        Math.max(0, lightbox.scrollHeight - lightbox.clientHeight)
      )
    },
    clamp(value, min, max) {
      return Math.max(min, Math.min(value, max))
    },
    resolveLightboxSrc() {
      if (this.zoomSrc) return this.zoomSrc
      return this.displaySrc
    },
    canTighten() {
      return Boolean(this.tightSrc) && this.contentWidthRatio > 0 && this.contentWidthRatio < 1
    },
    measureTextBlockWidth() {
      const body = this.$el?.closest('.project-body')
      const title = body?.querySelector('section > h2')
      const paragraph = body?.querySelector('section > p:not(.caption)')
      if (!title || !paragraph) return 0
      const titleRect = title.getBoundingClientRect()
      const textRect = paragraph.getBoundingClientRect()
      const rule = parseFloat(getComputedStyle(body).getPropertyValue('--project-rule-offset')) || 0
      const lineLeft = textRect.left - rule
      const left = Math.min(titleRect.left, lineLeft)
      return Math.max(0, textRect.right - left)
    },
    estimateTextBlockWidth(vw) {
      const mobile = vw < 800
      if (mobile) {
        const edge = 40
        const rule = 12
        return vw - edge * 2 + rule
      }
      const edge = 20
      const rule = 24
      const contentW = 668
      const bodyLeft = Math.max(edge + rule, vw / 2 - contentW / 2 + 22.5)
      const text = Math.min(contentW, vw - bodyLeft - edge)
      const spaceLeft = Math.max(0, bodyLeft - edge)
      const titleOffset = Math.min(52, Math.max(rule, spaceLeft))
      return text + Math.max(titleOffset, rule)
    },
    estimateUseTight() {
      if (!this.canTighten() || typeof window === 'undefined') return false
      const vw = window.innerWidth
      const pixelWidth = Math.max(0, vw - 40) * this.contentWidthRatio
      return pixelWidth <= this.estimateTextBlockWidth(vw) + TEXT_BLOCK_SLACK_PX
    },
    syncTightCrop() {
      if (!this.canTighten()) {
        this.useTight = false
        return
      }
      const textWidth = this.measureTextBlockWidth()
      const imageWidth = this.$refs.preview?.getBoundingClientRect().width || 0
      if (!textWidth || !imageWidth) {
        this.useTight = this.estimateUseTight()
        return
      }
      const pixelWidth = imageWidth * this.contentWidthRatio
      this.useTight = pixelWidth <= textWidth + TEXT_BLOCK_SLACK_PX
    },
    close() {
      const scrollY = this.savedScroll
      this.isOpen = false
      this.pendingScroll = null
      this.unlockScroll()
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY)
      })
    },
    unlockScroll() {
      document.body.style.overflow = ''
    },
    onKeydown(e) {
      if (e.key === 'Escape' && this.isOpen) this.close()
    },
  },
}
</script>

<style scoped>
.zoomable-trigger {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Ccircle cx='10' cy='10' r='6.5' fill='white' stroke='%232c2c2c' stroke-width='1.5'/%3E%3Cpath stroke='%232c2c2c' stroke-width='1.5' stroke-linecap='round' d='M14.2 14.2L19 19'/%3E%3Cpath stroke='%232c2c2c' stroke-width='1.5' stroke-linecap='round' d='M8 10h4M10 8v4'/%3E%3C/svg%3E")
      12 12,
    zoom-in;
}

.preview {
  width: 100%;
  display: block;
  pointer-events: none;
}

.caption {
  font-size: 16px;
  color: #757575;
  margin-top: 42px;
  text-align: left;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  overflow: auto;
  background: rgba(255, 255, 255, 0.98);
}

.lightbox-close {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 1001;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  font-size: 36px;
  line-height: 1;
  color: #2c2c2c;
  cursor: pointer;
}

.lightbox-close:hover {
  color: #000aaa;
}

.lightbox-stage {
  display: block;
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  padding: 48px 24px;
  box-sizing: border-box;
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Ccircle cx='10' cy='10' r='6.5' fill='white' stroke='%232c2c2c' stroke-width='1.5'/%3E%3Cpath stroke='%232c2c2c' stroke-width='1.5' stroke-linecap='round' d='M14.2 14.2L19 19'/%3E%3Cpath stroke='%232c2c2c' stroke-width='1.5' stroke-linecap='round' d='M8 10h4'/%3E%3C/svg%3E")
      12 12,
    zoom-out;
}

.lightbox-img {
  display: block;
  width: 400vw;
  height: auto;
}
</style>
