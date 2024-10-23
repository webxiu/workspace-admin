import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { defineComponent, ref, computed, type PropType, nextTick, watch } from "vue";
import { delay, cloneDeep, isBoolean, isFunction, getKeyList } from "@pureadmin/utils";

import Sortable from "sortablejs";
import DragIcon from "./svg/drag.svg?component";
import ExpandIcon from "./svg/expand.svg?component";
import RefreshIcon from "./svg/refresh.svg?component";
import SettingIcon from "./svg/settings.svg?component";
import CollapseIcon from "./svg/collapse.svg?component";

const props = {
  /** 头部最左边的标题 */
  title: { type: String, default: "" },
  /** 对于树形表格，如果想启用展开和折叠功能，传入当前表格的ref即可 */
  tableRef: { type: Object as PropType<any> },
  /** 需要展示的列 */
  columns: { type: Array as PropType<TableColumnList>, default: () => [] },
  /** 是否显示刷新和设置图标(默认显示) */
  showIcon: { type: Boolean, default: true }
};

export default defineComponent({
  name: "PureTableBar",
  props,
  emits: ["refresh", "changeColumn"],
  setup(props, { emit, slots, attrs }) {
    const buttonRef = ref();
    const size = ref("small");
    const isExpandAll = ref(true);
    const loading = ref(false);
    const checkAll = ref(true);
    const isIndeterminate = ref(false);
    const filterColumns = ref([]);
    const checkColumnList = ref([]);
    const checkedColumns = ref([]);
    const dynamicColumns = ref<Array<Record<any, any>>>([]);
    const dragKey = ref(Date.now());

    watch(
      props,
      (newProps) => {
        filterColumns.value = cloneDeep(newProps?.columns).filter((column) =>
          isBoolean(column?.hide) ? !column.hide : !(isFunction(column?.hide) && column?.hide())
        );
        checkColumnList.value = getKeyList(cloneDeep(newProps?.columns), "label");
        checkedColumns.value = getKeyList(cloneDeep(filterColumns.value), "label");
        dynamicColumns.value = newProps.columns;
      },
      { deep: true, immediate: true }
    );

    const getDropdownItemStyle = computed(() => {
      return (s) => {
        return {
          background: s === size.value ? useEpThemeStoreHook().epThemeColor : "",
          color: s === size.value ? "#fff" : "var(--el-text-color-primary)"
        };
      };
    });

    const iconClass = computed(() => {
      return ["text-black", "dark:text-white", "duration-100", "hover:!text-primary", "cursor-pointer", "outline-none"];
    });

    const topClass = computed(() => {
      return ["flex", "justify-between", "pt-[3px]", "px-[11px]", "border-b-[1px]", "border-solid", "border-[#dcdfe6]", "dark:border-[#303030]"];
    });

    function onReFresh() {
      loading.value = true;
      emit("refresh");
      delay(500).then(() => (loading.value = false));
    }

    function onExpand() {
      isExpandAll.value = !isExpandAll.value;
      toggleRowExpansionAll(props.tableRef.data, isExpandAll.value);
    }

    function toggleRowExpansionAll(data, isExpansion) {
      data.forEach((item) => {
        props.tableRef.toggleRowExpansion(item, isExpansion);
        if (item.children !== undefined && item.children !== null) {
          toggleRowExpansionAll(item.children, isExpansion);
        }
      });
    }

    function handleCheckAllChange(val: boolean) {
      checkedColumns.value = val ? checkColumnList.value : [];
      isIndeterminate.value = false;
      dynamicColumns.value.map((column) => (val ? (column.hide = false) : (column.hide = true)));
    }

    function handleCheckedColumnsChange(value: string[]) {
      const checkedCount = value.length;
      checkAll.value = checkedCount === checkColumnList.value.length;
      isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumnList.value.length;
    }

    function handleCheckColumnListChange(val: boolean, label: string) {
      dynamicColumns.value.filter((item) => item.label === label)[0].hide = !val;
    }

    async function onReset() {
      checkAll.value = true;
      isIndeterminate.value = false;
      dynamicColumns.value = cloneDeep(props.columns);
      checkColumnList.value = [];
      checkColumnList.value = await getKeyList(cloneDeep(props.columns), "label");
      checkedColumns.value = getKeyList(cloneDeep(props.columns), "label");
    }

    function onSubmit(type: "save" | "recover") {
      emit("changeColumn", type, dynamicColumns.value, () => emit("refresh"));
    }

    const dropdown = {
      dropdown: () => (
        <el-dropdown-menu class="translation">
          <el-dropdown-item style={getDropdownItemStyle.value("large")} onClick={() => (size.value = "large")}>
            宽松
          </el-dropdown-item>
          <el-dropdown-item style={getDropdownItemStyle.value("default")} onClick={() => (size.value = "default")}>
            默认
          </el-dropdown-item>
          <el-dropdown-item style={getDropdownItemStyle.value("small")} onClick={() => (size.value = "small")}>
            紧凑
          </el-dropdown-item>
        </el-dropdown-menu>
      )
    };

    /** 列展示拖拽排序 */
    const rowDrop = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      nextTick(() => {
        const wrapper: HTMLElement = document.querySelector(`.table-drag_${dragKey.value} .el-checkbox-group>div`);
        Sortable.create(wrapper, {
          animation: 300,
          handle: ".drag-btn",
          onEnd: ({ newIndex, oldIndex, item }) => {
            // 获取无表头名称的列数量
            const noTitleCount = props.columns.length - checkColumnList.value.length;
            newIndex += noTitleCount;
            oldIndex += noTitleCount;
            const targetThElem = item;
            const wrapperElem = targetThElem.parentNode as HTMLElement;
            const oldColumn = dynamicColumns.value[oldIndex];
            const newColumn = dynamicColumns.value[newIndex];
            if (oldColumn?.fixed || newColumn?.fixed) {
              // 当前列存在fixed属性 则不可拖拽
              const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
              if (newIndex > oldIndex) {
                wrapperElem.insertBefore(targetThElem, oldThElem);
              } else {
                wrapperElem.insertBefore(targetThElem, oldThElem ? oldThElem.nextElementSibling : oldThElem);
              }
              return;
            }
            const newList = cloneDeep(dynamicColumns.value);
            const currentRow = newList.splice(oldIndex, 1)[0];
            newList.splice(newIndex, 0, currentRow);
            dynamicColumns.value = newList;
          }
        });
      });
    };

    const isFixedColumn = (label: string) => {
      return dynamicColumns.value.filter((item) => item.label === label)[0].fixed ? true : false;
    };

    const reference = {
      reference: () => <SettingIcon class={["w-[16px] h-[16px]", iconClass.value]} onMouseover={(e) => (buttonRef.value = e.currentTarget)} />
    };

    return () => (
      <>
        <div {...attrs} class="ui-w-100 px-2 bg-bg_color pt-2 ui-ov-h">
          <div class="flex justify-between items-center w-full pb-2 table-operate" style={{ display: slots?.title || props.showIcon ? "inline-flex" : "none" }}>
            {slots?.title ? slots.title() : <p class="font-bold truncate">{props.title}</p>}
            <div class="flex items-center justify-around flex-1">
              <div class={`flex flex-1 just-end table-buttons`}>{slots.buttons && slots.buttons()}</div>
              {props.showIcon ? (
                <div class="flex ml-4">
                  {props.tableRef?.size ? (
                    <>
                      <el-tooltip effect="dark" content={isExpandAll.value ? "折叠" : "展开"} placement="top">
                        <ExpandIcon
                          class={["w-[16px]", "h-[16px]", iconClass.value]}
                          style={{
                            transform: isExpandAll.value ? "none" : "rotate(-90deg)"
                          }}
                          onClick={() => onExpand()}
                        />
                      </el-tooltip>
                      <el-divider direction="vertical" />
                    </>
                  ) : null}
                  <el-tooltip effect="dark" content="刷新" placement="top">
                    <RefreshIcon class={["w-[16px]", "h-[16px]", iconClass.value, loading.value ? "animate-spin" : ""]} onClick={() => onReFresh()} />
                  </el-tooltip>
                  <el-divider direction="vertical" />
                  <el-tooltip effect="dark" content="密度" placement="top">
                    <el-dropdown v-slots={dropdown} trigger="click">
                      <CollapseIcon class={["w-[16px]", "h-[16px]", iconClass.value]} />
                    </el-dropdown>
                  </el-tooltip>

                  <el-divider direction="vertical" />
                  <el-popover v-slots={reference} placement="bottom-start" popper-style={{ padding: 0 }} teleported={false} width="190" trigger="click">
                    <div class={[topClass.value, "flex align-center just-between"]}>
                      <el-checkbox
                        class="!-mr-1"
                        label="列展示"
                        v-model={checkAll.value}
                        indeterminate={isIndeterminate.value}
                        onChange={(value) => handleCheckAllChange(value)}
                      />
                      <div>
                        <el-button type="warning" link title="恢复到默认配置" onClick={() => onSubmit("recover")} style={{ margin: "0px" }}>
                          恢复
                        </el-button>
                        <el-button type="danger" link title="重置当前操作" onClick={() => onReset()} style={{ margin: "0px" }}>
                          重置
                        </el-button>
                        <el-button type="primary" link title="保存我的配置" onClick={() => onSubmit("save")} style={{ margin: "0px" }}>
                          保存
                        </el-button>
                      </div>
                    </div>

                    <div class={["pt-[6px] pl-[11px]", "table-drag_" + dragKey.value]} style={{ maxHeight: window.innerHeight / 2 + "px", overflowY: "auto" }}>
                      <el-checkbox-group v-model={checkedColumns.value} onChange={(value) => handleCheckedColumnsChange(value)}>
                        <el-space direction="vertical" alignment="flex-start" size={0}>
                          {checkColumnList.value.map((item) => {
                            return (
                              <div class="flex items-center">
                                <DragIcon
                                  class={["drag-btn w-[16px] mr-2", isFixedColumn(item) ? "!cursor-no-drop" : "!cursor-grab"]}
                                  onMouseenter={(event: { preventDefault: () => void }) => rowDrop(event)}
                                />
                                <el-checkbox key={item} label={item} onChange={(value) => handleCheckColumnListChange(value, item)}>
                                  <span title={item} class="inline-block w-[120px] truncate hover:text-text_color_primary">
                                    {item}
                                  </span>
                                </el-checkbox>
                              </div>
                            );
                          })}
                        </el-space>
                      </el-checkbox-group>
                    </div>
                  </el-popover>
                </div>
              ) : null}
            </div>

            <el-tooltip
              popper-options={{
                modifiers: [
                  {
                    name: "computeStyles",
                    options: {
                      adaptive: false,
                      enabled: false
                    }
                  }
                ]
              }}
              placement="top"
              virtual-ref={buttonRef.value}
              virtual-triggering
              trigger="hover"
              content="列设置"
            />
          </div>
          {slots.default({
            size: size.value,
            dynamicColumns: dynamicColumns
          })}
        </div>
      </>
    );
  }
});
