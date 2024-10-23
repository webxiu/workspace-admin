/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 11:01:09
 */

import {
  CheckRecordItemType,
  MaterialItemType,
  OperateBookStationItemType,
  ToolParamItemType,
  addEsopStation,
  deleteEsopStation,
  esopStationList,
  sortEsopStation,
  updateEsopStation
} from "@/api/oaManage/productMkCenter";
import { MessageBox, Printer } from "@element-plus/icons-vue";
import { OptionsType, getEnumDictList, setColumn, tableEditRender } from "@/utils/table";
import { h, nextTick, onMounted, reactive, ref, watch } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { onBeforeRouteLeave, useRoute } from "vue-router";

import ChildMaterialModal from "../component/ChildMaterialModal.vue";
import DeptModal from "../component/DeptModal.vue";
import { ImageItemType } from "../component/AddForm/index.vue";
import { OptionItemType } from "@/api/plmManage";
import { PAGE_CONFIG } from "@/config/constant";
import Print from "../print.vue";
import { Question } from "@/config/elements";
import RegInput from "@/components/RegInput.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { deepEqual } from "@/utils/common";
import { useEleHeight } from "@/hooks";
import { v4 as uuidv4 } from "uuid";

export enum ImgEvent {
  "add" = "add",
  "delete" = "delete",
  "sort" = "sort",
  "upload" = "upload"
}
type MulHandleType = "sort" | "material" | "check" | "tool";
const getEmptyRow = (dataList: OperateBookStationItemType[]) => {
  const lastRow = dataList[dataList.length - 1] || ({} as OperateBookStationItemType);
  return {
    isNew: true,
    capacity: lastRow.capacity || 0,
    pid: "",
    stationNo: `D0${dataList.length + 1}`,
    workContent: "",
    workerCount: lastRow.workerCount || 1,
    id: uuidv4(),
    manHour: lastRow.manHour || 0,
    materialVOS: [],
    checkRuleVOS: [],
    jobEngineeringVOS: [],
    contentVO: { id: uuidv4(), jobContent: "", precautions: "", withToolFixture: "", workStationId: "" }
  };
};

export const useConfig = () => {
  const tableRef = ref();
  const toolIndex = ref(0);
  const route = useRoute();
  const loading = ref<boolean>(false);
  const rowData = ref<OperateBookStationItemType>();
  const rowData2 = ref<MaterialItemType>();
  const rowData3 = ref<CheckRecordItemType>();
  const rowData4 = ref<ToolParamItemType>();
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const columns4 = ref<TableColumnList[]>([]);
  const dataList = ref<OperateBookStationItemType[]>([]);
  const dataListTemp = ref<OperateBookStationItemType[]>([]);
  const materialList = ref<OptionItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50);
  const formData = reactive({ page: 1, id: "", limit: PAGE_CONFIG.pageSize });

  onMounted(() => {
    getOption();
    getColumnConfig();
  });

  onBeforeRouteLeave((to, from, next) => {
    const index = dataList.value.findIndex((f) => f.id === rowData.value?.id);
    const isEqual = deepEqual(dataList.value[index], dataListTemp.value[index]);
    if (isEqual) return next();
    showMessageBox(`您当前编辑的【序号${index + 1}】下有内容未保存, 离开当前页面<br />数据将不会保存, 确定要离开吗?`)
      .then(() => next())
      .catch((err) => {
        if (err === "cancel") return next();
        next(false);
      });
  });

  watch(
    route,
    (val) => {
      formData.id = val.query.materialId as string;
      getTableList();
    },
    { immediate: true }
  );

  function getOption() {
    getEnumDictList(["MaterialUnits"]).then((res) => (materialList.value = res.MaterialUnits));
  }

  // 编辑表格(使用)
  const editTable1 = tableEditRender();
  const editTable2 = tableEditRender({
    customRender: ({ editMap, index, row, column, callback }) => {
      const isEdit = editMap.value[index]?.editable;
      const colIndex = editMap.value[index]?.colIndex;
      if (isEdit) {
        if (["materialNumber"].includes(column.property)) {
          if (colIndex === column.rawColumnKey) {
            const onMaterialChange = (data) => {
              if (typeof data === "object") {
                row["materialId"] = data.id;
                row["materialName"] = data.name;
                row["materialNumber"] = data.number;
                row["specification"] = data.specification;
              } else {
                row["materialId"] = null;
                row["materialNumber"] = data;
              }
              callback({ index });
            };
            return (
              <ChildMaterialModal
                v-model={row[column.property]}
                materialId={row["materialId"]}
                id={formData.id}
                onChange={onMaterialChange}
                onBlur={() => callback({ index })}
              />
            );
          }
        } else if (["unit"].includes(column.property)) {
          if (colIndex === column.rawColumnKey) {
            return (
              <el-select
                v-model={row[column.property]}
                size="small"
                clearable
                placeholder="请选择"
                onChange={() => callback({ index })}
                onBlur={() => callback({ index })}
              >
                {materialList.value.map((item) => (
                  <el-option key={item.optionValue} label={item.optionName} value={item.optionName} />
                ))}
              </el-select>
            );
          }
        } else if (colIndex === column.rawColumnKey) {
          return <RegInput v-model={row[column.columnKey]} autoFocus={true} autoSelect={true} onBlur={() => callback({ index })} />;
        }
      }
      return <span>{row[column.columnKey]}</span>;
    }
  });
  const editTable3 = tableEditRender({
    customRender: ({ editMap, index, prop, row, column, callback }) => {
      const isEdit = editMap.value[index]?.editable;
      const colIndex = editMap.value[index]?.colIndex;
      if (isEdit) {
        if (["deptName"].includes(column.property)) {
          if (colIndex === column.rawColumnKey) {
            const onDeptChange = (data) => {
              row[column.property] = data.name;
              row["deptId"] = data.id;
              callback({ index });
            };
            return <DeptModal v-model={row[column.property]} onChange={onDeptChange} onBlur={() => callback({ index })} />;
          }
        } else if (colIndex === column.rawColumnKey) {
          return <RegInput v-model={row[column.columnKey]} autoFocus={true} autoSelect={true} onBlur={() => callback({ index })} />;
        }
      }
      return <span>{row[column.columnKey]}</span>;
    }
  });
  const editTable4 = tableEditRender();

  const getColumnConfig = async () => {
    const columnData: TableColumnList[] = [
      {
        label: "排拉序号",
        prop: "stationNo",
        minWidth: 90,
        headerRenderer: ({ column }) => (
          <>
            <span>{column.label}</span>
            <el-tooltip placement="top" content={"排位序号以D开头命名 (可拖拽排序)"}>
              <Question />
            </el-tooltip>
          </>
        )
      },
      { label: "作业内容", prop: "workContent", minWidth: 180 },
      { label: "人数(人)", prop: "workerCount", align: "center", minWidth: 70 },
      { label: "S/T(秒)", prop: "manHour", align: "center", minWidth: 70 },
      { label: "产能(PCS)", prop: "capacity", align: "center", minWidth: 80 }
    ];
    const columnData2: TableColumnList[] = [
      {
        label: "物料编号",
        prop: "materialNumber",
        minWidth: 160,
        headerRenderer: ({ column }) => (
          <>
            {column.label}
            <el-tooltip placement="top" effect="light" content="选择物料编号, 会自动补充物料名称和规格">
              <Question />
            </el-tooltip>
          </>
        )
      },
      { label: "物料名称", prop: "materialName", minWidth: 100 },
      { label: "物料规格描述", prop: "specification", minWidth: 140 },
      { label: "用量", prop: "qty", align: "center", width: 55 },
      { label: "单位", prop: "unit", align: "center", width: 55 }
    ];
    const columnData3: TableColumnList[] = [
      { label: "确认项目", prop: "confirm" },
      { label: "确认频率/数量", prop: "confirmFrequency", align: "center", minWidth: 110 },
      { label: "确认部门", prop: "deptName", minWidth: 100 },
      { label: "管理方法", prop: "manageMethod", minWidth: 160 }
    ];
    const columnData4: TableColumnList[] = [
      { label: "工具", prop: "tool" },
      { label: "数量", prop: "quantity", align: "center", minWidth: 55 },
      { label: "标准设定参数", prop: "standardParam" }
    ];

    columnData.forEach((item) => (item.cellRenderer = (data) => editTable1.editCellRender({ data })));
    columnData2.forEach((item) => (item.cellRenderer = (data) => editTable2.editCellRender({ data })));
    columnData3.forEach((item) => (item.cellRenderer = (data) => editTable3.editCellRender({ data })));
    columnData4.forEach((item) => (item.cellRenderer = (data) => editTable4.editCellRender({ data })));

    columns.value = setColumn(
      {
        columnData: columnData,
        isDragRow: true,
        dragSelector: ".position-table",
        dataList,
        operationColumn: { hide: true }
      },
      onUpdateIndex
    );
    columns2.value = setColumn({ columnData: columnData2, operationColumn: { hide: true } });
    columns3.value = setColumn({ columnData: columnData3, operationColumn: { hide: true }, indexColumn: { width: 46 } });
    columns4.value = setColumn({ columnData: columnData4, operationColumn: { hide: true }, indexColumn: { width: 46 } });
  };

  function onUpdateIndex() {
    if (rowData.value) {
      const index = dataList.value.findIndex((f) => f.id === rowData.value.id);
      const isEqual = deepEqual(dataList.value[index], dataListTemp.value[index]);
      if (!isEqual) {
        showMessageBox(`您当前编辑的【序号${index + 1}】下有内容未保存, 请先保存再操作!`, {
          showCancelButton: false
        }).then(() => {});
        return;
      }
    }

    const workStationDTOs = dataList.value.map((item, i) => ({
      ...item,
      sort: i + 1,
      isNew: undefined,
      id: item.isNew ? undefined : item.id
    }));
    // 提交排序
    sortEsopStation({ id: formData.id, workStationDTOs }).then(({ data }) => {
      if (!data) return message("排序失败", { type: "error" });
      message("排序成功", { type: "success" });
      getTableList();
    });
  }

  function getTableList() {
    if (!formData.id) return;
    loading.value = true;
    esopStationList(formData)
      .then(({ data = [] }) => {
        loading.value = false;
        dataList.value = data;
        dataListTemp.value = cloneDeep(data);
        let activeRow = data[0];
        if (rowData.value) {
          activeRow = dataList.value.find((f) => f.id === rowData.value?.id);
        }
        rowData.value = activeRow;
        tableRef.value?.getTableRef().setCurrentRow(activeRow);
      })
      .catch(() => (loading.value = false));
  }

  function onRefresh() {
    getTableList();
  }

  function onAdd(type: MulHandleType) {
    if (type !== "sort") {
      if (!rowData.value) return message("请先选择排位", { type: "error" });
    }
    if (type === "sort") {
      dataList.value.push(getEmptyRow(dataList.value));
    }
    if (type === "material") {
      if (rowData.value.materialVOS.length >= 5) {
        return message("最多添加5条物料", { type: "error" });
      }
      rowData.value.materialVOS.push({
        id: uuidv4(),
        materialId: 0,
        materialName: "",
        materialNumber: "",
        specification: "",
        qty: 0,
        workStationId: rowData.value.id,
        unit: "",
        isNew: true
      });
    }
    if (type === "check") {
      if (rowData.value.checkRuleVOS.length >= 2) {
        return message("最多添加2条检测记录", { type: "error" });
      }
      rowData.value.checkRuleVOS.push({
        id: uuidv4(),
        confirm: "",
        confirmFrequency: "",
        deptId: 0,
        deptName: "",
        manageMethod: "",
        toolParametersVOS: [],
        workStationId: rowData.value.id,
        isNew: true
      });
    }
    if (type === "tool") {
      const toolLimit = 2;
      if (!rowData3.value) return message("请先选择检测记录再添加", { type: "error" });
      if (rowData.value.checkRuleVOS[toolIndex.value]?.toolParametersVOS.length >= toolLimit) {
        return message(`最多添加${toolLimit}条工具参数`, { type: "error" });
      }
      rowData.value.checkRuleVOS[toolIndex.value]?.toolParametersVOS.push({
        id: uuidv4(),
        quantity: 0,
        checkRuleId: rowData.value.id,
        standardParam: "",
        tool: "",
        isNew: true
      });
    }
  }

  function onDelete(type: MulHandleType) {
    const _rowData = { sort: rowData.value, material: rowData2.value, check: rowData3.value, tool: rowData4.value }[type];
    const _msg = { sort: "请选择要删除的排位", material: "请选择要删除的物料", check: "请选择要删除的检测记录", tool: "请选择要删除的工具参数" }[type];
    if (!_rowData) {
      return message(_msg, { type: "error" });
    }

    const _title = { sort: "排位", material: "物料", check: "检测记录", tool: "工具参数" }[type];
    const _tip = {
      sort: "删除该排位会将该排位下的物料、检测记录和工具参数全部删除",
      material: "",
      check: "删除该检测记录会将该记录下的工具参数全部删除",
      tool: ""
    }[type];

    showMessageBox(`确认要删除选中${_title}吗? ${_tip}`).then(() => {
      if (type === "sort") {
        if (!rowData.value) return message("请选择排位", { type: "error" });
        dataList.value = dataList.value.filter((f) => f.id !== rowData.value.id);
        if (rowData.value.id && !rowData.value.isNew) {
          onDeleteSortList(rowData.value.id);
        }
      }
      if (type === "material") {
        if (!rowData2.value) return message("请选择物料", { type: "error" });
        rowData.value.materialVOS = rowData.value.materialVOS.filter((f) => f.id !== rowData2.value.id);
      }
      if (type === "check") {
        if (!rowData3.value) return message("请选择检测记录", { type: "error" });
        rowData.value.checkRuleVOS[toolIndex.value].toolParametersVOS = [];
        rowData.value.checkRuleVOS = rowData.value.checkRuleVOS.filter((f) => f.id !== rowData3.value.id);
        rowData3.value = null;
      }
      if (type === "tool") {
        if (!rowData4.value) return message("请选择工具参数", { type: "error" });
        rowData.value.checkRuleVOS[toolIndex.value].toolParametersVOS = rowData.value.checkRuleVOS[toolIndex.value]?.toolParametersVOS.filter(
          (f) => f.id !== rowData4.value.id
        );
      }
    });
  }

  function onDeleteSortList(id) {
    deleteEsopStation({ id }).then(({ data }) => {
      if (!data) return message("删除失败", { type: "error" });
      message("删除成功", { type: "success" });
      getTableList();
    });
  }

  const onRowClick = (type: "sort" | "material" | "check" | "tool", row: OperateBookStationItemType) => {
    const lastIndex = dataList.value.findIndex((f) => f.id === rowData.value?.id);
    const curIndex = dataList.value.findIndex((f) => f.id === row.id);
    const isEqual = deepEqual(dataList.value[lastIndex], dataListTemp.value[lastIndex]);
    const changeRowFn = () => {
      // 根据类型记录选中的项
      const _rowData = { sort: rowData, material: rowData2, check: rowData3, tool: rowData4 }[type];
      _rowData.value = row;

      // 选择排位表时, 记录行数据
      if (type === "sort") {
        toolIndex.value = 0;
        rowData.value = row;
      }
      // 选择检测表时候, 记录选中索引
      if (type === "check") {
        toolIndex.value = rowData.value.checkRuleVOS.findIndex((f) => f.id === row.id);
      }
    };

    // 排位表切换拦截
    if (type === "sort" && !isEqual && lastIndex !== curIndex) {
      const changeMsg = `排位表【序号${lastIndex + 1}】下有内容编辑未保存, 数据易丢失<br />确定要切换到【序号${curIndex + 1}】吗?`;
      showMessageBox(changeMsg, { closeOnClickModal: false })
        .then(() => changeRowFn())
        .catch(console.log);
      return;
    }
    changeRowFn();
  };

  /**
   * 图片操作
   * @param type add or delete
   * @param item 数据项
   */
  function onHandleImg(type: ImgEvent, { data, imageList }) {
    dataList.value.forEach((f) => {
      if (f.id === rowData.value?.id) {
        // 更新图片列表
        const updateImageList = () => {
          imageList.forEach((item) => {
            const mIndex = f.jobEngineeringVOS.findIndex((f) => f.id === item.id || item.isNew);
            if (mIndex > -1) {
              f.jobEngineeringVOS[mIndex].description = item.description;
              if (item?.file && item?.file[0]?.raw) {
                f.jobEngineeringVOS[mIndex].file = item.file;
                f.jobEngineeringVOS[mIndex].tempPath = item.tempPath;
              }
            }
          });
        };

        if (type === ImgEvent.add) {
          f.jobEngineeringVOS.push(data);
        } else if (type === ImgEvent.delete) {
          const sIndex = f.jobEngineeringVOS.findIndex((f) => data.id === f.id || data.isNew);
          f.jobEngineeringVOS.splice(sIndex, 1);
        } else if (type === ImgEvent.sort) {
          const { newIndex, oldIndex } = data;
          const oItem = f.jobEngineeringVOS.splice(oldIndex, 1)[0];
          f.jobEngineeringVOS.splice(newIndex, 0, oItem);
          f.jobEngineeringVOS.forEach((f, index) => (f.sort = index + 1));
          updateImageList();
        } else if (type === ImgEvent.upload) {
          updateImageList();
        }
      }
    });
  }

  /** 作业内容修改实时回调 */
  function onWorkChange(data: ImageItemType) {
    const { withToolFixture, jobContent, precautions, imgList } = data;
    // 将数据更新到排序表行数据中(待完成)
    if (rowData.value?.id) {
      dataList.value.forEach((f) => {
        if (f.id === rowData.value.id) {
          // 缓存到排位表中
          if (jobContent) f.contentVO.jobContent = jobContent;
          if (precautions) f.contentVO.precautions = precautions;
          if (withToolFixture) f.contentVO.withToolFixture = withToolFixture;
        }
      });
    }
  }

  async function onSave() {
    if (dataList.value.length === 0) {
      return message("请先添加排位", { type: "error" });
    }
    await nextTick();

    // 获取排位表选中行最新数据
    const newRowData = dataList.value.find((f) => f.id === rowData.value?.id) || ({} as any);
    const { materialVOS, checkRuleVOS, jobEngineeringVOS, contentVO, isNew, id, ...reset } = newRowData;
    const workStationId = isNew ? undefined : id;
    const fd = new FormData();

    // 物料
    const materialDTOS = materialVOS.map((f) => {
      const { isNew, id, ...reset } = f;
      return { id: isNew ? undefined : id, ...reset, workStationId: workStationId };
    });
    // 检测规则
    const checkRuleDTOS = checkRuleVOS.map((f) => {
      const { isNew, id, toolParametersVOS, ...reset } = f;
      const toolParametersDTOS = toolParametersVOS?.map((f2) => {
        const { isNew, id, ...reset2 } = f2;
        return { ...reset2, id: f2.isNew ? undefined : f2.id, checkRuleId: f.id };
      });
      return { ...reset, toolParametersDTOS, id: isNew ? undefined : id, workStationId: workStationId };
    });

    // 图片上传
    const imageList = jobEngineeringVOS.map((img, index) => {
      const file = img.file;
      if (file?.length && file[0].raw) {
        fd.append("files", file[0].raw);
        fd.append("index", `${index}`);
      }
      return {
        sort: index + 1,
        id: img.isNew ? "" : img.id,
        description: img.description,
        workStationId: workStationId
      };
    });

    const workStation = {
      ...reset,
      contentDTO: {
        ...contentVO,
        id: workStationId ? contentVO?.id : undefined,
        workStationId: workStationId
      },
      id: workStationId,
      materialDTOS: materialDTOS,
      checkRuleDTOS: checkRuleDTOS,
      jobEngineeringDTOS: imageList
    };

    const param = {
      page: 0,
      limit: 0,
      billNo: "",
      billState: 0,
      materialId: 0,
      manualName: "",
      id: formData.id,
      workStationDTOs: [workStation]
    };

    fd.append("param", JSON.stringify(param));
    const title = workStationId ? "修改" : "新增";
    const reqApi = workStationId ? updateEsopStation : addEsopStation;
    showMessageBox(`确认保存作业【${newRowData.workContent}】${title}内容吗?`).then(() => {
      reqApi(fd).then(({ data }) => {
        if (!data) return message(`${title}失败`, { type: "error" });
        message(`${title}成功`, { type: "success" });
        getTableList();
      });
    });
  }

  function onPrint() {
    if (!rowData.value) {
      return message("请选择一条排位表数据", { type: "error" });
    }
    const formRef = ref();
    const pageIndex = dataList.value.findIndex((f) => f.id === rowData.value?.id);
    addDialog({
      title: "打印指导书",
      props: {
        materialId: formData.id,
        itemInfo: rowData.value,
        pageIndex: pageIndex + 1,
        totalPage: dataList.value.length
      },
      width: "80%",
      class: "sop-print",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      cancelButtonText: "关闭",
      okButtonText: "打印",
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: () => formRef.value.onPrint()
    });
  }

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onSave, type: "primary", text: "保存", icon: MessageBox, isDropDown: false },
    { clickHandler: onPrint, type: "success", text: "预览", icon: Printer, isDropDown: false }
  ]);

  return {
    tableRef,
    loading,
    rowData,
    columns,
    columns2,
    columns3,
    columns4,
    dataList,
    toolIndex,
    maxHeight,
    buttonList2,
    onAdd,
    onDelete,
    onRefresh,
    onRowClick,
    onHandleImg,
    onWorkChange
  };
};
