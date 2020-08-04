var script = {
  cookiesCategories: {
    privacy: {
      title: 'Sua Privacidade',
      content:
        'Ao visitar um site, com a ajuda dos cookies, arquivos de internet que armazenam temporariamente seus acessos, armazenamos seu comportamento dentro daquele ambiente. A ideia é que essas informações sejam utilizadas a seu favor, principalmente, para oferecer uma experiência mais personalizada, com produtos e serviços que façam a diferença para você. No entanto, em respeito ao seu direito de privacidade, é possível permitir ou não certos tipos de cookies, que estão disponíveis para você alterar em nossas configurações, a qualquer momento.',
      menuActive: true,
    },
    essentials: {
      title: 'Cookies Essenciais',
      content:
        'Como o título já diz, esses cookies são necessários para o funcionamento do site e não podem ser desativados. Geralmente, são definidos apenas em resposta a suas ações. Por exemplo: solicitação de serviços; definição de preferências de privacidade; acesso ao login e preenchimento de formulários. É possível configurar seu navegador para bloquear ou para alertá-lo sobre esses cookies, mas, ainda assim, em algumas partes do site isso não funcionará. Esses cookies não armazenam informações identificáveis.',
      menuActive: false,
      hasCookiePolicy: true,
      cookiePolicy: true,
      cookiePolicyAlways: true,
    },
    performance: {
      title: 'Cookies de Desempenho',
      content:
        'Com eles, há como contar suas visitas e as fontes de tráfego para mensuração e possíveis ajustes no desempenho do site. Dessa forma, podemos saber quais páginas são mais ou menos relevantes. As informações coletadas por esses cookies são anônimas. Sem habilitar esta opção, não conseguimos saber quando você visitou nosso site e, portanto, não conseguimos monitorar o desempenho.',
      menuActive: false,
      cookiePolicy: false,
      hasCookiePolicy: true,
    },
    functionality: {
      title: 'Cookies de Funcionalidade',
      content:
        'Ao permitir esses cookies, você consegue armazenar suas preferências. Assim, você não precisa inserir seus dados mais de uma vez em um formulário, por exemplo.',
      menuActive: false,
      cookiePolicy: false,
      hasCookiePolicy: true,
    },
    publicity: {
      title: 'Cookies de Publicidade',
      content:
        'Os cookies de publicidade ou segmentação podem ser definidos pelos nossos parceiros publicitários, por meio do nosso site. A partir disso, criam um perfil de seu interesse, mostrando anúncios relevantes em outros sites. Nesse caso, não armazenam informações pessoais diretamente, mas são baseados na identificação exclusiva de seu navegador e dispositivo da internet. Se você não permitir esses cookies, deixará de contar com uma publicidade mais assertiva.',
      menuActive: false,
      cookiePolicy: false,
      hasCookiePolicy: true,
    },
  },

  bottomBarTexts: {
    cookiesPrivacyTitle: 'Cookies e Privacidade',
    cookiesPrivacyParagraph:
      'Com o auxílio dos cookies podemos te conhecer melhor e, assim, recomendar produtos e serviços que sejam do seu interesse. Para saber mais sobre cookies e avaliar nossa Política de Privacidade, é só selecionar suas preferências em Configurar Privacidade.',
    cookiesPrivacyBtnConfig: 'Configurar privacidade',
    cookiesPrivacyBtnAcceptAll: 'Aceitar todos os cookies',
  },

  modalTexts: {
    modalTitle: 'Sua Privacidade',
    alwaysActiveCookies: 'Sempre ativos',
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

    var cookiesPrivacyButtonsContainer = document.createElement('div');
    var cookiesPrivacyBtnConfig = document.createElement('button');
    var cookiesPrivacyBtnAcceptAll = document.createElement('button');

    wrapper.appendChild(cookiesPrivacyBottomBar);
    cookiesPrivacyBottomBar.appendChild(cookiesPrivacyTextsContainer);
    cookiesPrivacyTextsContainer.appendChild(cookiesPrivacyTitle);
    cookiesPrivacyTextsContainer.appendChild(cookiesPrivacyParagraph);
    cookiesPrivacyBottomBar.appendChild(cookiesPrivacyButtonsContainer);
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnConfig);
    cookiesPrivacyButtonsContainer.appendChild(cookiesPrivacyBtnAcceptAll);

    cookiesPrivacyBottomBar.id = 'cookies-privacy-bottom-bar';

    // texts container
    cookiesPrivacyTextsContainer.id = 'bottom-bar-texts-container';

    cookiesPrivacyTitle.innerHTML = this.bottomBarTexts.cookiesPrivacyTitle;
    cookiesPrivacyParagraph.innerHTML = this.bottomBarTexts.cookiesPrivacyParagraph;

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
    zolyCookiePrivacyBtn.innerHTML =
      "<img src='https://cdn.statically.io/gh/milena-rosa-zoly/jake/5d9950cf/assets/keyhole-privacy.png' alt='Alterar opções de cookies e privacidade' />";

    zolyCookiePrivacyBtn.onclick = () => {
      this.createZolyCookiePrivacyModal();
      this.openModal();
    };
  },

  init() {
    var style = document.createElement('link');
    var wrapper = document.createElement('div');

    style.href =
      'https://cdn.statically.io/gh/milena-rosa-zoly/jake/master/styles.css';
    style.rel = 'stylesheet';
    document.head.appendChild(style);

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
};

// ((window, document) => {
//   script.init();
// })(window, document);

(() => {
  script.init();
})(window, document);
