<template>
  <div class="dynamic-item ui-w-100" style="margin: -1px -1px">
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
      <el-form-item label="单价" class="flex-1" :prop="'quoteList.' + index + '.price'" label-width="120px">
        <el-input-number v-model="item.price" placeholder="/" :controls="false" disabled class="ui-w-100" />
      </el-form-item>
      <el-form-item label="币种" class="flex-1" :prop="'quoteList.' + index + '.currency'" label-width="120px">
        <el-input-number v-model="item.currency" placeholder="/" :controls="false" disabled class="ui-w-100" />
      </el-form-item>
      <el-form-item label-width="0px" style="border-left: 0px">
        <el-button @click.prevent="removeAction(item)" type="danger" size="small" :icon="Delete" :disabled="disabled">删除</el-button>
      </el-form-item>
    </div>
    <el-form-item label-width="0px" style="border-left: 0px; border-bottom: 1px solid #111">
      <el-button @click="addAction" :icon="Plus" type="primary" class="ml-20" :disabled="disabled">新增</el-button>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { ref, watch, onMounted } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";

interface Props {
  /** 默认禁用项 */
  disabled?: boolean;
  /** 禁用数量 */
  disableCount?: boolean;
  modelValue: DomainItem[];
}

export interface DomainItem {
  id: string;
  count: number;
  price: number;
  currency: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
});

const emits = defineEmits(["update:modelValue"]);
const dataList = ref<DomainItem[]>(props.modelValue);
onMounted(() => {
  if (props.modelValue.length === 0) {
    addAction();
  }
});

watch(props, (val) => {
  dataList.value = val.modelValue || [];
});

function validator(field, index, rule: any, value: any, callback: any) {
  const name = { count: "数量" /*, price: "单价"*/ }[field];
  const arr = dataList.value.map((f) => f[field]).filter((f, i) => f && i !== index);
  if (!value) {
    callback(new Error(`请输入${name}`));
  } else if (arr.includes(value)) {
    callback(new Error(`输入${name}重复`));
  } else {
    callback();
  }
}

function addAction() {
  if (props.disabled) return;
  dataList.value.push({ id: uuidv4(), price: undefined, count: undefined, currency: undefined });
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
  padding: 0px;
}
.dynamic-item {
  display: flex;
  flex-direction: column;
  .el-form-item__label {
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .el-form-item__content {
    padding: 8px;
  }
}
</style>
