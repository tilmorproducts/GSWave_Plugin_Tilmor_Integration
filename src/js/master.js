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
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Import PluginSDK event constants
import { pluginEvent } from './events'

/**
     * Monitor events:
     * Window initialization is complete.
     * Callback function parameters:
     * userConfig User parameters
     * pluginPath Add-in installation path
     * https://doc.grandstream.dev/WAVE/EN/#api-Development%20Guidelines-The%20First%20Add-in
     *
     */
pluginSDK.eventEmitter.on('onInitPluginWindowOk', function ({ userConfig, pluginPath }) {
    pluginSDK.log.log('onInitPluginWindowOk', userConfig, pluginPath);

    /**
     * Set the initial window parameters
     * @param data {
     * width:'Width (int)',
     * height:'Height (int)',
     * winX:'Window offset from the left side of the screen (mandatory if Y is used)(int)',
     * winY:'Window offset from the top of the screen (mandatory if X is used)(int)',
     * center:'Center? True/False (mutually exclusive with X,Y)',
     * show:'Display? True/False'}
     */
    pluginSDK.setDefaultWindow({
        width: 1100,
        height: 600,
        center: true,
        show: false,
    })
});

