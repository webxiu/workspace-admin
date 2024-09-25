import { ElMessage, ElMessageBox } from "element-plus";
import { addBomLeftTreeData, delBomLeftTreeData, editBomLeftTreeData } from "@/api/plmManage";
import { addTestProjecGrouptList, deleteTestProjectClassifyList } from "@/api/plmManage/laboratory";
import { formConfigs, formRules } from "./config";
import { h, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import dayjs from "dayjs";
import { message } from "@/utils/message";

export const useContextMenu = () => {
  const currentRow: any = ref({});
  const treeSelectData: any = ref([]);
  const currentNodeid: any = ref("");
  const currentCallBack = ref(null);

  const onAdd = (node, fn) => {
    currentNodeid.value = node.data.id;
    currentCallBack.value = fn;
    console.log(node.data, "节点 data");
    openDialog("add");
  };

  const onEdit = (row, fn, allClassifyList) => {
    currentRow.value = row.data;
    currentCallBack.value = fn;
    openDialog("edit", row.data, allClassifyList);
  };

  const onDelete = (node, fn, allClassifyList) => {
    const row = node.data;
    ElMessageBox.confirm(`确认要删除名称为【${row.label}】的分类吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        deleteTestProjectClassifyList([row.id]).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            fn();
            allClassifyList();
          }
        });
      })
      .catch(() => {});
  };

  const onSearch = () => {
    console.log("onsearch");
  };

  const openDialog = async (type: string, row?, allClassifyList?) => {
    console.log(row, "edit row");
    const titleObj = { add: "新增项目分类", edit: "修改项目分类" };
    const title = titleObj[type];
    const formRef = ref();

    let findInfo: any = {};
    if (type !== "add") {
      findInfo = allClassifyList.value?.find((item) => item.id === row.id);
    }
    console.log(findInfo, "findInfo");

    const _formData = reactive({
      groupname: row?.name ?? "",
      groupnumber: row?.basicData ?? "",
      id: type === "edit" ? findInfo?.id : undefined,
      parentid: type === "add" ? currentNodeid.value : row.parentId,
      projectCategory: row?.label,
      createDate: type === "edit" ? dayjs(new Date(findInfo.createDate)).format("YYYY-MM-DD HH:mm:ss") : ""
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formProps: { labelWidth: 90 },
        formConfigs: formConfigs(treeSelectData, type)
      },
      width: "450px",
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
                if (currentCallBack.value && typeof currentCallBack.value === "function") {
                  currentCallBack.value();
                }
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    console.log(data, "左侧分类");
    const reqData: any = {
      typeName: data.projectCategory,
      id: data.id ? data.id : undefined
    };
    console.log(data, "bom data");
    addTestProjecGrouptList(reqData)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  return {
    onEdit,
    treeSelectData,
    onDelete,
    onAdd
  };
};
