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
  background: rgba(255, 255, 255, 0.18);
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
.hero-intro-cursor-mirror-clone {
  pointer-events: none;
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
