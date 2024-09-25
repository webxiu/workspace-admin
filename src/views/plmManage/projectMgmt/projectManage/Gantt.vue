<!-- /*
 * @Author: Hailen
 * @Date: 2024-02-27 10:47:51
 * @Last Modified by:   Hailen
 * @Last Modified time: 2024-02-27 10:47:51
 */ -->
<template>
  <section class="my-gantt" v-loading="loading">
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
        <el-button :icon="Download" title="下载" @click="onDownloadGantt" />
      </div>
    </div>
    <div id="gantt_here" class="gantt-container" />
  </section>
</template>

<script lang="tsx" setup>
import { h, reactive, nextTick, ref, onMounted, onUnmounted } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import html2canvas from "html2canvas";
import { addDialog } from "@/components/ReDialog";
import { gantt, GridColumn, ZoomLevels, Task } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { copyText, onDownload, base64ToBlob } from "@/utils/common";
import { ZoomOut, ZoomIn, Download, RefreshRight, RefreshLeft } from "@element-plus/icons-vue";
import dayjs from "dayjs";

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

const loading = ref(false);

const setGanttRefData = (data) => {
  if (data.ganttChartVO) {
    console.log(JSON.parse(JSON.stringify(data.ganttChartVO)), "甘特图数据");

    const taskAllList = data.projectTaskGroupVoList
      ?.map((item) => item.taskVOList)
      .flat(Infinity)
      .sort((a, b) => a.sort - b.sort);

    const demoDataResult = taskAllList.map((item) => ({
      id: item.id,
      parent: item.groupId,
      text: item.name,
      start_date: item.start,
      priority: item.priority,
      duration: item.duration,
      progress: item.progress,
      open: true
    }));
    console.log(demoDataResult, "task list..");

    demoData.data = [...data.ganttChartVO.groups.map((item) => ({ ...item, hide_bar: true })), ...demoDataResult].map((item) => {
      item.start_date = item.start_date ?? new Date();
      return item;
    });
    demoData.links = data.ganttChartVO?.links;
    initGantt();
  }
};

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
    parent:   任务分组id
    progress: 滑块的进度
    open:     是否展开显示
   */
  ],
  links: [
    /**
     * @item
      source:资源id
      target:目标id
		  type: 连接类型,项目中只用0
        0--进行-开始  `尾部链接头部`
				1--开始-开始	`头部链接头部`
				2--进行-进行	`尾部链接尾部`
				3--开始-进行	`头部链接尾部`
     */
  ]
};

const columns: GridColumn[] = [
  { name: "text", label: "任务名称", tree: true, min_width: 200, resize: true },
  {
    name: "start_date",
    label: "开始时间",
    align: "center",
    width: 80,
    template(task) {
      const isGroup = task.parent === "0";
      return isGroup ? null : new Date(dayjs(task.start_date).format("YYYY-MM-DD"));
    }
  },
  {
    name: "end_date",
    label: "结束时间",
    align: "center",
    width: 80,
    template(task) {
      const isGroup = task.parent === "0";
      /**
       * 减一天是因为甘特图的duration和end_date不能同时存在。所以不能使用后端返回的end_date,需要用算出来的end_date - 1
       */
      return isGroup ? null : new Date(dayjs(task.end_date).add(-1, "days").format("YYYY-MM-DD"));
    }
  },
  {
    name: "progress",
    label: "进度",
    align: "center",
    width: 60,
    template: (obj) => {
      return `${obj.parent == "0" ? "" : obj.progress + "%"}`;
    }
  }
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
  gantt.config.autofit = false; // 时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
  gantt.config.row_height = 60;
  gantt.config.bar_height = 34;
  gantt.config.fit_tasks = true; // 自动延长时间刻度，以适应所有显示的任务
  gantt.config.auto_types = true; // 将包含子任务的任务转换为项目，将没有子任务的项目转换回任务
  gantt.config.xml_date = "%Y-%m-%d"; // 甘特图时间数据格式
  gantt.config.readonly = true; // 是否只读
  gantt.config.drag_project = true; // 允许拖放
  gantt.i18n.setLocale("cn"); // 设置语言
  gantt.config.columns = columns; // 配置列名称
  gantt.config.show_empty_state = demoData.data?.length === 0 ? true : false; // 空数据

  // 自定义进度条上名称
  gantt.templates.task_text = (start, end, task) => {
    // console.log("task", task);
    return `<b> 进度: ${task.progress}%</b> `;
  };
  // 自定义鼠标悬浮内容
  gantt.templates.tooltip_text = function (start, end, task) {
    return `<b> 任务名称: </b>${task.text} <br /><b> 开始日期: </b>${dayjs(start).format("YYYY-MM-DD")} <br /><b>结束日期: </b>${dayjs(end)
      .add(-1, "day")
      .format("YYYY-MM-DD")}`;
  };
  // 添加类名
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
        const pr = Math.floor(task.progress * 10) / 10;
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
const onDownloadGantt = () => {
  const ganttHere: HTMLDivElement = document.querySelector("#gantt_here");
  const ganttTaskBg: HTMLDivElement = document.querySelector("#gantt_here .gantt_task_bg");
  const originHeight = ganttHere.offsetHeight;
  ganttHere.style.height = ganttTaskBg.offsetHeight + 60 + "px";
  ganttHere.style.minWidth = "1500px";
  const timer = setTimeout(() => {
    const ganttDom: HTMLDivElement = document.querySelector("#gantt_here");
    html2canvas(ganttDom, { useCORS: true }).then((canvas: HTMLCanvasElement) => {
      const imageData = canvas.toDataURL("image/png");
      onDownload(base64ToBlob(imageData, "image/png"), "甘特图");
      ganttDom.style.height = originHeight + "px";
      ganttDom.style.minWidth = "auto";
      clearTimeout(timer);
    });
  }, 1000);
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

onUnmounted(() => {
  gantt.clearAll();
});

defineExpose({ setGanttRefData, loading });
</script>
<style scoped lang="scss">
.my-gantt {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  padding-top: 52px;

  .time-box {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
  }

  :deep(.gantt-container) {
    width: 100%;
    height: 100%;

    .weekend {
      color: #fff;
      background: #ff9e2f;
    }
  }
}
</style>
