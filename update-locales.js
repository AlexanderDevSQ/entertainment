const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/assets/locale');

const translations = {
  en: { iosDownloadHere: "Download Here" },
  ru: { iosDownloadHere: "Скачать здесь" },
  de: { iosDownloadHere: "Hier herunterladen" },
  el: { iosDownloadHere: "Κατεβάστε εδώ" },
  pt: { iosDownloadHere: "Baixe aqui" },
  fr: { iosDownloadHere: "Téléchargez ici" },
  it: { iosDownloadHere: "Scarica qui" },
  pl: { iosDownloadHere: "Pobierz tutaj" },
  es: { iosDownloadHere: "Descargar Aquí" },

};

fs.readdirSync(localesDir).forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Ensure generalNames exists
    if (!data.ios) {
      data.ios = {};
    }

    // Merge translations into ios
    Object.assign(data.ios, translations[lang] || {});

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated ${file}`);
  }
});
