// import {register} from "@shopify/web-pixels-extension";

// register(({ analytics, browser, init, settings }) => {
//     // Bootstrap and insert pixel script tag here

//     // Sample subscribe to page view
//     analytics.subscribe('all_standard_events', (event) => {
//       console.log('New App Pixel Event', event);
//     });
// });




// Function to send events to prisma 

// import {register} from "@shopify/web-pixels-extension";
// import upsertFunction from "../../../app/db/upsertFunction";

// register(({ analytics, browser, init, settings }) => {
//     // Bootstrap and insert pixel script tag here

//     // Sample subscribe to page view
//     analytics.subscribe('all_standard_events', (event) => {
//       console.log('New App Pixel Event', event);
//       const eventname = event.name;
//       async function sendEvent() {
//         await upsertFunction(eventname); 
//       }
      
//       sendEvent();
//     });
// });


// Code to send events to mixpanel

// import { register } from '@shopify/web-pixels-extension';
// register(({ analytics }) => {
//   analytics.subscribe('all_standard_events', async (event) => {
//     const { timestamp, id, name, clientId } = event;

//     try {
//       const response = await fetch('https://api.mixpanel.com/track/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//           data: btoa(
//             JSON.stringify({
//               event: name,
//               properties: {
//                 distinct_id: clientId,
//                 token: "5b1e136ab5f2e01c3ad5116151e68860",
//               },
//             })
//           ),
//         }),
//       });

//       const responseData = await response.text();
//       console.log("Mixpanel Event Response:", responseData);
//     } catch (error) {
//       console.error("Mixpanel Event Error:", error);
//     }
//   });
// });


// Main code

// import { register } from '@shopify/web-pixels-extension';

// register(({ analytics }) => {
//   analytics.subscribe('all_standard_events', async (event) => {
//     const timeStamp = event.timestamp;
//     const eventId = event.id;
//     let eventType = event.name;
//     const pageUrl = event.data?.url || "Unknown";
//     const pathname = event.context?.window?.location?.pathname || event.data?.url || "/";
//     const clientId = event.clientId || event.data?.shopify_user_id || "anonymous";
//     const orig_referrer = event.context?.document?.referrer || "Unknown";
//     const utmParams = getUTMParameters(event.data?.url);

//     // Function to Flatten Nested Objects
//     function flattenObject(obj, prefix = '') {
//       let flattened = {};
//       for (const [key, value] of Object.entries(obj)) {
//         const newKey = prefix ? `${prefix}.${key}` : key;
//         if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//           Object.assign(flattened, flattenObject(value, newKey));
//         } else {
//           flattened[newKey] = value;
//         }
//       }
//       return flattened;
//     }

//     const flatEventData = flattenObject(event.data || {});

//     // Mixpanel Token
//     const mixpanelToken = "5b1e136ab5f2e01c3ad5116151e68860";

//     // ✅ Step 1: Send User Profile Data to Mixpanel
//     const userProfilePayload = {
//       $token: mixpanelToken,
//       $distinct_id: clientId,  
//       $set: {
//         $created_at: new Date().toISOString()
//       }
//   };

//     fetch('https://api.mixpanel.com/engage/', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({ data: btoa(JSON.stringify(userProfilePayload)) })
//     })
//     .then(response => response.json())
//     .then(data => console.log("Mixpanel User Profile Response:", data))
//     .catch(error => console.error("Mixpanel User Profile Error:", error));

//     try {
//       const response = await fetch('https://api.mixpanel.com/track/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//           data: btoa(
//             JSON.stringify({
//               event: eventType,
//               properties: {
//                 distinct_id: clientId,
//                 token: mixpanelToken,
//                 persistence: 'localStorage',
//                 timeStamp: timeStamp,
//                 $insert_id: eventId,
//                 pageUrl: pageUrl,
//                 pathname: pathname,
//                 $referring_domain: orig_referrer,
//                 ...flatEventData,
//                 ...utmParams
//               },
//             })
//           ),
//         }),
//       });

//       const responseData = await response.text();
//       console.log("Mixpanel Event Response:", responseData);

//     } catch (error) {
//       console.error("Mixpanel Event Error:", error);
//     }

//     function getUTMParameters(url) {
//       if (!url) return {};
//       const urlParams = new URLSearchParams(new URL(url).search);
//       return {
//         utm_source: urlParams.get("utm_source") || "None",
//         utm_medium: urlParams.get("utm_medium") || "None",
//         utm_campaign: urlParams.get("utm_campaign") || "None",
//         utm_term: urlParams.get("utm_term") || "None",
//         utm_content: urlParams.get("utm_content") || "None",
//       };
//     }
//   });
// });





import { register } from '@shopify/web-pixels-extension';

register(({ analytics }) => {
  analytics.subscribe('all_standard_events', async (event) => {
    const { clientId } = event;

    try {
      const response = await fetch('https://api.mixpanel.com/track/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          data: btoa(
            JSON.stringify({
              event: event.name,  // Corrected: use event.name or relevant property
              properties: {
                distinct_id: clientId,
                token: "5b1e136ab5f2e01c3ad5116151e68860",
              },
            })
          ),
        }),
      });

      const responseData = await response.text();
      console.log("Mixpanel Event Response:", responseData);

      const appURL = process.env.APP_URL;
      await fetch(`${appURL}/api/store-clientId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: btoa(JSON.stringify({ clientId })),
        }),
      });

    } catch (error) {
      console.error("Event Error:", error);
    }
  });
});