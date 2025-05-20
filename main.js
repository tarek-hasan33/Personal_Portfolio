document.addEventListener("DOMContentLoaded", function () {
  // Typed.js
  new Typed(".typed-text", {
    strings: [" <span class='intro-name'>tarek</span> here."],
    typeSpeed: 60,
    showCursor: false,
    contentType: "html",
  });

  // === Fade-in on scroll (staggered one-by-one) ===
  const fadeSections = document.querySelectorAll(".fade-in-section");
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("active");
        }, i * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeSections.forEach((section) => {
    section.classList.remove("active");
    observer.observe(section);
  });

  // === Tabbed content ===
  const tabContainers = document.querySelectorAll(".tabs-container");
  tabContainers.forEach(container => {
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
          }, 400);
        }
      });

      buttons.forEach((btn, i) => {
        btn.classList.remove("focused", "active");
        if (i === index) {
          btn.classList.add("active");
          if (applyFocus) btn.classList.add("focused");
        }
      });

      if (indicator) {
        const button = buttons[index];
        if (button) {
          indicator.style.top = `${button.offsetTop}px`;
          indicator.style.height = `${button.offsetHeight}px`;
        }
      }

      const tabContent = container.querySelector('.tab-content');
      const activePanel = container.querySelector('.tab-panel.active');
      if (tabContent && activePanel) {
        tabContent.style.height = (activePanel.offsetHeight + 5) + 'px';
      }

      activeIndex = index;
    }

    buttons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        activateTab(index, true);

        const ripple = document.createElement("span");
        ripple.classList.add("ripple");

        const rect = button.getBoundingClientRect();
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
        ripple.style.left = `${e.clientX - rect.left - rect.width / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - rect.height / 2}px`;

        button.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
      });
    });

    document.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("focused"));
    });

    activateTab(0, false);
  });

  // === Orbit icon positioning ===
  function positionOrbitIcons(rotatorSelector) {
    const rotator = document.querySelector(rotatorSelector);
    if (!rotator) return;

    const icons = rotator.querySelectorAll('.orbit-icon');
    const count = icons.length;
    const radius = rotator.offsetWidth / 2;

    icons.forEach((icon, index) => {
      const angle = (index / count) * 2 * Math.PI;
      const x = radius + radius * Math.cos(angle);
      const y = radius + radius * Math.sin(angle);
      icon.style.left = `${x}px`;
      icon.style.top = `${y}px`;

      // Wrap image in a container to counter rotate it
      const img = icon.querySelector('img');
      if (img) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('icon-inner');
        wrapper.appendChild(img.cloneNode(true));
        img.remove();
        icon.appendChild(wrapper);
      }
    });
  }

  // Position icons for both inner and outer orbits
  positionOrbitIcons('.outer-rotator');
  positionOrbitIcons('.inner-rotator');

  // Optional: re-position on resize for responsiveness
  window.addEventListener('resize', () => {
    positionOrbitIcons('.outer-rotator');
    positionOrbitIcons('.inner-rotator');
  });
});
