# GrandStream Wave Plugin Template with Bootstrap 5

This project is a basic Webpack application that uses HTML, JavaScript and Bootstrap 5 to create a working GrandStream Wave plugin. It already has the wave-add-in-kit v1.0.4 as well as registering the plugin default window and sets the URL interceptor for use with the dynamic routing mechanism that loads HTML and corresponding JavaScript for different pages.

Folder Structure

```
WavePlugin
 ┣ commands
 ┃ ┗ createPage.js
 ┣ src
 ┃ ┣ html
 ┃ ┃ ┣ pages
 ┃ ┃ ┃ ┣ about.html
 ┃ ┃ ┃ ┣ contact.html
 ┃ ┃ ┃ ┗ home.html
 ┃ ┃ ┗ index.html
 ┃ ┣ img
 ┃ ┃ ┗ logo.png
 ┃ ┣ js
 ┃ ┃ ┣ pages
 ┃ ┃ ┃ ┣ about.js
 ┃ ┃ ┃ ┣ contact.js
 ┃ ┃ ┃ ┣ home.js
 ┃ ┃ ┃ ┗ index.js
 ┃ ┃ ┣ master.js
 ┃ ┃ ┣ router.js
 ┃ ┃ ┗ wave-add-in-kit.js
 ┃ ┣ scss
 ┃ ┃ ┗ styles.scss
 ┃ ┗ manifest.json
 ┣ .gitignore
 ┣ package-lock.json
 ┣ package.json
 ┣ README.md
 ┗ webpack.config.js 
```

## Getting Started

### Prerequisites
Node.js (>=14.x)\
npm (>=6.x)


### Installation

Clone the repository to a directory of your choosing and open a terminal in this directory.

Install the dependencies:

    npm install

### Development

To start the development server, run:

    npm start

This will start the development server at http://localhost:8080

### Building

To build the project for production, run:

    npm run build

This will create a dist folder with the compiled assets.

## Project Details

### Routing

The application uses a simple hash-based routing mechanism:

The router.js file dynamically loads HTML content and corresponding JavaScript files based on the URL hash.

*Please note that at this time, URL paramters are not supported*

Each page has a corresponding HTML file in src/html/pages and a JavaScript file in src/js/pages. It's best to use the new-page command to generate new pages. As this will also register the new page in the router by updating the pages index.js file.

Any links to other pages should use the hash-based routing mechanism. For example, if you have a link to the about page, you can use the following:

```html
    <a href="#/about">About</a>
```

#### Creating a New Page

To create a new page, run:

```
    npm run new-page -- <page-name>
```

This will generate a new HTML file in src/html/pages and a new JavaScript file in src/js/pages with the given `page-name`.

`page-name` will also be the URL hash to use for this page.

**DO NOT REMOVE OR RENAME THE `src/html/pages/home.html`, `src/js/pages/home.js` OR `src/js/pages/index.js` FILES!** These are the default pages that are loaded when the plugin starts.

### Adding functionality to your plugin

#### Global functions

To add functions that need to be available on a global context instead of just a single page, create a new Javascript file in src/js and import it in src/js/master.js, or just add to the master.js, your choice.

The `pluginSDK` from the GrandStream wave add in kit is available globally by default.

#### Page specific functions

To add functions that only need to be available on a specific page, you can update the pages Javascript file in src/js/pages. For example, the home.js file in src/js/pages contains the functions that are available on the home page.

**Example home.js**

```javascript
    export function init() {
        console.log('Home page script loaded');

        // Your home page specific JavaScript here
        try {
            pluginSDK.log.log('Home page script loaded');
        } catch (error) {

        }
    }
```

#### Updating the template

The template is built from the `index.html` file in src/html. You can update the template to your liking. You'll also see the `<div id="content"></div>` element in the template. This is where the router will inject the HTML content for each page, so this must remain.

Refer to the Bootstrap documentation for styling, etc. [https://getbootstrap.com/docs/5.3/getting-started/introduction/](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

**Do not add script tags for the JavaScript files in src/js/pages. These are dynamically loaded and bundled at build time.**

**Or the following files:**

- events.js
- master.js
- router.js
- wave-add-in-kit.js

**_I'll also say it again:_**

**DO NOT REMOVE OR RENAME THE `src/html/pages/home.html`, `src/js/pages/home.js` OR `src/js/pages/index.js` FILES!** These are the default pages that are loaded when the plugin starts.

#### Adding images

Place all your images in the `img` folder. At build time this folder is copied to the dist folder.

## Registering PluginSDK events from the wave-add-in-kit

Events should be registered in the master.js file in src/js. This is so they are bound on plugin startup.

Please refer to the wave-add-in-kit documentation for more information on each event type. [https://doc.grandstream.dev/WAVE/EN/#api-Api%20Reference-Event](https://doc.grandstream.dev/WAVE/EN/#api-Api%20Reference-Event)

From my own experience registering events with the GrandStream wave add in kit is a bit of a pain, as the documentation is out of date. Using the `pluginSDK.eventEmitter.on` function to register events, we use a string as the first argument instead of an emum.

And just to make things even more of a pain the documentation refers to events by the plugin enum name, which doesn't work. So for convenience I've created a file in src/js/events.js that contains the enum names as constants.

**Example usage**

```javascript
    // Registration event
    pluginSDK.eventEmitter.on(event.onAnswerCall, ({ userConfig, pluginPath }) => {
        pluginSDK.log.log('onAnswerCall');
        pluginSDK.log.log('callNum: ', callNum);
        pluginSDK.log.log('callType: ', callType);
    })

    // Remove binding
    pluginSDK.eventEmitter.off(event.onAnswerCall);
```

**Available events from the pluginSDK**

- onRecvIncomingCall
- onAnswerCall
- onHangupCall
- onRejectCall
- onCallCanceled
- onInitCall
- onInitPluginWindow
- onInitPluginInfo


## Building your plugin

### Update your manifest

Your plugins manifest.json file is in the route of the src folder. Please update the fields as you wish or add what you need.

Refer to the pluginSDK documentation for more information on the manifest. [https://doc.grandstream.dev/WAVE/EN/#api-Development%20Guidelines-Configure%20Add-in](https://doc.grandstream.dev/WAVE/EN/#api-Development%20Guidelines-Configure%20Add-in)

### Build time!

From the command window run `npm run build`. This will create a dist folder with the compiled assets.

Your dist folder should now look like this:

```
dist
 ┣ html
 ┃ ┣ about.html
 ┃ ┣ contact.html
 ┃ ┗ home.html
 ┣ img
 ┃ ┗ logo.png
 ┣ js
 ┃ ┣ master.js
 ┃ ┣ pages.js
 ┃ ┣ pluginSDK.js
 ┃ ┗ router.js
 ┣ index.html
 ┗ manifest.json
 ```

On Windows, create a folder with your plugin name as the name in `%APPDATA%\Wave\extensions` and place the contents of the dist folder in it.

Close Wave and open it again. You should now see your plugin listed in applications.

Click on it to open the default window. If it's populated with the default template, then you're good to go.

### Testing your plugin

Make sure you are entering useful information about events or happenings for you plugin into the log. [https://doc.grandstream.dev/WAVE/EN/#api-Api%20Reference-Log](https://doc.grandstream.dev/WAVE/EN/#api-Api%20Reference-Log)

The GrandStream wave log can be found here `%APPDATA%\Wave\logs\main.log`.

### MAC users

For MAC, please refer to the GrandStream documentation for more information on how to build and test your plugin. [https://doc.grandstream.dev/WAVE/EN/#api-Development%20Guidelines-Test](https://doc.grandstream.dev/WAVE/EN/#api-Development%20Guidelines-Test)

