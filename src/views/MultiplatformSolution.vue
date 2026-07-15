<template>
    <ProjectDetail>
        <h1>Multiplatform Design for Home Medication Solution</h1>
        <div class="project-meta">
            <span>Lead Product Designer</span>
            <span>Kin Technology | 2023-2025</span>
        </div>
    </ProjectDetail>
</template>

<script>
import ProjectDetail from './ProjectDetail.vue'

export default {
    components: { ProjectDetail }
}
</script>

<style scoped>
.project-meta {
    display: flex;
    gap: 20px;
    font-family: "Maven Pro", sans-serif;
    font-size: 18px;
    color: #4D4D4D;
    margin-bottom: 40px;
}

h1 {
    font-family: "Maven Pro", sans-serif;
    font-size: 48px;
    font-weight: 500;
    color: #0914c5;
    margin: 20px 0;
}
</style>