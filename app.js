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
  { titulo: 'Reportar Jornal Faltante', url: '#', categoria: 'Formularios', color: 'blue', modal: 'report-jornal' },
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
  { titulo: 'Listado Ingreso CPE', url: 'https://drive.google.com/file/d/1YzLn6JHmCdQMrMlpNByIsdlYW3iU0P43/view?usp=drive_link', categoria: 'Información', color: 'green' },
  { titulo: 'Previsión Demandas', url: 'https://noray.cpevalencia.com/PrevisionDemanda.asp', categoria: 'Información', color: 'green' },
  { titulo: 'Chapero CPE', url: 'https://noray.cpevalencia.com/Chapero.asp', categoria: 'Información', color: 'green' },

  // Comunicaciones
  { titulo: 'Comunicación Contingencia', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdxLm9xqP4FOv61h3-YoyRFzkxKcfAGir_YYRi5e4PTFisEAw/viewform', categoria: 'Comunicaciones', color: 'purple' },
  { titulo: 'Comunicaciones Oficina', url: 'https://docs.google.com/forms/d/e/1FAIpQLSc_wN20zG_88wmAAyXRsCxokTpfvxRKdILHr5BxrQUuNGqvyQ/closedform', categoria: 'Comunicaciones', color: 'purple' }
];

// Noticias y avisos - Añadir contenido real aquí
const NOTICIAS_DATA = [
  {
    titulo: '🔧 Corrección: Cálculo de Posiciones OC',
    fecha: '05/11/2025',
    contenido: `Se ha corregido un error en el cálculo de posiciones para el personal de <strong>OC (Operaciones Complementarias)</strong>:
    <ul style="list-style-type: disc; margin-left: 20px; margin-top: 10px;">
      <li style="margin-bottom: 5px;"><strong>Problema:</strong> El cálculo de "posiciones hasta la puerta" estaba considerando la puerta festiva en lugar de la laborable.</li>
      <li style="margin-bottom: 5px;"><strong>Solución:</strong> Ahora tanto SP como OC calculan sus posiciones basándose únicamente en las <strong>puertas laborables</strong> (02-08, 08-14, 14-20, 20-02).</li>
      <li><strong>Resultado:</strong> El indicador de posiciones en el Dashboard ahora muestra la distancia correcta para el personal de OC.</li>
    </ul>
    <p style="margin-top: 10px; font-style: italic; color: #64748b;">Gracias por reportar el problema. El cálculo ahora es preciso para todos los censos.</p>`
  },
  {
    titulo: '💰 ¡NUEVA FUNCIONALIDAD: Sueldómetro!',
    fecha: '05/11/2025',
    contenido: `Llega la función más esperada: el <strong>Sueldómetro</strong>. Ahora puedes calcular automáticamente tu salario estimado por quincena:
    <ul style="list-style-type: disc; margin-left: 20px; margin-top: 10px;">
      <li style="margin-bottom: 5px;"><strong>Cálculo automático:</strong> Calcula tu salario base según tu puesto y jornada (laborable, festivo o sábado).</li>
      <li style="margin-bottom: 5px;"><strong>Prima editable:</strong> Puedes modificar los movimientos o la prima directamente en la tabla.</li>
      <li style="margin-bottom: 5px;"><strong>IRPF personalizable:</strong> Ajusta tu porcentaje de IRPF y ve el cálculo neto actualizado al instante.</li>
      <li style="margin-bottom: 5px;"><strong>Complementos incluidos:</strong> Los puestos de Trincador y Trincador de Coches incluyen automáticamente su complemento de 46,94€ (marcado con *).</li>
      <li style="margin-bottom: 5px;"><strong>Resumen por quincena:</strong> Visualiza totales de base, prima, bruto y neto organizados por quincenas.</li>
      <li style="margin-bottom: 5px;"><strong>Estadísticas globales:</strong> Ve el total de jornales, total bruto/neto y promedio en la parte superior.</li>
      <li><strong>Optimizado para móvil:</strong> Totalmente responsive y táctil para calcular desde cualquier dispositivo.</li>
    </ul>
    <p style="margin-top: 10px; font-weight: 600; color: #10b981;">¡Accede a "Sueldómetro" desde el menú lateral y comienza a calcular tus salarios!</p>`
  },
  {
  titulo: '⚙️ Actualización: Sistema de Contratación más Robusto',
    fecha: '04/11/2025',
    contenido: `Se ha implementado un sistema robusto para garantizar la visibilidad de tus asignaciones, incluso si el sistema principal falla:
    <ul style="list-style-type: disc; margin-left: 20px; margin-top: 10px;">
      <li style="margin-bottom: 5px;"><strong>Mi Contratación:</strong> Ahora se guarda en tu dispositivo (localStorage). Si el CSV de contratación falla, tus asignaciones se mantienen visibles hasta medianoche (00:00).</li>
      <li style="margin-bottom: 5px;"><strong>Mis Jornales:</strong> El histórico es totalmente independiente y se actualiza automáticamente cada hora vía Apps Script.</li>
      <li><strong>Nuevo Enlace:</strong> Se ha añadido "Listado Ingreso CPE" en la sección de Enlaces Útiles.</li>
    </ul>`
  },
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

// ... (el resto del archivo app.js se mantiene igual)

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
    welcomeMsg.textContent = `Bienvenido/a, ${nombreUsuario}`;

    // Obtener y mostrar posiciones hasta contratación (laborable y festiva)
    SheetsAPI.getPosicionesHastaContratacion(AppState.currentUser)
      .then(posicionesObj => { // 'posicionesObj' es ahora { laborable: X, festiva: Y }
        
        // Limpiar cualquier span de posición anterior
        const existingSpans = welcomeMsg.querySelectorAll('span');
        existingSpans.forEach(span => span.remove());

        if (posicionesObj) {
          
          // --- RENDERIZAR LÍNEA LABORABLE ---
          if (posicionesObj.laborable !== null) {
            const posicionInfoLab = document.createElement('span');
            posicionInfoLab.style.display = 'block';
            posicionInfoLab.style.marginTop = '0.5rem';
            posicionInfoLab.style.fontSize = '0.95rem';
            posicionInfoLab.style.color = '#FFFFFF';
            posicionInfoLab.style.fontWeight = '600';

            if (posicionesObj.laborable === 0) {
              posicionInfoLab.innerHTML = '🎉 ¡Estás en la última puerta <strong>laborable</strong>!';
            } else {
              posicionInfoLab.innerHTML = `📍 Estás a <strong style="color: #FFFFFF; font-weight: 800;">${posicionesObj.laborable}</strong> posiciones de la puerta <strong>laborable</strong>`;
            }
            welcomeMsg.appendChild(posicionInfoLab);
          }

          // --- RENDERIZAR LÍNEA FESTIVA ---
          if (posicionesObj.festiva !== null) {
            const posicionInfoFest = document.createElement('span');
            posicionInfoFest.style.display = 'block';
            posicionInfoFest.style.marginTop = '0.25rem'; // Menos espacio entre las dos líneas
            posicionInfoFest.style.fontSize = '0.95rem';
            posicionInfoFest.style.color = '#FFFFFF';
            posicionInfoFest.style.fontWeight = '600';

            if (posicionesObj.festiva === 0) {
              posicionInfoFest.innerHTML = '🎉 ¡Estás en la última puerta <strong>festiva</strong>!';
            } else {
              posicionInfoFest.innerHTML = `📍 Estás a <strong style="color: #FFFFFF; font-weight: 800;">${posicionesObj.festiva}</strong> posiciones de la puerta <strong>festiva</strong>`;
            }
            welcomeMsg.appendChild(posicionInfoFest);
          }
        }
      })
      .catch(error => {
        console.error('Error obteniendo posiciones:', error);
      });
  }
}

// ... (el resto de funciones de app.js se mantienen igual)

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
    case 'sueldometro':
      loadSueldometro();
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
 * LÓGICA ROBUSTA:
 * 1. Lee contrataciones del CSV
 * 2. Guarda en localStorage con timestamp
 * 3. Muestra desde localStorage (persistente hasta medianoche)
 * 4. Jornada 02-08: se muestra hasta medianoche del día siguiente
 * 5. Otras jornadas: se muestran hasta medianoche del día de contratación
 */
async function loadContratacion() {
  const container = document.getElementById('contratacion-content');
  const loading = document.getElementById('contratacion-loading');

  if (!container) return;

  loading.classList.remove('hidden');
  container.innerHTML = '';

  try {
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const formatFecha = (fecha) => {
      const dd = String(fecha.getDate()).padStart(2, '0');
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const yyyy = fecha.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    const fechaHoy = formatFecha(hoy);
    const fechaManana = formatFecha(manana);

    console.log('=== CONTRATACIONES - MODO ROBUSTO ===');
    console.log('Fecha hoy:', fechaHoy);
    console.log('Hora actual:', ahora.toTimeString().substring(0, 5));

    // 1. INTENTAR LEER DEL CSV Y ACTUALIZAR LOCALSTORAGE
    let contratacionesActualizadas = false;
    try {
      const allData = await SheetsAPI.getContrataciones(AppState.currentUser);
      console.log(`📥 CSV: ${allData.length} contrataciones obtenidas`);

      if (allData.length > 0) {
        // Obtener caché actual
        let cacheContrataciones = JSON.parse(localStorage.getItem('contrataciones_cache') || '{}');
        const userKey = AppState.currentUser;

        // Inicializar si no existe
        if (!cacheContrataciones[userKey]) {
          cacheContrataciones[userKey] = [];
        }

        // Agregar nuevas contrataciones al caché (evitar duplicados)
        allData.forEach(nueva => {
          const existe = cacheContrataciones[userKey].some(c =>
            c.fecha === nueva.fecha &&
            c.jornada === nueva.jornada &&
            c.puesto === nueva.puesto
          );
          if (!existe) {
            cacheContrataciones[userKey].push({
              ...nueva,
              timestamp_guardado: new Date().toISOString()
            });
            console.log(`✅ Nueva contratación guardada: ${nueva.jornada} - ${nueva.fecha}`);
          }
        });

        // Guardar caché actualizado
        localStorage.setItem('contrataciones_cache', JSON.stringify(cacheContrataciones));
        contratacionesActualizadas = true;
        console.log(`💾 Caché actualizado: ${cacheContrataciones[userKey].length} total`);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo leer del CSV:', error.message);
    }

    // 2. LEER DESDE LOCALSTORAGE (FUENTE PRINCIPAL DE VISUALIZACIÓN)
    const cacheContrataciones = JSON.parse(localStorage.getItem('contrataciones_cache') || '{}');
    const userKey = AppState.currentUser;
    const allCachedData = cacheContrataciones[userKey] || [];

    console.log(`📂 localStorage: ${allCachedData.length} contrataciones en caché`);

    // Normalizar formato de jornada
    const normalizeJornada = (jornada) => {
      if (!jornada) return '';
      let norm = jornada.toString().trim().toLowerCase();
      norm = norm.replace(/\s*a\s*/g, '-');
      norm = norm.replace(/\s+/g, '');
      return norm;
    };

    // 3. FILTRAR CONTRATACIONES VÁLIDAS (según horario de medianoche)
    const data = allCachedData.filter(item => {
      const jornadaNorm = normalizeJornada(item.jornada);

      // Jornada 02-08 con fecha de mañana: mostrar hasta medianoche de mañana
      if (jornadaNorm === '02-08' && item.fecha === fechaManana) {
        return true;
      }

      // Cualquier jornada con fecha de hoy: mostrar hasta medianoche de hoy
      if (item.fecha === fechaHoy) {
        return true;
      }

      return false;
    });

    console.log(`📊 Mostrando: ${data.length} contrataciones válidas`);

    // 4. LIMPIAR CONTRATACIONES ANTIGUAS DEL CACHÉ (después de medianoche)
    const dataLimpia = allCachedData.filter(item => {
      const jornadaNorm = normalizeJornada(item.jornada);

      // Mantener 02-08 de mañana
      if (jornadaNorm === '02-08' && item.fecha === fechaManana) return true;

      // Mantener contrataciones de hoy
      if (item.fecha === fechaHoy) return true;

      // Eliminar contrataciones antiguas
      return false;
    });

    if (dataLimpia.length !== allCachedData.length) {
      cacheContrataciones[userKey] = dataLimpia;
      localStorage.setItem('contrataciones_cache', JSON.stringify(cacheContrataciones));
      console.log(`🗑️ Limpieza: ${allCachedData.length - dataLimpia.length} contrataciones antiguas eliminadas`);
    }

    // 5. GUARDAR EN HISTÓRICO DE JORNALES (para "Mis Jornales")
    if (data.length > 0) {
      const historico = JSON.parse(localStorage.getItem('jornales_historico') || '[]');

      data.forEach(nueva => {
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
      console.log(`💾 Histórico actualizado: ${historico.length} jornales totales`);

      // Sincronizar con Google Sheets (background)
      try {
        await SheetsAPI.sincronizarJornalesBackup(AppState.currentUser, historico.filter(h => h.chapa === AppState.currentUser));
        console.log('✅ Sincronizado con Google Sheets');
      } catch (syncError) {
        console.warn('⚠️ Sincronización fallida:', syncError);
      }
    }

    // 6. ORDENAR Y MOSTRAR
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
            <div style="background: white; padding: 1.5rem; display: flex; align-items: center; justify-content: center; min-height: 140px; border-bottom: 2px solid var(--border-color);">
              <img src="${logo}" alt="${row.empresa}" style="max-width: 100%; max-height: 150px; object-fit: contain;">
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
                <td style="white-space: nowrap;">
                  ${row.puesto}
                  ${row.manual ? '<span class="badge-manual" title="Añadido manualmente">Manual</span>' : ''}
                </td>
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

      // Si tiene modal, abrir modal en lugar de link externo
      if (enlace.modal) {
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const modal = document.getElementById(`${enlace.modal}-modal`);
          if (modal) {
            modal.style.display = 'flex';
          }
        });
      } else {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }

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

  // Ordenar por timestamp (más RECIENTES primero, arriba)
  const sorted = messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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

/**
 * ===== SUELDÓMETRO =====
 */

/**
 * Determina el tipo de día basado en fecha y jornada
 * Maneja jornadas nocturnas que cruzan medianoche (02-08, 20-02)
 */
function determinarTipoDia(fecha, jornada) {
  // Parsear fecha dd/mm/yyyy
  const parts = fecha.split('/');
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
  const year = parseInt(parts[2]);
  const dateObj = new Date(year, month, day);

  // Festivos de España 2025 (ajustar según sea necesario)
  const festivos2025 = [
    '01/01/2025', '06/01/2025', // Año Nuevo, Reyes
    '18/04/2025', '19/04/2025', // Viernes Santo, Sábado Santo
    '01/05/2025', // Día del Trabajador
    '15/08/2025', // Asunción
    '12/10/2025', // Día de la Hispanidad
    '01/11/2025', // Todos los Santos
    '06/12/2025', '08/12/2025', // Constitución, Inmaculada
    '25/12/2025'  // Navidad
  ];

  const esFestivoFecha = (d) => {
    const fechaNorm = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    return festivos2025.includes(fechaNorm) || d.getDay() === 0; // Festivo oficial o domingo
  };

  const dayOfWeek = dateObj.getDay(); // 0=Domingo, 6=Sábado
  const esFestivoHoy = esFestivoFecha(dateObj);

  // Para jornadas nocturnas (02-08, 20-02) que cruzan medianoche
  if (jornada === '02-08' || jornada === '20-02') {
    const diaSiguiente = new Date(dateObj);
    diaSiguiente.setDate(diaSiguiente.getDate() + 1);
    const esFestivoManana = esFestivoFecha(diaSiguiente);

    if (jornada === '02-08') {
      // Jornada 02-08: empieza de noche y termina por la mañana
      if (esFestivoHoy && !esFestivoManana) {
        return 'FEST-LAB';
      } else if (esFestivoManana) {
        return 'FESTIVO';
      } else {
        return 'LABORABLE';
      }
    } else if (jornada === '20-02') {
      // Jornada 20-02: empieza de tarde y termina de madrugada
      if (!esFestivoHoy && esFestivoManana) {
        return 'LAB-FEST';
      } else if (esFestivoHoy) {
        return 'FESTIVO';
      } else if (dayOfWeek === 6) {
        return 'SABADO';
      } else {
        return 'LABORABLE';
      }
    }
  }

  // Para jornadas diurnas (08-14, 14-20)
  if (esFestivoHoy) {
    return 'FESTIVO';
  } else if (dayOfWeek === 6) {
    return 'SABADO';
  } else {
    return 'LABORABLE';
  }
}

/**
 * Carga y muestra el Sueldómetro con cálculo de salarios
 */
async function loadSueldometro() {
  const content = document.getElementById('sueldometro-content');
  const loading = document.getElementById('sueldometro-loading');
  const stats = document.getElementById('sueldometro-stats');

  if (!content) return;

  loading.classList.remove('hidden');
  content.innerHTML = '';
  stats.innerHTML = '';

  // Inicializar IRPF control
  const irpfControl = document.getElementById('sueldometro-irpf-control');
  const irpfInput = document.getElementById('irpf-input');
  const irpfLockBtn = document.getElementById('irpf-lock-btn');

  // Cargar IRPF guardado o usar valor por defecto (15%)
  const irpfKey = `irpf_${AppState.currentUser}`;
  const irpfLockKey = `irpf_locked_${AppState.currentUser}`;

  // Intentar cargar desde Google Sheets primero
  let irpfPorcentaje = 15; // Valor por defecto
  try {
    const configUsuario = await SheetsAPI.getUserConfig(AppState.currentUser);
    if (configUsuario && configUsuario.irpf) {
      irpfPorcentaje = configUsuario.irpf;
      console.log(`✅ IRPF cargado desde Sheets: ${irpfPorcentaje}%`);
      // Sincronizar con localStorage
      localStorage.setItem(irpfKey, irpfPorcentaje.toString());
    } else {
      // Si no hay en Sheets, intentar localStorage
      irpfPorcentaje = parseFloat(localStorage.getItem(irpfKey)) || 15;
      console.log(`📦 IRPF cargado desde localStorage: ${irpfPorcentaje}%`);
    }
  } catch (error) {
    console.error('❌ Error cargando IRPF desde Sheets, usando localStorage:', error);
    irpfPorcentaje = parseFloat(localStorage.getItem(irpfKey)) || 15;
  }

  let irpfLocked = localStorage.getItem(irpfLockKey) === 'true';

  console.log(`💰 IRPF cargado: ${irpfPorcentaje}% (bloqueado: ${irpfLocked})`);

  if (irpfInput) {
    irpfInput.value = irpfPorcentaje;
    irpfInput.disabled = irpfLocked;
    if (irpfLocked) {
      irpfInput.style.opacity = '0.7';
      irpfInput.style.background = '#f0f0f0';
      irpfInput.style.cursor = 'not-allowed';
    }
  }

  if (irpfLockBtn) {
    irpfLockBtn.textContent = irpfLocked ? '🔒' : '🔓';
    irpfLockBtn.title = irpfLocked ? 'IRPF bloqueado - Click para desbloquear' : 'IRPF desbloqueado - Click para bloquear';
  }

  try {
    // 1. Cargar datos necesarios
    console.log('📊 Cargando datos del Sueldómetro...');

    const [jornales, mapeoPuestos, tablaSalarial] = await Promise.all([
      SheetsAPI.getJornalesHistoricoAcumulado(AppState.currentUser),
      SheetsAPI.getMapeoPuestos(),
      SheetsAPI.getTablaSalarial()
    ]);

    console.log(`✅ Datos cargados: ${jornales.length} jornales, ${mapeoPuestos.length} puestos, ${tablaSalarial.length} salarios`);

    if (jornales.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>No hay jornales registrados</h3>
          <p>Cuando trabajes tus primeros jornales aparecerán aquí con su estimación salarial</p>
        </div>
      `;
      loading.classList.add('hidden');
      return;
    }

    // 2. Agrupar por quincena
    const quincenasMap = groupByQuincena(jornales);

    // 3. Calcular salario para cada jornal
    const jornalesConSalario = jornales.map((jornal, index) => {
      // Normalizar jornada: "08 a 14" → "08-14", "20 a 02" → "20-02"
      let jornada = jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, '').trim();

      // Normalizar puesto para comparaciones case-insensitive (eliminar espacios extra)
      const puestoLower = jornal.puesto.trim().replace(/\s+/g, ' ').toLowerCase();

      // 3.1 Buscar en mapeo de puestos usando comparación case-insensitive
      let mapeo = mapeoPuestos.find(m => m.puesto.trim().replace(/\s+/g, ' ').toLowerCase() === puestoLower);

      // Mapeo de fallback para puestos conocidos que pueden no estar en la hoja
      const mapeoFallback = {
        'especialista': { puesto: 'Especialista', grupo_salarial: 'G1', tipo_operativa: 'Contenedor' },
        'trincador': { puesto: 'Trincador', grupo_salarial: 'G1', tipo_operativa: 'Trincador' },
        'trincador de coches': { puesto: 'Trincador de Coches', grupo_salarial: 'G1', tipo_operativa: 'Manual' },
        'conductor de coches': { puesto: 'Conductor de Coches', grupo_salarial: 'G2', tipo_operativa: 'Coches' },
        'conductor de 2a': { puesto: 'Conductor de 2a', grupo_salarial: 'G2', tipo_operativa: 'Coches' }
      };

      if (!mapeo) {
        // Intentar usar mapeo de fallback (búsqueda case-insensitive)
        if (mapeoFallback[puestoLower]) {
          mapeo = mapeoFallback[puestoLower];
          console.log(`ℹ️ Usando mapeo de fallback para: "${jornal.puesto}"`);
        } else {
          console.warn(`⚠️ Puesto no encontrado en mapeo: "${jornal.puesto}"`);
          if (index === 0) {
            console.log('Puestos disponibles en mapeo:', mapeoPuestos.map(m => m.puesto));
          }
          return { ...jornal, salario_base: 0, prima: 0, total: 0, error: 'Puesto no mapeado' };
        }
      }

      // Obtener grupo salarial y tipo de operativa
      let grupoSalarial = mapeo.grupo_salarial; // G1 o G2
      let tipoOperativa = mapeo.tipo_operativa; // Contenedor o Coches

      // Forzar valores correctos para Conductor de Coches (asegurar coherencia)
      if (puestoLower === 'conductor de coches' || puestoLower === 'conductor de 2a') {
        grupoSalarial = 'G2';
        tipoOperativa = 'Coches';
      }

      // Normalizar nombre de puesto para display
      let puestoDisplay = jornal.puesto;
      if (puestoLower === 'conductor de coches') {
        puestoDisplay = 'Conductor de 2a';
      }

      // 3.2 Determinar tipo de día
      const tipoDia = determinarTipoDia(jornal.fecha, jornada);

      // 3.3 Crear clave de jornada (ej: "08-14_LABORABLE")
      const claveJornada = `${jornada}_${tipoDia}`;

      // 3.4 Buscar en tabla salarial
      const salarioInfo = tablaSalarial.find(s => s.clave_jornada === claveJornada);

      if (!salarioInfo) {
        console.warn(`⚠️ Clave de jornada no encontrada: "${claveJornada}"`);
        if (index === 0) {
          console.log('Claves disponibles en tabla salarial:', tablaSalarial.map(t => t.clave_jornada));
        }
        return { ...jornal, salario_base: 0, prima: 0, total: 0, error: 'Jornada no encontrada' };
      }

      // Debug del primer jornal
      if (index === 0) {
        console.log('🔍 DEBUG PRIMER JORNAL:');
        console.log('  Jornal:', jornal);
        console.log('  Puesto original:', jornal.puesto);
        console.log('  Puesto normalizado:', puestoLower);
        console.log('  Mapeo encontrado:', mapeo);
        console.log('  Tipo día:', tipoDia);
        console.log('  Clave jornada:', claveJornada);
        console.log('  Salario info:', salarioInfo);
      }

      // 3.5 Detectar si es Conductor OC (sin barco)
      // OC usa "--" (dos guiones) en el campo buque
      const esConductorOC = puestoLower === 'conductor de 1a' &&
                            (!jornal.buque || jornal.buque.trim() === '' || jornal.buque.trim() === '--');

      let salarioBase = 0;
      let prima = 0;
      let esJornalFijo = false;

      // Tabla de primas mínimas para Trincador según horario y jornada
      const primasMinimaTrincador = {
        '02-08_FESTIVO': 203.719,
        '02-08_LABORABLE': 140.105,
        '02-08_SABADO': 140.105,
        '08-14_FESTIVO': 114.031,
        '08-14_LABORABLE': 88.822,
        '08-14_SABADO': 88.822,
        '14-20_FESTIVO': 144.967,
        '14-20_LABORABLE': 88.822,
        '14-20_SABADO': 114.031,
        '20-02_FESTIVO': 220.058,
        '20-02_LABORABLE': 112.287,
        '20-02_SABADO': 151.393
      };

      if (esConductorOC) {
        // Conductores OC tienen salarios fijos sin prima (solo laborables)
        esJornalFijo = true;
        const salariosOC = {
          '08-14': 179.75,
          '14-20': 179.75,
          '20-02': 253.75,
          '02-08': 321.75
        };

        salarioBase = salariosOC[jornada] || 0;
        prima = 0; // Sin prima para OC
      } else {
        // Cálculo normal para SP y Contenedor/Coches/Trincador
        salarioBase = grupoSalarial === 'G1' ? salarioInfo.jornal_base_g1 : salarioInfo.jornal_base_g2;

        // Añadir complemento de 46,94€ para Trincador y Trincador de Coches
        if (puestoLower === 'trincador' || puestoLower === 'trincador de coches') {
          salarioBase += 46.94;
          if (index === 0) {
            console.log(`✅ Complemento aplicado a "${jornal.puesto}": +46.94€`);
          }
        }

        // 3.6 Calcular prima (por defecto 120 movimientos para Contenedor)
        if (tipoOperativa === 'Coches') {
          // Para Coches: usar prima fija de la tabla
          prima = salarioInfo.prima_minima_coches;
          if (index === 0) {
            console.log(`🚗 Coches detectado - Prima: ${prima}€ (de prima_minima_coches)`);
          }
        } else if (tipoOperativa === 'Contenedor') {
          // A partir de 120 movimientos (>=120) se usa coef_mayor
          prima = 120 * salarioInfo.coef_prima_mayor120;
        } else if (tipoOperativa === 'Trincador') {
          // Para Trincador: usar prima mínima según horario y jornada
          const clavePrima = `${jornada}_${tipoDia}`;
          prima = primasMinimaTrincador[clavePrima] || 0;
          if (index === 0) {
            console.log(`🔧 Trincador detectado - Prima mínima: ${prima}€ (clave: ${clavePrima})`);
          }
        } else if (tipoOperativa === 'Manual') {
          // Para Manual (ej: Trincador de Coches): prima editable, iniciar en 0
          prima = 0;
          if (index === 0) {
            console.log(`✋ Manual detectado (${jornal.puesto}) - Prima editable iniciada en 0€`);
          }
        }
      }

      // 3.7 Total
      const total = salarioBase + prima;

      if (index === 0) {
        console.log('  Grupo salarial:', grupoSalarial);
        console.log('  Es Conductor OC:', esConductorOC);
        console.log('  Salario base:', salarioBase);
        console.log('  Prima (120 mov):', prima);
        console.log('  Total:', total);
      }

      // Detectar si incluye complemento para mostrar asterisco
      const incluyeComplemento = (puestoLower === 'trincador' || puestoLower === 'trincador de coches');

      return {
        ...jornal,
        puesto_display: puestoDisplay,
        salario_base: salarioBase,
        prima: prima,
        total: total,
        grupo_salarial: grupoSalarial,
        tipo_operativa: tipoOperativa,
        tipo_dia: tipoDia,
        clave_jornada: claveJornada,
        es_jornal_fijo: esJornalFijo,
        incluye_complemento: incluyeComplemento
      };
    });

    // 4. Calcular estadísticas globales
    const totalJornales = jornalesConSalario.length;
    const salarioTotalBruto = jornalesConSalario.reduce((sum, j) => sum + j.total, 0);
    const salarioTotalNeto = salarioTotalBruto * (1 - irpfPorcentaje / 100);
    const salarioPromedioBruto = salarioTotalBruto / totalJornales;
    const salarioPromedioNeto = salarioTotalNeto / totalJornales;

    // 5. Mostrar IRPF control y estadísticas
    if (irpfControl) {
      irpfControl.style.display = 'block';
    }

    stats.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${totalJornales}</div>
        <div class="stat-label">Jornales Totales (Anual)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--puerto-orange);">${salarioTotalBruto.toFixed(2)}€</div>
        <div class="stat-label">Total Bruto (Anual)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--puerto-green);">${salarioTotalNeto.toFixed(2)}€</div>
        <div class="stat-label">Total Neto (Anual - ${irpfPorcentaje}% IRPF)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: var(--puerto-orange);">${salarioPromedioBruto.toFixed(2)}€</div>
        <div class="stat-label">Promedio Bruto (Anual)</div>
      </div>
    `;

    // 6. Renderizar quincenas con salarios
    const quincenasArray = Array.from(quincenasMap.entries())
      .map(([key, jornalesQuincena]) => {
        const [year, month, quincena] = key.split('-').map(Number);
        return { year, month, quincena, jornales: jornalesQuincena };
      })
      .sort((a, b) => {
        // Ordenar por año, mes, quincena descendente
        if (a.year !== b.year) return b.year - a.year;
        if (a.month !== b.month) return b.month - a.month;
        return b.quincena - a.quincena;
      });

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Función auxiliar para calcular tarifa de horas de relevo
    const calcularTarifaRelevo = (jornada, tipoDia) => {
      // No hay relevo en 02-08
      if (jornada === '02-08') return null;

      // Tarifa especial para sábados 20-02 (20-21 sábado a 02-03 lunes)
      if (jornada === '20-02' && tipoDia === 'SABADO') {
        return 93.55;
      }

      // Tarifa normal para el resto de jornadas
      return 64.31;
    };

    // Función auxiliar para calcular tarifa de horas de remate (Grupo I por defecto)
    const calcularTarifaRemate = (jornada, tipoDia) => {
      const tarifasRemate = {
        '02-08': {
          'LABORABLE': 61.40,
          'FEST. A LAB.': 70.36,
          'FESTIVO': 110.57,
          'FEST. A FEST.': 120.53
        },
        '06-12': {
          'LABORABLE': 41.13,
          'FESTIVO': 60.92
        },
        '08-14': {
          'LABORABLE': 29.02,
          'SABADO': 52.24,
          'FESTIVO': 75.46
        },
        '14-20': {
          'LABORABLE': 43.51,
          'SABADO': 78.37,
          'FESTIVO': 110.99
        },
        '20-02': {
          'LABORABLE': 43.51,
          'LAB A FEST': 99.25,
          'SABADO': 76.85,
          'FEST. A LAB.': 88.20,
          'FEST. A FEST.': 99.60
        }
      };

      return tarifasRemate[jornada]?.[tipoDia] || null;
    };

    // Cargar valores bloqueados de localStorage
    const lockedValuesKey = `locked_values_${AppState.currentUser}`;
    let lockedValues = {};
    try {
      const stored = localStorage.getItem(lockedValuesKey);
      if (stored) {
        lockedValues = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error cargando valores bloqueados:', e);
    }

    // Función para guardar valores bloqueados
    const saveLockedValues = () => {
      localStorage.setItem(lockedValuesKey, JSON.stringify(lockedValues));
    };

    quincenasArray.forEach(({ year, month, quincena, jornales: jornalesQuincena }) => {
      const jornalesConSalarioQuincena = jornalesQuincena.map(j => {
        return jornalesConSalario.find(jcs =>
          jcs.fecha === j.fecha &&
          jcs.jornada === j.jornada &&
          jcs.puesto === j.puesto
        );
      }).filter(j => j);

      const totalQuincenaBruto = jornalesConSalarioQuincena.reduce((sum, j) => sum + j.total, 0);
      const totalQuincenaNeto = totalQuincenaBruto * (1 - irpfPorcentaje / 100);
      const totalBase = jornalesConSalarioQuincena.reduce((sum, j) => sum + j.salario_base, 0);
      const totalPrima = jornalesConSalarioQuincena.reduce((sum, j) => sum + j.prima, 0);

      // Verificar si hay jornales con complemento en esta quincena
      const tieneComplemento = jornalesConSalarioQuincena.some(j => j.incluye_complemento);

      // Verificar si hay jornales OC en esta quincena
      const tieneJornalesOC = jornalesConSalarioQuincena.some(j => j.es_jornal_fijo);
      const badgeCenso = tieneJornalesOC ? ' <span class="badge-oc">OC</span>' : ' <span class="badge-green">SP</span>';

      const quincenaLabel = quincena === 1 ? '1-15' : '16-fin';
      const monthName = monthNames[month - 1];
      const emoji = quincena === 1 ? '📅' : '🗓️';

      const card = document.createElement('div');
      card.className = 'quincena-card';
      card.innerHTML = `
        <div class="quincena-header">
          <h3>${emoji} ${quincenaLabel} ${monthName.toUpperCase()} ${year}</h3>
          <div class="quincena-total">
            <div class="total-box bruto-box">
              <div class="total-icon">💰</div>
              <div class="total-content">
                <div class="total-label">Total Bruto</div>
                <div class="total-value bruto-value">${totalQuincenaBruto.toFixed(2)}€</div>
              </div>
            </div>
            <div class="total-box neto-box">
              <div class="total-icon">💵</div>
              <div class="total-content">
                <div class="total-label">Total Neto (${irpfPorcentaje}%)</div>
                <div class="total-value neto-value">${totalQuincenaNeto.toFixed(2)}€</div>
              </div>
            </div>
          </div>
        </div>
        <div class="quincena-summary">
          <div class="summary-item">
            <span class="summary-label">Jornales:</span>
            <span class="summary-value">${jornalesConSalarioQuincena.length}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Base:</span>
            <span class="summary-value">${totalBase.toFixed(2)}€</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Prima:</span>
            <span class="summary-value">${totalPrima.toFixed(2)}€</span>
          </div>
        </div>
        <div class="jornales-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Jornada</th>
                <th>Puesto${badgeCenso}</th>
                <th>Base</th>
                <th>Movimientos</th>
                <th>Prima</th>
                <th>H. Relevo</th>
                <th>H. Remate</th>
                <th>Bruto</th>
                <th>Neto</th>
              </tr>
            </thead>
            <tbody id="tbody-${year}-${month}-${quincena}">
              ${jornalesConSalarioQuincena.map((j, idx) => {
                const rowId = `row-${year}-${month}-${quincena}-${idx}`;
                const lockKey = `${year}-${month}-${quincena}-${idx}`;

                // Cargar valores bloqueados o usar defaults
                const lockedData = lockedValues[lockKey] || {};
                const movimientosValue = lockedData.movimientos !== undefined ? lockedData.movimientos : 120;
                const primaValue = lockedData.prima !== undefined ? lockedData.prima : j.prima;
                const horasRelevoValue = lockedData.horasRelevo !== undefined ? lockedData.horasRelevo : 0;
                const horasRemateValue = lockedData.horasRemate !== undefined ? lockedData.horasRemate : 0;
                const movimientosLocked = lockedData.movimientosLocked || false;
                const primaLocked = lockedData.primaLocked || false;

                // Si hay valores bloqueados, recalcular el bruto con esos valores
                let primaRecalculada = primaLocked ? primaValue : j.prima;

                const esOC = j.es_jornal_fijo;

                // Calcular tarifa de relevo
                const tarifaRelevo = calcularTarifaRelevo(j.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), j.tipo_dia);
                const importeRelevo = tarifaRelevo ? (horasRelevoValue * tarifaRelevo) : 0;

                // Calcular tarifa de remate
                const tarifaRemate = calcularTarifaRemate(j.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), j.tipo_dia);
                const importeRemate = tarifaRemate ? (horasRemateValue * tarifaRemate) : 0;

                const bruto = j.salario_base + primaRecalculada + importeRelevo + importeRemate;
                const neto = bruto * (1 - irpfPorcentaje / 100);

                return `
                <tr id="${rowId}" data-row-index="${idx}" data-lock-key="${lockKey}">
                  <td>${j.fecha}</td>
                  <td><span class="badge badge-${j.jornada.replace(/\s+/g, '')}">${j.jornada}</span></td>
                  <td>${j.puesto_display}</td>
                  <td class="base-value">${j.salario_base.toFixed(2)}€${j.incluye_complemento ? '*' : ''}</td>
                  <td>
                    ${esOC ? `
                      <span class="text-muted">Fijo</span>
                    ` : j.tipo_operativa === 'Contenedor' && !esOC ? `
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <input
                          type="number"
                          class="movimientos-input"
                          value="${movimientosValue}"
                          min="0"
                          step="1"
                          data-jornal-index="${idx}"
                          ${movimientosLocked ? 'disabled' : ''}
                          style="${movimientosLocked ? 'opacity: 0.7; background: #f0f0f0;' : ''}"
                        />
                        <button class="lock-btn movimientos-lock-btn" data-jornal-index="${idx}" title="${movimientosLocked ? 'Desbloqueado' : 'Bloqueado'}">${movimientosLocked ? '🔒' : '🔓'}</button>
                      </div>
                    ` : `
                      <span class="text-muted">N/A</span>
                    `}
                  </td>
                  <td>
                    ${esOC ? `
                      <span class="text-muted">—</span>
                    ` : `
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <input
                          type="number"
                          class="prima-input"
                          value="${primaValue.toFixed(2)}"
                          min="0"
                          step="0.01"
                          data-jornal-index="${idx}"
                          ${primaLocked ? 'disabled' : ''}
                          style="${primaLocked ? 'opacity: 0.7; background: #f0f0f0;' : ''}"
                        />€
                        <button class="lock-btn prima-lock-btn" data-jornal-index="${idx}" title="${primaLocked ? 'Desbloqueado' : 'Bloqueado'}">${primaLocked ? '🔒' : '🔓'}</button>
                      </div>
                    `}
                  </td>
                  <td>
                    ${tarifaRelevo !== null ? `
                      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem;">
                        <label style="display: flex; align-items: center; cursor: pointer; margin: 0;">
                          <input
                            type="checkbox"
                            class="relevo-checkbox"
                            ${horasRelevoValue > 0 ? 'checked' : ''}
                            data-jornal-index="${idx}"
                            style="width: 20px; height: 20px; cursor: pointer; margin-right: 6px;"
                          />
                          <span style="white-space: nowrap;">1h (${tarifaRelevo.toFixed(2)}€)</span>
                        </label>
                      </div>
                      <div style="font-size: 0.75rem; color: #666; font-weight: 600;">= ${importeRelevo.toFixed(2)}€</div>
                    ` : `
                      <span class="text-muted">N/A</span>
                    `}
                  </td>
                  <td>
                    ${tarifaRemate !== null ? `
                      <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem;">
                        <select
                          class="remate-select"
                          data-jornal-index="${idx}"
                          style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.8rem; cursor: pointer;"
                        >
                          <option value="0" ${horasRemateValue === 0 ? 'selected' : ''}>0h</option>
                          <option value="1" ${horasRemateValue === 1 ? 'selected' : ''}>1h (${tarifaRemate.toFixed(2)}€)</option>
                          <option value="2" ${horasRemateValue === 2 ? 'selected' : ''}>2h (${(tarifaRemate * 2).toFixed(2)}€)</option>
                        </select>
                        <div style="font-size: 0.75rem; color: #666; font-weight: 600;">= ${importeRemate.toFixed(2)}€</div>
                      </div>
                    ` : `
                      <span class="text-muted">N/A</span>
                    `}
                  </td>
                  <td class="bruto-value"><strong>${bruto.toFixed(2)}€</strong></td>
                  <td class="neto-value"><strong>${neto.toFixed(2)}€</strong></td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
        ${tieneComplemento ? `
          <div class="complemento-nota" style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; padding: 0.5rem; background: #f9f9f9; border-radius: 4px;">
            <strong>*</strong> Los puestos Trincador y Trincador de Coches incluyen un complemento de 46,94€ en el salario base.
          </div>
        ` : ''}
      `;

      content.appendChild(card);

      // Función auxiliar para actualizar totales
      const actualizarTotales = () => {
        // Recalcular totales de la quincena
        const nuevoTotalBase = jornalesConSalarioQuincena.reduce((sum, j) => sum + j.salario_base, 0);
        const nuevoTotalPrima = jornalesConSalarioQuincena.reduce((sum, j) => sum + j.prima, 0);
        const nuevoTotalBruto = jornalesConSalarioQuincena.reduce((sum, j) => sum + j.total, 0);
        const nuevoTotalNeto = nuevoTotalBruto * (1 - irpfPorcentaje / 100);

        // Actualizar el resumen de la quincena
        const summaryItems = card.querySelectorAll('.summary-value');
        summaryItems[1].textContent = `${nuevoTotalBase.toFixed(2)}€`; // Base
        summaryItems[2].textContent = `${nuevoTotalPrima.toFixed(2)}€`; // Prima

        // Actualizar bruto y neto en el header
        const brutoValue = card.querySelector('.bruto-value');
        const netoValue = card.querySelector('.neto-value');
        if (brutoValue) brutoValue.textContent = `${nuevoTotalBruto.toFixed(2)}€`;
        if (netoValue) netoValue.textContent = `${nuevoTotalNeto.toFixed(2)}€`;

        // Recalcular estadísticas globales
        const totalGlobalBruto = jornalesConSalario.reduce((sum, j) => sum + j.total, 0);
        const totalGlobalNeto = totalGlobalBruto * (1 - irpfPorcentaje / 100);
        const promedioBruto = totalGlobalBruto / jornalesConSalario.length;

        const statCards = stats.querySelectorAll('.stat-card .stat-value');
        if (statCards.length >= 3) {
          statCards[1].textContent = `${totalGlobalBruto.toFixed(2)}€`; // Total Bruto
          statCards[2].textContent = `${totalGlobalNeto.toFixed(2)}€`; // Total Neto
          statCards[3].textContent = `${promedioBruto.toFixed(2)}€`; // Promedio Bruto
        }
      };

      // Event listener para inputs de movimientos
      card.querySelectorAll('.movimientos-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const movimientos = parseFloat(e.target.value) || 0;
          const jornalIndex = parseInt(e.target.dataset.jornalIndex);
          const jornal = jornalesConSalarioQuincena[jornalIndex];
          const row = e.target.closest('tr');
          const lockKey = row.dataset.lockKey;

          // Guardar movimientos en localStorage
          if (!lockedValues[lockKey]) lockedValues[lockKey] = {};
          lockedValues[lockKey].movimientos = movimientos;
          saveLockedValues();

          // Recalcular prima según movimientos (solo si no está bloqueada)
          const primaInput = row.querySelector('.prima-input');
          const primaLockBtn = row.querySelector('.prima-lock-btn');
          const primaLocked = primaLockBtn && primaLockBtn.textContent === '🔒';

          let nuevaPrima = 0;
          const salarioInfo = tablaSalarial.find(s => s.clave_jornada === jornal.clave_jornada);

          if (salarioInfo && jornal.tipo_operativa === 'Contenedor' && !primaLocked) {
            // A partir de 120 movimientos (>=120) se usa coef_mayor
            if (movimientos < 120) {
              nuevaPrima = movimientos * salarioInfo.coef_prima_menor120;
            } else {
              nuevaPrima = movimientos * salarioInfo.coef_prima_mayor120;
            }
            // Actualizar el input de prima también
            if (primaInput) primaInput.value = nuevaPrima.toFixed(2);
            jornal.prima = nuevaPrima;
          } else {
            nuevaPrima = parseFloat(primaInput?.value || 0);
          }

          // Calcular horas de relevo
          const relevoCheckbox = row.querySelector('.relevo-checkbox');
          const horasRelevo = relevoCheckbox?.checked ? 1 : 0;
          const tarifaRelevo = calcularTarifaRelevo(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRelevo = tarifaRelevo ? (horasRelevo * tarifaRelevo) : 0;

          // Calcular horas de remate
          const remateSelect = row.querySelector('.remate-select');
          const horasRemate = remateSelect ? parseInt(remateSelect.value) : 0;
          const tarifaRemate = calcularTarifaRemate(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRemate = tarifaRemate ? (horasRemate * tarifaRemate) : 0;

          const nuevoTotal = jornal.salario_base + nuevaPrima + importeRelevo + importeRemate;
          const nuevoNeto = nuevoTotal * (1 - irpfPorcentaje / 100);

          // Actualizar la fila con animación
          row.classList.add('updating');
          setTimeout(() => row.classList.remove('updating'), 600);

          row.querySelector('.bruto-value strong').textContent = `${nuevoTotal.toFixed(2)}€`;
          row.querySelector('.neto-value strong').textContent = `${nuevoNeto.toFixed(2)}€`;

          // Actualizar el jornal en el array
          jornal.total = nuevoTotal;

          actualizarTotales();
        });
      });

      // Event listener para inputs de prima
      card.querySelectorAll('.prima-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const nuevaPrima = parseFloat(e.target.value) || 0;
          const jornalIndex = parseInt(e.target.dataset.jornalIndex);
          const jornal = jornalesConSalarioQuincena[jornalIndex];
          const row = e.target.closest('tr');
          const lockKey = row.dataset.lockKey;

          // Guardar prima en localStorage
          if (!lockedValues[lockKey]) lockedValues[lockKey] = {};
          lockedValues[lockKey].prima = nuevaPrima;
          saveLockedValues();

          // NUEVO: Recalcular movimientos basado en la prima (si es operativa de contenedor)
          const movimientosInput = row.querySelector('.movimientos-input');
          const movimientosLockBtn = row.querySelector('.movimientos-lock-btn');
          const movimientosLocked = movimientosLockBtn && movimientosLockBtn.textContent === '🔒';

          if (movimientosInput && jornal.tipo_operativa === 'Contenedor' && !movimientosLocked) {
            const salarioInfo = tablaSalarial.find(s => s.clave_jornada === jornal.clave_jornada);

            if (salarioInfo) {
              // Calcular movimientos a partir de prima (inverso de la fórmula)
              // Primero intentar con coeficiente menor (<120)
              const movimientosMenor = nuevaPrima / salarioInfo.coef_prima_menor120;

              let movimientosCalculados;
              if (movimientosMenor < 120) {
                // Si los movimientos calculados son < 120, usar ese coeficiente
                movimientosCalculados = Math.round(movimientosMenor);
              } else {
                // Si no, usar coeficiente mayor (>=120)
                movimientosCalculados = Math.round(nuevaPrima / salarioInfo.coef_prima_mayor120);
              }

              // Actualizar input de movimientos
              movimientosInput.value = movimientosCalculados;

              // Guardar en localStorage
              if (!lockedValues[lockKey]) lockedValues[lockKey] = {};
              lockedValues[lockKey].movimientos = movimientosCalculados;
              saveLockedValues();
            }
          }

          // Calcular horas de relevo
          const relevoCheckbox = row.querySelector('.relevo-checkbox');
          const horasRelevo = relevoCheckbox?.checked ? 1 : 0;
          const tarifaRelevo = calcularTarifaRelevo(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRelevo = tarifaRelevo ? (horasRelevo * tarifaRelevo) : 0;

          // Calcular horas de remate
          const remateSelect = row.querySelector('.remate-select');
          const horasRemate = remateSelect ? parseInt(remateSelect.value) : 0;
          const tarifaRemate = calcularTarifaRemate(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRemate = tarifaRemate ? (horasRemate * tarifaRemate) : 0;

          const nuevoTotal = jornal.salario_base + nuevaPrima + importeRelevo + importeRemate;
          const nuevoNeto = nuevoTotal * (1 - irpfPorcentaje / 100);

          // Actualizar la fila con animación
          row.classList.add('updating');
          setTimeout(() => row.classList.remove('updating'), 600);

          row.querySelector('.bruto-value strong').textContent = `${nuevoTotal.toFixed(2)}€`;
          row.querySelector('.neto-value strong').textContent = `${nuevoNeto.toFixed(2)}€`;

          // Actualizar el jornal en el array
          jornal.prima = nuevaPrima;
          jornal.total = nuevoTotal;

          actualizarTotales();
        });
      });

      // Event listener para checkboxes de horas de relevo
      card.querySelectorAll('.relevo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const horasRelevo = e.target.checked ? 1 : 0;
          const jornalIndex = parseInt(e.target.dataset.jornalIndex);
          const jornal = jornalesConSalarioQuincena[jornalIndex];
          const row = e.target.closest('tr');
          const lockKey = row.dataset.lockKey;

          // Guardar horas de relevo en localStorage
          if (!lockedValues[lockKey]) lockedValues[lockKey] = {};
          lockedValues[lockKey].horasRelevo = horasRelevo;
          saveLockedValues();

          // Calcular tarifa de relevo
          const tarifaRelevo = calcularTarifaRelevo(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRelevo = tarifaRelevo ? (horasRelevo * tarifaRelevo) : 0;

          // Obtener prima actual
          const primaInput = row.querySelector('.prima-input');
          const prima = parseFloat(primaInput?.value || 0);

          // Obtener horas de remate actuales
          const remateSelect = row.querySelector('.remate-select');
          const horasRemate = remateSelect ? parseInt(remateSelect.value) : 0;
          const tarifaRemate = calcularTarifaRemate(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRemate = tarifaRemate ? (horasRemate * tarifaRemate) : 0;

          const nuevoTotal = jornal.salario_base + prima + importeRelevo + importeRemate;
          const nuevoNeto = nuevoTotal * (1 - irpfPorcentaje / 100);

          // Actualizar la fila con animación
          row.classList.add('updating');
          setTimeout(() => row.classList.remove('updating'), 600);

          // Actualizar el importe de relevo mostrado
          const importeRelevoText = row.querySelector('td:nth-child(7) > div:last-child');
          if (importeRelevoText) {
            importeRelevoText.textContent = `= ${importeRelevo.toFixed(2)}€`;
          }

          row.querySelector('.bruto-value strong').textContent = `${nuevoTotal.toFixed(2)}€`;
          row.querySelector('.neto-value strong').textContent = `${nuevoNeto.toFixed(2)}€`;

          // Actualizar el jornal en el array
          jornal.total = nuevoTotal;

          actualizarTotales();
        });
      });

      // Event listener para selector de horas de remate
      card.querySelectorAll('.remate-select').forEach(select => {
        select.addEventListener('change', (e) => {
          const horasRemate = parseInt(e.target.value);
          const jornalIndex = parseInt(e.target.dataset.jornalIndex);
          const jornal = jornalesConSalarioQuincena[jornalIndex];
          const row = e.target.closest('tr');
          const lockKey = row.dataset.lockKey;

          // Guardar horas de remate en localStorage
          if (!lockedValues[lockKey]) lockedValues[lockKey] = {};
          lockedValues[lockKey].horasRemate = horasRemate;
          saveLockedValues();

          // Calcular tarifa de remate
          const tarifaRemate = calcularTarifaRemate(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRemate = tarifaRemate ? (horasRemate * tarifaRemate) : 0;

          // Obtener prima actual
          const primaInput = row.querySelector('.prima-input');
          const prima = parseFloat(primaInput?.value || 0);

          // Obtener horas de relevo actuales
          const relevoCheckbox = row.querySelector('.relevo-checkbox');
          const horasRelevo = relevoCheckbox?.checked ? 1 : 0;
          const tarifaRelevo = calcularTarifaRelevo(jornal.jornada.replace(/\s+a\s+/g, '-').replace(/\s+/g, ''), jornal.tipo_dia);
          const importeRelevo = tarifaRelevo ? (horasRelevo * tarifaRelevo) : 0;

          const nuevoTotal = jornal.salario_base + prima + importeRelevo + importeRemate;
          const nuevoNeto = nuevoTotal * (1 - irpfPorcentaje / 100);

          // Actualizar la fila con animación
          row.classList.add('updating');
          setTimeout(() => row.classList.remove('updating'), 600);

          // Actualizar el importe de remate mostrado
          const importeRemateText = row.querySelector('td:nth-child(8) > div > div:last-child');
          if (importeRemateText) {
            importeRemateText.textContent = `= ${importeRemate.toFixed(2)}€`;
          }

          row.querySelector('.bruto-value strong').textContent = `${nuevoTotal.toFixed(2)}€`;
          row.querySelector('.neto-value strong').textContent = `${nuevoNeto.toFixed(2)}€`;

          // Actualizar el jornal en el array
          jornal.total = nuevoTotal;

          actualizarTotales();
        });
      });

      // Event listener para botones de candado de movimientos
      card.querySelectorAll('.movimientos-lock-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const jornalIndex = parseInt(e.target.dataset.jornalIndex);
          const row = e.target.closest('tr');
          const lockKey = row.dataset.lockKey;
          const movimientosInput = row.querySelector('.movimientos-input');
          const primaInput = row.querySelector('.prima-input');
          const primaLockBtn = row.querySelector('.prima-lock-btn');

          // Toggle lock
          if (!lockedValues[lockKey]) lockedValues[lockKey] = {};
          const isLocked = lockedValues[lockKey].movimientosLocked || false;
          lockedValues[lockKey].movimientosLocked = !isLocked;
          lockedValues[lockKey].primaLocked = !isLocked; // Sincronizar con prima
          lockedValues[lockKey].movimientos = parseFloat(movimientosInput.value) || 120;
          lockedValues[lockKey].prima = parseFloat(primaInput.value) || 0;
          saveLockedValues();

          // Actualizar UI de movimientos
          btn.textContent = !isLocked ? '🔒' : '🔓';
          btn.title = !isLocked ? 'Bloqueado - Click para desbloquear' : 'Desbloqueado - Click para bloquear';
          movimientosInput.disabled = !isLocked;
          movimientosInput.style.opacity = !isLocked ? '0.7' : '1';
          movimientosInput.style.background = !isLocked ? '#f0f0f0' : '';

          // Actualizar UI de prima también
          if (primaLockBtn) {
            primaLockBtn.textContent = !isLocked ? '🔒' : '🔓';
            primaLockBtn.title = !isLocked ? 'Bloqueado - Click para desbloquear' : 'Desbloqueado - Click para bloquear';
          }
          if (primaInput) {
            primaInput.disabled = !isLocked;
            primaInput.style.opacity = !isLocked ? '0.7' : '1';
            primaInput.style.background = !isLocked ? '#f0f0f0' : '';
          }

          console.log(`${!isLocked ? '🔒' : '🔓'} Movimientos y prima ${!isLocked ? 'bloqueados' : 'desbloqueados'} para ${lockKey}`);
        });
      });

      // Event listener para botones de candado de prima
      card.querySelectorAll('.prima-lock-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const jornalIndex = parseInt(e.target.dataset.jornalIndex);
          const row = e.target.closest('tr');
          const lockKey = row.dataset.lockKey;
          const primaInput = row.querySelector('.prima-input');
          const movimientosInput = row.querySelector('.movimientos-input');
          const movimientosLockBtn = row.querySelector('.movimientos-lock-btn');

          // Toggle lock
          if (!lockedValues[lockKey]) lockedValues[lockKey] = {};
          const isLocked = lockedValues[lockKey].primaLocked || false;
          lockedValues[lockKey].primaLocked = !isLocked;
          lockedValues[lockKey].movimientosLocked = !isLocked; // Sincronizar con movimientos
          lockedValues[lockKey].prima = parseFloat(primaInput.value) || 0;
          if (movimientosInput) {
            lockedValues[lockKey].movimientos = parseFloat(movimientosInput.value) || 120;
          }
          saveLockedValues();

          // Actualizar UI de prima
          btn.textContent = !isLocked ? '🔒' : '🔓';
          btn.title = !isLocked ? 'Bloqueado - Click para desbloquear' : 'Desbloqueado - Click para bloquear';
          primaInput.disabled = !isLocked;
          primaInput.style.opacity = !isLocked ? '0.7' : '1';
          primaInput.style.background = !isLocked ? '#f0f0f0' : '';

          // Actualizar UI de movimientos también
          if (movimientosLockBtn) {
            movimientosLockBtn.textContent = !isLocked ? '🔒' : '🔓';
            movimientosLockBtn.title = !isLocked ? 'Bloqueado - Click para desbloquear' : 'Desbloqueado - Click para bloquear';
          }
          if (movimientosInput) {
            movimientosInput.disabled = !isLocked;
            movimientosInput.style.opacity = !isLocked ? '0.7' : '1';
            movimientosInput.style.background = !isLocked ? '#f0f0f0' : '';
          }

          console.log(`${!isLocked ? '🔒' : '🔓'} Prima y movimientos ${!isLocked ? 'bloqueados' : 'desbloqueados'} para ${lockKey}`);
        });
      });
    });

    // Función para actualizar IRPF y persistir en localStorage y Sheets
    const actualizarIRPF = async (e) => {
      const nuevoIRPF = parseFloat(e.target.value) || 0;

      // Validar rango (0-50%)
      if (nuevoIRPF < 0 || nuevoIRPF > 50) {
        alert('El porcentaje de IRPF debe estar entre 0% y 50%');
        e.target.value = irpfPorcentaje;
        return;
      }

      // No hacer nada si el valor no cambió
      if (nuevoIRPF === irpfPorcentaje) {
        return;
      }

      // Guardar en Google Sheets
      const guardadoEnSheets = await SheetsAPI.saveUserConfig(AppState.currentUser, nuevoIRPF);
      if (guardadoEnSheets) {
        console.log('✅ IRPF guardado en Sheets correctamente');
      }

      // Guardar en localStorage
      localStorage.setItem(irpfKey, nuevoIRPF.toString());
      irpfPorcentaje = nuevoIRPF;

      console.log(`💰 IRPF actualizado y guardado: ${nuevoIRPF}%`);
      console.log(`💾 Guardado en localStorage con clave: ${irpfKey}`);

      // Actualizar todos los valores neto sin recargar la página
      // 1. Actualizar estadísticas globales
      const totalGlobalBruto = jornalesConSalario.reduce((sum, j) => sum + j.total, 0);
      const totalGlobalNeto = totalGlobalBruto * (1 - irpfPorcentaje / 100);

      const statCards = stats.querySelectorAll('.stat-card .stat-value');
      if (statCards.length >= 3) {
        statCards[2].textContent = `${totalGlobalNeto.toFixed(2)}€`; // Total Neto
        // Actualizar label con nuevo %
        const netoLabel = stats.querySelectorAll('.stat-card .stat-label')[2];
        if (netoLabel) netoLabel.textContent = `Total Neto (${irpfPorcentaje}% IRPF)`;
      }

      // 2. Actualizar todas las filas de jornales y totales de quincena
      document.querySelectorAll('.quincena-card').forEach(card => {
        // Actualizar todas las filas de la tabla
        card.querySelectorAll('tbody tr').forEach(row => {
          const brutoElement = row.querySelector('.bruto-value strong');
          if (brutoElement) {
            const bruto = parseFloat(brutoElement.textContent.replace('€', ''));
            const neto = bruto * (1 - irpfPorcentaje / 100);
            const netoElement = row.querySelector('.neto-value strong');
            if (netoElement) {
              netoElement.textContent = `${neto.toFixed(2)}€`;
            }
          }
        });

        // Actualizar totales de la quincena en el header
        const brutoValueElement = card.querySelector('.quincena-total .bruto-value');
        if (brutoValueElement) {
          const totalBruto = parseFloat(brutoValueElement.textContent.replace('€', ''));
          const totalNeto = totalBruto * (1 - irpfPorcentaje / 100);
          const netoValueElement = card.querySelector('.quincena-total .neto-value');
          if (netoValueElement) {
            netoValueElement.textContent = `${totalNeto.toFixed(2)}€`;
          }
        }
      });
    };

    // Event listeners para cambios en IRPF
    if (irpfInput) {
      // Evento 'change' - cuando el usuario presiona Enter o cambia de campo
      irpfInput.addEventListener('change', actualizarIRPF);

      // Evento 'blur' - cuando el usuario sale del input (más robusto)
      irpfInput.addEventListener('blur', actualizarIRPF);
    }

    // Event listener para botón de candado de IRPF
    if (irpfLockBtn && irpfInput) {
      irpfLockBtn.addEventListener('click', (e) => {
        e.preventDefault();
        irpfLocked = !irpfLocked;
        localStorage.setItem(irpfLockKey, irpfLocked.toString());

        // Actualizar UI del botón
        irpfLockBtn.textContent = irpfLocked ? '🔒' : '🔓';
        irpfLockBtn.title = irpfLocked ? 'IRPF bloqueado - Click para desbloquear' : 'IRPF desbloqueado - Click para bloquear';

        // Actualizar UI del input
        irpfInput.disabled = irpfLocked;
        if (irpfLocked) {
          irpfInput.style.opacity = '0.7';
          irpfInput.style.background = '#f0f0f0';
          irpfInput.style.cursor = 'not-allowed';
        } else {
          irpfInput.style.opacity = '1';
          irpfInput.style.background = 'white';
          irpfInput.style.cursor = '';
        }

        console.log(`🔒 IRPF ${irpfLocked ? 'bloqueado' : 'desbloqueado'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error cargando Sueldómetro:', error);
    content.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Error al cargar datos</h3>
        <p>${error.message}</p>
      </div>
    `;
  } finally {
    loading.classList.add('hidden');
  }
}

/**
 * Inicializar funcionalidad de añadir jornal manual
 */
function initAddJornalManual() {
  const addBtn = document.getElementById('add-jornal-btn');
  const modal = document.getElementById('add-jornal-modal');
  const closeBtn = document.getElementById('close-jornal-modal');
  const cancelBtn = document.getElementById('cancel-jornal');
  const saveBtn = document.getElementById('save-jornal');

  const fechaInput = document.getElementById('jornal-fecha');
  const jornadaSelect = document.getElementById('jornal-jornada');
  const puestoSelect = document.getElementById('jornal-puesto');
  const puestoOtroGroup = document.getElementById('jornal-puesto-otro-group');
  const puestoOtroInput = document.getElementById('jornal-puesto-otro');
  const empresaInput = document.getElementById('jornal-empresa');
  const buqueInput = document.getElementById('jornal-buque');
  const parteInput = document.getElementById('jornal-parte');

  const errorMsg = document.getElementById('jornal-error');
  const successMsg = document.getElementById('jornal-success');

  if (!addBtn || !modal) return;

  // Abrir modal
  addBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    // Limpiar formulario
    fechaInput.value = '';
    jornadaSelect.value = '';
    puestoSelect.value = '';
    puestoOtroGroup.style.display = 'none';
    puestoOtroInput.value = '';
    empresaInput.value = '';
    buqueInput.value = '';
    parteInput.value = '';
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
    successMsg.textContent = '';
    successMsg.style.display = 'none';
  });

  // Cerrar modal
  const cerrarModal = () => {
    modal.style.display = 'none';
  };

  closeBtn.addEventListener('click', cerrarModal);
  cancelBtn.addEventListener('click', cerrarModal);

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Mostrar/ocultar campo "Otro puesto"
  puestoSelect.addEventListener('change', () => {
    if (puestoSelect.value === 'otro') {
      puestoOtroGroup.style.display = 'block';
    } else {
      puestoOtroGroup.style.display = 'none';
    }
  });

  // Guardar jornal
  saveBtn.addEventListener('click', async () => {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // Validar campos obligatorios
    if (!fechaInput.value || !jornadaSelect.value || !puestoSelect.value || !empresaInput.value) {
      errorMsg.textContent = 'Por favor, completa todos los campos obligatorios (*)';
      errorMsg.style.display = 'block';
      return;
    }

    // Obtener puesto final
    let puestoFinal = puestoSelect.value;
    if (puestoFinal === 'otro') {
      if (!puestoOtroInput.value.trim()) {
        errorMsg.textContent = 'Por favor, especifica el puesto';
        errorMsg.style.display = 'block';
        return;
      }
      puestoFinal = puestoOtroInput.value.trim();
    }

    // Formatear fecha a DD/MM/YYYY
    const fechaParts = fechaInput.value.split('-'); // YYYY-MM-DD
    const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;

    // Crear objeto jornal
    const nuevoJornal = {
      fecha: fechaFormateada,
      jornada: jornadaSelect.value,
      puesto: puestoFinal,
      empresa: empresaInput.value.trim(),
      buque: buqueInput.value.trim() || '--',
      parte: parteInput.value || '1',
      manual: true // Marcar como añadido manualmente
    };

    console.log('💾 Guardando jornal manual:', nuevoJornal);

    try {
      // Guardar en localStorage
      let historico = JSON.parse(localStorage.getItem('jornales_historico') || '[]');

      // Verificar duplicados
      const existe = historico.some(j =>
        j.fecha === nuevoJornal.fecha &&
        j.jornada === nuevoJornal.jornada &&
        j.puesto === nuevoJornal.puesto
      );

      if (existe) {
        errorMsg.textContent = 'Ya existe un jornal con estos datos';
        errorMsg.style.display = 'block';
        return;
      }

      // Añadir nuevo jornal
      historico.push(nuevoJornal);

      // Ordenar por fecha (más recientes primero)
      historico.sort((a, b) => {
        const [dA, mA, yA] = a.fecha.split('/');
        const [dB, mB, yB] = b.fecha.split('/');
        const dateA = new Date(yA, mA - 1, dA);
        const dateB = new Date(yB, mB - 1, dB);
        return dateB - dateA;
      });

      // Guardar en localStorage
      localStorage.setItem('jornales_historico', JSON.stringify(historico));

      console.log('✅ Jornal guardado correctamente');

      // Mostrar mensaje de éxito
      successMsg.textContent = '✅ Jornal añadido correctamente';
      successMsg.style.display = 'block';

      // Recargar automáticamente las vistas
      setTimeout(async () => {
        // Recargar Mis Jornales si estamos en esa página
        if (document.getElementById('page-jornales').classList.contains('active')) {
          await loadJornales();
        }

        cerrarModal();
      }, 1500);

    } catch (error) {
      console.error('❌ Error guardando jornal:', error);
      errorMsg.textContent = 'Error al guardar el jornal. Inténtalo de nuevo.';
      errorMsg.style.display = 'block';
    }
  });
}

/**
 * Inicializa el modal para reportar jornales faltantes
 */
function initReportJornal() {
  const modal = document.getElementById('report-jornal-modal');
  const closeBtn = document.getElementById('close-report-modal');
  const cancelBtn = document.getElementById('cancel-report');
  const sendBtn = document.getElementById('send-report');

  const chapaInput = document.getElementById('report-chapa');
  const fechaInput = document.getElementById('report-fecha');
  const puestoSelect = document.getElementById('report-puesto');
  const puestoOtroGroup = document.getElementById('report-puesto-otro-group');
  const puestoOtroInput = document.getElementById('report-puesto-otro');
  const jornadaSelect = document.getElementById('report-jornada');
  const empresaInput = document.getElementById('report-empresa');
  const buqueInput = document.getElementById('report-buque');
  const parteInput = document.getElementById('report-parte');

  const errorMsg = document.getElementById('report-error');
  const successMsg = document.getElementById('report-success');

  if (!modal) return;

  // Llenar chapa del usuario actual
  const fillChapa = () => {
    if (AppState.currentUser && chapaInput) {
      chapaInput.value = AppState.currentUser;
    }
  };

  // Mostrar campo "otro" si se selecciona
  puestoSelect.addEventListener('change', () => {
    if (puestoSelect.value === 'otro') {
      puestoOtroGroup.style.display = 'block';
      puestoOtroInput.required = true;
    } else {
      puestoOtroGroup.style.display = 'none';
      puestoOtroInput.required = false;
      puestoOtroInput.value = '';
    }
  });

  // Cerrar modal
  const cerrarModal = () => {
    modal.style.display = 'none';
    // Limpiar formulario
    fechaInput.value = '';
    puestoSelect.value = '';
    puestoOtroGroup.style.display = 'none';
    puestoOtroInput.value = '';
    jornadaSelect.value = '';
    empresaInput.value = '';
    buqueInput.value = '';
    parteInput.value = '1';
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
  };

  closeBtn.addEventListener('click', cerrarModal);
  cancelBtn.addEventListener('click', cerrarModal);

  // Cerrar al hacer click fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  // Cuando se abre el modal, llenar la chapa
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'style') {
        if (modal.style.display === 'flex') {
          fillChapa();
        }
      }
    });
  });

  observer.observe(modal, { attributes: true });

  // Enviar reporte
  sendBtn.addEventListener('click', async () => {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // Validar campos requeridos
    if (!fechaInput.value || !chapaInput.value || !puestoSelect.value ||
        !jornadaSelect.value || !empresaInput.value || !parteInput.value) {
      errorMsg.textContent = 'Por favor, completa todos los campos obligatorios (*)';
      errorMsg.style.display = 'block';
      return;
    }

    // Determinar puesto final
    let puestoFinal = puestoSelect.value;
    if (puestoSelect.value === 'otro') {
      if (!puestoOtroInput.value.trim()) {
        errorMsg.textContent = 'Por favor, especifica el puesto';
        errorMsg.style.display = 'block';
        return;
      }
      puestoFinal = puestoOtroInput.value.trim();
    }

    // Formatear fecha a DD/MM/YYYY
    const [year, month, day] = fechaInput.value.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    // Crear cuerpo del email en formato tabular (separado por tabulaciones)
    const emailSubject = `Jornal Faltante - Chapa ${chapaInput.value}`;
    const emailBody = `Jornal Faltante Reportado:

Fecha\tChapa\tPuesto_Contratacion\tJornada\tEmpresa\tBuque\tParte
${fechaFormateada}\t${chapaInput.value}\t${puestoFinal}\t${jornadaSelect.value}\t${empresaInput.value}\t${buqueInput.value.trim() || '--'}\t${parteInput.value}

---
Para copiar a la hoja de cálculo:
${fechaFormateada}\t${chapaInput.value}\t${puestoFinal}\t${jornadaSelect.value}\t${empresaInput.value}\t${buqueInput.value.trim() || '--'}\t${parteInput.value}

Enviado desde Portal Estiba VLC`;

    try {
      // Crear enlace mailto
      const mailtoLink = `mailto:portalestibavlc@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // Abrir cliente de correo
      window.location.href = mailtoLink;

      // Mostrar mensaje de éxito
      successMsg.textContent = '✅ Se ha abierto tu cliente de correo. Por favor, envía el email.';
      successMsg.style.display = 'block';

      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        cerrarModal();
      }, 3000);

    } catch (error) {
      console.error('❌ Error creando email:', error);
      errorMsg.textContent = 'Error al crear el email. Inténtalo de nuevo.';
      errorMsg.style.display = 'block';
    }
  });
}

/**
 * Inicializa funcionalidades mejoradas del foro
 */
function initForoEnhanced() {
  const sendBtn = document.getElementById('foro-send');
  const foroInput = document.getElementById('foro-input');
  const charCount = document.getElementById('foro-char-count');

  if (!sendBtn || !foroInput) return;

  // Evento de enviar mensaje
  sendBtn.addEventListener('click', sendForoMessage);

  // Enviar con Ctrl+Enter o Cmd+Enter
  foroInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendForoMessage();
    }
  });

  // Contador de caracteres
  foroInput.addEventListener('input', () => {
    const length = foroInput.value.length;
    if (charCount) {
      charCount.textContent = `${length}/500`;

      if (length > 500) {
        charCount.classList.add('error');
        charCount.classList.remove('warning');
        sendBtn.disabled = true;
      } else if (length > 450) {
        charCount.classList.add('warning');
        charCount.classList.remove('error');
        sendBtn.disabled = false;
      } else {
        charCount.classList.remove('warning', 'error');
        sendBtn.disabled = false;
      }
    }
  });
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initAddJornalManual();
  initReportJornal();
  initForoEnhanced();
});






