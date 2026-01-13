export let CURRENT_STATE = "INIT";

export function setState(state) {
  CURRENT_STATE = state;
}

export function getState() {
  return CURRENT_STATE;
}
