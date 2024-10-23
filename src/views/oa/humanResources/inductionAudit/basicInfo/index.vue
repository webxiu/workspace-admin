<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="基本信息" name="basic">
      <EditForm
        :formInline="detailInfo"
        :loading="loading"
        :formConfigs="basicFormConfigs()"
        :formProps="{ labelWidth: '120px' }"
        class="preview-disabled-form"
      />
    </el-tab-pane>
    <el-tab-pane label="相关照片" name="photo">
      <Photo v-loading="loading" :src-list="detailInfo?.inductionCheckinPhotoVOList || []" />
    </el-tab-pane>
    <el-tab-pane label="教育经历" name="education">
      <PureTableBar :columns="educationColumns('view')" class="flex-1" :showIcon="false">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight / 2"
            :max-height="maxHeight / 2"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="detailInfo?.inductionCheckinEducationVOList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
          />
        </template>
      </PureTableBar>
    </el-tab-pane>
    <el-tab-pane label="家庭关系" name="family">
      <PureTableBar :columns="foFamilyColumns('view')" class="flex-1" :showIcon="false">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight / 2"
            :max-height="maxHeight / 2"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="detailInfo?.inductionCheckinFamilyVOList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
          />
        </template>
      </PureTableBar>
    </el-tab-pane>
    <el-tab-pane label="工作经历" name="work">
      <PureTableBar :columns="workColumns" class="flex-1" :showIcon="false">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight / 2"
            :max-height="maxHeight / 2"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="detailInfo?.inductionCheckinWorkVOList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
          />
        </template>
      </PureTableBar>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Photo from "./Photo.vue";
import { message } from "@/utils/message";
import { basicFormConfigs } from "../utils/config";
import EditForm from "@/components/EditForm/index.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { inductionAuditDetail, InductionAuditDetailResType } from "@/api/oaManage/humanResources";
import { educationColumns, foFamilyColumns, workColumns } from "@/views/oa/humanResources/staffInfo/utils/config";

const props = defineProps<{ maxHeight: number; id: number }>();

const activeName = ref("basic");
const loading = ref<boolean>(false);
const detailInfo = ref<Partial<InductionAuditDetailResType>>({});

watch(props, (values) => getDetailInfo(values.id), { immediate: true });

function getDetailInfo(id: number) {
  loading.value = true;
  inductionAuditDetail({ id })
    .then((res) => {
      loading.value = false;
      if (!res.data) return message("详情信息获取失败", { type: "error" });
      detailInfo.value = res.data;
    })
    .catch(() => (loading.value = false));
}
</script>
