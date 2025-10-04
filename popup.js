// popup.js
const EMAIL = "ollie.steampowered@gmail.com"; // <-- replace with your email

const $ = (s) => document.querySelector(s);
const emailEl = $("#supportEmail");
const copyBtn = $("#copyBtn");
const statusEl = $("#status");
const verEl = $("#extVer");
const mailtoLink = $("#mailtoLink");

(function init(){
  // Fill email + mailto
  emailEl.textContent = EMAIL;
  mailtoLink.href = `mailto:${encodeURIComponent(EMAIL)}?subject=${encodeURIComponent("PassMed Score Hider Feedback")}`;

  // Set extension version
  try {
    const manifest = chrome.runtime.getManifest();
    verEl.textContent = manifest.version ?? "dev";
  } catch {
    verEl.textContent = "dev";
  }

  // Copy to clipboard
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      statusEl.textContent = "Copied";
      copyBtn.disabled = true;
      setTimeout(() => { statusEl.textContent = ""; copyBtn.disabled = false; }, 1200);
    } catch {
      statusEl.textContent = "Copy failed";
      setTimeout(() => { statusEl.textContent = ""; }, 1500);
    }
  });

  // Prevent Enter from toggling buttons accidentally
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });
})();
