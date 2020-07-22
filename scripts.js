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
    headerContainer.style.display = "flex";
    headerContainer.style.alignItems = "center";
    headerContainer.style.justifyContent = "space-between";
    headerContainer.style.marginBottom = "36px";

    var title = document.createElement("h3");
    headerContainer.appendChild(title);
    title.innerHTML = this.modalSections[sectionIndex].title;
    title.style.fontSize = "20px";

    if (this.modalSections[sectionIndex].cookiePolicyAlways) {
      var span = document.createElement("span");
      headerContainer.appendChild(span);
      span.innerText = "Sempre ativos";
      span.style.fontSize = "20px";
      span.style.fontFamily = "Roboto, sans-serif";
      span.style.color = "#211451";
    }

    if (
      this.modalSections[sectionIndex].hasCookiePolicy &&
      !this.modalSections[sectionIndex].cookiePolicyAlways
    ) {
      var checkbox = document.createElement("input");
      headerContainer.appendChild(checkbox);
      checkbox.type = "checkbox";
      checkbox.checked = this.modalSections[sectionIndex].cookiePolicy;

      checkbox.addEventListener("click", (event) => {
        this.modalSections[sectionIndex].cookiePolicy = event.target.checked;
        console.log(this.modalSections);
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
        console.log(cookiesPolicies);
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
    var cookiesPrivacyDiv = document.createElement("div");
    document.body.appendChild(cookiesPrivacyDiv);
    cookiesPrivacyDiv.id = "cookies-privacy";

    style.sheet.insertRule(
      `#cookies-privacy { align-items: center; background: #f2f2f2; bottom: 0; display: flex; font-family: Roboto, sans-serif; padding: 16px; position: fixed; width: 100%; z-index: 10; }`
    );
    style.sheet.insertRule(`#cookies-privacy h1 { margin-bottom: 8px; }`);
    style.sheet.insertRule(`#cookies-privacy p { max-width: 1100px; }`);

    var cookiesPrivacyContent = document.createElement("div");
    cookiesPrivacyDiv.appendChild(cookiesPrivacyContent);

    var cookiesPrivacyTitle = document.createElement("h1");
    cookiesPrivacyContent.appendChild(cookiesPrivacyTitle);
    cookiesPrivacyTitle.style.marginBottom = "8px";
    cookiesPrivacyTitle.innerHTML = "Cookies e Privacidade";

    var cookiesPrivacyParagraph = document.createElement("p");
    cookiesPrivacyContent.appendChild(cookiesPrivacyParagraph);
    cookiesPrivacyParagraph.style.maxWidth = "1100px";
    cookiesPrivacyParagraph.innerHTML = `Com o auxílio dos cookies podemos te conhecer melhor e, assim, recomendar produtos e serviços que sejam do seu interesse. Para saber mais sobre cookies e avaliar nossa Política de Privacidade, é só selecionar suas preferências em Configurar Privacidade.`;

    var cookiesPrivacyButtonsContainer = document.createElement("div");
    cookiesPrivacyDiv.appendChild(cookiesPrivacyButtonsContainer);
    cookiesPrivacyButtonsContainer.style.marginLeft = "48px";

    var cookiesPrivacyBtnConfig = document.createElement("button");
    cookiesPrivacyBtnConfig.classList.add("btn-light");
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnConfig);
    cookiesPrivacyBtnConfig.innerText = "Configurar privacidade";
    style.sheet.insertRule(
      ".btn-light { background: #fff; border: 1px solid #211451; border-radius: 4px; color: #211451; padding: 16px; transition: background 0.2s; width: 200px; }"
    );
    style.sheet.insertRule(
      ".btn-light:hover { background: rgba(33, 20, 81, 0.2); }"
    );

    var cookiesPrivacyBtnAcceptAll = document.createElement("button");
    cookiesPrivacyBtnAcceptAll.classList.add("btn-dark");
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnAcceptAll);
    cookiesPrivacyBtnAcceptAll.innerText = "Aceitar todos os cookies";
    cookiesPrivacyBtnAcceptAll.style.marginLeft = "16px";

    style.sheet.insertRule(
      ".btn-dark { background: #211451; border: 1px solid #fff; border-radius: 4px; color: #fff; padding: 16px; transition: background 0.2s; width: 200px; }"
    );
    style.sheet.insertRule(
      ".btn-dark:hover { background: rgba(33, 20, 81, 0.8); }"
    );

    // ---------------------
    // --- *** modal *** ---
    // ---------------------
    var modal = document.createElement("div");
    document.body.appendChild(modal);
    modal.id = "config-privacy";
    modal.classList.add("modal");
    style.sheet.insertRule(
      ".modal { background-color: rgb(0, 0, 0); background-color: rgba(0, 0, 0, 0.4); display: none; height: 100%; left: 0; overflow: auto; position: fixed; top: 0; width: 100%; z-index: 1; }"
    );

    var modalInner = document.createElement("div");
    modalInner.classList.add("modal-inner");
    modal.appendChild(modalInner);
    style.sheet.insertRule(
      ".modal-inner { background: rgba(255, 255, 255, 0.8); border: 1px solid #888; border-radius: 4px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0), 0 7px 14px 0 rgba(50, 50, 93, 0.1); height: 580px; left: calc(50% - 480px); position: fixed; top: calc(50% - 290px); width: 960px; }"
    );

    var modalTitle = document.createElement("h1");
    modalInner.appendChild(modalTitle);
    modalTitle.innerHTML = "Sua Privacidade";
    style.sheet.insertRule(
      ".modal-inner h1 { border-bottom: 1px solid #ccc; color: #333; font-family: Roboto, sans-serif; font-size: 32px; height: 80px; padding: 20px 0; text-align: center; width: 100%; }"
    );

    var modalContent = document.createElement("div");
    modalContent.id = "modal-content";
    modalInner.appendChild(modalContent);
    style.sheet.insertRule(
      "#modal-content { display: flex; flex-direction: row; font-family: Roboto, sans-serif; height: 420px; }"
    );

    var menu = document.createElement("nav");
    modalContent.appendChild(menu);
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.maxWidth = "240px";

    style.sheet.insertRule(
      ".menu-item { background: transparent; border: 0; border-bottom: 1px solid #ccc; font-family: Roboto, sans-serif; font-size: 16px; height: 50px; font-weight: bold; padding: 10px 20px; text-align: left; transition: background 0.5s; width: 240px; }"
    );
    style.sheet.insertRule(
      ".menu-item:hover { background: rgba(33, 20, 81, 0.2); }"
    );

    var btnSuaPrivacidade = document.createElement("button");
    menu.appendChild(btnSuaPrivacidade);
    btnSuaPrivacidade.id = "btn--sua-privacidade";
    btnSuaPrivacidade.type = "button";
    btnSuaPrivacidade.classList.add("menu-item");
    btnSuaPrivacidade.classList.add("menu-item-active");
    btnSuaPrivacidade.innerText = "Sua Privacidade";
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
    modalContent.appendChild(mainContent);
    mainContent.id = "main-content";
    style.sheet.insertRule(
      "#modal-content main { border-left: 1px solid #ccc; flex: 1; padding: 24px; }"
    );

    var initialSectionContent = this.modalSections[0];

    var mainContentTitle = document.createElement("h3");
    mainContent.appendChild(mainContentTitle);
    mainContentTitle.innerText = initialSectionContent.title;
    mainContentTitle.style.fontSize = "20px";
    mainContentTitle.style.marginBottom = "36px";

    var mainContentParagraph = document.createElement("p");
    mainContent.appendChild(mainContentParagraph);
    mainContentParagraph.innerText = initialSectionContent.content;

    var footer = document.createElement("footer");
    modalInner.appendChild(footer);
    style.sheet.insertRule(
      ".modal-inner footer { align-items: center; border-top: 1px solid #ccc; display: flex; height: 80px; justify-content: center; }"
    );

    var btnSaveConfig = document.createElement("button");
    footer.appendChild(btnSaveConfig);
    btnSaveConfig.id = "btn--save-config";
    btnSaveConfig.innerText = "Salvar configurações";
    btnSaveConfig.classList.add("btn-dark");

    var btnAcceptAll = document.createElement("button");
    footer.appendChild(btnAcceptAll);
    btnAcceptAll.innerText = "Aceitar todos os cookies";
    btnAcceptAll.classList.add("btn-dark");
    btnAcceptAll.style.marginLeft = "32px";

    // ! actions
    cookiesPrivacyBtnConfig.onclick = function () {
      modal.style.display = "block";
    };

    // bar button
    cookiesPrivacyBtnAcceptAll.onclick = () => {
      this.acceptAllCookies();
      cookiesPrivacyDiv.style.display = "none";
      modal.style.display = "none";
    };

    // modal button
    btnAcceptAll.onclick = () => {
      this.acceptAllCookies();
      cookiesPrivacyDiv.style.display = "none";
      modal.style.display = "none";
    };

    btnSaveConfig.onclick = () => {
      this.updateCookiesPolicies();
      cookiesPrivacyDiv.style.display = "none";
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
      * {
        margin: 0;
        padding: 0;
        outline: none;
      }

      html,
      body {
        box-sizing: border-box;
        height: 100%; /* pass down for min-height*/
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      button {
        cursor: pointer;
      }

      input[type="checkbox"] {
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
      
      input[type="checkbox"]:checked {
        background: #211451;
      }
      
      input[type="checkbox"]:after {
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
      
      input[type="checkbox"]:checked:after {
        left: calc(100% - 1.5em);
      }

      .menu-item-active { 
        border-left: 5px solid #211451;
        
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
