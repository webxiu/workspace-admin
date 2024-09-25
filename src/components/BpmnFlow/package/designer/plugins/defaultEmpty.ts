export default (key, name, type) => {
  if (!type) type = "camunda";
  const TYPE_TARGET = {
    activiti: "http://activiti.org/bpmn",
    camunda: "http://bpmn.io/schema/bpmn",
    flowable: "http://flowable.org/bpmn" // http://www.flowable.org/processdef
  };
  /** 生成任务节点有bpmn2 */
  // return `<?xml version="1.0" encoding="UTF-8"?>
  // <definitions
  //   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  //   xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  //   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  //   xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  //   xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  //   id="diagram_${key}"
  //   targetNamespace="${TYPE_TARGET[type]}">
  //   <process id="${key}" name="${name}" isExecutable="true">
  //   </process>
  //   <bpmndi:BPMNDiagram id="BPMNDiagram_1">
  //     <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
  //     </bpmndi:BPMNPlane>
  //   </bpmndi:BPMNDiagram>
  // </definitions>`;

  /** 生成任务节点没有bpmn2 */
  return `<?xml version="1.0" encoding="UTF-8"?>
  <definitions 
    xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:flowable="http://flowable.org/bpmn" 
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
    xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" 
    xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" 
    typeLanguage="http://www.w3.org/2001/XMLSchema" 
    expressionLanguage="http://www.w3.org/1999/XPath" 
    targetNamespace="http://www.flowable.org/processdef" 
    exporter="Flowable Open Source Modeler" 
    exporterVersion="6.7.2"
    id="diagram_${key}"
    targetNamespace="${TYPE_TARGET[type]}"
    >
    <process id="${key}" name="${name}" isExecutable="true">
    </process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}" />
    </bpmndi:BPMNDiagram>
  </definitions>`;
};
