<!-- /*
 * @Author: lixiuhai 
 * @Date: 2024-02-27 10:47:51 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2024-02-27 10:47:51 
 */ -->
<template>
  <section class="my-gantt">
    <div class="time-box">
      <el-radio-group v-model="data.timeState" @change="changeTime">
        <el-radio-button v-for="(time, t_index) in data.timeList" :key="t_index" :label="time.code" size="default" border>{{ time.name }}</el-radio-button>
      </el-radio-group>
      <div>
        <el-button style="margin-left: 10px" type="primary" @click="onShowData">数据格式</el-button>
        <el-button :icon="RefreshLeft" title="撤销" @click="onUndo" />
        <el-button :icon="RefreshRight" title="恢复" @click="onRedo" />
        <el-button :icon="ZoomOut" title="缩小" @click="onZoomIn" />
        <el-button :icon="ZoomIn" title="放大" @click="onZoomOut" />
        <el-button :icon="Download" title="下载" @click="onDownload" />
      </div>
    </div>
    <div id="gantt_here" class="gantt-container" />
  </section>
</template>

<script lang="tsx" setup>
import { h, reactive, nextTick, onMounted } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import { addDialog } from "@/components/ReDialog";
import { gantt, GridColumn, Gantt, GanttConfigOptions, ZoomLevels, GanttEventName, GanttTemplates, GanttInitializationConfig, Task } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { copyText } from "@/utils/common";
import { ZoomOut, ZoomIn, Download, RefreshRight, RefreshLeft } from "@element-plus/icons-vue";

interface ZoomConfigType {
  levels: ZoomLevels[];
  handler?: Function;
  startDate?: Date;
  endDate?: Date;
  activeLevelIndex?: number;
  widthStep?: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  useKey?: string;
  trigger?: string | null | undefined;
  element?: HTMLElement | Function;
}

const data = reactive({
  timeState: "day",
  timeList: [
    { name: "日", code: "day" },
    { name: "周", code: "week" },
    { name: "月", code: "month" },
    { name: "季", code: "quarter" },
    { name: "年", code: "year" }
  ]
});

const demoData: { data: Array<Task>; links: any[] } = {
  data: [
    /**
    type:     项目类型 task任务 project项目  milestone里程碑
    duration: 任务持续时间
    parent:   父任务id
    progress: 滑块的进度
    open:     是否展开显示
   */
    { id: 11, text: "总部 #1", start_date: new Date("2023-03-28"), priority: 1, duration: 11, progress: 0.6, open: true },
    { id: 1, text: "项目 #2", start_date: new Date("2023-04-01"), priority: 2, duration: 18, progress: 0.4, open: true },

    { id: 2, text: "分开 #1", start_date: new Date("2023-04-02"), priority: 2, duration: 8, parent: "1", progress: 0.5, open: true },
    { id: 3, text: "粉丝 #2", start_date: new Date("2023-04-11"), priority: 2, duration: 8, parent: "1", progress: 0.6, open: true },
    { id: 4, text: "归属 #3", start_date: new Date("2023-04-13"), priority: 2, duration: 6, parent: "1", progress: 0.5, open: true },
    { id: 5, text: "额外 #1.1", start_date: new Date("2023-04-02"), priority: 1, duration: 7, parent: "2", progress: 0.6, open: true },
    { id: 6, text: "封锁 #1.2", start_date: new Date("2023-04-03"), priority: 2, duration: 7, parent: "2", progress: 0.6, open: true },
    { id: 7, text: "而我 #2.1", start_date: new Date("2023-04-11"), priority: 2, duration: 8, parent: "3", progress: 0.6, open: true },
    { id: 8, text: "刚刚 #3.1", start_date: new Date("2023-04-14"), priority: 2, duration: 5, parent: "4", progress: 0.5, open: true },
    { id: 9, text: "范文 #3.2", start_date: new Date("2023-04-14"), priority: 2, duration: 4, parent: "4", progress: 0.5, open: true },
    { id: 10, text: "巍峨 #3.3", start_date: new Date("2023-04-14"), priority: 2, duration: 3, parent: "4", progress: 0.5, open: true },

    { id: 12, text: "服务 #1", start_date: new Date("2023-04-03"), priority: 2, duration: 5, parent: "11", progress: 1, open: true },
    { id: 13, text: "知道 #2", start_date: new Date("2023-04-01"), priority: 2, duration: 7, parent: "11", progress: 0.5, open: true },
    { id: 14, text: "访问 #3", start_date: new Date("2023-04-02"), priority: 1, duration: 6, parent: "11", progress: 0.8, open: true },
    { id: 15, text: "用户 #4", start_date: new Date("2023-04-02"), priority: 2, duration: 5, parent: "11", progress: 0.2, open: true },
    { id: 16, text: "位数 #5", start_date: new Date("2023-04-02"), priority: 2, duration: 7, parent: "11", progress: 0, open: true },

    { id: 17, text: "基于 #2.1", start_date: new Date("2023-04-03"), priority: 2, duration: 2, parent: "13", progress: 1, open: true },
    { id: 18, text: "问就 #2.2", start_date: new Date("2023-04-06"), priority: 2, duration: 3, parent: "13", progress: 0.8, open: true },
    { id: 19, text: "份额 #2.3", start_date: new Date("2023-04-10"), priority: 2, duration: 4, parent: "13", progress: 0.2, open: true },
    { id: 20, text: "微软 #2.4", start_date: new Date("2023-04-10"), priority: 2, duration: 4, parent: "13", progress: 0, open: true },
    { id: 21, text: "发胀 #4.1", start_date: new Date("2023-04-03"), priority: 1, duration: 4, parent: "15", progress: 0.5, open: true },
    { id: 22, text: "风色 #4.2", start_date: new Date("2023-04-03"), priority: 2, duration: 4, parent: "15", progress: 0.1, open: true },
    {
      id: 23,
      text: "烩肉 #4.3",
      start_date: new Date("2023-04-03"),
      priority: 2,
      duration: 5,
      parent: "15",
      progress: 0,
      open: true,
      template: (obj) => {
        console.log("obj", obj);
        return `${obj.progress * 100}%`;
      }
    }
  ],
  links: [
    /**
      source:资源id
      target:目标id
		  type: 连接类型
        0--进行-开始  `尾部链接头部`
				1--开始-开始	`头部链接头部`
				2--进行-进行	`尾部链接尾部`
				3--开始-进行	`头部链接尾部`
     */
    { id: "1", source: "1", target: "2", type: "1" },
    { id: "2", source: "2", target: "3", type: "0" },
    { id: "3", source: "3", target: "4", type: "0" },
    { id: "4", source: "2", target: "5", type: "2" },
    { id: "5", source: "2", target: "6", type: "2" },
    { id: "6", source: "3", target: "7", type: "2" },
    { id: "7", source: "4", target: "8", type: "2" },
    { id: "8", source: "4", target: "9", type: "2" },
    { id: "9", source: "4", target: "10", type: "2" },
    { id: "10", source: "11", target: "12", type: "1" },
    { id: "11", source: "11", target: "13", type: "1" },
    { id: "12", source: "11", target: "14", type: "1" },
    { id: "13", source: "11", target: "15", type: "1" },
    { id: "14", source: "11", target: "16", type: "1" },
    { id: "15", source: "13", target: "17", type: "1" },
    { id: "16", source: "17", target: "18", type: "0" },
    { id: "17", source: "18", target: "19", type: "0" },
    { id: "18", source: "19", target: "20", type: "0" },
    { id: "19", source: "15", target: "21", type: "2" },
    { id: "20", source: "15", target: "22", type: "2" },
    { id: "21", source: "15", target: "23", type: "2" }
  ]
};

const columns: GridColumn[] = [
  { name: "text", label: "任务名称", tree: true, min_width: 160, resize: true },
  { name: "start_date", label: "开始时间", align: "center", width: 80 },
  { name: "end_date", label: "结束时间", align: "center", width: 80 },
  { name: "progress", label: "进度", align: "center", width: 60, template: (obj) => `${obj.progress * 100}%` }
];

const zoomConfig: ZoomConfigType = {
  levels: [
    {
      name: "day",
      scale_height: 60,
      scales: [{ unit: "day", step: 1, format: "%d %M" }]
    },
    {
      name: "week",
      scale_height: 60,
      scales: [
        {
          unit: "week",
          step: 1,
          format: function (date) {
            const dateToStr = gantt.date.date_to_str("%m-%d");
            const endDate = gantt.date.add(date, -6, "day");
            const weekNum = gantt.date.date_to_str("%W")(date); //第几周
            return dateToStr(endDate) + " 至 " + dateToStr(date);
          }
        },
        {
          unit: "day",
          step: 1,
          format: "%d", // + "周%D"
          css: function (date) {
            if (date.getDay() == 0 || date.getDay() == 6) {
              return "day-item weekend weekend-border-bottom";
            } else {
              return "day-item";
            }
          }
        }
      ]
    },
    {
      name: "month",
      scale_height: 60,
      min_column_width: 18,
      scales: [
        { unit: "month", format: "%Y-%m" },
        {
          unit: "day",
          step: 1,
          format: "%d",
          css: function (date) {
            if (date.getDay() == 0 || date.getDay() == 6) {
              return "day-item weekend weekend-border-bottom";
            } else {
              return "day-item";
            }
          }
        }
      ]
    },
    {
      name: "quarter",
      height: 60,
      min_column_width: 110,
      scales: [
        { unit: "month", step: 1, format: "%M" },
        {
          unit: "quarter",
          step: 1,
          format: function (date) {
            const yearStr = new Date(date).getFullYear() + "年";
            const dateToStr = gantt.date.date_to_str("%M");
            const endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
            return yearStr + dateToStr(date) + " - " + dateToStr(endDate);
          }
        },
        {
          unit: "week",
          step: 1,
          format: function (date) {
            const dateToStr = gantt.date.date_to_str("%m-%d");
            const endDate = gantt.date.add(date, 6, "day");
            const weekNum = gantt.date.date_to_str("%W")(date);
            return dateToStr(date) + " 至 " + dateToStr(endDate);
          }
        }
      ]
    },
    {
      name: "year",
      scale_height: 50,
      min_column_width: 150,
      scales: [
        { unit: "year", step: 1, format: "%Y年" },
        { unit: "month", format: "%Y-%m" }
      ]
    }
  ]
};

const formatData = {
  data: [
    { id: 1, text: "总部 #1", start_date: "2023-03-28", priority: 1, duration: 11, progress: 0.6, open: true },
    { id: 2, text: "分开 #1", start_date: "2023-04-02", priority: 2, duration: 8, parent: "1", progress: 0.5, open: true }
  ],
  links: [
    { id: "1", source: "1", target: "2", type: "1" },
    { id: "2", source: "2", target: "3", type: "0" }
  ]
};

onMounted(() => {
  initGantt();

  gantt.attachEvent("onTaskClick", (id, ev) => {
    const task = gantt.getTask(id);
    console.log("点击任务:", id, task);
  });
});

//初始化甘特图
const initGantt = () => {
  gantt.config.grid_width = 350;
  gantt.config.autoscroll = true; //添加符号
  gantt.config.add_column = false; //添加符号

  //时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
  gantt.config.autofit = false;
  gantt.config.row_height = 60;
  gantt.config.bar_height = 34;
  gantt.config.fit_tasks = true; //自动延长时间刻度，以适应所有显示的任务
  gantt.config.auto_types = true; //将包含子任务的任务转换为项目，将没有子任务的项目转换回任务
  gantt.config.xml_date = "%Y-%m-%d"; //甘特图时间数据格式
  gantt.config.readonly = false; //是否只读
  gantt.config.drag_project = true; // 允许拖放
  gantt.i18n.setLocale("cn"); //设置语言
  gantt.config.columns = columns; // 配置列名称
  gantt.config.show_empty_state = demoData.data?.length === 0 ? true : false; // 空数据
  // 自定义进度条上名称
  gantt.templates.task_text = (start, end, task) => {
    console.log("task", task);
    return "<b>任务:</b> " + task.text + ",<b> 进度:</b> " + task.progress;
  };

  gantt.templates.task_class = function (start, end, task) {
    return { 1: "high", 2: "medium", 3: "low" }[task.priority];
  };
  gantt.config.date_scale = "%m月%d日";

  gantt.plugins({
    export_api: true,
    click_drag: true,
    drag_timeline: true, // 拖动图
    marker: true, // 时间标记
    fullscreen: true, // 全屏
    tooltip: true, // 鼠标经过时信息
    undo: true // 允许撤销
  });

  nextTick(() => {
    gantt.init("gantt_here"); //初始化
    gantt.parse(demoData); //填充数据
    gantt.ext.zoom.init(zoomConfig); //配置初始化扩展
    gantt.ext.zoom.setLevel("month"); //切换到指定的缩放级别
    console.log("gantt", gantt);

    gantt.attachEvent("onAfterTaskDrag", function (id, mode) {
      const task = gantt.getTask(id);
      console.log("拖拽结束:", task);
      if (mode == gantt.config.drag_mode.progress) {
        const pr = Math.floor(task.progress * 100 * 10) / 10;
        gantt.message(task.text + " is now " + pr + "% completed!");
      } else {
        const convert = gantt.date.date_to_str("%H:%i, %F %j");
        const s = convert(task.start_date);
        const e = convert(task.end_date);
        gantt.message(task.text + " starts at " + s + " and ends at " + e);
      }
    });
  });
};

const changeTime = () => {
  const obj = {
    week: "第%w周",
    month: "%m月",
    quarter: "%Y-%M",
    year: "%Y年",
    day: "%m月%d日"
  };
  gantt.config.date_scale = obj[data.timeState];
  gantt.ext.zoom.setLevel(data.timeState);
};

// 撤销
const onUndo = () => {
  gantt.undo();
};
// 恢复
const onRedo = () => {
  gantt.redo();
};
// 缩小
const onZoomOut = () => {
  gantt.ext.zoom.zoomOut();
};
// 放大
const onZoomIn = () => {
  gantt.ext.zoom.zoomIn();
};
// 下载
const onDownload = () => {
  gantt.exportToPNG({
    name: "mygantt.png",
    locale: "cn",
    skin: "terrace",
    data: demoData.data,
    raw: true
  });
};

// 复制
const onCopy = () => {
  copyText(JSON.stringify(formatData));
};

// 查看数据格式
const onShowData = () => {
  addDialog({
    title: "甘特图数据格式",
    width: "800px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h("div", { style: { textAlign: "right", cursor: "pointer" } }, [
        h("div", { onClick: onCopy }, "复制内容"),
        h(VueJsonPretty, {
          data: formatData,
          showLine: true,
          showLineNumber: true,
          showDoubleQuotes: true,
          showLength: true,
          editable: true,
          showIcon: true,
          editableTrigger: "click"
        })
      ]),
    beforeSure: (done) => done()
  });
};
</script>
<style scoped lang="scss">
.my-gantt {
  height: 90%;
  width: 100%;
  .time-box {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :deep(.gantt-container) {
    width: 100%;
    height: 100%;
    .weekend {
      background: #ff9e2f;
      color: #fff;
    }
  }
}
</style>
