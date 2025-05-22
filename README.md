# CRM de Beneficiários - Frontend Simples
## ✨ Funcionalidades

* **Listagem de Beneficiários:** Exibe os beneficiários cadastrados em uma tabela responsiva.
* **Adicionar Beneficiário:** Permite o cadastro de novos beneficiários através de um formulário modal.
* **Editar Beneficiário:** Permite a edição dos dados de um beneficiário existente através de um formulário modal pré-preenchido.
* **Excluir Beneficiário:** Permite a remoção de um beneficiário da base de dados.
* **Interface Moderna:** Estilização limpa e moderna utilizando CSS puro.
* **Interação Dinâmica:** Operações CRUD realizadas sem recarregamento da página, utilizando JavaScript "cru" (vanilla JS) para chamadas à API.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica da aplicação.
* **CSS3:** Estilização e design responsivo.
    * Google Material Icons Sharp (para ícones).
    * Google Fonts (Roboto).
* **JavaScript (Vanilla JS):** Lógica do cliente, manipulação do DOM, chamadas à API (usando `Workspace`) e interatividade.

## 📁 Estrutura do Projeto

* `index.html`: Arquivo principal contendo a estrutura HTML da página.
* `style.css`: Folha de estilos para todos os elementos visuais da aplicação.
* `script.js`: Contém toda a lógica JavaScript para:
    * Buscar e exibir beneficiários.
    * Abrir e fechar o modal de formulário.
    * Validar e submeter o formulário para criar/editar beneficiários.
    * Enviar requisições para excluir beneficiários.
    * Atualizar a interface do usuário dinamicamente.

## 🚀 Configuração e Uso

1.  **Clone ou baixe este repositório:**
    ```bash
    git clone https://SUA_URL_DO_REPOSITORIO_AQUI.git
    cd nome-do-diretorio-do-frontend
    ```
2.  **Backend API:**
    Este é apenas o frontend. Certifique-se de que você tem um **backend API rodando** que responda às seguintes requisições na base URL configurada (por padrão, `/Beneficiarios`):
    * `GET /Beneficiarios` - Para listar todos os beneficiários.
    * `GET /Beneficiarios/{id}` - Para obter um beneficiário específico.
    * `POST /Beneficiarios` - Para criar um novo beneficiário.
    * `PUT /Beneficiarios/{id}` - Para atualizar um beneficiário existente.
    * `DELETE /Beneficiarios/{id}` - Para excluir um beneficiário.

3.  **Configurar URL da API:**
    Abra o arquivo `script.js` e atualize a constante `apiUrl` para a URL base correta da sua API backend:
    ```javascript
    const apiUrl = 'http://localhost:8080/Beneficiarios'; // Exemplo: ajuste conforme necessário
    ```
    Certifique-se também que seu backend está configurado para aceitar requisições desta origem (CORS).

4.  **Abrir no Navegador:**
    Abra o arquivo `index.html` diretamente no seu navegador web.

## 📝 Campos do Beneficiário

O sistema atualmente gerencia os seguintes campos para cada beneficiário:
* ID (gerado automaticamente)
* Nome
* CPF
* Matrícula
* Email
* Telefone
* Plano
* Data de Nascimento
* Endereço

## 🔮 Possíveis Melhorias Futuras

* Implementar paginação para a lista de beneficiários.
* Adicionar funcionalidade de busca e filtros.
* Validação de formulário mais robusta no frontend.
* Melhorar o feedback visual para o usuário (ex: toasts para sucesso/erro).
* Testes unitários e de integração.

---
