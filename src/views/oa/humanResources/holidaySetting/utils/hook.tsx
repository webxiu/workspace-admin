/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-06-17 17:27:55
 */

import { HolidaySettingDataType, HolidaySettingItemType, holidaySettingData, holidaySettingList, saveHolidaySetting } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref, watch } from "vue";

import { ButtonOptionType } from "@/components/ButtonGroup.vue";
import { DateChangeType } from "../component/HailenCalendar/index.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { SetUp } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<HolidaySettingDataType[]>([]);
  const dataListTemp = ref<HolidaySettingDataType[]>([]);
  const calendarList = ref<HolidaySettingItemType[]>([]);
  const currentCalendarListTemp = ref<HolidaySettingItemType[]>([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 62 + 51);
  const activeName = ref("chart");
  const currentDate = ref(new Date());
  const calendarRef = ref();

  const buttonsConfig = ref<ButtonOptionType[]>([
    { label: "职员", value: 1 },
    { label: "员工", value: 2 }
  ]);

  const formData = reactive({
    category: 1,
    IsWork: "",
    cn: 1,
    size: 100,
    month: dayjs(currentDate.value).startOf("month").format("YYYYMM")
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  watch(formData, (val) => {
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "日期", prop: "workDate", minWidth: 160 },
      { label: "工作日", prop: "isWork", cellRenderer: ({ row }) => <span>{row.isWork === 0 ? "休" : "班"}</span> },
      { label: "法定假日", prop: "isHoliday", cellRenderer: ({ row }) => <span>{row.isHoliday === 1 ? "假" : ""}</span> },
      { label: "类别", prop: "category", cellRenderer: ({ row }) => <span>{row.category === 1 ? "职员" : "员工"}</span> },
      { label: "录入日期", prop: "inDate" },
      { label: "录入人", prop: "keyIn" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    const { month, category, IsWork, cn, size } = formData;
    const p1 = holidaySettingData({ month, category, IsWork }); // 获取加班设置
    const p2 = holidaySettingList({ cn, month, size }); // 获取农历
    loading.value = true;
    Promise.all([p1, p2])
      .then((res) => {
        const res1 = res[0] as any;
        const res2 = res[1] as any;
        loading.value = false;
        if (res1.status === 200) {
          // dataList.value = [...dataListTemp.value, ...res1.data];
          dataList.value = res1.data;
          dataListTemp.value = dataList.value;
        }
        if (res2.status === 200) {
          if (res2.data.length) {
            // 存储当前月份日历数据
            const curMonth = dayjs().startOf("month").format("MM");
            const chooseMonth = formData.month.slice(-2);
            if (chooseMonth === curMonth) {
              currentCalendarListTemp.value = res2.data;
            }
            // 为包含当前月的前、后月份添加当前月日历数据
            if (Math.abs(Number(chooseMonth) - Number(curMonth)) === 1) {
              calendarList.value = [...currentCalendarListTemp.value, ...res2.data];
            } else {
              calendarList.value = res2.data;
            }
          }
        }
      })
      .catch(() => (loading.value = false));
  };

  // 切换年月
  const onCalendarChange = (date: DateChangeType) => {
    const mm = dayjs(new Date(date.year, date.month, date.day)).format("YYYYMM");
    formData.month = mm;
    getTableList();
  };

  // 保存
  const onSave = () => {
    const holidayData: HolidaySettingDataType[] = calendarRef.value.getRef().holidayData;
    const holidaysettingDTOS = holidayData.map((item) => {
      const workDate = item.workDate.split(" ")[0];
      return {
        workDate: workDate,
        isWork: Number(item.isWork) === 1,
        isHoliday: false, // todo
        category: formData.category
      };
    });

    const params = {
      year: formData.month.slice(0, 4),
      month: formData.month.slice(4),
      holidaysettingDTOS: holidaysettingDTOS,
      category: formData.category
    };
    const text = buttonList.value[0]?.text;
    loadingStatus.value = { text, loading: true };
    saveHolidaySetting(params)
      .then((res) => {
        loadingStatus.value = { text, loading: false };
        if (res.data) {
          message("保存成功");
        } else {
          message("保存失败", { type: "error" });
        }
      })
      .catch(() => (loadingStatus.value = { text, loading: false }));
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onSave, type: "primary", text: "保存", icon: SetUp, isDropDown: false }]);

  return {
    activeName,
    currentDate,
    formData,
    calendarRef,
    loading,
    columns,
    dataList,
    buttonList,
    calendarList,
    loadingStatus,
    maxHeight,
    buttonsConfig,
    onCalendarChange
  };
};
