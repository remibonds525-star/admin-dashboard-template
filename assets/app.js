const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");
tabs.forEach(t => t.addEventListener("click", () => {
  const v = t.dataset.view;
  tabs.forEach(x => x.className = "tab px-4 py-2 rounded bg-white border");
  t.className = "tab px-4 py-2 rounded bg-blue-600 text-white";
  views.forEach(s => s.classList.add("hidden"));
  document.getElementById(v).classList.remove("hidden");
}));
