/*
 * @author igdianov
 * address https://github.com/igdianov/activiti-bpmn-moddle
 * */

// module.exports = {
//   __init__: ["FlowableModdleExtension"],
//   FlowableModdleExtension: ["type", require("./flowableExtension")]
// };
export default {
  __init__: ["FlowableModdleExtension"],
  FlowableModdleExtension: ["type", import("./flowableExtension")]
};
