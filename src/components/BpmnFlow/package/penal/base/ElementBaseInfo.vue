<template>
  <div class="panel-tab__content">
    <el-form size="small" :model="elementBaseInfo" label-width="90px" @submit.prevent>
      <el-form-item label="ID" required>
        <el-input v-model="elementBaseInfo.id" :disabled="idEditDisabled" placeholder="必填" clearable @change="updateBaseInfo('id')" />
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input v-model="elementBaseInfo.name" clearable placeholder="必填" @change="updateBaseInfo('name')" />
      </el-form-item>

      <!--任务管理-->
      <TaskManage :elementBaseInfo="elementBaseInfo" :activeId="activeId" />
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本标签">
          <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <el-form-item label="可执行">
          <el-switch
            v-model="elementBaseInfo.isExecutable"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="updateBaseInfo('isExecutable')"
          />
        </el-form-item>
      </template>
      <el-form-item v-if="elementBaseInfo.$type === 'bpmn:SubProcess'" label="状态">
        <el-switch v-model="elementBaseInfo.collapsed" active-text="展开" inactive-text="折叠" @change="updateBaseInfo('collapsed')" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick, toRaw } from "vue";
import TaskManage from "@/views/system/workflow/manage/taskManage/TaskManage.vue";

const props = withDefaults(
  defineProps<{
    businessObject: object;
    type: string;
    idEditDisabled?: boolean;
  }>(),
  {
    idEditDisabled: true
  }
);

const elementBaseInfo = ref({
  // di: { collapsed: true },// 没有用到
  id: "",
  name: "",
  $type: "",
  versionTag: "",
  isExecutable: false,
  collapsed: true, // 是否折叠
  // task
  personFrom: "",
  users: "",
  finishAdviceWay: [],
  // add
  billList: "",
  processId: "",
  billId: "",
  formUrl: "",
  tableName: "",
  fieldName: "",
  userFieldName: "",
  flowName: "",
  isEnable: false
});
const bpmnElement = ref();
const activeId = ref("");

watch(props, (val) => {
  if (val.businessObject) {
    nextTick(() => resetBaseInfo());
  }
});

const resetBaseInfo = () => {
  bpmnElement.value = window?.bpmnInstances?.bpmnElement || {};
  const formData = JSON.parse(JSON.stringify(bpmnElement.value.businessObject));
  elementBaseInfo.value = {
    ...formData,
    collapsed: !bpmnElement.value.collapsed
  };
  // if (elementBaseInfo.value?.$type === "bpmn:SubProcess") {
  //   elementBaseInfo.value.collapsed = elementBaseInfo.value.di?.collapsed;
  // }
  activeId.value = elementBaseInfo.value.id;
};
const updateBaseInfo = (key) => {
  if (key === "id") {
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      id: elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` }
    });
    return;
  }
  if (key === "collapsed") {
    window?.bpmnInstances?.modeling.toggleCollapse(toRaw(bpmnElement.value));
    return;
  }
  const attrObj = Object.create(null);
  attrObj[key] = elementBaseInfo.value[key];
  window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), attrObj);
};
</script>
