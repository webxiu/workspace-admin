<template>
  <div>
    <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
      <template #title>
        <div style="display: flex" v-if="type !== 'view'">
          <el-button type="primary" size="small" :icon="Plus" @click="onAdd">新增</el-button>
          <el-button type="danger" size="small" :icon="Delete" @click="onDelete">删除</el-button>
          <el-button type="primary" size="small" :icon="UploadFilled" @click="onImport">导入</el-button>
          <el-button type="default" size="small" :icon="Top" @click="onRowMove('up')">行向上</el-button>
          <el-button type="default" size="small" :icon="Bottom" @click="onRowMove('down')">行向下</el-button>
          <input style="display: none" type="file" accept=".xls,.xlsx" id="importPmBomInput" @change="onChangeFileInput" />
        </div>
      </template>
      <template v-slot="{ dynamicColumns }">
        <pure-table
          border
          show-overflow-tooltip
          :row-style="{ cursor: 'pointer' }"
          :height="maxHeight"
          row-key="uuid"
          class="bom-pm-table"
          :adaptive="true"
          align-whole="left"
          size="small"
          @row-click="rowClick"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
        />
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { Plus, Delete, UploadFilled, Top, Bottom } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { v4 as uuidv4 } from "uuid";
import { message } from "@/utils/message";
import { getEnumDictList, moveTableRow, setColumn, tableEditRender } from "@/utils/table";
import { read } from "xlsx";

const type = ref("add");
const maxHeight = ref(500);
const curRow = ref();
const columns = ref<TableColumnList[]>([]);
const dataList = ref([]);
const upload_file = ref("");
const allChars = ref([]);
const materialUnitOpts = ref([]);

const emits = defineEmits(["loadData"]);

// 编辑表格
const { editCellRender } = tableEditRender();

const explosionNoRender = (data) => editCellRender({ data });
const erpLevelRender = (data) =>
  editCellRender({
    data,
    type: "select",
    options: [
      { optionName: "前加工", optionValue: "前加工" },
      { optionName: "组装", optionValue: "组装" }
    ]
  });
const materialTypelRender = (data) =>
  editCellRender({
    data,
    type: "select",
    options: [
      { optionName: "塑胶", optionValue: "塑胶" },
      { optionName: "五金", optionValue: "五金" },
      { optionName: "硅胶件", optionValue: "硅胶件" },
      { optionName: "铜镀镍", optionValue: "铜镀镍" },
      { optionName: "硅胶", optionValue: "硅胶" },
      { optionName: "辅料", optionValue: "辅料" }
    ]
  });
const materialNumberRender = (data) => editCellRender({ data });
const materialNameRender = (data) => editCellRender({ data });
const specificationsRender = (data) => editCellRender({ data });
const unitRender = (data) =>
  editCellRender({
    data,
    type: "select",
    options: materialUnitOpts.value
  });
const usageRender = (data) => editCellRender({ data });
const certificationNoRender = (data) => editCellRender({ data });
const manufacturerRender = (data) => editCellRender({ data });
const remarkRender = (data) => editCellRender({ data });

const columnData: TableColumnList[] = [
  { label: "爆炸图编号", prop: "explosionNo", align: "center", cellRenderer: explosionNoRender, width: 90 },
  { label: "ERP层次", prop: "erpLevel", align: "center", cellRenderer: erpLevelRender, width: 110 },
  { label: "材料类型", prop: "materialType", align: "center", cellRenderer: materialTypelRender, width: 110 },
  { label: "物料编码", prop: "materialNumber", align: "center", cellRenderer: materialNumberRender, width: 140 },
  { label: "物料名称", prop: "materialName", align: "center", cellRenderer: materialNameRender, minWidth: 140 },
  { label: "规格描述", prop: "specifications", align: "center", cellRenderer: specificationsRender, minWidth: 140 },
  { label: "单位", prop: "unit", align: "center", cellRenderer: unitRender, width: 100 },
  { label: "用量", prop: "usage", align: "center", cellRenderer: usageRender, width: 90 },
  { label: "认证号", prop: "certificationNo", align: "center", cellRenderer: certificationNoRender },
  { label: "制造商", prop: "manufacturer", align: "center", cellRenderer: manufacturerRender, minWidth: 140 },
  { label: "备注", prop: "remark", align: "center", cellRenderer: remarkRender, minWidth: 140 }
];

const rowClick = (row) => {
  curRow.value = row;
};

const onAdd = () => {
  dataList.value.push({
    explosionNo: "",
    erpLevel: "",
    materialType: "",
    materialNumber: "",
    materialName: "",
    specifications: "",
    sequence: dataList.value.length + 1,
    unit: "",
    usage: "",
    certificationNo: "",
    manufacturer: "",
    remark: "",
    uuid: uuidv4()
  });
  emits("loadData", dataList.value);
};

const onDelete = () => {
  if (!curRow.value) return message.warning("请选择一条数据");
  const pos = dataList.value.findIndex((el) => el.uuid === curRow.value?.uuid);
  if (pos >= 0) {
    dataList.value.splice(pos, 1);
    emits("loadData", dataList.value);
    curRow.value = null;
  }
};
const onImport = () => {
  const dom = document.getElementById("importPmBomInput");
  dom.click();
};
const onRowMove = (type) => {
  const row = curRow.value;
  if (dataList.value.length < 1) return message.warning("没有可移动的行");
  if (!row) return message.warning("请选择行");
  moveTableRow(dataList, row, "sequence", type, ({ newArr }) => {
    dataList.value = newArr;
    emits("loadData", newArr);
  });
  return;
};
const onChangeFileInput = (e) => {
  // 读取表格文件
  const files = e.target.files;
  if (files.length <= 0) {
    return false;
  } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
    message.warning("上传格式不正确，请上传xls或者xlsx格式");
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
      handleSetDataList(outdate);
    }
  };
  fileReader.readAsBinaryString(files[0]);
};

const handleSetDataList = (data) => {
  data.forEach((item, idx) => {
    dataList.value[idx] = {
      explosionNo: item["爆炸图编号"],
      erpLevel: item["ERP层次"],
      materialType: item["材料类型"],
      materialNumber: item["物料编码"],
      materialName: item["物料名称"],
      specifications: item["规格描述"],
      unit: item["单位"],
      usage: item["用量"],
      certificationNo: item["认证号"],
      manufacturer: item["制造商"],
      remark: item["备注"],
      sequence: idx + 1,
      uuid: uuidv4()
    };
  });
  emits("loadData", dataList.value);
  const dom = document.getElementById("importPmBomInput");
  (dom as any).value = null;
};

onMounted(() => {
  columns.value = setColumn({ columnData, operationColumn: false });

  getEnumDictList(["MaterialUnits"]).then((res) => {
    if (res) {
      materialUnitOpts.value = res["MaterialUnits"].map((item) => ({ optionName: item.optionName, optionValue: item.optionName }));
    }
  });
});
</script>

<style scoped></style>
