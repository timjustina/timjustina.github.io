<template>
  <video
    ref="video"
    class="project-video"
    :src="src"
    autoplay
    loop
    muted
    playsinline
  />
</template>

<script>
import { observeVideosRestartOnEnter } from '../utils/restartVideoOnEnter'

export default {
  name: 'ProjectVideo',
  props: {
    src: { type: String, required: true },
  },
  mounted() {
    this.stopObserve = observeVideosRestartOnEnter(this.$refs.video)
  },
  beforeUnmount() {
    this.stopObserve?.()
  },
}
</script>
