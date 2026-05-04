document.addEventListener('DOMContentLoaded', () => {
  inicializarAccesosRapidos();
  inicializarFiltroServicios();
  inicializarNoticias();
  inicializarFormularioContacto();
  inicializarAnimaciones();
  inicializarContadores();
});

function inicializarAccesosRapidos() {
  const quickButtons = document.querySelectorAll('.quick-action');
  const quickMessage = document.getElementById('quickMessage');
  const selectedActionsList = document.getElementById('selectedActionsList');
  const selectedCount = document.getElementById('selectedCount');

  function updateSelectedCount() {
    selectedCount.textContent = selectedActionsList.children.length;
  }

  function addSelectedAction(title) {
    const existingItem = Array.from(selectedActionsList.children)
      .find((item) => item.dataset.title === title);

    if (existingItem) {
      existingItem.classList.add('border-success');
      setTimeout(() => existingItem.classList.remove('border-success'), 700);
      return;
    }

    const item = document.createElement('li');
    item.className = 'selected-action-item';
    item.dataset.title = title;

    const text = document.createElement('span');
    text.textContent = title;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-action';
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', `Eliminar acceso ${title}`);
    removeButton.textContent = '×';

    removeButton.addEventListener('click', () => {
      item.remove();
      updateSelectedCount();
    });

    item.append(text, removeButton);
    selectedActionsList.appendChild(item);
    updateSelectedCount();
  }

  quickButtons.forEach((button) => {
    button.addEventListener('click', () => {
      quickButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      quickMessage.textContent = button.dataset.message;
      addSelectedAction(button.dataset.title);
    });
  });
}

function inicializarFiltroServicios() {
  const filterButtons = document.querySelectorAll('.service-pill');
  const serviceItems = document.querySelectorAll('.service-item');
  const serviceSearch = document.getElementById('serviceSearch');
  const noResults = document.getElementById('noResults');

  let activeFilter = 'todos';

  function updateServices() {
    const searchValue = serviceSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    serviceItems.forEach((item) => {
      const matchesCategory = activeFilter === 'todos' || item.dataset.category === activeFilter;
      const matchesSearch = item.dataset.title.includes(searchValue);
      const shouldShow = matchesCategory && matchesSearch;

      item.classList.toggle('d-none', !shouldShow);

      if (shouldShow) {
        visibleCount++;
      }
    });

    noResults.classList.toggle('d-none', visibleCount > 0);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.dataset.filter;
      updateServices();
    });
  });

  serviceSearch.addEventListener('input', updateServices);

  const serviceStatus = document.getElementById('serviceStatus');

  serviceItems.forEach((item) => {
    const title = item.querySelector('h3').textContent;

    item.addEventListener('mouseover', () => {
      serviceStatus.textContent = `Estás revisando: ${title}. Haz clic en el enlace para recibir orientación.`;
    });

    item.addEventListener('mouseout', () => {
      serviceStatus.textContent = 'Pasa el cursor o enfoca una tarjeta para ver una breve orientación del servicio.';
    });

    item.addEventListener('focusin', () => {
      serviceStatus.textContent = `Tarjeta enfocada: ${title}. Puedes navegar con la tecla Tab.`;
    });
  });
}

function inicializarNoticias() {
  const toggleNews = document.getElementById('toggleNews');
  const hiddenNews = document.querySelectorAll('.news-item.d-none');

  let newsExpanded = false;

  toggleNews.addEventListener('click', () => {
    newsExpanded = !newsExpanded;

    hiddenNews.forEach((item) => {
      item.classList.toggle('d-none', !newsExpanded);
    });

    toggleNews.textContent = newsExpanded
      ? 'Ocultar noticias destacadas'
      : 'Mostrar noticias destacadas';
  });
}

function inicializarFormularioContacto() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const charCount = document.getElementById('charCount');
  const messageError = document.getElementById('messageError');
  const fields = contactForm.querySelectorAll('input, select, textarea');

  function validateField(field) {
    if (field.id === 'message') {
      charCount.textContent = field.value.length;

      if (field.value.length > 300) {
        field.setCustomValidity('El mensaje no puede superar los 300 caracteres.');
        messageError.textContent = 'El mensaje no puede superar los 300 caracteres.';
      } else if (field.value.length > 0 && field.value.length < 12) {
        field.setCustomValidity('El mensaje debe tener al menos 12 caracteres.');
        messageError.textContent = 'El mensaje debe tener al menos 12 caracteres.';
      } else {
        field.setCustomValidity('');
        messageError.textContent = '';
      }
    }

    field.classList.toggle('is-invalid', !field.checkValidity() && field.value.length > 0);
    field.classList.toggle('is-valid', field.checkValidity() && field.value.length > 0);
  }

  fields.forEach((field) => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => validateField(field));
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fields.forEach(validateField);

    if (!contactForm.checkValidity()) {
      formStatus.textContent = 'Revisa los campos marcados antes de enviar.';
      formStatus.className = 'mb-0 small text-danger fw-semibold';
      return;
    }

    formStatus.textContent = 'Solicitud enviada correctamente. Pronto recibirás orientación municipal.';
    formStatus.className = 'mb-0 small text-success fw-semibold';

    contactForm.reset();

    fields.forEach((field) => {
      field.classList.remove('is-valid', 'is-invalid');
    });

    charCount.textContent = '0';
  });
}

function inicializarAnimaciones() {
  const animatedElements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  animatedElements.forEach((element) => observer.observe(element));
}

function inicializarContadores() {
  const counters = document.querySelectorAll('[data-counter]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.counter);
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 30));

      const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        element.textContent = current;
      }, 35);

      counterObserver.unobserve(element);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => counterObserver.observe(counter));
}