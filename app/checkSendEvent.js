import upsertFunction from "./db/upsertFunction.js";

async function sendEvent() {
  await upsertFunction("paymney-info-submitted"); // Example event
}

sendEvent();

