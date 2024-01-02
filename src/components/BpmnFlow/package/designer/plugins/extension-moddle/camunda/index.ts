"use strict";

// module.exports = {
//   __init__: ["camundaModdleExtension"],
//   camundaModdleExtension: ["type", require("./extension")]
// };

import { CamundaModdleExtension } from "./extension";

export default {
  __init__: ["camundaModdleExtension"],
  camundaModdleExtension: ["type", CamundaModdleExtension]
};
