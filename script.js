const CONTRACTS_URL = "https://script.google.com/macros/s/AKfycbx28ipebSpJ_ecrv7JpP60i9wzKj8FFJAPsDcUdgIUY3LoGttQl_93w-_EJzMlavlUy/exec";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDatePretty(dateStr) {
  const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  const [day, month, year] = dateStr.split("-").map(Number);
  return `${pad(day)} ${months[month - 1]} ${year}`;
}

function getDaysUntil(dateStr) {
  const [day, month, year] = dateStr.split("-").map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(year, month - 1, day);
  const diffMs = target - today;
  return Math.floor(diffMs / 86400000);
}

function setContractsFallback(title, name, meta) {
  const dateEl = document.getElementById("contractDate");
  const nameEl = document.getElementById("contractName");
  const typeEl = document.getElementById("contractType");

  if (dateEl) dateEl.innerText = title;
  if (nameEl) nameEl.innerText = name;
  if (typeEl) typeEl.innerText = meta;
}

async function loadContractsReminder() {
  console.log("loadContractsReminder INICIO");

  try {
    const res = await fetch(CONTRACTS_URL, { cache: "no-store" });
    const data = await res.json();

    console.log("DATA CONTRATOS:", data);

    if (!data.ok || !data.next) {
      setContractsFallback("-- --- ----", "SIN VENCIMIENTOS", "--");
      return;
    }

    const item = data.next;
    const days = getDaysUntil(item.fecha);

    const dateEl = document.getElementById("contractDate");
    const nameEl = document.getElementById("contractName");
    const typeEl = document.getElementById("contractType");

    if (!dateEl || !nameEl || !typeEl) {
      console.error("Faltan elementos HTML de contratos:", {
        contractDate: !!dateEl,
        contractName: !!nameEl,
        contractType: !!typeEl
      });
      return;
    }

    dateEl.innerText = formatDatePretty(item.fecha);
    nameEl.innerText = item.trabajador.toUpperCase();

    let meta = item.tipo.toUpperCase();
    if (days === 0) {
      meta += " · HOY";
    } else if (days === 1) {
      meta += " · EN 1 DÍA";
    } else if (days > 1) {
      meta += ` · EN ${days} DÍAS`;
    }

    typeEl.innerText = meta;

  } catch (e) {
    console.error("ERROR loadContractsReminder:", e);
    setContractsFallback("-- --- ----", "ERROR", "--");
  }
}

/* =========================================================
   PRUEBA AISLADA:
   SOLO ejecuta contratos.
   TODO lo demás queda desactivado temporalmente.
========================================================= */

loadContractsReminder();
setInterval(loadContractsReminder, 60000);
