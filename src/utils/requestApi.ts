import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getDeptTreeData } from "@/api/systemManage";
import { getdeptInfoList } from "@/api/workbench/teamManage";
import { handleTree } from "@/utils/tree";
import { treeArrayTraverse } from "@/utils/common";

enum MyKey {
  /** 名称与值一致 */
  deptKey1 = "deptKey1",
  /** 名称为部门名称, 值为部门ID */
  deptKey2 = "deptKey2"
}

/** 存储已获取到的数据 */
const gMap = new Map<MyKey, SearchOptionType[]>([
  [MyKey.deptKey1, []],
  [MyKey.deptKey2, []]
]);

/**
 * 获取部门树形列表
 * @param isDeptName 是否按部门名称返回(默认:否)
 * @returns 部门列表数据
 */
export function getDeptOptions(isDeptName = false) {
  return new Promise<SearchOptionType[]>((resolve, reject) => {
    if (isDeptName) {
      // 1.名称与值都为部门名称
      const arr1 = gMap.get(MyKey.deptKey1);
      if (arr1.length) return resolve(arr1);
      getdeptInfoList({})
        .then((res) => {
          const data = res.data || [];
          const newData = data.map((m) => ({ ...m, label: m.deptName, value: m.deptName }));
          const treeArr = handleTree(newData, "itemId", "parentId");
          gMap.set(MyKey.deptKey1, treeArr);
          resolve(treeArr);
        })
        .catch(() => resolve([]));
    } else {
      // 2.名称为部门名称, 值为部门ID
      const arr2 = gMap.get(MyKey.deptKey2);
      if (arr2.length) return resolve(arr2);
      getDeptTreeData()
        .then((res) => {
          const result = JSON.parse(res.data);
          const treeArr = treeArrayTraverse(result, { title: "label", id: "value" });
          gMap.set(MyKey.deptKey2, treeArr);
          resolve(treeArr);
        })
        .catch(() => resolve([]));
    }
  });
}
