document.addEventListener("DOMContentLoaded", function () {
  //Intro Overlay with Hello Shuffle
  const greetings = [
    "Hello",
    "হ্যালো",
    "Hola",
    "Bonjour",
    "Ciao",
    "Hallo",
    "नमस्ते",
    "こんにちは",
    "안녕하세요",
    "你好",
    "سلام",
  ];
  const overlay = document.getElementById("intro-overlay");
  const helloShuffle = overlay.querySelector(".hello-shuffle");

  let greetIndex = 0;
  const shuffleInterval = setInterval(() => {
    helloShuffle.textContent = greetings[greetIndex];
    greetIndex = (greetIndex + 1) % greetings.length;
  }, 150);

  setTimeout(() => {
    clearInterval(shuffleInterval);
    overlay.classList.add("fade-out");

    setTimeout(() => {
      overlay.style.display = "none";
      initMainAnimations(); //main animation initiation
    }, 300);
  }, 1800);

  // MAIN ANIMATION
  function initMainAnimations() {
    //Typed.js
    new Typed(".typed-text", {
      strings: [" <span class='intro-name'>tarek</span> here."],
      typeSpeed: 60,
      showCursor: false,
      contentType: "html",
    });

    //Fade-in on scroll
    const fadeSections = document.querySelectorAll(".fade-in-section");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("active");
            }, i * 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeSections.forEach((section) => {
      section.classList.remove("active");
      observer.observe(section);
    });


    // openEmail function
    window.openEmail = function(email) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `mailto:${email}`;
      } else {
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
          "_blank"
        );
      }
    };

    //Tabbed content
    const tabContainers = document.querySelectorAll(".tabs-container");
    tabContainers.forEach((container) => {
      const buttons = container.querySelectorAll(".tab-button");
      const panels = container.querySelectorAll(".tab-panel");
      const indicator = container.querySelector(".tab-indicator");

      let activeIndex = 0;

      function activateTab(index, applyFocus = true) {
        panels.forEach((panel, i) => {
          panel.classList.remove("active", "fade-in");
          if (i === index) {
            panel.classList.add("active");
            setTimeout(() => {
              panel.classList.add("fade-in");

              const paragraphs = panel.querySelectorAll(
                ".content-description p"
              );
              paragraphs.forEach((p, i) => {
                p.classList.remove("visible");
                setTimeout(() => {
                  p.classList.add("visible");
                }, i * 300);
              });
            }, 400);
          }
        });

        // Buttons: update active and focused states
        buttons.forEach((btn, i) => {
          btn.classList.remove("active", "focused");
          if (i === index) {
            btn.classList.add("active");
            if (applyFocus) btn.classList.add("focused");
          }
        });

        if (indicator) {
          const button = buttons[index];
          if (button) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
              // Horizontal indicator below button
              const containerTabs = container.querySelector(".tab-buttons");
              const scrollLeft = containerTabs.scrollLeft || 0;
              const leftPos = button.offsetLeft - scrollLeft;

              indicator.style.left = `${leftPos}px`;
              indicator.style.width = `${button.offsetWidth}px`;
              indicator.style.bottom = "0";
              indicator.style.top = "auto";
              indicator.style.height = "2px";
              indicator.style.right = "auto";
            } else {
              // Vertical indicator on left (desktop)
              indicator.style.top = `${button.offsetTop}px`;
              indicator.style.height = `${button.offsetHeight}px`;
              indicator.style.left = "";
              indicator.style.width = "2px";
              indicator.style.bottom = "";
            }
          }
        }

        // Adjust tab content height to active panel height
        const tabContent = container.querySelector(".tab-content");
        const activePanel = container.querySelector(".tab-panel.active");
        if (tabContent && activePanel) {
          tabContent.style.height = activePanel.offsetHeight + 5 + "px";
        }

        // Save active index
        activeIndex = index;
      }

      buttons.forEach((button, index) => {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          activateTab(index, true);

          const ripple = document.createElement("span");
          ripple.classList.add("ripple");

          const rect = button.getBoundingClientRect();
          ripple.style.width = ripple.style.height = `${Math.max(
            rect.width,
            rect.height
          )}px`;
          ripple.style.left = `${e.clientX - rect.left - rect.width / 2}px`;
          ripple.style.top = `${e.clientY - rect.top - rect.height / 2}px`;

          button.appendChild(ripple);
          ripple.addEventListener("animationend", () => ripple.remove());
        });
      });

      document.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("focused"));
      });

      activateTab(0, false);
    });

    //Orbit icon positioning with smooth entry
    function positionOrbitIcons(rotatorSelector) {
      const rotator = document.querySelector(rotatorSelector);
      if (!rotator) return;

      const icons = rotator.querySelectorAll(".orbit-icon");
      const count = icons.length;
      const radius = rotator.offsetWidth / 2;

      icons.forEach((icon, index) => {
        const angle = (index / count) * 2 * Math.PI;
        const x = radius + radius * Math.cos(angle);
        const y = radius + radius * Math.sin(angle);

        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;

        // Only wrap if not already wrapped
        if (!icon.querySelector(".icon-inner")) {
          const img = icon.querySelector("img");
          if (img) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("icon-inner");
            wrapper.appendChild(img.cloneNode(true));
            img.remove();
            icon.appendChild(wrapper);
          }
        }

        // Smooth fade-in via class after positioning
        requestAnimationFrame(() => {
          icon.classList.add("visible");
        });
      });
    }

    positionOrbitIcons(".outer-rotator");
    positionOrbitIcons(".inner-rotator");

    window.addEventListener("resize", () => {
      positionOrbitIcons(".outer-rotator");
      positionOrbitIcons(".inner-rotator");
    });

    //Initialize auto slide on hover
    initAutoSlides();

    // POPUP IMAGE MODAL WITH NAVIGATION (for HTML-defined popup)
    const popup = document.getElementById("image-popup");
    const popupImg = popup.querySelector("img");
    const popupOverlay = popup.querySelector(".popup-overlay");
    const leftArrow = popup.querySelector(".left-arrow");
    const rightArrow = popup.querySelector(".right-arrow");

    let currentImages = [];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Handler to prevent touch scroll on mobile
    function preventTouchScroll(e) {
      e.preventDefault();
    }

    document.querySelectorAll(".fade-in-section.cards").forEach((card) => {
      const images = card.querySelectorAll(".project-images img");
      if (images.length === 0) return;

      images.forEach((img, index) => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
          currentImages = images;
          currentIndex = index;
          popupImg.src = currentImages[currentIndex].src;
          popup.classList.remove("hidden");
          document.body.style.overflow = "hidden";
          document.documentElement.style.overflow = "hidden";

          // Disable touch scroll on mobile
          document.addEventListener("touchmove", preventTouchScroll, {
            passive: false,
          });
        });
      });
    });

    popupImg.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    popupImg.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    });

    function showPopupImage(index) {
      currentIndex = (index + currentImages.length) % currentImages.length;
      popupImg.src = currentImages[currentIndex].src;
    }

    leftArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      showPopupImage(currentIndex - 1);
    });

    rightArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      showPopupImage(currentIndex + 1);
    });

    popupOverlay.addEventListener("click", () => {
      popup.classList.add("hidden");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      // Re-enable touch scroll on mobile
      document.removeEventListener("touchmove", preventTouchScroll);
    });

    // Keyboard navigation and Escape to close
    document.addEventListener("keydown", (e) => {
      if (popup.classList.contains("hidden")) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        leftArrow.click();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        rightArrow.click();
      } else if (e.key === "Escape") {
        popup.classList.add("hidden");
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.removeEventListener("touchmove", preventTouchScroll);
      }
    });

    function handleGesture() {
      const swipeThreshold = 50; // minimum px to consider it a swipe
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) {
          showPopupImage(currentIndex + 1); // swipe left
        } else {
          showPopupImage(currentIndex - 1); // swipe right
        }
      }
    }
  }

  //Auto slide function for project image sliders on hover
  function initAutoSlides() {
    const cards = document.querySelectorAll(".fade-in-section.cards");

    cards.forEach((card) => {
      const images = card.querySelectorAll(".project-images img");
      if (images.length === 0) return;

      const leftArrow = card.querySelector(".left-arrow");
      const rightArrow = card.querySelector(".right-arrow");

      let currentIndex = 0;
      let slideInterval;
      let userInteracted = false;

      function showImage(index) {
        images.forEach((img, i) => {
          img.style.display = i === index ? "block" : "none";
          img.style.opacity = i === index ? "1" : "0";
        });
        currentIndex = index;
      }

      function startSlide() {
        if (userInteracted) return;
        slideInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % images.length;
          showImage(currentIndex);
        }, 2500);
      }

      function stopSlide() {
        clearInterval(slideInterval);
      }

      card.addEventListener("mouseenter", () => {
        startSlide();
      });

      card.addEventListener("mouseleave", () => {
        stopSlide();
        currentIndex = 0;
        showImage(currentIndex);
        userInteracted = false;
      });

      if (leftArrow) {
        leftArrow.addEventListener("click", () => {
          stopSlide();
          userInteracted = true;
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          showImage(currentIndex);
        });
      }

      if (rightArrow) {
        rightArrow.addEventListener("click", () => {
          stopSlide();
          userInteracted = true;
          currentIndex = (currentIndex + 1 + images.length) % images.length;
          showImage(currentIndex);
        });
      }
      //Initial state: show first image
      showImage(currentIndex);
    });
  }
});
