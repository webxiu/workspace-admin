<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-05 09:56:06 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-05 09:56:06 
 */ -->

<script setup lang="ts">
import { ref, PropType, reactive, h } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import EditForm from "@/components/EditForm/index.vue";
import { addformRules, formConfigs } from "./utils/config";
import { message, showMessageBox } from "@/utils/message";
import { detailFormRules, detailFormConfigs, billState, auditState } from "./utils/config";
import { addDialog } from "@/components/ReDialog";
import { onMounted } from "vue";
import dayjs from "dayjs";
import { customerComplaintDetail, ComplaintTypeItemType, CustomerComplaintItemType, CustomerComplaintDtailListItemType } from "@/api/oaManage/marketing";
import { downloadFile } from "@/utils/common";
import { setColumn } from "@/utils/table";
import AddUserModal from "@/views/system/workflow/dashboard/addModal.vue";
import { DeptUserItemType, systemParamsValueList } from "@/api/systemManage";
import { getUserInfo } from "@/utils/storage";

type SendItemType = { userName: string; id: string } | DeptUserItemType;

const props = defineProps({
  /** 单据类型 */
  billTypeList: {
    type: Array as PropType<ComplaintTypeItemType[]>,
    default: () => []
  },
  /** 行数据 */
  row: {
    type: Object as PropType<CustomerComplaintItemType>,
    default: () => ({})
  },
  /** 添加|修改 */
  type: { type: String, default: "" }
});

const userInfo = getUserInfo();
const maxHeight = 200;
const formRef = ref();
const detailData = ref<CustomerComplaintItemType>();
const rowData = ref<CustomerComplaintDtailListItemType>();
const complaintOptions = ref(props.billTypeList);
const loading = ref<boolean>(false);
const dataList = ref<CustomerComplaintDtailListItemType[]>([]);
const sendList = ref<SendItemType[]>([]);
const sendColor = ["success", "warning", "info", "danger", ""] as const;
const columns = ref<TableColumnList[]>([]);
const formData = reactive({
  id: "",
  reply: "",
  updateReplyFile: false,
  file: "",
  fileName: "",
  customer: "",
  title: "",
  orderNo: "",
  createUserName: "",
  createDate: "",
  billNo: "",
  remindList: "",
  resourceName: "",
  resourceUrl: "",
  complaintEntryList: []
});

onMounted(() => {
  getRightList();
  getColumnConfig();
  getTableList();
});

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "产品型号", prop: "productModel", minWidth: 160 },
    { label: "订单数量", prop: "orderQuantity", minWidth: 100 },
    { label: "单位", prop: "unit", minWidth: 80 },
    { label: "客诉类型", prop: "typeName", minWidth: 100 },
    { label: "客诉日期", prop: "complaintDate", minWidth: 160 },
    { label: "客诉数量", prop: "quantity", minWidth: 100 },
    { label: "样品提交日期", prop: "sampleSubmitDate", minWidth: 120 },
    { label: "客诉问题", prop: "question", minWidth: 160 },
    { label: "客诉问题描述", prop: "questionDescribe", minWidth: 220 },
    { label: "客诉附件", prop: "fileName", minWidth: 140 }
  ];
  columns.value = setColumn({ columnData, operationColumn: { minWidth: 220 } });
};

// 获取默认抄送人列表
const getRightList = () => {
  if (props.type === "edit") return;
  systemParamsValueList({ page: 1, limit: 10000, id: 30 })
    .then((res) => {
      const data = res.data || [];
      const sList = data.map((item) => {
        const arr = item.systemparamValue.split("-");
        return { userName: arr[0], id: arr[1] } as any;
      });
      sendList.value = sList;
    })
    .catch(console.log);
};

const getTableList = () => {
  if (!props.row?.id) {
    if (userInfo) {
      formData.createUserName = userInfo.userName;
      formData.createDate = dayjs().format("YYYY-MM-DD");
    }
    return;
  }
  loading.value = true;
  customerComplaintDetail({ id: props.row.id })
    .then((res) => {
      const data = res.data;
      loading.value = false;
      detailData.value = data;
      dataList.value = data.complaintEntryList;
      const peopleList = data.remindList
        .split(";")
        .filter(Boolean)
        .map((item) => {
          const arr = item.split("-");
          return { userName: arr[0], id: arr[1] };
        });

      sendList.value = peopleList;
      Object.keys(formData).forEach((key) => {
        if (data[key]) formData[key] = data[key];
      });
    })
    .catch((err) => (loading.value = false));
};

const onCurrentChange = (row: CustomerComplaintDtailListItemType) => {
  if (!row) return;
  rowData.value = row;
};

// 增行
const onAdd = () => {
  openDialog("add");
};
// 修改
const onEdit = (row: CustomerComplaintDtailListItemType) => {
  openDialog("edit", row);
};

const openDialog = (type: "add" | "edit", row?: CustomerComplaintDtailListItemType) => {
  if (detailData?.value && [1, 2, 3].includes(detailData?.value.marketState)) {
    return message(`单据状态为${billState[detailData?.value.marketState]}，禁用客诉明细修改`, { type: "error" });
  }

  const title = { add: "新增", edit: "修改" }[type];
  const formRef = ref();
  const _formData = reactive<CustomerComplaintDtailListItemType>({
    entryid: row?.entryid ?? 0,
    complaintId: row?.complaintId ?? 0,
    productModel: row?.productModel ?? "",
    unit: row?.unit ?? "",
    orderQuantity: row?.orderQuantity ?? "",
    quantity: row?.quantity ?? "",
    type: row?.type ?? "",
    typeName: row?.typeName ?? "",
    complaintDate: row?.complaintDate ?? "",
    question: row?.question ?? "",
    sampleSubmitDate: row?.sampleSubmitDate ?? "",
    questionDescribe: row?.questionDescribe ?? "",
    fileName: row?.fileName ?? "",
    resourceName: row?.resourceName ?? "",
    resourceUrl: row?.resourceUrl ?? ""
  });

  addDialog({
    title: `${title}客诉明细`,
    props: {
      formInline: _formData,
      formRules: detailFormRules,
      formProps: { labelWidth: "120px" },
      formConfigs: detailFormConfigs({ isEdit: props.row?.id, complaintOptions })
    },
    width: "720px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormObj = formRef.value.getRef();
      _formData.complaintDate = dayjs(_formData.complaintDate).format("YYYY-MM-DD");
      _formData.sampleSubmitDate = dayjs(_formData.sampleSubmitDate).format("YYYY-MM-DD");
      _formData.typeName = complaintOptions.value.find(({ optionValue }) => optionValue === _formData.type)?.optionName;
      FormObj.validate((valid) => {
        if (valid) {
          showMessageBox(`确定要${title}吗？`)
            .then(() => {
              if (type === "add") {
                dataList.value = [...dataList.value, _formData];
              } else {
                const index = dataList.value.findIndex((item) => item.entryid === _formData.entryid);
                if (index > -1) {
                  dataList.value.splice(index, 1, _formData);
                }
              }
              formData.complaintEntryList = dataList.value;
              message(title + "成功");
              done();
            })
            .catch(console.log);
        }
      });
    }
  });
};

//删行
const onDelete = (row?: CustomerComplaintDtailListItemType) => {
  if (detailData?.value && [1, 2, 3].includes(detailData?.value.marketState)) {
    return message(`单据状态为${billState[detailData?.value.marketState]}，禁用客诉明细修改`, { type: "error" });
  }
  const curRow = row || rowData.value;
  if (!curRow) return message("请选择产品", { type: "error" });
  dataList.value = dataList.value.filter((item) => item.entryid !== curRow.entryid);
};

// 附件下载
const onDownload = () => {
  const url = formData.resourceUrl + "/" + formData.resourceName;
  downloadFile(url, formData.fileName);
};

// 客户明细表格操作下载
const onListDownload = (row: CustomerComplaintDtailListItemType) => {
  const url = row.resourceUrl + "/" + row.resourceName;
  downloadFile(url, row.fileName);
};

// 添加抄送人
const addSendPeople = () => {
  const formRef = ref();
  addDialog({
    title: "选择用户",
    width: "850px",
    props: { multiple: true, userState: "" },
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(AddUserModal, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const rows: DeptUserItemType[] = formRef.value.getRef();
      if (!rows.length) {
        return message("请选择用户", { type: "error" });
      }
      showMessageBox(`确定要添加吗？`)
        .then(() => {
          done();
          if (sendList.value.length) {
            const selectList = sendList.value.map((item) => item.id);
            const filterList: SendItemType[] = [];
            const repeatList = rows.filter((item) => {
              if (!selectList.includes(`${item.id}`)) {
                filterList.push({ userName: item.userName, id: `${item.id}` });
                return false;
              }
              return true;
            });
            const num = repeatList.length;
            if (num > 0) message(`已过滤${num}个重复选择的抄送人`, { type: "warning" });
            sendList.value = [...sendList.value, ...filterList];
            return;
          }
          sendList.value = rows.map((item) => ({ userName: item.userName, id: `${item.id}` }));
        })
        .catch(console.log);
    }
  });
};

// 移除抄送人
const onCloseSend = (item: SendItemType) => {
  sendList.value = sendList.value.filter((f) => f.id !== item.id);
};

function getRef() {
  return { formRef: formRef.value?.getRef(), formData, sendList, detailData: detailData.value };
}

defineExpose({ getRef });
</script>

<template>
  <div class="ui-w-100 ui-h-100 flex-col flex-1 main main-content" v-loading="loading">
    <EditForm
      class="preview-disabled-form"
      :formRules="addformRules"
      :formInline="formData"
      :formConfigs="formConfigs({ detailData, onDownload })"
      ref="formRef"
      :formProps="{ labelWidth: '120px' }"
    />
    <el-divider content-position="left"><span class="fz-20">客诉明细</span></el-divider>
    <PureTableBar :columns="columns" :showIcon="false">
      <template #title>
        <div>
          <el-button type="primary" @click="onAdd">增行</el-button>
          <el-button type="danger" @click="() => onDelete()">删行</el-button>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="itemId"
          class="user-manage"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
          @current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-button size="small" type="default" @click.stop="onEdit(row)">修改</el-button>
            <el-popconfirm :width="280" :title="`确定删除\n【${row.productModel}】吗?`" @confirm="onDelete(row)">
              <template #reference>
                <el-button size="small" type="danger" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
            <el-button v-if="row.resourceUrl && row.resourceName" size="small" type="primary" @click.stop="onListDownload(row)">下载文件</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-divider content-position="left"><span class="fz-20">抄送人清单</span></el-divider>
    <div class="flex pl-2">
      <el-button @click="addSendPeople" type="primary" v-if="!row.id || row.marketState === 0"
        >添加抄送人
        <span v-if="sendList.length">({{ sendList.length }})</span>
      </el-button>
      <div class="border-line p-2 ml-2 ui-w-100 ui-ovy-a" style="height: 160px">
        <el-tag
          v-for="(item, idx) in sendList"
          :key="item.id"
          :type="sendColor[idx % sendColor.length]"
          class="mx-1 mb-2 no-select"
          effect="dark"
          closable
          @close="onCloseSend(item)"
        >
          {{ item.userName }}
        </el-tag>
      </div>
    </div>
  </div>
</template>
