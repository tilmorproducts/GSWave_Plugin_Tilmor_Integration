/*!
 * Project: WavePlugin
 * Author: Jonathan Hayman
 * Company: Anglia Computer Solutions Business Ltd
 * Description: Router module for navigating between pages in the WavePlugin project.
 * Created on: 28-06-2024
 * Last Updated: 28-06-2024
 * Version: 1.0.0
 * 
 * License: MIT
 * 
 * Additional Notes:
 * - This module handles dynamic page loading based on URL hash changes.
 * 
 * Example Usage:
 * - This file is automatically bundled and included in the project via Webpack.
 */
import pages from './pages/index.js';

async function loadPage(page) {
    try {
        const response = await fetch(`html/${page}.html`);
        if (!response.ok) {
            throw new Error('Page not found');
        }
        const html = await response.text();
        document.getElementById('content').innerHTML = html;

        // Dynamically load the corresponding JavaScript module and initialize
        const pageModule = pages[page];
        if (pageModule && typeof pageModule.init === 'function') {
            pageModule.init();
        }
    } catch (error) {
        console.log(error);
        document.getElementById('content').innerHTML = '<h1>404 Not Found</h1>';
    }
}

async function updateActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');

    const hash = window.location.hash || '#/home';

    // Loop through each nav link
    navLinks.forEach(link => {
        // Remove 'active' class from all links
        link.classList.remove('active');

        // Add 'active' class to the link whose href matches the hash
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });
}

function loadContent() {
    const hash = window.location.hash || '#/home';
    const page = hash.slice(2); // Remove the #/ part
    loadPage(page);
    updateActiveLink();
}

loadContent();
window.addEventListener('hashchange', loadContent);

// Define your routes dynamically based on pages
const routes = Object.keys(pages).map(page => ({
    path: `/${page}`,
    redirect: `#/${page}`
}));

// Function to set up the URL interceptor
function setupURLInterceptor() {
    routes.forEach(route => {
        const data = {
            interceptField: window.location.origin + route.path,
            hash: route.redirect,
            search: null,
            origin: null,
        };
        pluginSDK.setPluginURLInterceptor(data);
    });
};

// Call the setup function
setupURLInterceptor();