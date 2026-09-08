(() => {
  const hydrateVideo = (video) => {
    if (video.dataset.loaded === "true") return;

    if (video.dataset.poster) {
      video.poster = video.dataset.poster;
    }

    video.querySelectorAll("source[data-src]").forEach((source) => {
      source.src = source.dataset.src;
    });

    video.dataset.loaded = "true";
    video.load();
  };

  const hero = document.querySelector(".hero-video[data-autoplay]");
  const startHero = () => {
    if (!hero) return;
    hydrateVideo(hero);
    hero.play().catch(() => {
      // Browser autoplay policies may require an explicit user gesture.
    });
  };

  window.addEventListener("load", () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startHero, { timeout: 1200 });
    } else {
      window.setTimeout(startHero, 250);
    }
  }, { once: true });

  const lazyVideos = document.querySelectorAll(".lazy-video");
  if (!("IntersectionObserver" in window)) {
    lazyVideos.forEach(hydrateVideo);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      hydrateVideo(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "400px 0px" });

  lazyVideos.forEach((video) => observer.observe(video));
})();
