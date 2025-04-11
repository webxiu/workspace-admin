/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-11 16:31:39
 */

import AddModel, { FormDataType } from "../addModel.vue";
import {
  CustomerManageItemType,
  addCustomer,
  customerManageList,
  customerRankingOptionList,
  deleteCustomer,
  disabledOrEnableCustomer,
  exportCustomer,
  updateCustomer
} from "@/api/oaManage/marketing";
import { RendererType, getEnumDictList, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import EditForm from "@/components/EditForm/index.vue";
import type { UploadProps } from "element-plus";
import TableEditList from "@/components/TableEditList/index.vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";
import { formConfigs, formRules } from "./config";
import { fetchCountryList } from "@/api/supplyChain";
import { fetchMoneyClassList } from "@/api/oaManage/financeDept";
import { CustomPropsType } from "@/utils/form";
import { UploadFilled } from "@element-plus/icons-vue";
import UserItem from "../addModel.vue";

const baseApi = import.meta.env.VITE_BASE_API;

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<CustomerManageItemType[]>([]);
  const rowData = ref<any>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51);

  const formData = reactive({
    page: 1,
    limit: 10000,
    customerOANumber: "",
    year: new Date().getFullYear()
  });

  const searchOptions = reactive<SearchOptionType[]>([{ label: "客户编码", value: "customerOANumber" }]);

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
          class="border-line wi-50 hi-20 br-4"
          style={{ margin: "0 auto", display: "block" }}
        >
          {{
            error: () => (
              <div class="el-image__error" style={{ "font-size": "12px", "line-height": "12px" }}>
                无图
              </div>
            )
          }}
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
        dataList.value = data.map((item) => ({ ...item, forbidStatus: 0 })) || [];
        getColumnConfig();
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
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

  async function openDialog(type: "add" | "edit", row?) {
    const title = { add: "新增", edit: "修改" }[type];
    const FormRef = ref();
    const optionInfo: any = ref({});
    const formData: any = reactive({
      id: row?.id ?? "",
      customerName: row?.customerName ?? "",
      customerAreaId: row?.customerAreaId ? row?.customerAreaId + "" : "",
      customerOANumber: row?.customerOANumber ?? "",
      customerCountryEntryId: row?.customerCountryEntryId ?? "",
      customerLocation: row?.customerLocation ?? "",
      zipCode: row?.zipCode ?? "",
      website: row?.website ?? "",
      fax: row?.fax ?? "",
      taxRegisterCode: row?.taxRegisterCode ?? "",
      tradingCurrId: row?.tradingCurrId ?? "",
      sellerId: row?.sellerId ?? "",
      transLeadTime: row?.transLeadTime ?? "",
      settlTypeId: row?.settlTypeId ?? "",
      receiveCurrId: row?.receiveCurrId ?? "",
      recconditionId: row?.recconditionId ?? "",
      taxRate: row?.taxRate ?? "",
      forbidStatus: "",
      priority: row?.priority ?? "",
      invoiceType: row?.invoiceType ?? "",
      // concatUserName: row?.mkCustomerLinkmanList[0]?.fname,
      // concatPhone: row?.mkCustomerLinkmanList[0]?.phone,
      // concatEmail: row?.mkCustomerLinkmanList[0]?.email,
      customerLogo: row?.customerLogo ?? "",
      // concatId: row?.mkCustomerLinkmanList[0]?.id ?? "",
      mkCustomerLinkmanList: row?.mkCustomerLinkmanList || []
    });

    if (type === "edit") {
      formData.forbidStatus = row.forbidStatus + "";
    }

    function handleAvatarSuccess(response) {
      formData.customerLogo = response.data;
    }

    const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
      if (!["image/jpeg", "image/png", "image/bmp", "image/gif"].includes(rawFile.type)) {
        message.error("Logo必须为JPG、PNG、BMP或GIF格式!");
        return false;
      }
      if (rawFile.size / 1024 / 1024 > 2) {
        message.error("Logo图片大小不能超过2MB！");
        return false;
      }
      return true;
    };

    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      tradingCurrId: {
        apiParams: { page: 1, limit: 100000 },
        formatAPI(data) {
          return data.records;
        }
      },
      receiveCurrId: {
        apiParams: { page: 1, limit: 100000 },
        formatAPI(data) {
          return data.records;
        }
      },
      sellerId: {
        formatAPI(data) {
          return data.salePeopleLists;
        }
      }
    });

    const customElement = {
      customerLogo: () => {
        return (
          <el-upload
            drag
            style={{ width: "100px", height: "100px" }}
            class="avatar-logo"
            accept=".jpg,.png,.jpeg,.bmp,.gif"
            action={`${baseApi}/oa/mk/customermanager/uploadmultifile`}
            show-file-list={false}
            onSuccess={handleAvatarSuccess}
            before-upload={beforeAvatarUpload}
          >
            {formData.customerLogo ? (
              <img style={{ width: "100px" }} src={`${baseApi}/oa/mk/customermanager/down?resource=${formData.customerLogo}`} />
            ) : (
              <div style={{ display: "flex", height: "77px", "align-items": "center", "justify-content": "center" }}>
                <el-icon size={30}>
                  <UploadFilled />
                </el-icon>
              </div>
            )}
          </el-upload>
        );
      },
      concatUserList: () => {
        return (
          <div style={{ width: "100%" }}>
            <UserItem formInline={formData} />
          </div>
        );
      }
    };

    addDialog({
      title: `${title}客户`,
      props: {
        params: { groupCode: "1" },
        formConfig: [{ formData, customProps, customElement, formProps: { labelWidth: "90px", size: "small" } }]
      },
      width: "1200px",
      class: "customer-modal-mkt",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(TableEditList, { ref: FormRef }),
      beforeSure: (done, { options }) => {
        FormRef.value.getRef().then(({ valid, data }) => {
          const { formData } = data.forms[0];
          if (valid) {
            formData.mkCustomerLinkmanList.forEach((el) => {
              if (typeof el.id === "string" && el.id.includes("-")) {
                el.id = undefined;
              }
            });
            showMessageBox(`确认${title}吗?`).then(() => {
              const API = { add: addCustomer, edit: updateCustomer };
              API[type]({ ...formData, forbidStatus: +formData.forbidStatus })
                .then((res) => {
                  if (res.data) {
                    done();
                    onSearch();
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

  // 删除单据
  const onDelete = (row: CustomerManageItemType) => {
    deleteCustomer(row.id)
      .then((res) => {
        if (res.data) {
          message.success("删除成功");
          rowData.value = null;
          onSearch();
        } else {
          message.error("删除失败");
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
      return message.warning("请选择一条记录");
    }
    onEdit(rowData.value);
  };

  const onDeleteAction = () => {
    if (!rowData.value) {
      return message.warning("请选择一条记录");
    }
    showMessageBox(`确认要删除名称为【${rowData.value.customerName}】的客户吗?`)
      .then(() => {
        onDelete(rowData.value);
      })
      .catch(console.log);
  };

  const onDisabled = () => {
    if (!rowData.value) {
      return message.warning("请选择一条记录");
    }

    if (rowData.value.forbidStatus) {
      message.warning("该客户已经禁用");
    } else {
      showMessageBox(`确认禁用客户【${rowData.value.customerName}】吗?`)
        .then(() => {
          disabledOrEnableCustomer({ id: rowData.value.id }).then((res) => {
            if (res.data) {
              message.success("操作成功");
              onSearch();
            }
          });
        })
        .catch(console.log);
    }
  };

  const onEnabled = () => {
    if (!rowData.value) {
      return message.warning("请选择一条记录");
    }

    if (!rowData.value.forbidStatus) {
      message.warning("该客户已经启用");
    } else {
      showMessageBox(`确认启用客户【${rowData.value.customerName}】吗?`)
        .then(() => {
          disabledOrEnableCustomer({ id: rowData.value.id }).then((res) => {
            if (res.data) {
              message.success("操作成功");
              onSearch();
            }
          });
        })
        .catch(console.log);
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEditAction, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDeleteAction, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onDisabled, type: "primary", text: "禁用", isDropDown: true },
    { clickHandler: onEnabled, type: "primary", text: "反禁用", isDropDown: true },
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
