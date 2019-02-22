const midi = require('midi');

async function listInputs(filter) {
  const midiInput = new midi.input(); // eslint-disable-line new-cap
  const midiInputCount = midiInput.getPortCount();

  let inputs = new Array(midiInputCount).fill(0).map((n, portId) => ({
    id: portId,
    name: midiInput.getPortName(portId),
  }));

  if (filter) {
    inputs = inputs.filter(port => port.name.indexOf(filter) >= 0);
  }

  return inputs;
}

async function listOutputs(filter) {
  const midiOutput = new midi.output(); // eslint-disable-line new-cap
  const midiOutputCount = midiOutput.getPortCount();

  let outputs = new Array(midiOutputCount).fill(0).map((n, portId) => ({
    id: portId,
    name: midiOutput.getPortName(portId),
  }));

  if (filter) {
    outputs = outputs.filter(port => port.name.indexOf(filter) >= 0);
  }

  return outputs;
}

module.exports = {
  midi,
  listInputs,
  listOutputs,
};
