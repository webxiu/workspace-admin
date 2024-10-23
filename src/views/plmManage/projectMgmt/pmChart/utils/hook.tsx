import { BorderImgType, NumberTitle, ScrollTable } from "../DataScreen/component";
import type { NumTitleType } from "../DataScreen/component";
import { computed, h, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { GridItemType } from "../DataScreen/index";
import { message } from "@/utils/message";
import { v4 as uuidv4 } from "uuid";

import { fetchProjectMgmtAppChartData } from "@/api/plmManage";

export const useConfig = () => {
  const route = useRoute();
  const isFirstLoad = ref(false);
  const loading = ref(false);
  const dataList = ref<any[]>([]);
  const dataList2 = ref<any[]>([]);
  const dataList3 = ref<any[]>([]);
  // 定义主题
  const borderImg: BorderImgType = "borderImg";

  const colors = ["#00dd00", "#409EFF", "#ff5566", "#ff6600"];

  const columns: TableColumnList[] = [
    { label: "序号", prop: "seq", width: 50 },
    { label: "项目名称", prop: "projectName", minWidth: 140 },
    { label: "项目负责人", prop: "projectUserName", minWidth: 140 },
    { label: "计划结案日期", prop: "planEndDate", minWidth: 140 },
    { label: "剩余天数", prop: "redueDay", minWidth: 110 }
  ];
  const columns2: TableColumnList[] = [
    { label: "序号", prop: "seq", width: 50 },
    { label: "任务名称", prop: "name", minWidth: 140 },
    { label: "任务负责人", prop: "taskUserName", minWidth: 140 },
    // {
    //   label: "任务负责人",
    //   prop: "projectTaskResponsiblePersonnelVOList",
    //   cellRenderer(data) {
    //     if (data.row.projectTaskResponsiblePersonnelVOList) {
    //       const taskResUserName = data.row.projectTaskResponsiblePersonnelVOList[0]?.masterUserName;
    //       return <span>{taskResUserName}</span>;
    //     }
    //     return null;
    //   }
    // },
    { label: "所属项目", prop: "projectName", minWidth: 140 }
  ];
  const columns3: TableColumnList[] = [
    { label: "序号", prop: "seq", width: 50 },
    { label: "任务名称", prop: "name", minWidth: 140 },
    { label: "所属项目", prop: "projectName", minWidth: 140 },
    { label: "任务负责人", prop: "taskUserName", minWidth: 140 },
    // {
    //   label: "任务负责人",
    //   prop: "projectTaskResponsiblePersonnelVOList",
    //   cellRenderer(data) {
    //     if (data.row.projectTaskResponsiblePersonnelVOList) {
    //       const taskResUserName = data.row.projectTaskResponsiblePersonnelVOList[0]?.masterUserName;
    //       return <span>{taskResUserName}</span>;
    //     }
    //     return null;
    //   }
    // },
    { label: "计划完成日期", prop: "end", minWidth: 110 },
    { label: "项目负责人", prop: "projectUserName", minWidth: 110 },
    { label: "计划结案日期", prop: "projectPlanEndDate", minWidth: 110 },
    { label: "任务完成进度", prop: "progress", minWidth: 110 }
  ];
  const chartName = reactive({
    t5_m: "进行中的项目",
    t6: "进行中的任务",
    t7: "延期任务"
  });
  const chartName5 = ref(chartName.t5_m);
  const chartName6 = ref(chartName.t6);
  const chartName7 = ref(chartName.t7);

  const totalObj1 = ref<NumTitleType>({ number: 0, color: colors[1], title: "进行中的项目" });
  const totalObj2 = ref<NumTitleType>({ number: 0, color: colors[2], title: "延期的项目" });
  const totalObj3 = ref<NumTitleType>({ number: 0, color: colors[0], title: "进行中的任务" });
  const totalObj4 = ref<NumTitleType>({ number: 0, color: colors[3], title: "延期的任务" });

  watch(route, () => getData(true), { immediate: true });

  const mLoading = computed(() => (isFirstLoad.value ? false : loading.value));

  function getData(isFirst = false) {
    loading.value = true;

    setTimeout(() => {
      fetchProjectMgmtAppChartData({}).then((res: any) => {
        const data = res.data;
        loading.value = false;
        if (!data) return message("数据获取失败", { type: "error" });
        // 重置->数字动画
        totalObj1.value.number = 0;
        totalObj2.value.number = 0;
        totalObj3.value.number = 0;
        totalObj4.value.number = 0;

        // 6.滚动表格
        dataList.value = data.activeProjectInfoList.map((m, i) => ({ seq: i + 1, ...m, id: uuidv4() }));
        dataList2.value = data.activeProjectTaskList.map((m, i) => ({ seq: i + 1, ...m, id: uuidv4() }));
        dataList3.value = data.postPoneProjectTaskList.map((m, i) => ({ seq: i + 1, ...m, id: uuidv4() }));
        // 8.其他统计
        totalObj1.value.number = parseFloat(data.activeProjectCount);
        totalObj2.value.number = parseFloat(data.postPoneProjectCount);
        totalObj3.value.number = parseFloat(data.activeProjectTaskCount);
        totalObj4.value.number = parseFloat(data.postPoneProjectTaskCount);

        if (isFirst) isFirstLoad.value = true;
      });
    });
  }

  // 布局
  const gridConfig = reactive<GridItemType[]>([
    {
      gutter: 10,
      direction: "row",
      children: [
        {
          gutter: 10,
          // lg: 8,
          // md: 8,
          type: "row",
          direction: "row",
          children: [
            {
              span: 8,
              type: "row",
              direction: "row",
              style: { marginBottom: "10px", flex: 0.1, height: "80px" },
              children: [
                { span: 24, comp: h(NumberTitle, { data: totalObj1, borderImg, showTitle: false }) },
                { span: 24, comp: h(NumberTitle, { data: totalObj2, borderImg, showTitle: false, style: { marginLeft: "10px" } }) },
                { span: 24, comp: h(NumberTitle, { data: totalObj3, borderImg, showTitle: false, style: { marginLeft: "10px" } }) },
                { span: 24, comp: h(NumberTitle, { data: totalObj4, borderImg, showTitle: false, style: { marginLeft: "10px" } }) }
              ]
            },
            {
              span: 24,
              type: "row",
              direction: "row",
              style: { marginBottom: "10px", flex: 1 },
              children: [
                {
                  span: 12,
                  // style: { flex: 1 },
                  comp: h(ScrollTable, {
                    columns,
                    dataList,
                    borderImg,
                    loading: mLoading,
                    title: chartName5,
                    style: { flex: 1 }
                  })
                },
                {
                  span: 12,
                  style: { flex: 1 },
                  comp: h(ScrollTable, {
                    columns: columns2,
                    dataList: dataList2,
                    // dataList: dataList,
                    borderImg,
                    loading: mLoading,
                    title: chartName6,
                    style: { flex: 1, marginLeft: "10px" }
                  })
                }
              ]
            },
            {
              span: 24,
              type: "row",
              direction: "row",
              style: { flex: 1 },
              comp: h(ScrollTable, {
                columns: columns3,
                dataList: dataList3,
                borderImg,
                loading: mLoading,
                title: chartName7,
                style: { flex: 1 }
              })
            }
          ]
        }
      ]
    }
  ]);

  const onRefresh = () => getData();

  return { loading, gridConfig, onRefresh };
};
