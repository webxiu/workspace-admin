<template>
  <TableEditList ref="formRef" :loading="loading" :params="{ pageUrl: props.pageUrl, groupCode: '1' }" :formConfig="formConfig" :tableConfig="tableConfig" />
  <TitleCate name="抄送人清单" class="mt-15 mb-10">
    <el-button @click="addSendPeople" type="primary" size="small" v-if="!row.id || row.marketState === AuditState.submit">
      添加抄送人
      <span v-if="sendList.length">({{ sendList.length }})</span>
    </el-button>
  </TitleCate>
  <div class="flex">
    <div class="border-line p-2 ui-w-100 ui-ovy-a" style="height: 160px">
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
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { UploadProps } from "element-plus";
import { getUserInfo } from "@/utils/storage";
import { downloadFile } from "@/utils/common";
import { BillState } from "@/config/constant";
import { addDialog } from "@/components/ReDialog";
import TitleCate from "@/components/TitleCate.vue";
import { Delete, Plus } from "@element-plus/icons-vue";
import EditForm from "@/components/EditForm/index.vue";
import { showMessageBox, message } from "@/utils/message";
import { boolOptions, numberOptions } from "@/config/constant";
import TableEditList from "@/components/TableEditList/index.vue";
import { computed, h, onMounted, reactive, ref, watch } from "vue";
import { FormItemConfigType, FormTableConfigType } from "@/utils/form";
import AddUserModal from "@/views/system/workflow/dashboard/addModal.vue";
import { DeptUserItemType, systemParamsValueList } from "@/api/systemManage";
import { AuditState, replyAccept, baseApi, AuditStateName, detailFormConfigs, detailFormRules } from "./utils/config";
import { customerComplaintDetail, ComplaintTypeItemType, CustomerComplaintItemType, CustomerComplaintDtailListItemType } from "@/api/oaManage/marketing";

type SendItemType = { userName: string; id: string } | DeptUserItemType;

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  row?: CustomerComplaintItemType;
  billTypeList?: ComplaintTypeItemType[];
  pageUrl?: string;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  type: "add",
  row: () => ({} as CustomerComplaintItemType),
  billTypeList: () => []
});

const userInfo = getUserInfo();
const formRef = ref();
const loading = ref(false);
const sendList = ref<SendItemType[]>([]);
const detailData = ref<CustomerComplaintItemType>();
const rowData = ref<CustomerComplaintDtailListItemType>();
const dataList = ref<CustomerComplaintDtailListItemType[]>([]);
const complaintOptions = ref<ComplaintTypeItemType[]>(props.billTypeList);
const sendColor = ["success", "warning", "info", "danger", ""] as const;
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
  getUserList();
  getOption();
});
watch(props, watchUpdata, { deep: true });

function watchUpdata(values) {
  Object.assign(formData, values.row);
}

const formConfig = computed<FormItemConfigType[]>(() => {
  // 审核状态为已接收或已回复，禁用客诉明细修改, 显示回复表单
  const showStatus = [AuditState.receive, AuditState.reply, AuditState.discard].includes(detailData.value?.marketState);
  return [
    {
      formData: formData,
      customProps: {},
      customElement: { fileName },
      customColumn: {
        reply: { hide: !showStatus },
        fileName: { hide: !showStatus }
      },
      dataOption: { exmpetAttendance: boolOptions, isPoorPeople: numberOptions },
      formProps: { labelWidth: "100px" }
    }
  ];
});

const tableSlots = () => {
  return {
    operation: ({ row }) => (
      <>
        <el-button size="small" onClick={(e) => onEdit(row)}>
          修改
        </el-button>
        <el-popconfirm width={280} title={`确定删除\n【${row.productModel}】吗?`} onConfirm={() => onDelete(row)}>
          {{
            reference: () => (
              <el-button size="small" type="danger" onClick={(e) => e.preventDefault()}>
                删除
              </el-button>
            )
          }}
        </el-popconfirm>
        {row.resourceUrl && row.resourceName ? (
          <el-button type="primary" size="small" onClick={(e) => onListDownload(row)}>
            下载文件
          </el-button>
        ) : null}
      </>
    )
  };
};

const tableConfig: FormTableConfigType[] = [
  {
    dataList: dataList,
    tableProps: { height: 150, maxHeight: 150, onCurrentChange },
    tableSlots: tableSlots(),
    buttonConfig: {
      buttonList: [
        { icon: Plus, size: "small", type: "primary", text: "增行", clickHandler: onAdd },
        { icon: Delete, size: "small", type: "danger", text: "删行", clickHandler: () => onDelete(rowData.value) }
      ]
    },
    tableColumnOption: {
      operationColumn: { minWidth: 220, align: "left" }
    }
  }
];

function getOption() {
  if (!props.row?.id) {
    formData.createUserName = userInfo.userName;
    formData.createDate = dayjs().format("YYYY-MM-DD");
    return;
  }
  loading.value = true;
  customerComplaintDetail({ id: props.row.id })
    .then((res) => {
      const data = res.data;
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
    .finally(() => (loading.value = false));
}

// 获取默认抄送人列表
const getUserList = () => {
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

function fileName({ formModel, row }) {
  const handleAvatarSuccess = (response) => {
    formModel["resourceName"] = response.data;
    formModel["updateReplyFile"] = true;
  };
  const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
    formModel[row.prop] = rawFile.name;
    const ext = rawFile.name.split(".")[1];
    if (!replyAccept.includes(`.${ext}`)) {
      message.error("文件格式不正确!");
      return false;
    }
    return true;
  };
  return (
    <div class="flex ui-w-100">
      <el-input v-model={formModel[row.prop]} placeholder="请上传回复附件" clearable readonly class="flex-1" />
      {[BillState.submit, BillState.reject].includes(detailData.value?.state) ? (
        <el-upload
          class="ml-4"
          accept={replyAccept.join(",")}
          action={`${baseApi}/oa/mk/customercomplaint/uploadcomplaint`}
          show-file-list={false}
          on-success={handleAvatarSuccess}
          before-upload={beforeAvatarUpload}
        >
          <el-button type="primary">选择文件</el-button>
        </el-upload>
      ) : null}
      {[AuditState.reply, AuditState.discard].includes(detailData.value?.marketState) && detailData.value?.resourceName ? (
        <el-button type="primary" class="ml-4" onClick={onDownload}>
          下载文件
        </el-button>
      ) : null}
    </div>
  );
}

// 附件下载
function onDownload() {
  const url = import.meta.env.VITE_VIRTUAL_PATH + formData.resourceUrl + "/" + formData.resourceName;
  downloadFile(url, formData.fileName);
}

// 客户明细表格操作下载
function onListDownload(row: CustomerComplaintDtailListItemType) {
  const url = import.meta.env.VITE_VIRTUAL_PATH + row.resourceUrl + "/" + row.resourceName;
  downloadFile(url, row.fileName);
}

function onCurrentChange(row: CustomerComplaintDtailListItemType) {
  rowData.value = row;
}

function checkPass(detailData?: CustomerComplaintItemType) {
  if (detailData && [AuditState.submited, AuditState.receive, AuditState.reply].includes(detailData.marketState)) {
    message.error(`审核状态为${AuditStateName[detailData.marketState]}，禁用客诉明细修改`);
    return false;
  }
  return true;
}

// 增行
function onAdd() {
  openDialog("add");
}
// 修改
function onEdit(row: CustomerComplaintDtailListItemType) {
  openDialog("edit", row);
}

function openDialog(type: "add" | "edit", row?: CustomerComplaintDtailListItemType) {
  if (!checkPass(detailData?.value)) return;

  const title = { add: "新增", edit: "修改" }[type];
  const formRef = ref();
  const _formData = reactive<CustomerComplaintDtailListItemType>({
    entryid: row?.entryid ?? 0,
    complaintId: row?.complaintId ?? 0,
    productModel: row?.productModel ?? "",
    unit: row?.unit ?? "",
    orderQuantity: row?.orderQuantity ?? "",
    quantity: row?.quantity ?? "",
    type: row?.type ? `${row?.type}` : "",
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
              message.success(title + "成功");
              done();
            })
            .catch(console.log);
        }
      });
    }
  });
}

//删行
function onDelete(row?: CustomerComplaintDtailListItemType) {
  if (!checkPass(detailData?.value)) return;
  const curRow = row || rowData.value;
  if (!curRow) return message.error("请选择产品");
  dataList.value = dataList.value.filter((item) => item.entryid !== curRow.entryid);
}

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
        return message.error("请选择用户");
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
            if (num > 0) message.warning(`已过滤${num}个重复选择的抄送人`);
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
  return new Promise((resolve) => {
    formRef.value.getRef().then(({ valid, data }) => {
      resolve({ valid, formData, sendList, detailData: detailData.value, data });
    });
  });
}

defineExpose({ getRef });
</script>
