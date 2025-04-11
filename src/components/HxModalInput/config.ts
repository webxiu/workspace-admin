import { SelectTableProp } from "./SelectTable.vue";
import { fetchDormitoryAllBuliding } from "@/api/oaManage/humanResources";
import { fetchProductStoreList } from "@/api/plmManage";
import { getDeptUserList } from "@/api/systemManage";

/** 查询类型Key */
export type QueryModalKey = "user" | "product" | "dormitory";

/** 弹窗选择常用配置 */
export const QueryConfig: Record<QueryModalKey, Partial<SelectTableProp>> = {
  // 1.选择用户
  user: {
    multiple: false,
    maxHeight: 460,
    api: getDeptUserList,
    paramConfig: { page: 1, limit: 100000, userName: "", userCode: "", deptId: "" },
    searchConfig: [
      { label: "工号", value: "userCode" },
      { label: "姓名", value: "userName" },
      { label: "部门", value: "deptId", queryFields: ["department"] }
    ],
    columns: [
      { label: "工号", prop: "userCode" },
      { label: "姓名", prop: "userName" }
    ]
  },
  // 2.选择产品型号
  product: {
    multiple: false,
    maxHeight: 520,
    api: fetchProductStoreList,
    searchConfig: [{ label: "产品型号", value: "productCode" }],
    columns: [
      { label: "产品型号", prop: "productCode" },
      { label: "产品类别", prop: "productType" }
    ]
  },
  // 2.选择产品型号
  dormitory: {
    multiple: false,
    searchConfig: [{ label: "工号", value: "userCode" }],
    maxHeight: 300,
    columns: [
      { label: "宿舍楼层", prop: "floorNo" },
      { label: "宿舍房间", prop: "dormitoryCode" }
    ],
    api: fetchDormitoryAllBuliding,
    formatAPI: (data) => data.map((item) => item.value).flat(Infinity)
  }
};
