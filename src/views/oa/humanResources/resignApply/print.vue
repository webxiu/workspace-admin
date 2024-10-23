<template>
  <div class="resign-wrap" ref="printRef" v-loading="loading">
    <div class="flex-col align-center">
      <img src="@/assets/logo/print_color_logo.png" width="100%" />
      <p class="title">员工离职申请表</p>
    </div>
    <div class="ui-ta-r fz-12 mt-10">
      <span>FORM:QR-HR-003-03X</span>
    </div>
    <EditForm
      size="small"
      :formInline="formData"
      :formItemGutter="0"
      :formProps="{ labelWidth: '150px', requireAsteriskPosition: 'right', inlineMessage: true }"
      :formConfigs="printFormConfigs()"
      class="border-form"
    />
    <div class="remarks">
      <div>备注:</div>
      <div class="ti-12">1、离职类别栏，请在相应"□"内打"√"．</div>
      <div class="ti-12">2、核决权限：逐级签批</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import Print from "@/utils/print";
import { printFormConfigs } from "./utils/config";
import { MoldApplyItemType } from "@/api/plmManage";
import EditForm from "@/components/EditForm/index.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { approveResignApply, detailResignApply, ResignApplyItemType } from "@/api/oaManage/humanResources";

const props = defineProps<{ row?: MoldApplyItemType }>();

const printRef = ref();
const loadingArr = reactive([]);
const formData = reactive({
  ...props.row,
  other: "",
  group: "",
  groupName: "",
  department: "面谈记录/意见：",
  departmentName: "", // 面谈签名
  humanResources: "",
  mananger: ""
});
const loading = computed(() => loadingArr.length > 0);

onMounted(() => {
  if (props.row.id) {
    getDetail();
    getApproveDetail();
  }
});

const onPrint = () => {
  if (printRef.value) {
    Print(printRef.value);
  }
};

// 详情数据
function getDetail() {
  loadingArr.push(true);
  detailResignApply({ id: props.row.id })
    .then((res) => {
      loadingArr.pop();
      const row = res.data || ({} as ResignApplyItemType);
      const mergeType = row?.resignationType ?? "";
      const isOther = mergeType.slice(0, 2) === "其他";
      const other = isOther ? mergeType.slice(2) : "";
      Object.assign(formData, {
        other: other,
        resignationType: [isOther ? mergeType.slice(0, 2) : mergeType],
        applyDate: row.applyDate || dayjs().format("YYYY-MM-DD")
      });
    })
    .catch(() => loadingArr.pop());
}

// 审批详情
function getApproveDetail() {
  loadingArr.push(true);
  approveResignApply({ id: props.row.id })
    .then(({ data }) => {
      loadingArr.pop();
      const [data1, data2, data3] = data || [];
      Object.assign(formData, {
        group: data1?.handleComment,
        groupName: data1?.assignee,
        humanResources: data2?.handleComment,
        mananger: data3?.handleComment
      });
    })
    .catch(() => loadingArr.pop());
}

defineExpose({ onPrint });
</script>

<style lang="scss">
$color: #111;
$size: 16px;
@media print {
  @page {
    size: a4 portrait;
    margin: 10mm;
  }
  .el-checkbox__inner {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
}

.resign-wrap {
  color: $color;
  padding: 1px;
  font-family: "宋体", Arial, sans-serif, serif;
  .title {
    flex: 1;
    font-size: 30px;
    color: $color;
    margin-left: 50px;
    font-weight: bold;
  }
  .leave-date {
    border-top: 1px solid $color;
    font-size: $size;
    color: $color;
    width: 100%;
    padding: 15px 10px;
  }

  .remarks {
    margin-top: 10px;
    font-size: $size;
  }

  .bottom-line {
    border-bottom: 1px solid $color;
    display: inline-block;
  }

  .el-input__prefix {
    display: none;
  }
  .el-checkbox {
    margin-right: 10px;
  }

  .el-form-item label,
  .el-input__inner,
  .el-textarea__inner {
    font-size: $size;
    font-family: "宋体", Arial, sans-serif, serif;
    color: $color;
    cursor: default;
  }
  .el-checkbox__inner,
  .el-checkbox__inner::after {
    border-color: $color;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-disabled .el-checkbox__inner,
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    background-color: transparent;
    border-color: $color;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $color;
  }
  .el-checkbox.el-checkbox--small .el-checkbox__label {
    font-size: $size;
    color: $color;
    cursor: default;
  }
}
</style>
