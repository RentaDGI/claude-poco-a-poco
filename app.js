/**
 * Portal Estiba VLC - Aplicación Principal
 * Gestiona la navegación, autenticación y lógica de la aplicación
 */

// Estado global de la aplicación
const AppState = {
  currentUser: null,
  currentPage: 'login',
  isAuthenticated: false
};

// Datos estáticos - Enlaces actualizados con URLs reales
const ENLACES_DATA = [
  // Formularios
  { titulo: 'Punto y HS', url: 'https://docs.google.com/forms/d/e/1FAIpQLSeGKl5gwKrcj110D_6xhHVo0bn7Fo56tneof68dRyS6xUrD7Q/viewform', categoria: 'Formularios', color: 'blue' },
  { titulo: 'Cambio Posición', url: 'https://docs.google.com/forms/d/e/1FAIpQLSe6V16kccSmyBAYCkDNphYAbD7dqe4ydHbVWu_zpXvnFFFxlA/viewform', categoria: 'Formularios', color: 'blue' },
  { titulo: 'Cambio IRPF', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfDe2o5X_Bge14GA-bSBPRL7zpB2ZW_isBGGVFGAyvGkSAomQ/viewform', categoria: 'Formularios', color: 'blue' },
  { titulo: 'Justificantes', url: 'https://docs.google.com/forms/d/e/1FAIpQLSc27Doc2847bvoPTygEKscwl9jdMuavlCOgtzNDXYVnjSLsUQ/viewform', categoria: 'Formularios', color: 'blue' },
  { titulo: 'Comunicar Incidencia', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdc_NZM-gasxCpPZ3z09HgKcEcIapDsgDhNi_9Y45a-jpJnMw/viewform', categoria: 'Formularios', color: 'blue' },
  { titulo: 'Modelo 145', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdEumqz7aiATukMmIyO2euqhVW5HEqf5Tn5WetAH5LBabcprg/viewform', categoria: 'Formularios', color: 'blue' },

  // Disponibilidad
  { titulo: 'No Disponible Jornada', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfXcs0lOG7beU9HMfum-6eKkwmZCjcvnOQXaFiiY8EAb9rpYA/closedform', categoria: 'Disponibilidad', color: 'yellow' },
  { titulo: 'No Disponible Periodo', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfTqZSFoEbs89vxmGXVi5DKpKIyH5npIOpI11uiQnt32Rxp3g/closedform', categoria: 'Disponibilidad', color: 'yellow' },
  { titulo: 'Recuperación', url: 'https://docs.google.com/forms/d/e/1FAIpQLSeEaBKptVkoX4oxktWkl5Be7fOhjdYUiRupyFkrG3LxWKISMA/viewform', categoria: 'Disponibilidad', color: 'yellow' },

  // Documentos
  { titulo: 'Carnet de Conducir', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdKF0jRJjcFrdbL3Wk_U-0Cjb3T-JeVYDNuN8QU1a-60kAXqA/viewform', categoria: 'Documentos', color: 'orange' },
  { titulo: 'Doc. Desempleo', url: 'https://docs.google.com/forms/d/e/1FAIpQLScL1GRtLuuRGgOolBLe31cWKqY92DZ9mFzfN2_uJwx3XmRq3g/viewform', categoria: 'Documentos', color: 'orange' },
  { titulo: '145 Abreviado', url: 'https://drive.google.com/file/d/1AwHoBJHTumN-cEYk6jV0nZGBGVFSJWPj/view', categoria: 'Documentos', color: 'orange' },

  // Seguridad
  { titulo: '¿Qué hago en caso de accidente?', url: 'https://drive.google.com/file/d/1Jei371j-lI95VTkBzm2XVfOxofjxvzbh/view', categoria: 'Seguridad', color: 'red' },

  // Información
  { titulo: 'Censo do', url: 'https://drive.google.com/file/d/1yIqMMJCRTyS8GZglMLTnR01A4MLU-spf/view', categoria: 'Información', color: 'green' },
  { titulo: 'Calendario de Pago', url: 'https://drive.google.com/file/d/1bovGdc1Fb6VRHrru1DrJOsSjbSEhFZgN/view', categoria: 'Información', color: 'green' },
  { titulo: 'Teléfonos Terminales', url: 'https://drive.google.com/file/d/1KxLm_X_0JdUEJF7JUuIvNNleU-PTqUgv/view', categoria: 'Información', color: 'green' },
  { titulo: 'Tabla Contratación', url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTtbkA94xqjf81lsR7bLKKtyES2YBDKs8J2T4UrSEan7e5Z_eaptShCA78R1wqUyYyASJxmHj3gDnY/pubhtml?gid=1388412839&single=true', categoria: 'Información', color: 'green' },
  { titulo: 'Chapero', url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrMuapybwZUEGPR1vsP9p1_nlWvznyl0sPD4xWsNJ7HdXCj1ABY1EpU1um538HHZQyJtoAe5Niwrxq/pubhtml?gid=841547354&single=true', categoria: 'Información', color: 'green' },
  { titulo: 'Previsión Demandas', url: 'https://noray.cpevalencia.com/PrevisionDemanda.asp', categoria: 'Información', color: 'green' },
  { titulo: 'Chapero CPE', url: 'https://noray.cpevalencia.com/Chapero.asp', categoria: 'Información', color: 'green' },

  // Comunicaciones
  { titulo: 'Comunicación Contingencia', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdxLm9xqP4FOv61h3-YoyRFzkxKcfAGir_YYRi5e4PTFisEAw/viewform', categoria: 'Comunicaciones', color: 'purple' },
  { titulo: 'Comunicaciones Oficina', url: 'https://docs.google.com/forms/d/e/1FAIpQLSc_wN20zG_88wmAAyXRsCxokTpfvxRKdILHr5BxrQUuNGqvyQ/closedform', categoria: 'Comunicaciones', color: 'purple' }
];

// Noticias y avisos - Añadir contenido real aquí
const NOTICIAS_DATA = [
  {
    titulo: '🚀 ¡Nueva Función: Posición en la Puerta!',
    fecha: '02/11/2025', // <-- Recuerda ajustar la fecha si lo necesitas
    contenido: `Ahora puedes ver en la pantalla de "Dashboard" (justo debajo de tu nombre) a cuántas posiciones estás de la última puerta contratada.
    <ul style="list-style-type: disc; margin-left: 20px; margin-top: 10px;">
      <li style="margin-bottom: 5px;">El sistema calcula tu distancia automáticamente.</li>
      <li style="margin-bottom: 5px;">Importante: El cálculo tiene en cuenta si perteneces al censo de <b>SP</b> (Servicio Público) o al de <b>OC</b> (Operaciones Complementarias) y te compara con la puerta correspondiente a tu censo.</li>
      <li>Así sabrás de un vistazo cuánto falta para tu próxima contratación.</li>
    </ul>`
},
   {
    titulo: '📢 Actualización en Puertas: Añadida Puerta OC',
    fecha: '02/11/2025',
    contenido: `Se ha mejorado la visualización de las puertas. Ahora la tabla muestra tres columnas para mayor claridad:
    <ul style="list-style-type: disc; margin-left: 20px; margin-top: 10px;">      
      <li style="margin-bottom: 5px;">La <b>Puerta SP</b> se muestra en color <span style="color: #10b981; font-weight: 600;">Verde</span>.</li>
      <li style="margin-bottom: 5px;">La <b>Puerta OC</b> se muestra en color <span style="color: #0a2e5c; font-weight: 600;">Azul</span>.</li>
      <li>Este formato se aplica tanto a puertas laborables como festivas.</li>
    </ul>`
  },
  {
    titulo: '✨ Mejora Visual en "Mis Jornales"',
    fecha: '02/11/2025',
    contenido: `Se ha mejorado el indicador de quincenas en la sección "Mis Jornales" para que sea más fácil de identificar:
    <ul style="list-style-type: disc; margin-left: 20px; margin-top: 10px;">
      <li style="margin-bottom: 5px;">Se usa un emoji de calendario distinto según la quincena: <b>📅 (para días 1-15)</b> o <b>🗓️ (para días 16 al fin de mes)</b>.</li>
      <li>El formato de la etiqueta ahora es más claro (ej: "📅 1-15 NOV").</li>
    </ul>`
  },
  {
    titulo: '📊 Nuevas Estadísticas de Colores en Censo',
    fecha: '02/11/2025',
    contenido: `La pestaña "Censo" ahora incluye un nuevo resumen estadístico de chapas por color:
    <ul style="list-style-type: disc; margin-left: 20px; margin-top: 10px;">
      <li style="margin-bottom: 5px;">Se muestran 5 tarjetas (Verde, Azul, Amarillo, Naranja, Rojo) justo debajo de la leyenda de colores.</li>
      <li style="margin-bottom: 5px;">Cada tarjeta muestra la <b>cantidad total</b> de chapas de ese color.</li>
      <li>También se muestra el <b>porcentaje</b> que representa cada color sobre el total de chapas.</li>
    </ul>`
  },

  // --- NOTICIAS ANTERIORES ---
  {
    titulo: '🚨 IMPORTANTE: Muestra tu Nombre',
    fecha: '01/11/2025',
    contenido: 'Si quieres que se muestre tu nombre en vez de tu chapa, comunícale tu nombre al administrador.'
  },
  {
    titulo: '📢 Actualización del Sistema (Jornales)',
    fecha: '01/11/2025',
    contenido: 'Se ha mejorado el sistema de jornales. Ahora puedes exportar a CSV y ver tus jornales organizados por quincenas.'
  }

];

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portal Estiba VLC - Iniciando aplicación...');

  initializeApp();
  setupEventListeners();
  checkStoredSession();
});

/**
 * Inicializa la aplicación
 */
async function initializeApp() {
  // Cargar contenido estático
  renderEnlaces();
  renderNoticias();

  // Verificar si hay sesión guardada
  const storedChapa = localStorage.getItem('currentChapa');
  if (storedChapa) {
    // Obtener nombre do del sheet
    const nombre = await SheetsAPI.getNombrePorChapa(storedChapa);
    await loginUser(storedChapa, nombre);
  } else {
    showPage('login');
  }
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
  // Botón de login
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }

  // Enter en el input de chapa y contraseña
  const chapaInput = document.getElementById('chapa-input');
  const passwordInput = document.getElementById('password-input');
  if (chapaInput) {
    chapaInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
  }
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
  }

  // Botón de logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Botón de cambiar contraseña
  const changePasswordBtn = document.getElementById('change-password-btn');
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', openChangePasswordModal);
  }

  // Modal de cambiar contraseña
  const closePasswordModal = document.getElementById('close-password-modal');
  if (closePasswordModal) {
    closePasswordModal.addEventListener('click', closeChangePasswordModal);
  }

  const cancelPasswordChange = document.getElementById('cancel-password-change');
  if (cancelPasswordChange) {
    cancelPasswordChange.addEventListener('click', closeChangePasswordModal);
  }

  const confirmPasswordChange = document.getElementById('confirm-password-change');
  if (confirmPasswordChange) {
    confirmPasswordChange.addEventListener('click', handlePasswordChange);
  }

  // Navegación del sidebar
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page;
      if (page) {
        navigateTo(page);
        closeSidebar();
      }
    });
  });

  // Cards del dashboard
  const dashboardCards = document.querySelectorAll('.dashboard-card[data-navigate]');
  dashboardCards.forEach(card => {
    card.addEventListener('click', () => {
      const page = card.dataset.navigate;
      if (page) {
        navigateTo(page);
      }
    });
  });

  // Menú móvil
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleSidebar);
  }

  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Foro
  const foroSendBtn = document.getElementById('foro-send');
  if (foroSendBtn) {
    foroSendBtn.addEventListener('click', sendForoMessage);
  }

  const foroInput = document.getElementById('foro-input');
  if (foroInput) {
    foroInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendForoMessage();
      }
    });
  }
}

/**
 * Verifica si hay una sesión guardada
 */
function checkStoredSession() {
  const storedChapa = localStorage.getItem('currentChapa');
  const storedName = localStorage.getItem('currentUserName');

  if (storedChapa) {
    AppState.currentUser = storedChapa;
    AppState.currentUserName = storedName || `Chapa ${storedChapa}`;
    AppState.isAuthenticated = true;
    updateUIForAuthenticatedUser();
  }
}

/**
 * Maneja el login con validación de contraseña
 */
async function handleLogin() {
  const chapaInput = document.getElementById('chapa-input');
  const passwordInput = document.getElementById('password-input');
  const errorMsg = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');

  const chapa = chapaInput.value.trim();
  const password = passwordInput.value.trim();

  // Validar campos vacíos
  if (!chapa || chapa.length < 2) {
    errorMsg.textContent = 'Por favor, introduce un número de chapa válido';
    errorMsg.classList.add('active');
    chapaInput.focus();
    return;
  }

  if (!password) {
    errorMsg.textContent = 'Por favor, introduce tu contraseña';
    errorMsg.classList.add('active');
    passwordInput.focus();
    return;
  }

  // Deshabilitar botón mientras valida
  loginBtn.disabled = true;
  loginBtn.textContent = 'Validando...';
  errorMsg.classList.remove('active');

  try {
    // Obtener usuarios del CSV (necesario para obtener el nombre)
    const usuarios = await SheetsAPI.getUsuarios();

    // Verificar si hay override de contraseña en localStorage
    const passwordOverrides = JSON.parse(localStorage.getItem('password_overrides') || '{}');
    const customPassword = passwordOverrides[chapa];

    // Buscar usuario para obtener nombre
    const usuario = usuarios.find(u => u.chapa === chapa);

    if (!usuario) {
      throw new Error('Chapa no encontrada');
    }

    // Determinar si la contraseña es válida
    let passwordValida = false;

    if (customPassword) {
      // Validar contra contraseña personalizada
      passwordValida = (password === customPassword);
    } else {
      // Validar contra contraseña del sheet
      passwordValida = (usuario.contrasena === password);
    }

    if (passwordValida) {
      // Login exitoso - guardar chapa y nombre
      await loginUser(chapa, usuario.nombre || `Chapa ${chapa}`);
    } else {
      throw new Error('Contraseña incorrecta');
    }

  } catch (error) {
    console.error('Error en login:', error);
    errorMsg.textContent = error.message || 'Error al validar credenciales';
    errorMsg.classList.add('active');
    passwordInput.value = '';
    passwordInput.focus();
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Acceder al Portal
    `;
  }
}

/**
 * Inicia sesión de usuario
 */
async function loginUser(chapa, nombre = null) {
  AppState.currentUser = chapa;
  AppState.currentUserName = nombre || `Chapa ${chapa}`;
  AppState.isAuthenticated = true;

  // Guardar en localStorage
  localStorage.setItem('currentChapa', chapa);
  localStorage.setItem('currentUserName', AppState.currentUserName);

  // Actualizar cache de usuarios para el foro (obtener todos los nombres desde Google Sheets)
  try {
    await actualizarCacheNombres();
    console.log('✅ Cache de nombres actualizado en login');
  } catch (error) {
    console.warn('⚠️ No se pudo actualizar cache de nombres:', error);
    // Fallback: al menos guardar el usuario actual
    const usuariosCache = JSON.parse(localStorage.getItem('usuarios_cache') || '{}');
    usuariosCache[chapa] = AppState.currentUserName;
    localStorage.setItem('usuarios_cache', JSON.stringify(usuariosCache));
  }

  // r UI
  updateUIForAuthenticatedUser();

  // Navegar al dashboard
  navigateTo('dashboard');
}

/**
 * Actualiza la UI para usuario autenticado
 */
function updateUIForAuthenticatedUser() {
  const userInfo = document.getElementById('user-info');
  const userChapa = document.getElementById('user-chapa');

  if (userInfo) userInfo.classList.remove('hidden');
  if (userChapa) userChapa.textContent = AppState.currentUserName || `Chapa ${AppState.currentUser}`;

  // Actualizar mensaje de bienvenida con posiciones hasta contratación
  const welcomeMsg = document.getElementById('welcome-message');
  if (welcomeMsg) {
    const nombreUsuario = AppState.currentUserName || `Chapa ${AppState.currentUser}`;
    welcomeMsg.textContent = `Bienvenido, ${nombreUsuario}`;

    // Obtener y mostrar posiciones hasta contratación
    SheetsAPI.getPosicionesHastaContratacion(AppState.currentUser)
      .then(posiciones => {
        if (posiciones !== null) {
          const posicionInfo = document.createElement('span');
          posicionInfo.style.display = 'block';
          posicionInfo.style.marginTop = '0.5rem';
          posicionInfo.style.fontSize = '0.95rem';
          posicionInfo.style.color = '#FFFFFF'; // <-- MODIFICADO A BLANCO
          posicionInfo.style.fontWeight = '600';

          if (posiciones === 0) {
            posicionInfo.innerHTML = '🎉 ¡Estás en la última puerta contratada!';
          } else {
            // <-- MODIFICADO A BLANCO y negrita más fuerte
            posicionInfo.innerHTML = `📍 Estás a <strong style="color: #FFFFFF; font-weight: 800;">${posiciones}</strong> posiciones de la puerta`;
          }

          // Limpiar cualquier span anterior y agregar el nuevo
          const existingSpan = welcomeMsg.querySelector('span');
          if (existingSpan) {
            existingSpan.remove();
          }
          welcomeMsg.appendChild(posicionInfo);
        }
      })
      .catch(error => {
        console.error('Error obteniendo posiciones:', error);
      });
  }
}

/**
 * Maneja el logout
 */
function handleLogout() {
  AppState.currentUser = null;
  AppState.isAuthenticated = false;

  localStorage.removeItem('currentChapa');

  const userInfo = document.getElementById('user-info');
  if (userInfo) userInfo.classList.add('hidden');

  showPage('login');
}

/**
 * Abre el modal de cambio de contraseña
 */
function openChangePasswordModal() {
  const modal = document.getElementById('change-password-modal');
  if (modal) {
    modal.style.display = 'flex';

    // Limpiar campos y mensajes
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';

    const errorMsg = document.getElementById('password-change-error');
    const successMsg = document.getElementById('password-change-success');
    if (errorMsg) {
      errorMsg.textContent = '';
      errorMsg.classList.remove('active');
    }
    if (successMsg) {
      successMsg.textContent = '';
      successMsg.classList.remove('active');
    }
  }
}

/**
 * Cierra el modal de cambio de contraseña
 */
function closeChangePasswordModal() {
  const modal = document.getElementById('change-password-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Maneja el cambio de contraseña
 */
async function handlePasswordChange() {
  const currentPasswordInput = document.getElementById('current-password');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const errorMsg = document.getElementById('password-change-error');
  const successMsg = document.getElementById('password-change-success');
  const confirmBtn = document.getElementById('confirm-password-change');

  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Limpiar mensajes previos
  errorMsg.textContent = '';
  errorMsg.classList.remove('active');
  successMsg.textContent = '';
  successMsg.classList.remove('active');

  // Validaciones
  if (!currentPassword) {
    errorMsg.textContent = 'Por favor, introduce tu contraseña actual';
    errorMsg.classList.add('active');
    currentPasswordInput.focus();
    return;
  }

  if (!newPassword) {
    errorMsg.textContent = 'Por favor, introduce una nueva contraseña';
    errorMsg.classList.add('active');
    newPasswordInput.focus();
    return;
  }

  if (newPassword.length < 4) {
    errorMsg.textContent = 'La nueva contraseña debe tener al menos 4 caracteres';
    errorMsg.classList.add('active');
    newPasswordInput.focus();
    return;
  }

  if (newPassword !== confirmPassword) {
    errorMsg.textContent = 'Las contraseñas no coinciden';
    errorMsg.classList.add('active');
    confirmPasswordInput.focus();
    return;
  }

  if (currentPassword === newPassword) {
    errorMsg.textContent = 'La nueva contraseña debe ser diferente de la actual';
    errorMsg.classList.add('active');
    newPasswordInput.focus();
    return;
  }

  // Deshabilitar botón mientras procesa
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Cambiando...';

  try {
    const chapa = AppState.currentUser;

    // Verificar contraseña actual
    const passwordOverrides = JSON.parse(localStorage.getItem('password_overrides') || '{}');
    const customPassword = passwordOverrides[chapa];

    console.log('🔐 Verificando contraseña actual...');
    console.log('Chapa:', chapa);
    console.log('¿Tiene contraseña personalizada?', !!customPassword);

    let isCurrentPasswordValid = false;

    if (customPassword) {
      // Si ya tiene una contraseña personalizada, validar contra ella
      console.log('Validando contra contraseña personalizada');
      isCurrentPasswordValid = (currentPassword === customPassword);
      console.log('¿Contraseña válida?', isCurrentPasswordValid);
    } else {
      // Si no tiene contraseña personalizada, validar contra el CSV
      console.log('Validando contra contraseña del CSV');
      const usuarios = await SheetsAPI.getUsuarios();
      const usuario = usuarios.find(u => u.chapa === chapa);

      if (usuario) {
        console.log('Usuario encontrado en CSV');
        console.log('Contraseña del CSV:', usuario.contrasena);
        console.log('Contraseña ingresada:', currentPassword);
        console.log('¿Coinciden?', usuario.contrasena === currentPassword);
        if (usuario.contrasena === currentPassword) {
          isCurrentPasswordValid = true;
        }
      } else {
        console.log('Usuario NO encontrado en CSV');
      }
    }

    if (!isCurrentPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    console.log('✅ Contraseña actual verificada correctamente');

    // 1. Guardar nueva contraseña en localStorage (backup local)
    passwordOverrides[chapa] = newPassword;
    localStorage.setItem('password_overrides', JSON.stringify(passwordOverrides));
    console.log('✅ Contraseña guardada en localStorage');

    // 2. Intentar guardar en Google Sheets vía Apps Script (persistente)
    try {
      const result = await SheetsAPI.cambiarContrasenaAppsScript(chapa, newPassword);
      if (result.success) {
        console.log('✅ Contraseña actualizada en Google Sheets');
        successMsg.textContent = '¡Contraseña cambiada exitosamente!';
      } else {
        console.warn('⚠️ No se pudo actualizar en Google Sheets, pero se guardó localmente');
        successMsg.textContent = '¡Contraseña cambiada exitosamente!';
      }
    } catch (error) {
      console.error('Error actualizando en Google Sheets:', error);
      successMsg.textContent = '¡Contraseña cambiada exitosamente!';
    }

    successMsg.classList.add('active');

    // Limpiar campos
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';

    // Cerrar modal después de 2 segundos
    setTimeout(() => {
      closeChangePasswordModal();
    }, 2000);

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    errorMsg.textContent = error.message || 'Error al cambiar la contraseña';
    errorMsg.classList.add('active');
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Cambiar Contraseña';
  }
}

/**
 * Navega a una página
 */
function navigateTo(pageName) {
  if (!AppState.isAuthenticated && pageName !== 'login') {
    showPage('login');
    return;
  }

  AppState.currentPage = pageName;
  showPage(pageName);

  // Cargar datos según la página
  switch (pageName) {
    case 'contratacion':
      loadContratacion();
      break;
    case 'jornales':
      loadJornales();
      break;
    case 'puertas':
      loadPuertas();
      break;
    case 'censo':
      loadCenso();
      break;
    case 'foro':
      loadForo();
      break;
  }
}

/**
 * Muestra una página
 */
function showPage(pageName) {
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(page => page.classList.remove('active'));

  const targetPage = document.getElementById(`page-${pageName}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Actualizar navegación activa
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll al inicio
  window.scrollTo(0, 0);
}

/**
 * Toggle sidebar en móvil
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

/**
 * Cierra el sidebar
 */
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  sidebar.classList.remove('active');
  overlay.classList.remove('active');
}

/**
 * Carga la página de contratación
 */
/**
 * Carga la página de contratación
 * ACTUALIZADO: Muestra contrataciones hasta las 00:00 (medianoche) del día
 * - Jornada 02-08: se muestra hasta medianoche del día de la jornada (se contrata el día anterior)
 * - Otras jornadas: se muestran hasta medianoche del día de la contratación
 */
async function loadContratacion() {
  const container = document.getElementById('contratacion-content');
  const loading = document.getElementById('contratacion-loading');

  if (!container) return;

  loading.classList.remove('hidden');
  container.innerHTML = '';

  try {
    // Obtener todas las contrataciones desde la URL pivotada (funciona bien)
    const allData = await SheetsAPI.getContrataciones(AppState.currentUser);

    // LÓGICA DE HORARIO: Mostrar hasta las 00:00 (medianoche)
    const ahora = new Date();

    // Obtener fechas relevantes (sin hora, solo fecha)
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    // Formatear fechas para comparación (dd/mm/yyyy)
    const formatFecha = (fecha) => {
      const dd = String(fecha.getDate()).padStart(2, '0');
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const yyyy = fecha.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    const fechaHoy = formatFecha(hoy);
    const fechaManana = formatFecha(manana);

    console.log('=== DEBUG CONTRATACIONES ===');
    console.log('Fecha hoy:', fechaHoy);
    console.log('Fecha mañana:', fechaManana);
    console.log('Total contrataciones obtenidas:', allData.length);

    // Mostrar primeras 5 contrataciones para ver estructura
    console.log('Primeras 5 contrataciones:', allData.slice(0, 5));

    // Normalizar formato de jornada (eliminar espacios, normalizar separadores)
    const normalizeJornada = (jornada) => {
      if (!jornada) return '';
      // Convertir "14 a 20" → "14-20", eliminar espacios extra
      let norm = jornada.toString().trim().toLowerCase();
      norm = norm.replace(/\s*a\s*/g, '-'); // Reemplazar " a " por "-"
      norm = norm.replace(/\s+/g, ''); // Eliminar espacios restantes
      return norm;
    };

    // Filtrar contrataciones según la lógica:
    // - Jornada 02-08 con fecha de mañana: mostrar hoy (se contrató hoy para mañana, se ve hasta medianoche de mañana)
    // - Cualquier jornada con fecha de hoy: mostrar hoy
    const data = allData.filter(item => {
      const jornadaNorm = normalizeJornada(item.jornada);
      const jornadaOriginal = item.jornada;

      // Debug para jornadas específicas
      if (item.chapa === '983' || item.chapa === '813' || item.chapa === 983 || item.chapa === 813) {
        console.log(`
          🔍 DEBUG Chapa ${item.chapa}:
          - Jornada original: "${jornadaOriginal}"
          - Jornada normalizada: "${jornadaNorm}"
          - Fecha: "${item.fecha}"
          - Fecha hoy: "${fechaHoy}"
          - ¿Coincide fecha?: ${item.fecha === fechaHoy}
        `);
      }

      // Jornada 02-08 se contrata el día anterior (hoy), pero tiene fecha de mañana
      // Debe mostrarse desde HOY (cuando se contrata) hasta las 00:00 de MAÑANA
      if (jornadaNorm === '02-08' && item.fecha === fechaManana) {
        console.log(`✓ Mostrando jornada 02-08 para chapa ${item.chapa} (fecha: ${item.fecha})`);
        return true;
      }

      // Todas las jornadas con fecha de hoy se muestran
      if (item.fecha === fechaHoy) {
        console.log(`✓ Mostrando jornada ${jornadaOriginal} (norm: ${jornadaNorm}) para chapa ${item.chapa}`);
        return true;
      }

      return false;
    });

    console.log(`Total contrataciones a mostrar: ${data.length}`);

    // Guardar TODAS las contrataciones obtenidas en el histórico de jornales
    if (allData.length > 0) {
      const historico = JSON.parse(localStorage.getItem('jornales_historico') || '[]');

      // Agregar solo las nuevas (evitar duplicados)
      allData.forEach(nueva => {
        const existe = historico.some(h =>
          h.fecha === nueva.fecha &&
          h.jornada === nueva.jornada &&
          h.puesto === nueva.puesto &&
          h.chapa === nueva.chapa
        );
        if (!existe) {
          historico.push(nueva);
        }
      });

      localStorage.setItem('jornales_historico', JSON.stringify(historico));
      console.log(`Guardadas ${historico.length} jornales en el histórico (localStorage)`);

      // Sincronizar automáticamente al backup en Google Sheets
      try {
        console.log('🔄 Iniciando sincronización automática al backup...');
        await SheetsAPI.sincronizarJornalesBackup(AppState.currentUser, historico.filter(h => h.chapa === AppState.currentUser));
        console.log('✅ Sincronización automática completada');
      } catch (syncError) {
        console.warn('⚠️ No se pudo sincronizar al backup:', syncError);
        // No bloqueamos la carga si falla la sincronización
      }
    }

    // Ordenar por fecha y jornada
    const sortedData = data.sort((a, b) => {
      // Primero por fecha descendente
      const dateA = new Date(a.fecha.split('/').reverse().join('-'));
      const dateB = new Date(b.fecha.split('/').reverse().join('-'));
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA;
      }
      // Luego por jornada
      const jornadaOrder = { '02-08': 1, '08-14': 2, '14-20': 3, '20-02': 4 };
      return (jornadaOrder[a.jornada] || 99) - (jornadaOrder[b.jornada] || 99);
    });

    loading.classList.add('hidden');

    if (sortedData.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>No hay asignaciones actuales</h3>
          <p>No tienes contrataciones asignadas para hoy.</p>
        </div>
      `;
      return;
    }

    // Mapeo de empresas a logos
    const empresaLogos = {
      'APM': 'https://i.imgur.com/HgQ95qc.jpeg',
      'CSP': 'https://i.imgur.com/8Tjx3KP.jpeg',
      'VTEU': 'https://i.imgur.com/3nNCkw5.jpeg',
      'MSC': 'https://i.imgur.com/kX4Ujxf.jpeg',
      'ERH': 'https://i.imgur.com/OHDp62K.png',
      'ERSHIP': 'https://i.imgur.com/OHDp62K.png'
    };

    // Función para obtener logo de empresa
    const getEmpresaLogo = (empresa) => {
      if (!empresa) return null;
      const empresaUpper = empresa.toString().toUpperCase().trim();
      const logo = empresaLogos[empresaUpper];
      console.log(`Logo para ${empresaUpper}:`, logo);
      return logo || null;
    };

    // AGRUPAR CONTRATACIONES POR FECHA
    const contratacionesPorFecha = {};
    sortedData.forEach(contratacion => {
      if (!contratacionesPorFecha[contratacion.fecha]) {
        contratacionesPorFecha[contratacion.fecha] = [];
      }
      contratacionesPorFecha[contratacion.fecha].push(contratacion);
    });

    // Obtener fechas únicas ordenadas
    const fechasUnicas = Object.keys(contratacionesPorFecha);

    // Renderizar cada fecha con sus contrataciones
    fechasUnicas.forEach((fecha, index) => {
      const contratacionesFecha = contratacionesPorFecha[fecha];

      // Header de fecha
      const fechaInfo = document.createElement('div');
      fechaInfo.style.marginBottom = '1.5rem';
      fechaInfo.style.marginTop = index > 0 ? '2.5rem' : '0';
      fechaInfo.style.padding = '1rem';
      fechaInfo.style.background = 'white';
      fechaInfo.style.color = 'var(--puerto-dark-blue)';
      fechaInfo.style.border = '2px solid var(--puerto-blue)';
      fechaInfo.style.borderRadius = '12px';
      fechaInfo.style.textAlign = 'center';
      fechaInfo.style.fontSize = '1.1rem';
      fechaInfo.style.fontWeight = 'bold';
      fechaInfo.innerHTML = `📅 Contratación del ${fecha} (${contratacionesFecha.length} asignación${contratacionesFecha.length > 1 ? 'es' : ''})`;
      container.appendChild(fechaInfo);

      // Grid de tarjetas para esta fecha
      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'contratacion-cards';
      cardsContainer.style.display = 'grid';
      cardsContainer.style.gap = '1.5rem';
      cardsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';

      contratacionesFecha.forEach(row => {
        const logo = getEmpresaLogo(row.empresa);

        const card = document.createElement('div');
        card.className = 'contratacion-card';
        card.style.background = 'white';
        card.style.borderRadius = '16px';
        card.style.border = '2px solid var(--border-color)';
        card.style.overflow = 'hidden';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        card.style.transition = 'transform 0.2s, box-shadow 0.2s';

        card.innerHTML = `
          ${logo ? `
            <div style="background: white; padding: 1.5rem; display: flex; align-items: center; justify-content: center; min-height: 120px; border-bottom: 2px solid var(--border-color);">
              <img src="${logo}" alt="${row.empresa}" style="max-width: 100%; max-height: 100px; object-fit: contain;">
            </div>
          ` : `
            <div style="background: linear-gradient(135deg, var(--puerto-blue), var(--puerto-dark-blue)); padding: 2rem; text-align: center;">
              <div style="color: white; font-size: 1.5rem; font-weight: bold;">${row.empresa}</div>
            </div>
          `}
          <div style="padding: 1.5rem;">
            <div style="margin-bottom: 1rem;">
              <div style="color: var(--puerto-blue); font-weight: bold; font-size: 1.25rem; margin-bottom: 0.5rem;">
                ${row.puesto}
              </div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">Puesto asignado</div>
            </div>

            <div style="display: grid; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; color: var(--puerto-blue);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div style="font-size: 0.85rem; color: var(--text-secondary);">Jornada</div>
                  <div style="font-weight: 600;">${row.jornada}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; color: var(--puerto-green);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div style="font-size: 0.85rem; color: var(--text-secondary);">Buque</div>
                  <div style="font-weight: 600;">${row.buque}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; color: var(--puerto-orange);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div>
                  <div style="font-size: 0.85rem; color: var(--text-secondary);">Parte</div>
                  <div style="font-weight: 600;">${row.parte}</div>
                </div>
              </div>
            </div>
          </div>
        `;

        // Efecto hover
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        });

        cardsContainer.appendChild(card);
      });

      container.appendChild(cardsContainer);
    });

  } catch (error) {
    loading.classList.add('hidden');
    container.innerHTML = `
      <div class="empty-state">
        <h3>Error al cargar datos</h3>
        <p>No se pudieron cargar las asignaciones. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `;
  }
}

/**
 * Carga la página de jornales - Sistema de Quincenas
 * Agrupa jornales por períodos quincenales (1-15, 16-fin de mes)
 * ACTUALIZADO: Usa localStorage con limpieza automática el 31 de diciembre a las 00:00
 */
async function loadJornales() {
  const statsContainer = document.getElementById('jornales-stats');
  const container = document.getElementById('jornales-content');
  const loading = document.getElementById('jornales-loading');

  if (!container) return;

  loading.classList.remove('hidden');
  container.innerHTML = '';
  statsContainer.innerHTML = '';

  try {
    let data = [];

    // 1. INTENTAR CARGAR DESDE JORNALES_HISTORICO_ACUMULADO (se actualiza automáticamente cada hora)
    console.log('📥 Cargando jornales desde Jornales_Historico_Acumulado...');
    try {
      const jornalesAcumulados = await SheetsAPI.getJornalesHistoricoAcumulado(AppState.currentUser);

      if (jornalesAcumulados && jornalesAcumulados.length > 0) {
        console.log(`✅ Cargados ${jornalesAcumulados.length} jornales desde histórico acumulado`);
        data = jornalesAcumulados;

        // Guardar en localStorage como caché por si falla la conexión en el futuro
        const historico = JSON.parse(localStorage.getItem('jornales_historico') || '[]');
        jornalesAcumulados.forEach(jornal => {
          const existe = historico.some(h =>
            h.fecha === jornal.fecha &&
            h.jornada === jornal.jornada &&
            h.puesto === jornal.puesto &&
            h.chapa === jornal.chapa
          );
          if (!existe) {
            historico.push(jornal);
          }
        });
        localStorage.setItem('jornales_historico', JSON.stringify(historico));
      } else {
        throw new Error('No hay jornales en histórico acumulado, usando localStorage');
      }
    } catch (error) {
      console.warn('⚠️ No se pudo cargar desde histórico acumulado:', error.message);
      console.log('📂 Cargando desde localStorage como fallback...');

      // 2. FALLBACK: CARGAR DESDE LOCALSTORAGE
      let historico = JSON.parse(localStorage.getItem('jornales_historico') || '[]');

      // LIMPIEZA AUTOMÁTICA: Eliminar jornales del año anterior
      const ahora = new Date();
      const añoActual = ahora.getFullYear();

      historico = historico.filter(jornal => {
        try {
          const fechaParts = jornal.fecha.split('/');
          const añoJornal = parseInt(fechaParts[2]);
          return añoJornal === añoActual;
        } catch {
          return true;
        }
      });

      localStorage.setItem('jornales_historico', JSON.stringify(historico));

      // Filtrar solo los jornales del usuario actual
      data = historico.filter(item => item.chapa === AppState.currentUser);
      console.log(`📂 Cargados ${data.length} jornales desde localStorage`);
    }

    loading.classList.add('hidden');

    if (data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>No hay datos de jornales</h3>
          <p>No se encontraron registros de jornales para tu chapa.</p>
        </div>
      `;
      return;
    }

    // Agrupar por quincenas
    const quincenasMap = groupByQuincena(data);

    // Ordenar quincenas por fecha (más recientes primero)
    const quincenasOrdenadas = Array.from(quincenasMap.entries()).sort((a, b) => {
      const [yearA, monthA, quincenaA] = a[0].split('-').map(Number);
      const [yearB, monthB, quincenaB] = b[0].split('-').map(Number);
      if (yearB !== yearA) return yearB - yearA;
      if (monthB !== monthA) return monthB - monthA;
      return quincenaB - quincenaA;
    });

    // Calcular estadísticas totales
    const totalJornales = data.length;

    // Botón de exportar
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-primary';
    exportBtn.style.marginBottom = '1rem';
    exportBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; margin-right: 8px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Exportar a CSV
    `;
    exportBtn.addEventListener('click', () => exportJornalesToCSV(data));
    container.appendChild(exportBtn);

    // Renderizar stats totales
    statsContainer.innerHTML = `
      <div class="stat-card blue">
        <div class="stat-label">Total Jornales</div>
        <div class="stat-value">${totalJornales}</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Quincenas Registradas</div>
        <div class="stat-value">${quincenasOrdenadas.length}</div>
      </div>
    `;

    // Renderizar cada quincena
    quincenasOrdenadas.forEach(([key, jornales]) => {
      const [year, month, quincena] = key.split('-').map(Number);
      const quincenaCard = createQuincenaCard(year, month, quincena, jornales);
      container.appendChild(quincenaCard);
    });

  } catch (error) {
    loading.classList.add('hidden');
    statsContainer.innerHTML = '';
    container.innerHTML = `
      <div class="empty-state">
        <h3>Error al cargar datos</h3>
        <p>No se pudieron cargar los jornales. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `;
  }
}

/**
 * Agrupa jornales por quincena
 */
function groupByQuincena(jornales) {
  const map = new Map();

  jornales.forEach(jornal => {
    // Parsear fecha: dd/mm/yyyy
    const parts = jornal.fecha.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    // Determinar quincena: 1 (días 1-15) o 2 (días 16-fin)
    const quincena = day <= 15 ? 1 : 2;

    // Crear clave única: year-month-quincena
    const key = `${year}-${month}-${quincena}`;

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(jornal);
  });

  return map;
}

/**
 * Crea una tarjeta de quincena con datos resumidos
 */
function createQuincenaCard(year, month, quincena, jornales) {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthName = monthNames[month - 1];

  // Determinar rango de días
  const rangoInicio = quincena === 1 ? 1 : 16;
  const rangoFin = quincena === 1 ? 15 : new Date(year, month, 0).getDate();

  // Calcular estadísticas
  const totalJornales = jornales.length;

  // Desglose por empresa
  const porEmpresa = {};
  jornales.forEach(j => {
    const empresa = j.empresa || 'Sin especificar';
    porEmpresa[empresa] = (porEmpresa[empresa] || 0) + 1;
  });

  // Desglose por puesto
  const porPuesto = {};
  jornales.forEach(j => {
    const puesto = j.puesto || 'Sin especificar';
    porPuesto[puesto] = (porPuesto[puesto] || 0) + 1;
  });

  // Crear card
  const card = document.createElement('div');
  card.className = 'quincena-card';
  card.style.marginBottom = '0.75rem';
  card.style.border = '1px solid var(--border-color)';
  card.style.borderRadius = '8px';
  card.style.overflow = 'hidden';
  card.style.background = 'white';

  // Emoji de calendario según quincena
  const emojiCalendario = quincena === 1 ? '📅' : '🗓️';

  // Formato de mes en 3 letras mayúsculas
  const monthShort = monthName.substring(0, 3).toUpperCase();

  // Header simple - una sola línea con la información de la quincena
  const header = document.createElement('div');
  header.className = 'quincena-header';
  header.style.padding = '1rem 1.25rem';
  header.style.background = 'white';
  header.style.cursor = 'pointer';
  header.style.userSelect = 'none';
  header.style.transition = 'all 0.2s ease';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.gap = '0.75rem';
  header.style.borderBottom = '1px solid var(--border-color)';

  header.innerHTML = `
    <span style="font-size: 1.3rem;">${emojiCalendario}</span>
    <span style="font-size: 1rem; font-weight: 600; color: #000;">${rangoInicio}-${rangoFin} ${monthShort}</span>
    <span style="font-size: 0.85rem; color: #666; margin-left: 0.5rem;">${totalJornales} jornales</span>
    <svg class="expand-icon" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; margin-left: auto; transition: transform 0.3s; flex-shrink: 0;" fill="none" viewBox="0 0 24 24" stroke="#666" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  `;

  // Efectos hover para hacer más obvio que es clickeable
  header.addEventListener('mouseenter', () => {
    header.style.background = 'var(--bg-secondary)';
  });
  header.addEventListener('mouseleave', () => {
    header.style.background = 'white';
  });

  // Body (inicialmente oculto)
  const body = document.createElement('div');
  body.className = 'quincena-body';
  body.style.display = 'none';
  body.style.padding = '1.25rem';

  // Resumen por empresa
  const empresasHTML = Object.entries(porEmpresa)
    .sort((a, b) => b[1] - a[1])
    .map(([empresa, count]) => `
      <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px; margin-bottom: 0.5rem;">
        <span>${empresa}</span>
        <span style="font-weight: bold; color: var(--puerto-blue);">${count} jornales</span>
      </div>
    `).join('');

  // Resumen por puesto
  const puestosHTML = Object.entries(porPuesto)
    .sort((a, b) => b[1] - a[1])
    .map(([puesto, count]) => `
      <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px; margin-bottom: 0.5rem;">
        <span>${puesto}</span>
        <span style="font-weight: bold; color: var(--puerto-green);">${count} jornales</span>
      </div>
    `).join('');

  body.innerHTML = `
    <div style="display: grid; gap: 1.5rem; margin-bottom: 1.5rem;">
      <div>
        <h4 style="margin-bottom: 0.75rem; color: var(--puerto-blue);">📊 Por Empresa</h4>
        ${empresasHTML}
      </div>
      <div>
        <h4 style="margin-bottom: 0.75rem; color: var(--puerto-green);">👷 Por Puesto</h4>
        ${puestosHTML}
      </div>
    </div>

    <div>
      <h4 style="margin-bottom: 0.75rem; color: var(--puerto-dark-blue);">📋 Detalle de Jornales</h4>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Desliza horizontalmente para ver todos los datos
      </div>
      <div class="data-table" style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -1.25rem; padding: 0 1.25rem;">
        <table style="min-width: 600px;">
          <thead>
            <tr>
              <th style="white-space: nowrap;">Fecha</th>
              <th style="white-space: nowrap;">Puesto</th>
              <th style="white-space: nowrap;">Jornada</th>
              <th style="white-space: nowrap;">Empresa</th>
              <th style="white-space: nowrap;">Buque</th>
              <th style="white-space: nowrap;">Parte</th>
            </tr>
          </thead>
          <tbody>
            ${jornales.map(row => `
              <tr>
                <td style="white-space: nowrap;"><strong>${row.fecha}</strong></td>
                <td style="white-space: nowrap;">${row.puesto}</td>
                <td style="white-space: nowrap;">${row.jornada}</td>
                <td style="white-space: nowrap;">${row.empresa}</td>
                <td style="white-space: nowrap;">${row.buque}</td>
                <td style="white-space: nowrap;">${row.parte}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Click handler para toggle expand/collapse
  header.addEventListener('click', () => {
    const isExpanded = body.style.display !== 'none';
    body.style.display = isExpanded ? 'none' : 'block';
    const icon = header.querySelector('.expand-icon');
    icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  card.appendChild(header);
  card.appendChild(body);

  return card;
}

/**
 * Limpia jornales antiguos - mantiene solo últimos 12 meses
 */
function cleanupOldJornales(historico) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 12);

  const cleaned = historico.filter(jornal => {
    const parts = jornal.fecha.split('/');
    const jornalDate = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0])
    );
    return jornalDate >= cutoffDate;
  });

  if (cleaned.length !== historico.length) {
    localStorage.setItem('jornales_historico', JSON.stringify(cleaned));
    console.log(`Limpieza de jornales: ${historico.length - cleaned.length} registros eliminados`);
  }
}

/**
 * Exporta jornales a CSV
 */
function exportJornalesToCSV(data) {
  // Ordenar por fecha
  const sorted = data.sort((a, b) => {
    const dateA = new Date(a.fecha.split('/').reverse().join('-'));
    const dateB = new Date(b.fecha.split('/').reverse().join('-'));
    return dateA - dateB;
  });

  // Crear CSV
  const headers = ['Fecha', 'Chapa', 'Puesto', 'Jornada', 'Empresa', 'Buque', 'Parte'];
  const rows = sorted.map(row => [
    row.fecha,
    row.chapa,
    row.puesto,
    row.jornada,
    row.empresa,
    row.buque,
    row.parte
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');

  // Descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `jornales_chapa_${AppState.currentUser}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Carga la página de puertas
 * Muestra la fecha actual del sistema en el título
 */
async function loadPuertas() {
  const container = document.getElementById('puertas-content');
  const loading = document.getElementById('puertas-loading');
  const tituloElement = document.getElementById('puertas-titulo');
  const fechaElement = document.getElementById('puertas-fecha');

  if (!container) return;

  loading.classList.remove('hidden');
  container.innerHTML = '';

  try {
    const result = await SheetsAPI.getPuertas();
    const fecha = result.fecha || new Date().toLocaleDateString('es-ES');
    const data = result.puertas || [];

    loading.classList.add('hidden');

    // Actualizar título con la fecha del CSV
    if (tituloElement) {
      tituloElement.textContent = `Puertas del Día`;
    }
    if (fechaElement) {
      fechaElement.textContent = `Información para el ${fecha}`;
    }

    // Separar puertas laborables y festivas
    const puertasLaborables = data.filter(item =>
      item.jornada && !item.jornada.toLowerCase().includes('festivo')
    );
    const puertasFestivas = data.filter(item =>
      item.jornada && item.jornada.toLowerCase().includes('festivo')
    );

    // Crear tabla de puertas laborables
    if (puertasLaborables.length > 0) {
      const laborablesTitle = document.createElement('h3');
      laborablesTitle.style.marginBottom = '1rem';
      laborablesTitle.style.color = 'var(--puerto-blue)';
      laborablesTitle.style.fontSize = '1.25rem';
      laborablesTitle.textContent = '📋 Puertas Laborables';
      container.appendChild(laborablesTitle);

      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'data-table';
      tableWrapper.style.marginBottom = '2rem';

      const table = document.createElement('table');
      table.style.width = '100%';

      // Header de la tabla con 3 columnas
      table.innerHTML = `
        <thead>
          <tr>
            <th style="text-align: left; padding: 1rem; background: var(--puerto-blue); color: white;">Jornada</th>
            <th style="text-align: center; padding: 1rem; background: var(--puerto-blue); color: white;">Puerta SP</th>
            <th style="text-align: center; padding: 1rem; background: var(--puerto-blue); color: white;">Puerta OC</th>
          </tr>
        </thead>
        <tbody>
          ${puertasLaborables.map(item => {
            const puertaSP = item.puertaSP || '';
            const puertaOC = item.puertaOC || '';
            const isEmptySP = !puertaSP || puertaSP.trim() === '';
            const isEmptyOC = !puertaOC || puertaOC.trim() === '';
            return `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 1rem; font-weight: 600; color: var(--puerto-dark-blue);">${item.jornada}</td>
                <td style="padding: 1rem; text-align: center;">
                  ${isEmptySP
                    ? '<span style="color: var(--puerto-red); font-weight: 600;">— No contratada</span>'
                    : `<span style="background: linear-gradient(135deg, var(--puerto-green), #059669); color: white; padding: 0.5rem 1.5rem; border-radius: 8px; font-weight: bold; font-size: 1.1rem; display: inline-block; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">${puertaSP}</span>`
                  }
                </td>
                <td style="padding: 1rem; text-align: center;">
                  ${isEmptyOC
                    ? '<span style="color: var(--puerto-red); font-weight: 600;">— No contratada</span>'
                    : `<span style="background: linear-gradient(135deg, var(--puerto-blue), #1e40af); color: white; padding: 0.5rem 1.5rem; border-radius: 8px; font-weight: bold; font-size: 1.1rem; display: inline-block; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);">${puertaOC}</span>`
                  }
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      `;

      tableWrapper.appendChild(table);
      container.appendChild(tableWrapper);
    }

    // Crear tabla de puertas festivas
    if (puertasFestivas.length > 0) {
      const festivasTitle = document.createElement('h3');
      festivasTitle.style.marginBottom = '1rem';
      festivasTitle.style.color = 'var(--puerto-orange)';
      festivasTitle.style.fontSize = '1.25rem';
      festivasTitle.textContent = '🎉 Puertas Festivas';
      container.appendChild(festivasTitle);

      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'data-table';

      const table = document.createElement('table');
      table.style.width = '100%';

      // Header de la tabla con 3 columnas
      table.innerHTML = `
        <thead>
          <tr>
            <th style="text-align: left; padding: 1rem; background: var(--puerto-orange); color: white;">Jornada</th>
            <th style="text-align: center; padding: 1rem; background: var(--puerto-orange); color: white;">Puerta SP</th>
            <th style="text-align: center; padding: 1rem; background: var(--puerto-orange); color: white;">Puerta OC</th>
          </tr>
        </thead>
        <tbody>
          ${puertasFestivas.map(item => {
            const puertaSP = item.puertaSP || '';
            const puertaOC = item.puertaOC || '';
            const isEmptySP = !puertaSP || puertaSP.trim() === '';
            const isEmptyOC = !puertaOC || puertaOC.trim() === '';
            return `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 1rem; font-weight: 600; color: var(--puerto-dark-blue);">${item.jornada}</td>
                <td style="padding: 1rem; text-align: center;">
                  ${isEmptySP
                    ? '<span style="color: var(--puerto-red); font-weight: 600;">— No contratada</span>'
                    : `<span style="background: linear-gradient(135deg, var(--puerto-orange), #ea580c); color: white; padding: 0.5rem 1.5rem; border-radius: 8px; font-weight: bold; font-size: 1.1rem; display: inline-block; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);">${puertaSP}</span>`
                  }
                </td>
                <td style="padding: 1rem; text-align: center;">
                  ${isEmptyOC
                    ? '<span style="color: var(--puerto-red); font-weight: 600;">— No contratada</span>'
                    : `<span style="background: linear-gradient(135deg, var(--puerto-blue), #1e40af); color: white; padding: 0.5rem 1.5rem; border-radius: 8px; font-weight: bold; font-size: 1.1rem; display: inline-block; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);">${puertaOC}</span>`
                  }
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      `;

      tableWrapper.appendChild(table);
      container.appendChild(tableWrapper);
    }

  } catch (error) {
    loading.classList.add('hidden');
    container.innerHTML = `
      <div class="empty-state">
        <h3>Error al cargar datos</h3>
        <p>No se pudieron cargar las puertas. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `;
  }
}

/**
 * Carga la página de censo
 */
async function loadCenso() {
  const container = document.getElementById('censo-content');
  const loading = document.getElementById('censo-loading');

  if (!container) return;

  loading.classList.remove('hidden');
  container.innerHTML = '';

  try {
    const data = await SheetsAPI.getCenso();

    loading.classList.add('hidden');

    // Calcular estadísticas por color
    const colorStats = {
      green: 0,
      blue: 0,
      yellow: 0,
      orange: 0,
      red: 0
    };

    data.forEach(item => {
      if (colorStats.hasOwnProperty(item.color)) {
        colorStats[item.color]++;
      }
    });

    const total = data.length;

    // Crear contenedor de estadísticas
    const statsContainer = document.createElement('div');
    statsContainer.style.display = 'grid';
    statsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(100px, 1fr))';
    statsContainer.style.gap = '1rem';
    statsContainer.style.marginBottom = '2rem';
    statsContainer.style.maxWidth = '600px';
    statsContainer.style.margin = '0 auto 2rem auto';

    // Colores y nombres
    const colorInfo = [
      { key: 'green', name: 'Verde', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
      { key: 'blue', name: 'Azul', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
      { key: 'yellow', name: 'Amarillo', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { key: 'orange', name: 'Naranja', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
      { key: 'red', name: 'Rojo', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' }
    ];

    colorInfo.forEach(color => {
      const count = colorStats[color.key];
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

      const statCard = document.createElement('div');
      statCard.style.background = 'white';
      statCard.style.border = '1px solid var(--border-color)';
      statCard.style.borderRadius = '8px';
      statCard.style.padding = '1rem';
      statCard.style.textAlign = 'center';
      statCard.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

      statCard.innerHTML = `
        <div style="width: 60px; height: 60px; background: ${color.gradient}; border-radius: 8px; margin: 0 auto 0.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
        <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.25rem;">${count}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">${color.name}</div>
        <div style="font-size: 0.75rem; font-weight: 600; color: var(--puerto-blue);">${percentage}%</div>
      `;

      statsContainer.appendChild(statCard);
    });

    container.appendChild(statsContainer);

    // Crear wrapper para el grid de chapas
    const chapasWrapper = document.createElement('div');
    chapasWrapper.className = 'censo-grid';
    chapasWrapper.style.marginTop = '2rem';

    // Crear grid de chapas dentro del wrapper
    data.forEach(item => {
      const div = document.createElement('div');
      div.className = `censo-item ${item.color}`;
      div.textContent = item.chapa;
      div.title = `Chapa ${item.chapa}`;
      chapasWrapper.appendChild(div);
    });

    container.appendChild(chapasWrapper);

  } catch (error) {
    loading.classList.add('hidden');
    container.innerHTML = `
      <div class="empty-state">
        <h3>Error al cargar datos</h3>
        <p>No se pudo cargar el censo. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `;
  }
}
/**
 * Renderiza los enlaces
 */
function renderEnlaces() {
  const container = document.getElementById('enlaces-content');
  if (!container) return;

  const categorias = [...new Set(ENLACES_DATA.map(e => e.categoria))];

  categorias.forEach(categoria => {
    const section = document.createElement('div');
    section.className = 'enlaces-section';

    const title = document.createElement('h3');
    title.textContent = categoria;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'enlaces-grid';

    const enlaces = ENLACES_DATA.filter(e => e.categoria === categoria);
    enlaces.forEach(enlace => {
      const a = document.createElement('a');
      a.href = enlace.url;
      a.className = `enlace-btn ${enlace.color}`;
      a.textContent = enlace.titulo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      grid.appendChild(a);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

/**
 * Renderiza las noticias
 */
function renderNoticias() {
  const container = document.getElementById('noticias-content');
  if (!container) return;

  NOTICIAS_DATA.forEach(noticia => {
    const card = document.createElement('div');
    card.className = 'noticia-card';
    card.innerHTML = `
      <div class="noticia-header">
        <div class="noticia-titulo">${noticia.titulo || noticia.titular}</div>
        <div class="noticia-fecha">${noticia.fecha}</div>
      </div>
      <div class="noticia-contenido">${noticia.contenido}</div>
    `;
    container.appendChild(card);
  });
}

/**
 * Carga el foro - Intenta cargar desde Google Sheets primero
 */
async function loadForo() {
  const container = document.getElementById('foro-messages');
  if (!container) return;

  // Mostrar loading
  container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Cargando mensajes...</div>';

  try {
    // Actualizar nombres de usuarios en cache
    await actualizarCacheNombres();

    // Intentar cargar desde Google Sheets
    const sheetMessages = await SheetsAPI.getForoMensajes();

    if (sheetMessages && sheetMessages.length > 0) {
      // Si hay mensajes en el sheet, usar esos
      console.log('Usando mensajes del Google Sheet');
      renderForoMessages(sheetMessages);
      // Actualizar localStorage con los mensajes del sheet
      localStorage.setItem('foro_messages', JSON.stringify(sheetMessages));
    } else {
      // Si no hay sheet o está vacío, usar localStorage
      console.log('Usando mensajes de localStorage');
      const localMessages = getForoMessagesLocal();
      renderForoMessages(localMessages);
    }
  } catch (error) {
    console.error('Error cargando foro:', error);
    // Fallback a localStorage
    const localMessages = getForoMessagesLocal();
    renderForoMessages(localMessages);
  }
}

/**
 * Actualiza el cache de nombres de usuarios desde el sheet
 */
async function actualizarCacheNombres() {
  try {
    const usuarios = await SheetsAPI.getUsuarios();
    const usuariosCache = {};

    usuarios.forEach(u => {
      if (u.chapa && u.nombre) {
        usuariosCache[u.chapa] = u.nombre;
      }
    });

    localStorage.setItem('usuarios_cache', JSON.stringify(usuariosCache));
    console.log('âœ… Cache de nombres actualizado');
  } catch (error) {
    console.error('Error actualizando cache de nombres:', error);
  }
}

/**
 * Obtiene mensajes del foro desde localStorage
 */
function getForoMessagesLocal() {
  const stored = localStorage.getItem('foro_messages');
  if (stored) {
    return JSON.parse(stored);
  }

  // Sin mensajes iniciales - foro vacío
  const initialMessages = [];

  localStorage.setItem('foro_messages', JSON.stringify(initialMessages));
  return initialMessages;
}

/**
 * Renderiza mensajes del foro
 */
function renderForoMessages(messages) {
  const container = document.getElementById('foro-messages');
  if (!container) return;

  container.innerHTML = '';

  // Ordenar por timestamp (más ANTIGUOS primero, recientes abajo)
  const sorted = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Obtener nombres de usuarios del cache
  const usuariosCache = JSON.parse(localStorage.getItem('usuarios_cache') || '{}');

  sorted.forEach(msg => {
    // Normalizar chapa (quitar "0" inicial si es de 5 dígitos: 80983 → 983)
    let chapaOriginal = msg.chapa.toString();
    let chapaNormalizada = chapaOriginal;

    // Si la chapa empieza con "0" o "80" y tiene más de 3 dígitos, normalizarla
    if (chapaOriginal.length >= 4 && chapaOriginal.startsWith('80')) {
      // 80983 → 983, 80784 → 784, etc.
      chapaNormalizada = chapaOriginal.substring(2);
    } else if (chapaOriginal.length >= 4 && chapaOriginal.startsWith('0')) {
      // 0983 → 983, 0784 → 784, etc.
      chapaNormalizada = chapaOriginal.substring(1);
    }

    const isOwn = chapaNormalizada === AppState.currentUser;
    const timeAgo = getTimeAgo(new Date(msg.timestamp));

    // Obtener nombre del usuario (del cache usando chapa normalizada o fallback a chapa normalizada)
    const nombreUsuario = usuariosCache[chapaNormalizada] || `Chapa ${chapaNormalizada}`;

    const messageDiv = document.createElement('div');
    messageDiv.className = `foro-message ${isOwn ? 'own' : ''}`;
    messageDiv.innerHTML = `
      <div class="foro-message-content">
        <div class="foro-message-header">
          <span class="foro-message-chapa">${nombreUsuario}</span>
          <span class="foro-message-time">${timeAgo}</span>
        </div>
        <div class="foro-message-text" style="white-space: pre-wrap;">${escapeHtml(msg.texto)}</div>
      </div>
    `;

    container.appendChild(messageDiv);
  });
}

/**
 * Envía un mensaje al foro - Intenta enviar a Google Sheets si está configurado
 */
async function sendForoMessage() {
  const input = document.getElementById('foro-input');
  const sendBtn = document.getElementById('foro-send');

  if (!input || !sendBtn) return;

  const texto = input.value.trim();
  if (!texto) return;

  // Prevenir múltiples envíos
  if (sendBtn.disabled) return;

  // Deshabilitar controles y mostrar feedback visual
  input.disabled = true;
  sendBtn.disabled = true;

  // Guardar el contenido original del botón
  const originalBtnHTML = sendBtn.innerHTML;

  // Mostrar indicador de carga
  sendBtn.innerHTML = `
    <svg style="width: 20px; height: 20px; animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span style="margin-left: 8px;">Enviando...</span>
  `;

  const newMessage = {
    id: Date.now(),
    chapa: AppState.currentUser,
    timestamp: new Date().toISOString(),
    texto: texto
  };

  // Intentar enviar a Google Apps Script
  try {
    const sentToCloud = await SheetsAPI.enviarMensajeForo(AppState.currentUser, texto);

    if (sentToCloud) {
      console.log('Mensaje enviado a Google Sheets');

      // Mostrar mensaje de éxito
      sendBtn.innerHTML = `
        <svg style="width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span style="margin-left: 8px;">Enviado</span>
      `;

      // Limpiar input
      input.value = '';

      // Esperar un poco y recargar para mostrar el mensaje
      setTimeout(async () => {
        await loadForo();
        const container = document.getElementById('foro-messages');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }

        // Restaurar botón
        sendBtn.innerHTML = originalBtnHTML;
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
      }, 1000);
    } else {
      // Fallback a localStorage
      console.log('Usando localStorage para mensajes');
      const messages = getForoMessagesLocal();
      messages.push(newMessage);
      localStorage.setItem('foro_messages', JSON.stringify(messages));
      renderForoMessages(messages);

      // Scroll al final
      const container = document.getElementById('foro-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }

      // Limpiar y restaurar
      input.value = '';
      sendBtn.innerHTML = originalBtnHTML;
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    // Fallback a localStorage
    const messages = getForoMessagesLocal();
    messages.push(newMessage);
    localStorage.setItem('foro_messages', JSON.stringify(messages));
    renderForoMessages(messages);

    // Scroll al final
    const container = document.getElementById('foro-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }

    // Limpiar y restaurar
    input.value = '';
    sendBtn.innerHTML = originalBtnHTML;
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

// Agregar estilo de animación spin si no existe
if (!document.getElementById('spin-animation-style')) {
  const style = document.createElement('style');
  style.id = 'spin-animation-style';
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Calcula el tiempo transcurrido
 */
function getTimeAgo(date) {
  // Validar que date es una fecha válida
  if (!date || isNaN(date.getTime())) {
    return 'Fecha desconocida';
  }

  const seconds = Math.floor((new Date() - date) / 1000);

  // Si la fecha es futura o muy antigua, mostrar fecha formateada
  if (seconds < 0 || seconds > 31536000) { // Más de 1 año
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (seconds < 60) return 'Ahora mismo';
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
  if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;

  return date.toLocaleDateString('es-ES');
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Exponer funciones globalmente si es necesario
window.AppState = AppState;
window.navigateTo = navigateTo;

/**
 * Función de utilidad para agregar contrataciones manualmente al histórico
 * Uso desde consola del navegador:
 *
 * agregarContratacionesManual([
 *   { chapa: '123', fecha: '2025-11-03', jornada: '14-20', puesto: 'Grúa', empresa: 'APM', buque: 'Buque 1', parte: '1', logo_empresa_url: '' },
 *   { chapa: '456', fecha: '2025-11-03', jornada: '14-20', puesto: 'Capataz', empresa: 'MSC', buque: 'Buque 2', parte: '2', logo_empresa_url: '' }
 * ])
 */
window.agregarContratacionesManual = function(contrataciones) {
  if (!Array.isArray(contrataciones)) {
    console.error('❌ Debes pasar un array de contrataciones');
    console.log('Ejemplo de uso:');
    console.log('agregarContratacionesManual([');
    console.log('  { chapa: "123", fecha: "2025-11-03", jornada: "14-20", puesto: "Grúa", empresa: "APM", buque: "Buque 1", parte: "1", logo_empresa_url: "" }');
    console.log('])');
    return;
  }

  const historico = JSON.parse(localStorage.getItem('jornales_historico') || '[]');
  let agregadas = 0;

  contrataciones.forEach(contratacion => {
    // Verificar que tenga los campos requeridos
    if (!contratacion.chapa || !contratacion.fecha || !contratacion.jornada) {
      console.warn('⚠️ Contratación incompleta (falta chapa, fecha o jornada):', contratacion);
      return;
    }

    // Verificar si ya existe (evitar duplicados)
    const existe = historico.some(h =>
      h.fecha === contratacion.fecha &&
      h.jornada === contratacion.jornada &&
      h.puesto === contratacion.puesto &&
      h.chapa === contratacion.chapa
    );

    if (!existe) {
      historico.push({
        chapa: contratacion.chapa,
        fecha: contratacion.fecha,
        jornada: contratacion.jornada,
        puesto: contratacion.puesto || '',
        empresa: contratacion.empresa || '',
        buque: contratacion.buque || '',
        parte: contratacion.parte || '',
        logo_empresa_url: contratacion.logo_empresa_url || ''
      });
      agregadas++;
    } else {
      console.log(`⏭️ Contratación duplicada ignorada: ${contratacion.chapa} - ${contratacion.fecha} - ${contratacion.jornada}`);
    }
  });

  localStorage.setItem('jornales_historico', JSON.stringify(historico));
  console.log(`✅ Agregadas ${agregadas} contrataciones nuevas`);
  console.log(`📊 Total en histórico: ${historico.length} jornales`);

  return { agregadas, total: historico.length };
};


