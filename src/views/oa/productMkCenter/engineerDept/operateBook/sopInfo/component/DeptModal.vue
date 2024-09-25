<!-- /*
 * @Author: Hailen 
 * @Date: 2024-06-05 15:12:21 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-06-05 15:12:21 
 */ -->

<script setup lang="tsx">
import { h, ref, reactive, onMounted, computed } from "vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { getDeptTreeData, DetartMenttemType } from "@/api/systemManage";

const rowData = ref();
const loading = ref(false);
const formData = reactive({ deptName: "" });
const treeOptions = ref<DetartMenttemType[]>([]);
const formRules = reactive({ deptName: [{ required: true, message: "请选择部门", trigger: "blur" }] });
const emits = defineEmits(["update:modelValue", "change", "blur"]);

const props = defineProps({
  modelValue: { type: [String], default: "" }
});

onMounted(() => {
  formData.deptName = props.modelValue;
});

const getOptionList = () => {
  loading.value = true;
  getDeptTreeData()
    .then((res) => {
      loading.value = false;
      treeOptions.value = JSON.parse(res.data) || [];
    })
    .catch(() => (loading.value = false));
};

const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "部门",
      prop: "deptName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            clearable
            data={treeOptions.value}
            check-strictly={true}
            check-on-click-node
            filterable
            render-after-expand={false}
            placeholder="请选择部门"
            class="ui-w-100"
            onCurrentChange={(val) => (rowData.value = val)}
            props={{ label: "name", value: "id" }}
          />
        );
      }
    }
  ];
};

function onRowClick() {
  const formRef = ref();
  getOptionList();
  addDialog({
    title: "选择部门",
    props: {
      loading: loading,
      formInline: formData,
      formRules: formRules,
      formConfigs: formConfigs()
    },
    width: "400px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      FormRef.validate(async (valid) => {
        if (valid) {
          showMessageBox(`确认选择该部门吗?`).then(() => {
            emits("change", rowData.value);
            done();
          });
        }
      });
    }
  });
}
</script>

<template>
  <el-input v-model="formData.deptName" @blur="(e) => emits('blur', e)" placeholder="请选择" size="small" readonly>
    <template #append>
      <el-button @click.stop="onRowClick" size="small">选择</el-button>
    </template>
  </el-input>
</template>
