import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";
import { defineComponent, h } from "vue";

// Iconify Icon在Vue里本地使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIconOffline",
  components: { IconifyIcon },
  props: {
    icon: {
      default: null
    }
  },
  render() {
    if (typeof this.icon === "object") addIcon(this.icon, this.icon);
    const { title, ...attrs } = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: this.icon,
        style: { ...attrs?.style, outline: "none" },
        ...attrs
      },
      { default: () => [] }
    );
  }
});
