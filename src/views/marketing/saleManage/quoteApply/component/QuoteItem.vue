<template>
  <div class="dynamic-item ui-w-100" style="margin: -1px">
    <div class="flex flex-1 align-center ui-w-100" v-for="(item, index) in dataList" :key="item.id">
      <el-form-item
        label="数量"
        class="flex-1"
        :prop="'quoteList.' + index + '.count'"
        label-width="120px"
        :rules="[
          { required: true, message: '请输入报价数量', trigger: 'blur' },
          { trigger: 'blur', validator: validator.bind(null, 'count', index) }
        ]"
      >
        <el-input-number v-model="item.count" placeholder="请输入数量" :controls="false" clearable :disabled="disableCount" class="ui-w-100" />
      </el-form-item>
      <el-form-item
        label="币种"
        class="flex-1"
        :prop="'quoteList.' + index + '.currency'"
        label-width="120px"
        :rules="[
          { required: !disableCurrency, message: '请输入币种', trigger: 'blur' },
          { trigger: 'blur', validator: disableCurrency ? null : validator.bind(null, 'currency', index) }
        ]"
      >
        <el-select v-model="item.currency" placeholder="请选择" :disabled="disableCurrency" class="ui-w-100">
          <el-option v-for="item in currencyList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="单价" class="flex-1" :prop="'quoteList.' + index + '.price'" label-width="120px">
        <el-input-number v-model="item.price" placeholder="/" :controls="false" disabled class="ui-w-100" />
      </el-form-item>
      <el-form-item label-width="0px" style="border-left: 0">
        <el-button @click.prevent="removeAction(item)" type="danger" size="small" :icon="Delete" :disabled="disabled">删除</el-button>
      </el-form-item>
    </div>
    <el-form-item label-width="0px" style="border-bottom: 1px solid #111; border-left: 0">
      <el-button @click="addAction" :icon="Plus" type="primary" class="ml-20" :disabled="disabled">新增</el-button>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { ref, watch, onMounted } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { OptionItemType } from "@/api/plmManage";

interface Props {
  /** 默认禁用项 */
  disabled?: boolean;
  /** 禁用数量 */
  disableCount?: boolean;
  /** 禁用币种 */
  disableCurrency?: boolean;
  modelValue: DomainItem[];
  /** 币种下拉选项 */
  currencyList?: OptionItemType[];
}

export interface DomainItem {
  id: string;
  count: number;
  price: number;
  currency: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  currencyList: () => []
});

const emits = defineEmits(["update:modelValue"]);
const dataList = ref<DomainItem[]>(props.modelValue);

watch(props, (val) => {
  dataList.value = val.modelValue || [];
  if (val.currencyList.length && !dataList.value.length) {
    addAction();
  }
});

function validator(field, index, rule: any, value: any, callback: any) {
  const name = { count: "数量", currency: "币种" }[field];
  const arr = dataList.value.map((f) => f[field]).filter((f, i) => f && i !== index);
  if (!value) {
    callback(new Error(`请输入${name}`));
  } else if (arr.includes(value) && field !== "currency") {
    callback(new Error(`输入${name}重复`));
  } else {
    callback();
  }
}

function addAction() {
  if (props.disabled) return;
  const currency = props.currencyList[0]?.optionValue;
  dataList.value.push({ id: uuidv4(), count: undefined, currency: currency, price: undefined });
  emits("update:modelValue", dataList.value);
}

function removeAction(item: DomainItem) {
  if (props.disabled) return;
  dataList.value = dataList.value.filter((f) => f.id !== item.id);
  emits("update:modelValue", dataList.value);
}
</script>
<style lang="scss">
.dynamic-form-item > .el-form-item__content {
  padding: 0;
}

.dynamic-item {
  display: flex;
  flex-direction: column;

  .el-form-item__label {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .el-form-item__content {
    padding: 8px;
  }
}
</style>
