import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import { Download } from "@element-plus/icons-vue";
import { PAGE_CONFIG } from "@/config/constant";
import { fetchProdAndOrderList } from "@/api/supplyChain";
import { fixed2AndAddcomma } from "@/utils/common";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 90);

  const formData: any = reactive({
    startTime: "",
    endTime: "",
    FSHORTNAME: "",
    FNUMBER: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "型号", prop: "FNUMBER", headerAlign: "center", width: 100 },
      { label: "客户简称", prop: "FSHORTNAME", headerAlign: "center", width: 100 },
      {
        label: "订单信息",
        prop: "orderInfo",
        headerAlign: "center",
        children: [
          {
            label: "本期订单数量",
            prop: "saleQty",
            align: "right",
            sortable: true,
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.saleQty ? <span>{(+data.row.saleQty).toLocaleString()}</span> : <span />;
            }
          },
          {
            label: "本期订单金额(万元)",
            prop: "saleAmount",
            width: 100,
            sortable: true,
            align: "right",
            headerAlign: "center",
            cellRenderer(data) {
              return <span>{fixed2AndAddcomma(+data.row.saleAmount)}</span>;
            }
          }
        ]
      },
      {
        label: "出货信息",
        prop: "outInfo",
        headerAlign: "center",
        children: [
          {
            label: "前期订单出货数量",
            prop: "outQtyBefore",
            sortable: true,
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.outQtyBefore ? <span>{(+data.row.outQtyBefore).toLocaleString()}</span> : <span />;
            }
          },
          {
            label: "本期订单出货数量",
            prop: "outQty",
            sortable: true,
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.outQty ? <span>{(+data.row.outQty).toLocaleString()}</span> : <span />;
            }
          },
          {
            label: "本期出货总数量",
            prop: "outQtyTotal",
            sortable: true,
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.outQtyTotal ? <span>{(+data.row.outQtyTotal).toLocaleString()}</span> : <span />;
            }
          },
          {
            label: "前期订单出货金额(万元)",
            prop: "outAmountBefore",
            sortable: true,
            width: 100,
            align: "right",
            headerAlign: "center",
            cellRenderer(data) {
              return <span>{fixed2AndAddcomma(+data.row.outAmountBefore)}</span>;
            }
          },
          {
            label: "本期订单出货金额(万元)",
            sortable: true,
            width: 100,
            prop: "outAmount",
            align: "right",
            headerAlign: "center",
            cellRenderer(data) {
              return <span>{fixed2AndAddcomma(+data.row.outAmount)}</span>;
            }
          },
          {
            label: "本期出货总金额(万元)",
            sortable: true,
            width: 100,
            prop: "outAmountTotal",
            align: "right",
            headerAlign: "center",
            cellRenderer(data) {
              return <span>{fixed2AndAddcomma(+data.row.outAmountTotal)}</span>;
            }
          }
        ]
      },
      {
        label: "未出货信息",
        headerAlign: "center",
        prop: "noInfo",
        children: [
          {
            label: "前期订单未出货数量",
            sortable: true,
            prop: "saleRemainBefore",
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.saleRemainBefore ? <span>{(+data.row.saleRemainBefore).toLocaleString()}</span> : <span />;
            }
          },
          {
            label: "本期订单未出货数量",
            sortable: true,
            prop: "saleRemain",
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.saleRemain ? <span>{(+data.row.saleRemain).toLocaleString()}</span> : <span />;
            }
          },
          {
            label: "未出货总数量",
            sortable: true,
            prop: "saleRemainTotal",
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.saleRemainTotal ? <span>{(+data.row.saleRemainTotal).toLocaleString()}</span> : <span />;
            }
          }
        ]
      },
      {
        label: "完成情况",
        headerAlign: "center",
        prop: "doneInfo",
        children: [
          { label: "本期订单出货达成率(%)", sortable: true, prop: "saleOutRate", width: 100, headerAlign: "center", align: "right" },
          { label: "订单生产完成率(%)", sortable: true, prop: "saleInRqte", width: 100, headerAlign: "center", align: "right" }
        ]
      },
      {
        label: "生产库存信息",
        prop: "stockInfo",
        headerAlign: "center",
        children: [
          {
            label: "生产入库数量",
            sortable: true,
            prop: "inQty",
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.inQty ? <span>{(+data.row.inQty).toLocaleString()}</span> : <span />;
            }
          },
          {
            label: "库存数量",
            prop: "FBaseQty",
            sortable: true,
            align: "right",
            width: 100,
            headerAlign: "center",
            cellRenderer(data) {
              return data.row.FBaseQty ? <span>{(+data.row.FBaseQty).toLocaleString()}</span> : <span />;
            }
          }
        ]
      }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, radioColumn: { width: 50 } });
    return columnData;
  };

  const onSearch = () => {
    loading.value = true;
    const { date = "" } = formData;
    const [startTime, endTime] = date.split("~").map((item) => item.trim());
    formData.startTime = startTime;
    formData.endTime = endTime;
    fetchProdAndOrderList(formData)
      .then((res: any) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  // 分页相关
  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  // 导出单据
  const onExport = () => {
    // 考虑到多级表头的复杂处理，暂时不用纯表格数据导出列
    // downloadDataToExcel({ columns: getColumnConfig(), dataList: dataList.value, sheetName: "产销存、订单对比表" });

    const workbook = utils.table_to_book(document.querySelector("#businessId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });

    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `订单出货对比表.xlsx`
    );
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", icon: Download, isDropDown: false }]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    onRefresh,
    onCurrentChange
  };
};
