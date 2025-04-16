





// import { authenticate } from "../shopify.server";
// import db from "../db.server";

// export const action = async ({ request }) => {
//   const { payload, session, topic, shop } = await authenticate.webhook(request);

//   console.log(`Received ${topic} webhook for ${shop}`);
//   const current = payload.current;

//   if (session) {
//     await db.session.update({
//       where: {
//         id: session.id,
//       },
//       data: {
//         scope: current.toString(),
//       },
//     });
//   }

//   return new Response();
// };

// import { authenticate } from "../shopify.server";
// import db from "../db.server";

// export const action = async ({ request }) => {
//   const { shop, topic, payload } = await authenticate.webhook(request);
//   console.log(`Received ${topic} webhook for ${shop}`);

//   if (topic === "orders/create") {
//     const orderData = {
//       id: payload.id,
//       shop,
//       customerEmail: payload.email,
//       totalPrice: payload.total_price,
//       currency: payload.currency,
//       createdAt: payload.created_at,
//       lineItems: JSON.stringify(payload.line_items), // Convert to JSON string for storage
//     };

//     // Store the order in the database (ensure the order is not already stored)
//     await db.order.upsert({
//       where: { id: payload.id },
//       update: orderData,
//       create: orderData,
//     });

//     console.log(`Order ${payload.id} stored successfully.`);
//   }

//   return new Response(null, { status: 200 });
// };



// import { authenticate } from "../shopify.server";
// import db from "../db.server";

// export const action = async ({ request }) => {
//   const { shop, topic, payload } = await authenticate.webhook(request);
//   console.log(`Received ${topic} webhook for ${shop}`);

//   if (topic === "orders/create") {
//     const orderData = {
//       id: payload.id,
//       shop,
//       customerEmail: payload.email,
//       totalPrice: payload.total_price,
//       currency: payload.currency,
//       createdAt: payload.created_at,
//       lineItems: JSON.stringify(payload.line_items), // Convert to JSON string for storage
//     };

//     // Store the order in the database (ensure the order is not already stored)
//     await db.order.upsert({
//       where: { id: payload.id },
//       update: orderData,
//       create: orderData,
//     });

//     console.log(`Order ${payload.id} stored successfully.`);

//     // Send Checkout Completed event to Mixpanel (Only Event Name)
//     try {
//       const mixpanelEvent = {
//         event: "Checkout Completed",
//         properties: {
//           token: "5b1e136ab5f2e01c3ad5116151e68860", // Mixpanel token
//         },
//       };

//       const response = await fetch("https://api.mixpanel.com/track/", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           data: btoa(JSON.stringify(mixpanelEvent)), // Encode data
//         }),
//       });

//       const responseData = await response.text();
//       console.log("Mixpanel Event Response:", responseData);
//     } catch (error) {
//       console.error("Mixpanel Event Error:", error);
//     }
//   }

//   return new Response(null, { status: 200 });
// };





// Checking if I can call the client if from the apiVersion.store-clientId.js

import { authenticate } from "../shopify.server";
import { clientIdStore } from "./api.store-clientId"; // Import the clientIdStore and send it as discinct_id
export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  console.log("Webhook Payload:", payload);

  try {
    // Retrieve the latest clientId from the in-memory store
    const latestClientId = clientIdStore.length > 0 ? clientIdStore[clientIdStore.length - 1] : null;

    console.log("🔗 Associated clientId:", latestClientId);

    // Prepare the Mixpanel event
    const mixpanelEvent = {
      event: "Purchased",
      properties: {
        token: "5b1e136ab5f2e01c3ad5116151e68860", // Replace with your actual Mixpanel token
        distinct_id: latestClientId || "unknown", // Use clientId if available, otherwise fallback
        checkout_token: payload.checkout_token,
        shop,
        topic,
      },
    };

    // Send the event to Mixpanel
    await fetch("https://api.mixpanel.com/track/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        data: btoa(JSON.stringify(mixpanelEvent)),
      }),
    });

    console.log("checkout_completed event sent to Mixpanel");
  } catch (error) {
    console.error("Error sending event to Mixpanel:", error);
  }

  return new Response();
};