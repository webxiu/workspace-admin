<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" @refresh="getTableList">
      <template #title>
        <el-button type="primary" :icon="Plus" @click="onAdd">新增</el-button>
        <el-button type="success" :icon="Check" @click="onSave">保存</el-button>
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList2" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          class="table-btn-config"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button size="small" @click.stop="onEdit('edit', row)">修改</el-button>
            <el-popconfirm :width="280" :title="`确认删除\n【${row.btnName}】吗?`" @confirm="onDelete([row])">
              <template #reference>
                <el-button type="danger" size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
<script setup lang="tsx">
import { ref, onMounted, h, reactive, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { message, showMessageBox } from "@/utils/message";
import { setColumn, getEnumDictList, moveTableRow, tableEditRender } from "@/utils/table";
import {
  menuButtonList,
  MenuButtonItemType,
  addMenuButton,
  updateMenuButton,
  deleteMenuButton,
  batchMenuButton,
  tableGroupList,
  TableGroupItemType
} from "@/api/systemManage";
import { PureTableBar } from "@/components/RePureTableBar";
import { addDialog } from "@/components/ReDialog";
import { Plus, Check } from "@element-plus/icons-vue";
import EditForm from "@/components/EditForm/index.vue";
import { OptionItemType } from "@/api/plmManage";
import { IconConf } from "@/config/elements";
import { useEleHeight } from "@/hooks";

import ButtonList from "@/components/ButtonList/index.vue";
import { dropDownList, formRules, formConfigs } from "./config";
import { ElMessage } from "element-plus";

const props = defineProps<{ menuId: number; groupId: string }>();

const route = useRoute();
const loading = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const dataList = ref<MenuButtonItemType[]>([]);
const rowsData = ref<MenuButtonItemType[]>([]);
const formData = reactive({ menuId: props.menuId, columnGroupId: props.groupId });
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 94);

onMounted(() => {
  getColumnConfig();
});

watch(
  props,
  (value) => {
    formData.menuId = value.menuId;
    formData.columnGroupId = value.groupId;
    getTableList();
  },
  { immediate: true }
);

const onUpdateIndex = () => {
  dataList.value = dataList.value.map((item, i) => ({ ...item, btnSort: i + 1 }));
};

const onSave = () => {
  batchMenuButton(dataList.value).then((res) => {
    if (res.data) {
      ElMessage({ message: "保存成功", type: "success" });
      getTableList();
    }
  });
};

// 编辑表格
const { editCellRender } = tableEditRender({
  editFinish: ({ prop, row }) => {
    if (prop === "btnSort") {
      moveTableRow<MenuButtonItemType>(dataList, row, "btnSort", "", ({ newArr }) => (dataList.value = newArr));
    }
  }
});

const getColumnConfig = async () => {
  const columnData: TableColumnList[] = [
    { label: "按钮序号", prop: "btnSort", align: "center", width: 80, cellRenderer: (data) => editCellRender({ data }) },
    { label: "按钮Key", prop: "btnKey" },
    { label: "按钮名称", prop: "btnName" },
    {
      label: "按钮预览",
      prop: "btnType",
      align: "center",
      minWidth: 180,
      cellRenderer: ({ row }) => (
        <el-button type={row.btnType} size="small" icon={IconConf[row.btnIcon]}>
          {row.btnName}
        </el-button>
      )
    },
    { label: "URL地址", prop: "url" },
    {
      label: "是否收起",
      prop: "isDropDown",
      cellRenderer: ({ row }) => {
        const result = dropDownList.find((f) => f.value === row.isDropDown)?.label;
        return <span>{result}</span>;
      }
    },
    { label: "所属分组", prop: "groupName" }
  ];

  columns.value = setColumn(
    {
      columnData,
      isDragRow: true,
      dragSelector: ".table-btn-config",
      dataList,
      selectionColumn: { hide: false },
      operationColumn: { width: 140 },
      radioColumn: false,
      indexColumn: false
    },
    onUpdateIndex
  );
};

function getTableList() {
  if (!formData.menuId || !formData.columnGroupId) return;
  loading.value = true;
  menuButtonList(formData)
    .then(({ data }) => {
      loading.value = false;
      dataList.value = data || [];
    })
    .catch(() => (loading.value = false));
}

// 添加
const onAdd = () => onEdit("add", {});

// 修改
const onEdit = (type: "add" | "edit", row?: Partial<MenuButtonItemType>) => {
  const title = { add: "新增", edit: "修改" }[type];
  const formRef = ref();
  const buttonsList = ref<OptionItemType[]>([]);
  const groupsList = ref<TableGroupItemType[]>([]);
  const sloading = ref(true);
  const _formData = reactive({
    menuId: props.menuId,
    columnGroupId: props.groupId,
    id: row.id ?? 0,
    btnKey: row.btnKey ?? "",
    btnName: row.btnName ?? "",
    btnType: row.btnType ?? "primary",
    btnSize: row.btnSize ?? "default",
    btnIcon: row.btnIcon ?? "",
    url: row.url ?? "",
    groupCode: row.groupCode ?? "",
    isDropDown: row.isDropDown ?? false
  });
  // 获取编辑下拉选项列表
  const p1 = getEnumDictList(["MenuButton"]);
  const p2 = tableGroupList({ menuId: route.query.itemId });
  Promise.all([p1, p2])
    .then((data) => {
      sloading.value = false;
      buttonsList.value = data[0]?.MenuButton;
      groupsList.value = data[1]?.data || [];
      onChangeGroup(props.groupId);
    })
    .catch(() => (sloading.value = false));

  // 按钮选择
  const onChangeBtn = (val: string) => {
    const btnItem = buttonsList.value.find(({ optionValue }) => optionValue === val);
    _formData.btnName = btnItem?.optionName;
  };

  // 分组选择
  const onChangeGroup = (val: string) => {
    const groupItem = groupsList.value.find(({ id }) => id === val);
    _formData.groupCode = groupItem.groupCode;
  };

  addDialog({
    title: title + "按钮",
    props: {
      loading: sloading,
      formInline: _formData,
      formRules: formRules,
      formConfigs: formConfigs({ _formData, buttonsList, groupsList, onChangeBtn, onChangeGroup }),
      formProps: { labelWidth: "100px" }
    },
    width: "720px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    showResetButton: true,
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeReset: () => {
      formRef.value.getRef()?.resetFields();
      onChangeGroup(formData.columnGroupId);
    },
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      if (!_formData.columnGroupId) return message("请选择分组", { type: "error" });
      FormRef.validate((valid) => {
        if (valid) {
          showMessageBox("确定要提交吗?").then(() => {
            const API = { add: addMenuButton, edit: updateMenuButton };
            API[type](_formData)
              .then(({ data }) => {
                if (!data) return message(title + "失败", { type: "error" });
                done();
                message(title + "成功");
                getTableList();
              })
              .catch(console.log);
          });
        }
      });
    }
  });
};

// 批量删除
const onDeleteAll = () => {
  if (!rowsData.value.length) return message("请选择要删除的记录", { type: "error" });
  showMessageBox("确认要删除所选记录吗?")
    .then(() => onDelete(rowsData.value))
    .catch(console.log);
};

// 删除
const onDelete = (rows) => {
  deleteMenuButton(rows)
    .then(({ data }) => {
      if (!data) return message("删除失败", { type: "error" });
      getTableList();
      message("删除成功");
    })
    .catch(console.log);
};

const handleSelectionChange = (rows: MenuButtonItemType[]) => {
  rowsData.value = rows;
};

const buttonList2 = ref<ButtonItemType[]>([{ clickHandler: onDeleteAll, type: "danger", text: "批量删除", isDropDown: false }]);
</script>
