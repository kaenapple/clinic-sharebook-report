const leftRows = document.getElementById("leftRows");
const rightRows = document.getElementById("rightRows");
const statusEl = document.getElementById("status");
const reportSheet = document.getElementById("reportSheet");

const leftItems = [
  ["5", "週5", "待合室", "床清掃"],
  ["", "", "受付", "床清掃"],
  ["", "週1", "カウンセリングルーム", "床清掃"],
  ["", "", "バックヤード①", "床清掃"],
  ["", "週2", "写真室", "床清掃"],
  ["", "週5", "廊下", "床清掃"],
  ["", "", "バックヤード②", "床清掃"],
  ["", "週2", "", "流し台除菌清掃"],
  ["", "", "手術室", "床清掃"],
  ["", "", "処置室①", "床清掃"],
  ["", "週5", "診察室①", "床清掃"],
  ["", "", "診察室②", "床清掃"],
  ["", "", "診察室③", "床清掃"],
  ["", "", "診察室④", "床清掃"],
  ["", "", "パウダールーム", "机上清拭"],
  ["", "", "", "鏡清拭"]
];

const rightItems = [
  ["5", "週5", "パウダールーム", "洗面台除菌清掃"],
  ["", "", "点滴室", "床清掃"],
  ["", "", "", "床清掃"],
  ["", "", "お客様用トイレ", "トイレの清掃"],
  ["", "", "", "洗面台除菌清掃"],
  ["", "週1", "リカバリー", "床清掃"],
  ["", "週5", "処置室②", "床清掃"],
  ["", "", "処置室③", "床清掃"],
  ["", "週2", "", "洗面台除菌清掃"],
  ["", "週5", "処置室④", "床清掃"],
  ["", "週2", "", "洗面台除菌清掃"],
  ["", "", "処置室⑤", "床清掃"],
  ["", "週5", "処置室⑥", "床清掃"],
  ["", "", "処置室⑦", "床清掃"],
  ["", "", "処置室⑧", "床清掃"],
  ["", "週2", "", "洗面台除菌清掃"],
  ["", "週5", "ゴミ回収・移動", "ゴミ回収・移動"]
];

function fillToday() {
  const today = new Date();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  document.querySelector('[name="month"]').value = String(today.getMonth() + 1);
  document.querySelector('[name="day"]').value = String(today.getDate());
  document.querySelector('[name="weekday"]').value = weekdays[today.getDay()];
}

function makeRow([floor, frequency, place, task], index, side) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="floor">${floor}</td>
    <td class="freq">${frequency}</td>
    <td class="check-cell"><input type="checkbox" aria-label="${place || task} ${task}"></td>
    <td class="place">${place}</td>
    <td>${task}</td>
  `;
  tr.dataset.row = `${side}-${index}`;
  return tr;
}

leftItems.forEach((item, index) => leftRows.appendChild(makeRow(item, index, "left")));
rightItems.forEach((item, index) => rightRows.appendChild(makeRow(item, index, "right")));
fillToday();

function setStatus(message) {
  statusEl.textContent = message;
}

function reportName() {
  const month = document.querySelector('[name="month"]').value || "月";
  const day = document.querySelector('[name="day"]').value || "日";
  return `シェアブック_${month}_${day}.pdf`;
}

async function buildPdf() {
  if (!window.html2canvas || !window.jspdf) {
    throw new Error("PDF作成ライブラリを読み込み中です。少し待ってから再度お試しください。");
  }

  const actionBar = document.querySelector(".action-bar");
  actionBar.style.display = "none";
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const canvas = await html2canvas(reportSheet, {
    scale: 2,
    backgroundColor: "#ffffff",
    windowWidth: reportSheet.scrollWidth
  });

  actionBar.style.display = "";

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const imageWidth = pageWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;
  const image = canvas.toDataURL("image/jpeg", 0.98);

  if (imageHeight <= pageHeight) {
    doc.addImage(image, "JPEG", 0, 0, imageWidth, imageHeight);
    return doc;
  }

  let y = 0;
  let remaining = imageHeight;
  doc.addImage(image, "JPEG", 0, y, imageWidth, imageHeight);
  remaining -= pageHeight;

  while (remaining > 0) {
    y -= pageHeight;
    doc.addPage();
    doc.addImage(image, "JPEG", 0, y, imageWidth, imageHeight);
    remaining -= pageHeight;
  }

  return doc;
}

document.getElementById("checkAll").addEventListener("click", () => {
  document.querySelectorAll('.work-table input[type="checkbox"]').forEach((input) => {
    input.checked = true;
  });
  setStatus("全てチェックしました。");
});

document.getElementById("clearChecks").addEventListener("click", () => {
  document.querySelectorAll('.work-table input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  setStatus("チェックを解除しました。");
});

document.getElementById("previewPdf").addEventListener("click", async () => {
  try {
    setStatus("PDFを作成しています...");
    const doc = await buildPdf();
    doc.save(reportName());
    setStatus("PDFを保存しました。");
  } catch (error) {
    setStatus(error.message);
  }
});

document.getElementById("sendPdf").addEventListener("click", async () => {
  try {
    setStatus("PDFを作成しています...");
    const doc = await buildPdf();
    const payload = new FormData();
    payload.append("pdf", doc.output("blob"), reportName());
    payload.append("patientName", "シェアブック");
    payload.append("reportDate", `${document.querySelector('[name="month"]').value || ""}/${document.querySelector('[name="day"]').value || ""}`);

    setStatus("送信しています...");
    const response = await fetch("/api/send-report", {
      method: "POST",
      body: payload
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "送信に失敗しました。");
    setStatus("送信しました。");
  } catch (error) {
    setStatus(`${error.message} PDF確認で保存できます。`);
  }
});
