document.addEventListener("DOMContentLoaded", function () {
  new Typed(".typed-text", {
    strings: ["it's <span class='intro-name'>tarek</span> here..."],
    typeSpeed: 60,
    showCursor: false,
    contentType: "html",
  });

  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");
  const indicator = document.querySelector(".tab-indicator");

  let activeIndex = 0;

  function activateTab(index, applyFocus = true) {
    panels.forEach(panel => panel.classList.remove("active"));
    panels[index].classList.add("active");

    buttons.forEach((btn, i) => {
      btn.classList.remove("focused");
      if (i === index) {
        btn.classList.add("active");
        if (applyFocus) {
          btn.classList.add("focused");
        }
      } else {
        btn.classList.remove("active");
      }
    });

    const button = buttons[index];
    indicator.style.top = `${button.offsetTop}px`;
    indicator.style.height = `${button.offsetHeight}px`;

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

  // Click outside: remove "focused" class but keep "active"
  document.addEventListener("click", () => {
  buttons.forEach(btn => btn.classList.remove("focused"));
});

  // Initial state: active tab, but not focused (no color)
  activateTab(0, false);
});
