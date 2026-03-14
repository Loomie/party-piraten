
const codeInput = document.getElementById("code-input");
const codeDisplay = document.getElementById("code-display");
const artistSpan = document.getElementById("artist");
const yearSpan = document.getElementById("year");
const titleSpan = document.getElementById("title");
const messageDiv = document.getElementById("message-div");
const message = document.getElementById("message-p");
const solutionCollapseDiv = document.getElementById('solutionCollapseDiv');
const collapseInstance = bootstrap.Collapse.getInstance(solutionCollapseDiv) || new bootstrap.Collapse(solutionCollapseDiv, {toggle: false});
let jsonLoaded = false;
let cachedJson = null;

document.addEventListener("DOMContentLoaded", () => {
    disableControlButtons();
})

// Formatierung Code Input
function updateCodeDisplay() {
    // Nur Zahlen behalten
    let cleanValue = codeInput.value.replace(/\D/g, "").slice(0, 6);
    // Clean value direkt in input speichern
    codeInput.value = cleanValue;
    // Display value mit Leerzeichen formatieren
    let displayValue = cleanValue;
    if (displayValue.length > 3) {
        displayValue = displayValue.slice(0, 3) + " " + displayValue.slice(3);
    }
    // Display aktualisieren
    codeDisplay.textContent = displayValue;
}

codeInput.addEventListener("keyup", updateCodeDisplay);
codeInput.addEventListener("input", updateCodeDisplay);

function startPlay() {
    showDiv(loadingSpinner);
    console.clear(); // avoid flooding
    stopPlayer();
    const searchCode = codeInput.value;
    getEntry(searchCode).then(entry => {
        if(!jsonLoaded) {
            showMessage("JSON konnte nicht geladen werden");
            hideDiv(loadingSpinner);
        }
        else if (entry) {
            hideMessageDiv();
            hideConclusion(entry);

            setTimeout(() => {
                setConclusion(entry);
            }, 1000); // ms

            embedVideo(entry.url);
        } else {
            showMessage("Code wurde nicht gefunden");
            hideDiv(loadingSpinner);
        }
    });
}

function setIcon(element, newIcon) {
    element.className = ''; // alle bisherigen Klassen löschen
    element.classList.add('fas', newIcon); // neues Icon setzen
}

function showDiv(element) {
    if(element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    }
}
function hideDiv(element) {
    if(!element.classList.contains('d-none')) {
        element.classList.add('d-none');
    }
}

// Messages
function showMessage(content) {
    message.textContent = content;
    showDiv(messageDiv);
}
function hideMessageDiv() {
    message.textContent = "";
    hideDiv(messageDiv);
}

function clearInput() {
    codeInput.value = "";
    codeDisplay.textContent = "";
    hideMessageDiv();
    codeInput.focus();
}

function hideConclusion() {
    collapseInstance.hide();
}
function setConclusion(entry) {
    artistSpan.textContent = entry.artist;
    yearSpan.textContent = entry.year;
    titleSpan.textContent = entry.title;
}

// Funktionen zum Lesen des JSON
async function loadData() {
    if (cachedJson) return cachedJson;

    const response = await fetch("data/codes.json");
    if (!response.ok) {
        return null;
    }
    else {
        cachedJson = await response.json();
        return cachedJson;
    }
}
async function getEntry(code) {
    const data = await loadData();
    if (!data) {
        jsonLoaded = false;
        return null;
    }
    else {
        jsonLoaded = true;
        return data[code];
    }
}


