<template>
  <div class="full-image">
    <button
      v-show="!isOpen"
      type="button"
      class="zoomable-trigger"
      :aria-label="`View full size: ${alt}`"
      @click="open($event)"
    >
      <img ref="preview" :src="src" :alt="alt" class="preview" />
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
          <img :src="zoomSrc || src" :alt="alt" class="lightbox-img" @load="onLightboxLoad" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'ZoomableImage',
  props: {
    src: { type: String, required: true },
    zoomSrc: { type: String, default: '' },
    alt: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  data() {
    return {
      isOpen: false,
      savedScroll: 0,
      pendingScroll: null,
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
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
  font-size: 14px;
  color: #757575;
  margin-top: 12px;
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
