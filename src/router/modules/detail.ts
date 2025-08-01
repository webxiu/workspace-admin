const Layout = () => import("@/layout/index.vue");

export default {
  path: "/detail",
  name: "DetailPage",
  component: Layout,
  meta: { title: "", icon: "", showLink: false },
  children: [
    {
      path: "/plmManage/basicData/materialMgmt/add",
      name: "MaterialAdd",
      meta: { title: "新增物料", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/materialMgmt/add.vue")
    },
    {
      path: "/plmManage/basicData/materialMgmt/edit",
      name: "MaterialEdit",
      meta: { title: "修改物料", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/materialMgmt/edit.vue")
    },
    {
      path: "/plmManage/basicData/materialMgmt/view",
      name: "MaterialView",
      meta: { title: "查看物料", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/materialMgmt/view.vue")
    },
    {
      path: "/plmManage/basicData/materialMgmt/history/index",
      name: "MaterialHistory",
      meta: { title: "物料履历", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/materialMgmt/history/index.vue")
    },
    {
      path: "/plmManage/basicData/bomMgmt/add",
      name: "BOMMgmtAdd",
      meta: { title: "新增BOM", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/bomMgmt/add.vue")
    },
    {
      path: "/plmManage/basicData/bomMgmt/edit",
      name: "BOMMgmtEdit",
      meta: { title: "修改BOM", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/bomMgmt/edit.vue")
    },
    {
      path: "/plmManage/basicData/bomMgmt/view",
      name: "BOMMgmtView",
      meta: { title: "查看BOM", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/bomMgmt/view.vue")
    },
    {
      path: "/plmManage/basicData/bomMgmt/history/index",
      name: "BomHistory",
      meta: { title: "BOM履历", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/bomMgmt/history/index.vue")
    },
    {
      path: "/plmManage/basicData/bomMgmt/print",
      name: "BOMMgmtPrint",
      meta: { title: "打印BOM", keepAlive: true },
      component: () => import("@/views/plmManage/basicData/bomMgmt/print.vue")
    },
    {
      path: "/financeDept/payrollMgmt/payslip/detail",
      name: "PayslipDetail",
      meta: { title: "工资条详情", keepAlive: true },
      component: () => import("@/views/financeDept/payrollMgmt/payslip/detail.vue")
    },
    {
      path: "/financeDept/payrollMgmt/payslip/templateConfig",
      name: "TemplateConfig",
      meta: { title: "工资条模板", keepAlive: true },
      component: () => import("@/views/financeDept/payrollMgmt/payslip/templateConfig/index.vue")
    },
    {
      path: "/humanResources/staffInfo/print",
      name: "StaffInfoPrint",
      meta: { title: "人事档案打印", keepAlive: true },
      component: () => import("@/views/humanResources/staffInfo/print.vue")
    },
    {
      path: "/plmManage/productMgmt/productsDevApplay/add/index",
      name: "AddProductsDevApplay",
      meta: { title: "产品开发申请表", keepAlive: true },
      component: () => import("@/views/plmManage/productMgmt/productsDevApplay/add/index.vue")
    },
    {
      path: "/plmManage/productMgmt/productsDevApplay/print/index",
      name: "PrintProductsDevApplay",
      meta: { title: "产品开发申请表—打印", keepAlive: true },
      component: () => import("@/views/plmManage/productMgmt/productsDevApplay/print/index.vue")
    },
    {
      path: "/plmManage/productMgmt/productsDevApplay/view/index",
      name: "ViewProductsDevApplay",
      meta: { title: "查看申请表", keepAlive: true },
      component: () => import("@/views/plmManage/productMgmt/productsDevApplay/add/index.vue")
    },
    {
      path: "/plmManage/productMgmt/productTemplate/add/index",
      name: "AddProductTemplate",
      meta: { title: "新增模板", keepAlive: true },
      component: () => import("@/views/plmManage/productMgmt/productTemplate/add/index.vue")
    },
    {
      path: "/plmManage/productMgmt/productTemplate/edit/index",
      name: "EditProductTemplate",
      meta: { title: "修改模板", keepAlive: true },
      component: () => import("@/views/plmManage/productMgmt/productTemplate/add/index.vue")
    },
    {
      path: "/plmManage/projectMgmt/projectTemplate/edit/index",
      name: "PlmManageProjectMgmtProjectTemplateEditIndex",
      meta: { title: "修改项目模板", keepAlive: true },
      component: () => import("@/views/plmManage/projectMgmt/projectTemplate/edit/index.vue")
    },
    {
      path: "/plmManage/projectMgmt/projectManage/add/index",
      name: "PlmManageProjectMgmtProjectManageAddIndex",
      meta: { title: "项目管理详情", keepAlive: true },
      component: () => import("@/views/plmManage/projectMgmt/projectManage/add/index.vue")
    },
    {
      path: "/plmManage/projectMgmt/projectManage/edit/index",
      name: "PlmManageProjectMgmtProjectManageEditIndex",
      meta: { title: "项目管理修改", keepAlive: true },
      component: () => import("@/views/plmManage/projectMgmt/projectManage/edit/index.vue")
    },
    {
      path: "/plmManage/projectMgmt/projectManage/print/index",
      name: "PlmManageProjectMgmtProjectManagePrintIndex",
      meta: { title: "项目管理打印", keepAlive: true },
      component: () => import("@/views/plmManage/projectMgmt/projectManage/print/index.vue")
    },
    {
      path: "/system/basic/menu/formColumn",
      name: "SystemBasicMenuFormColumn",
      meta: { title: "表单配置", keepAlive: true },
      component: () => import("@/views/system/basic/menu/formColumn/index.vue")
    },
    {
      path: "/system/basic/menu/tableColumn",
      name: "SystemBasicMenuTableColumn",
      meta: { title: "表格配置", keepAlive: true },
      component: () => import("@/views/system/basic/menu/tableColumn/index.vue")
    },
    {
      path: "/humanResources/carAllocate/print",
      name: "PrintCarAllocate",
      meta: { title: "打印外出申请", keepAlive: true },
      component: () => import("@/views/humanResources/carAllocate/print.vue")
    },
    {
      path: "/productMkCenter/engineerDept/operateBook/sopInfo",
      name: "OperateBookSopInfo",
      meta: { title: "指导书排位表", keepAlive: true },
      component: () => import("@/views/productMkCenter/engineerDept/operateBook/sopInfo/index.vue")
    },
    {
      path: "/plmManage/productMgmt/DR0Apply/add/index",
      name: "PlmManageProjectMgmtDR0ApplyAddIndex",
      meta: { title: "DR0开发申请表", keepAlive: true },
      component: () => import("@/views/plmManage/productMgmt/DR0Apply/add/index.vue")
    },
    {
      path: "/plmManage/productMgmt/DR0Apply/print/index",
      name: "PlmManageProjectMgmtDR0ApplyPrintIndex",
      meta: { title: "DR0开发申请表-打印", keepAlive: true },
      component: () => import("@/views/plmManage/productMgmt/DR0Apply/print/index.vue")
    },
    {
      path: "/marketing/saleManage/handleMake/add/index",
      name: "OaMarketingHandleMakeAddIndex",
      meta: { title: "手板制作申请单", keepAlive: true },
      component: () => import("@/views/marketing/saleManage/handleMake/add/index.vue")
    },
    {
      path: "/marketing/saleManage/handleMake/print/index",
      name: "OaMarketingHandleMakePrintIndex",
      meta: { title: "手板制作申请单-打印", keepAlive: true },
      component: () => import("@/views/marketing/saleManage/handleMake/print/index.vue")
    },
    {
      path: "/system/develop/taskManage/preview",
      name: "SystemDevelopTaskManagePreview",
      meta: { title: "任务预览", keepAlive: true },
      component: () => import("@/views/system/develop/taskManage/preview.vue")
    }
  ]
} as RouteConfigsTable;
