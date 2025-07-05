<script lang="tsx">
import { defineComponent, computed, PropType, CSSProperties } from "vue";
import { JSX } from "vue/jsx-runtime";

export type DataItemType = Record<string, any>;

/** 渲染参数 */
export interface RanderParams {
  index: number;
  row: DataItemType;
  column: TableColumnType;
}

/** 行属性 */
export interface TableColumnType extends TableColumnList {
  rowspan?: number;
  colspan?: number;
  style?: CSSProperties;
  headStyle?: CSSProperties;
  prop: string;
  render?: ((params: RanderParams) => JSX.Element | string) | JSX.Element;
}

/** 表格属性 */
const props = {
  autoIndex: { type: Boolean, default: true },
  align: { type: String, default: "center" },
  loading: { type: Boolean, default: false },
  columns: { type: Array as PropType<TableColumnType[][]>, default: () => [] },
  dataList: { type: Array as PropType<DataItemType[]>, default: () => [] }
};

export default defineComponent({
  props: props,
  emits: [],
  setup(props, { slots }) {
    const _dataList = computed(() => props.dataList);
    const _columns = computed(() => props.columns[props.columns.length - 1]);
    let sumIndex = 0;

    const renderHead = (arr: TableColumnType[], index: number) => {
      return arr
        .filter((item) => {
          const dataCols = props.columns[index - 1];
          if (dataCols) {
            const fields = dataCols.filter((f) => f.rowspan).map((m) => m.prop);
            return !fields.includes(item.prop);
          }
          return true;
        })
        .map((col) => {
          const { render, headerAlign = "center", headStyle = {}, width, ...rest } = col;
          let innerEle: JSX.Element | string = col.label;
          if (typeof render === "function") {
            innerEle = render({ row: {}, column: rest, index });
          }
          return col.hide ? null : (
            <td
              class="fw-700"
              key={col.prop}
              title={col.prop}
              colspan={col.colspan}
              rowspan={col.rowspan}
              align={col.headerAlign}
              style={{ ...headStyle, minWidth: width ? `${width}px` : undefined }}
            >
              {innerEle}
            </td>
          );
        });
    };

    const renderBody = (dataList: DataItemType[]) => {
      if (!dataList.length)
        return (
          <tr>
            <td colspan={_columns.value.length}>
              <el-empty description="暂无数据" image-size={60} />
            </td>
          </tr>
        );
      return dataList.map((row, index) => {
        if (row.colspan) sumIndex = 0;
        else sumIndex++;
        return !row.colspan ? (
          <tr key={row.id} class={row.active ? "summary" : ""}>
            {renderTD(_columns.value, row, index)}
          </tr>
        ) : (
          <tr key={row.id} class={row.active ? "summary" : ""}>
            <td colspan={row.colspan}>
              <span class="print-cell">{row.staffName}</span>
            </td>
            {renderTD(_columns.value.slice(row.colspan), row, index)}
          </tr>
        );
      });
    };

    const renderTD = (arr: TableColumnType[], row: DataItemType, index: number) => {
      return arr.map((column) => {
        const { render, hide, align = props.align, style } = column;
        let innerEle = row[column.prop as string];
        if (column.prop === "index") innerEle = props.autoIndex ? index + 1 : sumIndex;
        if (typeof render === "function") {
          innerEle = render({ row, column, index });
        }
        return hide ? null : (
          <td key={column.prop} align={align} style={style}>
            <span class="print-cell">{innerEle}</span>
          </td>
        );
      });
    };

    return () => (
      <div class="print-salary" v-loading={props.loading}>
        <table class="ui-w-100">
          <thead>
            {props.columns.map((arr, index) => (
              <tr class="head-tr">{renderHead(arr, index)}</tr>
            ))}
          </thead>
          <tbody>{renderBody(_dataList.value)}</tbody>
          <tfoot>
            <tr>{/* <td colspan={_columns.value.length + 1}>结果</td> */}</tr>
          </tfoot>
        </table>
      </div>
    );
  }
});
</script>

<style lang="scss">
$padding: 2px 4px;
$textColor: #272727;
$bgColor: #ccc;
$summaryBgColor: #ddd;

.print-salary {
  page-break-after: always;
  table {
    border-collapse: collapse;
  }
  td {
    /** 英文的宋体 */
    font-family: "Times New Roman", Times, serif;
    color: $textColor;
    padding: $padding;
    line-height: 14px;
    font-size: 10px !important;
    border: 1px solid $textColor;
  }
  thead td {
    font-weight: 700;
    text-align: center;
    background: $bgColor;
    white-space: nowrap;
    font-size: 9px !important;
  }
  tr.summary td {
    background: $summaryBgColor;
    font-weight: 700;
  }
}
</style>
