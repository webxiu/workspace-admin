/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-27 13:47:00
 */

import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { MenuListItemType, MenuOpeionsItemType, formColumnList, menuAdd, menuDelete, menuList, menuOpeionsList, menuUpdate } from "@/api/systemManage";
import { computed, h, onMounted, reactive, ref } from "vue";
import { formConfigs, formRules, iconList } from "./config";
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { message, showMessageBox } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import { FormRules } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { findDataList } from "@/utils/common";
import { findTreeNodes } from "@/utils/tree";
import { getFormColumns } from "@/utils/form";
import { handleTree } from "@/utils/tree";
import { useEleHeight } from "@/hooks";

export enum ConfUrl {
  table = "/system/basic/menu/tableColumn",
  form = "/system/basic/menu/formColumn",
  layout = "/system/basic/menu/layoutColumn"
}
export type EnumKey = keyof typeof ConfUrl;

const AllKey = "全部";

export const useConfig = () => {
  const router = useRouter();
  const route = useRoute();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataListTemp = ref<MenuListItemType[]>([]);
  const rowData = ref<MenuListItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const optionList = ref<MenuListItemType[]>([]);
  const keyword = ref("");

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const dataList = computed(() => {
    if (keyword.value === AllKey) return dataListTemp.value; // 显示所有菜单
    return findTreeNodes(dataListTemp.value, (t) => (keyword.value ? t.menuName.includes(keyword.value) : true), [], false);
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "项目名称", prop: "menuName", align: "left", minWidth: 220 },
      { label: "排序", prop: "displaySequence", align: "center" },
      { label: "项目编号", prop: "menuCode", align: "right" },
      { label: "父级编号", prop: "parentCode", align: "right" },
      { label: "项目ID", prop: "itemId", align: "right", slot: "itemId" },
      { label: "前端路由", prop: "webRouter", minWidth: 220 },
      { label: "类型", prop: "menuType", align: "center" },
      { label: "是否启用", prop: "isEnable", cellRenderer: ({ row }) => <span>{row.isEnable ? "启用" : "禁用"}</span> },
      { label: "图标", prop: "icon", minWidth: 160 },
      { label: "移动端首页", prop: "appHomeUrl" },
      { label: "移动端详情", prop: "appDetailUrl" },
      { label: "控制器", prop: "controller" },
      { label: "打开方式", prop: "openModel" },
      { label: "标记", prop: "mark" },
      { label: "数据库", prop: "dataBase" },
      { label: "数据表", prop: "dataTable" },
      { label: "辅助表", prop: "auxilTable" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, isCustomExpend: true });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    menuList({})
      .then((res) => {
        loading.value = false;
        const result = handleTree(res.data, "menuCode", "parentCode", "children");
        const optList = result.map((item) => {
          const { children, ...reset } = item;
          return reset;
        });
        if (!keyword.value) {
          keyword.value = result[0].menuName;
        }
        optionList.value = [{ menuName: AllKey }, ...optList];
        dataListTemp.value = result;
      })
      .catch((err) => (loading.value = false));
  };

  /** 字符串数字累加 */
  function incrementString(str) {
    const num = parseInt(str, 10);
    const val = num + 1;
    const res = val.toString().padStart(str.length, "0");
    return res;
  }

  /** 查找最大字符串数字 */
  function findMaxNumber(strings) {
    const numbers = strings.map(Number);
    const maxNumber = Math.max(...numbers);
    const maxString = strings[numbers.indexOf(maxNumber)];
    return maxString;
  }

  const onAdd = () => {
    let selectRow = {};
    if (rowData.value) {
      // 选中菜单新增, 当前选中项设为父级, 获取最大排序
      const { menuCode, menuType, children } = rowData.value;

      // 自增排序和项目编号
      const childSeqs: number[] = [];
      const menuCodeList: string[] = [];
      children?.forEach((item) => {
        menuCodeList.push(item.menuCode);
        childSeqs.push(item.displaySequence);
      });
      let menuAddCode = "";
      let displaySequence = 1;
      if (childSeqs.length > 0) displaySequence = Math.max(...childSeqs) + 1;
      if (childSeqs.length > 0) menuAddCode = incrementString(findMaxNumber(menuCodeList));

      selectRow = { displaySequence, menuCode: menuAddCode, menuType: "", parentCode: menuCode };
    }
    openDialog("add", selectRow);
  };
  const onEdit = (row: MenuListItemType) => {
    // if (!row.parentId) return message("不能修改顶级", { type: "error" });
    openDialog("edit", row);
  };

  async function openDialog(type: "add" | "edit", row?: Partial<MenuListItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const loading = ref<boolean>(true);
    const parentSelect = ref<MenuListItemType>();
    const myFormConfig = ref<FormConfigItemType[]>([]);
    const formRules2 = ref<FormRules>({});
    const _formData = reactive({
      parentCode: row?.parentCode || "",
      menuType: row?.menuType ?? "",
      displaySequence: row?.displaySequence ?? "",
      menuName: row?.menuName ?? "",
      webRouter: row?.webRouter ?? "",
      controller: row?.controller ?? "",
      appHomeUrl: row?.appHomeUrl ?? "",
      appDetailUrl: row?.appDetailUrl ?? "",
      btnId: row?.btnId ?? "",
      menuCode: row?.menuCode ?? "",
      icon: row?.icon ?? "",
      mark: row?.mark ?? "",
      itemId: row?.itemId ?? "",
      isEnable: row?.isEnable ?? "",
      dataBase: row?.dataBase ?? "",
      dataTable: row?.dataTable ?? "",
      auxilTable: row?.auxilTable ?? ""
    });

    // 父级下拉框变化记录选中项
    function onParentTreeChange(row: MenuListItemType) {
      parentSelect.value = row;
    }

    const customProps = reactive({
      parentCode: { onCurrentChange: onParentTreeChange },
      menuType: { disabled: type === "edit" },
      dataBase: { disabled: row.menuType !== "菜单" },
      dataTable: { disabled: row.menuType !== "菜单" },
      auxilTable: { disabled: row.menuType !== "菜单" }
    });

    const customElement = {
      icon: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable>
            {{
              append: () => (
                <el-popover placement="right" width={347} trigger="click">
                  {{
                    reference: () => <el-button>选择</el-button>,
                    default: () => (
                      <el-row style="max-height: 200px;overflow-y: auto;" class="border-line">
                        {iconList.map((item) => (
                          <el-col
                            span={3}
                            class="flex border-line just-center align-center"
                            style={{ borderColor: _formData.icon === item ? "#00f" : "inherit" }}
                          >
                            {/* <i style="font-size: 28px; cursor: pointer;" class={`iconfont icon-${item}`} onClick={() => (_formData.icon = item)} /> */}
                            <svg
                              class={`svg-icon ${item}`}
                              onClick={() => (_formData.icon = item)}
                              aria-hidden={true}
                              style={{
                                width: "36px",
                                height: "36px",
                                cursor: "pointer",
                                padding: "5px",
                                fill: "currentColor"
                              }}
                            >
                              <use xlinkHref={`#icon-${item}`}></use>
                            </svg>
                          </el-col>
                        ))}
                      </el-row>
                    )
                  }}
                </el-popover>
              )
            }}
          </el-input>
        );
      }
    };

    getFormColumns({ customProps, customElement, loading })
      .then((data) => {
        formRules2.value = data.formRules;
        loading.value = false;
        if (!data.formColumns.length) return;
        myFormConfig.value = data.formColumns;
      })
      .catch(() => (loading.value = false));

    // const parentData = ref<MenuOpeionsItemType[]>([]);
    // const menuOption = ref([]);
    // getEnumDictList(["MenuType"]).then((res) => {
    //   if (res.MenuType?.length) {
    //     menuOption.value = res.MenuType;
    //   }
    // });

    // menuOpeionsList()
    //   .then((res) => {
    //     parentData.value = res.data;
    //     loading.value = false;
    //   })
    //   .catch(() => (loading.value = false));

    addDialog({
      title: `${title}项目`,
      props: {
        loading: loading,
        formInline: _formData,
        // formRules: formRules2,
        formRules: formRules(_formData),
        // formConfigs: formConfigs({ type, parentData: parentData, menuOption, _formData, onParentTreeChange });,
        formConfigs: myFormConfig,
        formProps: { labelWidth: "120px" }
      },
      width: "860px",
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
        const curData = { ..._formData, ...options.props.formInline };
        FormRef.validate((valid) => {
          // 禁止关闭菜单管理
          if (row?.webRouter === route.path && !curData?.isEnable) {
            return message(`禁止关闭${row.menuName}`, { type: "error" });
          }
          // 移动判断
          if (curData.parentCode && curData.menuCode === curData.parentCode) {
            return message("项目编号和父级编号不能相同", { type: "error" });
            // 2024-09-27 移除
            // } else if (curData.parentCode && parentSelect.value && parentSelect.value?.menuType === "目录") {
            //   return message("父级只能为目录", { type: "error" });
          }

          if (valid) {
            showMessageBox("确定要提交吗?").then(() => {
              onSubmitChange(type, title, curData, () => {
                done();
                getTableList();
              });
            });
          }
        });
      }
    });
  }

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: menuAdd, edit: menuUpdate };
    API[type](data)
      .then((res) => {
        if (!res.data) return;
        callback();
        message(`${title}成功`);
      })
      .catch(console.log);
  };

  const onDelete = (row: MenuListItemType) => {
    menuDelete({ id: row.itemId, menuType: row.menuType })
      .then((res) => {
        if (res.data) {
          message("删除成功");
          getTableList();
        } else {
          message("删除失败，请联系开发人员处理", { type: "error" });
        }
      })
      .catch(console.log);
  };

  // 菜单配置
  const onOpenConfig = (name: EnumKey) => {
    const row = rowData.value;
    if (!row) return message("请选择菜单", { type: "error" });
    const { menuType, itemId, menuName } = row;
    if (menuType !== "菜单") {
      return message("菜单类型不能为" + menuType, { type: "error" });
    }
    router.push({ path: ConfUrl[name], query: { isNewTag: "yes", itemId, menuName } });
  };

  const onCurrentChange = (row: MenuListItemType) => (rowData.value = row);

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", icon: Plus, text: "新增", isDropDown: false },
    { clickHandler: () => onOpenConfig("form"), type: "warning", text: "表单配置", isDropDown: true },
    { clickHandler: () => onOpenConfig("table"), type: "warning", text: "表格配置", isDropDown: true },
    { clickHandler: () => onOpenConfig("layout"), type: "warning", text: "布局配置", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    keyword,
    buttonList,
    optionList,
    onRefresh,
    onEdit,
    onDelete,
    onCurrentChange
  };
};
