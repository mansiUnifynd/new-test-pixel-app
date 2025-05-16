// import {register} from "@shopify/web-pixels-extension";

// import { mixpanel_token } from '../../mixpan';

// console.log("Mixpanel Token:", mixpanel_token);

// register(({ analytics, browser, init, settings }) => {
//     // Bootstrap and insert pixel script tag here

//     // Sample subscribe to page view
//     analytics.subscribe('all_standard_events', (event) => {
//       console.log('Events on Lab Store', event);
//       console.log("Mixpanel Token:", mixpanel_token);
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
//                 token: "8f25e7ad6f912954ce63a4ac331ed541",
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





// import { register } from '@shopify/web-pixels-extension';

// register(({ analytics }) => {
//   analytics.subscribe('all_standard_events', async (event) => {
//     const { clientId } = event;

//     try {
//       const response = await fetch('https://api.mixpanel.com/track/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//           data: btoa(
//             JSON.stringify({
//               event: event.name,  // Corrected: use event.name or relevant property
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

//       const appURL = process.env.APP_URL;
//       await fetch(`${appURL}/api/store-clientId`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           data: btoa(JSON.stringify({ clientId })),
//         }),
//       });

//     } catch (error) {
//       console.error("Event Error:", error);
//     }
//   });
// });




// import { register } from '@shopify/web-pixels-extension';

// function flattenObject(obj, prefix = '') {
//   let flattened = {};
//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}.${key}` : key;
//     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//       Object.assign(flattened, flattenObject(value, newKey));
//     } else {
//       flattened[newKey] = value;
//     }
//   }
//   return flattened;
// }

// function getUTMParameters(url) {
//   if (!url) return {};
//   try {
//     const urlParams = new URLSearchParams(new URL(url).search);
//     return {
//       utm_source: urlParams.get("utm_source") || "None",
//       utm_medium: urlParams.get("utm_medium") || "None",
//       utm_campaign: urlParams.get("utm_campaign") || "None",
//       utm_term: urlParams.get("utm_term") || "None",
//       utm_content: urlParams.get("utm_content") || "None",
//     };
//   } catch (e) {
//     return {};
//   }
// }

// register(({ analytics }) => {
//   analytics.subscribe('all_standard_events', async (event) => {
//     const { clientId } = event;
//     const timeStamp = event.timestamp;
//     const eventId = event.id;
//     const eventType = event.name;
//     const pageUrl = event.data?.url || "Unknown";
//     const pathname = event.context?.window?.location?.pathname || event.data?.url || "/";
//     const orig_referrer = event.context?.document?.referrer || "Unknown";
//     const utmParams = getUTMParameters(event.data?.url);

//     const flatEventData = flattenObject(event.data || {});

//     const mixpanelToken = "8f25e7ad6f912954ce63a4ac331ed541";

//     // ✅ Step 1: Send User Profile Data to Mixpanel
//     const userProfilePayload = {
//       $token: mixpanelToken,
//       $distinct_id: clientId,
//       $set: {
//         $created_at: new Date().toISOString()
//       }
//     };

//     try {
//       await fetch('https://api.mixpanel.com/engage/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({ data: btoa(JSON.stringify(userProfilePayload)) })
//       });

//       // ✅ Step 2: Send Events Data to Mixpanel
//       const eventPayload = {
//         event: eventType,
//         properties: {
//           distinct_id: clientId,
//           token: mixpanelToken,
//           persistence: 'localStorage',
//           timeStamp: timeStamp,
//           $insert_id: eventId,
//           pageUrl: pageUrl,
//           pathname: pathname,
//           $referring_domain: orig_referrer,
//           ...flatEventData,
//           ...utmParams
//         },
//       };

//       const response = await fetch('https://api.mixpanel.com/track/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: new URLSearchParams({
//           data: btoa(JSON.stringify(eventPayload)),
//         }),
//       });

//       const responseData = await response.text();
//       console.log("Mixpanel Event Response:", responseData);

//       // ✅ Step 3: Send clientId to your backend
//       const appURL = process.env.APP_URL; 
//       await fetch(`${appURL}/api/store-clientId`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           data: btoa(JSON.stringify({ clientId })),
//         }),
//       });

//     } catch (error) {
//       console.error("Mixpanel Event Error:", error);
//     }
//   });
// });


import { register } from '@shopify/web-pixels-extension';

// ✅ Custom event name mapping — place it here at the top
const eventNameMap = {
  "page_viewed": "Page Viewed",
  "product_viewed": "Product Viewed",
  "collection_viewed": "Collection Viewed",
  "checkout_completed": "Checkout Completed",
  "product_added_to_cart": "Added to Cart",
  "product_removed_from_cart": "Removed from Cart",
  "cart_viewed": "Cart Viewed"
};

function flattenObject(obj, prefix = '') {
  let flattened = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  return flattened;
}

function getUTMParameters(url) {
  if (!url) return {};
  try {
    const urlParams = new URLSearchParams(new URL(url).search);
    return {
      utm_source: urlParams.get("utm_source") || "None",
      utm_medium: urlParams.get("utm_medium") || "None",
      utm_campaign: urlParams.get("utm_campaign") || "None",
      utm_term: urlParams.get("utm_term") || "None",
      utm_content: urlParams.get("utm_content") || "None",
    };
  } catch (e) {
    console.error("Failed to extract UTM parameters:", e.message);
    return {};
  }
}

// Get parent id through child id using onclick

// function getParentIdByChildId(childId) {
//   const element = document.getElementById(childId);
  
//   if (element) {
//       element.onclick = function() {
//           const parentElement = element.parentElement;
//           const parentId = parentElement ? parentElement.id : null;
          
//           console.log("Element clicked:", element);
//           console.log("Parent ID:", parentId ? parentId : "No parent element found.");
          
//       };
//   } else {
//       console.log("Element with ID '" + childId + "' not found.");
//   }
// }


function getParentIdByChildId(childId) {
  const child = document.getElementById(childId);
  if (child && child.parentElement) {
    return child.parentElement.id || child.id;
  }
  return child ? child.id : null;
}


//Working parent id by element id

// function getParentIdByChildId(childId) {
//   if (!childId) {
//     console.error("getParentIdByChildId was called with an invalid childId:", childId);
//     return null;
//   }
//   const child = document.getElementById(childId);
//   if (child && child.parentElement) {
//     const parentId = child.parentElement.id;
//     if (!parentId) {
//       console.error(`Parent element found but it has no ID. Child ID: ${childId}`);
//       return child.id;
//     }
//     return parentId;
//   }
//   if (!child) {
//     console.error(`No element found with the provided childId: ${childId}`);
//   } else {
//     console.error(`Element found for childId: ${childId}, but it has no parent element.`);
//   }
//   return child ? child.id : null;
// }

const mixpanelToken = "5b1e136ab5f2e01c3ad5116151e68860";

register(({ analytics }) => {
  analytics.subscribe('all_standard_events', async (event) => {
    const { clientId } = event;
    const timeStamp = event.timestamp;
    const eventId = event.id;
    console.log("Events Data", event);

    const originalEventType = event.name;
    const eventType = eventNameMap[originalEventType] || originalEventType;

    const pageUrl = event.data?.url || "Unknown";
    const pathname = event.context?.window?.location?.pathname || event.data?.url || "/";
    const orig_referrer = event.context?.document?.referrer || "direct";
    const utmParams = getUTMParameters(event.data?.url);
    const flatEventData = flattenObject(event.data || {});

    // ✅ Send User Profile Data to Mixpanel
    const userProfilePayload = {
      $token: mixpanelToken,
      $distinct_id: clientId,
      $set: {
        $created_at: new Date().toISOString()
      }
    };

    try {
      await fetch('https://api.mixpanel.com/engage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data: btoa(JSON.stringify(userProfilePayload)) })
      });

      // ✅ Send Event Data
      const eventPayload = {
        event: eventType,
        properties: {
          distinct_id: clientId,
          token: mixpanelToken,
          persistence: 'localStorage',
          timeStamp: timeStamp,
          $insert_id: eventId,
          pageUrl: pageUrl,
          pathname: pathname,
          $referring_domain: orig_referrer,
          ...flatEventData,
          ...utmParams
        },
      };

      const response = await fetch('https://api.mixpanel.com/track/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          data: btoa(JSON.stringify(eventPayload)),
        }),
      });

      const responseData = await response.text();
      console.log("Mixpanel Event Response:", responseData);

      // ✅ Send clientId to your backend
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
      console.error("Mixpanel error:", error);
    }
  });

  analytics.subscribe('clicked', async (event) => {
    const { timestamp, id, clientId } = event;
    const elementid = event.data?.element?.id || "Unknown Element";
    const flatEventData = flattenObject(event.data || {});
    const pageUrl = event.data?.url || "Unknown";
    const utmParams = getUTMParameters(pageUrl);

    let parentId = null;
    try {
      parentId = getParentIdByChildId(elementid);
      console.log("Parent ID:", parentId);
    } catch (error) {
      console.error("COULD NOT GET PARENT ID:", error.message);
    }

    try {
      const response = await fetch('https://api.mixpanel.com/track/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          data: btoa(
            JSON.stringify({
              event: elementid,
              properties: {
                distinct_id: clientId,
                token: mixpanelToken,
                parent_element_id: parentId,
                ...flatEventData,
                ...utmParams
              },
            })
          ),
        }),
      });

      const responseData = await response.text();
      console.log("Mixpanel Click Event Response:", responseData);
    } catch (error) {
      console.error("Mixpanel Click Event Error:", error);
    }
  });
});
