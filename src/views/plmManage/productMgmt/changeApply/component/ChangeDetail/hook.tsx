/*
 * @Author: Hailen
 * @Date: 2024-06-17 17:26:03
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-23 17:00:34
 */

import { onMounted, reactive, ref } from "vue";

export const useConfig = () => {
  const loading = ref<boolean>(false);

  onMounted(() => {});

  return { loading };
};
