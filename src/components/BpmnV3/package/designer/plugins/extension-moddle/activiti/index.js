/*
 * @author igdianov
 * address https://github.com/igdianov/activiti-bpmn-moddle
 * */

// module.exports = {
//   __init__: ["ActivitiModdleExtension"],
//   ActivitiModdleExtension: ["type", require("./activitiExtension")]
// };

import { ActivitiModdleExtension } from "./activitiExtension";

export default {
  __init__: ["ActivitiModdleExtension"],
  ActivitiModdleExtension: ["type", ActivitiModdleExtension]
};
