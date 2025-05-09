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
pluginSDK.eventEmitter.on(pluginEvent.onInitPluginWindow, function ({ userConfig, pluginPath }) {
  pluginSDK.log.info("onInitPluginWindowOk is good");
  pluginSDK.log.info("testing logging");
  pluginSDK.setDefaultWindow({
    width: 600,
    height: 400,
    center: true,
    show: false,
  });
  // let body = '<div style="margin-bottom: 12px; color:white;">Plugin has been initialized and updated</div>';
  // pluginSDK.displayNotification({ notificationBody: body });
  //     body = '<div style="margin-bottom: 12px; color:white;">Testing another notification</div>';
  //     pluginSDK.displayNotification({ notificationBody: body });
});
pluginSDK.eventEmitter.on(pluginEvent.onAnswerCall, function ({ callNum, callType }) {
  // if (callNum == 1013)
  // {
  //   callNum = 3306000516;
  // }
  axios
    .get("https://localhost/api/users/get-by-phone/" + callNum)
    .then((response) => {
      let responseData = response.data;
      // pluginSDK.log.info("responseData new:");
      // pluginSDK.log.info(responseData.data.id);
      // pluginSDK.log.info("firstName:");
      // pluginSDK.log.info(responseData.data.firstName);
      // pluginSDK.setDefaultWindow({
      //   width: 900,
      //   height: 600,
      //   center: true,
      //   show: true,
      // });
      window.open("https://www.tilmor.com/en-us/admin/settings/person/" + responseData.data.id);
      //document.location.href = "https://www.tilmor.com/en-us/admin/settings/person/"+responseData.data.id;
      //pluginSDK.log.info(responseData.firstName);
    })
    .catch((error) => {
      let callBody =
        "<div style='margin-bottom: 12px;'><div style='color:white'>The number " +
        callNum +
        " is not associated with a tilmor customer.</div><button class='btn btn-success' type='button' onclick='window.open(\"https://www.tilmor.com/en-us/admin/settings/crm/new-lead?redir=account.dashboard.customers\")'>Create Customer</button></div>";
      pluginSDK.displayNotification({ notificationBody: callBody });
      pluginSDK.log.error("errorResponseData:");
      pluginSDK.log.error(error);
    });

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
