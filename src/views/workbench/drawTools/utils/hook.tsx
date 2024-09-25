/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-11 16:37:00
 */

import { Delete, Plus } from "@element-plus/icons-vue";
import { RendererType, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import Mxgraph from "../mxgraph/index.vue";
import { addDialog } from "@/components/ReDialog";
import { dayjs } from "element-plus";
import { orgchartData } from "@/api/workbench/teamManage";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import xmlStr from "../mxgraph/utils/xmlConf";

export type DrawListItem = {
  uuid: string;
  name: string;
  xml: string;
  svg: string;
  createTime: string;
};

export const useConfig = () => {
  const route = useRoute();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<DrawListItem[]>([]);
  const rowDatas = ref<DrawListItem[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 56);
  const tableRef = ref();
  const Draw_List_Key = "draw_list";

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  async function getColumnConfig() {
    const imgRender: RendererType = ({ row }) => {
      return (
        <el-image
          fit="contain"
          src={row.img}
          z-index={999}
          zoom-rate={1.2}
          preview-src-list={[row.img]}
          preview-teleported={true}
          hide-on-click-modal={true}
          class="border-line br-8 ui-va-m"
          style="width: 80px; height: 80px;"
        >
          {{ error: () => "-" }}
        </el-image>
      );
    };

    let columnData: TableColumnList[] = [
      { label: "图表名称", prop: "name" },
      { label: "xml", prop: "xml" },
      { label: "svg", prop: "svg" },
      { label: "img", prop: "img", align: "center", cellRenderer: imgRender },
      { label: "创建时间", prop: "createTime", minWidth: 160 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{ img: imgRender }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, dataList, selectionColumn: { hide: false } });
  }

  function getTableList() {
    loading.value = true;
    // 模拟接口
    orgchartData({})
      .then((res) => {
        loading.value = false;
        // 本地数据存储
        const localList = JSON.parse(localStorage.getItem(Draw_List_Key) || "[]");
        const defaultItem = { uuid: uuidv4(), xml: xmlStr, svg: "", name: "图纸1.xml", createTime: "2024-01-10 15:58:21" };
        const graphList = localList.length ? localList : [defaultItem];
        dataList.value = graphList;
      })
      .catch(() => (loading.value = false));
  }

  // 刷新
  const onRefresh = () => getTableList();
  // 新增
  const onAdd = () => openDialog("add");
  // 修改
  const onEdit = (row) => openDialog("edit", row);

  // 新增|修改(弹窗)
  function openDialog(type, row?: DrawListItem) {
    const title = { add: "新增", edit: "修改" }[type];
    const name = row?.name ?? "图表";
    const graphData = ref();
    // 保存图表事件
    const saveGraph = (data) => (graphData.value = data);

    addDialog({
      title: `${title + name}`,
      props: { type, row },
      width: "640px",
      draggable: true,
      fullscreen: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      class: "full-dialog",
      okButtonText: "保存",
      contentRenderer: () => h(Mxgraph, { onSaveGraph: saveGraph }),
      beforeSure: (done, { options }) => {
        showMessageBox(`确定要提交吗?`).then(() => {
          if (!graphData.value) return message("请保存图形", { type: "warning" });
          const { fileName, ...reset } = graphData.value;
          const createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
          const itemData = { ...reset, name: fileName, createTime };
          if (type === "edit") {
            const index = dataList.value.findIndex((item) => item.uuid === item.uuid);
            dataList.value.splice(index, 1, itemData); // 编辑
          } else {
            dataList.value = [...dataList.value, itemData]; // 添加
          }
          localStorage.setItem(Draw_List_Key, JSON.stringify(dataList.value));
          getTableList();
          done();
        });
      }
    });
  }

  // 批量删除
  function onBatchDelete() {
    if (rowDatas.value.length === 0) return message("请选择删除内容", { type: "error" });
    showMessageBox("确认要删除吗?")
      .then(() => onDelete(rowDatas.value))
      .catch(console.log);
  }

  // 单个删除
  function onDelete(rows: DrawListItem[]) {
    const uuids = rows.map((item) => item.uuid);
    dataList.value = dataList.value.filter((item) => !uuids.includes(item.uuid));
    localStorage.setItem(Draw_List_Key, JSON.stringify(dataList.value));
  }

  // 单选
  function onRowClick(row: DrawListItem) {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  }
  // 多选
  function handleSelectionChange(rows: DrawListItem[]) {
    rowDatas.value = rows;
  }

  const buttonList = ref<ButtonItemType[]>([
    { text: "新增", type: "primary", clickHandler: onAdd, icon: Plus, isDropDown: false },
    { text: "批量删除", type: "danger", clickHandler: onBatchDelete, icon: Delete, isDropDown: false }
  ]);

  return {
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    route,
    onEdit,
    onRefresh,
    onDelete,
    onRowClick,
    handleSelectionChange
  };
};
