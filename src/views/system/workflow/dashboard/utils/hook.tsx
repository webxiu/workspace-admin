/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-12 10:29:59
 */

import {
  FlowKingdeeItemType,
  FlowOAItemType,
  FlowWechatItemType,
  changeApproval,
  flowKingdeeList,
  flowOAList,
  flowWechatList,
  getQywxDataByMonth
} from "@/api/systemManage";
import { getMenuColumns, setColumn } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import ChangeModal from "../changeModal.vue";
import { addDialog } from "@/components/ReDialog";
import { dayjs } from "element-plus";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList1 = ref<FlowOAItemType[]>([]);
  const dataList2 = ref<FlowKingdeeItemType[]>([]);
  const dataList3 = ref<FlowWechatItemType[]>([]);
  const loading1 = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const loading3 = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 170);
  const activeName = ref<string>("oa");
  const defMonth = ref<string>("");

  const formData = reactive({
    page: 1,
    limit: 10000,
    month: new Date(),
    oaStatus: "1",
    kingdeeStatus: "2",
    wechatStatus: "1"
  });

  const statusColor = {
    未审核: "rgba(0, 150, 136, 1)",
    已审核: "#67c23a",
    审核中: "#409eff",
    已通过: "#67c23a",
    重新审核: "#f56c6c",
    已撤销: "#881798",
    通过后撤销: "#E74856",
    已删除: "#C50F1F"
  };

  const oaOptions = [
    { label: "未审核", value: "1" },
    { label: "已审核", value: "2" }
  ];
  const kingdeeOptions = [
    { label: "已审核", value: "1" },
    { label: "审核中", value: "2" }
  ];
  const wechatOptions = [
    { label: "审核中", value: "1" },
    { label: "已通过", value: "2" },
    { label: "重新审核", value: "3" },
    { label: "已撤销", value: "4" },
    { label: "通过后撤销", value: "6" },
    { label: "已删除", value: "7" }
  ];

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  // 三个表格列配置一样
  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "业务单号", prop: "billNo", minWidth: 160 },
      { label: "业务类型", prop: "deployKey", minWidth: 200, sortable: true },
      { label: "发起人", prop: "processCreateUserName", sortable: true },
      { label: "发起时间", prop: "processStartTime", minWidth: 160, sortable: true },
      { label: "当前审批人", prop: "approverUserNames", sortable: true },
      {
        label: "审核状态",
        prop: "status",
        sortable: true,
        cellRenderer({ row }) {
          const style = { color: "#fff", padding: "3px 6px", borderRadius: "4px", background: statusColor[row.status] };
          return <span style={style}>{row.status}</span>;
        }
      },
      { label: "当前审批耗时(H)", prop: "currentStageTime", align: "right", minWidth: 160 },
      { label: "总耗时(H)", prop: "processDuration", align: "right" }
    ];
    const { columnArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = () => {
    const { month } = formData;
    const _month = dayjs(month || new Date()).format("YYYY-MM");
    defMonth.value = _month;
    getOAList();
    getKingdeeList();
    getWechatListt();
  };

  // 获取OA列表
  const getOAList = () => {
    const { page, limit, oaStatus } = formData;
    const params = { page, limit, month: defMonth.value, status: oaStatus };
    loading1.value = true;
    flowOAList(params)
      .then((res) => {
        loading1.value = false;
        dataList1.value = res.data;
      })
      .catch(() => (loading1.value = true));
  };

  // 获取金蝶列表
  const getKingdeeList = () => {
    const { page, limit, kingdeeStatus } = formData;
    const params = { page, limit, month: defMonth.value, status: kingdeeStatus };
    loading2.value = true;
    flowKingdeeList(params)
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data;
      })
      .catch(() => (loading2.value = false));
  };

  // 获取企业微信列表
  const getWechatListt = () => {
    const { page, limit, wechatStatus } = formData;
    const params = { page, limit, month: defMonth.value, status: wechatStatus };
    loading3.value = true;
    flowWechatList(params)
      .then((res) => {
        loading3.value = false;
        dataList3.value = res.data;
      })
      .catch(() => (loading3.value = false));
  };

  // 更改审批人
  const onChangeAuditPeople = () => {
    const formRef = ref();
    const formData = reactive({
      oldAssign: "",
      oldName: "",
      newAssign: "",
      newName: ""
    });
    addDialog({
      title: "添加角色",
      props: { formData },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ChangeModal, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const userRow = formRef.value.getRef();
        const { oldAssign, oldName, newAssign, newName } = userRow;
        if (!oldAssign || !newAssign) return;
        showMessageBox(`确认要将【${oldName}】更改为【${newName}】吗?`).then(() => {
          changeApproval({ oldAssign, newAssign })
            .then((res) => {
              done();
              getOAList();
              message("更改成功");
            })
            .catch(console.log);
        });
      }
    });
  };

  // 抓取当前月份数据
  const onMonthData = () => {
    loading3.value = true;
    getQywxDataByMonth({ month: defMonth.value })
      .then((res) => {
        if (res.data) {
          message("数据抓取成功");
          getWechatListt();
        } else {
          message("数据抓取成功", { type: "error" });
        }
      })
      .catch(console.log);
  };

  return {
    formData,
    loading1,
    loading2,
    loading3,
    columns,
    dataList1,
    dataList2,
    dataList3,
    maxHeight,
    oaOptions,
    kingdeeOptions,
    wechatOptions,
    activeName,
    onSearch,
    onRefresh,
    onMonthData,
    onChangeAuditPeople
  };
};
