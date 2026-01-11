const POST_THRESHOLD_S=0.1;class GodotPositionReportingProcessor extends AudioWorkletProcessor{constructor(...args){super(...args);this.lastPostTime=currentTime;this.position=0;this.ended=!1;this.port.onmessage=(event)=>{if(event?.data?.type==='ended'){this.ended=!0}}}
process(inputs,_outputs,_parameters){if(this.ended){return!1}
if(inputs.length>0){const input=inputs[0];if(input.length>0){this.position+=input[0].length}}
if(currentTime-this.lastPostTime>POST_THRESHOLD_S){this.lastPostTime=currentTime;this.port.postMessage({type:'position',data:this.position})}
return!0}}
registerProcessor('godot-position-reporting-processor',GodotPositionReportingProcessor)