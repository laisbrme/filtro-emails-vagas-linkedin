function verificarVagasEncerradas() {
  var ABA = "Página1";
  var COLUNA_TITULO = 4;   // D
  var COLUNA_LINK = 5;     // E
  var TEXTOS_ENCERRADA = [
    "nao aceita mais candidaturas",
    "não aceita candidaturas agora",
    "no longer accepting applications",
    "anuncio de vaga foi removido",              // vaga removida
    "codigo da vaga fornecido pode ser invalido" // mesma mensagem, outro trecho
  ];
  var COR_ENCERRADA = "#f4cccc", COR_ABERTA = "#d9ead3", COR_INCERTA = "#fff2cc";
  var PAUSA_MS = 3000;
  var LIMITE_MS = 5 * 60 * 1000;

  var inicio = Date.now();
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
  var ultimaLinha = planilha.getLastRow();
  if (ultimaLinha < 2) return;

  var dados = planilha.getRange(2, 1, ultimaLinha - 1, COLUNA_LINK).getValues();
  var fundos = planilha.getRange(2, 1, ultimaLinha - 1, 1).getBackgrounds();

  // Fila: linhas sem cor primeiro; vermelhas (encerradas) são puladas
  var novas = [], recheck = [];
  for (var i = 0; i < dados.length; i++) {
    var link = String(dados[i][COLUNA_LINK - 1]).trim();
    if (!link) continue;
    var fundo = fundos[i][0].toLowerCase();
    if (fundo === COR_ENCERRADA) continue;
    var item = { linha: i + 2, link: link, titulo: String(dados[i][COLUNA_TITULO - 1]) };
    if (fundo === "#ffffff") novas.push(item); else recheck.push(item);
  }
  var fila = novas.concat(recheck);

  for (var k = 0; k < fila.length; k++) {
    if (Date.now() - inicio > LIMITE_MS) {
      Logger.log("Tempo limite atingido; rode novamente para continuar.");
      break;
    }
    var cor = verificarUma(fila[k], TEXTOS_ENCERRADA, COR_ENCERRADA, COR_ABERTA, COR_INCERTA);
    planilha.getRange(fila[k].linha, 1, 1, COLUNA_LINK).setBackground(cor);
    Utilities.sleep(PAUSA_MS);
  }
}

function verificarUma(item, textos, corEncerrada, corAberta, corIncerta) {
  var id = extrairIdVaga(item.link);
  if (!id) return corIncerta;

  try {
    var r = UrlFetchApp.fetch("https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/" + id, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9"
      }
    });
    var codigo = r.getResponseCode();

    // Bloqueio ou limite de requisições: não dá para concluir nada
    if (codigo === 429 || codigo === 999) return corIncerta;

    var texto = normalizar(r.getContentText());

    // Mensagens de vaga encerrada/removida (valem mesmo se o código não for 200)
    for (var t = 0; t < textos.length; t++) {
      if (texto.indexOf(textos[t]) > -1) return corEncerrada;
    }

    // Vaga inexistente/removida
    if (codigo === 404 || codigo === 410) return corEncerrada;

    if (codigo !== 200) return corIncerta;

    // Verde só com confirmação positiva: a página precisa conter o título da vaga
    var tituloNorm = normalizar(item.titulo).substring(0, 25);
    if (tituloNorm && texto.indexOf(tituloNorm) > -1) return corAberta;
    return corIncerta;
  } catch (e) {
    return corIncerta;
  }
}

function normalizar(s) {
  return String(s).toLowerCase()
    .replace(/&atilde;|&#227;|&#xe3;/g, "a")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}