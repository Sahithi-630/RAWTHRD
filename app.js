/* ==========================================================================
   RAWTHRD - Interactive Brand Experience (WhatsApp Ordering & Sliders)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    // Change this to your client's actual WhatsApp Business number (include country code, e.g. "919999999999")
    const WHATSAPP_NUMBER = "916301884617"; 

    // --- PRODUCT DATA DB (With all 5 images for each product) ---
    const PRODUCTS_DATA = {
        1: {
            name: "Onyx Raw Shirt",
            category: "embroidery-gold",
            material: "80% Slub Cotton, 20% Flax Linen",
            fit: "Slim Premium Fit",
            description: "Built for presence and weight. The Onyx Raw Shirt utilizes a premium slub cotton blend, providing a rich, textured hand feel that stays structured yet breathable. Featuring the signature RAWTHRD gold panther head embroidery on the left chest. This is our foundation piece, built with absolute intention.",
            images: [
                "assets/shirt-front-nowlive.jpg",
                "assets/shirt-collar-detail.jpg",
                "assets/shirt-back-neon.jpg",
                "assets/promo-banner.jpg",
                "assets/embroidery-closeup.png"
            ]
        },
        2: {
            name: "Alabaster Raw Shirt",
            category: "embroidery-gold",
            material: "60% Organic Flax Linen, 40% Cotton",
            fit: "Relaxed Everyday Edge",
            description: "Engineered specifically for warm climates and movement. The Alabaster Raw is woven from a premium lightweight linen-cotton blend that showcases an elegant cross-hatch slub texture. Styled with our signature metallic gold embroidery for an everyday contrast edge.",
            images: [
                "assets/white-shirt-front.jpg",
                "assets/white-shirt-back.jpg",
                "assets/white-shirt-sleeve.jpg",
                "assets/white-shirt-chest.jpg",
                "assets/white-promo-banner.jpg"
            ]
        },
        3: {
            name: "Natural Ginkgo Shirt",
            category: "all-over",
            material: "100% Slub Canvas Cotton",
            fit: "Structured Boxy Fit",
            description: "A signature statement of art and fabric. Crafted from raw cream canvas slub cotton, this drop is embroidered with intricate off-black Ginkgo leaf and branch motifs cascading down the collar, yoke, sleeves, and back. Made for those who build their own identity from the details up.",
            images: [
                "assets/cream-shirt-front.jpg",
                "assets/cream-shirt-back.jpg",
                "assets/cream-shirt-chest-hand.jpg",
                "assets/cream-shirt-front-detail.jpg",
                "assets/cream-promo-banner.jpg"
            ]
        }
    };

    // --- SCROLL ACTION HEADER TRANSITION ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('dark-nav');
            } else {
                header.classList.remove('dark-nav');
            }
        });
    }

    // --- PRODUCT CARD CAROUSELS INITIALIZATION ---
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const slider = card.querySelector('.card-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        const prevBtn = card.querySelector('.prev-arrow');
        const nextBtn = card.querySelector('.next-arrow');
        let currentIdx = 0;

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
            slider.setAttribute('data-current-slide', index);
        }

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening modal
            currentIdx = (currentIdx - 1 + slides.length) % slides.length;
            showSlide(currentIdx);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening modal
            currentIdx = (currentIdx + 1) % slides.length;
            showSlide(currentIdx);
        });

        // Size selector clicks inside card
        const sizeButtons = card.querySelectorAll('.size-btn');
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                sizeButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Clicking the media container (outside arrows/buttons) opens details modal
        const mediaContainer = card.querySelector('.product-media-container');
        if (mediaContainer) {
            mediaContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('slider-arrow') || 
                    e.target.classList.contains('size-btn') || 
                    e.target.classList.contains('quick-add-btn')) {
                    return;
                }
                const productId = card.getAttribute('data-id');
                openProductModal(productId);
            });
        }
    });

    // --- FILTER PRODUCTS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        card.style.opacity = 0;
                        setTimeout(() => {
                            card.style.opacity = 1;
                            card.style.transition = 'opacity 0.6s ease';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- WHATSAPP ORDERING REDIRECT TRIGGER ---
    function sendWhatsAppOrder(productName, selectedSize, relativeImgPath) {
        const imageAbsoluteUrl = window.location.origin + "/" + relativeImgPath;
        const messageText = `Hello RAWTHRD! I would like to request an order for the following item:

• Product: ${productName}
• Size: ${selectedSize}
• Reference Image: ${imageAbsoluteUrl}

Please let me know the availability and how to proceed. Thank you!`;

        const encodedMessage = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Card Add Click Handler (Quick order request)
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const id = card.getAttribute('data-id');
            const product = PRODUCTS_DATA[id];
            const selectedSizeBtn = card.querySelector('.size-btn.selected');

            if (!selectedSizeBtn) {
                alert("Please select a size first before requesting an order.");
                const sizeSelector = card.querySelector('.quick-size-selector');
                if (sizeSelector) {
                    sizeSelector.style.border = '1px solid #C5A880';
                    sizeSelector.style.padding = '4px';
                    setTimeout(() => {
                        sizeSelector.style.border = 'none';
                        sizeSelector.style.padding = '0px';
                    }, 1000);
                }
                return;
            }

            const size = selectedSizeBtn.textContent;
            sendWhatsAppOrder(product.name, size, product.images[0]);
        });
    });


    // --- PRODUCT DETAIL MODAL ---
    const modalOverlay = document.getElementById('details-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalSpecMaterial = document.getElementById('modal-spec-material');
    const modalSpecFit = document.getElementById('modal-spec-fit');
    const modalSizeBtns = document.querySelectorAll('.modal-size-btn');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    
    // Modal Carousel Elements
    const modalSliderContainer = document.getElementById('modal-slider-container');
    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');
    
    let currentModalProductId = null;
    let modalSlides = [];
    let currentModalSlideIdx = 0;

    function openProductModal(id) {
        const product = PRODUCTS_DATA[id];
        if (!product) return;

        currentModalProductId = id;
        modalTitle.textContent = product.name;
        modalDesc.textContent = product.description;
        modalSpecMaterial.textContent = product.material;
        modalSpecFit.textContent = product.fit;

        // Reset sizes in modal
        modalSizeBtns.forEach(btn => btn.classList.remove('selected'));

        // Generate Modal Slider Content
        modalSliderContainer.innerHTML = "";
        product.images.forEach((imgSrc, idx) => {
            const slideImg = document.createElement('img');
            slideImg.src = imgSrc;
            slideImg.classList.add('slide');
            if (idx === 0) slideImg.classList.add('active');
            slideImg.alt = `${product.name} View ${idx + 1}`;
            slideImg.loading = "lazy";
            modalSliderContainer.appendChild(slideImg);
        });
        
        modalSlides = modalSliderContainer.querySelectorAll('.slide');
        currentModalSlideIdx = 0;

        // Show navigation arrows in modal
        modalPrevBtn.style.display = 'flex';
        modalNextBtn.style.display = 'flex';

        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    }

    function showModalSlide(index) {
        if (modalSlides.length === 0) return;
        modalSlides.forEach(s => s.classList.remove('active'));
        modalSlides[index].classList.add('active');
    }

    if (modalPrevBtn) {
        modalPrevBtn.addEventListener('click', () => {
            if (modalSlides.length === 0) return;
            currentModalSlideIdx = (currentModalSlideIdx - 1 + modalSlides.length) % modalSlides.length;
            showModalSlide(currentModalSlideIdx);
        });
    }

    if (modalNextBtn) {
        modalNextBtn.addEventListener('click', () => {
            if (modalSlides.length === 0) return;
            currentModalSlideIdx = (currentModalSlideIdx + 1) % modalSlides.length;
            showModalSlide(currentModalSlideIdx);
        });
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        currentModalProductId = null;
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    modalSizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalSizeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
            if (!currentModalProductId) return;

            const selectedSizeBtn = document.querySelector('.modal-size-btn.selected');
            if (!selectedSizeBtn) {
                alert("Please select a size first.");
                return;
            }

            const size = selectedSizeBtn.textContent;
            const product = PRODUCTS_DATA[currentModalProductId];
            sendWhatsAppOrder(product.name, size, product.images[0]);
            closeModal();
        });
    }



    // --- GENERAL LOOKBOOK GALLERY DETAIL ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-img-src');
            const title = item.getAttribute('data-title');
            const detailText = item.getAttribute('data-detail');

            modalTitle.textContent = title;
            modalDesc.textContent = detailText;
            
            // Render single image for lookbook detail
            modalSliderContainer.innerHTML = "";
            const slideImg = document.createElement('img');
            slideImg.src = imgSrc;
            slideImg.classList.add('slide', 'active');
            slideImg.alt = title;
            modalSliderContainer.appendChild(slideImg);
            
            modalSlides = [];

            // Hide arrows for lookbook images
            modalPrevBtn.style.display = 'none';
            modalNextBtn.style.display = 'none';

            modalSpecMaterial.parentElement.style.display = 'none'; 
            modalSpecFit.parentElement.style.display = 'none';

            modalAddToCartBtn.style.display = 'none';
            const sizeWrap = document.querySelector('.modal-info-pane .quick-size-selector');
            if (sizeWrap) sizeWrap.style.display = 'none';

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modalSpecMaterial.parentElement.style.display = 'flex';
            modalSpecFit.parentElement.style.display = 'flex';
            modalAddToCartBtn.style.display = 'block';
            const sizeWrap = document.querySelector('.modal-info-pane .quick-size-selector');
            if (sizeWrap) sizeWrap.style.display = 'flex';
        });
    }

});
