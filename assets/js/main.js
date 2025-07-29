// Global variables to hold loaded data
let siteConfig = {};
let productsData = [];
let blogPostsData = [];

// Main data loading function
async function loadData() {
    try {
        const [configResponse, productsResponse, blogResponse] = await Promise.all([
            fetch('/config/site-config.json'),
            fetch('/config/products.json'),
            fetch('/config/blog.json')
        ]);

        siteConfig = await configResponse.json();
        productsData = (await productsResponse.json()).products;
        blogPostsData = (await blogResponse.json()).posts;

        // Apply global site configuration (title, analytics etc.)
        applySiteConfig();

        // Determine which page rendering function to call
        if (document.body.id === 'homepage') {
            renderHomePage();
        } else if (document.body.id === 'product-page') {
            renderProductPage();
        } else if (document.body.id === 'blog-archive-page') {
            renderBlogArchivePage();
        } else if (document.body.id === 'blog-post-page') {
            await renderBlogPostPage(); // Await because it fetches another HTML file
        }
        // For static pages like about, contact, privacy, the footer is handled directly in their HTML script tags
        
    } catch (error) {
        console.error("Error loading site data:", error);
        // Display a user-friendly message or fallback content
        document.querySelectorAll('.loading-message').forEach(el => {
            el.textContent = "Failed to load content. Please try again later.";
        });
    }
}

// Function to apply global site configuration settings
function applySiteConfig() {
    // Update main title if not specific page title set
    if (!document.title || document.title.includes("Your Site Name")) { // Avoid overwriting specific page titles
        document.title = siteConfig.siteTitle || "Default Site Title";
    }

    // Update main meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', siteConfig.siteDescription || "Default site description for SEO.");
    } else {
        const newMetaDesc = document.createElement('meta');
        newMetaDesc.name = 'description';
        newMetaDesc.content = siteConfig.siteDescription || "Default site description for SEO.";
        document.head.appendChild(newMetaDesc);
    }
    
    // Update Open Graph tags for social sharing if not page specific
    updateMetaTags(
        document.title, // Use current title
        document.querySelector('meta[name="description"]').getAttribute('content'), // Use current description
        siteConfig.ogImage || 'https://yourdomain.com/assets/images/og-image.jpg', // Default OG image
        window.location.href // Current URL
    );

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

// --- Common UI/UX Functions ---

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.getElementById('main-nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });

        // Close menu if a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// Initial data load when DOM is ready
document.addEventListener('DOMContentLoaded', loadData);
