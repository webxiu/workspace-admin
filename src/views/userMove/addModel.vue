<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-07-21 08:20:28 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-07-21 08:20:28 
 */ -->

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElTable } from "element-plus";
import { UserMoveItemType } from "@/api/userMove";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import type { FormRules } from "element-plus";

interface FormProps {
  formInline: Partial<{ newOrgId: string; userIds: number[] }>;
  userRows: UserMoveItemType[];
  tableRef: InstanceType<typeof ElTable>;
  orgOptions: SearchOptionType[];
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  userRows: () => [],
  tableRef: () => null,
  orgOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = reactive(props.formInline);
const filterOption = ref(props.userRows);

/** 表单规则校验 */
const formRules = reactive<FormRules>({
  userIds: [{ required: true, message: "请选择员工", trigger: "blur" }],
  newOrgId: [{ required: true, message: "请选择组织", trigger: "blur" }]
});

function onChange(values: number[]) {
  newFormInline.userIds = values;
  const tableRef = props.tableRef;
  if (values.length > 0) {
    const currentOptions = filterOption.value.filter((item) => values.includes(item.id));
    const useItems = filterOption.value.filter((item) => !values.includes(item.id));
    filterOption.value.forEach((key) => {
      useItems.forEach((row) => {
        if (row.id === key.id) {
          tableRef?.toggleRowSelection(row, undefined);
        }
      });
    });
    filterOption.value = currentOptions;
  } else {
    tableRef?.clearSelection();
    filterOption.value = [];
  }
}
function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-position="top">
    <el-form-item label="已选择员工" prop="userIds">
      <el-select
        placeholder="请选择"
        v-model="newFormInline.userIds"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="10"
        @change="onChange"
        :style="{ width: '100%', minWidth: '100px' }"
      >
        <el-option v-for="cell in filterOption" :key="cell.id" :label="cell.userName" :value="cell.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="选择组织迁移" prop="newOrgId">
      <el-select v-model="newFormInline.newOrgId" placeholder="请选择" :style="{ width: '100%', minWidth: '100px' }">
        <el-option v-for="cell in props.orgOptions" :key="cell.value" :label="cell.label" :value="cell.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
