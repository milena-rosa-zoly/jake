var script = {
  modalSections: [
    {
      id: "privacy",
      title: "Sua Privacidade",
      content: `Ao visitar um site, com a ajuda dos cookies, arquivos de internet que armazenam temporariamente seus acessos, armazenamos seu comportamento dentro daquele ambiente. A ideia é que essas informações sejam utilizadas a seu favor, principalmente, para oferecer uma experiência mais personalizada, com produtos e serviços que façam a diferença para você. No entanto, em respeito ao seu direito de privacidade, é possível permitir ou não certos tipos de cookies, que estão disponíveis para você alterar em nossas configurações, a qualquer momento.`,
      menuActive: true,
    },
    {
      id: "essentials",
      title: "Cookies Essenciais",
      content: `Como o título já diz, esses cookies são necessários para o funcionamento do site e não podem ser desativados. Geralmente, são definidos apenas em resposta a suas ações. Por exemplo: solicitação de serviços; definição de preferências de privacidade; acesso ao login e preenchimento de formulários. É possível configurar seu navegador para bloquear ou para alertá-lo sobre esses cookies, mas, ainda assim, em algumas partes do site isso não funcionará. Esses cookies não armazenam informações identificáveis.`,
      menuActive: false,
      hasCookiePolicy: true,
      cookiePolicy: true,
      cookiePolicyAlways: true,
    },
    {
      id: "performance",
      title: "Cookies de Desempenho",
      content: `Com eles, há como contar suas visitas e as fontes de tráfego para mensuração e possíveis ajustes no desempenho do site. Dessa forma, podemos saber quais páginas são mais ou menos relevantes. As informações coletadas por esses cookies são anônimas. Sem habilitar esta opção, não conseguimos saber quando você visitou nosso site e, portanto, não conseguimos monitorar o desempenho.`,
      menuActive: false,
      cookiePolicy: false,
      hasCookiePolicy: true,
    },
    {
      id: "functionality",
      title: "Cookies de Funcionalidade",
      content: `Ao permitir esses cookies, você consegue armazenar suas preferências. Assim, você não precisa inserir seus dados mais de uma vez em um formulário, por exemplo.`,
      menuActive: false,
      cookiePolicy: false,
      hasCookiePolicy: true,
    },
    {
      id: "publicity",
      title: "Cookies de Publicidade",
      content: `Os cookies de publicidade ou segmentação podem ser definidos pelos nossos parceiros publicitários, por meio do nosso site. A partir disso, criam um perfil de seu interesse, mostrando anúncios relevantes em outros sites. Nesse caso, não armazenam informações pessoais diretamente, mas são baseados na identificação exclusiva de seu navegador e dispositivo da internet. Se você não permitir esses cookies, deixará de contar com uma publicidade mais assertiva.`,
      menuActive: false,
      cookiePolicy: false,
      hasCookiePolicy: true,
    },
  ],

  // *** utils ***
  createCookie: function (name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = "; expires=" + date.toGMTString();
    } else {
      var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/;sameSite=strict";
  },

  removeCookie: function (name) {
    document.cookie = name + "=; expires=-1; path=/";
  },

  getCookie: function (cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  findSectionIndexByTitle: function (sectionTitle) {
    var sectionIndex = this.modalSections.findIndex(
      (section) => section.title === sectionTitle
    );
    return sectionIndex;
  },

  findSectionIndexById: function (sectionId) {
    var sectionIndex = this.modalSections.findIndex(
      (section) => section.id === sectionId
    );
    return sectionIndex;
  },

  // *** sections handlers ***
  showActiveSectionContent: function (sectionIndex) {
    var mainContent = document.querySelector("#main-content");
    var section = document.createElement("section");

    var headerContainer = document.createElement("div");
    section.appendChild(headerContainer);
    headerContainer.classList.add("main-content-header-container");

    var title = document.createElement("h3");
    headerContainer.appendChild(title);
    title.innerHTML = this.modalSections[sectionIndex].title;
    if (this.modalSections[sectionIndex].cookiePolicyAlways) {
      var span = document.createElement("span");
      headerContainer.appendChild(span);
      span.innerText = "Sempre ativos";
    }

    if (
      this.modalSections[sectionIndex].hasCookiePolicy &&
      !this.modalSections[sectionIndex].cookiePolicyAlways
    ) {
      var checkbox = document.createElement("input");
      headerContainer.appendChild(checkbox);
      checkbox.type = "checkbox";
      checkbox.checked = this.modalSections[sectionIndex].cookiePolicy;
      checkbox.classList.add("custom-checkbox");

      checkbox.addEventListener("click", (event) => {
        this.modalSections[sectionIndex].cookiePolicy = event.target.checked;
      });
    }

    var paragraph = document.createElement("p");
    section.appendChild(paragraph);
    paragraph.innerHTML = this.modalSections[sectionIndex].content;

    mainContent.innerHTML = "";
    mainContent.append(section);
  },

  activateSection: function (sectionTitle) {
    var sectionIndex = this.findSectionIndexByTitle(sectionTitle);

    this.modalSections.forEach((section, index) => {
      if (index === sectionIndex) {
        section.menuActive = true;
      } else {
        section.menuActive = false;
      }
    });

    this.showActiveSectionContent(sectionIndex);
  },

  updateCookiesPolicies: function () {
    this.removeCookie("zoly_consent");
    var cookiesPolicies = [];
    this.modalSections.forEach((section) => {
      if (section.hasCookiePolicy || section.cookiePolicyAlways) {
        cookiesPolicies.push(`${section.id}:${section.cookiePolicy}`);
      }
    });
    this.createCookie("zoly_consent", JSON.stringify(cookiesPolicies), 30);
  },

  acceptAllCookies: function () {
    this.modalSections.forEach((section) => {
      if (section.hasCookiePolicy) {
        section.cookiePolicy = true;
      }
    });
    this.updateCookiesPolicies();
  },

  cookiesPolicyAlreadyFilled: function () {
    var zolyConsentCookieValues = this.getCookie("zoly_consent");
    if (zolyConsentCookieValues) {
      zolyConsentCookieValues = JSON.parse(zolyConsentCookieValues);

      zolyConsentCookieValues.forEach((cookieValue) => {
        var [sectionId, cookiePolicyValue] = cookieValue.split(":");
        var index = this.findSectionIndexById(sectionId);
        this.modalSections[index].cookiePolicy =
          cookiePolicyValue == "true" ? true : false;
      });

      return true;
    } else {
      return false;
    }
  },

  createZolyCookiePrivacyBarAndModal: function (style) {
    // --------------------------------
    // --- *** cookiePrivacyBar *** ---
    // --------------------------------

    var generalContainer = document.createElement("div");
    generalContainer.id = "general-container";
    document.body.appendChild(generalContainer);

    // bottom bar container
    var cookiesPrivacyContainer = document.createElement("div");
    generalContainer.appendChild(cookiesPrivacyContainer);
    cookiesPrivacyContainer.id = "cookies-privacy";

    // texts container
    var cookiesPrivacyTextsContainer = document.createElement("div");
    cookiesPrivacyTextsContainer.id = "texts-container";
    cookiesPrivacyContainer.appendChild(cookiesPrivacyTextsContainer);

    var cookiesPrivacyTitle = document.createElement("h1");
    cookiesPrivacyTextsContainer.appendChild(cookiesPrivacyTitle);
    cookiesPrivacyTitle.innerHTML = "Cookies e Privacidade";

    var cookiesPrivacyParagraph = document.createElement("p");
    cookiesPrivacyTextsContainer.appendChild(cookiesPrivacyParagraph);
    cookiesPrivacyParagraph.innerHTML = `Com o auxílio dos cookies podemos te conhecer melhor e, assim, recomendar produtos e serviços que sejam do seu interesse. Para saber mais sobre cookies e avaliar nossa Política de Privacidade, é só selecionar suas preferências em Configurar Privacidade.`;

    // buttons container
    var cookiesPrivacyButtonsContainer = document.createElement("div");
    cookiesPrivacyButtonsContainer.id = "buttons-container";
    cookiesPrivacyContainer.appendChild(cookiesPrivacyButtonsContainer);

    var cookiesPrivacyBtnConfig = document.createElement("button");
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnConfig);
    cookiesPrivacyBtnConfig.innerText = "Configurar privacidade";
    cookiesPrivacyBtnConfig.classList.add("btn-light");

    var cookiesPrivacyBtnAcceptAll = document.createElement("button");
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnAcceptAll);
    cookiesPrivacyBtnAcceptAll.innerText = "Aceitar todos os cookies";
    cookiesPrivacyBtnAcceptAll.classList.add("btn-dark");

    // ---------------------
    // --- *** modal *** ---
    // ---------------------
    var modal = document.createElement("div");
    generalContainer.appendChild(modal);
    modal.id = "config-privacy-modal";
    modal.classList.add("modal");

    var modalInner = document.createElement("div");
    modalInner.classList.add("modal-inner");
    modal.appendChild(modalInner);

    var modalTitle = document.createElement("h1");
    modalInner.appendChild(modalTitle);
    modalTitle.innerHTML = "Sua Privacidade";

    var mainSection = document.createElement("div");
    mainSection.id = "main-section";
    modalInner.appendChild(mainSection);

    var menu = document.createElement("nav");
    mainSection.appendChild(menu);

    var btnSuaPrivacidade = document.createElement("button");
    menu.appendChild(btnSuaPrivacidade);
    btnSuaPrivacidade.id = "btn--sua-privacidade";
    btnSuaPrivacidade.type = "button";
    btnSuaPrivacidade.innerText = "Sua Privacidade";
    btnSuaPrivacidade.classList.add("menu-item");
    btnSuaPrivacidade.classList.add("menu-item-active");
    btnSuaPrivacidade.addEventListener("click", (event) => {
      this.activateSection("Sua Privacidade");
      btnSuaPrivacidade.classList.add("menu-item-active");
      btnCookiesEssenciais.classList.remove("menu-item-active");
      btnCookiesDesempenho.classList.remove("menu-item-active");
      btnCookiesFuncionalidade.classList.remove("menu-item-active");
      btnCookiesPublicidade.classList.remove("menu-item-active");
    });

    var btnCookiesEssenciais = document.createElement("button");
    menu.appendChild(btnCookiesEssenciais);
    btnCookiesEssenciais.id = "btn--cookies-essenciais";
    btnCookiesEssenciais.type = "button";
    btnCookiesEssenciais.classList.add("menu-item");
    btnCookiesEssenciais.innerText = "Cookies Essenciais";
    btnCookiesEssenciais.addEventListener("click", (event) => {
      this.activateSection("Cookies Essenciais");
      btnSuaPrivacidade.classList.remove("menu-item-active");
      btnCookiesEssenciais.classList.add("menu-item-active");
      btnCookiesDesempenho.classList.remove("menu-item-active");
      btnCookiesFuncionalidade.classList.remove("menu-item-active");
      btnCookiesPublicidade.classList.remove("menu-item-active");
    });

    var btnCookiesDesempenho = document.createElement("button");
    menu.appendChild(btnCookiesDesempenho);
    btnCookiesDesempenho.id = "btn--cookies-desempenho";
    btnCookiesDesempenho.type = "button";
    btnCookiesDesempenho.classList.add("menu-item");
    btnCookiesDesempenho.innerText = "Cookies de Desempenho";
    btnCookiesDesempenho.addEventListener("click", (event) => {
      this.activateSection("Cookies de Desempenho");
      btnSuaPrivacidade.classList.remove("menu-item-active");
      btnCookiesEssenciais.classList.remove("menu-item-active");
      btnCookiesDesempenho.classList.add("menu-item-active");
      btnCookiesFuncionalidade.classList.remove("menu-item-active");
      btnCookiesPublicidade.classList.remove("menu-item-active");
    });

    var btnCookiesFuncionalidade = document.createElement("button");
    menu.appendChild(btnCookiesFuncionalidade);
    btnCookiesFuncionalidade.id = "btn--cookies-funcionalidade";
    btnCookiesFuncionalidade.type = "button";
    btnCookiesFuncionalidade.classList.add("menu-item");
    btnCookiesFuncionalidade.innerText = "Cookies de Funcionalidade";
    btnCookiesFuncionalidade.addEventListener("click", (event) => {
      this.activateSection("Cookies de Funcionalidade");
      btnSuaPrivacidade.classList.remove("menu-item-active");
      btnCookiesEssenciais.classList.remove("menu-item-active");
      btnCookiesDesempenho.classList.remove("menu-item-active");
      btnCookiesFuncionalidade.classList.add("menu-item-active");
      btnCookiesPublicidade.classList.remove("menu-item-active");
    });

    var btnCookiesPublicidade = document.createElement("button");
    menu.appendChild(btnCookiesPublicidade);
    btnCookiesPublicidade.id = "btn--cookies-publicidade";
    btnCookiesPublicidade.type = "button";
    btnCookiesPublicidade.classList.add("menu-item");
    btnCookiesPublicidade.innerText = "Cookies de Publicidade";
    btnCookiesPublicidade.addEventListener("click", (event) => {
      this.activateSection("Cookies de Publicidade");
      btnSuaPrivacidade.classList.remove("menu-item-active");
      btnCookiesEssenciais.classList.remove("menu-item-active");
      btnCookiesDesempenho.classList.remove("menu-item-active");
      btnCookiesFuncionalidade.classList.remove("menu-item-active");
      btnCookiesPublicidade.classList.add("menu-item-active");
    });

    var mainContent = document.createElement("main");
    mainSection.appendChild(mainContent);
    mainContent.id = "main-content";

    var initialSectionContent = this.modalSections[0];

    var mainSection = document.createElement("section");
    mainContent.appendChild(mainSection);

    var headerContainer = document.createElement("div");
    mainSection.appendChild(headerContainer);
    headerContainer.classList.add("main-content-header-container");

    var mainContentTitle = document.createElement("h3");
    headerContainer.appendChild(mainContentTitle);
    mainContentTitle.innerHTML = initialSectionContent.title;

    var mainContentParagraph = document.createElement("p");
    mainContent.appendChild(mainContentParagraph);
    mainContentParagraph.innerText = initialSectionContent.content;

    var footer = document.createElement("footer");
    modalInner.appendChild(footer);

    var btnSaveConfig = document.createElement("button");
    footer.appendChild(btnSaveConfig);
    btnSaveConfig.id = "btn--save-config";
    btnSaveConfig.innerText = "Salvar configurações";
    btnSaveConfig.classList.add("btn-dark");

    var btnAcceptAll = document.createElement("button");
    footer.appendChild(btnAcceptAll);
    btnAcceptAll.innerText = "Aceitar todos os cookies";
    btnAcceptAll.classList.add("btn-dark");

    // ! actions
    cookiesPrivacyBtnConfig.onclick = function () {
      modal.style.display = "block";
    };

    // bottom bar button
    cookiesPrivacyBtnAcceptAll.onclick = () => {
      this.acceptAllCookies();
      cookiesPrivacyContainer.style.display = "none";
      modal.style.display = "none";
    };

    // modal button
    btnAcceptAll.onclick = () => {
      this.acceptAllCookies();
      cookiesPrivacyContainer.style.display = "none";
      modal.style.display = "none";
    };

    btnSaveConfig.onclick = () => {
      this.updateCookiesPolicies();
      cookiesPrivacyContainer.style.display = "none";
      modal.style.display = "none";
    };

    document.addEventListener("keyup", function (event) {
      if (event.key == "Escape" && modal.style.display == "block") {
        modal.style.display = "none";
      }
    });
  },

  init: function () {
    var style = document.createElement("style");
    style.innerHTML = `
      #general-container {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        outline: none;
        z-index: 10000;
      }

      #general-container {
        font-family: Arial, sans-serif;
      }
      
      #cookies-privacy {
        align-items: center;
        background: #f2f2f2;
        bottom: 0;
        display: flex;
        font-family: Roboto, sans-serif;
        left: 0;
        padding: 16px;
        position: fixed;
        right: 0;
        z-index: 10000;
      }
      
      #cookies-privacy #texts-container {
        width: 75%;
      }
      
      #cookies-privacy #texts-container h1 {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      
      #cookies-privacy #texts-container p {
        max-width: 1100px;
      }
      
      #cookies-privacy #buttons-container {
        display: flex;
        width: 25%;
      }
      
      #cookies-privacy .btn-light {
        align-items: center;
        background: #fff;
        border: 1px solid #211451;
        border-radius: 4px;
        color: #211451;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        min-height: 40px;
        justify-content: center;
        margin: 10px;
        padding: 16px;
        transition: background 0.2s;
        width: 200px;
      }
      #cookies-privacy .btn-light:hover {
        background: rgba(33, 20, 81, 0.2);
      }
      
      #cookies-privacy .btn-dark,
      #config-privacy-modal .modal-inner footer .btn-dark {
        align-items: center;
        background: #211451;
        border: 1px solid #fff;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        min-height: 40px;
        justify-content: center;
        margin: 10px;
        padding: 16px;
        transition: background 0.2s;
        width: 200px;
      }
      #cookies-privacy .btn-dark:hover,
      #config-privacy-modal .modal-inner footer .btn-dark:hover {
        background: rgba(33, 20, 81, 0.8);
      }
      
      #config-privacy-modal * {
        box-sizing: border-box;
        margin: 0;
        outline: 0;
        padding: 0;
      }
      
      #config-privacy-modal.modal {
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
        bottom: 0;
        display: none;
        height: 100%;
        left: 0;
        overflow: auto;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1;
      }
      
      #config-privacy-modal .modal-inner {
        background: rgba(255, 255, 255);
        border: 1px solid #888;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0), 0 7px 14px 0 rgba(50, 50, 93, 0.1);
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 960px;
        max-width: 80%;
        height: 580px;
        max-height: 60%;
      }
      
      #config-privacy-modal .modal-inner h1 {
        align-items: center;
        border-bottom: 1px solid #ccc;
        color: #333;
        display: flex;
        font-family: Arial, sans-serif;
        font-size: 32px;
        font-weight: 700;
        height: 80px;
        justify-content: center;
        padding: 20px 0;
        text-align: center;
        width: 100%;
      }
      
      #main-section {
        display: flex;
        flex-direction: row;
        font-family: Roboto, sans-serif;
        height: calc(100% - 160px);
        overflow: auto;
      }
      
      #main-section nav {
        display: flex;
        flex-direction: column;
        max-width: 260px;
      }
      
      #main-section nav .menu-item {
        background: transparent;
        border: 0;
        border-left: 5px solid transparent;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        font-family: Roboto, sans-serif;
        font-size: 16px;
        font-weight: bold;
        height: 50px;
        padding: 10px 20px;
        text-align: left;
        transition: background 0.3s;
        width: 100%;
      }
      #main-section nav .menu-item:hover {
        background: rgba(33, 20, 81, 0.2);
      }
      #main-section nav .menu-item.menu-item-active {
        border-left: 5px solid #211451;
      }
      
      #main-section main {
        border-left: 1px solid #ccc;
        flex: 1;
        padding: 24px;
      }
      
      #main-content main h3 {
        font-size: 20px;
        font-weight: 700;
      }
      
      #main-content .main-content-header-container {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin-bottom: 36px;
      }
      
      #main-content .main-content-header-container span {
        color: #211451;
        font-size: 20px;
      }
      
      #main-content .main-content-header-container .custom-checkbox {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: #ddd;
        border-radius: 3em;
        cursor: pointer;
        font-size: 16px;
        height: 1.5em;
        outline: none;
        position: relative;
        -webkit-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
        width: 3.5em;
      }
      
      #main-content .main-content-header-container .custom-checkbox:checked {
        background: #211451;
      }
      
      #main-content .main-content-header-container .custom-checkbox:after {
        background: #fff;
        border-radius: 50%;
        -webkit-box-shadow: 0 0 0.25em rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 0.25em rgba(0, 0, 0, 0.3);
        content: "";
        height: 1.5em;
        left: 0;
        position: absolute;
        -webkit-transform: scale(0.7);
        transform: scale(0.7);
        -webkit-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
        width: 1.5em;
      }
      
      #main-content .main-content-header-container .custom-checkbox:checked:after {
        left: calc(100% - 1.5em);
      }
      
      #config-privacy-modal .modal-inner footer {
        align-items: center;
        border-top: 1px solid #ccc;
        display: flex;
        height: 80px;
        justify-content: center;
      }
      
      @media screen and (max-width: 1200px) {
        #buttons-container {
          flex-direction: column;
        }
      }
      
    `;
    document.head.appendChild(style);

    if (!this.cookiesPolicyAlreadyFilled()) {
      this.createZolyCookiePrivacyBarAndModal(style);
    }
  },
};

(function (window, document) {
  script.init();
})(window, document);
