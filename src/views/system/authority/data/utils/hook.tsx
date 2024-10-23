/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:03:29
 */

import { DataAuthItemType, DataAuthMenuItemType, dataAuthList, dataAuthMenuList, dataAuthMenuUpdate } from "@/api/systemManage";
import { computed, h, onMounted, reactive, ref } from "vue";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn } from "@/utils/table";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref<DataAuthItemType[]>([]);
  const dataList2 = ref<DataAuthMenuItemType[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const rowData = ref<DataAuthItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);

  const searchOptions = reactive<SearchOptionType[]>([{ label: "角色名称", value: "roleName" }]);
  const searchOptions2 = reactive<SearchOptionType[]>([{ label: "菜单名称", value: "menuNameParam" }]);

  const formData = reactive({
    page: 1,
    limit: 10000,
    roleName: "",
    menuNameParam: ""
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const dataFilterList = computed(() => {
    return dataList2.value.filter((item) => {
      return item.menuName.search(formData.menuNameParam) > -1;
    });
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "角色编号", prop: "roleCode", align: "right" },
      { label: "角色名称", prop: "roleName", sortable: true },
      { label: "部门", prop: "deptName" }
    ];

    let columnData2: TableColumnList[] = [
      { label: "菜单编号", prop: "menuCode", align: "right" },
      { label: "菜单名称", prop: "menuName", sortable: true },
      { label: "权限选项", prop: "authorityFlagName" }
    ];

    const { columnArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    columns.value = setColumn({ columnData, dragSelector: ".data-auth", operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: { minWidth: 80 }, dragSelector: ".data-auth-menu" });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };
  const onRefresh2 = () => {
    getColumnConfig();
    getRightList(rowData.value);
  };

  const getTableList = () => {
    loading.value = true;
    dataAuthList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  // 搜索左表
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  // 搜索右表
  const onTagSearch2 = (values) => {
    formData.menuNameParam = values.menuNameParam;
  };

  const onEdit = (row: DataAuthMenuItemType) => {
    openDialog(row);
  };

  const onCurrentChange = (row: DataAuthItemType) => {
    rowData.value = row;
    getRightList(row);
  };

  // 获取右侧分组列表
  const getRightList = (row: DataAuthItemType) => {
    if (!row?.id) return;
    loading2.value = true;
    dataAuthMenuList({ roleId: row.id })
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data;
      })
      .catch(() => (loading2.value = false));
  };

  function openDialog(row: Partial<DataAuthMenuItemType>) {
    const formLoading = ref<boolean>(true);
    const formRef = ref();
    const selectOptions = ref([]);

    const _formData = reactive({
      authorityFlagId: row?.authorityFlagId ? `${row.authorityFlagId}` : "",
      menuId: row?.menuId ?? "",
      roleId: row?.roleId ?? ""
    });

    getBOMTableRowSelectOptions({ optioncode: "DataAuthority" })
      .then((res) => {
        if (res.data) {
          selectOptions.value = res.data[0]?.optionList || [];
        }
      })
      .finally(() => (formLoading.value = false));

    addDialog({
      title: "修改数据权限",
      props: {
        formInline: _formData,
        loading: formLoading,
        formRules: formRules,
        formConfigs: formConfigs({ selectOptions }),
        formProps: { labelWidth: "140px" }
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              dataAuthMenuUpdate(_formData)
                .then((res) => {
                  if (!res.data) return;
                  done();
                  getTableList();
                  message("修改成功");
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2: dataFilterList,
    maxHeight,
    searchOptions,
    searchOptions2,
    onEdit,
    onTagSearch,
    onTagSearch2,
    onRefresh,
    onRefresh2,
    onCurrentChange
  };
};
