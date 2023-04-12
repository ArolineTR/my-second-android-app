import { invoke } from "@tauri-apps/api/tauri";
import { Html5QrcodeScanner } from "html5-qrcode";

// To use Html5QrcodeScanner (more info below)

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;
let resultBelanja: HTMLElement | null;

async function greet_folder() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsgEl.textContent = await invoke("greet_folder", {
      name: greetInputEl.value,
    });
  }

}

async function greetFile() {
  const d = new Date();
  const year = d.getFullYear().toString().substr(-2);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const date = d.getDate().toString().padStart(2, "0");
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");
  const formattedDate = `Y${year}_M${month}_D${date}_h${hours}_m${minutes}_s${seconds}`;

  if (greetMsgEl && resultBelanja) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke("greetFile", {
      hasil: resultBelanja.textContent,
      date: formattedDate,
    });

    greetMsgEl.textContent = 'Berhasil save file! Result' + formattedDate + '.txt';

  }
}


async function onScanSuccess(decodedText: String) {
  // handle the scanned code as you like, for example:
  alert(`Barcode found = ${decodedText}, searching for the product...`);

  if (greetMsgEl && resultBelanja) {

    greetMsgEl.textContent = await invoke("check_barcode", {
      name: decodedText,
    
    });
  
    var addItems = greetMsgEl.textContent;
      
    var listItem = document.createElement("li");
    listItem.textContent = addItems;

    // append the new list item to the resultBelanja div
    var orderedList = resultBelanja.querySelector("ol");
    if (orderedList) {
    orderedList.appendChild(listItem)
    }

  }
}

async function onScanFailure(error: String) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.log(`Error found = ${error}`);

}

let html5QrcodeScanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: {width: 250, height: 250} },
  /* verbose= */ false);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);


async function check_barcode() {

  alert(`Searching for the product...`);
  
  if (greetMsgEl && greetInputEl && resultBelanja) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsgEl.textContent = await invoke("check_barcode", {
      name: greetInputEl.value,
    
    });
  
    var addItems = greetMsgEl.textContent;
      
    var listItem = document.createElement("li");
    listItem.textContent = addItems;

    // append the new list item to the resultBelanja div
    var orderedList = resultBelanja.querySelector("ol");
    if (orderedList) {
    orderedList.appendChild(listItem)
    }

  }

}



window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  resultBelanja = document.querySelector("#result-belanja");
  
  document
    .querySelector("#greet-button")
    ?.addEventListener("click", () => greet_folder());

  document.querySelector("#greet-button-file")?.addEventListener("click", () => greetFile());

  document.querySelector("#greet-button-serial-checker")?.addEventListener("click", () => check_barcode());

  
})

