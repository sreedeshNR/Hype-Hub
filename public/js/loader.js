const Loader = {
  bar: null,

  init() {
    // Create loader element
    const loader = document.createElement("div");
    loader.id = "loader-bar";
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: #ff6b35;
      z-index: 99999;
      transition: width 0.3s ease;
      box-shadow: 0 0 8px #ff6b35;
    `;
    document.body.prepend(loader);
    this.bar = loader;
  },

  start() {
    if (!this.bar) this.init();
    this.bar.style.width = "0%";
    this.bar.style.opacity = "1";

    let width = 0;
    this.interval = setInterval(() => {
      if (width < 85) {
        width += Math.random() * 10;
        this.bar.style.width = width + "%";
      }
    }, 200);
  },

  finish() {
    clearInterval(this.interval);
    if (!this.bar) return;
    this.bar.style.width = "100%";
    setTimeout(() => {
      this.bar.style.opacity = "0";
      setTimeout(() => {
        this.bar.style.width = "0%";
      }, 300);
    }, 200);
  },
};

// Start on page load
document.addEventListener("DOMContentLoaded", () => {
  Loader.init();
  Loader.finish();
});

// Start on every link click
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (
    link &&
    link.href &&
    !link.href.startsWith("mailto") &&
    !link.href.startsWith("tel") &&
    !link.target === "_blank" &&
    link.href !== window.location.href
  ) {
    Loader.start();
  }
});

// Start on every form submit
document.addEventListener("submit", (e) => {
  Loader.start();
});