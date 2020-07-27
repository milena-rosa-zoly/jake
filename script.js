var script = {
  cookiesCategories: [
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
    var sectionIndex = this.cookiesCategories.findIndex(
      (section) => section.title === sectionTitle
    );
    return sectionIndex;
  },

  findSectionIndexById: function (sectionId) {
    var sectionIndex = this.cookiesCategories.findIndex(
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
    title.innerHTML = this.cookiesCategories[sectionIndex].title;
    if (this.cookiesCategories[sectionIndex].cookiePolicyAlways) {
      var span = document.createElement("span");
      headerContainer.appendChild(span);
      span.innerText = "Sempre ativos";
    }

    if (
      this.cookiesCategories[sectionIndex].hasCookiePolicy &&
      !this.cookiesCategories[sectionIndex].cookiePolicyAlways
    ) {
      var checkbox = document.createElement("input");
      headerContainer.appendChild(checkbox);
      checkbox.type = "checkbox";
      checkbox.checked = this.cookiesCategories[sectionIndex].cookiePolicy;
      checkbox.classList.add("custom-checkbox");

      checkbox.addEventListener("click", (event) => {
        this.cookiesCategories[sectionIndex].cookiePolicy =
          event.target.checked;
      });
    }

    var paragraph = document.createElement("p");
    section.appendChild(paragraph);
    paragraph.innerHTML = this.cookiesCategories[sectionIndex].content;

    mainContent.innerHTML = "";
    mainContent.appendChild(section);
  },

  activateSection: function (sectionTitle) {
    var sectionIndex = this.findSectionIndexByTitle(sectionTitle);

    this.cookiesCategories.forEach((section, index) => {
      section.menuActive = index === sectionIndex;
    });

    this.showActiveSectionContent(sectionIndex);
  },

  updateCookiesPolicies: function () {
    this.removeCookie("zoly_consent");

    var cookiesPolicies = {};
    this.cookiesCategories.forEach((section) => {
      if (section.hasCookiePolicy || section.cookiePolicyAlways) {
        cookiesPolicies[section.id] = section.cookiePolicy;
      }
    });

    this.createCookie("zoly_consent", JSON.stringify(cookiesPolicies), 30);
  },

  acceptAllCookies: function () {
    this.cookiesCategories.forEach((section) => {
      if (section.hasCookiePolicy) {
        section.cookiePolicy = true;
      }
    });
    this.updateCookiesPolicies();
  },

  cookiesPolicyAlreadyFilled: function () {
    var zolyConsentCookieValues = this.getCookie("zoly_consent");

    if (zolyConsentCookieValues) {
      zolyConsentCookieValues = Object.entries(
        JSON.parse(zolyConsentCookieValues)
      );

      zolyConsentCookieValues.forEach((cookieValue) => {
        var [sectionId, cookiePolicyValue] = cookieValue;
        var index = this.findSectionIndexById(sectionId);
        this.cookiesCategories[index].cookiePolicy = cookiePolicyValue;
      });

      return true;
    }

    return false;
  },

  openModal: function () {
    const modal = document.querySelector("#config-privacy-modal");
    modal.style.display = "block";
  },

  closeModal: function () {
    const modal = document.querySelector("#config-privacy-modal");
    if (modal) {
      modal.style.display = "none";
    }
  },

  createZolyCookiePrivacyModal: function () {
    var generalContainer = document.querySelector("#general-container");

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

    // it shows the first section
    var initialSectionContent = this.cookiesCategories[0];

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
    btnSaveConfig.innerText = "Salvar configurações";
    btnSaveConfig.classList.add("btn-dark");

    var btnAcceptAll = document.createElement("button");
    footer.appendChild(btnAcceptAll);
    btnAcceptAll.innerText = "Aceitar todos os cookies";
    btnAcceptAll.classList.add("btn-dark");

    btnAcceptAll.onclick = () => {
      this.acceptAllCookies();
      this.closeModal();
      generalContainer.innerHTML = "";
      this.createZolyCookiePrivacyButton();
    };

    btnSaveConfig.onclick = () => {
      this.updateCookiesPolicies();
      this.closeModal();
      generalContainer.innerHTML = "";
      this.createZolyCookiePrivacyButton();
    };

    document.addEventListener("keyup", (event) => {
      if (event.key == "Escape" && modal.style.display == "block") {
        this.closeModal();
        this.createZolyCookiePrivacyButton();
      }
    });
  },

  createZolyCookiePrivacyBar: function () {
    var generalContainer = document.querySelector("#general-container");

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

    this.createZolyCookiePrivacyModal();

    cookiesPrivacyBtnConfig.onclick = () => {
      this.openModal();
    };

    cookiesPrivacyBtnAcceptAll.onclick = () => {
      this.acceptAllCookies();
      cookiesPrivacyContainer.style.display = "none";
      this.closeModal();
      this.createZolyCookiePrivacyButton();
    };
  },

  createZolyCookiePrivacyButton: function () {
    var generalContainer = document.querySelector("#general-container");

    var zolyCookiePrivacyBtn = document.createElement("button");
    generalContainer.appendChild(zolyCookiePrivacyBtn);
    zolyCookiePrivacyBtn.id = "btn-cookie-privacy";
    zolyCookiePrivacyBtn.type = "button";
    zolyCookiePrivacyBtn.innerHTML =
      "<img src='https://cdn.statically.io/gh/milena-rosa-zoly/jake/master/assets/keyhole-privacy.svg' alt='Alterar opções de cookies e privacidade' />";

    zolyCookiePrivacyBtn.onclick = () => {
      this.createZolyCookiePrivacyModal();
      this.openModal();
    };
  },

  init: function () {
    var style = document.createElement("link");
    style.href =
      "https://cdn.statically.io/gh/milena-rosa-zoly/jake/master/styles.css";
    style.rel = "stylesheet";
    document.head.appendChild(style);

    var generalContainer = document.createElement("div");
    generalContainer.id = "general-container";
    document.body.appendChild(generalContainer);

    // user's not filled the cookies policies. the bar is showed.
    if (!this.cookiesPolicyAlreadyFilled()) {
      this.createZolyCookiePrivacyBar();
    } else {
      // user has already filled the cookies policies at least once.
      this.createZolyCookiePrivacyButton();
    }
  },
};

(function (window, document) {
  script.init();
})(window, document);
