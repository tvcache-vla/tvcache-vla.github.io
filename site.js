(() => {
  document.querySelectorAll(".retention-grid figcaption").forEach((caption) => {
    caption.textContent = caption.textContent.split("·", 1)[0].trim();
  });

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
  lazyVideos.forEach((video) => {
    video.autoplay = true;
    video.controls = false;
  });

  if (!("IntersectionObserver" in window)) {
    lazyVideos.forEach((video) => {
      hydrateVideo(video);
      video.play().catch(() => {});
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        hydrateVideo(video);
        video.play().catch(() => {});
      } else if (video.dataset.loaded === "true") {
        video.pause();
      }
    });
  }, { rootMargin: "400px 0px" });

  lazyVideos.forEach((video) => observer.observe(video));
})();
