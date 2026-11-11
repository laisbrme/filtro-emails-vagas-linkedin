function diagnosticarPrimeiroLink() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Página1");
  var link = String(planilha.getRange(2, 5).getValue()).trim();
  var id = extrairIdVaga(link);
  var urls = [link, "https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/" + id];

  urls.forEach(function (u) {
    var r = UrlFetchApp.fetch(u, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9"
      }
    });
    var t = r.getContentText();
    Logger.log(u + "\ncódigo: " + r.getResponseCode() + " | tamanho: " + t.length +
      " | contém 'authwall': " + (t.indexOf("authwall") > -1) +
      "\ninício: " + t.substring(0, 300).replace(/\s+/g, " ") + "\n----");
  });
}

function extrairIdVaga(link) {
  var numeros = link.match(/\d{8,}/g);   // último número longo do link
  return numeros ? numeros[numeros.length - 1] : null;
}