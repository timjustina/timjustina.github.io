<template>
    <header class="project-header">
        <h1 class="project-header-title">{{ title }}</h1>
        <div class="project-header-meta">
            <span>{{ client }}</span>
            <span class="project-header-meta-divider" aria-hidden="true" />
            <span>{{ period }}</span>
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
            required: true,
        },
        period: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
.project-header {
    width: min(980px, calc(100% - 40px));
    margin: 0 auto 146px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 41px;
    min-height: 115px;
}

.project-header-title {
    margin: 0;
    max-width: 980px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 300;
    font-style: normal;
    font-size: 35px;
    line-height: 43.75px;
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
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
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

@media (max-width: 767px) {
    .project-header {
        gap: 24px;
        min-height: 0;
        margin-bottom: 80px;
    }

    .project-header-title {
        font-size: clamp(26px, calc(26px + (100vw - 320px) * 9 / 247), 35px);
        line-height: 1.25;
        letter-spacing: 0;
    }
}
</style>
