/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-11 16:31:39
 */

import AddModel, { FormDataType } from "../addModel.vue";
import { CustomerManageItemType, addCustomer, customerManageList, deleteCustomer, exportCustomer, updateCustomer } from "@/api/oaManage/marketing";
import { RendererType, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<CustomerManageItemType[]>([]);
  const rowData = ref<CustomerManageItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51);

  const formData = reactive({
    page: 1,
    limit: 10000,
    customerOANumber: "",
    year: new Date().getFullYear()
  });

  const searchOptions: SearchOptionType[] = [{ label: "客户编码", value: "customerOANumber" }];

  onMounted(() => {
    onSearch();
  });

  const getColumnConfig = async () => {
    // 自定义渲染Logo
    const cellRenderer: RendererType = ({ row }) => {
      const baseApi = import.meta.env.VITE_BASE_API;
      const url = `${baseApi}/oa/mk/customermanager/down?resource=${row.customerLogo}`;
      return (
        <el-image
          src={url}
          fit="contain"
          zoom-rate={1.2}
          initial-index={0}
          preview-src-list={[url]}
          preview-teleported={true}
          hide-on-click-modal={true}
          class="border-line wi-50 hi-50 br-4"
          style={{ margin: "0 auto", display: "block" }}
        >
          {{ error: () => <div class="el-image__error">无图</div> }}
        </el-image>
      );
    };
    let columnData: TableColumnList[] = [
      { label: "Logo", prop: "customerLogo", align: "center", cellRenderer },
      { label: "客户名称", prop: "customerName" },
      { label: "客户编码", prop: "customerOANumber" },
      { label: "区域", prop: "customerArea" },
      { label: "国家名称", prop: "customerCountryName" },
      { label: "地址信息", prop: "customerLocation" },
      { label: "联系人信息", prop: "linkmanMessage" },
      { label: "业务往来信息", prop: "professionalMessage" },
      { label: "金蝶客户编号", prop: "customerNumber" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ customerLogo: cellRenderer }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, dragSelector: ".customer-manage", operationColumn: false, formData });
  };

  const onSearch = () => {
    loading.value = true;
    customerManageList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data || [];
        getColumnConfig();
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values) => {
    formData.customerOANumber = values.customerOANumber;
    onSearch();
  };

  const onRowClick = (row: CustomerManageItemType) => {
    rowData.value = row;
  };

  // 添加单据
  const onAdd = () => {
    openDialog("add");
  };

  // 修改单据
  const onEdit = (row: CustomerManageItemType) => {
    openDialog("edit", row);
  };

  async function openDialog(type: "add" | "edit", row?: Partial<CustomerManageItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    const FormRef = ref();

    const formData = reactive<FormDataType>({
      mkCustomerLinkmanList: row?.mkCustomerLinkmanList ?? [{ id: Date.now(), fname: "", phone: "", email: "" }],
      customerName: row?.customerName ?? "",
      customerAreaId: row?.customerAreaId ?? "",
      customerOANumber: row?.customerOANumber ?? "",
      customerCountryEntryId: row?.customerCountryEntryId ?? "",
      customerLocation: row?.customerLocation ?? "",
      file: "",
      customerArea: row?.customerArea ?? "",
      customerCountryName: row?.customerCountryName ?? "",
      customerLogo: row?.customerLogo ?? "",
      id: row?.id ?? 0
    });

    addDialog({
      title: `${title}客户`,
      props: { formInline: formData },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(AddModel, { ref: FormRef }),
      beforeSure: (done, { options }) => {
        const { formRef, formData } = FormRef.value.getRef();
        formRef.value.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认${title}吗?`).then(() => {
              const API = { add: addCustomer, edit: updateCustomer };
              API[type](formData)
                .then((res) => {
                  if (res.data) {
                    done();
                    onSearch();
                    message(`${title}成功`);
                  } else {
                    message(`${title}失败`, { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  // 删除单据
  const onDelete = (row: CustomerManageItemType) => {
    deleteCustomer(row.id)
      .then((res) => {
        if (res.data) {
          message("删除成功");
          rowData.value = null;
          onSearch();
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };
  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("客户管理", columns.value);
    exportCustomer(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName);
        }
      })
      .catch(console.log);
  };

  const onEditAction = () => {
    if (!rowData.value) {
      return message("请选择一条记录", { type: "warning" });
    }
    onEdit(rowData.value);
  };

  const onDeleteAction = () => {
    if (!rowData.value) {
      return message("请选择一条记录", { type: "warning" });
    }
    showMessageBox(`确认要删除名称为【${rowData.value.customerName}】的客户吗?`)
      .then(() => {
        onDelete(rowData.value);
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEditAction, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDeleteAction, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    buttonList,
    onSearch,
    onAdd,
    onEdit,
    onDelete,
    onExport,
    handleTagSearch,
    onRowClick
  };
};
