/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:37:54
 */

import {
  GoodsManageItemType,
  GoodsManageOptionType,
  addGoodsManage,
  deleteGoodsManage,
  dragSort,
  exportGoodsManage,
  goodsManageList,
  updateGoodsManage
} from "@/api/oaManage/humanResources";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { getEnumDictList, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import AddModel from "../addModel.vue";
import DynamicAddFormItems from "@/components/DynamicAddFormItems.vue";
import { FormItemConfigType } from "@/utils/form";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import regExp from "@/utils/regExp";
import { spec } from "node:test/reporters";
import { useEleHeight } from "@/hooks";
import { v4 as uuidv4 } from "uuid";

const baseApi = import.meta.env.VITE_BASE_API;
const baseUrl = `${baseApi}/oa/mk/customermanager/down?resource=`;

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<GoodsManageItemType[]>([]);
  const dataListTemp = ref<GoodsManageItemType[]>([]);
  const loading = ref<boolean>(false);
  const enableSort = ref(false);
  const rowData = ref();
  const sortRef = ref();

  const timeStemp = ref(dayjs().valueOf());

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51);
  const goodsOptions = ref<GoodsManageOptionType>({
    classifyList: [],
    brandList: []
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "商品编号", value: "billNo" },
    { label: "商品名称", value: "commodityName" },
    { label: "品牌类型", value: "brandId", children: [] },
    { label: "分类类型", value: "classifyId", children: [] },
    {
      label: "上下架状态",
      value: "state",
      children: [
        { label: "上架", value: 1 },
        { label: "下架", value: 0 }
      ]
    },
    { label: "最低价格", value: "minOfficialPrice" },
    { label: "最高价格", value: "maxOfficialPrice" }
  ]);

  const formData = reactive({
    billNo: "",
    commodityName: "",
    brandId: "",
    classifyId: "",
    state: "",
    minOfficialPrice: "",
    maxOfficialPrice: "",
    page: 1,
    limit: 10000
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
    getOptionList();
  });

  const getOptionList = () => {
    getEnumDictList(["ProductCategroy", "BrandList"]).then(({ ProductCategroy, BrandList }) => {
      goodsOptions.value = { classifyList: ProductCategroy as any, brandList: BrandList as any };
      searchOptions[2].children = ProductCategroy;
      searchOptions[3].children = BrandList;
    });
  };

  const getColumnConfig = async () => {
    const imgCellRenderer = (data) => {
      const row = data.row;
      if (!row.images) return null;
      const srcList = row.images?.map((item) => baseApi + item.filePath + item.fileName);
      return (
        <el-image
          src={srcList[0]}
          zoom-rate={1.2}
          initial-index={0}
          preview-src-list={srcList}
          preview-teleported={true}
          hide-on-click-modal={true}
          z-index={999999}
          fit="cover"
          class="wi-22 hi-22"
        >
          {{ error: () => "-" }}
        </el-image>
      );
    };

    let columnData: TableColumnList[] = [
      { label: "商品编号", prop: "billNo", minWidth: 160 },
      { label: "商品名称", prop: "commodityName" },
      { label: "品牌", prop: "brandName" },
      { label: "分类", prop: "classifyName" },
      { label: "型号", prop: "model" },
      { label: "库存", prop: "stock", align: "right" },
      { label: "规格", prop: "spec" },
      { label: "官方价格", prop: "officialPrice", align: "right" },
      { label: "折扣价格", prop: "discountPrice", align: "right" },
      { label: "是否上架", prop: "state", cellRenderer: ({ row }) => <span>{{ 0: "下架", 1: "上架" }[row.state]}</span> },
      { label: "产品功能介绍", prop: "commodityDescription", minWidth: 220 },
      { label: "展示序号", prop: "sort", align: "right" },
      { label: "图片", prop: "images", width: 200, align: "center", cellRenderer: imgCellRenderer }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ images: imgCellRenderer }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn(
      { columnData, isDragRow: enableSort.value, dragSelector: ".goods-manage", operationColumn: false },
      ({ sortable, oldIndex, newIndex, fromName, toName }) => {
        const billNoArr = dataListTemp.value.map((item) => item.billNo);
        const fromStr = fromName.replaceAll("\n", "").substring(0, 30);
        const toStr = toName.replaceAll("\n", "").substring(0, 30);
        let finalFromPos, finalToPos;
        billNoArr.forEach((item, idx) => {
          if (fromStr.includes(item)) finalFromPos = idx + 1;
          if (toStr.includes(item)) finalToPos = idx + 1;
        });

        dragSort({ xSort: finalFromPos, ySort: finalToPos }).then((res) => {
          if (res.data) {
            timeStemp.value = dayjs().valueOf();
            dataList.value.forEach((item, i) => (item.sort = i + 1));
            getTableList();
          }
        });
      }
    );
  };

  const setUUID = (list: any[]) => {
    return list.map((item) => {
      if (item.specs) {
        item.specs = setUUID(item.specs);
      }
      item.uuid = uuidv4();
      return item;
    });
  };

  const getTableList = () => {
    loading.value = true;
    goodsManageList(formData)
      .then((res) => {
        const data = res.data;
        const copyDataList = setUUID(cloneDeep(res.data.records));
        loading.value = false;
        dataList.value = copyDataList;
        dataListTemp.value = copyDataList;
        getColumnConfig();
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

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = (row: GoodsManageItemType) => {
    openDialog("edit", row);
  };

  async function openDialog(type: "add" | "edit", row?: Partial<GoodsManageItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();

    const images = row?.images?.map(({ fileName, filePath, ...m }) => {
      return { name: fileName, url: baseApi + filePath + fileName, ...m };
    });

    const formData = reactive({
      commodityName: row?.commodityName ?? "",
      billNo: row?.billNo,
      model: row?.model ?? "",
      classifyId: row?.classifyId ? `${row?.classifyId}` : "",
      brandId: row?.brandId ? `${row?.brandId}` : "",
      state: row?.state ?? 0,
      commodityDescription: row?.commodityDescription ?? "",
      specs: row?.specs ?? [{ uuid: Date.now(), spec: "", officialPrice: "", discountPrice: "", stock: "", createDate: "", createId: "" }],
      images: row?.images ? images : [],
      id: row?.id ?? ""
    });

    const itemConfigs = [
      {
        label: "规格",
        prop: "spec",
        span: 6,
        rules: [{ required: true, message: "规格不能为空", trigger: "blur" }],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "官方价格",
        prop: "officialPrice",
        span: 5,
        rules: [
          { required: true, message: "官方价格不能为空", trigger: "blur" },
          { message: "价格格式不正确", trigger: "blur", pattern: regExp.price }
        ],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "折扣价格",
        prop: "discountPrice",
        span: 5,
        rules: [
          { required: true, message: "折扣价格不能为空", trigger: "blur" },
          { message: "价格格式不正确", trigger: "blur", pattern: regExp.price }
        ],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "库存数量",
        prop: "stock",
        span: 5,
        rules: [
          { required: true, message: "库存数量不能为空", trigger: "blur" },
          { message: "数量格式不正确", trigger: "blur", pattern: regExp.quantity }
        ],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ];

    const formConfig: FormItemConfigType[] = [
      {
        formData: formData,
        formProps: { labelWidth: "90px" },
        customElement: {
          specs: ({ formModel, row }) => (
            <DynamicAddFormItems v-model={formModel[row.prop]} listProp="specs" itemConfigs={itemConfigs} addButton={{ name: "新增一条规格" }} />
          )
        },
        customColumn: { specs: { isHideItem: true } }
      }
    ];

    addDialog({
      title: `${title}商品`,
      props: { params: { groupCode: "1" }, formConfig: formConfig },
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认${title}吗?`).then(() => {
              const API = { add: addGoodsManage, edit: updateGoodsManage };
              API[type](formData)
                .then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message.success(`${title}成功`);
                  } else {
                    message.error(`${title}失败`);
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  const onDelete = (row: GoodsManageItemType | any) => {
    if (row.specs) {
      return message.error("请先删除商品下的商品规格参数哦");
    }
    deleteGoodsManage({ commoditiesSpecId: row.id, commodityId: row.commodityid })
      .then((res) => {
        if (res.data) {
          message.success("删除成功");
          rowData.value = null;
          getTableList();
        } else {
          message.error("删除失败");
        }
      })
      .catch(console.log);
  };

  const onExport = () => {
    const headConfig = getExportConfig("商品管理", columns.value, formData);
    exportGoodsManage(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        }
      })
      .catch(console.log);
  };

  const handleChangeSwitch = (val) => {
    if (sortRef.value) {
      sortRef.value.destroy();
    }
    enableSort.value = val;
    getColumnConfig();
  };

  const rowClick = (row) => {
    rowData.value = row;
  };

  const onEditAction = () => {
    if (!rowData.value) return message.warning("请选择一条记录");
    if (rowData.value.commodityid) return message.error("请选择一条商品记录进行修改");
    onEdit(rowData.value);
  };

  const onDelAction = () => {
    if (!rowData.value) return message.warning("请选择一条记录");
    if (rowData.value.commodityid) {
      showMessageBox(`确认要删除当前规格参数吗?`)
        .then(() => {
          onDelete(rowData.value);
        })
        .catch(console.log);
    } else {
      onDelete(rowData.value);
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEditAction, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelAction, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true }
  ]);
  return {
    loading,
    columns,
    dataList,
    maxHeight,
    enableSort,
    buttonList,
    timeStemp,
    searchOptions,
    onRefresh,
    onTagSearch,
    onEdit,
    onDelete,
    rowClick,
    handleChangeSwitch
  };
};
