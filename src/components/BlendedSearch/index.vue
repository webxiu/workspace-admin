<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 11:27:55 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 11:27:55 
 */ -->

<template>
  <div class="filter-field">
    <div v-show="options.length > 0">
      <el-cascader ref="CascaderRef" :options="options" :props="{ expandTrigger: 'hover' }" @change="onCascaderChange" />
    </div>
    <el-tag v-for="(v, k) in filterTags" :key="k" :name="k" closable size="small" class="filter-tag" type="info" :disable-transitions="true" @close="onTagClose(k)" @click="onTagClick(k, v)">
      <strong v-if="v.label">{{ v.label + ":" }}</strong>
      <span v-if="v.valueLabel">{{ v.valueLabel }}</span>
      <span v-else>{{ v.value }}</span>
    </el-tag>
    <span v-if="keyLabel" class="filterTitle">{{ keyLabel + ":" }}</span>
    <el-input
      ref="SearchInput"
      v-model="filterValue"
      :placeholder="placeholderText"
      class="search-input"
      :class="options.length < 1 ? 'search-input2' : ''"
      :validate-event="false"
      @blur="focus = false"
      @focus="focus = true"
      @change="onSearch"
      @keyup.enter="onSearch"
    >
      <template #suffix>
        <el-icon class="el-input__icon">
          <IconifyIconOffline :icon="Search" />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import { CascaderOption, CascaderProps, ElMessage } from "element-plus";
import { ref, onMounted, computed, PropType, nextTick } from "vue";
import Search from "@iconify-icons/ep/search";

export interface SearchOptionType extends CascaderOption {
  /** 字段名称 */
  key?: string;
  /** 搜索字段名称 */
  label: string;
  /** 搜索字段 */
  value: any;
  /** 是否只读 */
  readonly?: boolean;
  /** 点击Tag选中的Lable,默认搜索为空 */
  valueLabel?: string;
  /** 搜索项列表 */
  children?: SearchOptionType[];
}

/** 默认值 */
export interface DefaultValueType {
  [key: string]: SearchOptionType;
}

/** 默认值 */
export interface TagItemType {
  [key: string]: any;
}

/**
 * props.default 默认搜索-配置说明:
 * key: 搜索字段
 * label: 下拉搜索一级label名称
 * value: 搜索的值
 * valueLabel: 下拉搜索二级label搜索名称
 * readonly: 是否禁止下拉搜索的编辑(如状态为 1和0的字段)
 *
 * Example:
 * username: { key: "username", label: "用户名", value: "张三xx", valueLabel: "" },
 * status: { key: "status", label: "状态", readonly: true, value: 1, valueLabel: "正常" }
 */

const props = defineProps({
  placeholder: {
    type: String as PropType<CascaderProps>,
    default: "请输入搜索内容"
  },
  searchField: { type: String, default: "search" },
  /** 查询选项 */
  options: {
    type: Array as PropType<SearchOptionType[]>,
    default: () => []
  },
  /** 默认值 */
  default: {
    type: Object as PropType<DefaultValueType>,
    default: () => {}
  }
});

defineOptions({ name: "MySearch" });

const SearchInput = ref();
const CascaderRef = ref();
const focus = ref<boolean>(false);
const filterKey = ref<string>("");
const valueLabel = ref<string>(""); // option中的label值
const filterValue = ref<string>(""); // option中的value值
const filterTags = ref(props.default || {});

const emits = defineEmits(["tagSearch"]);
const keyLabel = computed<string>(() => {
  if (!filterKey.value) return "";
  for (const field of props.options) {
    if (field.value === filterKey.value) {
      return field?.label;
    }
  }
  return "";
});

const resultMaps = computed(() => {
  const data: TagItemType = {};
  for (let key in filterTags.value) {
    const value = filterTags.value[key]["value"];
    if (key === "") {
      key = props.searchField;
    }
    if (key.startsWith(props.searchField)) {
      data[props.searchField] = (data[props.searchField] ? data[props.searchField] + "," : "") + value;
    } else {
      data[key] = value;
    }
  }
  return data;
});
const placeholderText = computed(() => {
  if (focus.value && filterKey.value) {
    return "按下Enter键进行搜索";
  }
  return props.placeholder;
});

onMounted(() => {
  const timer = setTimeout(() => {
    if (Object.keys(resultMaps).length > 0) {
      emits("tagSearch", resultMaps);
    }
    clearTimeout(timer);
  }, 400);
});

const getValueLabel = (key: string, value: string) => {
  for (const field of props.options) {
    if (field.value !== key || !field.children) continue;
    for (const child of field.children) {
      if (child.value === value) {
        return child.label;
      }
    }
  }
  return "";
};

const onCascaderChange = (keys: any) => {
  if (!keys || keys.length === 0) return;
  if (keys.length === 1) {
    filterKey.value = keys[0];
    SearchInput.value.focus();
  } else if (keys.length === 2) {
    filterKey.value = keys[0];
    filterValue.value = keys[1];
    valueLabel.value = getValueLabel(keys[0], keys[1]);
    onSearch();
  }
  nextTick(() => {
    CascaderRef.value?.cascaderPanelRef?.clearCheckedNodes();
  });
};

const onTagClose = (evt: string | number) => {
  delete filterTags.value[evt];
  emits("tagSearch", resultMaps);
};

const onSearch = () => {
  if (filterValue.value === "") {
    delete filterTags.value[filterKey.value];
    filterKey.value = "";
    return;
  }
  if (filterValue.value && !filterKey.value) {
    filterKey.value = props.searchField + "_" + filterValue.value;
  }
  const tag: SearchOptionType = {
    key: filterKey.value,
    label: keyLabel.value,
    value: filterValue.value,
    valueLabel: valueLabel.value
  };
  filterTags.value[filterKey.value] = tag;
  emits("tagSearch", resultMaps);
  filterKey.value = "";
  filterValue.value = "";
  valueLabel.value = "";
};

const onTagClick = (k: string | number, v: SearchOptionType) => {
  let unableChange = false;
  for (const field of props.options) {
    if (field.value === v.key && field.readonly) {
      unableChange = true;
    }
  }
  if (unableChange) {
    ElMessage({ message: "当前选项不可编辑", type: "warning" });
    return;
  }
  if (filterValue.value.length !== 0) {
    onSearch();
  }
  delete filterTags.value[k];
  filterKey.value = v.key;
  filterValue.value = v.value;
  SearchInput.value.focus();
};
</script>

<style lang="scss" scoped>
.filter-field {
  display: flex;
  align-items: center;
  min-width: 200px;
  height: 32px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #dcdee2;
  border-radius: 3px;
}

.filterTitle {
  box-sizing: border-box;
  display: inline;
  flex-shrink: 0;
  height: auto;
  padding-right: 2px;
  font-size: 13px;
  line-height: 100%;
  color: rgb(96 98 102);
  text-align: center;
  border-collapse: separate;
}

.filter-tag {
  margin: 2px 4px 2px 0;
}

.el-icon--right {
  margin-right: 5px;
  margin-left: 5px;
}

:deep(.search-input) {
  .el-input__suffix {
    cursor: pointer;
  }

  .el-input__inner {
    border: none !important;
  }

  .el-input__wrapper {
    padding-left: 5px;
    box-shadow: none !important;
  }
}

:deep(.search-input2) {
  .el-input__inner {
    text-indent: 5px;
  }
}

:deep(.el-cascader) {
  .el-input__wrapper {
    padding: 1px 11px 1px 3px;
    box-shadow: none !important;
  }

  .el-input__inner {
    width: 0;
    height: 100%;
    border: none !important;
  }
}
</style>
