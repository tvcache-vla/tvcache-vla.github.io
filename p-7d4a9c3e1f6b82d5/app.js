"use strict";

const RESULTS = {
  openvla: {
    name: "OpenVLA-OFT",
    rows: [
      { retention: "50%", cache: 96.80, ours: 97.55 },
      { retention: "25%", cache: 87.85, ours: 95.55 },
      { retention: "12.5%", cache: 69.50, ours: 84.00 }
    ]
  },
  bitvla: {
    name: "BitVLA",
    rows: [
      { retention: "50%", cache: 93.90, ours: 95.00 },
      { retention: "25%", cache: 93.15, ours: 94.90 },
      { retention: "12.5%", cache: 92.50, ours: 94.05 }
    ]
  },
  adapter: {
    name: "VLA-Adapter",
    rows: [
      { retention: "50%", cache: 77.35, ours: 79.95 },
      { retention: "25%", cache: 48.35, ours: 54.40 }
    ]
  },
  pi05: {
    name: "π0.5",
    rows: [
      { retention: "50%", cache: 97.20, ours: 98.45 },
      { retention: "25%", cache: 89.20, ours: 94.75 }
    ]
  }
};

const header = document.querySelector("[data-header]");
const chart = document.querySelector("[data-chart]");
const tableBody = document.querySelector("[data-result-table]");
const resultLabel = document.querySelector("[data-result-label]");
const resultDelta = document.querySelector("[data-result-delta]");
const resultCopy = document.querySelector("[data-result-copy]");
const tabs = Array.from(document.querySelectorAll("[data-model]"));

function renderResults(key) {
  const data = RESULTS[key];
  if (!data || !chart || !tableBody) return;

  const aggressive = data.rows[data.rows.length - 1];
  const delta = aggressive.ours - aggressive.cache;

  resultLabel.textContent = data.name + " · most aggressive setting";
  resultDelta.textContent = "+" + delta.toFixed(2) + " pp";
  resultCopy.textContent =
    "over VLA-Cache at " + aggressive.retention + " token retention";

  chart.replaceChildren();
  tableBody.replaceChildren();

  data.rows.forEach(function (row) {
    const group = document.createElement("div");
    group.className = "bar-group";

    const cacheBar = document.createElement("div");
    cacheBar.className = "bar cache";
    cacheBar.style.height = row.cache + "%";
    cacheBar.innerHTML =
      '<span class="bar-value">' + row.cache.toFixed(2) + "</span>";

    const oursBar = document.createElement("div");
    oursBar.className = "bar ours";
    oursBar.style.height = row.ours + "%";
    oursBar.innerHTML =
      '<span class="bar-value">' + row.ours.toFixed(2) + '</span>' +
      '<span class="bar-label">' + row.retention + " tokens</span>";

    group.append(cacheBar, oursBar);
    chart.append(group);

    const tr = document.createElement("tr");
    const gain = row.ours - row.cache;
    tr.innerHTML =
      "<td>" + row.retention + "</td>" +
      "<td>" + row.cache.toFixed(2) + "%</td>" +
      "<td><strong>" + row.ours.toFixed(2) + "%</strong></td>" +
      '<td class="gain-positive">+' + gain.toFixed(2) + " pp</td>";
    tableBody.append(tr);
  });
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (item) {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    renderResults(tab.dataset.model);
  });
});

function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = Array.from(document.querySelectorAll(".reveal"));

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach(function (item) {
    item.classList.add("visible");
  });
} else {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px" }
  );
  revealItems.forEach(function (item) {
    observer.observe(item);
  });
}

const copyButton = document.querySelector("[data-copy]");
const bibtex = document.querySelector("[data-bibtex]");

if (copyButton && bibtex) {
  copyButton.addEventListener("click", async function () {
    const original = copyButton.textContent;
    try {
      await navigator.clipboard.writeText(bibtex.textContent);
      copyButton.textContent = "Copied";
    } catch (error) {
      copyButton.textContent = "Select text";
    }
    window.setTimeout(function () {
      copyButton.textContent = original;
    }, 1600);
  });
}

renderResults("openvla");
