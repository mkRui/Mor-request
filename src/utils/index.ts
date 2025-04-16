import eventDispatch from "./event-dispatch";

export { to, toCallback } from "./request-fn";

const EventDispatch = new eventDispatch();

export { EventDispatch };
