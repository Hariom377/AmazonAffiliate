// Function to update common meta tags (title, description, OG tags)
function updateMetaTags(title, description, imageUrl, url) {
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.property = 'og:title';
        document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.property = 'og:description';
        document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.property = 'og:image';
        document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', imageUrl);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.property = 'og:url';
        document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', url);
}


// Schema Markup for Product
function generateProductSchema(product) {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images.map(img => `https://yourdomain.com/assets/images/products/${img}`), // Replace yourdomain.com
        "description": product.description,
        "sku": product.id,
        "mpn": product.id, // Using ID as a placeholder for MPN if not available
        "brand": {
            "@type": "Brand",
            "name": product.brand || "Generic Brand" // Add brand to product.json
        },
        "offers": {
            "@type": "Offer",
            "url": product.amazonUrl,
            "priceCurrency": product.currency || "USD", // Add currency to product.json
            "price": product.price.replace(/[^0-9.]/g, ''), // Clean price string
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock" // Assume in stock, or add to product.json
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviewCount || "50" // Add reviewCount to product.json
        }
    };
    addSchemaToHead(schema, 'product-schema');
}

// Schema Markup for FAQ
function generateFAQSchema(faqs) {
    if (!faqs || faqs.length === 0) return;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
    addSchemaToHead(faqSchema, 'faq-schema');
}

// Helper function to add schema to head, preventing duplicates
function addSchemaToHead(schema, id) {
    let script = document.getElementById(id);
    if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
}

// Lazy Loading Functionality (for images with loading="lazy")
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        let lazyLoadObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    // If you used data-src for initial empty image and src for placeholder
                    // lazyImage.src = lazyImage.dataset.src || lazyImage.src; 
                    // For simply using loading="lazy", the browser handles it.
                    // This function ensures the loading attribute is properly recognized.
                    // No need to change src if already set, just ensure it's there.
                    lazyImage.removeAttribute('loading'); // Browser will load it now
                    lazyLoadObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyLoadObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            // If you used data-src, uncomment this:
            // img.src = img.dataset.src || img.src;
            img.removeAttribute('loading');
        });
    }
}
