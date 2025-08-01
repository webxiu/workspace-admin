var customElementTypeProvider = (function () {
  return function (options) {
    // 保持默认
    const textOptions = {
      // width: 140,
      // height: 26,
      // lineHeight: 26,
      // fontSize: 10,
      // fontWeight: "700",
      // textAlign: "center",
      // hideTitle: false,
    };
    var addElementTypes = function (context) {
      context.addPrintElementTypes("configModule", [
        /**
         * field字段配置可用于加载测试数据: printData
         * field字段未配置, 也无需配置data字段
         */
        new hiprint.PrintElementTypeGroup("文本", [
          { tid: "configModule.text", title: "文本", type: "text", options: textOptions },
          { tid: "configModule.longText", title: "长文本", text: "长文", type: "longText", options: textOptions },
          { tid: "configModule.customText", title: "自定义文本", type: "text", custom: true, options: textOptions },
        ]),
        new hiprint.PrintElementTypeGroup("图片", [
          {
            tid: "configModule.image",
            text: "图片",
            data: "./image/hi.png",
            type: "image",
            options: {width: 80, height: 80, hideTitle: false, src: "./image/hi.png", },
          },
          {
            tid: "configModule.qrcode",
            title: "123546789", // 二维码
            // field: "qrcode", // 配置字段只能加载测试数据, 不配置字段默认显示title, 并支持设计时修改
            data: "123546789",
            type: "text",
            options: {width: 80, height: 80, textType: "qrcode", },
          },
          {
            tid: "configModule.barcode",
            title: "1234567890",
            // field: "barcode",
            data: "1234567890",
            type: "text",
            options: { width: 140, height: 35, textType: "barcode", },
          }
        ]),
        new hiprint.PrintElementTypeGroup("表格", [
          {
            title: "表格",
            tid: "configModule.table",
            field: "table",
            type: "table",
            editable: true,
            columnDisplayEditable: true, //列显示是否能编辑
            columnDisplayIndexEditable: true, //列顺序显示是否能编辑
            columnTitleEditable: true, //列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            isEnableEdit: true, // 启用编辑
            columnAlignEditable: true, //列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableEditText: true, //编辑文本
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                { title: "职位", align: "center", field: "position", width: 100 },
                { title: "公司", align: "center", field: "company", width: 100 },
                { title: "地点", align: "center", field: "address", width: 100 },
                { title: "时间", align: "center", field: "date", width: 100 },
                { title: "主要工作", align: "center", field: "work", width: 200 },
              ],
            ],
          },
          {
            title: "表格(多表头)",
            tid: "configModule.tableMulHead",
            field: "tableMulHead",
            type: "table",
            editable: true,
            columnDisplayEditable: true, //列显示是否能编辑
            columnDisplayIndexEditable: true, //列顺序显示是否能编辑
            columnTitleEditable: true, //列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true, //列对齐是否调整
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                { title: "职位", align: "center", field: "position", width: 100, rowspan: 2 },
                { title: "多表头", align: "center", field: "company", width: 100, colspan: 5 },
              ],
              [
                { title: "职位", align: "center", field: "position", width: 100 },
                { title: "公司", align: "center", field: "company", width: 100 },
                { title: "地点", align: "center", field: "address", width: 100 },
                { title: "时间", align: "center", field: "date", width: 100 },
                { title: "主要工作", align: "center", field: "work", width: 200 },
              ],
            ],
          },
          {
            text: "分组表格",
            tid: "configModule.groupTable",
            field: "groupTable",
            type: "table",
            groupFields: ["name"],
            groupFooterFormatter: function (group, option) {
              return "这里自定义统计脚信息";
            },
            columns: [
              [
                { title: "行号", fixed: true, rowspan: 2, field: "id", width: 70 },
                { title: "人员信息", colspan: 2 },
                { title: "销售统计", colspan: 2 },
              ],
              [
                { title: "姓名", align: "left", field: "name", width: 100 },
                { title: "性别", field: "gender", width: 100 },
                { title: "销售数量", field: "count", width: 100 },
                { title: "销售金额", field: "amount", width: 100 },
              ],
            ],
          },
          { tid: "configModule.tableCustom", title: "表格", type: "tableCustom" },
        ]),
        new hiprint.PrintElementTypeGroup("辅助", [
          { tid: "configModule.hline", text: "横线", type: "hline" },
          { tid: "configModule.vline", text: "竖线", type: "vline" },
          { tid: "configModule.rect", text: "矩形", type: "rect" },
          { tid: "configModule.oval", text: "椭圆", type: "oval" },
        ]),
        new hiprint.PrintElementTypeGroup("HTML", [
          {
            tid: "configModule.html",
            title: "html",
            width: 300,
            type: "html",
            formatter: (data, options) => $('<div style="font-size:16px; color:green">HTML文本</div>'),
          },
        ]),
      ]);
    };

    return { addElementTypes: addElementTypes };
  };
})();
