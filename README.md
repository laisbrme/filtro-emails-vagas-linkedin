<div align="center">

<h1>📬 Filtro de E-mails de Vagas do LinkedIn</h1>

<p>Um script de automação para filtrar alertas de vagas do LinkedIn recebidos no Gmail e organizá-los em uma planilha do Google Sheets.</p>

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/status-concluído-green" alt="Status do Projeto: Concluído">
  <img src="https://img.shields.io/badge/licença-MIT-blue" alt="Licença MIT">
  <img src="https://img.shields.io/badge/linguagem-Google_Apps_Script-orange" alt="Linguagem: Google Apps Script">
  <img src="https://img.shields.io/badge/plataforma-Google_Workspace-lightgrey" alt="Plataforma: Google Workspace">
</p>

</div>

---

## 📖 Sumário

*   [🎯 Sobre o Projeto](#-sobre-o-projeto)
*   [✨ Funcionalidades](#-funcionalidades)
*   [🛠️ Tecnologias Utilizadas](#-tecnologias-utilizadas)
*   [🚀 Como Instalar e Executar](#-como-instalar-e-executar)
    *   [Passo 1: Preparar a Planilha](#passo-1-preparar-a-planilha)
    *   [Passo 2: Configurar o Script](#passo-2-configurar-o-script)
    *   [Passo 3: Automatizar com Gatilhos](#passo-3-automatizar-com-gatilhos)
*   [🎨 Verificador de Vagas Encerradas](#-verificador-de-vagas-encerradas)
*   [📈 Status do Projeto](#-status-do-projeto)
*   [📝 Licença](#-licença)
*   [✍️ Autor](#-autor)

## 🎯 Sobre o Projeto

Este script foi criado para resolver um problema comum: o grande volume de e-mails de alerta de vagas do LinkedIn. Em vez de verificar manualmente cada e-mail, esta automação lê sua caixa de entrada do Gmail, extrai as informações mais importantes (vaga, empresa, local e link) e as organiza de forma limpa em uma planilha do Google Sheets.

O processo é totalmente automatizado, evitando vagas duplicadas e filtrando posições que não se encaixam no seu perfil (como "estágio" ou "sênior"), economizando tempo e mantendo sua busca por emprego organizada.

### Diagrama de Fluxo

<p align="center">
  <img src="graph.png" alt="Diagrama de Fluxo da Automação">
</p>

## ✨ Funcionalidades

*   **🔍 Leitura Inteligente:** Busca e processa apenas e-mails não lidos de alertas de vagas do LinkedIn.
*   **📊 Extração de Dados:** Captura automaticamente o título da vaga, nome da empresa, localização e o link direto para a candidatura.
*   **🚫 Filtro Inteligente:** Ignora vagas por palavras do título (ex: "estágio", "sênior", casando só a palavra inteira) e por local (ex: "SP (híbrido)"), sem diferenciar maiúsculas ou acentos.
*   **🎨 Verificação de Vagas Encerradas:** Confere os links da planilha e pinta cada linha de vermelho, verde ou amarelo conforme a situação da vaga.
*   **✔️ Anti-Duplicidade:** Verifica se o link da vaga já existe na planilha antes de adicioná-lo, garantindo uma lista sempre limpa.
*   **🤖 Automação Completa:** Após configurado, o script pode rodar sozinho em intervalos de tempo definidos (ex: a cada hora, uma vez por dia).
*   **🧹 Organização:** Move os e-mails de alerta para a lixeira do Gmail após o processamento, mantendo sua caixa de entrada limpa. (E-mails na lixeira são apagados pelo Gmail após 30 dias.)

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes ferramentas do ecossistema Google:

*   **[Google Apps Script](https://script.google.com/)**: Plataforma de desenvolvimento rápido que torna fácil e rápido criar aplicações que se integram com os serviços do Google.
*   **[Google Sheets](https://sheets.google.com/)**: Usado como banco de dados para armazenar e organizar as vagas coletadas.
*   **[Gmail](https://gmail.com/)**: Usado como fonte de dados para a extração das informações das vagas.
*   **[Gemini](https://gemini.google.dev/)**: Utilizado para gerar o código do script e fornecer suporte durante o desenvolvimento.

## 🚀 Como Instalar e Executar

Siga o passo a passo abaixo para configurar a automação na sua própria conta Google.

### Passo 1: Preparar a Planilha

1.  Crie uma nova planilha no **[Google Sheets](https://sheets.new)**.
2.  Na primeira linha (cabeçalho), defina as seguintes colunas:
    *   `A1`: **DATA**
    *   `B1`: **EMPRESA**
    *   `C1`: **LOCAL**
    *   `D1`: **VAGA**
    *   `E1`: **LINK**
3.  Renomeie a aba da planilha para `Página1` ou, se preferir outro nome, lembre-se de atualizá-lo na primeira linha do código-fonte.

### Passo 2: Configurar o Script

1.  Na sua planilha, vá até o menu `Extensões` > `Apps Script`.
2.  O editor de script será aberto em uma nova aba. Apague todo o conteúdo que vier por padrão.
3.  Copie o código do arquivo `extrairVagasLinkedIn.gs` e cole no editor.
4.  Clique no ícone de **Salvar projeto** (💾).
5.  Para testar e conceder as permissões, clique em **Executar**. A primeira execução solicitará autorização:
    *   Clique em `Revisar permissões` e escolha sua conta Google.
    *   Você verá um aviso de segurança. Clique em `Avançado` e depois em `Acessar <nome-do-projeto> (não seguro)`.
    *   Por fim, clique em `Permitir`.

> **Dica:** Antes de executar pela primeira vez, deixe alguns e-mails de vagas do LinkedIn como "não lidos" no seu Gmail para que o script tenha dados para processar.

### Passo 3: Automatizar com Gatilhos

Para que o script rode sozinho, crie um "acionador" (gatilho):

1.  No menu lateral esquerdo do Apps Script, clique no ícone de **Acionadores** (⏰).
2.  Clique no botão `+ Adicionar acionador` no canto inferior direito.
3.  Configure o acionador da seguinte forma:
    *   **Função a ser executada:** `extrairVagasLinkedIn`
    *   **Origem do evento:** `Baseado no tempo`
    *   **Tipo de acionador:** `Temporizador de horas` (ou o intervalo que preferir)
    *   **Selecione o intervalo:** `A cada hora` (ou `A cada 4 horas`, `Diariamente`, etc.)
4.  Clique em **Salvar**.

Pronto! A automação está configurada e irá rodar automaticamente no intervalo que você definiu.

## 🎨 Verificador de Vagas Encerradas

Depois que as vagas estão na planilha, o verificador abre cada link da coluna **E** e colore a linha de acordo com a situação da vaga.

| Cor | Significado |
|-----|-------------|
| 🔴 Vermelho | Vaga encerrada ou removida (não é reverificada) |
| 🟢 Verde | A página carregou e o título da vaga (coluna **D**) foi encontrado |
| 🟡 Amarelo | Não foi possível verificar (bloqueio, erro ou página inesperada) |

### Como usar

1.  No mesmo projeto do Apps Script, adicione os arquivos `verificarVagasEncerradas.gs` e `diagnosticarPrimeiroLink.gs` (o botão `+` ao lado de **Arquivos**).
2.  Selecione a função `verificarVagasEncerradas` e clique em **Executar**.
3.  Se o script parar por limite de tempo (~5 min), execute novamente: ele continua pelas linhas que ainda não têm cor.

O verificador espera o **título da vaga na coluna D** e o **link na coluna E**, como no Passo 1.

### Solução de problemas

Se muitas linhas ficarem amarelas, execute `diagnosticarPrimeiroLink` e consulte o resultado em **Execuções**. O código HTTP `429` indica que o LinkedIn está limitando as requisições.

> ⚠️ **Limitações:**
> - O LinkedIn pode bloquear requisições automatizadas (erro 429). Quando isso acontece, a linha fica amarela, que significa "não foi possível verificar" e nunca "vaga aberta".
> - 🟢 verde indica que a página carregou e o título da vaga foi encontrado, mas não garante que a vaga ainda aceite candidaturas. Confira antes de se candidatar.
> - O funcionamento depende dos textos e do comportamento atuais do LinkedIn, que podem mudar sem aviso.
> - A consulta automatizada pode contrariar os termos de uso do LinkedIn. Use por sua conta e risco, com moderação, de preferência de forma manual ou espaçada, e não em um acionador frequente.

## 📈 Status do Projeto

✔️ **Concluído:** O projeto está finalizado e funcional. Não há planos para novas funcionalidades, mas correções de bugs serão bem-vindas.

> ⚠️ **Aviso:** o verificador de vagas encerradas depende de como o LinkedIn responde a requisições automatizadas, algo que está fora do controle deste projeto e pode mudar a qualquer momento. Veja as limitações na seção [Verificador de Vagas Encerradas](#-verificador-de-vagas-encerradas).

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.txt](LICENSE.txt) para mais detalhes.

## ✍️ Autor

**Laís Brum**

[LinkedIn](https://www.linkedin.com/in/lais-brum/) | [GitHub](https://github.com/laisbrme) | [E-mail](mailto:eng.laisbm@gmail.com)