function extrairVagasLinkedIn() {
   // 1. CONEXÃO COM A PLANILHA
  var abaNome = "Página1"; // Se o nome da sua aba for diferente, mude aqui
  var planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(abaNome);
  
  // 2. LISTA DE PALAVRAS PARA IGNORAR
  var palavrasIgnoradas = [
    "estágio", "estagiário", "estagiária", "internship", 
    "sênior", "senior", "sr", "sr.", "especialista", "lead",
    "exclusiva para pessoas com deficiência",
    "banco de talentos"
  ];

  // 3. VERIFICA LINKS EXISTENTES NA PLANILHA PARA EVITAR DUPLICATAS
  var ultimaLinha = planilha.getLastRow();
  var linksExistentes = [];
  if (ultimaLinha > 1) {
    // Pega todos os links da coluna E (da linha 2 até o final)
    var dados = planilha.getRange(2, 5, ultimaLinha - 1, 1).getValues();
    linksExistentes = dados.map(function(linha) { return linha[0].trim(); });
  }
  
  // 4. BUSCA NO GMAIL: Alertas do LinkedIn que ainda não foram lidos
  // O termo de busca do remetente deve ser ajustado aqui sefor diferente
  var pesquisa = '(from:jobalerts-noreply@linkedin.com OR from:jobs-listings@linkedin.com OR jobs-noreply@linkedin.com) is:unread';
  var threads = GmailApp.search(pesquisa);
  
  for (var i = 0; i < threads.length; i++) {
    var mensagens = threads[i].getMessages();
    
    for (var j = 0; j < mensagens.length; j++) {
      var mensagem = mensagens[j];
      var htmlCorpo = mensagem.getBody();
      
      // 5. EXTRAI E FORMATA A DATA DO E-MAIL
      var dataBruta = mensagem.getDate();
      
      // Formata para o padrão brasileiro: Dia/Mês/Ano
      var dataEmail = Utilities.formatDate(dataBruta, Session.getScriptTimeZone(), "dd/MM/yyyy");
      
      var regex = /<a[^>]*href=["'](https:\/\/[^"']*linkedin\.com\/(?:comm\/)?jobs\/view\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>[\s\S]{0,300}?<p[^>]*>([\s\S]*?)<\/p>/gi;
      
      var match;
      while ((match = regex.exec(htmlCorpo)) !== null) {
        var linkRaw = match[1];
        var vaga = match[2].replace(/<[^>]+>/g, '').trim(); 
        var empresaCompleta = match[3].replace(/<[^>]+>/g, '').trim(); 
        
        var linkVaga = linkRaw;
        if (linkVaga.indexOf('?') > -1) {
          linkVaga = linkVaga.split('?')[0];
        }
        
        // 6. SEPARA A EMPRESA DO LOCAL
        // Divide o texto onde encontrar o ponto do meio (·) ou um ponto normal (.)
        var partes = empresaCompleta.split(/·|•|&middot;|&#183;|\./);
        var empresa = partes[0] ? partes[0].trim() : "Empresa não identificada";
        var local = partes[1] ? partes[1].trim() : "Local não identificado";
        
        // 7. VERIFICA PALAVRAS IGNORADAS
        var ignorarVaga = false;
        var vagaMinuscula = vaga.toLowerCase(); 
        
        for (var p = 0; p < palavrasIgnoradas.length; p++) {
          if (vagaMinuscula.indexOf(palavrasIgnoradas[p]) !== -1) {
            ignorarVaga = true;
            break; 
          }
        }

        // 8. ADICIONAR NA PLANILHA NA NOVA ORDEM
        if (linksExistentes.indexOf(linkVaga) === -1 && ignorarVaga === false) {
          // Ordem: DATA, EMPRESA, LOCAL, VAGA, LINK
          planilha.appendRow([dataEmail, empresa, local, vaga, linkVaga]);
          linksExistentes.push(linkVaga);
        }
      }
    }

    // 9. MARCA O E-MAIL COMO LIDO APÓS PROCESSAR
    threads[i].markRead();
  }
}