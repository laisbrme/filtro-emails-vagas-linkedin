function extrairVagasLinkedIn() {
  // 1. CONEXÃO COM A PLANILHA
  var abaNome = "Página1";
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(abaNome);

  // 2. LISTAS DE TERMOS PARA IGNORAR
  // Termos do TÍTULO: casam só a palavra inteira ("lead" não pega "leader")
  var termosTitulo = [
    // Senioridade
    "estágio", "estagiário", "estagiária", "internship",
    "sênior", "senior", "sr", "especialista", "lead",
    // Tipo de vaga
    "exclusiva para pessoas com deficiência",
    "banco de talentos"
  ];

  // Termos do LOCAL: casam por trecho (ex.: "São Paulo, SP (Híbrido)")
  var termosLocal = [
    "alemanha", "berlim",
    "SP (híbrido)", "MG (híbrido)", "MT (híbrido)", "SC (híbrido)", "AM (híbrido)",
    "PR (híbrido)", "PE (híbrido)", "RJ (híbrido)",
    "SP (presencial)", "MG (presencial)", "MT (presencial)", "SC (presencial)", "AM (presencial)",
    "PR (presencial)", "PE (presencial)", "RJ (presencial)"
  ];

  // Prepara as regras uma única vez (sem acento e sem diferença de maiúscula/minúscula)
  var regrasTitulo = termosTitulo.map(function (t) {
    var termo = escaparRegex(normalizar(t));
    // "sr" aceita ponto opcional: "Sr" e "Sr."
    if (termo === "sr") termo = "sr\\.?";
    return new RegExp("(?<![\\p{L}\\p{N}])" + termo + "(?![\\p{L}\\p{N}])", "u");
  });
  var termosLocalNorm = termosLocal.map(normalizar);

  // 3. LINKS JÁ EXISTENTES (evita duplicatas)
  var ultimaLinha = planilha.getLastRow();
  var linksExistentes = [];
  if (ultimaLinha > 1) {
    var dados = planilha.getRange(2, 5, ultimaLinha - 1, 1).getValues();
    linksExistentes = dados.map(function (linha) { return String(linha[0]).trim(); });
  }

  // 4. BUSCA NO GMAIL
  var pesquisa = '(from:jobalerts-noreply@linkedin.com OR from:jobs-listings@linkedin.com OR from:jobs-noreply@linkedin.com) is:unread';
  var threads = GmailApp.search(pesquisa);

  for (var i = 0; i < threads.length; i++) {
    var mensagens = threads[i].getMessages();

    for (var j = 0; j < mensagens.length; j++) {
      var mensagem = mensagens[j];
      var htmlCorpo = mensagem.getBody();

      // 5. DATA DO E-MAIL
      var dataEmail = Utilities.formatDate(mensagem.getDate(), Session.getScriptTimeZone(), "dd/MM/yyyy");

      var regex = /<a[^>]*href=["'](https:\/\/[^"']*linkedin\.com\/(?:comm\/)?jobs\/view\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>[\s\S]{0,300}?<p[^>]*>([\s\S]*?)<\/p>/gi;

      var match;
      while ((match = regex.exec(htmlCorpo)) !== null) {
        var linkVaga = match[1].split('?')[0];
        var vaga = match[2].replace(/<[^>]+>/g, '').trim();
        var empresaCompleta = match[3].replace(/<[^>]+>/g, '').trim();

        // 6. SEPARA EMPRESA E LOCAL (só pelo ponto do meio, para não cortar "S.A." ou "Ltda.")
        var partes = empresaCompleta.split(/\s*(?:·|•|&middot;|&#183;)\s*/);
        var empresa = partes[0] ? partes[0].trim() : "Empresa não identificada";
        var local = partes[1] ? partes[1].trim() : "Local não identificado";

        // 7. VERIFICA TERMOS IGNORADOS
        var vagaNorm = normalizar(vaga);
        var localNorm = normalizar(local);

        var ignorarVaga = regrasTitulo.some(function (r) { return r.test(vagaNorm); }) ||
                          termosLocalNorm.some(function (t) { return localNorm.indexOf(t) !== -1; });

        // 8. ADICIONA NA PLANILHA: DATA, EMPRESA, LOCAL, VAGA, LINK
        if (!ignorarVaga && linksExistentes.indexOf(linkVaga) === -1) {
          planilha.appendRow([dataEmail, empresa, local, vaga, linkVaga]);
          linksExistentes.push(linkVaga);
        }
      }
    }
    // threads[i].markRead();   // alternativa: só marcar como lido
    threads[i].moveToTrash();   // move o e-mail para a lixeira
  }
}

function normalizar(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escaparRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}