import { formConfigs, formRules } from "./config";
import { h, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import { deleteSupplierGroupList, insertSupplierGroupList, updateSupplierGroupList } from "@/api/oaManage/productMkCenter";

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

    showMessageBox(`确认要删除名称为【${row.groupName}】的分组吗?`)
      .then(() => {
        deleteSupplierGroupList({ id: row.id }).then((res) => {
          if (res.data) {
            message.success("删除成功");
            fn();
          }
        });
      })
      .catch(console.log);
  };

  const openDialog = async (type: string, row?) => {
    console.log(row, "edit row");
    const titleObj = { add: "新增供应商分组", edit: "修改供应商分组" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      groupName: row?.groupName ?? "",
      number: row?.number ?? "",
      id: row?.id ?? ""
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
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  if (currentCallBack.value && typeof currentCallBack.value === "function") {
                    currentCallBack.value();
                  }
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: insertSupplierGroupList, edit: updateSupplierGroupList };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
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
