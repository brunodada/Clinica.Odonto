// ===============================
// CONFIGURAÇÕES GERAIS
// ===============================

// Número da clínica no formato internacional (Brasil) - ajustar se necessário
const WHATSAPP_NUMBER = "5551997565042";

// Mensagem padrão para os botões gerais de agendamento
const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, tenho interesse em agendar uma consulta na Clínica Sorriso Ideal em Osório - RS. Pode me ajudar com os horários disponíveis?";

document.addEventListener("DOMContentLoaded", () => {
  setupHeaderScrollEffect();
  setupMobileMenu();
  setupSmoothScroll();
  setupWhatsappButtons();
  setupWhatsappForm();
  setupFaqAccordion();
  setupScrollAnimations();
  setCurrentYearInFooter();
});

// ===============================
// HEADER: EFEITO AO ROLAR
// ===============================

/**
 * Adiciona/remover classe no header quando a página é rolada,
 * deixando o layout mais compacto e com sombra.
 */
function setupHeaderScrollEffect() {
  const header = document.querySelector(".header");
  if (!header) return;

  const toggleHeaderClass = () => {
    if (window.scrollY > 10) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  toggleHeaderClass();
  window.addEventListener("scroll", toggleHeaderClass);
}

// ===============================
// MENU MOBILE (HAMBÚRGUER)
// ===============================

/**
 * Controla abertura e fechamento do menu mobile, garantindo acessibilidade.
 */
function setupMobileMenu() {
  const toggleButton = document.querySelector(".header__toggle");
  const mobileNav = document.querySelector(".nav-mobile");

  if (!toggleButton || !mobileNav) return;

  const toggleMenu = () => {
    const isOpen = mobileNav.classList.toggle("nav-mobile--open");
    toggleButton.classList.toggle("header__toggle--active", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  };

  toggleButton.addEventListener("click", toggleMenu);

  // Fecha o menu ao clicar em qualquer link interno
  mobileNav.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches("a.nav-mobile__link")) {
      mobileNav.classList.remove("nav-mobile--open");
      toggleButton.classList.remove("header__toggle--active");
      toggleButton.setAttribute("aria-expanded", "false");
    }
  });
}

// ===============================
// SCROLL SUAVE PARA ÂNCORAS
// ===============================

/**
 * Aplica rolagem suave para links internos do menu e de outras seções.
 */
function setupSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href =
        (event.currentTarget instanceof HTMLAnchorElement &&
          event.currentTarget.getAttribute("href")) ||
        "";
      const targetId = href.startsWith("#") ? href.substring(1) : null;

      if (!targetId) return;

      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ===============================
// BOTÕES DE WHATSAPP (MÚLTIPLOS PONTOS)
// ===============================

/**
 * Abre o WhatsApp com a mensagem informada.
 */
function openWhatsapp(message) {
  const encodedMessage = encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, "_blank");
}

/**
 * Configura todos os botões com a classe .js-whatsapp-btn
 * e o link textual de WhatsApp na área de contato.
 */
function setupWhatsappButtons() {
  const buttons = document.querySelectorAll(".js-whatsapp-btn");
  const textLink = document.querySelector(".js-whatsapp-link");

  console.log("Total de botões WhatsApp encontrados:", buttons.length);

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("Botão clicado:", button.textContent);
      // Verifica se o botão tem uma mensagem customizada
      const customMessage = button.getAttribute("data-message");
      const messageToSend = customMessage || DEFAULT_WHATSAPP_MESSAGE;
      console.log("Mensagem a enviar:", messageToSend);
      openWhatsapp(messageToSend);
    });
  });

  if (textLink) {
    textLink.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("Link de WhatsApp clicado");
      openWhatsapp(DEFAULT_WHATSAPP_MESSAGE);
    });
  }
}

// ===============================
// FORMULÁRIO -> FORMSPREE
// ===============================

/**
 * Valida campos simples (obrigatórios) do formulário
 * e envia os dados para o Formspree.
 */
function setupWhatsappForm() {
  const form = document.getElementById("form-whatsapp");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    const nomeInput = document.getElementById("nome");
    const telefoneInput = document.getElementById("telefone");
    const mensagemTextarea = document.getElementById("mensagem");

    if (
      !(nomeInput instanceof HTMLInputElement) ||
      !(telefoneInput instanceof HTMLInputElement) ||
      !(mensagemTextarea instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const mensagem = mensagemTextarea.value.trim();

    let hasError = false;

    // Limpa mensagens de erro anteriores
    clearFieldError(nomeInput);
    clearFieldError(telefoneInput);
    clearFieldError(mensagemTextarea);

    if (!nome) {
      setFieldError(nomeInput, "Informe seu nome.");
      hasError = true;
    }

    if (!telefone) {
      setFieldError(telefoneInput, "Informe seu telefone ou WhatsApp.");
      hasError = true;
    }

    if (!mensagem) {
      setFieldError(mensagemTextarea, "Conte rapidamente o que você precisa.");
      hasError = true;
    }

    if (hasError) {
      // Impede o envio se houver erros
      event.preventDefault();
      return;
    }

    // Deixa o envio seguir o fluxo padrão do navegador (POST para o Formspree)
  });
}

/**
 * Define mensagem de erro abaixo de um campo de formulário.
 */
function setFieldError(field, message) {
  const container = field.closest(".form__group");
  if (!container) return;

  const errorElement = container.querySelector(".form__error");
  if (errorElement) {
    errorElement.textContent = message;
  }

  field.setAttribute("aria-invalid", "true");
}

/**
 * Limpa a mensagem de erro de um campo de formulário.
 */
function clearFieldError(field) {
  const container = field.closest(".form__group");
  if (!container) return;

  const errorElement = container.querySelector(".form__error");
  if (errorElement) {
    errorElement.textContent = "";
  }

  field.removeAttribute("aria-invalid");
}

// ===============================
// FAQ COM EFEITO ACCORDION
// ===============================

/**
 * Abre/fecha respostas do FAQ utilizando aria-expanded
 * para manter melhor acessibilidade.
 */
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq__item");
  if (!faqItems.length) return;

  faqItems.forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const nextAnswer = button.nextElementSibling;

      // Fecha todos os outros itens antes de abrir o atual
      closeAllFaqItems();

      if (
        !isExpanded &&
        nextAnswer &&
        nextAnswer.classList.contains("faq__answer")
      ) {
        button.setAttribute("aria-expanded", "true");
        openFaqAnswer(nextAnswer);
      }
    });
  });
}

/**
 * Fecha todas as respostas abertas no FAQ.
 */
function closeAllFaqItems() {
  const faqButtons = document.querySelectorAll(
    ".faq__item[aria-expanded='true']"
  );
  faqButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));

  const openAnswers = document.querySelectorAll(
    ".faq__answer.faq__answer--open"
  );
  openAnswers.forEach((answer) => closeFaqAnswer(answer));
}

/**
 * Anima abertura da resposta do FAQ.
 */
function openFaqAnswer(answerElement) {
  answerElement.classList.add("faq__answer--open");
  const scrollHeight = answerElement.scrollHeight;
  answerElement.style.maxHeight = `${scrollHeight}px`;
}

/**
 * Anima fechamento da resposta do FAQ.
 */
function closeFaqAnswer(answerElement) {
  answerElement.classList.remove("faq__answer--open");
  answerElement.style.maxHeight = "0px";
}

// ===============================
// ANIMAÇÕES SUAVES AO APARECER
// ===============================

/**
 * Usa IntersectionObserver para adicionar a classe .is-visible
 * aos elementos marcados com data-animate, disparando transições CSS.
 */
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate]");
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// ===============================
// RODAPÉ: ANO ATUAL
// ===============================

/**
 * Mantém o ano do rodapé sempre atualizado.
 */
function setCurrentYearInFooter() {
  const yearSpan = document.getElementById("ano-atual");
  if (!yearSpan) return;
  yearSpan.textContent = new Date().getFullYear().toString();
}

