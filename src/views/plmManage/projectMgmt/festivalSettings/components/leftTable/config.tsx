import { ElMessage, ElMessageBox, FormRules, dayjs } from "element-plus";
import { addHolidayList, deleteHolidayList, fetchHolidayList, getBOMTableRowSelectOptions, updateHolidayList } from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";

const columnsDragDom = ref([]);

export const getConfig = async (buttonList) => {
  const columnsDrag: any[] = [
    { label: "选择" },
    { label: "序号", prop: "index" },
    { label: "年份", prop: "holidayYear" },
    { label: "跳过双休", prop: "calcType" },

    { label: "创建人", prop: "createUserName" },
    { label: "创建时间", prop: "createDate" },
    { label: "最后修改人", prop: "modifyUserName" },
    { label: "最后修改时间", prop: "modifyDate" }
  ];

  // 我发起
  let columns: TableColumnList[] = [
    { label: "", align: "center", width: 50, cellRenderer: () => <el-radio label="&nbsp;" size="small" /> },

    {
      label: "序号",
      align: "center",
      type: "index",
      width: 60,
      cellRenderer: ({ $index }) => <span>{$index + 1}</span>
    },
    {
      label: "年份",
      width: 60,
      prop: (index) => columnsDragDom.value[index].prop as string
    },
    { label: "跳过双休", width: 90, prop: (index) => columnsDragDom.value[index].prop as string, slot: "calcType" },
    { label: "创建人", width: 80, prop: (index) => columnsDragDom.value[index].prop as string },
    { label: "创建时间", prop: (index) => columnsDragDom.value[index].prop as string },
    { label: "最后修改人", prop: (index) => columnsDragDom.value[index].prop as string },
    { label: "最后修改时间", prop: (index) => columnsDragDom.value[index].prop as string }
  ];

  columnsDragDom.value = columnsDrag;
  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;
  if (menuCols?.length) {
    columns = setColumn({ columnData: menuCols, operationColumn: false });
  }
  updateButtonList(buttonList, buttonArrs[0]);
  return columns;
};

export function useBankTable(emits) {
  const columns1 = ref<TableColumnList[]>([]);
  const dataList: any = ref([]);
  const currentBankRow: any = ref({});

  const defaultHolidayYear = ref("");

  const loading = ref(false);
  onMounted(async () => {
    columns1.value = await getConfig(buttonList);
    onSearch({ page: 1, limit: 10000 });
  });

  const onSearch = (v) => {
    loading.value = true;

    fetchHolidayList({ ...v })
      .then((res: any) => {
        if (res.data) {
          dataList.value = res.data;
        }
      })
      .finally(() => (loading.value = false));
  };

  const onFresh1 = () => {
    getConfig(buttonList);
    onSearch({ holidayYear: "", page: 1, limit: 10000 });
  };

  // 点击行
  const rowClick = (row, column, event, setA) => {
    if (event.target.tagName === "INPUT") {
      return;
    }
    currentBankRow.value = row;

    // if (typeof setA === "function") setA({ ...row });
  };

  const onAdd = () => {
    console.log("onAdd");
    openDialog("add");
  };

  const onEdit = () => {
    if (JSON.stringify(currentBankRow.value) !== "{}") {
      openDialog("edit", currentBankRow.value);
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const onDelete = () => {
    if (JSON.stringify(currentBankRow.value) !== "{}") {
      const row = currentBankRow.value;
      ElMessageBox.confirm(`确认要删除年份为【${row.holidayYear}】的记录吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          deleteHolidayList({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              currentBankRow.value = {};
              onSearch({ page: 1, limit: 10000 });
              emits("clearRightList");
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const _formData = reactive({
      holidayYear: row?.holidayYear + "" ?? "",
      calcType: row?.calcType + "" ?? ""
    });
    const formRules = reactive<FormRules>({
      holidayYear: [{ required: true, message: "年份为必填项", trigger: "submit" }],
      calcType: [{ required: true, message: "请选择计算类型", trigger: "submit" }]
    });

    const formConfigs = () => {
      const isSkipRestList = ref([]);
      getBOMTableRowSelectOptions({ optioncode: "PlmHolidaySetting" }).then((res) => {
        if (res.data) {
          console.log(res.data, "假日");
          isSkipRestList.value = res.data[0]?.optionList || [];
        }
      });
      return [
        {
          label: "年份",
          prop: "holidayYear",
          labelWidth: 70,
          render: ({ formModel, row }) => {
            return <el-date-picker clearable={false} v-model={formModel[row.prop]} type="year" placeholder="选择年" valueFormat="YYYY" format="YYYY" />;
          }
        },
        {
          label: "",
          prop: "calcType",
          labelWidth: 70,
          render: ({ formModel, row }) => {
            return (
              <el-radio-group v-model={formModel[row.prop]}>
                {isSkipRestList.value.map((item) => (
                  <el-radio key={item.optionValue} label={item.optionValue}>
                    {item.optionName}
                  </el-radio>
                ))}
              </el-radio-group>
            );
          }
        },
        {
          label: "",
          prop: "",
          labelWidth: 70,
          render: () => {
            return (
              <div style={{ color: "#e6a23c" }}>
                <div>跳过：不计算工期</div>
              </div>
            );
          }
        }
      ];
    };

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules,
        formConfigs: formConfigs()
      },
      width: "500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
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
                onSearch({ page: 1, limit: 10000 });
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (type === "edit") data.id = currentBankRow.value.id;
    console.log(data, "submit");
    const API = { add: addHolidayList, edit: updateHolidayList };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: onEdit, type: "warning", text: "修改" },
    { clickHandler: onDelete, type: "danger", text: "删除" }
  ]);

  const changeDateYear = (val) => {
    onSearch({ holidayYear: val ?? "", page: 1, limit: 10000 });
  };

  return {
    columns1,
    dataList,
    loading,
    onSearch,
    onFresh1,
    rowClick,
    changeDateYear,
    defaultHolidayYear,
    onAdd,
    onEdit,
    buttonList,
    onDelete
  };
}
