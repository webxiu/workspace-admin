<!-- /*
 * @Author: Hailen 
 * @Date: 2024-05-16 11:02:44 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-05-16 11:02:44 
 */ -->
<script lang="tsx">
import { defineComponent, PropType, computed } from "vue";
import { JSX } from "vue/jsx-runtime";

export interface RenderParamsType {
  row: any;
  index: number;
}
export interface TableColumnType {
  label: string;
  prop: string;
  width?: number;
  type?: string;
  hide?: boolean;
  ellipsis?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  render?: ((item: RenderParamsType) => JSX.Element) | JSX.Element;
}

const props = {
  gutter: { type: Number, default: 5 },
  columns: { type: Array as PropType<TableColumnType[]>, default: () => [] },
  dataList: { type: Array as PropType<Recordable[]>, default: () => [] }
};

export default defineComponent({
  props: props,
  emits: ["scroll"],
  setup(props, { emit, expose, attrs, slots }) {
    function onScroll(e) {
      emit("scroll", e);
    }

    // 渲染表头
    function renderThead(columns: TableColumnType[]) {
      if (!columns?.length) return null;
      return (
        <div class="xh_row">
          {columns.map((column) => {
            if (column.hide) return null;
            const { width, ellipsis = true, headerAlign = "center" } = column;
            return (
              <div class={`xh_cell title ${ellipsis ? "ellipsis" : ""}`} style={{ textAlign: headerAlign, width: width + "px", flex: width ? "none" : 1 }}>
                {column.label}
              </div>
            );
          })}
        </div>
      );
    }
    // 渲染表内容
    function renderTbody(dataList: Recordable[], columns: TableColumnType[]) {
      if (!dataList?.length) return <el-empty description="暂无数据" image-size={42} />;
      return dataList.map((row, idx) => {
        return (
          <div class="xh_row">
            {columns.map((column, index) => {
              const { render, width, ellipsis = true, align = "center" } = column;
              if (column.hide) return null;
              let innerEle = row[column.prop];
              if (column.type === "index") innerEle = idx + 1;
              if (typeof render === "function") innerEle = render({ row, index });
              return (
                <div class={`xh_cell ${ellipsis ? "ellipsis-2" : ""}`} style={{ textAlign: align, width: width + "px", flex: width ? "none" : 1 }}>
                  <div class="cell-el">
                    <span>{innerEle}&nbsp;</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      });
    }

    expose({ onScroll });
    return () => (
      <div class="xh_table">
        <div class="xh_thead">{renderThead(props.columns)}</div>
        <div class="xh_tbody">{renderTbody(props.dataList, props.columns)}</div>
      </div>
    );
  }
});
</script>

<style scoped lang="scss">
$line: #111;

.xh_table {
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 11px;
  border: 1px solid $line;

  .xh_row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    border-bottom: 1px solid $line;
    flex: 1;
    .xh_cell {
      box-sizing: border-box;
      flex: 1;
      border-right: 1px solid $line;

      .cell-el {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        line-height: 1.2em;
      }

      &:last-child {
        border-right: none;
      }
    }
  }

  .xh_tbody {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .xh_row:last-child {
      border-bottom: none;
    }
  }
  :deep(.el-empty) {
    padding: 5px 0;
  }
  :deep(.el-empty__description) {
    margin-top: 5px;
    p {
      font-size: 12px;
    }
  }
}
</style>
