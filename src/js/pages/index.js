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
    console.log('onInitPluginWindowOk', userConfig, pluginPath);

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
        width: 482,
        height: 586,
        center: true,
        show: false,
    })
})