<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header" />
      <template v-if="!$slots['control-header']">
        <!-- 上传下载 -->
        <el-button-group key="file-control">
          <el-button :size="size" type="primary" :icon="FolderOpened" @click="refFile.click()">打开文件</el-button>
          <el-tooltip effect="light">
            <template #content>
              <el-button :size="size" type="primary" link @click="downloadProcessAsXml()">下载为XML文件</el-button>
              <br />
              <el-button :size="size" type="primary" link @click="downloadProcessAsSvg()">下载为SVG文件</el-button>
              <br />
              <el-button :size="size" type="primary" link @click="downloadProcessAsBpmn()">下载为BPMN文件</el-button>
            </template>
            <el-button :size="size" :icon="Download" type="primary">下载文件</el-button>
          </el-tooltip>
          <el-tooltip effect="light">
            <template #content>
              <el-button :size="size" type="primary" link @click="previewProcessXML">预览XML</el-button>
              <br />
              <el-button :size="size" type="primary" link @click="previewProcessJson">预览JSON</el-button>
            </template>
            <el-button :size="size" :icon="View" type="primary">预览</el-button>
          </el-tooltip>
          <el-tooltip v-if="simulation" effect="light" :content="simulationStatus ? '退出模拟' : '开启模拟'">
            <el-button :size="size" type="primary" :icon="Cpu" @click="processSimulation"> 模拟 </el-button>
          </el-tooltip>
        </el-button-group>
        <!-- 对齐方式 -->
        <el-button-group key="align-control">
          <el-tooltip v-for="item in btns" effect="light" placement="top" :content="item.content" :key="item.type">
            <el-button :size="size" :class="item.class" :icon="Histogram" @click="elementsAlign(item.type)" />
          </el-tooltip>
        </el-button-group>
        <!-- 视图操作 -->
        <el-button-group key="scale-control">
          <el-tooltip effect="light" placement="top" content="缩小视图">
            <el-button :size="size" :disabled="defaultZoom < 0.2" :icon="ZoomOut" @click="processZoomOut()" />
          </el-tooltip>
          <el-button :size="size">{{ Math.floor(defaultZoom * 10 * 10) + "%" }}</el-button>
          <el-tooltip effect="light" placement="top" content="放大视图">
            <el-button :size="size" :disabled="defaultZoom > 4" :icon="ZoomIn" @click="processZoomIn()" />
          </el-tooltip>
          <el-tooltip effect="light" placement="top" content="重置视图并居中">
            <el-button :size="size" :icon="ScaleToOriginal" @click="processReZoom()" />
          </el-tooltip>
        </el-button-group>
        <el-button-group key="stack-control">
          <el-tooltip effect="light" placement="top" content="撤销">
            <el-button :size="size" :disabled="!revocable" :icon="RefreshLeft" @click="processUndo()" />
          </el-tooltip>
          <el-tooltip effect="light" placement="top" content="恢复">
            <el-button :size="size" :disabled="!recoverable" :icon="RefreshRight" @click="processRedo()" />
          </el-tooltip>
          <el-tooltip effect="light" placement="top" content="重新绘制">
            <el-button :size="size" :icon="Refresh" @click="processRestart" />
          </el-tooltip>
        </el-button-group>
        <el-button-group key="stack-control">
          <el-tooltip effect="light" placement="top" content="配置说明">
            <el-button :size="size" :icon="QuestionFilled" @click="onFlowConfig" />
          </el-tooltip>
        </el-button-group>
      </template>
      <!-- 用于打开本地文件-->
      <input type="file" ref="refFile" style="display: none" accept=".xml,.bpmn" @change="importLocalFile" />
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmnRef" />
    </div>
    <el-dialog title="预览" width="60%" v-model="previewModelVisible" align-center append-to-body destroy-on-close>
      <highlightjs :language="previewType" :code="previewResult" />
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, onUnmounted, watch, computed, toRaw, h } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { View, Download, FolderOpened, Cpu, MessageBox, Histogram } from "@element-plus/icons-vue";
import DefaultEmptyXML from "./plugins/defaultEmpty";
// 翻译方法
import customTranslate from "./plugins/translate/customTranslate";
import translationsCN from "./plugins/translate/zh";
// 模拟流转流程
import tokenSimulation from "bpmn-js-token-simulation";
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import camundaModdleDescriptor from "./plugins/descriptor/camundaDescriptor.json";
import activitiModdleDescriptor from "./plugins/descriptor/activitiDescriptor.json";
import flowableModdleDescriptor from "./plugins/descriptor/flowableDescriptor.json";
// 标签解析 Extension
import camundaModdleExtension from "./plugins/extension-moddle/camunda";
import activitiModdleExtension from "./plugins/extension-moddle/activiti";
import flowableModdleExtension from "./plugins/extension-moddle/flowable";

import X2JS from "x2js"; // 引入json转换与高亮
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { ZoomOut, ZoomIn, ScaleToOriginal, RefreshLeft, RefreshRight, Refresh, QuestionFilled } from "@element-plus/icons-vue";
import { useBpmnStore, BpmnStoreKey } from "@/components/BpmnFlow/hooks";
import { useBpmnFlowStore } from "@/store/modules/bpmn";
import { addDialog } from "@/components/ReDialog";
// 配置说明图片
import img01 from "@/assets/bpmn/flow-img01.png";
import img02 from "@/assets/bpmn/flow-img02.png";
import img03 from "@/assets/bpmn/flow-img03.png";
import img04 from "@/assets/bpmn/flow-img04.png";
import img05 from "@/assets/bpmn/flow-img05.png";
import img06 from "@/assets/bpmn/flow-img06.png";
import img07 from "@/assets/bpmn/flow-img07.png";
import img08 from "@/assets/bpmn/flow-img08.png";
import img09 from "@/assets/bpmn/flow-img09.png";

const props = withDefaults(
  defineProps<
    Partial<{
      value: string; // xml 字符串
      processId: string;
      processName: string;
      translations: object; // 自定义的翻译文件
      options: object; // 自定义的翻译文件
      additionalModel: any[]; // 自定义model
      moddleExtension: object; // 自定义moddle
      onlyCustomizeAddi: boolean;
      onlyCustomizeModdle: boolean;
      simulation: boolean;
      keyboard: boolean;
      prefix: string;
      events: string[];
      size: any; //"default" | "medium" | "small" | "min";
      primary: string;
    }>
  >(),
  {
    value: "", // xml 字符串
    processId: "",
    processName: "",
    translations: () => ({}), // 自定义的翻译文件
    options: () => ({}), // 自定义的翻译文件
    additionalModel: () => [], // 自定义model
    moddleExtension: () => ({}), // 自定义moddle
    onlyCustomizeAddi: false,
    onlyCustomizeModdle: false,
    simulation: true,
    keyboard: true,
    prefix: "camunda",
    events: () => ["element.click"],
    size: "small",
    primary: "primary" // "default", "primary", "success", "warning", "danger", "info"
  }
);
const emits = defineEmits(["element-click", "destroy", "init-finished", "saveProcess", "commandStack-changed", "input", "change", "canvas-viewbox-changed"]);
const { setBpmnStore } = useBpmnStore<{ saveProcess: Function }>();
const { setBpmnData } = useBpmnFlowStore();

const bpmnRef = ref();
const bpmnModeler = ref();

const defaultZoom = ref(1);
const previewModelVisible = ref(false);
const simulationStatus = ref(false);
const previewResult = ref("");
const previewType = ref("xml");
const recoverable = ref(false);
const revocable = ref(false);
const refFile = ref();

const btns = [
  { content: "向左对齐", class: "align align-left", type: "left" },
  { content: "向右对齐", class: "align align-right", type: "right" },
  { content: "向上对齐", class: "align align-top", type: "top" },
  { content: "向下对齐", class: "align align-bottom", type: "bottom" },
  { content: "水平居中", class: "align align-center", type: "center" },
  { content: "垂直居中", class: "align align-middle", type: "middle" }
];

const additionalModules = computed(() => {
  const Modules = [];
  const adModel = toRaw(props.additionalModel);
  // 仅保留用户自定义扩展模块
  if (props.onlyCustomizeAddi) {
    if (Object.prototype.toString.call(adModel) === "[object Array]") {
      return adModel || [];
    }
    return [adModel];
  }

  // 插入用户自定义扩展模块
  if (Object.prototype.toString.call(adModel) === "[object Array]") {
    Modules.push(...adModel);
  } else {
    adModel && Modules.push(adModel);
  }

  // 翻译模块
  const TranslateModule = {
    translate: ["value", customTranslate(props.translations || translationsCN)]
  };
  Modules.push(TranslateModule);

  // 模拟流转模块
  if (props.simulation) {
    Modules.push(tokenSimulation);
  }

  // 根据需要的流程类型设置扩展元素构建模块
  // if (props.prefix === "bpmn") {
  //   Modules.push(bpmnModdleExtension);
  // }
  if (props.prefix === "camunda") {
    Modules.push(camundaModdleExtension);
  }
  if (props.prefix === "flowable") {
    Modules.push(flowableModdleExtension);
  }
  if (props.prefix === "activiti") {
    Modules.push(activitiModdleExtension);
  }

  return Modules;
});

const moddleExtensions = computed(() => {
  const Extensions: Record<string, any> = {};
  // 仅使用用户自定义模块
  if (props.onlyCustomizeModdle) {
    return props.moddleExtension || null;
  }

  // 插入用户自定义模块
  if (props.moddleExtension) {
    for (const key in props.moddleExtension) {
      Extensions[key] = toRaw(props.moddleExtension[key]);
    }
  }

  // 根据需要的 "流程类型" 设置 对应的解析文件
  if (props.prefix === "activiti") {
    Extensions.activiti = activitiModdleDescriptor;
  }
  if (props.prefix === "flowable") {
    Extensions.flowable = flowableModdleDescriptor;
  }
  if (props.prefix === "camunda") {
    Extensions.camunda = camundaModdleDescriptor;
  }

  return Extensions;
});

onMounted(() => {
  initBpmnModeler();
  createNewDiagram(props.value);
  setBpmnStore(BpmnStoreKey.saveProcess, saveProcess);
});

onUnmounted(() => {
  if (bpmnModeler.value) bpmnModeler.value.destroy();
  emits("destroy", bpmnModeler.value);
  bpmnModeler.value = null;
});

watch(props, (val) => {
  createNewDiagram(props.value);
});

const initBpmnModeler = () => {
  if (bpmnModeler.value) return;
  bpmnModeler.value = new BpmnModeler({
    container: toRaw(bpmnRef.value),
    keyboard: props.keyboard ? { bindTo: document } : null,
    additionalModules: toRaw(additionalModules.value),
    moddleExtensions: toRaw(moddleExtensions.value),
    ...toRaw(props.options)
  });
  emits("init-finished", bpmnModeler.value);
  initModelListeners();
};

const initModelListeners = () => {
  const EventBus = bpmnModeler.value.get("eventBus");
  // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
  props.events.forEach((event) => {
    EventBus.on(event, function (eventObj) {
      const eventName: any = event.replace(/\./g, "-");
      const element = eventObj ? eventObj.element : null;
      emits(eventName, element, eventObj);
    });
  });

  // 监听图形改变返回xml
  EventBus.on("commandStack.changed", async (event) => {
    try {
      recoverable.value = bpmnModeler.value.get("commandStack").canRedo();
      revocable.value = bpmnModeler.value.get("commandStack").canUndo();
      const { xml } = await bpmnModeler.value.saveXML({ format: true });
      emits("commandStack-changed", event);
      emits("input", xml);
      emits("change", xml);
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e.message || e}`);
    }
  });
  // 监听视图缩放变化
  bpmnModeler.value.on("canvas.viewbox.changed", ({ viewbox }) => {
    emits("canvas-viewbox-changed", { viewbox });
    const { scale } = viewbox;
    defaultZoom.value = Math.floor(scale * 100) / 100;
  });
};

/* 创建新的流程图 */
const createNewDiagram = async (xml) => {
  // 将字符串转换成图显示出来
  const newId = props.processId || `Process_${new Date().getTime()}`;
  const newName = props.processName || `业务流程_${new Date().getTime()}`;
  const xmlString = xml || DefaultEmptyXML(newId, newName, props.prefix);
  try {
    const { warnings } = await bpmnModeler.value.importXML(xmlString);
    if (warnings && warnings.length) {
      warnings.forEach((warn) => console.warn(warn));
    }
  } catch (e) {
    console.error(`[Process Designer Warn]: ${e?.message || e}`);
  }
};

const getProcessElement = () => {
  const rootElements = bpmnModeler.value.getDefinitions().rootElements;
  for (let i = 0; i < rootElements.length; i++) {
    if (rootElements[i].$type === "bpmn:Process") return rootElements[i];
  }
};

// 保存流程图更改
/**
 * @param {string} type
 * @param {*} name
 */
const saveProcess = async (type) => {
  const { name } = getProcessElement();
  let xmlData = "";
  try {
    const { err, xml } = await bpmnModeler.value.saveXML();
    // 读取异常时抛出异常
    if (err) {
      console.error(`[Process Designer Warn ]: ${err.message || err}`);
    }
    xmlData = xml;
    emits("saveProcess", { type, name, data: xml });
    window.parent.postMessage({ type, name, data: xml }, "*");
  } catch (e) {
    console.error(`[Process Designer Warn ]: ${e.message || e}`);
  }
  return { type, name, data: xmlData };
};

// 下载流程图到本地
/**
 * @param {string} type
 * @param {*} name
 */
const downloadProcess = async (type, name = "") => {
  // 带后缀文件名
  const fileName = `${getProcessElement().name}.bpmn20.${type}`;
  try {
    // 按需要类型创建文件并下载
    if (type === "xml" || type === "bpmn") {
      const { err, xml } = await bpmnModeler.value.saveXML();
      // 读取异常时抛出异常
      if (err) console.error(`[Process Designer Warn ]: ${err.message || err}`);
      const { href } = setEncoded(type.toUpperCase(), name, xml);
      downloadFunc(href, fileName);
    } else {
      const { err, svg } = await bpmnModeler.value.saveSVG();
      // 读取异常时抛出异常
      if (err) return console.error(err);
      const { href } = setEncoded("SVG", name, svg);
      downloadFunc(href, fileName);
    }
  } catch (e) {
    console.error(`[Process Designer Warn ]: ${e.message || e}`);
  }
};

// 文件下载方法
function downloadFunc(href, filename) {
  if (href && filename) {
    const link = document.createElement("a");
    link.download = filename; //指定下载的文件名
    link.href = href; //  URL对象
    link.click(); // 模拟点击
    URL.revokeObjectURL(link.href); // 释放URL 对象
  }
}
// 根据所需类型进行转码并返回下载地址
const setEncoded = (type, filename = "diagram", data) => {
  const encodedData = encodeURIComponent(data);
  return {
    filename: `${filename}.${type}`,
    href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
    data: data
  };
};

// 加载本地文件
const importLocalFile = () => {
  const file = refFile.value.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (e) {
    const xmlStr = e.target.result;
    createNewDiagram(xmlStr);
    resetProcess();
  };
};
/* ------------------------------------------------ refs methods ------------------------------------------------------ */
const downloadProcessAsXml = () => {
  downloadProcess("xml");
};
const downloadProcessAsBpmn = () => {
  downloadProcess("bpmn");
};
const downloadProcessAsSvg = () => {
  downloadProcess("svg");
};

const processSimulation = () => {
  simulationStatus.value = !simulationStatus.value;
  props.simulation && bpmnModeler.value.get("toggleMode").toggleMode();
};
const processRedo = () => {
  bpmnModeler.value.get("commandStack").redo();
};
const processUndo = () => {
  bpmnModeler.value.get("commandStack").undo();
};
const processZoomIn = (zoomStep = 0.1) => {
  const newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100;
  if (newZoom > 4) {
    throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
  }
  defaultZoom.value = newZoom;
  bpmnModeler.value.get("canvas").zoom(defaultZoom.value);
};
const processZoomOut = (zoomStep = 0.1) => {
  const newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100;
  if (newZoom < 0.2) {
    throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
  }
  defaultZoom.value = newZoom;
  bpmnModeler.value.get("canvas").zoom(defaultZoom.value);
};
const processZoomTo = (newZoom = 1) => {
  if (newZoom < 0.2) {
    throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
  }
  if (newZoom > 4) {
    throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
  }
  defaultZoom.value = newZoom;
  bpmnModeler.value.get("canvas").zoom(newZoom);
};
const processReZoom = () => {
  defaultZoom.value = 1;
  bpmnModeler.value.get("canvas").zoom("fit-viewport", "auto");
};

// 重新绘制
const processRestart = () => {
  recoverable.value = false;
  revocable.value = false;
  createNewDiagram(null);
  resetProcess();
};

const elementsAlign = (align: string) => {
  const Align = bpmnModeler.value.get("alignElements");
  const Selection = bpmnModeler.value.get("selection");
  const SelectedElements = Selection.get();
  if (!SelectedElements || SelectedElements.length <= 1) {
    message("请按住 Shift 键选择多个元素对齐", { type: "warning" });
    return;
  }
  ElMessageBox.confirm("自动对齐可能造成图形变形，是否继续？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => Align.trigger(SelectedElements, align));
};

/*-----------------------------    方法结束     ---------------------------------*/
const previewProcessXML = () => {
  bpmnModeler.value.saveXML({ format: true }).then(({ xml }) => {
    previewResult.value = xml;
    previewType.value = "xml";
    previewModelVisible.value = true;
  });
};
const previewProcessJson = () => {
  const newConvert = new X2JS();
  bpmnModeler.value.saveXML({ format: true }).then(({ xml }) => {
    const { definitions } = newConvert.xml2js(xml) as any;
    if (definitions) {
      previewResult.value = JSON.stringify(definitions, null, 4);
    } else {
      previewResult.value = "";
    }

    previewType.value = "json";
    previewModelVisible.value = true;
  });
};
// 打开新的流程或者重新绘制
const resetProcess = () => {
  setBpmnData({ taskLists: [] });
};

// 流程配置说明
const onFlowConfig = () => {
  const DocComp = () => (
    <div class="vditor-reset" id="preview">
      <h1 id="流程模板配置">流程模板配置</h1>
      <h2 id="主界面配置">1.主界面配置</h2>
      <hr />
      <p style={{ marginLeft: "99px" }}>
        <img src={img01} alt="image.png" />
        <img src={img02} alt="image.png" />
      </p>
      <h2 id="节点配置">2.节点配置</h2>
      <hr />
      <p style={{ marginLeft: "99px" }}>
        <img src={img03} alt="image.png" />
      </p>
      <br />
      <p style={{ marginLeft: "99px" }}>
        <p style={{ margin: "15px 0" }}>
          <strong>集合: </strong>personList1
          <br />
          <strong>元素变量: </strong>person
          <br />
          <strong>完成条件: </strong>$&#123;nrOfCompletedInstances&#62;=nrOfInstances&#125;
        </p>
        <img src={img04} alt="image.png" />
      </p>
      <h2 id="任务监听器">3.任务监听器</h2>
      <hr />
      <br />
      <p style={{ marginLeft: "99px" }}>
        <img src={img05} alt="image.png" />
        <p style={{ margin: "15px 0" }}>
          <strong>依次选择: </strong>创建 - Java类
          <br />
          <strong>Java类值为: </strong>com.deogra.app.common.workflow.listener.MulitiInstanceTaskListener
        </p>
        <img src={img06} alt="image.png" />
      </p>
      <p style={{ marginLeft: "99px" }}>
        <p style={{ margin: "15px 0" }}>
          <strong>创建完成: </strong>
        </p>
        <img src={img07} alt="image.png" />
      </p>
      <br />
      <h2 id="保存创建和修改">4.保存创建和修改</h2>
      <hr />
      <p style={{ marginLeft: "99px" }}>
        <img src={img08} alt="image.png" />
      </p>
      <p style={{ marginLeft: "99px" }}>
        <img src={img09} alt="image.png" />
      </p>
    </div>
  );
  addDialog({
    title: "流程配置说明",
    width: "80%",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(DocComp),
    beforeSure: (done, { options }) => done()
  });
};
</script>
