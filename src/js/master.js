/*!
 * Project: WavePlugin
 * Author: Jonathan Hayman
 * Company: Anglia Computer Solutions Business Ltd
 * Description: This file includes global JavaScript functionalities for the WavePlugin project.
 * Created on: 28-06-2024
 * Last Updated: 28-06-2024
 * Version: 1.0.0
 *
 * License: MIT
 *
 * Example Usage:
 * - This file is automatically bundled and included in the project via Webpack.
 */

// Import our custom CSS

import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import axios from "axios";

// Import PluginSDK event constants
import { pluginEvent } from "./events";

/**
 * Monitor events:
 * Window initialization is complete.
 * Callback function parameters:
 * userConfig User parameters
 * pluginPath Add-in installation path
 * https://doc.grandstream.dev/WAVE/EN/#api-Development%20Guidelines-The%20First%20Add-in
 *
 */
let globalUserConfig = null;

let callerNumber = null;

let callDuration = null;

let callStartTime = null;

let apiUrl = "https://localhost/api/";

pluginSDK.eventEmitter.on(pluginEvent.onInitPluginWindow, async function ({ userConfig, pluginPath }) {
  // userConfig = "";
  // pluginSDK.userConfig.addUserConfig({ userConfig: JSON.stringify(userConfig) }, ({ errorCode }) => {
  //   if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
  //     pluginSDK.log.info("add user config success");
  //     return;
  //   }
  //   console.error("add user config failure, errorCode: ", errorCode);
  // });
  globalUserConfig = await getUserConfig();
  let data = globalUserConfig;
  pluginSDK.log.info("new globalUserConfig stuff: ");
  pluginSDK.log.info(data.tilmor_api_key);
  if (typeof data.tilmor_api_key === "undefined" || data === null || data.tilmor_api_key === "" || data.tilmor_api_key === null || (typeof data === "object" && Object.keys(data).length === 0)) {
    pluginSDK.log.info("no key found, showing input box");
    document.getElementById("apiKeyContainer").classList.toggle("hideApiInput");
  }
  // pluginSDK.userConfig.getUserConfig(({ errorCode, data }) => {
  //   if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
  //     pluginSDK.log.info("get user config success new");
  //     pluginSDK.log.info("data: ");
  //     pluginSDK.log.info(data);
  //     data = JSON.parse(data);
  //     if (typeof data.tilmor_api_key === "undefined" || data === null || data.tilmor_api_key === "" || data.tilmor_api_key === null || (typeof data === "object" && Object.keys(data).length === 0)) {
  //       pluginSDK.log.info("no key found, showing input box");
  //       document.getElementById("apiKeyContainer").classList.toggle("hideApiInput");
  //     }
  //     return;
  //   }
  //   pluginSDK.log.info("get user config failure, errorCode: ");
  //   pluginSDK.log.info(errorCode);
  // });
  pluginSDK.log.info("onInitPluginWindowOk is good");
  pluginSDK.log.info("testing logging");
  pluginSDK.setDefaultWindow({
    width: 900,
    height: 500,
    center: true,
    show: false,
  });
  // let body = '<div style="margin-bottom: 12px; color:white;">Plugin has been initialized and updated</div>';
  // pluginSDK.displayNotification({ notificationBody: body });
  //     body = '<div style="margin-bottom: 12px; color:white;">Testing another notification</div>';
  //     pluginSDK.displayNotification({ notificationBody: body });
});
//onRecvIncomingCall,onAnswerCall
pluginSDK.eventEmitter.on(pluginEvent.onHangupCall, async function ({ callNum, callType }) {
  if (callNum == 1013) {
    callNum = 3306000516;
  }
  pluginSDK.log.info("hit hangup call event");
  if (callStartTime) {
    let callEndTime = Date.now();
    callDuration = Math.floor((callEndTime - callStartTime) / 1000); // Duration in seconds
    pluginSDK.log.info("Call duration: " + callDuration + " seconds");
    callStartTime = null; // Reset for next call
  } else {
    callDuration = 0; // No call start time recorded
    pluginSDK.log.info("No call start time recorded.");
  }
  axios
    .post(
      apiUrl + "phone-logs/submit",
      {
        user_id: document.getElementById("userIdElement").getAttribute("data-user-id"),
        answered_by_name: callDuration > 0 ? globalUserConfig.username : null,
        caller_number: callNum,
        call_duration: callDuration,
        answered: callDuration > 0 ? true : false,
      },
      {
        headers: {
          Authorization: `Bearer ${globalUserConfig.tilmor_api_key}`,
        },
      }
    )
    .then((response) => {});
});

pluginSDK.eventEmitter.on(pluginEvent.onAnswerCall, async function ({ callNum, callType }) {
  callStartTime = new Date();
});
pluginSDK.eventEmitter.on(pluginEvent.onRecvIncomingCall, async function ({ callNum, callType }) {
  pluginSDK.log.info("hit second incoming call event");
  pluginSDK.log.info("received incoming call event");
  if (callNum == 1013) {
    callNum = 1112227777;
  }
  callerNumber = callNum;
  let currentUserConfig = globalUserConfig;
  pluginSDK.log.info("show new current user config: ");
  pluginSDK.log.info(currentUserConfig.tilmor_api_key);
  pluginSDK.log.info("global user config also has access:");
  pluginSDK.log.info(globalUserConfig.tilmor_api_key);
  if (!userHasKey(currentUserConfig)) {
    let noKeyFoundBody = "<div style='margin-bottom: 12px;'><div style='color:white'>No API key found</div></div>";
    pluginSDK.displayNotification({ notificationBody: noKeyFoundBody });
  } else {
    const apiKey = currentUserConfig.tilmor_api_key;

    axios
      .get(apiUrl + "users/get-by-phone/" + callNum, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        if (response.status === 403) {
          let forbiddenBody =
            "<div style='margin-bottom: 12px;'><div style='color:white'>Access forbidden: You do not have permission to view this customer's details. Please add the API key to the plugin.</div></div>";
          pluginSDK.displayNotification({ notificationBody: forbiddenBody });
          pluginSDK.log.error("403 Forbidden: Access denied for the requested resource.");
          return;
        } else if (response.status === 200 && response.data && response.data.type == "user") {
          let responseData = response.data;
          pluginSDK.log.info("getting user id: ");
          pluginSDK.log.info(responseData.data.id);
          window.open("https://www.tilmor.com/en-us/admin/settings/person/" + responseData.data.id);
          pluginSDK.log.info("phone notes before:");
          pluginSDK.log.info(responseData.data.phone_notes);
          let siteNotesFound = false;
          let phoneNotesFound = false;
          let phoneNotesHtml = `<h2>User: ${responseData.data.firstName} ${responseData.data.lastName}</h2><br>`;
          window.location.hash = "#/home";
          setTimeout(() => {
            document.getElementById("newNoteContainer").classList.remove("hideSection");
            document.getElementById("userIdElement").setAttribute("data-user-id", responseData.data.id);
            if (
              typeof responseData.data.site_notes !== "undefined" &&
              responseData.data.site_notes !== null &&
              responseData.data.site_notes !== "" &&
              Array.isArray(responseData.data.site_notes) &&
              responseData.data.site_notes.length > 0
            ) {
              siteNotesFound = true;
              pluginSDK.log.info("site notes found, displaying them");
              pluginSDK.log.info(responseData.data.site_notes);
              phoneNotesHtml += "<h3>Site Notes:</h3><br><ul>";
              responseData.data.site_notes.forEach((note) => {
                phoneNotesHtml += `<li>${note.note} - ${note.created_at_date} at ${note.created_at_time} by ${note.created_by_name}</li>`;
              });
            }
            if (
              typeof responseData.data.phone_notes !== "undefined" &&
              responseData.data.phone_notes !== null &&
              responseData.data.phone_notes !== "" &&
              Array.isArray(responseData.data.phone_notes) &&
              responseData.data.phone_notes.length > 0
            ) {
              phoneNotesFound = true;
              if (siteNotesFound) {
                phoneNotesHtml += "</ul><hr><h3>Phone Notes:</h3><ul id='phoneNotesList'>";
              } else {
                phoneNotesHtml += "<h3>Phone Notes:</h3><br><ul id='phoneNotesList'>";
              }
              responseData.data.phone_notes.forEach((note) => {
                phoneNotesHtml += `<li>${note.note} - ${note.created_at_date} at ${note.created_at_time} by ${note.created_by_name}</li>`;
              });
            } else {
              phoneNotesHtml += "<h3>Phone Notes:</h3><br><ul id='phoneNotesList'>";
            }
            if (phoneNotesFound || siteNotesFound) {
              phoneNotesHtml += "</ul>";
              document.getElementById("phoneNotesContainer").innerHTML = phoneNotesHtml;
              //document.getElementById("phoneNotesContainer").classList.remove("hideSection");
            }
            pluginSDK.setDefaultWindow({
              width: 1200,
              height: 800,
              center: true,
              show: true,
            });
            //document.location.href = "https://www.tilmor.com/en-us/admin/settings/person/"+responseData.data.id;
            //pluginSDK.log.info(responseData.firstName);
          }, 100);
        } else if (response.status === 200 && response.data && response.data.type == "phone_notes") {
          let callBody =
            "<div style='margin-bottom: 12px;'><div style='color:white'>The number " +
            callNum +
            " is not associated with a tilmor customer but has notes.</div><button class='btn btn-success' type='button' onclick='window.open(\"https://www.tilmor.com/en-us/admin/settings/crm/new-lead?redir=account.dashboard.customers\")'>Create Customer</button></div>";
          pluginSDK.displayNotification({ notificationBody: callBody });
          pluginSDK.log.info("getting phone notes: ");
          pluginSDK.log.info(response.data.data);
          let phoneNotesHtml = `<h2>Number: ${callNum}</h2><br>`;
          document.getElementById("newNoteContainer").classList.remove("hideSection");
          if (response.data.data && response.data.data.length > 0) {
            phoneNotesHtml += "<h3>Phone Notes:</h3><br><ul id='phoneNotesList'>";
            response.data.data.forEach((note) => {
              phoneNotesHtml += `<li>${note.note} - ${note.created_at_date} at ${note.created_at_time} by ${note.created_by_name}</li>`;
            });
            phoneNotesHtml += "</ul>";
          } else {
            phoneNotesHtml += "<h3>Phone Notes:</h3><br><ul id='phoneNotesList'></ul>";
          }
          document.getElementById("phoneNotesContainer").innerHTML = phoneNotesHtml;
          pluginSDK.setDefaultWindow({
            width: 1200,
            height: 800,
            center: true,
            show: true,
          });
        } else {
          let callBody =
            "<div style='margin-bottom: 12px;'><div style='color:white'>The number " +
            callNum +
            " is not associated with a tilmor customer.</div><button class='btn btn-success' type='button' onclick='window.open(\"https://www.tilmor.com/en-us/admin/settings/crm/new-lead?redir=account.dashboard.customers\")'>Create Customer</button></div>";
          pluginSDK.displayNotification({ notificationBody: callBody });
          document.getElementById("newNoteContainer").classList.remove("hideSection");
          let phoneNotesHtml = `<h2>Number: ${callNum}</h2><br>`;
          phoneNotesHtml += "<h3>Phone Notes:</h3><br><ul id='phoneNotesList'></ul>";
          document.getElementById("phoneNotesContainer").innerHTML = phoneNotesHtml;
          pluginSDK.setDefaultWindow({
            width: 1200,
            height: 800,
            center: true,
            show: true,
          });
        }
      })
      .catch((error) => {
        let callBody =
          "<div style='margin-bottom: 12px;'><div style='color:white'>There was an unknown error that occurred while trying to retrieve phone notes for " +
          callNum +
          ".</div>";
        pluginSDK.displayNotification({ notificationBody: callBody });
        document.getElementById("newNoteContainer").classList.remove("hideSection");
        let phoneNotesHtml = `<h2>Number: ${callNum}</h2><br>`;
        document.getElementById("phoneNotesContainer").innerHTML = phoneNotesHtml;
        pluginSDK.setDefaultWindow({
          width: 1200,
          height: 800,
          center: true,
          show: true,
        });
        let errorMessage = "An unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        pluginSDK.log.info("errorResponseData from no match:");
        pluginSDK.log.info("Here is the error response data:");
        pluginSDK.log.info(errorMessage);
      });
  }

  pluginSDK.log.info("a call is incoming from " + formatPhoneNumber(callNum));
  // let callBody = '<div style="margin-bottom: 12px; color:white;">The number calling is: ' + formatPhoneNumber(callNum) + "</div>";

  // pluginSDK.displayNotification({ notificationBody: callBody });
});

function formatPhoneNumber(phoneNumber) {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  if (cleaned.length === 10) {
    // Format the number as (XXX) XXX-XXXX
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else {
    return phoneNumber;
  }
}

async function submitApiKey(key) {
  let newUserConfig = await getUserConfig();
  newUserConfig.tilmor_api_key = key;
  pluginSDK.userConfig.addUserConfig({ userConfig: JSON.stringify(newUserConfig) }, ({ errorCode }) => {
    if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
      pluginSDK.log.info("add user config success");
      return;
    }
    pluginSDK.log.info("add user config failure");
  });
  document.getElementById("apiKeyContainer").classList.toggle("hideApiInput");
  document.getElementById("apiKeySuccess").innerHTML = "API key successfully saved!";
}

window.submitNote = async function submitNote(note) {
  pluginSDK.log.info("submitting note:");
  pluginSDK.log.info(note);
  pluginSDK.log.info("get global user config: ");
  pluginSDK.log.info(globalUserConfig.tilmor_api_key);

  axios
    .post(
      apiUrl + "phone-notes/submit",
      {
        phone_note: note,
        user_id: document.getElementById("userIdElement").getAttribute("data-user-id") == null ? null : document.getElementById("userIdElement").getAttribute("data-user-id"),
        created_by_name: globalUserConfig.username,
        caller_number: callerNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${globalUserConfig.tilmor_api_key}`,
        },
      }
    )
    .then((response) => {
      let noteResponse = document.getElementById("noteResponse");
      pluginSDK.log.info("here is the response status:");
      pluginSDK.log.info(response.status);
      if (response.status === 403) {
        let forbiddenBody =
          "<div style='margin-bottom: 12px;'><div style='color:white'>Access forbidden: You do not have permission to use this function. Please add the API key to the plugin.</div></div>";
        pluginSDK.displayNotification({ notificationBody: forbiddenBody });
        pluginSDK.log.error("403 Forbidden: Access denied for the requested resource.");
        return;
      } else if (response.status === 200) {
        pluginSDK.log.info("note submitted successfully");
        document.getElementById("noteInput").value = "";

        noteResponse.classList.add("statusSuccess");
        noteResponse.innerHTML = "Note successfully submitted!";

        let phoneNotesList = document.getElementById("phoneNotesList");
        if (phoneNotesList) {
          const li = document.createElement("li");
          const now = new Date();
          let time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
          time = time.replace(" ", "").toLowerCase();
          li.textContent = `${note} - ${new Date().toLocaleDateString()} at ${time} by ${globalUserConfig.username}`;
          phoneNotesList.appendChild(li);
        }
        // Fade out the success message slowly
      } else {
        pluginSDK.log.info("Unexpected response status");
        let noteResponse = document.getElementById("noteResponse");
        noteResponse.classList.add("statusError");
        noteResponse.innerHTML = "Error submitting note.";
      }
      setTimeout(() => {
        noteResponse.style.transition = "opacity 1s";
        noteResponse.style.opacity = "0";
        setTimeout(() => {
          noteResponse.innerHTML = "";
          noteResponse.classList.remove("statusSuccess", "statusError");
          noteResponse.style.opacity = "";
          noteResponse.style.transition = "";
        }, 1000);
      }, 4000);
    });
};
window.submitName = submitName;

window.submitApiKey = submitApiKey;

// function getUserConfig() {
//   pluginSDK.userConfig.getUserConfig(({ errorCode, data }) => {
//     if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
//       pluginSDK.log.info("get user config success new");
//       pluginSDK.log.info("data: ");
//       pluginSDK.log.info(data);
//       data = JSON.parse(data);
//       return data;
//     } else {
//       pluginSDK.log.error("get user config failure, errorCode: ");
//       pluginSDK.log.error(errorCode);
//       return false;
//     }
//   });
// }

function userHasKey(config) {
  let currentUserConfig = config;
  pluginSDK.log.info("current user config: ");
  pluginSDK.log.info(currentUserConfig.tilmor_api_key);
  pluginSDK.log.info("current user config shown");
  if (
    typeof currentUserConfig.tilmor_api_key === "undefined" ||
    currentUserConfig.tilmor_api_key === null ||
    currentUserConfig.tilmor_api_key === "" ||
    (typeof currentUserConfig === "object" && Object.keys(currentUserConfig).length === 0)
  ) {
    return false;
  } else {
    return true;
  }
}

async function getUserConfig() {
  return new Promise((resolve, reject) => {
    pluginSDK.userConfig.getUserConfig(({ errorCode, data }) => {
      if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
        pluginSDK.log.info("get user config success new");
        pluginSDK.log.info("data: ");
        pluginSDK.log.info(data);
        try {
          data = JSON.parse(data);
          pluginSDK.log.info("data was parsed successfully");
        } catch (e) {
          pluginSDK.log.error("Failed to parse user config data, defaulting to empty object.");
          data = {};
        }
        resolve(data);
      } else {
        pluginSDK.log.error("get user config failure, errorCode: ");
        pluginSDK.log.error(errorCode);
        pluginSDK.log.error("Failed to parse user config data, defaulting to empty object.");
        data = {};
        resolve(data);
      }
    });
  });
}
