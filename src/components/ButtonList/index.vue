<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount, PropType, watch } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { debounce } from "@/utils/common";
import type { UploadProps, UploadUserFile } from "element-plus";
export type LoadingType = { loading: boolean; text: string };

export interface ButtonItemType {
  loading?: boolean;
  disabled?: boolean;
  dark?: boolean;
  icon?: any;
  width?: string;
  color?: string;
  circle?: boolean;
  round?: boolean;
  type?: any;
  size?: any;
  /** 配置此属性则显示为上传按钮, 默认为普通按钮 */
  uploadProp?: Partial<UploadProps>;
  /** 必传项 */
  text: string;
  /** 必传项 */
  clickHandler: (item: ButtonItemType) => void;
}

const props = defineProps({
  buttonList: {
    type: Array as PropType<ButtonItemType[]>,
    default: () => []
  },
  /** 是否需要加载loading状态 */
  isLoading: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /** 点击按钮的loading状态 */
  loadingStatus: {
    type: Object as PropType<LoadingType>,
    default: () => ({ loading: false, text: "" })
  },
  moreActionText: {
    type: String as PropType<string>,
    defautlt: ""
  }
});

const sliceNum = ref(1); // 默认显示的个数 除了更多按钮外
const parentBox = ref(null);
const parentBoxWidth = ref("");
const moreBtnRef = ref(null);

// 初始化按钮数量
const initBtnNum = debounce(() => {
  if (moreBtnRef.value) {
    const calcStyle = window.getComputedStyle(parentBox.value);
    // 按钮的宽度以更多按钮的尺寸作为基准来计算个数
    const calcBtnStyle = window.getComputedStyle(moreBtnRef.value.ref);
    parentBoxWidth.value = calcStyle.width;
    const pWidthNum = +parentBoxWidth.value.split("px")[0];
    const btnWidthNum = +calcBtnStyle.width.split("px")[0];
    const btnShowNum = Math.floor(pWidthNum / btnWidthNum);
    sliceNum.value = btnShowNum - 1;
  }
});

onMounted(() => {
  initBtnNum();
  window.addEventListener("resize", initBtnNum);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", initBtnNum);
});

watch(props, (newProp) => {
  const {
    isLoading,
    loadingStatus: { text, loading }
  } = newProp;
  if (!isLoading) return;
  // 修改前点击的按钮的loading状态
  const curIndex = calcFrontList.value.findIndex((c) => c.text === text);
  const currentList = curIndex > -1 ? calcFrontList : calcBackList;
  for (let i = 0; i < currentList.value.length; i++) {
    const item = currentList.value[i];
    if (text && item.text === text) {
      if (curIndex > -1) {
        item.loading = loading;
      } else {
        item.disabled = loading;
      }
      break;
    }
  }
});

// 默认显示的按钮列表
const calcFrontList = computed<ButtonItemType[]>(() => {
  return props.buttonList.slice(0, sliceNum.value) as any[];
});

// 下拉中的按钮列表
const calcBackList = computed<ButtonItemType[]>(() => {
  return props.buttonList.slice(sliceNum.value) as any[];
});
</script>

<template>
  <div class="ui-w-100 mr-3">
    <div class="wrapper-btn" ref="parentBox">
      <template v-for="(item, index) in calcFrontList" :key="index">
        <!-- 处理是上传按钮包裹el-upload -->
        <el-upload v-if="item.uploadProp" :show-file-list="false" style="margin: 0 12px" v-bind="item.uploadProp">
          <el-button
            v-bind="$attrs"
            :loading="item.loading"
            :disabled="item.disabled"
            :dark="item.dark"
            :icon="item.icon || null"
            :style="{ width: item.width }"
            :color="item.color"
            :auto-insert-space="item['auto-insert-space']"
            :circle="item.circle"
            :round="item.round"
            :size="item.size"
            @click="item.clickHandler(item)"
            :type="item.type"
          >
            {{ item.text }}
          </el-button>
        </el-upload>
        <el-button
          v-else
          v-bind="$attrs"
          :loading="item.loading"
          :disabled="item.disabled"
          :dark="item.dark"
          :icon="item.icon || null"
          :style="{ width: item.width }"
          :color="item.color"
          :auto-insert-space="item['auto-insert-space']"
          :circle="item.circle"
          :round="item.round"
          :size="item.size"
          @click="item.clickHandler(item)"
          :type="item.type"
        >
          {{ item.text }}
        </el-button>
      </template>

      <el-dropdown trigger="click" style="margin-left: 10px" v-show="calcBackList.length" :teleported="false">
        <el-button type="primary" ref="moreBtnRef" v-bind="$attrs">
          {{ moreActionText || "更多操作" }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <template v-for="(el, idx) in calcBackList" :key="idx">
              <!-- 处理是上传按钮包裹el-upload -->
              <el-upload v-if="el.uploadProp" :show-file-list="false" v-bind="el.uploadProp">
                <el-dropdown-item :disabled="el.disabled" :style="{ color: el.color }" :icon="el.icon" @click="el.clickHandler(el)">
                  {{ el.text }}
                </el-dropdown-item>
              </el-upload>
              <el-dropdown-item v-else :disabled="el.disabled" :style="{ color: el.color }" :icon="el.icon" @click="el.clickHandler(el)">
                {{ el.text }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.example-showcase .el-dropdown-link {
  display: flex;
  align-items: center;
  color: var(--el-color-primary);
  cursor: pointer;
}

.wrapper-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
