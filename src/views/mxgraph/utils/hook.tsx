import { ref } from "vue";

export function useConfig() {
  const mx = ref();
  return { mx };
}
