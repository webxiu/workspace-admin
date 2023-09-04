/*
 * @Author: lixiuhai
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-07 15:20:29
 */

import { Ref, nextTick } from "vue";
import { RowHandleType, TableColumnItemType, TableDataItemType } from "./hook";

import Sortable from "sortablejs";

// import dayjs from "dayjs";

/** 编辑表格列占比, 24格列网格, 每个表单项占8格 */
const GridSpan = 12;

/** 字段过滤 */
const filterHandler = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};

/** 过滤列数据 */
const filterColData = (dataList: Ref<TableDataItemType[]>, prop: string) => {
  return dataList.value.map((item) => {
    return { text: item[prop], value: item[prop] };
  });
};

/** 行拖拽(需要等列配置加载完成在初始化) */
const rowDrop = (dataList: Ref<TableDataItemType[]>, event: MouseEvent) => {
  event.preventDefault();
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(".el-table__body-wrapper tbody");
    Sortable.create(wrapper, {
      animation: 300,
      // handle: ".drag-btn",
      handle: ".el-table__row",
      onEnd: ({ newIndex, oldIndex }) => {
        const currentRow = dataList.value.splice(oldIndex, 1)[0];
        dataList.value.splice(newIndex, 0, currentRow);
      }
    });
  });
};

/** 列拖拽 */
export const columnDrop = (columnsDrag: TableColumnItemType, event: Event) => {
  event.preventDefault();
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(".el-table__header-wrapper tr");
    Sortable.create(wrapper, {
      animation: 300,
      delay: 0,
      onEnd: ({ newIndex, oldIndex }) => {
        const oldItem = columnsDrag.value[oldIndex];
        columnsDrag.value.splice(oldIndex, 1);
        columnsDrag.value.splice(newIndex, 0, oldItem);
      }
    });
  });
};

// 表格配置
export const getColumns = (dataList: Ref<TableDataItemType[]>): TableColumnList[] => [
  { type: "expand", align: "left" }, // 展开表格
  { type: "selection", align: "left" }, // 显示多选
  {
    label: "选择",
    minWidth: 120,
    align: "center",
    cellRenderer: () => <el-radio label="&nbsp;" size="large" />
  },
  { label: "序号", type: "index", minWidth: 80, align: "center" },
  {
    label: "组织ID",
    prop: "id",
    sortable: true,
    minWidth: 280,
    filters: filterColData(dataList, "id"),
    filterMethod: filterHandler,
    cellRenderer: ({ row }) => (
      <div class="flex items-center">
        <iconify-icon-online icon="icon-park-outline:drag" class="drag-btn cursor-grab" onMouseenter={(event: MouseEvent) => rowDrop(dataList, event)} />
        <p class="ml-[16px]">{row.id}</p>
      </div>
    )
  },
  { label: "用户名", prop: "username", sortable: true, minWidth: 160, filters: filterColData(dataList, "username"), filterMethod: filterHandler },
  { label: "年龄", prop: "age", sortable: true, minWidth: 160, filters: filterColData(dataList, "age"), filterMethod: filterHandler },
  { label: "color", prop: "color", sortable: true, minWidth: 160 },
  { label: "desc", prop: "desc", sortable: true, minWidth: 160 },
  { label: "title", prop: "title", sortable: true, minWidth: 160 },
  { label: "money", prop: "money", sortable: true, minWidth: 160 },
  { label: "word", prop: "word", sortable: true, minWidth: 160 },
  { label: "borth", prop: "borth", sortable: true, minWidth: 160 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 }, // formatter: ({ createTime }) => dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "操作", fixed: "right", width: 140, slot: "operation" }
];

// 表单配置
export const formConfigs = (type: RowHandleType): TableColumnList[] => {
  let idItem: TableColumnList[] = [];
  if (type === "edit") {
    idItem = [{ label: "组织ID", prop: "id", disabled: true, span: GridSpan }];
  }
  return [
    /** ===================== 分类标题配置 ========================= */
    { label: "表单配置", hide: true /** 配置标题使用 */ },
    ...idItem,
    { label: "用户名", prop: "username", span: GridSpan },
    { label: "年龄", prop: "age", span: GridSpan },
    {
      label: "状态",
      prop: "status",
      span: GridSpan,
      options: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 }
      ]
    }
  ];
};
