import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import EditForm from "@/components/EditForm/index.vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { FormRules } from "element-plus";
import {
  deleteProductLineList,
  exportProductLineList,
  fetchProductLineList,
  insertProductLineList,
  updateProductLineList
} from "@/api/oaManage/productMkCenter";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";

export const useConfig = () => {
  const columns = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50);
  const dataList = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([{ label: "产线编号", value: "FNUMBER" }]);
  const currentRow = ref();
  const formData = reactive({});

  onMounted(() => {
    getConfig(buttonList);
    onSearch();
  });

  const getConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "产线名称", prop: "FNAME", width: 140 },
      { label: "产线编号", prop: "FNUMBER", width: 140 },
      { label: "备注", prop: "FDESCRIPTION", width: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onFresh = () => {};

  const onAdd = () => {
    openDialog("add");
  };

  const openDialog = (type, row?) => {
    const formRef = ref();
    const _formData = reactive({ FID: row?.FID, FNUMBER: row?.FNUMBER, FNAME: row?.FNAME, FDESCRIPTION: row?.FDESCRIPTION });
    const titleMap = { add: "新增", edit: "修改" };
    const formRules = reactive<FormRules>({
      FNUMBER: [{ required: true, message: "产线编号必填", trigger: "submit" }],
      FNAME: [{ required: true, message: "产线名称必填", trigger: "submit" }],
      FDESCRIPTION: [{ required: true, message: "备注必填", trigger: "submit" }]
    });
    addDialog({
      title: `${titleMap[type]}产线`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: [
          {
            label: "产线编号",
            colProp: { span: 24 },
            prop: "FNUMBER",
            render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder=" " />
          },
          {
            label: "产线名称",
            colProp: { span: 24 },
            prop: "FNAME",
            render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder=" " />
          },
          {
            label: "备注",
            colProp: { span: 24 },
            prop: "FDESCRIPTION",
            render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} type="textarea" placeholder=" " />
          }
        ],
        formProps: { labelWidth: "80px" }
      },
      class: "product-line-modal",
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const formResRef = formRef.value.getRef();
        formResRef.validate(async (valid) => {
          if (valid) {
            const typeApi = { add: insertProductLineList, edit: updateProductLineList };
            showMessageBox(`确认要${titleMap[type]}吗?`)
              .then(() => {
                typeApi[type](_formData).then((res) => {
                  if (res.data) {
                    message.success(`${titleMap[type]}成功`);
                    done();
                    onSearch();
                  }
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSearch = () => {
    fetchProductLineList(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data;
      }
    });
  };

  const onEdit = () => {
    if (!currentRow.value) return message.warning("请选择记录");
    openDialog("edit", currentRow.value);
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onExport = () => {
    exportProductLineList(formData)
      .then((res: any) => {
        if (!res.data) return message.error("导出失败");
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  const onDel = () => {
    if (!currentRow.value) return message.warning("请选择记录");

    showMessageBox(`确认要删除吗?`)
      .then(() => {
        deleteProductLineList({ fid: currentRow.value.FID }).then((res) => {
          if (res.data) {
            message.success("删除成功");
            onSearch();
            currentRow.value = null;
          }
        });
      })
      .catch(console.log);
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return { columns, onFresh, handleTagSearch, rowClick, searchOptions, buttonList, maxHeight, dataList, pagination };
};
