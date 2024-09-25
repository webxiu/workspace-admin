const mockData = {
  dataList1: [],
  dataList2: [],
  dataList3: [],
  totalObj1: 25,
  totalObj2: 125,
  totalObj3: 3,
  totalObj4: 78
};

for (let i = 0; i < 15; i++) {
  mockData.dataList1.push({ projectName: `项目名称${i + 1}`, projectUserName: `张三${i + 1}`, endDate: "2024-08-12", freeDays: 10 });
  mockData.dataList2.push({ taskName: `任务名称${i + 1}`, taskUserName: `李四${i + 1}`, projectName: `所属项目${i + 1}` });
  mockData.dataList3.push({
    taskName: "延期任务名称" + (i + 1),
    projectName: "所属项目" + (i + 1),
    taskUserName: "李四" + (i + 1),
    finishDate: "2024-08-01",
    projectUserName: "张三" + (i + 1),
    endDate: "2024-08-02",
    progress: i <= -10 ? i * 10 : 0
  });
}

export { mockData };
