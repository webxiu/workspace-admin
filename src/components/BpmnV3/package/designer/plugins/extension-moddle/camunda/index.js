"use strict";

// module.exports = {
//   __init__: ["camundaModdleExtension"],
//   camundaModdleExtension: ["type", require("./extension")]
// };
export default {
  __init__: ["camundaModdleExtension"],
  camundaModdleExtension: ["type", import("./extension")]
};
