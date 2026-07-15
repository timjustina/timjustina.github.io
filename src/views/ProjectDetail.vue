<template>
  <div :class="$style.page">
    <PortfolioTopBar />
    <main :class="$style.main">
      <slot />
    </main>
  </div>
</template>

<script>
import PortfolioTopBar from '../components/PortfolioTopBar.vue'

export default {
  name: 'ProjectDetail',
  components: { PortfolioTopBar },
}
</script>

<style module>
.page {
  background: #fff;
  color: #2c2c2c;
  font-family: 'Maven Pro', sans-serif;
  font-size: 20px;
  min-height: 100vh;
}

.main {
  max-width: calc(650px + 6ch);
  margin: 0 auto;
  padding: 120px 20px 120px;
  line-height: 1.5;
}

.main :global(h1) {
  font-size: 35px;
  letter-spacing: -0.02em;
  line-height: 1.25;
  text-align: center;
  margin: 0 0 24px;
}

.main :global(.meta) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 24px;
  color: #757575;
  letter-spacing: -0.02em;
  margin-bottom: 48px;
}

.main :global(.meta span:nth-child(2)) {
  width: 1px;
  height: 29px;
  background: #757575;
  padding: 0;
  overflow: hidden;
  text-indent: -999px;
}

.main :global(.intro) {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 32px;
}

.main :global(section) {
  margin-top: 64px;
  text-align: left;
}

.main :global(h2) {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}

.main :global(h3) {
  font-size: 29px;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: 24px;
}

.main :global(section p) {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  margin-bottom: 32px;
}

.main :global(.full-image) {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1100px;
  width: min(1100px, calc(100vw - 40px));
  margin: 48px 0;
  text-align: center;
}

.main :global(.hero-image) {
  width: 100vw;
  max-width: 100vw;
}

.main :global(.full-image img) {
  width: 100%;
  display: block;
  margin: 0 auto;
}

.main :global(.caption) {
  font-size: 14px;
  color: #757575;
  margin-top: 12px;
  text-align: center;
}

.main :global(.highlight) {
  color: #f20606;
}
</style>
