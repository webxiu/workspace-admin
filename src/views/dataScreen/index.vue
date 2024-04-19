<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="tsx">
import { onMounted, reactive, ref, h, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataScreen, { GridItemType } from "@/components/DataScreen/index";
import { optionLine, optionPie, optionProcess, ProcessItemType, optionLineArea, optionWave } from "./utils/config";
import { computed } from "vue";

defineOptions({ name: "BusinessCenterDataScreenIndex" });

const route = useRoute();
const router = useRouter();
const loading = ref(false);

onMounted(() => {
  getData();
});

watch(route, getData);

function getData() {
  // X轴1-12月份坐标
  const xAxis = Array.from(new Array(6)).map((_, i) => `${i + 1}月`);
  const data = [
    { name: "Mon", value: 230 },
    { name: "Tue", value: 224 },
    { name: "Wed", value: 218 },
    { name: "Thu", value: 135 },
    { name: "Fri", value: 147 },
    { name: "Sat", value: 260 }
  ];
  const data2 = [
    { name: "直发器", value: 52.04 },
    { name: "卷发器", value: 34.6 },
    { name: "电热梳", value: 6.56 },
    { name: "干燥机", value: 3.04 },
    { name: "其他", value: "3.76" }
  ];

  const data3: ProcessItemType[] = [
    { value: 79999, name: "峨眉山", percentage: "80%", maxValue: 80000 },
    { value: 59999, name: "稻城亚丁", percentage: "60%", maxValue: 60000 },
    { value: 49999, name: "九寨沟", percentage: "50%", maxValue: 56000 },
    { value: 39999, name: "万里长城", percentage: "40%", maxValue: 41001 },
    { value: 29999, name: "北京故宫", percentage: "30%", maxValue: 37102 }
  ];
  const data4 = [
    { name: "xxx", value: 0.2 },
    { name: "22", value: 0.4 },
    { name: "dd", value: 0.6 },
    { name: "11", value: 0.9 }
  ];
  loading.value = true;
  setTimeout(() => {
    optionLine({ selector: ".s_line", text: "线图", type: "line", xAxis: xAxis, data: data });
    optionLine({ selector: ".s_bar", text: "柱状图", type: "bar", xAxis: xAxis, data: data });
    optionPie({ selector: ".s_pie", text: "饼图", type: "pie", data: data2 });
    optionLineArea({ selector: ".s_line_area", text: "访问量", type: "bar", data: data3 });
    optionProcess({ selector: ".s_process", text: "进度条", type: "bar", data: data3 });
    optionWave({ selector: ".s_wave", text: "预约量", type: "bar", data: data4 });
    loading.value = false;
  }, 1000);
}

function onClick() {
  router.push("/menuPanel?menuCode=44&from=/businessCenter");
}

const rendCell = (title) => (
  <div class="bigScreen">
    <span>{title}</span>
    <el-button link type="primary" onClick={onClick}>
      --返回
    </el-button>
  </div>
);

// 布局1
const layoutConfig1 = reactive<GridItemType[]>([
  {
    gutter: 10,
    direction: "row",
    children: [
      {
        gutter: 10,
        type: "row",
        direction: "row",
        children: [
          { span: 24, comp: h("div", { class: "s_line bigScreen", style: { marginBottom: "10px" } }, "左侧1") },
          { span: 24, comp: h("div", { class: "s_bar bigScreen" }, "左侧2") }
        ]
      },
      {
        gutter: 10,
        type: "row",
        direction: "row",
        children: [
          {
            span: 8,
            gutter: 10,
            type: "row",
            direction: "row",
            style: { marginBottom: "10px" },
            children: [
              { span: 8, comp: rendCell("中-1") },
              { span: 8, comp: h("div", { class: "s_wave bigScreen", style: { marginBottom: "10px" } }, "中间") },
              { span: 8, comp: rendCell("中-3") }
            ]
          },
          {
            span: 24,
            type: "row",
            gutter: 10,
            direction: "row",
            comp: h("div", { class: "s_pie bigScreen", style: { marginBottom: "10px" } }, "中间")
          },
          { span: 24, type: "row", gutter: 10, direction: "row", comp: h("div", { class: "s_process bigScreen", style: { height: "500px" } }, "底部") }
        ]
      },
      {
        gutter: 10,
        type: "row",
        direction: "row",
        children: [
          { span: 24, comp: h("div", { class: "s_line_area bigScreen", style: { marginBottom: "10px" } }, "右-1") },
          { span: 24, comp: rendCell("右-2") }
        ]
      }
    ]
  }
]);

// 布局2
const layoutConfig2 = reactive<GridItemType[]>([
  {
    gutter: 10,
    direction: "column",
    children: [
      {
        span: 24,
        style: { marginBottom: "10px", flexDirection: "row" },
        type: "col",
        children: [
          {
            gutter: 10,
            type: "row",
            direction: "column",
            children: [
              { span: 24, style: { margin: "0 10px 10px 0" }, comp: h("div", { class: "s_line bigScreen" }, "左侧1") },
              { span: 24, style: { flex: 0.7, marginRight: "10px" }, comp: h("div", { class: "s_bar bigScreen" }, "左侧2") }
            ]
          },
          {
            span: 24,
            gutter: 10,
            type: "col",
            direction: "column",
            children: [
              { span: 24, style: { marginBottom: "10px" }, comp: rendCell("中-7") },
              { span: 24, style: { marginBottom: "10px" }, comp: rendCell("中-24") },
              { span: 24, comp: h("div", { class: "s_wave bigScreen" }, "中-14") }
            ]
          },
          {
            gutter: 10,
            type: "row",
            direction: "column",
            children: [
              { span: 24, style: { margin: "0 0 10px 10px" }, comp: h("div", { class: "s_pie bigScreen", style: { height: "500px" } }, "中间") },
              { span: 24, style: { marginLeft: "10px" }, comp: h("div", { class: "s_process bigScreen", style: { height: "500px" } }, "66") }
            ]
          }
        ]
      },
      { span: 24, style: { marginBottom: "10px", flex: 0.3 }, comp: h("div", { class: "s_line_area bigScreen", style: { height: "500px" } }, "右-1") }
    ]
  }
]);

const gridConfig = computed(() => {
  const type = route.query.type as string;
  return { 1: layoutConfig1, 2: layoutConfig2 }[type || 1];
});
</script>

<template>
  <DataScreen :loading="loading" :gridConfig="gridConfig" />
</template>
