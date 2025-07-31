waitForElementToBeInjected("settingsPageElement", async () => {
  await setInputValues();
});
// settings.js
//pluginSDK.log.info("testing logging on settings page");
//console.log([...document.all]);
// document.addEventListener("DOMContentLoaded", function () {
//     const settingsElement = document.getElementById("settingsTest");
//     if (settingsElement) {
//         console.log("testing getting settings element", settingsElement);
//     }
// });
// function waitForElement(id, callback) {
//     const element = document.getElementById(id);
//     if (element) {
//         callback(element);
//     } else {
//         setTimeout(() => waitForElement(id, callback), 100);
//     }
// }

// waitForElement("settingsTest", (settingsElement) => {
//     console.log("Element found after retrying:", settingsElement);
// });
//document.getElementById("settingsTest").innerHTML = "Settings page loaded!";
//document.getElementById("settingsTest").innerHTML = "Settings page loaded!";

async function submitName(nameSubmitted) {
  //document.getElementById("settingsTest").innerHTML = nameSubmitted;
  console.log(nameSubmitted);
  let userConfigData = await getUserConfigInSettings();
  if (userConfigData && typeof userConfigData.username === "undefined") {
    pluginSDK.log.info("Username is not set");
  } else {
    pluginSDK.log.info("Username is set to: ");
    pluginSDK.log.info(userConfigData.username);
  }
  pluginSDK.log.info("getting user config data in the settings js page:");
  pluginSDK.log.info(userConfigData.tilmor_api_key);
  await setUsername(userConfigData, nameSubmitted);
  userConfigData = await getUserConfigInSettings();
  pluginSDK.log.info("new config data in settings:");
  pluginSDK.log.info(userConfigData.username);

  //   pluginSDK.userConfig.getUserConfig(({ errorCode, data }) => {
  //     if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
  //       pluginSDK.log.info("get user config success new");
  //       pluginSDK.log.info("data: ");
  //       pluginSDK.log.info(data);
  //         data = JSON.parse(data);
  //         document.getElementById("settingsTest").innerHTML = data.tilmor_api_key;
  //       //return data;
  //     } else {
  //       pluginSDK.log.error("get user config failure, errorCode: ");
  //       pluginSDK.log.error(errorCode);
  //       return false;
  //     }
  //   });
  // pluginSDK.log.info("getting user config in settings js page:");
  // pluginSDK.log.info(userConfigData.tilmor_api_key);

  // document.getElementById("settingsTest").innerHTML = userConfigData.tilmor_api_key;
}
async function getUserConfigInSettings() {
  return new Promise((resolve, reject) => {
    pluginSDK.userConfig.getUserConfig(({ errorCode, data }) => {
      if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
        pluginSDK.log.info("get user config success new");
        pluginSDK.log.info("data: ");
        pluginSDK.log.info(data);
        data = JSON.parse(data);
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
async function submitApiKeyinSettings(key) {
  pluginSDK.log.info("submitting API key: ");
  let newUserConfig = await getUserConfigInSettings();
  pluginSDK.log.info("new user config: ");
  pluginSDK.log.info(JSON.stringify(newUserConfig));

  newUserConfig.tilmor_api_key = key;
  pluginSDK.userConfig.addUserConfig({ userConfig: JSON.stringify(newUserConfig) }, ({ errorCode }) => {
    if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
      pluginSDK.log.info("add user config success");
      return;
    }
    pluginSDK.log.info("add user config failure");
  });
  //   document.getElementById("apiKeyContainer").classList.toggle("hideApiInput");
  document.getElementById("apiSuccess").innerHTML = "API key successfully saved!";
}
async function setUsername(userConfigData, userName) {
  return new Promise((resolve, reject) => {
    userConfigData.username = userName;
    pluginSDK.userConfig.addUserConfig({ userConfig: JSON.stringify(userConfigData) }, ({ errorCode }) => {
      if (errorCode === pluginSDK.ErrorCode.SUCCESS) {
        pluginSDK.log.info("add user config success");
        document.getElementById("nameSuccess").innerHTML = "Name successfully saved!";
        resolve(true);
      } else {
        console.error("add user config failure, errorCode: ", errorCode);
        reject(errorCode); // Reject the Promise with the error
      }
    });
  });
}
async function setInputValues() {
  //pluginSDK.log.info("Setting input values");
  let userConfigData = await getUserConfigInSettings();
  // pluginSDK.log.info(userConfigData.username);
  if (userConfigData && userConfigData.username) {
    //pluginSDK.log.info(userConfigData.username);
    document.getElementById("nameInput").value = userConfigData.username;
  }
  if (userConfigData && userConfigData.tilmor_api_key) {
    // pluginSDK.log.info(userConfigData.tilmor_api_key);
    document.getElementById("apiInput").value = userConfigData.tilmor_api_key;
  }
  //pluginSDK.log.info("done setting input values");
}
function waitForElementToBeInjected(elementId, callback) {
  const observer = new MutationObserver((mutations, observer) => {
    const element = document.getElementById(elementId);
    if (element) {
      callback(element); // Run the callback when the element is found
      //observer.disconnect(); // Stop observing once the element is found
    }
  });

  // Start observing the document for changes
  observer.observe(document.body, { childList: true, subtree: true });
}
window.submitName = submitName;
window.submitApiKeyinSettings = submitApiKeyinSettings;
window.setInputValues = setInputValues;
