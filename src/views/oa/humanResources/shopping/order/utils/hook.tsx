/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 10:58:00
 */

import { OrderManageItemType, orderManageList, exportOrderManage, changeOrderState } from "@/api/oaManage/humanResources";
import { onMounted, h, reactive, ref } from "vue";
import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { setColumn, getExportConfig, tableEditRender, getMenuColumns, updateButtonList, usePageSelect } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox } from "@/utils/message";

import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { PAGE_CONFIG } from "@/config/constant";

const colorMap = {
  "0": "#909399",
  "1": "#e6a23c",
  "2": "#409eff",
  "3": "#67c23a",
  "4": "#f56c6c"
};

export const useConfig = () => {
  const tableRef = ref();
  const stateOptions = ref([]);
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<OrderManageItemType[]>([]);
  const rowsData = ref<OrderManageItemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51 + 51);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "订单编号", value: "billNo" },
    { label: "客户姓名", value: "userName" },
    { label: "商品名称", value: "commodityName" },
    { label: "订单状态", value: "state", children: [] }
  ]);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    billNo: "",
    userName: "",
    commodityName: "",
    state: ""
  });

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    getTableList();
    getOptionList();
  });

  // 编辑表格
  const { editCellRender } = tableEditRender({
    editFinish: ({ prop, row }) => {
      onEditCell({ prop, value: row[prop], row });
    }
  });

  const getOptionList = () => {
    getBOMTableRowSelectOptions({ optioncode: "InnerOrderStatus" }).then((res) => {
      if (res.data) {
        const resultData = res.data[0]?.optionList || [];
        const brandList = resultData.map((item) => ({ label: item.optionName, value: item.optionValue }));
        searchOptions[3].children = brandList;
        stateOptions.value = brandList; // optionValue和返回的state类型需要一致才能保证点击下拉回显正常
      }
    });
  };

  const getColumnConfig = async () => {
    const stateCellRenderer = (data) => {
      const { row, column } = data;
      const options = stateOptions.value.map((item) => ({ optionName: item.label, optionValue: Number(item.value) }));
      return editCellRender({ type: "select", data, options: options, cellStyle: { background: colorMap[row[column["property"]]], color: "#fff" } });
    };

    let columnData: TableColumnList[] = [
      { label: "订单时间", prop: "createDate", minWidth: 140 },
      { label: "订单编号", prop: "billNo", minWidth: 140 },
      { label: "客户姓名", prop: "userName", sortable: true, minWidth: 100 },
      { label: "订单状态", prop: "state", sortable: true, cellRenderer: stateCellRenderer },
      { label: "订单总额", prop: "amount", align: "right", sortable: true },
      { label: "收货方式", prop: "deliveryMothed", sortable: true, cellRenderer: ({ row }) => <span>{{ 0: "自提", 1: "快递" }[row.deliveryMothed]}</span> },
      { label: "快递公司", prop: "expressCompany", sortable: true },
      { label: "快递单号", prop: "expressNumber" },
      { label: "商品名称", prop: "commodityName" },
      { label: "型号", prop: "model" },
      { label: "商品描述", prop: "commodityDescription", minWidth: 240 },
      { label: "规格", prop: "spec" },
      { label: "数量", prop: "quantity", align: "right", sortable: true },
      { label: "分类", prop: "classifyName", sortable: true },
      { label: "品牌", prop: "brandName", sortable: true },
      { label: "官方价格", prop: "officalPrice", align: "right" },
      { label: "折扣价格", prop: "discountPrice", align: "right" },
      { label: "收货人", prop: "addressee" },
      { label: "收货人电话", prop: "addresseePhone", minWidth: 140 },
      { label: "收货地址省份", prop: "provinceName", minWidth: 160 },
      { label: "收货地址市", prop: "cityName", minWidth: 160 },
      { label: "收货地址区/县", prop: "detailAddress", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ state: stateCellRenderer }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, formData, dragSelector: ".order-manage", selectionColumn: { hide: false }, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    orderManageList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        setSelectCheckbox();
      })
      .catch((err) => (loading.value = false));
  };

  const onRefresh = () => {
    getTableList();
  };

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  // 修改订单状态(单个修改)
  function onEditCell({ prop, value, row }) {
    changeOrderState([row])
      .then((res) => {
        if (res.data) {
          message("修改成功");
        } else {
          getTableList();
          message("修改失败", { type: "error" });
        }
      })
      .catch(console.log);
  }

  // 修改订单状态(批量修改)
  function onChangeStateAll() {
    if (!rowsData.value?.length) {
      return message("请选择订单", { type: "error" });
    }
    const formRef = ref();
    const formData = reactive({ state: "" });
    addDialog({
      title: "选择状态",
      props: {
        formInline: formData,
        formRules: { state: [{ required: true, message: "请选择订单状态", trigger: "blur" }] },
        formConfigs: [
          {
            label: "订单状态",
            prop: "state",
            render: ({ formModel, row }) => (
              <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
                {stateOptions.value?.map((item) => (
                  <el-option key={item.value} label={item.label} value={item.value} />
                ))}
              </el-select>
            )
          }
        ]
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const newStateRows: OrderManageItemType[] = [];
        rowsData.value.forEach((item) => {
          item.state = Number(formData.state);
          newStateRows.push({ ...item, state: Number(formData.state) });
        });

        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认批量修改选中状态吗?`).then(() => {
              changeOrderState(newStateRows)
                .then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message("批量修改成功");
                  } else {
                    message("批量修改失败", { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  // 打印
  const onPrint = () => {
    message("开发中...");
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("业绩统计", columns.value, formData);
    exportOrderManage(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  function onSelect(rows: OrderManageItemType[], row: OrderManageItemType) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: OrderManageItemType[]) {
    setSelectAllChange(rows);
  }

  const onRowClick = (row: OrderManageItemType, column) => {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onChangeStateAll, type: "primary", text: "批量修改订单状态", isDropDown: true },
    { clickHandler: onPrint, type: "primary", text: "打印快递单", isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true }
  ]);

  return {
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    onRefresh,
    onTagSearch,
    onSelect,
    onSelectAll,
    onRowClick,
    onSizeChange,
    onCurrentChange
  };
};
