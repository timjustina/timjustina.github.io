<template>
  <div class="full-image">
    <video
      v-if="isPlaying"
      ref="video"
      class="video-player"
      :src="videoSrc"
      controls
      playsinline
    />

    <div
      v-else
      class="poster-wrap"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <button type="button" class="poster-trigger" :aria-label="`Play video: ${alt}`" @click="play">
        <img :src="poster" :alt="alt" class="poster-img" />
      </button>
      <video
        v-show="isHovered"
        class="video-hover"
        :src="videoSrc"
        controls
        preload="metadata"
        muted
        playsinline
        @click="play"
      />
    </div>

    <p v-if="caption" class="caption">{{ caption }}</p>
  </div>
</template>

<script>
export default {
  name: 'VideoPoster',
  props: {
    poster: { type: String, required: true },
    videoSrc: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  data() {
    return {
      isPlaying: false,
      isHovered: false,
    }
  },
  methods: {
    play() {
      this.isHovered = false
      this.isPlaying = true
      this.$nextTick(() => {
        this.$refs.video?.play()
      })
    },
  },
}
</script>

<style scoped>
.poster-wrap {
  position: relative;
  width: 100%;
}

.poster-trigger {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.poster-img {
  width: 100%;
  display: block;
}

.video-hover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.video-player {
  width: 100%;
  display: block;
  background: #000;
}

.caption {
  font-size: 14px;
  color: #757575;
  margin-top: 12px;
  text-align: left;
}
</style>
