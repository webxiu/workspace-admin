/** 鼠标进入与离开判断 */
export function mouseInOut(selector: string, callback: (bool: boolean) => void) {
  const chartDom = document.querySelector(selector);
  const onEnter = () => callback(true);
  const onLeave = () => callback(false);
  chartDom?.addEventListener("mouseenter", onEnter);
  chartDom?.addEventListener("mouseleave", onLeave);
}

/** 按基准宽高缩放元素 */
export function onScaleView(selector, option?: { baseWidth: number; baseHeight: number }) {
  // const { baseWidth = 3480, baseHeight = 2160 } = option || {};
  const { baseWidth = 1920, baseHeight = 919 } = option || {};
  const dataScreen = document.querySelector(selector) as HTMLDivElement;
  function onResize() {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    const scaleX = currentWidth / baseWidth;
    const scaleY = currentHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    dataScreen.style.transition = `all 0.3s`;
    dataScreen.style.transform = `scale(${scale})`;
    // dataScreen.style.transform = `scale(${scaleX * 1.8},${scaleY * 2.2})`;
  }
  onResize();
  window.addEventListener("resize", onResize);
}
