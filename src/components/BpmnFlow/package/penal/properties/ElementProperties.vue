<template>
  <div class="panel-tab__content">
    <el-table :data="elementPropertyList" size="small" max-height="240" border fit>
      <el-table-column label="序号" width="50px" type="index" />
      <el-table-column label="属性名" prop="name" min-width="100px" show-overflow-tooltip />
      <el-table-column label="属性值" prop="value" min-width="100px" show-overflow-tooltip />
      <el-table-column label="操作" width="100px">
        <template #default="{ row, $index }">
          <el-button size="small" link type="primary" @click="openAttributesForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="small" link type="danger" @click="removeAttributes(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="small" type="primary" :icon="Plus" @click="openAttributesForm(null, -1)">添加属性</el-button>
    </div>

    <el-dialog v-model="propertyFormModelVisible" title="属性配置" width="600px" append-to-body destroy-on-close>
      <el-form :model="propertyForm" label-width="80px" size="small" ref="attributeFormRef" @submit.prevent>
        <el-form-item label="属性名：" prop="name">
          <el-input v-model="propertyForm.name" clearable />
        </el-form-item>
        <el-form-item label="属性值：" prop="value">
          <el-input v-model="propertyForm.value" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="propertyFormModelVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="saveAttribute">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { inject, nextTick, ref, watch, toRaw } from "vue";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps<{
  id: string;
  type: string;
}>();

const prefix = inject("prefix");
const width = inject("width");

const elementPropertyList = ref([]);
const propertyForm = ref({
  name: "",
  value: ""
});
const editingPropertyIndex = ref(-1);
const propertyFormModelVisible = ref(false);
//
const bpmnElement = ref();
const otherExtensionList = ref([]);
const bpmnElementListeners = ref();
const listenerFormRef = ref();
const listenerFieldFormRef = ref();
const bpmnElementPropertyList = ref([]);
const attributeFormRef = ref();

watch(
  props,
  (val) => {
    if (val.id && val.id?.length) {
      nextTick(() => resetAttributesList());
    }
  },
  { immediate: true }
);

const resetAttributesList = () => {
  bpmnElement.value = window.bpmnInstances.bpmnElement;
  otherExtensionList.value = []; // 其他扩展配置
  const bpmnElementProperties =
    bpmnElement.value.businessObject?.extensionElements?.values?.filter((ex) => {
      if (ex.$type !== `${prefix}:Properties`) {
        otherExtensionList.value.push(ex);
      }
      return ex.$type === `${prefix}:Properties`;
    }) ?? [];

  // 保存所有的 扩展属性字段
  bpmnElementPropertyList.value = bpmnElementProperties.reduce((pre, current) => pre.concat(current.values), []);
  // 复制 显示
  elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList.value ?? []));
};
const openAttributesForm = (attr, index) => {
  editingPropertyIndex.value = index;
  propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr));
  propertyFormModelVisible.value = true;
  nextTick(() => {
    if (attributeFormRef.value) attributeFormRef.value.clearValidate();
  });
};
const removeAttributes = (attr, index) => {
  ElMessageBox.confirm("确认移除该属性吗？", "提示", {
    confirmButtonText: "确 认",
    cancelButtonText: "取 消"
  })
    .then(() => {
      elementPropertyList.value.splice(index, 1);
      bpmnElementPropertyList.value.splice(index, 1);
      // 新建一个属性字段的保存列表
      const propertiesObject = window.bpmnInstances.moddle.create(`${prefix}:Properties`, {
        values: bpmnElementPropertyList.value
      });
      updateElementExtensions(propertiesObject);
      resetAttributesList();
    })
    .catch(() => console.info("操作取消"));
};
const saveAttribute = () => {
  const { name, value } = propertyForm.value;
  if (editingPropertyIndex.value !== -1) {
    window.bpmnInstances.modeling.updateModdleProperties(toRaw(bpmnElement.value), bpmnElementPropertyList.value[editingPropertyIndex.value], {
      name,
      value
    });
  } else {
    // 新建属性字段
    const newPropertyObject = window.bpmnInstances.moddle.create(`${prefix}:Property`, { name, value });
    // 新建一个属性字段的保存列表
    const propertiesObject = window.bpmnInstances.moddle.create(`${prefix}:Properties`, {
      values: bpmnElementPropertyList.value.concat([newPropertyObject])
    });
    updateElementExtensions(propertiesObject);
  }
  propertyFormModelVisible.value = false;
  resetAttributesList();
};
const updateElementExtensions = (properties) => {
  const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
    values: otherExtensionList.value.concat([properties])
  });
  window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions
  });
};
</script>
