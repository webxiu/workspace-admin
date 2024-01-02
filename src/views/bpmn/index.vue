<script setup lang="ts">
import Bpmn, { XmlDataType, FlowType } from "./bpmn.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useBpmnStore } from "@/components/BpmnFlow/hooks";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { useEleHeight } from "@/hooks";

const { VITE_PUBLIC_PATH } = import.meta.env;
const xml = ref("");
const bpmnRef = ref();
const loading = ref(false);
const { store } = useBpmnStore<{ taskForm: { [key: string]: object }; bpmnModeler: BpmnModeler; saveProcess: (type: FlowType) => XmlDataType }>();
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 0);

onMounted(() => {
  getXml();
});

const getXml = () => {
  loading.value = true;
  const url = `${VITE_PUBLIC_PATH}审批.bpmn20.xml`;
  axios({ method: "get", url: url })
    .then(({ data }) => (xml.value = data))
    .catch(console.log)
    .finally(() => (loading.value = false));
};

/** 获取流程图中为任务节点的id */
const getUserTaskList = () => {
  const elements = store.bpmnModeler.get("elementRegistry")._elements;
  const processInfo = { name: "", id: "" };
  const userTaskList: { name: string; id: string }[] = [];
  for (const key in elements) {
    const elementObj = elements[key].element;
    const { name, id } = elementObj.businessObject;
    if (elementObj?.type === "bpmn:UserTask") {
      userTaskList.push({ name: elementObj.businessObject.name, id: key });
    } else if (elementObj?.type === "bpmn:Process") {
      processInfo.id = id;
      processInfo.name = name;
    }
  }
  return { userTaskList, processInfo };
};

/**
 * 提交流程校验
 * 校验选项:流程名称、多实例、任务监听器...
 */
const verifyFlow = (xml: string) => {
  const { processInfo, userTaskList } = getUserTaskList();
  if (!processInfo.name) {
    message("请添加流程名称", { type: "warning" });
    return false;
  } else if (!processInfo.id) {
    message("请添加流程ID", { type: "warning" });
    return false;
  } else if (!xml.includes("startEvent")) {
    message("请添加开始节点", { type: "warning" });
    return false;
  } else if (!xml.includes("userTask")) {
    message("请添加任务节点", { type: "warning" });
    return false;
  } else if (!xml.includes("endEvent")) {
    message("请添加结束节点", { type: "warning" });
    return false;
  }

  const msgObj = {
    loopCharacteristics: "多实例:请选择回路特性",
    collection: "多实例:集合不能为空",
    elementVariable: "多实例:元素变量不能为空",
    completionCondition: "多实例:完成条件不能为空",
    elementListenersList: "任务监听器:列表不能为空"
  };

  let mark = true;
  if (userTaskList?.length && store.taskForm) {
    outerLoop: for (const item of userTaskList) {
      const taskNode = store.taskForm[item.id];
      console.log("taskNode", taskNode);
      if (!item.name) {
        mark = false;
        message("任务名称不能为空", { type: "error" });
        break;
      } else if (!item.id) {
        mark = false;
        message("任务id不能为空", { type: "error" });
        break;
      } else if (!taskNode) {
        mark = false;
        message(item.name + "任务配置不能为空", { type: "error" });
        break;
      }

      for (const key of Object.keys(msgObj)) {
        // 多实例->回路特性的选项为:循环事件或无时, 没有子选项, 不做校验
        if (["StandardLoop", "Null"].includes(taskNode["loopCharacteristics"])) {
          break outerLoop;
        }
        if (!taskNode[key] || !taskNode[key]?.length) {
          mark = false;
          message(item.name + msgObj[key], { type: "error" });
          break outerLoop;
        }
      }
    }
  }
  return mark;
};

const onSave = async () => {
  const flowData: XmlDataType = await store.saveProcess("xml");
  const xml = flowData.data;
  // 提交流程校验
  if (!verifyFlow(xml)) return;
  ElMessageBox.confirm("确定要提交吗?", "系统提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  })
    .then(() => {
      const fd = new FormData();
      const flowName: string = flowData.name;
      const fileName = `${flowName}.bpmn20.xml`;
      const xmlFile = new File([xml], fileName, { type: "text/xml" });
      fd.append("files", xmlFile);
      fd.append("flowName", flowName);
      console.log("xml", xml);
      console.log("xml文件", xmlFile);

      axios({ method: "post", url: "/tesss", data: fd, headers: { "Content-Type": "multipart/form-data" } })
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    })
    .catch(console.log);
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content ui-ov-h" :style="{ height: maxHeight + 'px' }">
    <div class="ui-ta-r p-2">
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
    <Bpmn class="flex-1" :xml="xml" :loading="loading" />
  </div>
</template>
