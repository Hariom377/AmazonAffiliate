// assets/js/seo-optimizer.js

function generateProductSchema(product) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map(img => `https://yourdomain.com/assets/images/products/${img}`),
    "description": product.description,
    "sku": product.id, // Or a more specific SKU if available
    "mpn": product.id, // Manufacturer Part Number, use ID if no specific MPN
    "brand": {
      "@type": "Brand",
      "name": "Generic Brand" // Replace with actual brand or dynamically fetch
    },
    "offers": {
      "@type": "Offer",
      "url": product.amazonUrl,
      "priceCurrency": "USD", // Or dynamically set
      "price": product.price.replace('$', ''),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock" // Or dynamically set
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": "100" // Placeholder, needs actual reviews if available
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

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

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
}


// Function to update meta tags dynamically (for example, on product pages)
function updateMetaTags(title, description, imageUrl, url) {
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', imageUrl);
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
}

// Function to handle lazy loading (add 'lazy' class to images)
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        let lazyLoadObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src || lazyImage.src; // Assuming data-src for original
                    lazyImage.removeAttribute('loading');
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
            img.src = img.dataset.src || img.src;
            img.removeAttribute('loading');
        });
    }
}

// Call lazy loading setup when main.js loads product content
// document.addEventListener('DOMContentLoaded', setupLazyLoading);
// Or call it after product content is rendered
