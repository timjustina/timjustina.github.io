<template>
  <Teleport to="body">
    <div
      v-if="eligible"
      class="hero-intro-cursor-magnifier"
      :style="magnifierWindowStyle"
      aria-hidden="true"
    >
      <div class="hero-intro-cursor-magnifier__stage">
        <div
          ref="magnifierScaled"
          class="hero-intro-cursor-magnifier__scaled"
          :style="magnifierScaledStyle"
        >
          <div ref="mirrorRoot" class="hero-intro-cursor-magnifier__clone-host" />
        </div>
        <div
          ref="magnifierTopBarFrost"
          class="hero-intro-cursor-magnifier__top-bar-frost"
          aria-hidden="true"
        >
          <div
            ref="magnifierTopBarFrostBlurHost"
            class="hero-intro-cursor-magnifier__top-bar-frost-blur-host"
          >
            <div
              ref="magnifierTopBarFrostBlurScaled"
              class="hero-intro-cursor-magnifier__top-bar-frost-blur"
            >
              <div ref="mirrorFrostBlurRoot" class="hero-intro-cursor-magnifier__clone-host" />
            </div>
          </div>
          <div class="hero-intro-cursor-magnifier__top-bar-frost-tint" />
        </div>
        <div
          class="hero-intro-cursor-magnifier__top-bar-chrome"
          :style="magnifierChromeStyle"
        >
          <div ref="mirrorTopBarRoot" class="hero-intro-cursor-magnifier__clone-host" />
        </div>
        <img
          ref="magnifierLogo"
          class="hero-intro-cursor-magnifier__logo"
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
    <span
      v-if="eligible"
      class="hero-intro-cursor-ball hero-intro-cursor-dot-disk"
      :class="{ 'hero-intro-cursor-ball--visible': dotDiskVisible }"
      :style="dotDiskStyle"
      aria-hidden="true"
    />
    <span
      v-if="eligible"
      class="hero-intro-cursor-ball hero-intro-cursor-ball--dot"
      :class="{
        'hero-intro-cursor-ball--visible': visible,
        'hero-intro-cursor-ball--hover-expand': dotHoverExpand,
      }"
      :style="ballStyle"
      aria-hidden="true"
    />
  </Teleport>
</template>

<script>
const CURSOR_MAGNIFY_BOOST = 0.25
const CURSOR_LAYER_Z = 10002
const CURSOR_HOVER_LOCK_PAD = 8
const CURSOR_DOT_SIZE = 8
const CURSOR_GLASS_IDLE_SIZE = 46
const CURSOR_GLASS_HOVER_EXTRA = 18
const CURSOR_HOLLOW_END = 0.28
const CURSOR_HOVER_LERP = 0.3
const CURSOR_HOVER_DISK_EXPAND_IN = 0.1
const CURSOR_HOVER_DOT_RING_OUT = 0.22
const CURSOR_FINE_POINTER_MQ = '(hover: hover) and (pointer: fine)'
const CURSOR_DOC_CLASS = 'portfolio-hero-cursor'

const CURSOR_HOVER_TARGET_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  '[role="button"]',
  'label',
  'input:not(:disabled)',
  'textarea:not(:disabled)',
  'select:not(:disabled)',
  '.cta-button',
  '.nav-link',
  '.project-image-link',
  '.project-caption-link',
  '.about-action-btn',
  '.footer-email',
  '.project-tldr-trigger',
  '.project-tldr-copy',
  '.zoomable-trigger',
].join(', ')

const CURSOR_MIRROR_HOVER_ANCESTORS = ['.project', '.project--upcoming', '.project-tldr']

function isCursorEnvironment() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(CURSOR_FINE_POINTER_MQ).matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getInitialPos() {
  return {
    x: Math.round(window.innerWidth / 2),
    y: Math.round(window.innerHeight / 2),
  }
}

function hoverMorph(hoverMix) {
  if (hoverMix <= 0) return { hollow: 0, expand: 0 }
  if (hoverMix <= CURSOR_HOLLOW_END) {
    const t = hoverMix / CURSOR_HOLLOW_END
    return { hollow: 1 - (1 - t) ** 2.2, expand: 0 }
  }
  const t = (hoverMix - CURSOR_HOLLOW_END) / (1 - CURSOR_HOLLOW_END)
  return { hollow: 1, expand: 1 - (1 - t) ** 3 }
}

function hoverDiskForward(hoverMix) {
  if (hoverMix <= 0) return 0
  const t = Math.min(1, hoverMix)
  const crest = Math.sin((Math.min(t, 0.92) / 0.92) * Math.PI)
  const settle = t > 0.78 ? (t - 0.78) / 0.22 : 0
  return crest * 0.14 * (1 - settle)
}

function rangeSmoothstep(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function hoverDiskOpacity(hoverMix) {
  if (hoverMix <= 0) return 1
  const { hollow, expand } = hoverMorph(hoverMix)
  if (expand <= 0) {
    return Math.max(0.4, 1 - hollow * 0.42)
  }
  if (expand < CURSOR_HOVER_DISK_EXPAND_IN) {
    return 0.4 + rangeSmoothstep(expand / CURSOR_HOVER_DISK_EXPAND_IN) * 0.6
  }
  return 1
}

function hoverExpandSize(hoverMix) {
  const { expand } = hoverMorph(hoverMix)
  if (expand <= 0) return CURSOR_DOT_SIZE
  const targetSize = dotDiskSize(hoverMix)
  const easedExpand = 1 - (1 - expand) ** 2.8
  return CURSOR_DOT_SIZE + (targetSize - CURSOR_DOT_SIZE) * easedExpand
}

function dotDiskSize(hoverMix) {
  const fullHover = CURSOR_GLASS_IDLE_SIZE + CURSOR_GLASS_HOVER_EXTRA
  if (hoverMix <= 0) return CURSOR_GLASS_IDLE_SIZE
  const { hollow, expand } = hoverMorph(hoverMix)
  if (expand <= 0) {
    return (
      CURSOR_GLASS_IDLE_SIZE + (CURSOR_DOT_SIZE - CURSOR_GLASS_IDLE_SIZE) * hollow
    )
  }
  return CURSOR_DOT_SIZE + (fullHover - CURSOR_DOT_SIZE) * expand
}

function magnifierStageRectFromViewportRect(layout, rect) {
  const combinedScale = layout.scale * layout.forwardScale
  return {
    left: Math.round(layout.half + (rect.left - layout.cx) * combinedScale),
    top: Math.round(layout.half + (rect.top - layout.cy) * combinedScale),
    width: Math.round(rect.width * combinedScale),
    height: Math.round(rect.height * combinedScale),
    scale: combinedScale,
  }
}

function magnifierIntersectsLayout(layout, rect) {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > layout.windowTop &&
    rect.top < layout.windowTop + layout.size &&
    rect.right > layout.windowLeft &&
    rect.left < layout.windowLeft + layout.size
  )
}

export default {
  name: 'SiteCursor',
  props: {
    /** Root page element used as the magnifier mirror source. */
    pageEl: {
      type: Object,
      default: null,
    },
  },
  data() {
    const env = isCursorEnvironment()
    const pos = env ? getInitialPos() : { x: 0, y: 0 }
    return {
      eligible: env,
      active: env,
      pos: { ...pos },
      glassPos: { ...pos },
      glassRaf: null,
      hoverMix: 0,
      overHover: false,
      hoverLockEl: null,
      scrollHoverSuppressUntil: 0,
      magnifierLayout: null,
      mirrorClone: null,
      mirrorFrostBlurClone: null,
      mirrorTopBarClone: null,
      mirrorAwaitingRefresh: false,
      mirrorHoverTarget: 0,
      fineMq: null,
    }
  },
  computed: {
    hideNative() {
      return this.eligible && this.active
    },
    visible() {
      return this.eligible && this.active
    },
    dotDiskVisible() {
      return this.visible
    },
    dotHoverExpand() {
      const hoverMix = this.hoverMix
      if (hoverMix <= 0) return false
      const { expand } = hoverMorph(hoverMix)
      return expand > 0.001 && expand < CURSOR_HOVER_DOT_RING_OUT
    },
    ballStyle() {
      if (!this.visible) {
        return { opacity: 0, visibility: 'hidden', pointerEvents: 'none' }
      }

      const hoverMix = this.hoverMix
      let x = this.pos.x
      let y = this.pos.y
      let size = CURSOR_DOT_SIZE
      let opacity = 1
      let background = '#000aaa'
      let borderWidth = 0
      let hoverExpand = 0
      let useGlassRingBorder = false

      if (hoverMix > 0) {
        const { hollow, expand } = hoverMorph(hoverMix)
        if (expand <= 0) {
          background = `rgba(0, 10, 170, ${1 - hollow})`
          borderWidth = hollow * 1.5
        } else {
          hoverExpand = expand
          size = hoverExpandSize(hoverMix)
          background = 'transparent'
          useGlassRingBorder = true
          ;({ x, y } = this.glassPos)
          if (expand >= CURSOR_HOVER_DISK_EXPAND_IN * 0.45) {
            const t = Math.min(
              1,
              (expand - CURSOR_HOVER_DISK_EXPAND_IN * 0.45) / CURSOR_HOVER_DOT_RING_OUT,
            )
            opacity = Math.max(0, 1 - rangeSmoothstep(t))
          }
        }
      }

      const half = size / 2
      const style = {
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width: `${size}px`,
        height: `${size}px`,
        margin: `${-half}px 0 0 ${-half}px`,
        background,
        boxSizing: 'border-box',
        opacity,
        visibility: opacity < 0.02 ? 'hidden' : 'visible',
      }

      if (useGlassRingBorder) {
        style['--hero-cursor-hover-expand'] = hoverExpand
        style.border = 'none'
      } else if (borderWidth > 0.01) {
        style.border = `${borderWidth}px solid #000aaa`
      } else {
        style.border = 'none'
      }

      return style
    },
    dotDiskStyle() {
      if (!this.dotDiskVisible) {
        return { opacity: 0, visibility: 'hidden', pointerEvents: 'none' }
      }

      const hoverMix = this.hoverMix
      const { expand } = hoverMorph(hoverMix)
      const { x, y } = this.glassPos
      const size = dotDiskSize(hoverMix)
      const half = size / 2
      const opacity = hoverDiskOpacity(hoverMix)
      const forwardScale = 1 + hoverDiskForward(hoverMix)

      return {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${forwardScale})`,
        '--hero-cursor-hover-mix': hoverMix,
        '--hero-cursor-hover-expand': expand,
        width: `${size}px`,
        height: `${size}px`,
        margin: `${-half}px 0 0 ${-half}px`,
        opacity,
        visibility: opacity < 0.02 ? 'hidden' : 'visible',
      }
    },
    magnifierWindowStyle() {
      const layout = this.magnifierLayout
      if (!layout) {
        return { opacity: 0, visibility: 'hidden', pointerEvents: 'none' }
      }

      const opacity = layout.opacity ?? 1
      return {
        position: 'fixed',
        left: `${layout.windowLeft}px`,
        top: `${layout.windowTop}px`,
        width: `${layout.size}px`,
        height: `${layout.size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        opacity,
        visibility: opacity < 0.02 ? 'hidden' : 'visible',
        pointerEvents: 'none',
        zIndex: CURSOR_LAYER_Z - 1,
      }
    },
    magnifierScaledStyle() {
      const layout = this.magnifierLayout
      if (!layout || typeof window === 'undefined') {
        return { display: 'none' }
      }

      const combinedScale = layout.scale * layout.forwardScale
      return {
        position: 'absolute',
        left: `${layout.half - layout.cx}px`,
        top: `${layout.half - layout.cy}px`,
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        transform: `scale(${combinedScale})`,
        transformOrigin: `${layout.cx}px ${layout.cy}px`,
        '--hero-cursor-magnifier-scale': String(combinedScale),
      }
    },
    magnifierChromeStyle() {
      const layout = this.magnifierLayout
      if (!layout || typeof window === 'undefined') {
        return { display: 'none' }
      }

      const combinedScale = layout.scale * layout.forwardScale
      return {
        position: 'absolute',
        left: `${layout.half - layout.cx}px`,
        top: `${layout.half - layout.cy}px`,
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        opacity: 1,
        transform: `scale(${combinedScale})`,
        transformOrigin: `${layout.cx}px ${layout.cy}px`,
        '--hero-cursor-magnifier-scale': String(combinedScale),
      }
    },
  },
  watch: {
    hideNative() {
      this.syncDocumentClass()
    },
    pageEl() {
      // Rebuild when the case-study root mounts/changes; keep off the hover path
      // so hover-in does not flash a fresh sharp clone under the frost.
      this.$nextTick(() => {
        if (!this.eligible || !this.getPageSource()) return
        this.refreshMirror()
        if (this.mirrorHoverTarget === 1) this.updateMagnifierLayout()
      })
    },
  },
  mounted() {
    if (!this.eligible) return

    this.syncDocumentClass()
    this.fineMq = window.matchMedia(CURSOR_FINE_POINTER_MQ)
    this.onFineMqChange = () => {
      const next = isCursorEnvironment()
      if (next === this.eligible) return
      this.eligible = next
      if (next) {
        this.prime()
      } else {
        this.endPointer()
        this.syncDocumentClass()
      }
    }
    this.fineMq.addEventListener('change', this.onFineMqChange)

    this.onPointerMove = (event) => {
      if (event.pointerType !== 'mouse') return
      this.updatePointer(event.clientX, event.clientY)
    }
    this.onPointerEnter = (event) => {
      if (event.pointerType !== 'mouse') return
      this.updatePointer(event.clientX, event.clientY)
    }
    this.onPointerLeaveWindow = (event) => {
      if (event.relatedTarget != null) return
      const { clientX: x, clientY: y } = event
      const margin = 2
      if (
        x >= -margin &&
        y >= -margin &&
        x <= window.innerWidth + margin &&
        y <= window.innerHeight + margin
      ) {
        return
      }
      this.endPointer()
    }
    this.onScroll = () => this.onScrollHandler()

    this.prime()
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    document.addEventListener('pointerenter', this.onPointerEnter, { passive: true })
    window.addEventListener('pointerleave', this.onPointerLeaveWindow, { passive: true })
    window.addEventListener('blur', this.endPointer)
    window.addEventListener('scroll', this.onScroll, { passive: true, capture: true })
  },
  beforeUnmount() {
    this.fineMq?.removeEventListener('change', this.onFineMqChange)
    window.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerenter', this.onPointerEnter)
    window.removeEventListener('pointerleave', this.onPointerLeaveWindow)
    window.removeEventListener('blur', this.endPointer)
    window.removeEventListener('scroll', this.onScroll, { capture: true })
    this.endPointer()
    document.documentElement.classList.remove(CURSOR_DOC_CLASS)
  },
  methods: {
    getPageSource() {
      const el = this.pageEl
      if (el instanceof Element) return el
      return null
    },
    syncDocumentClass() {
      if (this.hideNative) {
        document.documentElement.classList.add(CURSOR_DOC_CLASS)
      } else {
        document.documentElement.classList.remove(CURSOR_DOC_CLASS)
      }
    },
    prime() {
      if (!isCursorEnvironment()) return
      this.eligible = true
      this.active = true
      this.syncDocumentClass()
      this.startGlassFollow()
      // Pre-build the magnifier mirror so the first hover does not clone mid-expand
      // (that swap is what flashes sharp page under the frosted bar).
      this.$nextTick(() => {
        if (!this.eligible || this.mirrorClone || !this.getPageSource()) return
        this.refreshMirror()
        this.prewarmMagnifierTopBarFrost()
      })
    },
    prewarmMagnifierTopBarFrost() {
      const el = this.$refs.magnifierTopBarFrost
      if (!(el instanceof Element)) return
      const liveTopBar = this.getPageSource()?.querySelector('.portfolio-top-bar .top-bar')
      const topBarClasses = liveTopBar
        ? [...liveTopBar.classList].filter((cls) => cls.startsWith('top-bar--')).join(' ')
        : 'top-bar--glass'
      el.className = `hero-intro-cursor-magnifier__top-bar-frost${
        topBarClasses ? ` ${topBarClasses}` : ''
      }`
      // Keep a tiny frosted layer composited so the first hover does not cold-start blur.
      el.style.visibility = 'visible'
      el.style.opacity = '0'
      el.style.left = '0'
      el.style.top = '0'
      el.style.width = '48px'
      el.style.height = '48px'
    },
    updatePointer(x, y, { skipHover = false } = {}) {
      const wasActive = this.active
      this.pos = { x, y }
      this.active = true
      this.syncDocumentClass()
      if (skipHover) {
        this.overHover = false
      } else {
        this.overHover = this.isOverHoverTarget(x, y)
      }
      const magnifierVisible = this.overHover || this.hoverMix > 0.02
      if (!wasActive || magnifierVisible) {
        this.glassPos = { x, y }
      }
      this.startGlassFollow()
    },
    startGlassFollow() {
      if (this.glassRaf != null) return

      const tick = () => {
        this.glassRaf = null
        if (!this.active) return

        const { x: tx, y: ty } = this.pos
        const scrollHoverSuppressed =
          typeof performance !== 'undefined' &&
          performance.now() < this.scrollHoverSuppressUntil
        const hoverTarget =
          scrollHoverSuppressed || !this.isOverHoverTarget(tx, ty) ? 0 : 1
        const magnifierVisible = hoverTarget === 1 || this.hoverMix > 0.02
        const { x: gx, y: gy } = this.glassPos
        const follow = 0.1
        const nx = gx + (tx - gx) * follow
        const ny = gy + (ty - gy) * follow

        if (magnifierVisible) {
          this.glassPos = { x: tx, y: ty }
        } else {
          this.glassPos = { x: nx, y: ny }
        }

        this.overHover = hoverTarget === 1
        const hoverLerp = hoverTarget === 1 ? CURSOR_HOVER_LERP : 0.45
        this.hoverMix += (hoverTarget - this.hoverMix) * hoverLerp
        if (hoverTarget === 0 && this.hoverMix < 0.04) {
          this.hoverMix = 0
          this.hoverLockEl = null
        }

        // Hover-in only blocks when the mirror is missing. Do not re-clone on every
        // hover — replaceChildren under an active frost is what flashes the bar.
        if (hoverTarget === 1 && !this.mirrorClone && this.mirrorHoverTarget !== 1) {
          this.mirrorAwaitingRefresh = true
          requestAnimationFrame(() => {
            if (this.mirrorHoverTarget !== 1) {
              this.mirrorAwaitingRefresh = false
              return
            }
            this.refreshMirror()
            this.mirrorAwaitingRefresh = false
            this.updateMagnifierLayout()
          })
        }
        this.mirrorHoverTarget = hoverTarget
        this.updateMagnifierLayout()

        this.glassRaf = requestAnimationFrame(tick)
      }

      this.glassRaf = requestAnimationFrame(tick)
    },
    stopGlassFollow() {
      if (this.glassRaf == null) return
      cancelAnimationFrame(this.glassRaf)
      this.glassRaf = null
      this.destroyMirror()
    },
    endPointer() {
      this.active = false
      this.hoverMix = 0
      this.overHover = false
      this.hoverLockEl = null
      this.syncDocumentClass()
      this.stopGlassFollow()
    },
    onScrollHandler() {
      if (!this.active) return
      this.scrollHoverSuppressUntil = performance.now() + 140
      this.hoverLockEl = null
      this.overHover = false
      this.hoverMix *= 0.45

      if (this.mirrorHoverTarget === 1) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (this.mirrorHoverTarget !== 1) return
            this.refreshMirror()
            this.updateMagnifierLayout()
          })
        })
      }

      const { x, y } = this.pos
      this.updatePointer(x, y, { skipHover: true })
    },
    isOverHoverTarget(x, y) {
      return this.getHoverTargetElement(x, y) != null
    },
    getHoverTargetElement(x, y) {
      if (typeof document === 'undefined') return null

      const lock = this.hoverLockEl
      if (lock?.isConnected) {
        const rect = lock.getBoundingClientRect()
        const pad = CURSOR_HOVER_LOCK_PAD
        if (
          x >= rect.left - pad &&
          x <= rect.right + pad &&
          y >= rect.top - pad &&
          y <= rect.bottom + pad
        ) {
          return lock
        }
        this.hoverLockEl = null
      }

      const stack =
        document.elementsFromPoint?.(x, y) ??
        [document.elementFromPoint(x, y)].filter(Boolean)

      for (const el of stack) {
        if (!(el instanceof Element)) continue
        if (
          el.closest(
            '.hero-intro-cursor-ball, .hero-intro-cursor-magnifier, .hero-intro-cursor-drag-hit',
          )
        ) {
          continue
        }

        const target = el.closest(CURSOR_HOVER_TARGET_SELECTOR)
        if (target) {
          this.hoverLockEl = target
          return target
        }
      }

      return null
    },
    /** Elements stripped from the magnifier clone in refreshMirror — skip when indexing. */
    isMirrorCloneOmitted(el) {
      return (
        el instanceof Element &&
        el.matches(
          '.portfolio-top-bar, .hero-intro-cursor-ball, .hero-intro-cursor-magnifier, .hero-intro-cursor-drag-hit',
        )
      )
    },
    getMirrorNodeForLive(liveEl, cloneRoot, sourceRoot) {
      if (!(liveEl instanceof Element) || !cloneRoot || !sourceRoot) return null
      if (liveEl.closest('.portfolio-top-bar')) {
        return this.findMirrorNodeFallback(liveEl, cloneRoot)
      }

      const path = []
      let node = liveEl
      while (node && node !== sourceRoot) {
        const parent = node.parentElement
        if (!parent) return null
        // Match clone child indices after refreshMirror removes the top bar / cursor nodes.
        let index = 0
        for (const child of parent.children) {
          if (child === node) break
          if (this.isMirrorCloneOmitted(child)) continue
          index += 1
        }
        path.unshift(index)
        node = parent
      }
      if (node !== sourceRoot) return null

      let mirror = cloneRoot
      for (const index of path) {
        mirror = mirror.children[index]
        if (!mirror) break
      }
      if (mirror instanceof Element) return mirror

      return this.findMirrorNodeFallback(liveEl, cloneRoot)
    },
    findMirrorNodeFallback(liveEl, cloneRoot) {
      if (!(liveEl instanceof Element) || !cloneRoot) return null

      if (liveEl.id) {
        const byId = cloneRoot.querySelector(`#${CSS.escape(liveEl.id)}`)
        if (byId instanceof Element) return byId
      }

      if (liveEl instanceof HTMLAnchorElement) {
        const href = liveEl.getAttribute('href')
        if (href) {
          const matches = [
            ...cloneRoot.querySelectorAll(`a[href="${CSS.escape(href)}"]`),
          ]
          if (matches.length === 1) return matches[0]
          const label = liveEl.textContent?.trim()
          if (label) {
            const labeled = matches.find((node) => node.textContent?.trim() === label)
            if (labeled) return labeled
          }
        }
      }

      const tag = liveEl.tagName.toLowerCase()
      const classSelector = [...liveEl.classList]
        .map((className) => `.${CSS.escape(className)}`)
        .join('')
      const candidates = [...cloneRoot.querySelectorAll(`${tag}${classSelector}`)]
      if (candidates.length === 1) return candidates[0]

      const label = liveEl.textContent?.trim()
      if (label) {
        const labeled = candidates.filter((node) => node.textContent?.trim() === label)
        if (labeled.length === 1) return labeled[0]
      }

      for (const candidate of candidates) {
        if (
          Math.abs(candidate.offsetTop - liveEl.offsetTop) <= 1 &&
          Math.abs(candidate.offsetLeft - liveEl.offsetLeft) <= 1
        ) {
          return candidate
        }
      }

      return null
    },
    clearMirrorHoverState() {
      for (const root of [this.mirrorClone, this.mirrorTopBarClone]) {
        root?.querySelectorAll('.hero-cursor-mirror-hover').forEach((el) => {
          el.classList.remove('hero-cursor-mirror-hover')
        })
      }
    },
    /**
     * Keep TL;DR open/closed classes in sync with the live page.
     * The magnifier clone is often built while the panel is closed; without this,
     * hovering the Copy CTA still shows the collapsed snapshot (CTA visibility:hidden
     * and everything below shifted up into the wrong place).
     */
    syncMirrorTldrState() {
      const source = this.getPageSource()
      if (!source) return

      const liveList = [...source.querySelectorAll('.project-tldr')]
      if (!liveList.length) return

      for (const root of [this.mirrorClone, this.mirrorFrostBlurClone]) {
        if (!root) continue
        const mirrorList = [...root.querySelectorAll('.project-tldr')]
        liveList.forEach((live, i) => {
          const mirror = mirrorList[i]
          if (!mirror) return

          const liveOpen = live.classList.contains('project-tldr--open')
          const mirrorOpen = mirror.classList.contains('project-tldr--open')
          const liveSlot = live.querySelector('.project-tldr-panel-slot')
          const mirrorSlot = mirror.querySelector('.project-tldr-panel-slot')
          const liveSlotOpen = !!liveSlot?.classList.contains('project-tldr-panel-slot--open')
          const mirrorSlotOpen = !!mirrorSlot?.classList.contains('project-tldr-panel-slot--open')
          const mismatched = liveOpen !== mirrorOpen || liveSlotOpen !== mirrorSlotOpen

          if (mismatched) {
            // Snap to the live layout instead of replaying the open/close animation
            // from a stale collapsed/expanded snapshot under the glass.
            mirror
              .querySelectorAll(
                '.project-tldr-panel-slot, .project-tldr-panel, .project-tldr-chevron',
              )
              .forEach((el) => {
                el.style.transition = 'none'
              })
          }

          mirror.classList.toggle('project-tldr--open', liveOpen)
          if (liveSlot && mirrorSlot) {
            mirrorSlot.classList.toggle('project-tldr-panel-slot--open', liveSlotOpen)
          }

          if (mismatched) {
            void mirror.offsetWidth
            requestAnimationFrame(() => {
              mirror
                .querySelectorAll(
                  '.project-tldr-panel-slot, .project-tldr-panel, .project-tldr-chevron',
                )
                .forEach((el) => {
                  el.style.removeProperty('transition')
                })
            })
          }
        })
      }
    },
    syncMirrorHoverState(x, y) {
      const clone = this.mirrorClone
      const chrome = this.mirrorTopBarClone
      const source = this.getPageSource()
      if (!clone || !source) {
        this.clearMirrorHoverState()
        return
      }

      this.clearMirrorHoverState()

      const liveTarget = this.getHoverTargetElement(x, y)
      if (!liveTarget) return

      const liveNodes = [liveTarget]
      for (const selector of CURSOR_MIRROR_HOVER_ANCESTORS) {
        const ancestor = liveTarget.closest(selector)
        if (ancestor) liveNodes.push(ancestor)
      }

      for (const liveNode of liveNodes) {
        let mirrorNode = this.getMirrorNodeForLive(liveNode, clone, source)
        if (
          !mirrorNode &&
          chrome &&
          liveNode.closest('.portfolio-top-bar, .top-bar, .nav-link')
        ) {
          mirrorNode = this.findMirrorNodeFallback(liveNode, chrome)
        }
        mirrorNode?.classList.add('hero-cursor-mirror-hover')
      }
    },
    refreshMirror() {
      const root = this.$refs.mirrorRoot
      const source = this.getPageSource()
      if (!root || !source) return

      this.clearMirrorHoverState()
      const prevClone = this.mirrorClone
      const clone = source.cloneNode(true)
      clone.setAttribute('aria-hidden', 'true')
      clone.classList.add('hero-intro-cursor-mirror-clone')
      clone
        .querySelectorAll(
          '.hero-intro-cursor-ball, .hero-intro-cursor-magnifier, .hero-intro-cursor-drag-hit',
        )
        .forEach((el) => el.remove())
      clone.querySelector('.portfolio-top-bar')?.remove()

      // Double-buffer: insert the new clone under the old one, then drop the old
      // next frame so frost keeps sampling stable pixels (no sharp flash).
      if (prevClone?.isConnected && prevClone.parentElement === root) {
        root.insertBefore(clone, prevClone)
        this.mirrorClone = clone
        this.syncMirrorClone()
        requestAnimationFrame(() => {
          if (prevClone.isConnected) prevClone.remove()
          if (this.magnifierLayout) this.syncMagnifierTopBarFrostEl(this.magnifierLayout)
        })
      } else {
        root.replaceChildren(clone)
        this.mirrorClone = clone
        this.syncMirrorClone()
      }

      this.refreshMirrorFrostBlurClone(clone)

      const topBarRoot = this.$refs.mirrorTopBarRoot
      const topBarSource = source.querySelector('.portfolio-top-bar')
      if (topBarRoot) {
        if (topBarSource) {
          const topBarClone = topBarSource.cloneNode(true)
          topBarClone.setAttribute('aria-hidden', 'true')
          topBarClone.querySelector('.logo-block')?.remove()
          topBarRoot.replaceChildren(topBarClone)
          this.mirrorTopBarClone = topBarClone
        } else {
          topBarRoot.replaceChildren()
          this.mirrorTopBarClone = null
        }
      }

      this.syncMirrorTopBarChrome()
      if (this.magnifierLayout) {
        this.syncMagnifierTopBarFrostEl(this.magnifierLayout)
      }
    },
    refreshMirrorFrostBlurClone(sourceClone) {
      const frostRoot = this.$refs.mirrorFrostBlurRoot
      if (!frostRoot || !(sourceClone instanceof Element)) {
        this.mirrorFrostBlurClone = null
        return
      }
      const frostClone = sourceClone.cloneNode(true)
      frostRoot.replaceChildren(frostClone)
      this.mirrorFrostBlurClone = frostClone
      this.syncMirrorFrostBlurClone()
    },
    syncMirrorFrostBlurClone() {
      const source = this.getPageSource()
      const clone = this.mirrorFrostBlurClone
      if (!source || !clone) return

      const sourceRect = source.getBoundingClientRect()
      clone.style.position = 'absolute'
      clone.style.left = `${sourceRect.left}px`
      clone.style.top = `${sourceRect.top}px`
      clone.style.width = `${source.offsetWidth}px`
      clone.style.minHeight = `${source.offsetHeight}px`
    },
    syncMagnifierTopBarFrostEl(layout) {
      const el = this.$refs.magnifierTopBarFrost
      const frost = layout?.topBarFrost
      const liveTopBar = this.getPageSource()?.querySelector('.portfolio-top-bar .top-bar')

      if (!(el instanceof Element)) {
        this.syncMagnifierLogoEl(layout)
        return
      }

      if (!frost?.visible || !liveTopBar || !layout) {
        el.style.opacity = '0'
        el.style.visibility = 'visible'
        this.syncMagnifierLogoEl(layout)
        return
      }

      const topBarClasses = [...liveTopBar.classList]
        .filter((cls) => cls.startsWith('top-bar--'))
        .join(' ')
      const nextClass = `hero-intro-cursor-magnifier__top-bar-frost${
        topBarClasses ? ` ${topBarClasses}` : ''
      }`
      if (el.className !== nextClass) el.className = nextClass

      const transparent =
        liveTopBar.classList.contains('top-bar--transparent') &&
        !liveTopBar.classList.contains('top-bar--glass')

      el.style.visibility = 'visible'
      el.style.opacity = '1'
      el.style.left = `${frost.left}px`
      el.style.top = `${frost.top}px`
      el.style.width = `${frost.width}px`
      el.style.height = `${frost.height}px`
      el.style.background = 'transparent'
      el.style.backdropFilter = 'none'
      el.style.webkitBackdropFilter = 'none'
      if (transparent) {
        el.style.boxShadow = 'none'
      } else {
        el.style.removeProperty('box-shadow')
      }

      const tint = el.querySelector('.hero-intro-cursor-magnifier__top-bar-frost-tint')
      if (tint instanceof Element) {
        tint.style.opacity = transparent ? '0' : '1'
      }

      const blurHost = this.$refs.magnifierTopBarFrostBlurHost
      const blurScaled = this.$refs.magnifierTopBarFrostBlurScaled
      if (blurHost instanceof Element && blurScaled instanceof Element) {
        if (transparent) {
          blurHost.style.visibility = 'hidden'
        } else {
          const combinedScale = layout.scale * layout.forwardScale
          // Host is aligned to the stage; filter runs in screen space after the
          // child scale so blur(28px) matches the live top bar. Pad so the
          // blur kernel can sample past the frost clip edges.
          const blurPad = 28
          blurHost.style.visibility = 'visible'
          blurHost.style.left = `${-frost.left - blurPad}px`
          blurHost.style.top = `${-frost.top - blurPad}px`
          blurHost.style.width = `${layout.size + blurPad * 2}px`
          blurHost.style.height = `${layout.size + blurPad * 2}px`
          blurHost.style.filter = 'blur(28px) saturate(2)'

          blurScaled.style.left = `${layout.half - layout.cx + blurPad}px`
          blurScaled.style.top = `${layout.half - layout.cy + blurPad}px`
          blurScaled.style.width = `${window.innerWidth}px`
          blurScaled.style.height = `${window.innerHeight}px`
          blurScaled.style.transform = `scale(${combinedScale})`
          blurScaled.style.transformOrigin = `${layout.cx}px ${layout.cy}px`
        }
      }

      this.syncMirrorFrostBlurClone()
      this.syncMagnifierLogoEl(layout)
    },
    syncMagnifierLogoEl(layout) {
      const logoEl = this.$refs.magnifierLogo
      if (!(logoEl instanceof HTMLImageElement)) return

      if (!layout) {
        logoEl.style.visibility = 'hidden'
        return
      }

      const page = this.getPageSource()
      const liveLogo = page?.querySelector('.portfolio-top-bar .logo')
      const liveLogoBlock = page?.querySelector('.portfolio-top-bar .logo-block')
      if (!liveLogo || !liveLogoBlock) {
        logoEl.style.visibility = 'hidden'
        return
      }

      const logoRect = liveLogo.getBoundingClientRect()
      const blockRect = liveLogoBlock.getBoundingClientRect()
      if (logoRect.width <= 0 || logoRect.height <= 0) {
        logoEl.style.visibility = 'hidden'
        return
      }

      if (!magnifierIntersectsLayout(layout, blockRect)) {
        logoEl.style.visibility = 'hidden'
        return
      }

      const logoStage = magnifierStageRectFromViewportRect(layout, logoRect)
      const src = liveLogo.currentSrc || liveLogo.getAttribute('src')
      if (src && logoEl.src !== src) {
        logoEl.src = src
      }

      logoEl.style.visibility = 'visible'
      logoEl.style.left = `${logoStage.left}px`
      logoEl.style.top = `${logoStage.top}px`
      logoEl.style.width = `${logoStage.width}px`
      logoEl.style.height = `${logoStage.height}px`
    },
    syncMirrorTopBarChrome() {
      const source = this.getPageSource()
      const chromeRoot = this.mirrorTopBarClone
      const live = source?.querySelector('.top-bar')
      const mirrored = chromeRoot?.querySelector('.top-bar')
      if (!live || !mirrored) return

      mirrored.className = live.className

      const liveRect = live.getBoundingClientRect()
      mirrored.style.position = 'absolute'
      mirrored.style.left = `${liveRect.left}px`
      mirrored.style.top = `${liveRect.top}px`
      mirrored.style.width = `${liveRect.width}px`
      mirrored.style.height = `${liveRect.height}px`
      mirrored.style.right = 'auto'
      mirrored.style.bottom = 'auto'
      mirrored.style.zIndex = '100'
      mirrored.style.background = 'transparent'
      mirrored.style.backdropFilter = 'none'
      mirrored.style.webkitBackdropFilter = 'none'
      mirrored.style.boxShadow = 'none'
      mirrored.style.transition = 'none'

      const liveNav = live.querySelector('.nav')
      const mirrorNav = mirrored.querySelector('.nav')
      if (liveNav && mirrorNav) {
        mirrorNav.className = liveNav.className
      }

      const liveWork = live.querySelector('.nav-link--work')
      const mirrorWork = mirrored.querySelector('.nav-link--work')
      if (liveWork && mirrorWork) {
        mirrorWork.className = liveWork.className
        for (const prop of ['--nav-work-line-clip-left', '--nav-work-line-clip-right']) {
          const value = liveWork.style.getPropertyValue(prop)
          if (value) mirrorWork.style.setProperty(prop, value)
          else mirrorWork.style.removeProperty(prop)
        }
      }

      const liveRoot = live.closest('.portfolio-top-bar')
      const mirrorRoot = mirrored.closest('.portfolio-top-bar')
      if (liveRoot && mirrorRoot) {
        const navCenter = liveRoot.style.getPropertyValue('--nav-work-w-center')
        if (navCenter) mirrorRoot.style.setProperty('--nav-work-w-center', navCenter)
        else mirrorRoot.style.removeProperty('--nav-work-w-center')
      }

      if (mirrorRoot && source) {
        // Nav uses absolute left: calc(var(--portfolio-decor-line-x) - …).
        // Mirror is outside the page tree, so copy the resolved value (same as Portfolio).
        const pageStyles = getComputedStyle(source)
        const decorLineX = pageStyles.getPropertyValue('--portfolio-decor-line-x').trim()
        if (decorLineX) mirrorRoot.style.setProperty('--portfolio-decor-line-x', decorLineX)
        else mirrorRoot.style.removeProperty('--portfolio-decor-line-x')

        mirrorRoot.style.position = 'absolute'
        mirrorRoot.style.left = '0'
        mirrorRoot.style.top = '0'
        mirrorRoot.style.width = `${window.innerWidth}px`
        mirrorRoot.style.height = '0'
        mirrorRoot.style.pointerEvents = 'none'
      }
    },
    syncMirrorClone() {
      const source = this.getPageSource()
      const clone = this.mirrorClone
      if (!source || !clone) return null

      const sourceRect = source.getBoundingClientRect()
      clone.style.position = 'absolute'
      clone.style.left = `${sourceRect.left}px`
      clone.style.top = `${sourceRect.top}px`
      clone.style.width = `${source.offsetWidth}px`
      clone.style.minHeight = `${source.offsetHeight}px`

      this.syncMirrorFrostBlurClone()
      this.syncMirrorTldrState()

      const cloneHost = this.$refs.mirrorRoot
      if (cloneHost instanceof Element && this.magnifierLayout) {
        cloneHost.style.opacity = String(this.magnifierLayout.opacity)
      } else if (cloneHost instanceof Element) {
        cloneHost.style.removeProperty('opacity')
      }

      return sourceRect
    },
    updateMagnifierLayout() {
      const hoverMix = this.hoverMix
      const { expand } = hoverMorph(hoverMix)
      if (expand <= 0.02 || !this.mirrorClone || this.mirrorAwaitingRefresh) {
        this.magnifierLayout = null
        this.syncMagnifierTopBarFrostEl(null)
        this.clearMirrorHoverState()
        return
      }

      const magnifyScale = 1 + CURSOR_MAGNIFY_BOOST * expand
      const forwardScale = 1 + hoverDiskForward(hoverMix)
      const combinedScale = magnifyScale * forwardScale
      const { x, y } = this.glassPos
      const size = dotDiskSize(hoverMix)
      const half = size / 2

      this.syncMirrorClone()
      this.syncMirrorTopBarChrome()
      this.syncMirrorHoverState(this.glassPos.x, this.glassPos.y)

      const liveTopBar = this.getPageSource()?.querySelector('.portfolio-top-bar .top-bar')
      let topBarFrost = null
      if (liveTopBar && !liveTopBar.classList.contains('top-bar--hidden')) {
        const barRect = liveTopBar.getBoundingClientRect()
        const frostLeft = half + (barRect.left - x) * combinedScale
        const frostTop = half + (barRect.top - y) * combinedScale
        const frostWidth = barRect.width * combinedScale
        const frostHeight = barRect.height * combinedScale
        const classes = {}
        for (const cls of liveTopBar.classList) {
          if (cls.startsWith('top-bar--')) {
            classes[cls] = true
          }
        }
        topBarFrost = {
          left: frostLeft,
          top: frostTop,
          width: frostWidth,
          height: frostHeight,
          visible:
            frostLeft < size &&
            frostTop < size &&
            frostLeft + frostWidth > 0 &&
            frostTop + frostHeight > 0,
          classes,
        }
      }

      this.magnifierLayout = {
        windowLeft: x - half,
        windowTop: y - half,
        size,
        half,
        scale: magnifyScale,
        forwardScale,
        cx: x,
        cy: y,
        opacity: expand,
        topBarFrost,
      }
      this.syncMagnifierTopBarFrostEl(this.magnifierLayout)
    },
    destroyMirror() {
      this.clearMirrorHoverState()
      this.mirrorAwaitingRefresh = false
      this.syncMagnifierTopBarFrostEl(null)
      const root = this.$refs.mirrorRoot
      if (root) root.innerHTML = ''
      const frostBlurRoot = this.$refs.mirrorFrostBlurRoot
      if (frostBlurRoot) frostBlurRoot.innerHTML = ''
      const topBarRoot = this.$refs.mirrorTopBarRoot
      if (topBarRoot) topBarRoot.innerHTML = ''
      this.mirrorClone = null
      this.mirrorFrostBlurClone = null
      this.mirrorTopBarClone = null
      this.magnifierLayout = null
      this.mirrorHoverTarget = 0
    },
  },
}
</script>

<style>
/* Shared with Portfolio.vue cursor visuals — desktop fine-pointer only. */
.hero-intro-cursor-ball {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  border-radius: 50%;
  box-sizing: border-box;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  will-change: transform;
}

.hero-intro-cursor-dot-disk {
  width: 46px;
  height: 46px;
  margin: -23px 0 0 -23px;
  background: transparent;
  transform-origin: center center;
  border: calc(1px - 0.5px * var(--hero-cursor-hover-expand, 0)) solid
    color-mix(
      in srgb,
      rgba(255, 255, 255, 0.85) calc((1 - var(--hero-cursor-hover-expand, 0)) * 100%),
      rgba(0, 10, 170, 0.7) calc(var(--hero-cursor-hover-expand, 0) * 100%)
    );
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, calc(0.9 * (1 - var(--hero-cursor-hover-expand, 0)))),
    inset 0 -1px 1px rgba(0, 10, 170, calc(0.06 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 4px rgba(0, 10, 170, calc(0.11 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 8px rgba(0, 10, 170, calc(0.065 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 13px rgba(0, 10, 170, calc(0.032 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 18px rgba(0, 10, 170, calc(0.016 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 calc(2px - 1px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.44 * var(--hero-cursor-hover-expand, 0))),
    0 0 calc(1px + 2px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.3 * var(--hero-cursor-hover-expand, 0))),
    0 0 calc(2px + 3px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.16 * var(--hero-cursor-hover-expand, 0))),
    0 0 calc(3px + 4px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.065 * var(--hero-cursor-hover-expand, 0))),
    0 0 calc(5px + 5px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.022 * var(--hero-cursor-hover-expand, 0))),
    0 0 calc(7px + 6px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.007 * var(--hero-cursor-hover-expand, 0)));
  z-index: 10002;
  isolation: isolate;
}

.hero-intro-cursor-dot-disk::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.28);
  -webkit-backdrop-filter: blur(2.5px) saturate(1.35);
  backdrop-filter: blur(2.5px) saturate(1.35);
  opacity: calc(1 - var(--hero-cursor-hover-expand, 0));
  pointer-events: none;
}

.hero-intro-cursor-ball--dot {
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: #000aaa;
  transform-origin: center center;
  z-index: 10003;
}

.hero-intro-cursor-ball--dot.hero-intro-cursor-ball--hover-expand {
  isolation: isolate;
  border: calc(1px - 0.5px * var(--hero-cursor-hover-expand, 0)) solid
    color-mix(
      in srgb,
      rgba(255, 255, 255, 0.85) calc((1 - var(--hero-cursor-hover-expand, 0)) * 100%),
      rgba(0, 10, 170, 0.7) calc(var(--hero-cursor-hover-expand, 0) * 100%)
    );
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, calc(0.9 * (1 - var(--hero-cursor-hover-expand, 0)))),
    inset 0 -1px 1px rgba(0, 10, 170, calc(0.06 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 4px rgba(0, 10, 170, calc(0.11 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 8px rgba(0, 10, 170, calc(0.065 * (1 - var(--hero-cursor-hover-expand, 0)))),
    0 0 calc(2px - 1px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.44 * var(--hero-cursor-hover-expand, 0))),
    0 0 calc(1px + 2px * var(--hero-cursor-hover-expand, 0))
      rgba(0, 10, 170, calc(0.3 * var(--hero-cursor-hover-expand, 0)));
}

.hero-intro-cursor-ball--dot.hero-intro-cursor-ball--hover-expand::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  opacity: 0;
  pointer-events: none;
}

.hero-intro-cursor-magnifier__stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  isolation: isolate;
}

.hero-intro-cursor-magnifier__scaled {
  z-index: 0;
  pointer-events: none;
}

.hero-intro-cursor-magnifier__top-bar-frost {
  position: absolute;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  visibility: visible;
  opacity: 0;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: none;
}

.hero-intro-cursor-magnifier__top-bar-frost-blur-host {
  position: absolute;
  overflow: visible;
  pointer-events: none;
  will-change: filter;
}

.hero-intro-cursor-magnifier__top-bar-frost-blur {
  position: absolute;
  pointer-events: none;
}

.hero-intro-cursor-magnifier__top-bar-frost-tint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.12);
  background-image: url("data:image/png;base64,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");
  background-size: auto 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.hero-intro-cursor-magnifier__top-bar-chrome {
  z-index: 2;
  pointer-events: none;
}

.hero-intro-cursor-magnifier__top-bar-chrome .hero-intro-cursor-magnifier__clone-host {
  position: absolute;
  inset: 0;
}

.hero-intro-cursor-magnifier__logo {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  visibility: hidden;
  object-fit: contain;
  object-position: left top;
}

.hero-intro-cursor-magnifier__clone-host,
.hero-intro-cursor-mirror-clone,
.hero-intro-cursor-mirror-clone * {
  /* Descendants (e.g. open TL;DR panel-inner) set pointer-events:auto and would
     otherwise punch through the magnifier and steal :hover from the live CTA. */
  pointer-events: none !important;
}

.hero-intro-cursor-ball--visible {
  visibility: visible;
}

.hero-intro-cursor-dot-disk.hero-intro-cursor-ball--visible {
  opacity: 1;
}

.hero-intro-cursor-ball--dot.hero-intro-cursor-ball--visible {
  opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
  html.portfolio-hero-cursor,
  html.portfolio-hero-cursor body,
  html.portfolio-hero-cursor * {
    cursor: none !important;
  }
}

/* Magnifier clone: case-study interactive hover mirrors */
.hero-intro-cursor-mirror-clone .footer-email {
  text-decoration-thickness: calc(0.8px / var(--hero-cursor-magnifier-scale, 1));
  text-underline-offset: calc(3px / var(--hero-cursor-magnifier-scale, 1));
}

.hero-intro-cursor-mirror-clone .footer-email.hero-cursor-mirror-hover {
  color: var(--brand, #000aaa) !important;
}

.hero-intro-cursor-mirror-clone
  .project-tldr-trigger.hero-cursor-mirror-hover
  .project-tldr-chevron--default {
  opacity: 0;
}

.hero-intro-cursor-mirror-clone
  .project-tldr-trigger.hero-cursor-mirror-hover
  .project-tldr-chevron--hover {
  opacity: 1;
}

.hero-intro-cursor-mirror-clone .project-tldr-copy.hero-cursor-mirror-hover {
  background: #1a2bff !important;
}
</style>
