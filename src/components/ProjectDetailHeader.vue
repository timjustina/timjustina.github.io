<template>
    <header class="project-header">
        <span class="project-header-glass-wash" aria-hidden="true"></span>
        <h1
            ref="titleEl"
            class="project-header-title"
            :class="titleLayoutClass"
        >
            <span
                v-if="fluidLines"
                ref="measureProbe"
                class="project-header-measure"
                aria-hidden="true"
            >{{ measureProbeText }}</span>
            <template v-if="useFluidLayout">
                <span
                    v-for="(line, index) in fluidDisplayLines"
                    :key="index"
                    class="project-header-title-line"
                >{{ line }}</span>
            </template>
            <template v-else-if="titleLines.length > 1">
                <span
                    v-for="(line, index) in titleLines"
                    :key="index"
                    class="project-header-title-line"
                >{{ line }}</span>
            </template>
            <template v-else>{{ title }}</template>
        </h1>
        <span v-if="client || period" class="project-header-meta">
            <template v-if="client">{{ client }}</template><span
                v-if="client && period"
                class="project-header-meta-sep"
            >//</span><template v-if="period">{{ period }}</template>
        </span>
    </header>
</template>

<script>
import { DESKTOP_MEDIA_QUERY } from '../utils/breakpoints.js'

const FLUID_SIDE_MARGIN = 39

export default {
    name: 'ProjectDetailHeader',
    props: {
        title: {
            type: String,
            required: true,
        },
        client: {
            type: String,
            default: '',
        },
        period: {
            type: String,
            default: '',
        },
        fluidLines: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            fluidLineMode: 'default',
            fluidDisplayLines: [],
            measureProbeText: '',
            fluidRaf: null,
            fluidObserver: null,
        }
    },
    computed: {
        titleLines() {
            return String(this.title)
                .split(/\n/)
                .map((line) => line.trim())
                .filter(Boolean)
        },
        titleWords() {
            return this.titleLines.join(' ').split(/\s+/).filter(Boolean)
        },
        useFluidLayout() {
            return this.fluidLines && this.fluidLineMode !== 'default'
        },
        titleLayoutClass() {
            if (!this.fluidLines || this.fluidLineMode === 'default') return null
            return this.fluidLineMode === 'one' ? 'is-one-line' : 'is-two-line'
        },
    },
    watch: {
        title() {
            this.scheduleFluidLines()
        },
    },
    mounted() {
        if (!this.fluidLines) return

        this.scheduleFluidLines()
        window.addEventListener('resize', this.scheduleFluidLines, { passive: true })
        document.fonts?.ready?.then(() => this.scheduleFluidLines())

        if (typeof ResizeObserver !== 'undefined' && this.$refs.titleEl) {
            this.fluidObserver = new ResizeObserver(() => this.scheduleFluidLines())
            this.fluidObserver.observe(this.$refs.titleEl)
        }
    },
    beforeUnmount() {
        if (!this.fluidLines) return

        if (this.fluidRaf != null) cancelAnimationFrame(this.fluidRaf)
        this.fluidObserver?.disconnect()
        window.removeEventListener('resize', this.scheduleFluidLines)
    },
    methods: {
        scheduleFluidLines() {
            if (!this.fluidLines) return
            if (this.fluidRaf != null) cancelAnimationFrame(this.fluidRaf)
            this.fluidRaf = requestAnimationFrame(() => {
                this.fluidRaf = null
                this.updateFluidLines()
            })
        },
        getFluidTargetWidth() {
            return Math.max(0, document.documentElement.clientWidth - FLUID_SIDE_MARGIN * 2)
        },
        async measureLineWidth(lineText) {
            const probe = this.$refs.measureProbe
            if (!probe) return 0
            this.measureProbeText = lineText
            await this.$nextTick()
            return probe.scrollWidth
        },
        async updateFluidLines() {
            if (!this.fluidLines) return

            const words = this.titleWords
            if (words.length === 0) return

            if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
                this.fluidLineMode = 'default'
                this.fluidDisplayLines = []
                this.measureProbeText = ''
                return
            }

            const targetWidth = this.getFluidTargetWidth()
            if (targetWidth <= 0) return

            const oneLine = words.join(' ')
            if ((await this.measureLineWidth(oneLine)) <= targetWidth + 0.5) {
                this.fluidLineMode = 'one'
                this.fluidDisplayLines = [oneLine]
                this.measureProbeText = ''
                return
            }

            if (words.length < 2) {
                this.fluidLineMode = 'one'
                this.fluidDisplayLines = [oneLine]
                this.measureProbeText = ''
                return
            }

            let bestSplit = 1
            let bestDiff = Infinity
            let foundFit = false

            for (let i = 1; i < words.length; i++) {
                const lineOne = words.slice(0, i).join(' ')
                const lineTwo = words.slice(i).join(' ')
                const widthOne = await this.measureLineWidth(lineOne)
                const widthTwo = await this.measureLineWidth(lineTwo)
                if (widthOne > targetWidth + 0.5 || widthTwo > targetWidth + 0.5) continue

                foundFit = true
                const diff = Math.abs(widthOne - widthTwo)
                if (diff < bestDiff) {
                    bestDiff = diff
                    bestSplit = i
                }
            }

            if (!foundFit) {
                this.fluidLineMode = 'two'
                this.fluidDisplayLines = [
                    words.slice(0, bestSplit).join(' '),
                    words.slice(bestSplit).join(' '),
                ]
                this.measureProbeText = ''
                return
            }

            this.fluidLineMode = 'two'
            this.fluidDisplayLines = [
                words.slice(0, bestSplit).join(' '),
                words.slice(bestSplit).join(' '),
            ]
            this.measureProbeText = ''
        },
    },
}
</script>

<style scoped>
.project-header {
    width: min(896px, calc(100% - 40px));
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    min-height: 0;
}

.project-header-title {
    position: relative;
    margin: 0;
    max-width: 896px;
    font-family: 'Work Sans', sans-serif;
    font-weight: calc(300 * var(--font-weight-scale));
    font-style: normal;
    font-size: 32px;
    line-height: 48px;
    letter-spacing: 0;
    text-align: center;
    color: #3c3f41;
}

.project-header-title-line {
    display: block;
}

.project-header-title.is-one-line {
    white-space: nowrap;
}

.project-header-title.is-two-line .project-header-title-line {
    white-space: nowrap;
}

.project-header-measure {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    white-space: nowrap;
    font: inherit;
    letter-spacing: inherit;
}

.project-header-meta {
    display: block;
    font-family: 'Work Sans', sans-serif;
    font-size: 20px;
    font-weight: 400;
    line-height: 34px;
    letter-spacing: 0;
    color: #4d4d4d;
}

.project-header-meta-sep {
    margin: 0 0.7em;
}

@media (width < 800px) {
    .project-header {
        width: min(318px, calc(100% - 40px));
        gap: 20px;
        min-height: 0;
        margin-bottom: 52px;
    }

    .project-header-title {
        max-width: 318px;
        font-family: 'Work Sans', sans-serif;
        font-weight: calc(300 * var(--font-weight-scale));
        font-size: 20px;
        line-height: 30px;
        letter-spacing: 0;
        text-align: center;
        color: #3c3f41;
    }

    .project-header-meta {
        font-size: 16px;
        line-height: calc(24px * var(--project-type-scale));
        color: #4d4d4d;
    }
}
</style>
