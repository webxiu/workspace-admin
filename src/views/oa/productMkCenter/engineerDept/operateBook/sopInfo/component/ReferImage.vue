<script lang="tsx">
import { defineComponent, PropType, computed } from "vue";
const baseApi = import.meta.env.VITE_BASE_API;

/** 参考图片 */
export default defineComponent({
  props: {
    imgList: { type: Array as PropType<Recordable[]>, default: () => [] }
  },
  emits: ["change"],
  setup(props) {
    const imgNum = ["一", "二", "三", "四", "五", "六"];
    const imageCount = computed(() => props.imgList.length);
    return () => (
      <div class="image-container" data-images={imageCount.value}>
        {props.imgList.map((item, index) => {
          return (
            <div key={item.id} class="image-box">
              <div class="no-wrap image-number">图{imgNum[index]}:</div>
              <div class="image-cont">
                <div class="image-pic threadlet" style={{ backgroundImage: `url("${baseApi + item.filePath}")` }} />
                <div class="image-desc ellipsis-2">{item.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
});
</script>

<style scoped lang="scss">
$txt-color: #f00;
$txt-font: 12px;

.image-container {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-box {
  box-sizing: border-box;
  display: flex;
  padding: 2px;
  overflow: hidden;
  font-family: "宋体", Arial, sans-serif, serif;
  font-size: $txt-font;
  color: $txt-color;

  .image-number {
    font-family: STKaiti, sans-serif;
  }

  .image-cont {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-left: 2px;
  }

  .image-pic {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    border: 1px solid $txt-color;
  }

  .image-desc {
    width: 100%;
    padding: 2px;
    height: 24px;
    margin-top: 4px;
    font-weight: 900;
    text-align: center;
    border: 1px solid $txt-color;
  }
}

.image-container[data-images="1"] {
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;

  .image-box {
    padding: 20px;
  }
}

.image-container[data-images="2"] {
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: 1fr;
}

.image-container[data-images="3"] {
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
}

.image-container[data-images="3"] .image-box:nth-child(3) {
  grid-column: span 2;
}

.image-container[data-images="4"] {
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
}

.image-container[data-images="5"] {
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);
}

.image-container[data-images="5"] .image-box:nth-child(4),
.image-container[data-images="5"] .image-box:nth-child(5) {
  grid-column: span 1;
}

.image-container[data-images="6"] {
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);
}
</style>
