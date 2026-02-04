function compressImage() {
  const input = document.getElementById("imageInput");
  if (!input.files.length) return;

  const img = new Image();
  const reader = new FileReader();

  reader.onload = e => img.src = e.target.result;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width * 0.7;
    canvas.height = img.height * 0.7;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const link = document.getElementById("downloadCompressed");
      link.href = URL.createObjectURL(blob);
      link.download = "compressed.jpg";
      link.textContent = "Download Compressed Image";
      link.hidden = false;
    }, "image/jpeg", 0.7);
  };

  reader.readAsDataURL(input.files[0]);
}

async function jpgToPdf() {
  const input = document.getElementById("jpgInput");
  if (!input.files.length) return;

  const bytes = await input.files[0].arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.create();
  const img = await pdfDoc.embedJpg(bytes);
  const page = pdfDoc.addPage([img.width, img.height]);

  page.drawImage(img, { x: 0, y: 0 });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  const link = document.getElementById("downloadPdf");
  link.href = URL.createObjectURL(blob);
  link.download = "image.pdf";
  link.textContent = "Download PDF";
  link.hidden = false;
}

async function pdfToJpg() {
  const input = document.getElementById("pdfInput");
  if (!input.files.length) return;

  const pdfData = await input.files[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const container = document.getElementById("pdfImages");

  container.innerHTML = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport
    }).promise;

    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/jpeg", 0.9);
    img.style.width = "100%";
    container.appendChild(img);
  }
}
