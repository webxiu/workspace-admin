import { http } from "@/utils/http";

/** ========================= 文件管理 ========================= */
/** 文件库 - 左侧树root目录列表 */
export function fetchFileRootDirs(params) {
  return http.request("get", "/file/filemanage/getsharelist", { params });
}

/** 文件库 - 右侧数据获取 */
export function fetchFileTableData(params) {
  return http.request("get", "/file/filemanage/getfilelist", { params });
}

/** 文件库 - 创建文件夹 */
export function createFileTableData(params) {
  return http.request("post", "/file/filemanage/creatfile", { params });
}

/** 文件库 - 删除文件或者文件夹 */
export function delFileTableData(params) {
  return http.request("get", "/file/filemanage/deletefile", { params });
}

/** 文件库 - 重命名文件或者文件夹 */
export function renameFileTableData(params) {
  return http.request("post", "/file/filemanage/renamefolder", { params });
}

/** 文件库 - 上传文件 */
export function uploadFileTableData(params, fn) {
  return http.request(
    "post",
    "/file/filemanage/upload",
    { data: params },
    { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress: (v) => fn(v) }
  );
}

/** 文件库 - 搜索文件 */
export function searchFileTableData(params) {
  return http.request("post", "/file/filemanage/searchfilelist", { data: params });
}

/** 群晖用户 - 查询所有用户 */
export function searchQHUserList(params) {
  return http.request("get", "/file/qunhuiuser/getuserall", { params });
}

/** 群晖用户 - 导出所有用户 */
export function exportQHUserList(params) {
  return http.request("post", "/file/qunhuiuser/export", { data: params });
}

/** 群晖用户 - 重置密码 */
export function resetQHUserPwd(params) {
  return http.request("post", "/file/qunhuiuser/resetpasswords", { data: params });
}

/** 群晖用户 - 删除用户 */
export function delQHUser(params) {
  return http.request("post", "/file/qunhuiuser/delete", { data: params });
}

/** 群晖用户 - 添加用户 */
export function addQHUser(params) {
  return http.request("post", "/file/qunhuiuser/adduser", { data: params });
}

/** 群晖用户 - 查询部门用户列表 */
export function fetchDeptUserList(params) {
  return http.request("get", "/sys/sys/userinfo/queryuserinfo", { params });
}

/** 群晖用户 - 获取用户组 */
export function fetchUserGroupList(params) {
  return http.request("post", "/file/qunhuiuser/getgroupbyuser", { data: params });
}

/** 群晖用户 - 修改用户组 */
export function updateUserGroupInfo(params) {
  return http.request("post", "/file/qunhuiuser/updateuser", { data: params });
}

/** 群晖组 - 查询列表 */
export function fetchQHGroupList(params) {
  return http.request("get", "/file/qunhuigroup/getgroupall", { params });
}

/** 群晖组 - 新增组 */
export function addQHGroupInfo(params) {
  return http.request("post", "/file/qunhuigroup/addgroupuser", { data: params });
}

/** 群晖组 - 删除组 */
export function delQHGroupInfo(params) {
  return http.request("post", "/file/qunhuigroup/delete", { data: params });
}

/** 群晖组 - 修改 */
export function editQHGroupInfo(params) {
  return http.request("post", "/file/qunhuigroup/regroupname", { data: params });
}

/** 群晖组 - 导出 */
export function exportQHGroupInfo(params) {
  return http.request("post", "/file/qunhuigroup/export", { data: params });
}

/** 群晖组 - 获取角色列表 */
export function fetchRolesList(params) {
  return http.request("post", "/sys/sys/roleinfo/queryallroleinfo", { data: params });
}
