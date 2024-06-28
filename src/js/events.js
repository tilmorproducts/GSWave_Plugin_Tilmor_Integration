/*!
 * File: events.js
 * Description: PluginSDK event enums as constants for imports into master.js for event binding.
 * Author: Jonathan Hayman
 * Company: Anglia Computer Solutions Business Ltd
 * Created on: 28-06-2024
 * Last Updated: 28-06-2024
 * Version: 1.0.0
 * 
 * License: MIT
 * 
 * Additional Notes:
 * - This file exports event enums as constants for use in master.js for event binding.
 * 
 */

// PluginSDK event enums as constants
export const pluginEvent = {
    onRecvIncomingCall: "onRecvP2PIncomingCall",
    onAnswerCall: "onAnswerP2PCall", 
    onHangupCall: "onHangupP2PCall",
    onRejectCall: "onRejectP2PCall",
    onCallCanceled: "onP2PCallCanceled", 
    onInitCall: "onInitP2PCall",
    onInitPluginWindow: 'onInitPluginWindowOk', 
    onInitPluginInfo: 'onInitPluginInfoOk'
};