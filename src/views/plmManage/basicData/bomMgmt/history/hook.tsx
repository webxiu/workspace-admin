import { setColumn } from "@/utils/table";
import { useEleHeight } from "@/hooks";

export const useHistoryConfig = () => {
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 20);
  const columnData: TableColumnList[] = [
    { label: "修改人", prop: "userName", width: 80 },
    { label: "修改时间", prop: "recordDate", minWidth: 150 }
  ];

  const columnData2: TableColumnList[] = [
    { label: "子项物料编号", prop: "number", width: 120 },
    { label: "子项物料名称", prop: "name", minWidth: 120 },
    { label: "子项物料规格", prop: "specification", minWidth: 120 },
    { label: "子项物料模号", prop: "model", width: 120 },
    { label: "子项物料属性", prop: "erpClsName", width: 120 },
    { label: "分子", prop: "numerator", width: 80 },
    { label: "分母", prop: "denominator", width: 80 },
    { label: "变动损耗率", prop: "scraprate", width: 120 },
    { label: "子项单位", prop: "itemUnitName", width: 120 },
    { label: "备注", prop: "remark" },
    { label: "子项ECN编号", prop: "ecnbillNo", width: 120 },
    { label: "用量类型", prop: "dosageTypeName", width: 120 },
    { label: "发料方式", prop: "issueTypeName", width: 120 },
    { label: "基本单位", prop: "baseUnitName", width: 120 },
    { label: "子项BOM名称", prop: "childBomName", width: 120 }
  ];

  const setHeight = (val) => {
    console.log(maxHeight.value, "height val");
  };

  const columns = setColumn({ columnData: columnData, operationColumn: false, indexColumn: { hide: true } });
  const columns2 = setColumn({ columnData: columnData2, operationColumn: false });

  return {
    columns,
    columns2,
    maxHeight,
    setHeight
  };
};
