import { Download, Plus } from "@element-plus/icons-vue";
import { addFinanceInfo, editFinInfo, fetchCountryList, fetchFinInfoList } from "@/api/supplyChain";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessageBox } from "element-plus";
import { TableGroupItemType } from "@/api/systemManage";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const countryList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const groupArrsList = ref<TableGroupItemType[]>([]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
    onFetchCountryList();
  });

  const onFetchCountryList = () => {
    fetchCountryList({}).then((res) => {
      if (res.data && Array.isArray(res.data)) {
        countryList.value = res.data;
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "国家", prop: "FDATAVALUE" },
      { label: "银行账号", prop: "FBANKCODE" },
      { label: "账户名称", prop: "FBANKHOLDER" },
      { label: "收款银行", prop: "bankName" },
      { label: "银行网点", prop: "FNAME" },
      { label: "开户银行", prop: "FOPENBANKNAME" },
      { label: "银联号", prop: "FCNAPS" }
    ];
    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = () => {
    loading.value = true;
    fetchFinInfoList({ page: 1, limit: 100000 })
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data;
      })
      .catch((err) => (loading.value = false));
  };

  // 添加单据
  const onAdd = () => {
    openDialog("add");
  };

  // 修改单据
  const onEdit = (row) => {
    openDialog("edit", row);
  };

  async function openDialog(type: string, row?) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const loading = ref<boolean>(false);

    const _formData = reactive({
      FCountry: row?.FCOUNTRY ?? "",
      FBANKCODE: row?.FBANKCODE ?? "",
      FBANKHOLDER: row?.FBANKHOLDER ?? "",
      bankName: row?.bankName ?? "",
      FNAME: row?.FNAME ?? "",
      FOPENBANKNAME: row?.FOPENBANKNAME ?? "",
      FCNAPS: row?.FCNAPS ?? "",
      FBANKID: row?.FBANKID ?? "",
      FBANKDETAIL: row?.FBANKDETAIL ?? "",
      FBANKTYPEREC: row?.FBANKTYPEREC ?? "",
      FSUPPLIERID: row?.FSUPPLIERID ?? ""
    });

    addDialog({
      title: `${title}`,
      props: {
        loading: loading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ projectsList: [] }, countryList.value, _formData),
        formProps: { labelWidth: "120px" }
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  }

  const onSubmitChange = (type: string, title: string, data, callback) => {
    // console.log(data, "新增的data");
    // return;
    const API = { add: addFinanceInfo, edit: editFinInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#finInfoTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `财务信息表${timeStep}.xlsx`
    );
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: true },
    { clickHandler: onExport, type: "primary", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    groupArrsList,
    onEdit,
    onRefresh
  };
};
