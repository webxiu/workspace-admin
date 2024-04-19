/*
 * @Author: lixiuhai
 * @Date: 2024-04-16 18:09:50
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2024-04-17 17:11:44
 */

import { onMounted, ref } from "vue";

import { useEleHeight } from "@/hooks";
import { useRouter } from "vue-router";

export const useConfig = () => {
  const router = useRouter();
  const loading = ref(true);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", -20);
  onMounted(() => {
    getData();
  });

  const getData = () => {
    router.replace("/businessCenter/dataScreen");
  };

  return { loading, maxHeight };
};
