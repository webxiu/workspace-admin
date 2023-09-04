import { http } from "@/utils/http";

export interface TestItemType {
  /* 组织ID */
  id: string;
  /* 组织名称 */
  username: string;
  /* 年龄 */
  age: number;
  /* title */
  title: string;
  /* 状态 */
  status: number;
  /* logo */
  logo: string;
}

/**========================= 测试mock接口 =========================*/
// 测试列表
export const testList = (data) => {
  return http.request<TestItemType[]>("post", "/edit-table/list", { data });
};
// 增加测试
export const addTest = (data) => {
  return http.request("post", "/test/add", { data });
};
// 编辑测试
export const updateTest = (data) => {
  return http.request("post", "/test/update", { data });
};
// 删除测试
export const deleteTest = (data) => {
  return http.request("post", "/test/delete", { data });
};
// 上传测试Logo
export const testUpload = (data) => {
  return http.request("post", "/test/upload", { data });
};
