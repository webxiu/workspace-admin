import type { DefineComponent } from "vue";
import type { UploadProps } from "element-plus";
import type { HxIconProps } from "@/components/HxIcon";
import type { TitleCateProps } from "@/components/TitleCate.vue";
import type { ButtonListProps } from "@/components/ButtonList/index.vue";
import type { BlendedSearchProps } from "@/components/BlendedSearch/index.vue";
import type { SearchHighlightProps } from "@/components/HxSearchHighlight/index.vue";
import type { FormColumnGroupType } from "@/utils/form";

declare module "vue" {
  /**
   * 自定义全局组件获得 Volar 提示（自定义的全局组件需要在这里声明下才能获得 Volar 类型提示哦）
   */
  export interface GlobalComponents {
    IconifyIconOffline: typeof import("../src/components/ReIcon")["IconifyIconOffline"];
    IconifyIconOnline: typeof import("../src/components/ReIcon")["IconifyIconOnline"];
    FontIcon: typeof import("../src/components/ReIcon")["FontIcon"];
    Auth: typeof import("../src/components/ReAuth")["Auth"];
    PureTableBar: typeof import("../src/components/RePureTableBar")["PureTableBar"];
    HxModalInput: typeof import("../src/components/HxModalInput/index.vue")["HxModalInput"];
    AgGridTable: typeof import("../src/components/AgGridTable/index.vue")["AgGridTable"];
    HxIcon: DefineComponent<HxIconProps>;
    HxUploadButton: DefineComponent<Partial<UploadProps>>;
    TitleCate: DefineComponent<TitleCateProps>;
    ButtonList: DefineComponent<ButtonListProps>;
    HxSearchHighlight: DefineComponent<SearchHighlightProps>;
    TableEditList: DefineComponent<FormColumnGroupType>;
    BlendedSearch: DefineComponent<BlendedSearchProps> & {
      new (): {
        $props: BlendedSearchProps;
        $emit: { (event: "tagSearch", val: Recordable): void; (event: "selectNode", val: Recordable): void };
      };
    };
  }
}

/**
 * TODO https://github.com/element-plus/element-plus/blob/dev/global.d.ts#L2
 * No need to install @vue/runtime-core
 */
declare module "vue" {
  export interface GlobalComponents {
    ElAffix: typeof import("element-plus")["ElAffix"];
    ElAlert: typeof import("element-plus")["ElAlert"];
    ElAside: typeof import("element-plus")["ElAside"];
    ElAutocomplete: typeof import("element-plus")["ElAutocomplete"];
    ElAvatar: typeof import("element-plus")["ElAvatar"];
    ElBacktop: typeof import("element-plus")["ElBacktop"];
    ElBadge: typeof import("element-plus")["ElBadge"];
    ElBreadcrumb: typeof import("element-plus")["ElBreadcrumb"];
    ElBreadcrumbItem: typeof import("element-plus")["ElBreadcrumbItem"];
    ElButton: typeof import("element-plus")["ElButton"];
    ElButtonGroup: typeof import("element-plus")["ElButtonGroup"];
    ElCalendar: typeof import("element-plus")["ElCalendar"];
    ElCard: typeof import("element-plus")["ElCard"];
    ElCarousel: typeof import("element-plus")["ElCarousel"];
    ElCarouselItem: typeof import("element-plus")["ElCarouselItem"];
    ElCascader: typeof import("element-plus")["ElCascader"];
    ElCascaderPanel: typeof import("element-plus")["ElCascaderPanel"];
    ElCheckbox: typeof import("element-plus")["ElCheckbox"];
    ElCheckboxButton: typeof import("element-plus")["ElCheckboxButton"];
    ElCheckboxGroup: typeof import("element-plus")["ElCheckboxGroup"];
    ElCol: typeof import("element-plus")["ElCol"];
    ElCollapse: typeof import("element-plus")["ElCollapse"];
    ElCollapseItem: typeof import("element-plus")["ElCollapseItem"];
    ElCollapseTransition: typeof import("element-plus")["ElCollapseTransition"];
    ElColorPicker: typeof import("element-plus")["ElColorPicker"];
    ElContainer: typeof import("element-plus")["ElContainer"];
    ElConfigProvider: typeof import("element-plus")["ElConfigProvider"];
    ElDatePicker: typeof import("element-plus")["ElDatePicker"];
    ElDialog: typeof import("element-plus")["ElDialog"];
    ElDivider: typeof import("element-plus")["ElDivider"];
    ElDrawer: typeof import("element-plus")["ElDrawer"];
    ElDropdown: typeof import("element-plus")["ElDropdown"];
    ElDropdownItem: typeof import("element-plus")["ElDropdownItem"];
    ElDropdownMenu: typeof import("element-plus")["ElDropdownMenu"];
    ElEmpty: typeof import("element-plus")["ElEmpty"];
    ElFooter: typeof import("element-plus")["ElFooter"];
    ElForm: typeof import("element-plus")["ElForm"];
    ElFormItem: typeof import("element-plus")["ElFormItem"];
    ElHeader: typeof import("element-plus")["ElHeader"];
    ElIcon: typeof import("element-plus")["ElIcon"];
    ElImage: typeof import("element-plus")["ElImage"];
    ElImageViewer: typeof import("element-plus")["ElImageViewer"];
    ElInput: typeof import("element-plus")["ElInput"];
    ElInputNumber: typeof import("element-plus")["ElInputNumber"];
    ElLink: typeof import("element-plus")["ElLink"];
    ElMain: typeof import("element-plus")["ElMain"];
    ElMenu: typeof import("element-plus")["ElMenu"];
    ElMenuItem: typeof import("element-plus")["ElMenuItem"];
    ElMenuItemGroup: typeof import("element-plus")["ElMenuItemGroup"];
    ElOption: typeof import("element-plus")["ElOption"];
    ElOptionGroup: typeof import("element-plus")["ElOptionGroup"];
    ElPageHeader: typeof import("element-plus")["ElPageHeader"];
    ElPagination: typeof import("element-plus")["ElPagination"];
    ElPopconfirm: typeof import("element-plus")["ElPopconfirm"];
    ElPopper: typeof import("element-plus")["ElPopper"];
    ElPopover: typeof import("element-plus")["ElPopover"];
    ElProgress: typeof import("element-plus")["ElProgress"];
    ElRadio: typeof import("element-plus")["ElRadio"];
    ElRadioButton: typeof import("element-plus")["ElRadioButton"];
    ElRadioGroup: typeof import("element-plus")["ElRadioGroup"];
    ElRate: typeof import("element-plus")["ElRate"];
    ElRow: typeof import("element-plus")["ElRow"];
    ElScrollbar: typeof import("element-plus")["ElScrollbar"];
    ElSelect: typeof import("element-plus")["ElSelect"];
    ElSlider: typeof import("element-plus")["ElSlider"];
    ElStep: typeof import("element-plus")["ElStep"];
    ElSteps: typeof import("element-plus")["ElSteps"];
    ElSubMenu: typeof import("element-plus")["ElSubMenu"];
    ElSwitch: typeof import("element-plus")["ElSwitch"];
    ElTabPane: typeof import("element-plus")["ElTabPane"];
    ElTable: typeof import("element-plus")["ElTable"];
    ElTableColumn: typeof import("element-plus")["ElTableColumn"];
    ElTabs: typeof import("element-plus")["ElTabs"];
    ElTag: typeof import("element-plus")["ElTag"];
    ElTimePicker: typeof import("element-plus")["ElTimePicker"];
    ElTimeSelect: typeof import("element-plus")["ElTimeSelect"];
    ElTimeline: typeof import("element-plus")["ElTimeline"];
    ElTimelineItem: typeof import("element-plus")["ElTimelineItem"];
    ElTooltip: typeof import("element-plus")["ElTooltip"];
    ElTransfer: typeof import("element-plus")["ElTransfer"];
    ElTree: typeof import("element-plus")["ElTree"];
    ElTreeV2: typeof import("element-plus")["ElTreeV2"];
    ElUpload: typeof import("element-plus")["ElUpload"];
    ElSpace: typeof import("element-plus")["ElSpace"];
    ElSkeleton: typeof import("element-plus")["ElSkeleton"];
    ElSkeletonItem: typeof import("element-plus")["ElSkeletonItem"];
    ElCheckTag: typeof import("element-plus")["ElCheckTag"];
    ElDescriptions: typeof import("element-plus")["ElDescriptions"];
    ElDescriptionsItem: typeof import("element-plus")["ElDescriptionsItem"];
    ElResult: typeof import("element-plus")["ElResult"];
    ElSelectV2: typeof import("element-plus")["ElSelectV2"];
  }

  interface ComponentCustomProperties {
    $message: typeof import("element-plus")["ElMessage"];
    $notify: typeof import("element-plus")["ElNotification"];
    $msgbox: typeof import("element-plus")["ElMessageBox"];
    $messageBox: typeof import("element-plus")["ElMessageBox"];
    $alert: typeof import("element-plus")["ElMessageBox"]["alert"];
    $confirm: typeof import("element-plus")["ElMessageBox"]["confirm"];
    $prompt: typeof import("element-plus")["ElMessageBox"]["prompt"];
    $loading: typeof import("element-plus")["ElLoadingService"];
  }
}

export {};
