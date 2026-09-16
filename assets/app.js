const STORAGE_KEY = "local-service-admin-clients";

let clients = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let editingId = null;

const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

const addClientBtn = document.getElementById("addClientBtn");
const cancelClientBtn = document.getElementById("cancelClientBtn");
const clientFormBox = document.getElementById("clientFormBox");
const clientForm = document.getElementById("clientForm");
const formTitle = document.getElementById("formTitle");
const searchClient = document.getElementById("searchClient");
const clientRows = document.getElementById("clientRows");
const clientTable = document.getElementById("clientTable");
const clientEmpty = document.getElementById("clientEmpty");

const fields = {
  name: document.getElementById("clientName"),
  phone: document.getElementById("clientPhone"),
  email: document.getElementById("clientEmail"),
  address: document.getElementById("clientAddress")
};

function saveClients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderClients() {
  const query = searchClient.value.toLowerCase().trim();

  const filtered = clients.filter(client =>
    [client.name, client.phone, client.email, client.address]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );

  clientRows.innerHTML = filtered.map(client => `
    <tr class="border-b">
      <td class="p-2">${escapeHtml(client.name)}</td>
      <td class="p-2">${escapeHtml(client.phone)}</td>
      <td class="p-2">${escapeHtml(client.email)}</td>
      <td class="p-2">${escapeHtml(client.address)}</td>
      <td class="p-2 whitespace-nowrap">
        <button class="edit-btn text-blue-600 mr-2" data-id="${client.id}">Edit</button>
        <button class="delete-btn text-red-600" data-id="${client.id}">Delete</button>
      </td>
    </tr>
  `).join("");

  const hasRows = filtered.length > 0;
  clientTable.classList.toggle("hidden", !hasRows);
  clientEmpty.classList.toggle("hidden", hasRows);

  if (clients.length > 0 && !hasRows) {
    clientEmpty.textContent = "No matching clients found.";
  } else {
    clientEmpty.textContent = "No clients yet. Add your first client.";
  }
}

function openForm(client = null) {
  editingId = client ? client.id : null;
  formTitle.textContent = client ? "Edit client" : "Add client";

  fields.name.value = client?.name || "";
  fields.phone.value = client?.phone || "";
  fields.email.value = client?.email || "";
  fields.address.value = client?.address || "";

  clientFormBox.classList.remove("hidden");
  fields.name.focus();
}

function closeForm() {
  editingId = null;
  clientForm.reset();
  clientFormBox.classList.add("hidden");
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const viewId = tab.dataset.view;

    tabs.forEach(item => {
      item.className = "tab px-4 py-2 rounded bg-white border";
    });

    tab.className = "tab px-4 py-2 rounded bg-blue-600 text-white";

    views.forEach(view => view.classList.add("hidden"));
    document.getElementById(viewId).classList.remove("hidden");
  });
});

addClientBtn.addEventListener("click", () => openForm());
cancelClientBtn.addEventListener("click", closeForm);
searchClient.addEventListener("input", renderClients);

clientForm.addEventListener("submit", event => {
  event.preventDefault();

  const client = {
    id: editingId || crypto.randomUUID(),
    name: fields.name.value.trim(),
    phone: fields.phone.value.trim(),
    email: fields.email.value.trim(),
    address: fields.address.value.trim()
  };

  if (editingId) {
    clients = clients.map(item => item.id === editingId ? client : item);
  } else {
    clients.push(client);
  }

  saveClients();
  renderClients();
  closeForm();
});

clientRows.addEventListener("click", event => {
  const id = event.target.dataset.id;
  if (!id) return;

  const client = clients.find(item => item.id === id);

  if (event.target.classList.contains("edit-btn")) {
    openForm(client);
  }

  if (event.target.classList.contains("delete-btn")) {
    if (confirm(`Delete ${client.name}?`)) {
      clients = clients.filter(item => item.id !== id);
      saveClients();
      renderClients();
    }
  }
});

renderClients();
