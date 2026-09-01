<template>
    <header class="project-header">
        <h1 class="project-header-title">
            <template v-if="titleLines.length > 1">
                <span
                    v-for="(line, index) in titleLines"
                    :key="index"
                    class="project-header-title-line"
                >{{ line }}</span>
            </template>
            <template v-else>{{ title }}</template>
        </h1>
        <div v-if="client || period" class="project-header-meta">
            <span v-if="client">{{ client }}</span>
            <span v-if="client && period" class="project-header-meta-divider" aria-hidden="true" />
            <span v-if="period">{{ period }}</span>
        </div>
    </header>
</template>

<script>
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
    },
    computed: {
        titleLines() {
            return String(this.title)
                .split(/\n/)
                .map((line) => line.trim())
                .filter(Boolean)
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

.project-header-meta {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    font-family: 'Fira Code', monospace;
    font-weight: calc(400 * var(--font-weight-scale));
    font-style: normal;
    font-size: 18px;
    line-height: 30px;
    letter-spacing: -0.02em;
    color: #757575;
}

.project-header-meta span:not(.project-header-meta-divider) {
    display: flex;
    align-items: center;
}

.project-header-meta-divider {
    width: 1px;
    height: 28px;
    background: #757575;
    flex-shrink: 0;
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
        font-family: 'Fira Code', monospace;
        font-weight: calc(400 * var(--font-weight-scale));
        font-size: 16px;
        line-height: 21px;
        letter-spacing: -0.02em;
        gap: 16px;
        color: #757575;
    }

    .project-header-meta-divider {
        width: 1px;
        height: 21px;
        background: #757575;
    }
}
</style>
