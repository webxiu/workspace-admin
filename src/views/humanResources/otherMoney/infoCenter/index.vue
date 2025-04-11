<template>
  <div class="performance-detail">
    <TableEditList :loading="loading" :params="{ pageUrl, groupCode: '1' }" :tableConfig="tableConfig" :formConfig="formConfig" />
  </div>
</template>

<script lang="tsx" setup>
import TableEditList from "@/components/TableEditList/index.vue";
import { FormTableConfigType } from "@/utils/form";
import { RendererType, tableEditRender } from "@/utils/table";
import { onMounted, ref, reactive } from "vue";
import { Plus, Delete, Upload } from "@element-plus/icons-vue";
import { fetchOtherAdjustmentSheetDetail, fetchOtherAdjustmentSheetList, staffInfoList } from "@/api/oaManage/humanResources";

const props = defineProps(["rowData", "pageUrl"]);
const dataImportList = ref([]);
const selectUserOptsValue = ref([]);
const deptOptions = ref([]);
const deptName = ref("");
const loading = ref(true);

const _formData = reactive<{ deptId: number | string } & any>({
  staffCode: "",
  billNo: "",
  billState: "",
  billStateName: "",
  createUserName: "",
  createDate: "",
  modifyUserName: "",
  modifyDate: "",
  id: "",
  deptId: "",
  yearMonth: ""
});

// 编辑表格
const { editCellRender } = tableEditRender();

const custmRender = (): Record<string, RendererType> => {
  return {
    staffCode: (data) => editCellRender({ data, isEdit: false }),
    deptId: ({ row }) => row.deptName,
    staffName: (data) =>
      editCellRender({
        type: "select",
        data,
        isEdit: false,
        options: selectUserOptsValue.value,
        cellStyle: { color: "#606266", textAlign: "left" },
        eleProps: { filterable: true }
      }),
    otherAdjustmentAmount: (data) => editCellRender({ data, isEdit: false })
  };
};

const tableSlots = () => {
  return {
    operation: () => (
      <el-button size="small" type="danger" icon={Delete} disabled={true}>
        删除
      </el-button>
    )
  };
};

const tableConfig: FormTableConfigType[] = [
  {
    dataList: dataImportList,
    custmRender: custmRender(),
    tableProps: { height: 300, maxHeight: 300 },
    tableSlots: tableSlots(),
    buttonConfig: {
      autoLayout: false,
      buttonList: [
        { icon: Plus, size: "small", type: "primary", text: "添加", disabled: true },
        {
          icon: Upload,
          type: "success",
          size: "small",
          text: "导入",
          disabled: true,
          isDropDown: false,
          uploadProp: { action: "#", accept: ".xlsx, .xls", autoUpload: false }
        }
      ]
    },
    tableColumnOption: {
      operationColumn: { width: 125 }
    }
  }
];

const formConfig = [
  {
    formData: _formData,
    customProps: {
      deptId: {
        disabled: true,
        placeholder: deptName
      },
      yearMonth: {
        disabled: true
      }
    },
    formProps: { labelWidth: "90px", size: "small" },
    dataOption: { deptId: deptOptions.value }
  }
];

const initUserOpts = (deptId) => {
  staffInfoList({
    page: 1,
    limit: 10000,
    staffId: "",
    staffName: "",
    state: "在职",
    leaveofficeDate: "",
    laborServiceCompany: "",
    deptIdList: []
  }).then((res) => {
    if (res.data) {
      const result = res.data.records;
      selectUserOptsValue.value = result.map((item) => ({
        optionName: item.staffName,
        optionValue: item.staffName,
        reflectVal: item.staffId
      }));
    }
  });
};

const setFormData = (result) => {
  Object.keys(_formData).forEach((el) => {
    if (el === "deptId") {
      _formData["deptId"] = result["deptName"];
    } else {
      _formData[el] = result[el];
    }
  });
};

const initData = () => {
  if (props.rowData?.billNo) {
    loading.value = true;
    const p1 = fetchOtherAdjustmentSheetList({ billNo: props.rowData?.billNo, page: 1, limit: 30 });
    const p2 = fetchOtherAdjustmentSheetDetail({ id: props.rowData?.id });
    Promise.all([p1, p2])
      .then((res: any) => {
        if (res[0].data) {
          const result = res[0].data.records[0];
          deptName.value = result.deptName;
          setFormData(result);
          initUserOpts(result.deptId);
        }
        if (res[1].data) {
          dataImportList.value = (res[1].data || []) as any[];
        }
      })
      .finally(() => (loading.value = false));
  }
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss">
.performance-detail {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
