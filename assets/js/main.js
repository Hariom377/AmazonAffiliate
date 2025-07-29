// assets/js/main.js
let siteConfig = {};
let productsData = [];

async function loadData() {
  try {
    const [configResponse, productsResponse] = await Promise.all([
      fetch('/config/site-config.json'),
      fetch('/config/products.json')
    ]);

    siteConfig = await configResponse.json();
    productsData = (await productsResponse.json()).products;

    // Call functions to render content after data is loaded
    if (document.body.id === 'homepage') {
      renderHomePage();
    } else if (document.body.id === 'product-page') {
      renderProductPage();
    }
    // ... other page-specific rendering functions
    applySiteConfig(); // Apply global settings like site title, analytics
  } catch (error) {
    console.error("Error loading configuration or product data:", error);
  }
}

function applySiteConfig() {
  document.title = siteConfig.siteTitle;
  // Set meta description for the homepage or general fallback
  if (document.querySelector('meta[name="description"]')) {
    document.querySelector('meta[name="description"]').setAttribute('content', siteConfig.siteDescription);
  } else {
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = siteConfig.siteDescription;
    document.head.appendChild(metaDesc);
  }

  // Set social media links in footer/header (if applicable)
  // Example: document.getElementById('facebook-link').href = siteConfig.socialMedia.facebook;

  // Integrate Google Analytics
  if (siteConfig.analytics) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics}`;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${siteConfig.analytics}');
    `;
    document.head.appendChild(script2);
  }
}

document.addEventListener('DOMContentLoaded', loadData);
