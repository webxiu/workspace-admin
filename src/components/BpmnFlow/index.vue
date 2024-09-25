<template>
  <div id="bpmn">
    <ProcessPalette />
    <ProcessDesigner
      :key="`designer-${reloadIndex}`"
      :options="{ taskResizingEnabled: true, eventResizingEnabled: true, minimap: { open: true } }"
      :value="xmlString"
      v-bind="controlForm"
      keyboard
      ref="processDesigner"
      @element-click="elementClick"
      @element-contextmenu="elementContextmenu"
      @init-finished="initModeler"
    />
    <ElementProperties :key="`penal-${reloadIndex}`" :bpmnModeler="modeler" :prefix="controlForm.prefix" class="process-panel" />
  </div>
</template>

<script lang="ts" setup>
import ProcessPalette from "./package/palette/ProcessPalette.vue";
import ProcessDesigner from "./package/designer/ProcessDesigner.vue";
import ElementProperties from "./package/penal/PropertiesPanel.vue";
import translations from "./package/translations";
import "./theme/index.scss";

// 自定义渲染（隐藏了 label 标签）
import CustomRenderer from "./modules/custom-renderer";
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "./package/designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "./package/designer/plugins/palette";
import Log from "./package/Log";
// 任务resize
import resizeTask from "bpmn-js-task-resize/lib";
// bpmn theme plugin
import sketchyRendererModule from "bpmn-js-sketchy";
// 小地图
import minimapModule from "diagram-js-minimap";
import UserSql from "./modules/extension/user.json";

// clickoutside
import RewriteAutoPlace from "./modules/auto-place/rewriteAutoPlace";

import { ref, reactive, watch } from "vue";
import { FlowManageItemType } from "@/api/systemManage";
import { useBpmnStore, BpmnStoreKey } from "@/components/BpmnFlow/hooks";

/** 数据类型 */
export interface XmlDataType {
  /** xml数据 */
  data: string;
  /** 流程名称 */
  name: string;
  /** 类型: `svg` */
  type: string;
}

const props = withDefaults(defineProps<{ xml: string; row?: Partial<FlowManageItemType> }>(), {
  xml: "",
  row: () => ({})
});

const xmlString = ref("");
const modeler = ref(null);
const reloadIndex = ref(0);
const controlDrawerVisible = ref(false);
const infoTipVisible = ref(false);
const pageMode = ref(false);
const translationsSelf = ref(translations);
const elementRef = ref();

const { setBpmnStore } = useBpmnStore();

watch(props, (val) => {
  setBpmnStore(BpmnStoreKey.row, val.row);
});

const controlForm = reactive({
  processId: "",
  processName: "",
  simulation: true,
  labelEditing: false,
  labelVisible: false,
  prefix: "flowable",
  events: ["element.click", "element.contextmenu"],
  // additionalModel: []
  moddleExtension: { user: UserSql },
  additionalModel: [
    CustomContentPadProvider,
    CustomPaletteProvider,
    minimapModule,
    {
      __init__: ["autoPlaceSelectionBehavior"],
      autoPlace: ["type", RewriteAutoPlace]
    }
  ]
});

const addis = reactive({
  CustomContentPadProvider,
  CustomPaletteProvider,
  labelEditing: undefined,
  customRenderer: undefined
});

watch(props, (val) => {
  xmlString.value = val.xml;
});

const initModeler = (model) => {
  setTimeout(() => {
    modeler.value = model;
    setBpmnStore(BpmnStoreKey.bpmnModeler, model);
    // const canvas = model.get("canvas");
    // const rootElement = canvas.getRootElement();
    // Log.prettyPrimary("Process Id:", rootElement.id);
    // Log.prettyPrimary("Process Name:", rootElement.businessObject.name);
  }, 10);
};

const elementClick = (element) => {
  console.log("elementClick", element);
  elementRef.value = element;
};

const elementContextmenu = (element) => {
  console.log("elementContextmenu:", element);
};

const reloadProcessDesigner = (notDeep = false) => {
  controlForm.additionalModel = [];
  for (const key in addis) {
    if (addis[key]) {
      controlForm.additionalModel.push(addis[key]);
    }
  }
  !notDeep && (xmlString.value = undefined);
  reloadIndex.value += 1;
  modeler.value = null; // 避免 panel 异常
};
const changeLabelEditingStatus = (status) => {
  addis.labelEditing = status ? { labelEditingProvider: ["value", ""] } : false;
  reloadProcessDesigner();
};
const changeLabelVisibleStatus = (status) => {
  addis.customRenderer = status ? CustomRenderer : false;
  reloadProcessDesigner();
};

const changePageMode = (mode) => {
  const theme = mode
    ? { stroke: "#ffffff", fill: "#333333" } // dark
    : { stroke: "#000000", fill: "#ffffff" }; // light
  const elements = modeler.value.get("elementRegistry").getAll();
  modeler.value.get("modeling").setColor(elements, theme);
};
const toggle = (mode) => {
  // console.log(modeler.value.get("toggleMode"));
  modeler.value.get("toggleMode").toggleMode();
};
</script>

<style lang="scss" scoped>
#bpmn {
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: 140px auto max-content;
  width: 100%;
  height: 100%;
}
</style>
