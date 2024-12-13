<template>
  <div>
    <EditForm
      :formInline="imageFormData"
      :formConfigs="imageOptions"
      :formProps="{ inline: true, labelWidth: '120px', labelPosition: 'top' }"
      class="preview-disabled-form"
    />
  </div>
</template>

<script setup lang="tsx">
import { computed } from "vue";
import { StaffInfoPhotoVOListType } from "@/api/oaManage/humanResources";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";

const layout = { span: 4, xs: 12, sm: 12, md: 4, lg: 4, xl: 4 };
const { VITE_BASE_API } = import.meta.env;
const props = withDefaults(defineProps<{ srcList?: StaffInfoPhotoVOListType[] }>(), {
  srcList: () => []
});

const imageFormData = computed(() => {
  const imageObj = props.srcList?.reduce((cur, prev) => {
    // VITE_VIRTUAL_PATH
    cur[prev.photoType] = VITE_BASE_API + "/" + prev.resourceUrl + prev.resourceName;
    return cur;
  }, {});
  return imageObj;
});

const renderImage = ({ formModel, row }) => {
  const src = formModel[row.prop];
  return (
    <>
      <el-image
        src={src}
        fit="contain"
        zoom-rate={1.2}
        preview-src-list={[src]}
        hide-on-click-modal={true}
        initial-index={Number(row.prop) - 1}
        style={{ width: "240px", height: "240px" }}
      >
        {{ error: () => <div class="el-image__error">暂无图片</div> }}
      </el-image>
      <div class="ui-w-100 ui-ta-c">{row.label}</div>
    </>
  );
};

const imageOptions: FormConfigItemType[] = [
  { label: "个人照片", prop: "1", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "个人签名", prop: "4", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "身份证图片1", prop: "2", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "身份证图片2", prop: "3", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "银行卡图片1", prop: "5", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "银行卡图片2", prop: "6", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "健康证图片1", prop: "7", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "健康证图片2", prop: "8", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "离职证明", prop: "9", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) },
  { label: "毕业证", prop: "10", colProp: layout, slots: { label: () => <span /> }, render: ({ formModel, row }) => renderImage({ formModel, row }) }
];
</script>
