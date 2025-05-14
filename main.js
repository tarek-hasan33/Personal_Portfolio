document.addEventListener("DOMContentLoaded", function () {
  // Typed.js initialization
  new Typed(".typed-text", {
    strings: ["it's <span class='intro-name'>tarek</span> here..."],
    typeSpeed: 60,
    showCursor: false,
    contentType: "html",
  });

  // Handle each tab container individually
  const tabContainers = document.querySelectorAll(".tabs-container");

  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll(".tab-button");
    const panels = container.querySelectorAll(".tab-panel");
    const indicator = container.querySelector(".tab-indicator");

    let activeIndex = 0;

    function activateTab(index, applyFocus = true) {
      panels.forEach(panel => panel.classList.remove("active"));
      if (panels[index]) panels[index].classList.add("active");

      buttons.forEach((btn, i) => {
        btn.classList.remove("focused", "active");
        if (i === index) {
          btn.classList.add("active");
          if (applyFocus) {
            btn.classList.add("focused");
          }
        }
      });

      const button = buttons[index];
      if (indicator && button) {
        indicator.style.top = `${button.offsetTop}px`;
        indicator.style.height = `${button.offsetHeight}px`;
      }

      activeIndex = index;
    }

    buttons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        activateTab(index, true);

        // Ripple effect
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

    // Click outside removes only focus (not active)
    document.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("focused"));
    });

    // Initial state
    activateTab(0, false);
  });
});
