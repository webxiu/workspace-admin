<script setup lang="tsx">
import { ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import type { FormProps } from "element-plus";
import { getFormConfigs } from "@/utils/form";
import { FormColumnItemType } from "@/api/systemManage";

/** ========预览表单========= */
const props = defineProps<{ height: number; columnList: FormColumnItemType[] }>();
const formProps = reactive<Partial<FormProps>>({ labelWidth: "100px" });
const formData = ref<Record<string, any>>({ id: "" });
const formConfigs = ref<FormConfigItemType[]>([]);
const loading = ref<boolean>(false);
const route = useRoute();
const username = { onClick, onChange };

function onClick() {
  console.log("click");
}
function onChange() {
  console.log("change");
}

watch(props, (value) => {
  // 表单配置: 参考配置
  const { formData, formColumns } = getFormConfigs({
    loading,
    columnList: value.columnList,
    customProps: { username },
    customElement: {
      icon: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable>
            {{
              append: () => (
                <el-popover placement="right" width={347} trigger="click">
                  {{
                    reference: () => <el-button>选择</el-button>,
                    default: () => <div>复杂输入框, 自定义配置</div>
                  }}
                </el-popover>
              )
            }}
          </el-input>
        );
      }
    }
  });
  formData.value = { ...formData, id: "" };
  formConfigs.value = formColumns;
});

watch(
  formData,
  (value) => {
    console.log("提交数据:", value);
  },
  { deep: true }
);
</script>

<template>
  <div class="flex-1 pr-10">
    <div class="no-wrap block-quote-tip ui-w-100 ml-6 mt-10 mb-10">预览表单・{{ route.query?.menuName }}</div>
    <div class="flex-1 ui-ovy-a" :style="{ height: props.height + 'px' }">
      <EditForm :formInline="formData" :formConfigs="formConfigs" :formProps="formProps" :loading="false" class="form-config" />
    </div>
  </div>
</template>
