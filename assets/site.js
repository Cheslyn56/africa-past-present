// Image lightbox, copy-link sharing and story topic filter
(() => {
  // Lightbox for article figures
  const imgs = document.querySelectorAll("figure img");
  if (imgs.length && "HTMLDialogElement" in window) {
    const dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.innerHTML = '<button type="button" aria-label="Close image">[ close ]</button><img alt="">';
    document.body.appendChild(dlg);
    const big = dlg.querySelector("img");
    dlg.querySelector("button").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    imgs.forEach((img) => {
      img.tabIndex = 0;
      const open = () => { big.src = img.currentSrc || img.src; big.alt = img.alt; dlg.showModal(); };
      img.addEventListener("click", open);
      img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  // Share links
  const url = encodeURIComponent(location.href);
  const title = encodeURIComponent(document.title);
  document.querySelectorAll("[data-share]").forEach((el) => {
    const kind = el.dataset.share;
    if (kind === "x") el.href = `https://x.com/intent/post?url=${url}&text=${title}`;
    if (kind === "facebook") el.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (kind === "copy") {
      el.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(location.href); el.textContent = "Copied!"; }
        catch { el.textContent = "Copy failed"; }
        setTimeout(() => (el.textContent = "Copy link"), 2000);
      });
    }
  });

  // Story topic filter
  const tagButtons = document.querySelectorAll(".tags button");
  const stories = document.querySelectorAll(".story-list li[data-topics]");
  const empty = document.querySelector(".empty-note");
  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const active = btn.getAttribute("aria-pressed") === "true";
      tagButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      const topic = active ? null : btn.dataset.topic;
      if (topic) btn.setAttribute("aria-pressed", "true");
      let shown = 0;
      stories.forEach((li) => {
        const match = !topic || li.dataset.topics.split(" ").includes(topic);
        li.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  });
})();
