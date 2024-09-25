<!-- /*
 * @Author: Hailen 
 * @Date: 2024-06-05 15:12:21 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-06-05 15:12:21 
 */ -->

<script setup lang="tsx">
import { setColumn } from "@/utils/table";
import { showMessageBox } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { PureTableBar } from "@/components/RePureTableBar";
import { h, ref, reactive, onMounted, computed } from "vue";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { getMaterialChildList, MaterialChildItemType } from "@/api/oaManage/productMkCenter";
import SearchList from "@/components/SearchList/index.vue";

const props = defineProps({
  id: { type: [String], default: "" },
  materialId: { type: [Number], default: 0 },
  modelValue: { type: [String], default: "" }
});
const tableRef = ref();
const rowData = ref();
const loading = ref(false);
const dataList = ref<MaterialChildItemType[]>([]);
const formData = reactive({ materialNumber: "", materialId: 0 });
const formRules = reactive({ materialNumber: [{ required: true, message: "请选择物料", trigger: "blur" }] });
const emits = defineEmits(["update:modelValue", "change", "blur"]);

onMounted(() => {
  formData.materialId = props.materialId;
  formData.materialNumber = props.modelValue;
});

const getOptionList = () => {
  loading.value = true;
  getMaterialChildList({ id: props.id })
    .then(({ data }) => {
      loading.value = false;
      dataList.value = data || [];
      const row = dataList.value.find((f) => f.id === props.materialId);
      tableRef.value?.getTableRef().setCurrentRow(row);
    })
    .catch(() => (loading.value = false));
};

function onCurrentChange(record) {
  const row = dataList.value.find((f) => f.id === record.id);
  rowData.value = row;
  const timer = setTimeout(() => {
    formData.materialNumber = row.number;
    clearTimeout(timer);
  });
}

const columnData = reactive<TableColumnList[]>([
  { label: "物料编号", prop: "number", width: 140, cellRenderer: ({ row, column }) => <span v-html={row[column["property"]]} /> },
  { label: "物料名称", prop: "name", width: 180, cellRenderer: ({ row, column }) => <span v-html={row[column["property"]]} /> },
  { label: "规格型号", prop: "specification", cellRenderer: ({ row, column }) => <span v-html={row[column["property"]]} /> }
]);

const columns = setColumn({ columnData: columnData, operationColumn: { hide: true } });

const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      prop: "materialId",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <PureTableBar columns={columns} show-icon={false}>
            {{
              title: () => (
                <SearchList v-model={dataList.value} bright={true} placeholder="请输入物料编号、名称、规格" propKeys={["number", "name", "specification"]}>
                  {{ prepend: () => <span>搜索物料</span> }}
                </SearchList>
              ),
              default: (props) => {
                return (
                  <pure-table
                    ref={tableRef}
                    height={360}
                    border
                    row-key="id"
                    adaptive={true}
                    align-whole="center"
                    size={props.size}
                    data={dataList.value}
                    columns={props.dynamicColumns}
                    paginationSmall={props.size === "small"}
                    highlight-current-row
                    show-overflow-tooltip={true}
                    onRowClick={onCurrentChange}
                  />
                );
              }
            }}
          </PureTableBar>
        );
      }
    }
  ];
};

function onRowClick() {
  const formRef = ref();
  getOptionList();
  addDialog({
    title: "选择物料",
    props: {
      loading: loading,
      formInline: formData,
      formRules: formRules,
      formConfigs: formConfigs()
    },
    width: "860px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      FormRef.validate(async (valid) => {
        if (valid) {
          showMessageBox(`确认选择该物料吗?`).then(() => {
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
  <el-input v-model="formData.materialNumber" @blur="(e) => emits('blur', e)" @change="(e) => emits('change', e)" placeholder="选择或输入" size="small">
    <template #append>
      <el-button @click.stop="onRowClick" size="small">选择</el-button>
    </template>
  </el-input>
</template>
