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

const props = withDefaults(defineProps<{ xml: string }>(), {
  xml: ""
});

const xmlString = ref("");
const modeler = ref(null);
const reloadIndex = ref(0);
const controlDrawerVisible = ref(false);
const infoTipVisible = ref(false);
const pageMode = ref(false);
const translationsSelf = ref(translations);
const elementRef = ref();

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
body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
}
#bpmn {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: 100px auto max-content;
}
.demo-info-bar {
  position: fixed;
  right: 8px;
  bottom: 108px;
  z-index: 1;
}
.demo-control-bar {
  position: fixed;
  right: 8px;
  bottom: 48px;
  z-index: 1;
}
.open-model-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 32px;
  background: rgba(64, 158, 255, 1);
  color: #ffffff;
  cursor: pointer;
}
.zoom-in-right-enter-active,
.zoom-in-right-leave-active {
  opacity: 1;
  transform: scaleY(1) translateY(-48px);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: right center;
}
.zoom-in-right-enter,
.zoom-in-right-leave-active {
  opacity: 0;
  transform: scaleX(0) translateY(-48px);
}
.info-tip {
  position: absolute;
  width: 480px;
  top: 0;
  right: 64px;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 16px;
  color: #333333;
  background: #f2f6fc;
  transform: translateY(-48px);
  border: 1px solid #ebeef5;
  border-radius: 4px;
  &::before,
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    position: absolute;
    right: -15px;
    top: 50%;
  }
  &::before {
    border-color: transparent transparent transparent #f2f6fc;
    z-index: 10;
  }
  &::after {
    right: -16px;
    border-color: transparent transparent transparent #ebeef5;
    z-index: 1;
  }
}
.control-form {
  .el-radio {
    width: 100%;
    line-height: 32px;
  }
}
.element-overlays {
  box-sizing: border-box;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fafafa;
}

body,
body * {
  /* 滚动条 */
  &::-webkit-scrollbar-track-piece {
    background-color: #fff; /*滚动条的背景颜色*/
    -webkit-border-radius: 0; /*滚动条的圆角宽度*/
  }
  &::-webkit-scrollbar {
    width: 10px; /*滚动条的宽度*/
    height: 8px; /*滚动条的高度*/
  }
  &::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: rgba(153, 153, 153, 0.5);
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.3);
    -webkit-border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.5);
    -webkit-border-radius: 4px;
  }
}
</style>
