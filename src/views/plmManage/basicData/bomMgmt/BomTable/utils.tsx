/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 10:58:13
 */

import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { fetchBomDetailData, getBOMTableRowSelectOptions, selectMaterialInfo } from "@/api/plmManage";
import { h, onMounted, reactive, ref } from "vue";
import { moveTableRow, setColumn, tableEditRender } from "@/utils/table";
import { useRoute, useRouter } from "vue-router";

import ImportExcelModal from "../importExcelModal.vue";
import { addDialog } from "@/components/ReDialog";
import { getUserInfo } from "@/utils/storage";
import { message } from "@/utils/message";
import { read } from "xlsx";
import { useMaterialTable } from "../components/selectMaterialConfig";
import { useUserStore } from "@/store/modules/user";
import { v4 as uuidv4 } from "uuid";

export function useConfig(emits) {
  const loading = ref<boolean>(false);
  const dataList = ref<any[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const maxHeight = ref("56vh");
  const route = useRoute();
  const router = useRouter();
  const rowData = ref();
  const upload_file = ref("");
  const allChars = ref([]);
  const nowDay = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const userStore = useUserStore();

  const itemUnitOptions: any = ref([]);
  const dosageTypeOptions: any = ref([]);
  const issueTypeOptions: any = ref([]);

  const formData = reactive({
    materialNumber: "",
    materialName: "",
    materialId: "",
    specification: "",
    number: "",
    groupId: "",
    createUserName: userStore.userInfo.userName,
    createDate: nowDay,
    modifyUserName: "",
    remark: "",
    modifyDate: "",
    name: "",
    id: ""
  });

  const { handleSelectAction } = useMaterialTable();

  onMounted(() => {
    getBomBasicInfo();
    getColumnConfig();
    getTableList();
  });

  // 基本信息
  const getBomBasicInfo = () => {
    getBOMTableRowSelectOptions({ optioncode: "MaterialUnits,IssueType,DosageType" }).then((res: any) => {
      if (res.data) {
        const MaterialUnits = res.data.find((item) => item.optionCode === "MaterialUnits")?.optionList;
        const dosageType = res.data.find((item) => item.optionCode === "DosageType")?.optionList;
        const issueType = res.data.find((item) => item.optionCode === "IssueType")?.optionList;
        itemUnitOptions.value = MaterialUnits?.map((item) => ({ ...item, optionValue: +item.optionValue }));
        localStorage.setItem("itemUnitOptions", JSON.stringify(itemUnitOptions.value));
        dosageTypeOptions.value = dosageType;
        localStorage.setItem("dosageTypeOptions", JSON.stringify(dosageTypeOptions.value));
        issueTypeOptions.value = issueType;
        localStorage.setItem("issueTypeOptions", JSON.stringify(issueTypeOptions.value));
      }
    });
  };

  // 编辑表格
  const { editCellRender } = tableEditRender({
    editFinish: ({ index, prop }) => {
      if (prop === "sequence") {
        moveTableRow(dataList, dataList.value[index], "sequence", "", ({ newArr }) => {
          dataList.value = newArr;
          emits("loadData", { formData, tableData: newArr, type: "add" });
        });
      }
    }
  });

  const getColumnConfig = () => {
    const isEdit = route.query.type !== "view";
    const columnData: TableColumnList[] = [
      {
        label: "顺序",
        prop: "sequence",
        width: 60,
        align: "center",
        headerAlign: "center",
        cellRenderer: (data) => editCellRender({ type: "input", data, isEdit })
      },
      { label: "子项物料编号", prop: "number", slot: "number", width: 120 },
      { label: "子项物料名称", prop: "name", minWidth: 160 },
      { label: "子项物料规格", prop: "specification", minWidth: 180 },
      { label: "子项物料模号", prop: "model" },
      { label: "子项物料属性", prop: "erpClsName", width: 120 },
      { label: "分子", prop: "numerator", width: 60, cellRenderer: (data) => editCellRender({ type: "input", data, isEdit }) },
      { label: "分母", prop: "denominator", width: 60, cellRenderer: (data) => editCellRender({ type: "input", data, isEdit }) },
      { label: "变动损耗率(%)", prop: "scraprate", width: 110, cellRenderer: (data) => editCellRender({ type: "input", data, isEdit }) },
      { label: "固定损耗", prop: "fixscrapqty", width: 90, cellRenderer: (data) => editCellRender({ type: "input", data, isEdit }) },
      {
        label: "子项单位",
        prop: "itemUnit",
        width: 80,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: itemUnitOptions.value, isEdit })
      },
      { label: "备注", prop: "remark", cellRenderer: (data) => editCellRender({ type: "input", data, isEdit }) },
      { label: "子项ECN编号", prop: "ECNBillNo" },
      {
        label: "用量类型",
        prop: "dosageType",
        width: 100,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: dosageTypeOptions.value, isEdit })
      },
      {
        label: "发料方式",
        prop: "issueType",
        width: 100,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: issueTypeOptions.value, isEdit })
      },
      { label: "基本单位", prop: "baseUnitName", width: 80 },
      { label: "子项BOM名称", prop: "childBomName", minWidth: 160 }
    ];
    columns.value = setColumn({ columnData, dataList, dragSelector: ".bom-view-table", operationColumn: false, indexColumn: false });
  };

  /** 表格数据 */
  const getTableList = () => {
    const id = route.query?.id;
    if (!id) return;
    fetchBomDetailData({ id })
      .then((res: any) => {
        const data = res.data;
        if (data) {
          const keys = Object.keys(formData);
          for (const item of keys) {
            if (item === "groupId") {
              formData[item] = res.data[item] + "";
            } else {
              if (route.query.id && route.query.type === "add") {
                formData[item] = res.data[item];
                formData.createUserName = getUserInfo().userName;
                formData.createDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
              } else {
                formData[item] = res.data[item];
              }
            }
          }

          const tableData =
            data.bomInfoEntryList.map((item, index) => {
              return {
                ...item,
                sequence: index + 1,
                uuid: uuidv4(),
                dosageType: `${item.dosageType}`,
                issueType: `${item.issueType}`
              };
            }) || [];
          dataList.value = tableData;
          emits("loadData", { formData, tableData, type: "load" });
          loading.value = false;
        }
      })
      .catch(() => (loading.value = false));
  };

  // 点击行
  const rowClick = (row, column) => {
    rowData.value = row;
  };

  const onRowDblclick = (row) => {
    router.push(`/plmManage/basicData/bomMgmt/view?id=${row.childBomId}&type=view&isNewTag=yes&menuId=${route.query.menuId}`);
  };
  const onAdd = () => {
    handleSelectAction("multiple", (rowArr) => {
      const newData = rowArr.map((item, idx) => ({
        ...item,
        materialId: item.id,
        erpClsName: item.erpClsidName,
        itemUnit: item.baseUnit,
        sequence: dataList.value.length + idx + 1,
        uuid: uuidv4(),
        denominator: item.denominator ?? "1",
        numerator: item.numerator ?? "1",
        dosageType: item.dosageType ?? "2",
        fixscrapqty: item.fixscrapqty ?? "0",
        issueType: item.issueType ?? "1",
        scraprate: item.scraprate ?? "0",
        isEdit: false,
        remark: item.remark ?? ""
      }));

      dataList.value = [...dataList.value, ...newData].map((item, idx) => ({ ...item, sequence: idx + 1 }));
      emits("loadData", { formData, tableData: dataList.value, type: "add" });
    });
  };
  const onEdit = () => {
    if (rowData.value) {
      handleSelectAction(
        "single",
        (singleRow) => {
          const pos = dataList.value.findIndex((item) => item.materialId === rowData.value.materialId);
          const copyOldRow = JSON.parse(JSON.stringify(dataList.value[pos]));
          const newRow = {
            ...singleRow,
            uuid: uuidv4(),
            materialId: singleRow.id,
            itemUnit: singleRow.baseUnit,
            denominator: copyOldRow.denominator,
            numerator: copyOldRow.numerator,
            erpClsName: copyOldRow.erpClsName,
            fixscrapqty: copyOldRow.fixscrapqty,
            dosageType: copyOldRow.dosageType,
            scraprate: copyOldRow.scraprate,
            remark: copyOldRow.remark,
            issueType: copyOldRow.issueType ?? "",
            sequence: +copyOldRow.sequence
          };
          dataList.value.splice(pos, 1, newRow);
          dataList.value = dataList.value.map((item, idx, arr) => ({
            ...item,
            issueType: item.issueType ?? "1",
            isEdit: false
          }));
          emits("loadData", { formData, tableData: dataList.value, type: "edit" });
        },
        true
      );
    } else {
      message("请选择一条记录", { type: "warning" });
    }
  };
  const onDelete = () => {
    if (rowData.value) {
      ElMessageBox.confirm(`确认删除物料编号为【${rowData.value.number}】的记录吗？`, "温馨提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          const pos = dataList.value.findIndex((item) => item.uuid === rowData.value.uuid);
          dataList.value.splice(pos, 1);
          dataList.value.forEach((item, index) => (item.sequence = index + 1));
          rowData.value = undefined;
        })
        .catch(() => {});
    } else {
      message("请选择一条记录", { type: "warning" });
    }
  };
  // 导入
  const onImport = (e) => {
    const dom = document.getElementById("importBomInput");
    dom.click();
  };

  // 文件改变
  const onChangeFileInput = (e) => {
    // 读取表格文件
    const files = e.target.files;
    if (files.length <= 0) {
      return false;
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
      message("上传格式不正确，请上传xls或者xlsx格式", { type: "warning" });
      return false;
    } else {
      // 更新获取文件名
      upload_file.value = files[0].name;
    }

    const fileReader = new FileReader();

    //查询某个字母在字母表中的下标位置
    const getLieNum = (lie) => {
      const startChar = 65;

      for (let i = 0; i < 26; i++) {
        allChars.value.push(String.fromCharCode(startChar + i));
      }
      for (let i = 0; i < allChars.value.length; i++) {
        if (allChars.value[i] == lie) {
          return i + 1;
        }
      }
    };

    fileReader.onload = (ev) => {
      const data = ev.target.result;
      const workbook = read(data, { type: "binary" }); // 以二进制流方式读取得到整份excel表格对象
      //遍历每张Sheet表读取
      for (const sheet in workbook.Sheets) {
        if (!Object.keys(workbook.Sheets).includes(sheet)) continue;

        //从单据参数中获取最后一列的值
        const letterNum = getLieNum("N");
        //所有字母的数组
        const startChar = 65;
        for (let i = 0; i < 26; i++) {
          allChars.value.push(String.fromCharCode(startChar + i));
        }
        //获取表格数据中所有属性
        const title = Object.keys(workbook.Sheets[sheet]);
        let startRow = -1; //开始循环位置
        let endRow = -1; //循环结束位置
        const merges = workbook.Sheets[sheet]["!merges"];
        const outdate = [];
        for (let i = 0; i < title.length; i++) {
          if (workbook.Sheets[sheet][title[i]]["v"] == "序号" && startRow == -1) {
            startRow = parseInt(title[i].slice(1)) + 1; //截取开始循环位置
          }
          if (workbook.Sheets[sheet][title[i]]["v"] == "制表：" && endRow == -1) {
            endRow = parseInt(title[i].slice(1)); //截取结束循环位置
          }
          if (startRow > 0 && endRow > 0) {
            break;
          }
        }

        //循环行
        for (let j = startRow; j < endRow; j++) {
          const obj = {};
          //循环列
          for (let k = 0; k < letterNum; k++) {
            //读取当前单元格
            const currentCell = workbook.Sheets[sheet][allChars.value[k] + j];
            //读取当前单元格的标题行单元格
            const titleCell = workbook.Sheets[sheet][allChars.value[k] + (startRow - 1)];
            //判断标题行单元格是事有效
            if (titleCell == "" || titleCell == undefined) {
              continue;
            }
            //判断该单元格是否有效
            if (currentCell != "" && currentCell != undefined) {
              obj[titleCell.v.replace("\n", "")] = currentCell.v;
            } else {
              let originCell;
              for (let n = 0; n < merges.length; n++) {
                if (merges[n].s["c"] <= k && merges[n].e["c"] >= k) {
                  if (merges[n].s["r"] <= j - 1 && merges[n].e["r"] >= j - 1) {
                    originCell = workbook.Sheets[sheet][allChars.value[merges[n].s["c"]] + (merges[n].s["r"] + 1)];
                    break;
                  }
                }
              }
              if (originCell == undefined) {
                //如果无效，则需要判断当前单元格是否被合并，如果是，则找到对应的起始单元格（合并单元格的第一个单元格）的值
                obj[titleCell.v.replace("\n", "")] = "";
              } else {
                obj[titleCell.v.replace("\n", "")] = originCell.v;
              }
            }
          }
          outdate.push(obj);
        }
        handleOpenDialog(outdate);
      }
    };
    fileReader.readAsBinaryString(files[0]);
  };

  // 打开弹窗
  const handleOpenDialog = (data) => {
    let resultDataList = [];

    const selectionCallBack = (v) => {
      resultDataList = v;
    };

    const callBack = () => data;

    addDialog({
      title: `BOM导入`,
      props: { selectionCallBack, data, callBack },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ImportExcelModal),
      closeCallBack: () => {
        const dom = document.getElementById("importBomInput");
        (dom as any).value = null;
      },
      beforeReset: (done, { options }) => {},
      beforeSure: (done, { options }) => {
        if (resultDataList.length) {
          // 转换字段以便于显示列表的数据
          const numbers = resultDataList.map((item) => item["物料编码"]);
          loading.value = true;
          selectMaterialInfo({ numberList: numbers, selectBOM: true, page: 1, limit: 10000 })
            .then((res: any) => {
              if (res.data && res.data.records) {
                ElMessage({ message: "导入成功", type: "success" });

                const newData = dataList.value
                  .concat(
                    res.data.records.map((item, idx) => ({
                      ...item,
                      materialId: item.id,
                      remark: resultDataList[idx] ? resultDataList[idx]["备注"] : "",
                      numerator: resultDataList[idx] ? resultDataList[idx]["用量"] : "",
                      erpClsName: item.erpClsidName,
                      itemUnit: item.baseUnit
                    }))
                  )
                  .map((item, idx, arr) => ({
                    ...item,
                    uuid: uuidv4(),
                    denominator: item.denominator ?? "1",
                    numerator: item.numerator ?? "1",
                    dosageType: item.dosageType ?? "2",
                    fixscrapqty: item.fixscrapqty ?? "0",
                    issueType: item.issueType ?? "1",
                    scraprate: item.scraprate ?? "0",
                    sequence: idx + 1,
                    isEdit: false,
                    remark: item.remark ?? ""
                  }));
                dataList.value = newData;
                emits("loadData", { formData, tableData: newData, type: "add" });
              }
            })
            .finally(() => {
              loading.value = false;
              const dom = document.getElementById("importBomInput");
              (dom as any).value = null;
            });
          done();
        } else {
          message("至少选择一条记录", { type: "warning" });
        }
      }
    });
  };

  // 行上下移动
  const onRowMove = (type) => {
    const row = rowData.value;
    if (dataList.value.length < 1) return message("没有可移动的行", { type: "warning" });
    if (!row) return message("请选择行", { type: "warning" });
    moveTableRow(dataList, row, "sequence", type, ({ newArr }) => {
      dataList.value = newArr;
      emits("loadData", { formData, tableData: newArr, type: "add" });
    });
    return;
  };

  return {
    formData,
    dataList,
    columns,
    loading,
    maxHeight,
    rowClick,
    onRowDblclick,
    onAdd,
    onEdit,
    onDelete,
    onImport,
    onRowMove,
    onChangeFileInput
  };
}
