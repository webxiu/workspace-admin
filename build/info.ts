import { blue, bold, green } from "picocolors";
import dayjs, { Dayjs } from "dayjs";

import type { Plugin } from "vite";
import duration from "dayjs/plugin/duration";
import utils from "@pureadmin/utils";

dayjs.extend(duration);

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? "dist";
    },
    buildStart() {
      console.log(bold(green(`👏项目${blue("运行中")}...`)));
      if (config.command === "build") {
        startTime = dayjs(new Date());
      }
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(new Date());
        utils.getPackageSize({
          folder: outDir,
          callback: (size: string) => {
            console.log(bold(green(`🎉恭喜打包完成（总用时${dayjs.duration(endTime.diff(startTime)).format("mm分ss秒")}，打包后的大小为${size}）`)));
          }
        });
      }
    }
  };
}
