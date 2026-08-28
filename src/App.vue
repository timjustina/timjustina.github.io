<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  --font-weight-scale: 0.98;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
  width: 100%;
}

/* Shared thumbnail → hero expand transition */
html.image-expand-active {
  /* Do NOT set overflow:hidden on html/body — iOS Safari then breaks
     position:fixed, which made the mobile card→hero flyer invisible. */
  overscroll-behavior: none;
}

html.image-expand-active #app {
  overflow: hidden;
  height: 100%;
  touch-action: none;
}

html.image-expand-active .project-hero img {
  opacity: 0 !important;
}

/* Top bar stays visible for the whole expand (flyer sits under it at z-index 90) */
html.image-expand-active .top-bar {
  opacity: 1;
}

html.image-expand-active .project-header,
html.image-expand-active .project-body,
html.image-expand-active .site-footer,
html.image-expand-settling .project-header,
html.image-expand-settling .project-body,
html.image-expand-settling .site-footer {
  opacity: 0;
}

html.image-expand-settling.image-expand-revealed .project-header,
html.image-expand-settling.image-expand-revealed .project-body,
html.image-expand-settling.image-expand-revealed .site-footer {
  opacity: 1;
  transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>