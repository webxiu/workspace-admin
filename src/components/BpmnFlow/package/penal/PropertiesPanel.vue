<template>
  <div class="process-panel-box">
    <div class="collapse-btn" @click="togglePanel" :title="isCollapse ? '收起' : '展开'">
      <el-icon v-show="isCollapse"><DArrowRight /></el-icon>
      <el-icon v-show="!isCollapse"><DArrowLeft /></el-icon>
    </div>
    <div class="process-panel__container" :style="isCollapse ? { width: `${width}px`, overflowY: 'scroll' } : { width: `1px`, overflow: 'hidden' }">
      <el-collapse v-model="activeTab">
        <el-collapse-item name="base">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><InfoFilled /></el-icon>常规
            </div>
          </template>
          <ElementBaseInfo :idEditDisabled="idEditDisabled" :businessObject="elementBusinessObject" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><Comment /></el-icon>消息与信号
            </div>
          </template>
          <SignalAndMassage />
        </el-collapse-item>
        <el-collapse-item name="condition" v-if="conditionFormVisible" key="condition">
          <template #title>
            <div class="panel-tab__title"><i class="el-icon-s-promotion" />流转条件</div>
          </template>
          <FlowCondition :businessObject="elementBusinessObject" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="condition" v-if="formVisible" key="form">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><List /></el-icon>
              表单
            </div>
          </template>
          <ElementForm :id="elementId" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="task" v-if="elementType.indexOf('Task') !== -1" key="task">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><Checked /></el-icon>
              任务
            </div>
          </template>
          <ElementTask :id="elementId" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="multiInstance" v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><HelpFilled /></el-icon>多实例
            </div>
          </template>
          <ElementMultiInstance :businessObject="elementBusinessObject" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="listeners" key="listeners">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><BellFilled /></el-icon>执行监听器
            </div>
          </template>
          <ElementListeners :id="elementId" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><BellFilled /></el-icon>任务监听器
            </div>
          </template>
          <UserTaskListeners :id="elementId" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="extensions" key="extensions">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><CirclePlusFilled /></el-icon>扩展属性
            </div>
          </template>
          <ElementProperties :id="elementId" :type="elementType" />
        </el-collapse-item>
        <el-collapse-item name="other" key="other">
          <template #title>
            <div class="panel-tab__title">
              <el-icon><Promotion /></el-icon>其他
            </div>
          </template>
          <ElementOtherConfig :id="elementId" />
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, provide, onUnmounted } from "vue";
import ElementBaseInfo from "./base/ElementBaseInfo.vue";
import ElementOtherConfig from "./other/ElementOtherConfig.vue";
import ElementTask from "./task/ElementTask.vue";
import ElementMultiInstance from "./multi-instance/ElementMultiInstance.vue";
import FlowCondition from "./flow-condition/FlowCondition.vue";
import SignalAndMassage from "./signal-message/SignalAndMessage.vue";
import ElementListeners from "./listeners/ElementListeners.vue";
import ElementProperties from "./properties/ElementProperties.vue";
import ElementForm from "./form/ElementForm.vue";
import UserTaskListeners from "./listeners/UserTaskListeners.vue";
import { DArrowRight, DArrowLeft } from "@element-plus/icons-vue";
import Log from "../Log";
import { useBpmnStore } from "@/components/BpmnFlow/hooks";

import BpmnModeler from "bpmn-js/lib/Modeler";
import { InfoFilled, List, Checked, HelpFilled, BellFilled, CirclePlusFilled, Promotion, Comment } from "@element-plus/icons-vue";

/**
 * 右侧侧边栏
 */

const props = withDefaults(
  defineProps<{
    bpmnModeler: BpmnModeler;
    prefix: string;
    width?: number;
    idEditDisabled?: boolean;
  }>(),
  {
    prefix: "camunda",
    width: 480,
    idEditDisabled: false
  }
);

provide("prefix", props.prefix);
provide("width", props.width);

const activeTab = ref("base");
const elementId = ref("");
const elementType = ref("");
const elementBusinessObject = ref({}); // 元素 businessObject 镜像，提供给需要做判断的组件使用
const conditionFormVisible = ref(false); // 流转条件设置
const formVisible = ref(false); // 表单配置
const isCollapse = ref(true);
const { store } = useBpmnStore<{ deleteTaskFn: Function }>();

let timer;

watch(elementId, (ele) => {
  activeTab.value = "base";
});

onMounted(() => {
  initModels();
});

onUnmounted(() => {
  window.bpmnInstances = null;
});

const initModels = () => {
  // 初始化 modeler 以及其他 moddle
  if (!props.bpmnModeler) {
    // 避免加载时 流程图 并未加载完成
    timer = setTimeout(() => initModels(), 10);
    return;
  }
  if (timer) clearTimeout(timer);

  window.bpmnInstances = {
    modeler: props.bpmnModeler,
    modeling: props.bpmnModeler.get("modeling"),
    moddle: props.bpmnModeler.get("moddle"),
    eventBus: props.bpmnModeler.get("eventBus"),
    bpmnFactory: props.bpmnModeler.get("bpmnFactory"),
    elementFactory: props.bpmnModeler.get("elementFactory"),
    elementRegistry: props.bpmnModeler.get("elementRegistry"),
    replace: props.bpmnModeler.get("replace"),
    selection: props.bpmnModeler.get("selection"),
    bpmnElement: null
  };
  getActiveElement();
};

const getActiveElement = () => {
  // 初始第一个选中元素 bpmn:Process
  initFormOnChanged(null);
  props.bpmnModeler.on("import.done", (e) => {
    initFormOnChanged(null);
  });
  // 监听选择事件，修改当前激活的元素以及表单
  props.bpmnModeler.on("selection.changed", ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null);
  });
  props.bpmnModeler.on("element.changed", ({ element }) => {
    // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
    if (element && element.id === elementId.value) {
      initFormOnChanged(element);
    }
  });
  props.bpmnModeler.on("shape.removed", ({ element }) => {
    if (element.type === "bpmn:UserTask" && typeof store.deleteTaskFn === "function") {
      store.deleteTaskFn(element);
    }
  });
};

// 初始化数据
const initFormOnChanged = (element) => {
  let activatedElement = element;
  if (!activatedElement) {
    activatedElement =
      window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Process") ??
      window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Collaboration");
  }
  if (!activatedElement) return;
  window.bpmnInstances.bpmnElement = activatedElement;
  elementId.value = activatedElement.id;
  elementType.value = activatedElement.type.split(":")[1] || "";
  elementBusinessObject.value = JSON.parse(JSON.stringify(activatedElement.businessObject));
  conditionFormVisible.value = !!(elementType.value === "SequenceFlow" && activatedElement.source && activatedElement.source.type.indexOf("StartEvent") === -1);
  formVisible.value = elementType.value === "UserTask" || elementType.value === "StartEvent";
};

const togglePanel = () => {
  isCollapse.value = !isCollapse.value;
};
</script>
