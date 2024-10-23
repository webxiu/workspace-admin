<!-- /*
 * @Author: Hailen 
 * @Date: 2023-06-29 11:27:55 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-06-29 11:27:55 
 */ -->

<template>
  <div class="filter-field border-line">
    <div v-show="searchOptions.length > 0">
      <el-cascader ref="CascaderRef" :options="searchOptions" :props="{ expandTrigger: 'hover' }">
        <template #default="{ node, data }">
          <div @click="onSelectNode(node, data)">{{ data.label }}</div>
        </template>
      </el-cascader>
    </div>
    <el-tag
      v-for="(v, k) in filterTags"
      :key="k"
      :name="k"
      closable
      size="small"
      class="filter-tag"
      type="info"
      :disable-transitions="true"
      @close="onTagClose(k)"
      @click="onTagClick(k, v)"
    >
      <strong v-if="v.label">{{ v.label + ":" }}</strong>
      <span v-if="v.valueLabel">{{ v.valueLabel }}</span>
      <span v-else>{{ v.value }}</span>
    </el-tag>
    <span v-if="keyLabel" class="filterTitle">{{ keyLabel + ":" }}</span>
    <el-date-picker
      v-if="['datetimerange', 'daterange', 'monthrange'].includes(inputType)"
      ref="SearchInput"
      class="date-input"
      :type="inputType"
      v-model="filterValue"
      unlink-panels
      range-separator="~"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :shortcuts="shortcuts"
      size="default"
      @focus="focus = true"
      @blur="onDateBlur"
      @change="onDataChange"
      style="width: 240px"
      clearable
    />
    <el-date-picker
      v-else-if="inputType"
      ref="SearchInput"
      class="date-input"
      :type="inputType"
      v-model="filterValue"
      :value-format="dateFormat"
      placeholder="请选择"
      size="default"
      @focus="focus = true"
      @blur="onDateBlur"
      @change="onDataChange"
      style="width: 140px"
    />
    <el-input
      v-else
      ref="SearchInput"
      class="search-input"
      v-model.trim="filterValue"
      :placeholder="placeholderText"
      :class="searchOptions.length < 1 ? 'search-input2' : ''"
      :validate-event="false"
      @blur="focus = false"
      @focus="focus = true"
      @change="onSubmit"
      @keyup.enter="onSubmit"
    >
      <template #suffix>
        <el-icon @click="onSubmit"><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { CascaderOption, DatePickType } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { debounce } from "@/utils/common";

/**
 * ============ 组合搜索框使用说明 ============
 *
 * 1.时间范围回显格式, 必须使用~符号连接 (如: 2020-05-08 ~ 2022-06-25)
 *
 * 2.配置默认查询(示例):
 *  queryParams:{
 *    user: "张三xx",
 *    status: 1,
 *    month: "2023-02",
 *    date: "2023-05-08 ~ 2023-06-25",
 *    deptId: { value: "6", valueLabel: "技术研发中心" } // 存在children默认值配置格式
 *  }
 */
/** 配置选项类型 */
export interface SearchOptionType extends CascaderOption {
  /** 字段名称 */
  key?: string;
  /** 搜索字段名称 */
  label: string;
  /** 搜索字段(输入项) */
  value: any;
  /** 点击Tag选中的Lable,默认搜索为空 */
  valueLabel?: string;
  /** 搜索项列表 */
  children?: SearchOptionType[];
  /** 日期类型(仅日期添加) */
  type?: DatePickType;
  /** 日期格式(如: YYYY-MM-DD, 仅日期添加) */
  format?: string;
}

/** 默认搜索类型 */
export type QueryParamsType = Record<string, any>;

interface Props {
  /** 是否立即执行(默认立即执行) */
  immediate: boolean;
  /** 输入提示文本 */
  placeholder: string;
  /** 默认搜索字段 */
  searchField: string;
  /** 搜索配置列表 */
  searchOptions: SearchOptionType[];
  /** 默认查询配置 */
  queryParams: QueryParamsType;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: true,
  placeholder: "请输入搜索内容",
  searchField: "search",
  searchOptions: () => [],
  queryParams: () => ({})
});

defineOptions({ name: "BlendedSearch" });

const timesConfig = () => {
  const day = 3600 * 1000 * 24; // 一天
  const year = 3600 * 1000 * 24 * 365; // 一年
  return [
    { text: "今天", value: day * 0 },
    { text: "昨天", value: day * 1 },
    { text: "最近三天", value: day * 3 },
    { text: "最近一周", value: day * 7 },
    { text: "最近一月", value: day * 30 },
    { text: "最近三月", value: day * 30 * 3 },
    { text: "最近半年", value: day * 30 * 6 },
    { text: "最近一年", value: year * 1 },
    { text: "最近两年", value: year * 2 },
    { text: "最近三年", value: year * 3 },
    { text: "最近四年", value: year * 4 },
    { text: "最近五年", value: year * 5 },
    { text: "最近六年", value: year * 6 },
    { text: "最近七年", value: year * 7 },
    { text: "最近八年", value: year * 8 },
    { text: "最近九年", value: year * 9 },
    { text: "最近十年", value: year * 10 }
  ];
};
const shortcuts = timesConfig().map((item) => {
  return {
    text: item.text,
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - item.value);
      return [start, end];
    }
  };
});

const inputType = ref<DatePickType>(); // 输入类型
const dateFormat = ref<string>("YYYY-MMM-DD"); // 日期格式
const SearchInput = ref();
const CascaderRef = ref();
const focus = ref<boolean>(false);
const filterKey = ref<string>("");
const valueLabel = ref<string>(""); // option中的label值
const filterValue = ref<string | any>(""); // option中的value值
const filterTags = ref(props.queryParams || {});

const emits = defineEmits(["tagSearch", "selectNode"]);

onMounted(() => {
  // 初始化时是否执行
  if (!props.immediate || !Object.keys(props.queryParams).length) return;
  const timer = setTimeout(() => {
    if (Object.keys(resultMaps).length > 0) {
      emits("tagSearch", resultMaps.value);
    }
    clearTimeout(timer);
  }, 500);
});

const keyLabel = computed<string>(() => {
  if (!filterKey.value) return "";
  for (const field of props.searchOptions) {
    if (field.value === filterKey.value) {
      return field?.label;
    }
  }
  return "";
});

const resultMaps = computed(() => {
  const data: Record<string, any> = {};
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

watch(
  props,
  (val) => {
    const defaultParam: QueryParamsType = {};
    const param = val.queryParams as QueryParamsType;
    const options: SearchOptionType[] = val.searchOptions;
    // 处理默认值显示
    Object.keys(param).forEach((key) => {
      const oItem = options.find((item) => item.value === key);
      let value = param[key];
      let valueLabel = param[key];
      if (Object.prototype.toString.call(param[key]) === "[object Object]") {
        value = (param[key] as SearchOptionType).value;
        valueLabel = (param[key] as SearchOptionType).valueLabel;
      }
      defaultParam[key] = {
        key: key,
        label: oItem?.label,
        value: value,
        valueLabel: valueLabel,
        type: oItem?.type,
        format: oItem?.format
      };
    });
    filterTags.value = defaultParam;
  },
  { immediate: true }
);

const onSelectNode = (node, data) => {
  const keys = node.pathValues;
  const fieldName = keys[0]; // 选择的字段名称

  const fieldItem = props.searchOptions.find(({ value }) => value === fieldName);
  // 如果点击一级菜单 且有下级选项(children), 则阻止执行
  if (fieldItem.children && keys.length === 1) return;

  if (!keys || keys.length === 0) return;
  if (keys.length === 1) {
    if (data.type) {
      inputType.value = data.type;
      if (!data.format && data.type !== "daterange") message("请配置日期格式", { type: "warning" });
      dateFormat.value = data.format;
    }
    filterKey.value = fieldName;
    SearchInput.value.focus();
  } else if (keys.length >= 2) {
    filterKey.value = fieldName;
    filterValue.value = data.value;
    valueLabel.value = data.label;
    onSearch();
  }
  emits("selectNode", node);
  nextTick(() => {
    CascaderRef.value?.togglePopperVisible(false);
  });
};

const onTagClose = (evt: string) => {
  delete filterTags.value[evt];
  const keyField = `${evt}`.split("_")[0];
  // 将值置空, 而不是删除字段
  if (keyField) resultMaps.value[keyField] = undefined;
  emits("tagSearch", resultMaps.value);
};

const onDateBlur = () => {
  focus.value = false;
  onDataChange(filterValue.value);
};

const onDataChange = (values) => {
  if (["datetimerange", "daterange", "monthrange"].includes(inputType.value)) {
    const startDate = dayjs(values[0]).format("YYYY-MM-DD");
    const endDate = dayjs(values[1]).format("YYYY-MM-DD");
    filterValue.value = startDate + " ~ " + endDate;
    //if (inputType.value === "month")
  } else {
    filterValue.value = values;
  }

  const tag: SearchOptionType = {
    key: filterKey.value,
    label: keyLabel.value,
    value: filterValue.value,
    valueLabel: valueLabel.value,
    type: inputType.value,
    format: dateFormat.value
  };

  filterTags.value[filterKey.value] = tag;
  emits("tagSearch", resultMaps.value);
  // 清空显示输入框
  filterKey.value = "";
  filterValue.value = "";
  valueLabel.value = "";
  inputType.value = undefined;
  dateFormat.value = "";
};

// 避免change事件与回车键事件重复触发
const onSubmit = debounce(() => onSearch());

const onSearch = () => {
  if (filterValue.value === "") {
    delete filterTags.value[filterKey.value];
    filterKey.value = "";
    emits("tagSearch", resultMaps.value);
    return;
  }
  if (filterValue.value && !filterKey.value) {
    filterKey.value = props.searchField + "_" + filterValue.value;
  }
  const tag: SearchOptionType = {
    key: filterKey.value,
    label: keyLabel.value,
    value: filterValue.value,
    valueLabel: valueLabel.value,
    type: inputType.value,
    format: dateFormat.value
  };
  filterTags.value[filterKey.value] = tag;
  emits("tagSearch", resultMaps.value);
  filterKey.value = "";
  filterValue.value = "";
  valueLabel.value = "";
  inputType.value = undefined;
  dateFormat.value = "";
};

const onTagClick = (k: string | number, v: SearchOptionType) => {
  let unableChange = false;
  for (const field of props.searchOptions) {
    if (field.value === v.key && field.children) {
      unableChange = true;
      break;
    }
  }
  if (unableChange) {
    message("当前选项不可编辑", { type: "warning" });
    return;
  }
  if (filterValue.value.length !== 0) {
    onSearch();
  }
  delete filterTags.value[k];
  filterKey.value = v.key;
  inputType.value = v.type;
  dateFormat.value = v.format;
  if (["datetimerange", "daterange", "monthrange"].includes(v.type)) {
    // 需要处理赋值显示
    const dateStr = v.value.split("~");
    const dateStart = dateStr[0].toString().trim();
    const dateEnd = dateStr[1].toString().trim();
    filterValue.value = [new Date(dateStart), new Date(dateEnd)];
  } else {
    filterValue.value = v.value;
  }

  nextTick(() => {
    SearchInput.value?.focus();
  });
};
</script>

<style lang="scss" scoped>
.filter-field {
  display: flex;
  align-items: center;
  width: max-content;
  min-width: 200px;
  max-width: 100%;
  height: 32px;
  margin-right: 15px;
  overflow: hidden;
  overflow-x: auto;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
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
    min-width: 43px;
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

/** 日期 */
:deep(.date-input) {
  box-shadow: none !important;

  .el-input__wrapper {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
