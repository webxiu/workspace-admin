<template>
  <div class="panel-tab__content">
    <el-form size="small" label-width="90px" @submit.prevent>
      <el-form-item label="回路特性" required>
        <el-select v-model="loopCharacteristics" @change="changeLoopCharacteristicsType">
          <!--bpmn:MultiInstanceLoopCharacteristics-->
          <el-option label="并行多重事件" value="ParallelMultiInstance" />
          <el-option label="时序多重事件" value="SequentialMultiInstance" />
          <!--bpmn:StandardLoopCharacteristics-->
          <el-option label="循环事件" value="StandardLoop" />
          <el-option label="无" value="Null" />
        </el-select>
      </el-form-item>
      <template v-if="['ParallelMultiInstance', 'SequentialMultiInstance'].includes(loopCharacteristics)">
        <el-form-item label="循环基数" key="loopCardinality">
          <el-input v-model="loopInstanceForm.loopCardinality" clearable @change="updateLoopCardinality" />
        </el-form-item>
        <el-form-item label="集合" key="collection" required>
          <template #label>
            <el-tooltip class="box-item" effect="light" placement="top-start" content="有多个任务节点, 集合的值不能相同(参考值: personList2, personList3, ...)">
              <template #default>
                <span>
                  <span>集合</span>
                  <el-icon style="margin-left: 2px" class="ui-va-tt fz-14">
                    <QuestionFilled style="color: orange" />
                  </el-icon>
                </span>
              </template>
            </el-tooltip>
          </template>
          <el-input v-model="loopInstanceForm.collection" placeholder="必填" clearable @change="updateLoopBase" />
        </el-form-item>
        <el-form-item label="元素变量" key="elementVariable" required>
          <el-input v-model="loopInstanceForm.elementVariable" placeholder="必填" clearable @change="updateLoopBase" />
        </el-form-item>
        <el-form-item label="完成条件" key="completionCondition" required>
          <el-input v-model="loopInstanceForm.completionCondition" placeholder="必填" clearable @change="updateLoopCondition" />
        </el-form-item>
        <el-form-item label="异步状态" key="async">
          <el-checkbox v-model="loopInstanceForm.asyncBefore" label="异步前" @change="updateLoopAsync('asyncBefore')" />
          <el-checkbox v-model="loopInstanceForm.asyncAfter" label="异步后" @change="updateLoopAsync('asyncAfter')" />
          <el-checkbox
            v-model="loopInstanceForm.exclusive"
            v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
            label="排除"
            @change="updateLoopAsync('exclusive')"
          />
        </el-form-item>
        <el-form-item label="重试周期" prop="timeCycle" v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore" key="timeCycle">
          <el-input v-model="loopInstanceForm.timeCycle" clearable @change="updateLoopTimeCycle" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { inject, reactive, ref, watch, onUnmounted, nextTick, toRaw } from "vue";
import { QuestionFilled } from "@element-plus/icons-vue";
import { setTaskForm } from "@/components/BpmnFlow/hooks";

const props = defineProps<{
  businessObject: object;
  type: string;
}>();

const prefix = inject("prefix");

const loopCharacteristics = ref("");
//默认配置，用来覆盖原始不存在的选项，避免报错
const defaultLoopInstanceForm = reactive({
  completionCondition: "",
  loopCardinality: "",
  extensionElements: [],
  asyncAfter: false,
  asyncBefore: false,
  exclusive: false
});

const loopInstanceForm = ref({
  loopCardinality: "",
  collection: "",
  elementVariable: "",
  completionCondition: "",
  asyncBefore: "",
  asyncAfter: "",
  exclusive: false,
  timeCycle: ""
});
const bpmnElement = ref({});
const multiLoopInstance = ref({});

watch(
  props,
  (val) => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    nextTick(() => {
      getElementLoop(val.businessObject);
    });
  },
  { immediate: true }
);

onUnmounted(() => {
  multiLoopInstance.value = null;
  bpmnElement.value = null;
});

const getElementLoop = (businessObject) => {
  if (!businessObject.loopCharacteristics) {
    // loopCharacteristics.value = "Null";
    loopCharacteristics.value = undefined; // 不给默认值, 让用户主动选择
    loopInstanceForm.value = {} as any;
    addTaskForm();
    return;
  }
  if (businessObject.loopCharacteristics.$type === "bpmn:StandardLoopCharacteristics") {
    loopCharacteristics.value = "StandardLoop";
    loopInstanceForm.value = {} as any;
    addTaskForm();
    return;
  }
  if (businessObject.loopCharacteristics.isSequential === true) {
    loopCharacteristics.value = "SequentialMultiInstance";
  } else {
    loopCharacteristics.value = "ParallelMultiInstance";
  }
  // 合并配置
  loopInstanceForm.value = {
    ...defaultLoopInstanceForm,
    ...businessObject.loopCharacteristics,
    completionCondition: businessObject.loopCharacteristics?.completionCondition?.body ?? "",
    loopCardinality: businessObject.loopCharacteristics?.loopCardinality?.body ?? ""
  };
  // 保留当前元素 businessObject 上的 loopCharacteristics 实例
  multiLoopInstance.value = window.bpmnInstances.bpmnElement.businessObject.loopCharacteristics;
  // 更新表单
  if (
    businessObject.loopCharacteristics.extensionElements &&
    businessObject.loopCharacteristics.extensionElements.values &&
    businessObject.loopCharacteristics.extensionElements.values.length
  ) {
    loopInstanceForm.value.timeCycle = businessObject.loopCharacteristics.extensionElements.values[0].body;
  }
  addTaskForm();
};
const changeLoopCharacteristicsType = (type) => {
  // loopInstanceForm.value = { ...defaultLoopInstanceForm }; // 切换类型取消原表单配置
  // 取消多实例配置
  if (type === "Null") {
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), { loopCharacteristics: null });
    addTaskForm();
    return;
  }
  // 配置循环
  if (type === "StandardLoop") {
    const loopCharacteristicsObject = window.bpmnInstances.moddle.create("bpmn:StandardLoopCharacteristics");
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      loopCharacteristics: loopCharacteristicsObject
    });
    multiLoopInstance.value = null;
    return;
  }
  // 时序
  if (type === "SequentialMultiInstance") {
    multiLoopInstance.value = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics", {
      isSequential: true
    });
  } else {
    multiLoopInstance.value = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics", {
      isSequential: "false"
    });
  }
  window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
    loopCharacteristics: multiLoopInstance.value
  });
  addTaskForm();
};
// 循环基数
const updateLoopCardinality = (cardinality) => {
  let loopCardinality = null;
  if (cardinality && cardinality.length) {
    loopCardinality = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: cardinality });
  }
  window.bpmnInstances.modeling.updateModdleProperties(toRaw(bpmnElement.value), multiLoopInstance.value, {
    loopCardinality
  });
  addTaskForm();
};
// 完成条件
const updateLoopCondition = (condition) => {
  let completionCondition = null;
  if (condition && condition.length) {
    completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: condition });
  }
  window.bpmnInstances.modeling.updateModdleProperties(toRaw(bpmnElement.value), multiLoopInstance.value, {
    completionCondition
  });
  addTaskForm();
};
// 重试周期
const updateLoopTimeCycle = (timeCycle) => {
  const extensionElements = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
    values: [
      window.bpmnInstances.moddle.create(`${prefix}:FailedJobRetryTimeCycle`, {
        body: timeCycle
      })
    ]
  });
  window.bpmnInstances.modeling.updateModdleProperties(toRaw(bpmnElement.value), multiLoopInstance.value, {
    extensionElements
  });
  addTaskForm();
};
// 直接更新的基础信息
const updateLoopBase = () => {
  window.bpmnInstances.modeling.updateModdleProperties(toRaw(bpmnElement.value), multiLoopInstance.value, {
    collection: loopInstanceForm.value.collection || null,
    elementVariable: loopInstanceForm.value.elementVariable || null
  });
  addTaskForm();
};
// 各异步状态
const updateLoopAsync = (key) => {
  const { asyncBefore, asyncAfter } = loopInstanceForm.value;
  let asyncAttr = Object.create(null);
  if (!asyncBefore && !asyncAfter) {
    loopInstanceForm.value.exclusive = false;
    asyncAttr = { asyncBefore: false, asyncAfter: false, exclusive: false, extensionElements: null };
  } else {
    asyncAttr[key] = loopInstanceForm.value[key];
  }
  window.bpmnInstances.modeling.updateModdleProperties(toRaw(bpmnElement.value), multiLoopInstance.value, asyncAttr);
  addTaskForm();
};

const addTaskForm = () => {
  setTaskForm(bpmnElement.value as any, { ...loopInstanceForm.value, loopCharacteristics: loopCharacteristics.value });
};
</script>
