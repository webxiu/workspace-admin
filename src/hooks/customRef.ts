import { customRef } from "vue";

/**
 * 防抖Ref
 */
export function debounceRef<T>(value: T, delay = 50) {
  let timer: NodeJS.Timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(val) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          trigger();
          value = val;
        }, delay);
      }
    };
  });
}
/**
 * 节流Ref
 */
export function throttleRef<T>(value: T, delay = 300) {
  let lastTime = 0;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(val) {
        const now = Date.now();
        if (now - lastTime > delay) {
          lastTime = now;
          trigger();
          value = val;
        }
      }
    };
  });
}
