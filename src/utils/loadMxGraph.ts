import mx from "mxgraph";

window["mxBasePath"] = "/mxgraph-base";
window["mxDefaultLanguage"] = "en";
window["mxImageBasePath"] = "/mxgraph-base/images";
window["mxLoadResources"] = false;
window["mxLoadStylesheets"] = false;
window["mxForceIncludes"] = false;
window["mxResourceExtension"] = ".txt";

const mxgraph = mx({});

// decode bug https://github.com/jgraph/mxgraph/issues/49
(window as any).mxGraph = mxgraph.mxGraph;
(window as any).mxGraphModel = mxgraph.mxGraphModel;
(window as any).mxEditor = mxgraph.mxEditor;
(window as any).mxGeometry = mxgraph.mxGeometry;
(window as any).mxDefaultKeyHandler = mxgraph.mxDefaultKeyHandler;
(window as any).mxDefaultPopupMenu = mxgraph.mxDefaultPopupMenu;
(window as any).mxStylesheet = mxgraph.mxStylesheet;
(window as any).mxDefaultToolbar = mxgraph.mxDefaultToolbar;
export default mxgraph;
