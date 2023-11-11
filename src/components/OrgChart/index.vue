<template>
  <div class="org-chart">
    <div class="chart-action">
      <div style="display: flex; padding: 10px">
        <div style="margin-right: 10px"><el-switch v-model="horizontal" /> 横向</div>
        <div style="margin-right: 10px"><el-switch v-model="collapsable" /> 可收起</div>
        <div style="margin-right: 10px"><el-switch v-model="disaled" /> 禁止编辑</div>
        <div style="margin-right: 10px"><el-switch v-model="onlyOneNode" /> 仅拖动当前节点</div>
        <div style="margin-right: 10px"><el-switch v-model="cloneNodeDrag" /> 拖动节点副本</div>
        <div style="display: flex; align-items: center; margin-right: 10px">
          背景色：<el-color-picker v-model="style.background" size="small" />&nbsp; 文字颜色：<el-color-picker v-model="style.color" size="small" />&nbsp;
        </div>
        <div style="margin-right: 10px"><el-button type="primary" @click="exportOrgChart">导出</el-button></div>
      </div>
    </div>
    <div class="chart-area" ref="exportRef">
      <vue3-tree-org
        :data="orgData"
        center
        :horizontal="horizontal"
        :collapsable="collapsable"
        :label-style="style"
        :only-one-node="onlyOneNode"
        :clone-node-drag="cloneNodeDrag"
        :before-drag-end="beforeDragEnd"
        :default-expand-level="3"
        @on-node-drag="nodeDragMove"
        @on-node-drag-end="nodeDragEnd"
        @on-contextmenu="onMenus"
        @on-expand="onExpand"
        @on-node-dblclick="onNodeDblclick"
        @on-node-click="onNodeClick"
      >
        <!-- <template #default="{ node }">
          <div class="custom-node">
            <div class="left">{{ node.label }}</div>
            <div class="right">{{ node.directors }}</div>
          </div>
        </template> -->
      </vue3-tree-org>
    </div>
  </div>
</template>
<script lang="ts">
import { ElSwitch, ElColorPicker, ElMessage } from "element-plus";
import html2canvas from "html2canvas";
import { ref } from "vue";
import { cloneDeep, clone } from "@pureadmin/utils";
import { queryOrgData } from "@/api/test";

export default {
  name: "baseTree",
  components: {
    ElSwitch,
    ElColorPicker
  },
  setup() {
    const cloneNodeDrag = ref(true);
    const exportRef = ref(null);
    const exportRefTemp = ref(null);
    return {
      cloneNodeDrag,
      exportRefTemp,
      exportRef
    };
  },
  data() {
    return {
      orgData: {},
      horizontal: false,
      collapsable: true,
      onlyOneNode: false,
      expandAll: true,
      disaled: false,
      style: {
        background: "rgb(235, 27, 27)",
        color: "#fff"
      }
    };
  },
  created() {
    // this.toggleExpand(this.data, this.expandAll);
    this.fetchData();
  },
  methods: {
    // 递归设置属性
    setChartKey(obj) {
      obj["pid"] = obj["parentId"];
      obj["name"] = obj["title"];
      obj["label"] = obj["title"];

      if (obj["children"] && Array.isArray(obj["children"])) {
        for (const item of obj["children"]) {
          this.setChartKey(item);
        }
      }
      return obj;
    },
    fetchData() {
      queryOrgData({}).then((res) => {
        this.orgData = this.setChartKey(res.data[0]);
        console.log(this.orgData, "this.orgData");
      });
    },
    exportOrgChart() {
      console.log("object", this.exportRef);
      this.exportRefTemp = clone(this.exportRef, true);

      this.exportRefTemp.querySelectorAll(".tree-org-node__text").forEach((item) => {
        item.style.position = "relative";
        item.style.top = "-9px";
      });
      // return;
      html2canvas(this.exportRefTemp, {
        // backgroundColor: "#f5f5f5", //海报的背景颜色
        useCORS: true // 允许跨域
        // width: 1000, //生成海报的w
        // height: 2000 //生成海报的h    默认是px
      }).then((canvas) => {
        // console.log(canvas, "输出的canvas");
        // return;
        // canvas 其实就是我们所讲的res 的意思 返回报文的意思
        const baseImg = canvas.toDataURL("image/png");
        // posterimg.value = baseImg;
        const save = document.createElement("a");
        // <a href=''></a>
        save.href = baseImg;
        // 下载的名字
        save.download = "yz";
        // 直接回调a的点击事件
        save.click();
      });
    },
    onMenus({ node, command }) {
      console.log(node, command);
    },
    onExpand(e, data) {
      console.log(e, data);
    },
    onExpandAll(b) {
      console.log(b);
    },
    nodeDragMove(data) {
      console.log(data);
    },
    beforeDragEnd(node, targetNode) {
      return new Promise<void>((resolve, reject) => {
        if (!targetNode) reject();
        if (node.id === targetNode.id) {
          reject();
        } else {
          resolve();
        }
      });
    },
    nodeDragEnd(data, isSelf) {
      console.log(data, isSelf);
    },
    onNodeDblclick() {
      console.log("onNodeDblclick");
    },
    onNodeClick(e, data) {
      ElMessage.info(data.label);
    },
    expandChange() {
      // this.toggleExpand(this.data, this.expandAll);
    },
    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          item.expand = val;
          if (item.children) {
            this.toggleExpand(item.children, val);
          }
        });
      } else {
        data.expand = val;
        if (data.children) {
          this.toggleExpand(data.children, val);
        }
      }
    }
  }
};
</script>

<style scoped>
.chart-area {
  height: calc(100vh - 205px);
}

.custom-node {
  display: flex;
}
</style>
