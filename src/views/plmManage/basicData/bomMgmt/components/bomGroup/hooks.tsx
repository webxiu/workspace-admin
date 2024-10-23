import { ElMessage, ElMessageBox } from "element-plus";
import { addBomLeftTreeData, delBomLeftTreeData, editBomLeftTreeData } from "@/api/plmManage";
import { formConfigs, formRules } from "./config";
import { h, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
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

  const onEdit = (row, fn) => {
    currentRow.value = row.data;
    currentCallBack.value = fn;
    openDialog("edit", row.data);
  };

  const onDelete = (node, fn) => {
    const row = node.data;
    ElMessageBox.confirm(`确认要删除名称为【${row.name}】的分组吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        delBomLeftTreeData({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            fn();
          }
        });
      })
      .catch(() => {});
  };

  const openDialog = async (type: string, row?) => {
    console.log(row, "edit row");
    const titleObj = { add: "新增BOM分组", edit: "修改BOM分组" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      groupname: row?.name ?? "",
      groupnumber: row?.basicData ?? "",
      id: row?.id ?? "",
      parentid: type === "add" ? currentNodeid.value : row.parentId
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formProps: { labelWidth: 90 },
        formConfigs: formConfigs(treeSelectData)
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
    const API = { add: addBomLeftTreeData, edit: editBomLeftTreeData };
    console.log(data, "bom data");
    API[type](data)
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
