import { Col, Row } from "@/layout/Layout";
import { FontIcon, IconifyIconOffline, IconifyIconOnline } from "@/components/ReIcon";

import AgGridTable from "@/components/AgGridTable/index.vue";
import { App } from "vue";
import { Auth } from "@/components/ReAuth";
import BlendedSearch from "@/components/BlendedSearch/index.vue";
import ButtonList from "@/components/ButtonList/index.vue";
import HxIcon from "@/components/HxIcon";
import HxModalInput from "@/components/HxModalInput/index.vue";
import HxSearchHighlight from "@/components/HxSearchHighlight/index.vue";
import HxUploadButton from "@/components/HxUploadButton/index.vue";
import MyUpload from "@/views/plmManage/basicData/materialMgmt/components/MyUpload.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import TableEditList from "@/components/TableEditList/index.vue";
import TitleCate from "@/components/TitleCate.vue";

const components = [
  // 全局注册`@iconify/vue`图标库
  { name: "IconifyIconOffline", component: IconifyIconOffline },
  { name: "IconifyIconOnline", component: IconifyIconOnline },
  { name: "FontIcon", component: FontIcon },
  { name: "Auth", component: Auth }, // 全局注册按钮级别权限组件
  { name: "HxIcon", component: HxIcon }, // Element Plus 图标
  { name: "ButtonList", component: ButtonList }, // 表格操作按钮
  { name: "HxUploadButton", component: HxUploadButton }, // 上传
  { name: "AgGridTable", component: AgGridTable }, // Ag-Grid表格
  { name: "PureTableBar", component: PureTableBar }, // 表格
  { name: "BlendedSearch", component: BlendedSearch }, // 搜索查询
  { name: "HxModalInput", component: HxModalInput }, // 输入框弹窗选择
  { name: "HxSearchHighlight", component: HxSearchHighlight }, // 搜索高亮
  { name: "TableEditList", component: TableEditList }, // 表格新增修改渲染
  { name: "TitleCate", component: TitleCate }, // 分类标题
  { name: "MyUpload", component: MyUpload },
  { name: "Row", component: Row },
  { name: "Col", component: Col }
];

export function registerComponents(app: App) {
  components.forEach((component) => {
    app.component(component.name, component.component);
  });
}
