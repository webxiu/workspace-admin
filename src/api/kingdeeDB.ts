import { http } from "@/utils/http";

export interface KingdeeDBItemType {
  /** ID */
  id: string;
  /** 数据库简称 */
  accountName: string;
  /** IP地址 */
  ipAddress: string;
  /** 连接数据库名称 */
  linkDbName: string;
  /** 连接类型 */
  dbType: string;
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 昵称 */
  nick: string;
  /** 状态 */
  accountStatus: string;
  /** 组织ID */
  orgId: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/**========================= 数据库列表 =========================*/
// 数据库列表
export const kingdeeDBList = (params) => {
  return http.request<KingdeeDBItemType[]>("post", "/config/kingdee/list", { data: params });
};
// 增加数据库
export const addKingdeeDB = (data) => {
  return http.request("post", "/config/kingdee/insertkingdee", { data });
};
// 编辑数据库
export const updateKingdeeDB = (data) => {
  return http.request("post", "/config/kingdee/updatekingdee", { data });
};
// 删除数据库
export const deleteKingdeeDB = (data) => {
  return http.request("post", "/config/kingdee/deletekingdee", { data });
};
