var zoly_consent = {
  args: {},

  cookiesCategories: {},

  bottomBarTexts: {},

  modalTexts: {},

  init(args) {
    var cssLink = document.createElement('link');
    var style = document.createElement('style');
    var wrapper = document.createElement('div');

    this.args = args;
    this.cookiesCategories = this.getCustomCookieCategoriesInfos(args.texts);
    this.bottomBarTexts = this.getCustomBottomBarTexts(args.texts);
    this.modalTexts = this.getCustomModalTexts(args.texts);

    const { colors, fontFamily } = this.args;
    style.innerHTML = this.setCustomProperties({ colors, fontFamily });
    document.head.appendChild(style);

    cssLink.href = './styles.css';
    // 'https://cdn.statically.io/gh/milena-rosa-zoly/jake/master/styles.css?dev=4';
    cssLink.rel = 'stylesheet';
    document.head.appendChild(cssLink);

    wrapper.id = 'wrapper';
    document.body.appendChild(wrapper);

    // user's not filled the cookies policies. the bar is showed.
    if (!this.cookiesPolicyAlreadyFilled()) {
      this.createZolyCookiePrivacyBottomBar();
    } else {
      // user has already filled the cookies policies at least once.
      this.createZolyCookiePrivacyButton();
    }
  },

  // *** utils ***
  createCookie(name, value, days) {
    var date = new Date();
    var expires = '';
    if (days) {
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toGMTString()}`;
    }

    document.cookie = `${name}=${value}${expires}; path=/; sameSite=strict`;
  },

  removeCookie(name) {
    document.cookie = `${name}=; expires=-1; path=/`;
  },

  getCookie(cookieName) {
    var name = `${cookieName}=`;
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },

  // *** sections handlers ***
  createTab() {
    var categoriesIds = Object.keys(this.cookiesCategories);

    var mainSection = document.querySelector('#main-section');

    categoriesIds.forEach((id) => {
      const section = document.createElement('section');

      const menuOption = document.createElement('input');
      const menuLabel = document.createElement('label');

      const sectionArticle = document.createElement('article');

      const headerContainer = document.createElement('div');
      const cookiePolicyTitle = document.createElement('h3');

      const cookiePolicyText = document.createElement('p');

      section.appendChild(menuOption);
      section.appendChild(menuLabel);
      section.appendChild(sectionArticle);

      sectionArticle.appendChild(headerContainer);
      sectionArticle.appendChild(cookiePolicyText);

      headerContainer.appendChild(cookiePolicyTitle);

      section.id = `section-${id}`;

      menuOption.type = 'radio';
      menuOption.name = 'sections';
      menuOption.id = `option-${id}`;
      if (id === 'privacy') {
        menuOption.checked = true;
      }

      menuLabel.htmlFor = `option-${id}`;
      menuLabel.textContent = this.cookiesCategories[id].title;

      headerContainer.classList.add('content-header');
      cookiePolicyTitle.innerHTML = this.cookiesCategories[id].title;

      // cookiePolicyAlways => show text
      if (this.cookiesCategories[id].cookiePolicyAlways) {
        const alwaysActiveText = document.createElement('span');
        headerContainer.appendChild(alwaysActiveText);
        alwaysActiveText.innerText = this.modalTexts.alwaysActiveCookies;
      }

      // hasCookiePolicy && !cookiePolicyAlways => show checkbox
      if (
        this.cookiesCategories[id].hasCookiePolicy &&
        !this.cookiesCategories[id].cookiePolicyAlways
      ) {
        const hasCookiePolicyCheckbox = document.createElement('input');
        headerContainer.appendChild(hasCookiePolicyCheckbox);
        hasCookiePolicyCheckbox.type = 'checkbox';
        hasCookiePolicyCheckbox.checked = this.cookiesCategories[
          id
        ].cookiePolicy;
        hasCookiePolicyCheckbox.classList.add('custom-checkbox');

        hasCookiePolicyCheckbox.addEventListener('click', (event) => {
          this.cookiesCategories[id].cookiePolicy = event.target.checked;
        });
      }

      cookiePolicyText.innerHTML = this.cookiesCategories[id].content;

      mainSection.appendChild(section);
    });
  },

  updateCookiesPolicies() {
    var categoriesIds = Object.keys(this.cookiesCategories);
    var cookiesPolicies = {};

    this.removeCookie('zoly_consent');

    categoriesIds.forEach((id) => {
      if (
        this.cookiesCategories[id].hasCookiePolicy ||
        this.cookiesCategories[id].cookiePolicyAlways
      ) {
        cookiesPolicies[id] = this.cookiesCategories[id].cookiePolicy;
      }
    });

    this.createCookie('zoly_consent', JSON.stringify(cookiesPolicies), 30);
  },

  acceptAllCookies() {
    var categoriesIds = Object.keys(this.cookiesCategories);

    categoriesIds.forEach((id) => {
      if (this.cookiesCategories[id].hasCookiePolicy) {
        this.cookiesCategories[id].cookiePolicy = true;
      }
    });

    this.updateCookiesPolicies();
  },

  cookiesPolicyAlreadyFilled() {
    var zolyConsentCookieValues = this.getCookie('zoly_consent');

    if (zolyConsentCookieValues) {
      zolyConsentCookieValues = Object.entries(
        JSON.parse(zolyConsentCookieValues),
      );

      zolyConsentCookieValues.forEach((cookieValue) => {
        var [sectionId, cookiePolicyValue] = cookieValue;
        this.cookiesCategories[sectionId].cookiePolicy = cookiePolicyValue;
      });

      return true;
    }

    return false;
  },

  openModal() {
    var modal = document.querySelector('#config-privacy-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  },

  closeModal() {
    var modal = document.querySelector('#config-privacy-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  //  <wrapper>
  //    <modal>
  //      <modalInner>
  //        <title />
  //        <mainSection>
  //          <section>
  //            <radioButton />
  //            <radioButtonsLabel />
  //            <article>
  //              <contentHeader>
  //                <title />
  //                <checkbox? />
  //              </contentHeader>
  //              <paragraph />
  //            </article>
  //          </section>
  //          <section />
  //          <section />
  //          <section />
  //          <section />
  //        </mainSection>
  //      </modalInner>
  //    </modal>
  //  </wrapper>
  createZolyCookiePrivacyModal() {
    var wrapper = document.querySelector('#wrapper');
    var modal = document.createElement('div');
    var modalInner = document.createElement('div');

    var modalTitle = document.createElement('h1');

    var mainSection = document.createElement('main');

    var footer = document.createElement('footer');
    var btnSaveConfig = document.createElement('button');
    var btnAcceptAll = document.createElement('button');

    wrapper.appendChild(modal);

    modal.appendChild(modalInner);
    modal.id = 'config-privacy-modal';
    modal.classList.add('modal');

    modalInner.appendChild(modalTitle);
    modalInner.appendChild(mainSection);
    modalInner.appendChild(footer);
    modalInner.classList.add('modal-inner');

    mainSection.id = 'main-section';

    this.createTab();

    footer.appendChild(btnSaveConfig);
    footer.appendChild(btnAcceptAll);

    modalTitle.innerHTML = this.modalTexts.modalTitle;

    btnSaveConfig.innerText = 'Salvar configurações';
    btnSaveConfig.classList.add('btn-dark');

    btnAcceptAll.innerText = 'Aceitar todos os cookies';
    btnAcceptAll.classList.add('btn-dark');

    btnAcceptAll.onclick = () => {
      this.acceptAllCookies();
      this.closeModal();
      wrapper.innerHTML = '';
      this.createZolyCookiePrivacyButton();
    };

    btnSaveConfig.onclick = () => {
      this.updateCookiesPolicies();
      this.closeModal();
      wrapper.innerHTML = '';
      this.createZolyCookiePrivacyButton();
    };

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'block') {
        this.closeModal();
        this.createZolyCookiePrivacyButton();
      }
    });
  },

  createZolyCookiePrivacyBottomBar() {
    var wrapper = document.querySelector('#wrapper');
    var cookiesPrivacyBottomBar = document.createElement('div');

    var cookiesPrivacyTextsContainer = document.createElement('div');
    var cookiesPrivacyTitle = document.createElement('h1');
    var cookiesPrivacyParagraph = document.createElement('p');
    var cookiesPolicyLink = document.createElement('a');

    var cookiesPrivacyButtonsContainer = document.createElement('div');
    var cookiesPrivacyBtnConfig = document.createElement('button');
    var cookiesPrivacyBtnAcceptAll = document.createElement('button');

    wrapper.appendChild(cookiesPrivacyBottomBar);
    cookiesPrivacyBottomBar.appendChild(cookiesPrivacyTextsContainer);
    cookiesPrivacyTextsContainer.appendChild(cookiesPrivacyTitle);
    cookiesPrivacyTextsContainer.appendChild(cookiesPrivacyParagraph);
    cookiesPrivacyTextsContainer.appendChild(cookiesPolicyLink);
    cookiesPrivacyBottomBar.appendChild(cookiesPrivacyButtonsContainer);
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnConfig);
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnAcceptAll);

    cookiesPrivacyBottomBar.id = 'cookies-privacy-bottom-bar';

    // texts container
    cookiesPrivacyTextsContainer.id = 'bottom-bar-texts-container';

    cookiesPrivacyTitle.innerHTML = this.bottomBarTexts.cookiesPrivacyTitle;
    cookiesPrivacyParagraph.innerHTML = this.bottomBarTexts.cookiesPrivacyParagraph;
    cookiesPolicyLink.href = this.bottomBarTexts.cookiesPolicyLink;
    cookiesPolicyLink.innerHTML = this.bottomBarTexts.cookiesPolicyLinkText;

    // buttons container
    cookiesPrivacyButtonsContainer.id = 'bottom-bar-buttons-container';

    cookiesPrivacyBtnConfig.innerText = this.bottomBarTexts.cookiesPrivacyBtnConfig;
    cookiesPrivacyBtnConfig.classList.add('btn-light');

    cookiesPrivacyBtnAcceptAll.innerText = this.bottomBarTexts.cookiesPrivacyBtnAcceptAll;
    cookiesPrivacyBtnAcceptAll.classList.add('btn-dark');

    this.createZolyCookiePrivacyModal();

    cookiesPrivacyBtnConfig.onclick = () => {
      this.openModal();
    };

    cookiesPrivacyBtnAcceptAll.onclick = () => {
      // hide bottom bar and create the button that opens the modal.
      this.acceptAllCookies();
      cookiesPrivacyBottomBar.style.display = 'none';
      this.closeModal();
      this.createZolyCookiePrivacyButton();
    };
  },

  createZolyCookiePrivacyButton() {
    var wrapper = document.querySelector('#wrapper');
    var zolyCookiePrivacyBtn = document.createElement('button');

    wrapper.appendChild(zolyCookiePrivacyBtn);
    zolyCookiePrivacyBtn.id = 'btn-cookie-privacy';
    zolyCookiePrivacyBtn.type = 'button';
    zolyCookiePrivacyBtn.innerHTML = `<img src='${
      this.args.buttonImage ||
      'https://cdn.statically.io/gh/milena-rosa-zoly/jake/459e3d8a/assets/keyhole-privacy.png'
    }' alt='Alterar opções de cookies e privacidade />`;

    zolyCookiePrivacyBtn.onclick = () => {
      this.createZolyCookiePrivacyModal();
      this.openModal();
    };
  },

  setCustomProperties({ colors, fontFamily }) {
    return `
      :root {
        --font-family: ${fontFamily || "'Arial', 'sans-serif'"};

        --bottom-bar-background: ${colors.bottomBarBackground || '#f2f2f2'};

        --light-button-background: ${colors.lightButtonBackground || '#fff'};
        --light-button-foreground: ${colors.lightButtonForeground || '#000'};
        --light-button-hover-background: ${
          colors.lightButtonHoverBackground || 'rgba(0, 0, 0, 0.2)'
        };
        --dark-button-background: ${colors.darkButtonBackground || '#000'};
        --dark-button-hover-background: ${
          colors.darkButtonHoverBackground || 'rgba(0, 0, 0, 0.75)'
        };
        --dark-button-foreground: ${colors.darkButtonForeground || '#fff'};

        --modal-background: ${colors.modalBackground || '#fff'};
        --modal-foreground: ${colors.modalForeground || '#333'};
        --modal-border: ${colors.modalBorder || '#888'};
        --menu-item-hover-background: ${
          colors.menuItemHoverBackground || 'rgba(0, 0, 0, 0.2)'
        };
        --menu-item-foreground: ${colors.menuItemForeground || '#333'};
        --menu-checked-item-background: ${
          colors.menuCheckedItemBackground || '#ddd'
        };
        --menu-checked-item-foreground: ${
          colors.menuCheckedItemForeground || '#333'
        };

        --content-title: ${colors.contentTitle || '#ff0064'};
        --content-flag-sempre-ativos: ${
          colors.contentFlagSempreAtivos || '#666'
        };
        --content-checkbox-checked: ${
          colors.contentCheckboxChecked || '#ff0064'
        };

        --button-cookie-privacy-background: ${
          colors.buttonCookiePrivacyBackground || '#ff0064'
        };
        --button-cookie-privacy-hover-background: ${
          colors.buttonCookiePrivacyBackground || '#a32c43'
        };
        --button-cookie-privacy-foreground: ${
          colors.buttonCookiePrivacyForeground || '#fff'
        };
      }`;
  },

  getCustomCookieCategoriesInfos(texts) {
    return {
      privacy: {
        title: texts.privacy?.title || 'Sua Privacidade',
        content:
          texts.privacy?.content ||
          'Ao visitar um site, são os cookies os responsáveis pelo armazenamento temporário do seu comportamento dentro do nosso ambiente. Essas informações serão utilizadas a seu favor, com o intuito de oferecer uma experiência com produtos e serviços de forma personalizada. No entanto, respeitamos e impulsionamos seu direito de privacidade, sendo possível permitir ou não certos tipos de cookies. Aqui você gerencia esses cookies, a qualquer momento.',
        menuActive: true,
      },
      essentials: {
        title: texts.essentials?.title || 'Cookies Essenciais',
        content:
          texts.essentials?.content ||
          'Necessários para que nosso ambiente funcione e não podemos desligá-los. Eles só são configurados em resposta a ações levadas a cabo por si e que correspondem a uma solicitação de serviços, tais como definir as suas preferências de privacidade, iniciar sessão ou preencher formulários. Você pode configurar o seu navegador para bloquear ou alertá-lo(a) sobre esses cookies, mas algumas partes do website não funcionarão. Estes cookies não armazenam qualquer informação pessoal que permita identificá-lo(a).',
        menuActive: false,
        hasCookiePolicy: true,
        cookiePolicy: true,
        cookiePolicyAlways: true,
      },
      performance: {
        title: texts.performance?.title || 'Cookies de Desempenho',
        content:
          texts.performance?.content ||
          'Utilizados para contar visitas e fontes de tráfego, assim é possível medir e melhorar o desempenho do nosso ambiente. Eles ajudam a saber quais são as páginas mais e menos populares e a ver como os visitantes se movimentam entre nossos ambientes. Todas as informações recolhidas por estes cookies são agregadas e, por conseguinte, anônimas.',
        menuActive: false,
        cookiePolicy: false,
        hasCookiePolicy: true,
      },
      functionality: {
        title: texts.functionality?.title || 'Cookies de Funcionalidade',
        content:
          texts.functionality?.content ||
          'Permitem que o ambiente forneça funcionalidades e personalização melhoradas. Podem ser estabelecidos por nós ou por fornecedores externos cujos serviços foram adicionados às nossas páginas. Se não permitir estes cookies, algumas destas funcionalidades, ou mesmo todas, podem não atuar corretamente.',
        menuActive: false,
        cookiePolicy: false,
        hasCookiePolicy: true,
      },
      publicity: {
        title: texts.publicity?.title || 'Cookies de Publicidade',
        content:
          texts.publicity?.content ||
          'São estabelecidos através do nosso ambiente, pelos nossos parceiros de publicidade. Podem ser usados por essas empresas para construir um perfil sobre os seus interesses e mostrar-lhe anúncios relevantes. Eles não armazenam diretamente informações pessoais, mas são baseados na identificação exclusiva do seu navegador e dispositivo de internet. Se não permitir estes cookies, sua publicidade não será direcionada, nem baseada em produtos que podem te interessar.',
        menuActive: false,
        cookiePolicy: false,
        hasCookiePolicy: true,
      },
    };
  },

  getCustomBottomBarTexts(texts) {
    return {
      cookiesPrivacyTitle: texts.cookiesPrivacyTitle || 'Cookies e Privacidade',
      cookiesPrivacyParagraph:
        texts.cookiesPrivacyParagraph ||
        'Este site armazena cookies para intensificar sua experiência, melhorando a navegação e personificação dos nossos anúncios. Para saber mais e gerenciar nossos cookies clique em "Gerenciar cookies".',
      cookiesPrivacyBtnConfig:
        texts.cookiesPrivacyBtnConfig || 'Gerenciar cookies',
      cookiesPrivacyBtnAcceptAll:
        texts.cookiesPrivacyBtnAcceptAll || 'Aceitar todos os cookies',
      cookiesPolicyLink: texts.cookiesPolicyLink || '',
      cookiesPolicyLinkText: texts.cookiesPolicyLinkText || '',
    };
  },

  getCustomModalTexts(texts) {
    return {
      modalTitle: texts.modalTitle || 'Sua Privacidade',
      alwaysActiveCookies: texts.alwaysActiveCookies || 'Sempre ativos',
    };
  },
};
