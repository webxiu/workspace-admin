<template>
  <div class="bg-gray-dark-mktg" :style="boxStyle">
    <div class="data-content" :style="{ flexDirection: direction }">
      <slot />
    </div>
    <div class="signup-space">
      <div class="signup-stars" />
      <div class="signup-stars" />
      <div class="signup-stars" />
      <div class="signup-stars" />
      <div class="signup-stars" />
      <div class="signup-stars" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, computed } from "vue";
interface Props {
  color: string;
  bgColor: string;
  style: CSSProperties;
  direction: "row" | "column";
}

const props = withDefaults(defineProps<Partial<Props>>(), {
  color: "#fff",
  bgColor: "#041742",
  direction: "column",
  style: () => ({})
});

const boxStyle = computed(() => {
  const { color, bgColor, style } = props;
  return { color, backgroundColor: bgColor, ...style };
});
</script>

<style scoped>
.data-content {
  width: 100%;
  height: 100%;
  flex: 1;
  z-index: 2;
  display: flex;
}

.bg-gray-dark-mktg {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  flex: auto;
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 15px;
}
.signup-space,
.signup-stars {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
.signup-stars {
  background-image: radial-gradient(2px 2px at 50px 200px, #eee, rgba(0, 0, 0, 0)), radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(3px 4px at 120px 40px, #ddd, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 250px 250px;
  opacity: 0;
  animation: zoom 10s infinite;
}
.signup-stars:nth-child(1) {
  background-position: 10% 90%;
  animation-delay: 0s;
}
.signup-stars:nth-child(2) {
  background-position: 20% 50%;
  background-size: 270px 500px;
  animation-delay: 0.3s;
}
.signup-stars:nth-child(3) {
  background-position: 40% -80%;
  animation-delay: 1.2s;
}
.signup-stars:nth-child(4) {
  background-position: -20% -30%;
  transform: rotate(60deg);
  animation-delay: 2.5s;
}
.signup-stars:nth-child(5) {
  background-image: radial-gradient(2px 2px at 10px 100px, #eee, rgba(0, 0, 0, 0)), radial-gradient(2px 2px at 20px 10px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(3px 4px at 150px 40px, #ddd, rgba(0, 0, 0, 0));
  background-position: 80% 30%;
  animation-delay: 4s;
}
.signup-stars:nth-child(6) {
  background-position: 50% 20%;
  animation-delay: 6s;
}
@keyframes zoom {
  0% {
    opacity: 0;
    transform: scale(0.5);
    transform: rotate(5deg);
    animation-timing-function: ease-in;
  }
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
    transform: scale(2.2);
  }
}
@media (prefers-reduced-motion) {
  .signup-stars {
    animation: none;
  }
}
</style>
