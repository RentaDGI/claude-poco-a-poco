/**
 * APPS SCRIPT PORTAL POCO A POCO - VERSIÓN COMPLETA
 *
 * Funcionalidades:
 * 1. Gestión de mensajes del foro
 *    - Agregar mensajes con anti-duplicados
 *    - Corrección automática de orden de columnas
 *    - Limpieza de mensajes duplicados/vacíos
 * 2. Cambio de contraseñas
 * 3. Importación CSV automática cada 5 min + pivot a histórico (SIN DUPLICADOS)
 * 4. Gestión de IRPF personalizado
 * 5. Gestión de primas personalizadas (prima, movimientos, relevo, remate)
 * 6. Gestión de jornales manuales (persistencia permanente)
 */

const CONFIG = {
  HOJAS: {
    FORO: 'Foro',
    USUARIOS: 'Usuarios',
    CONFIGURACION_USUARIO: 'Configuracion_Usuario',
    PRIMAS_PERSONALIZADAS: 'Primas_Personalizadas',
    JORNALES_MANUALES: 'Jornales_Manuales',
    CONTRATA_GLIDE: 'contrata_glide',
    JORNALES_HISTORICO: 'Jornales_Historico_Acumulado'
  },
  CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTtbkA94xqjf81lsR7bLKKtyES2YBDKs8J2T4UrSEan7e5Z_eaptShCA78R1wqUyYyASJxmHj3gDnY/pub?output=csv&gid=1388412839'
};

// ============================================================================
// ENDPOINT PRINCIPAL
// ============================================================================
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonResponse(false, null, 'No se recibieron datos');
    }

    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    Logger.log(`📥 Acción recibida: ${action}`);

    const handlers = {
      'addMessage': addMessage,
      'changePassword': changePassword,
      'saveUserConfig': saveUserConfig,
      'getUserConfig': getUserConfig,
      'savePrimaPersonalizada': savePrimaPersonalizada,
      'getPrimasPersonalizadas': getPrimasPersonalizadas,
      'saveJornalManual': saveJornalManual,
      'getJornalesManuales': getJornalesManuales
    };

    const handler = handlers[action];
    if (!handler) {
      return jsonResponse(false, null, `Acción no válida: ${action}`);
    }

    const result = handler(params);
    return result;

  } catch (error) {
    Logger.log('❌ Error en doPost: ' + error);
    return jsonResponse(false, null, error.toString());
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Apps Script funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '3.0-completo'
  })).setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(success, data, message = '') {
  return ContentService.createTextOutput(JSON.stringify({
    success: success,
    data: data,
    message: message
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 1. FORO - Mensajes
// ============================================================================
function addMessage(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.FORO);

    if (!sheet) {
      throw new Error('Hoja "Foro" no encontrada');
    }

    const { chapa, texto } = params;
    const timestamp = new Date().toISOString();

    // Anti-duplicados (5 min)
    const data = sheet.getDataRange().getValues();
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    for (let i = data.length - 1; i >= Math.max(1, data.length - 20); i--) {
      const [rowTime, rowChapa, rowText] = data[i];
      if (rowChapa === chapa && rowText === texto && new Date(rowTime) >= fiveMinAgo) {
        Logger.log('⚠️ Mensaje duplicado ignorado');
        return jsonResponse(true, { isDuplicate: true }, 'Duplicado ignorado');
      }
    }

    // ORDEN CORRECTO: timestamp, chapa, texto
    sheet.appendRow([timestamp, chapa, texto]);
    Logger.log(`✅ Mensaje añadido: ${chapa}`);
    return jsonResponse(true, null, 'Mensaje agregado');

  } catch (error) {
    Logger.log('❌ addMessage: ' + error);
    return jsonResponse(false, null, error.toString());
  }
}

/**
 * Detecta y corrige mensajes del foro con columnas en orden incorrecto
 * Orden correcto: [timestamp, chapa, texto]
 * Orden incorrecto: [chapa, timestamp, texto]
 */
function corregirOrdenColumnasForo() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.FORO);

    if (!sheet) {
      throw new Error('Hoja "Foro" no encontrada');
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 1) {
      Logger.log('ℹ️ Hoja vacía');
      return { success: true, corregidas: 0 };
    }

    const data = sheet.getDataRange().getValues();
    let corregidas = 0;

    // Empezar desde la fila 1 (índice 0 en el array)
    for (let i = 0; i < data.length; i++) {
      const [col1, col2, col3] = data[i];

      // Detectar orden incorrecto:
      // - col1 es un número (chapa) en lugar de timestamp ISO
      // - col2 es un timestamp ISO en lugar de número (chapa)
      const col1Str = String(col1).trim();
      const col2Str = String(col2).trim();

      // Si col1 es solo dígitos (chapa) y col2 parece timestamp ISO
      const col1EsNumero = /^\d+$/.test(col1Str);
      const col2EsTimestamp = /^\d{4}-\d{2}-\d{2}T/.test(col2Str);

      if (col1EsNumero && col2EsTimestamp) {
        // Orden incorrecto detectado: [chapa, timestamp, texto]
        // Corregir a: [timestamp, chapa, texto]
        const timestamp = col2;
        const chapa = col1;
        const texto = col3;

        sheet.getRange(i + 1, 1).setValue(timestamp);
        sheet.getRange(i + 1, 2).setValue(chapa);
        sheet.getRange(i + 1, 3).setValue(texto);

        Logger.log(`✅ Fila ${i + 1} corregida: ${chapa} - ${timestamp}`);
        corregidas++;
      }
    }

    Logger.log(`✅ Proceso completado: ${corregidas} filas corregidas de ${data.length} totales`);
    return { success: true, corregidas: corregidas, total: data.length };

  } catch (error) {
    Logger.log('❌ corregirOrdenColumnasForo: ' + error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Elimina mensajes duplicados o vacíos del foro
 */
function limpiarMensajesForo() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.FORO);

    if (!sheet) {
      throw new Error('Hoja "Foro" no encontrada');
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 1) {
      Logger.log('ℹ️ Hoja vacía');
      return { success: true, eliminadas: 0 };
    }

    const data = sheet.getDataRange().getValues();
    const mensajesUnicos = new Set();
    const filasAEliminar = [];

    for (let i = 0; i < data.length; i++) {
      const [timestamp, chapa, texto] = data[i];

      // Detectar filas vacías o inválidas
      if (!timestamp || !chapa || !texto || String(texto).trim() === '') {
        filasAEliminar.push(i + 1);
        continue;
      }

      // Detectar duplicados exactos
      const key = `${timestamp}|${chapa}|${texto}`;
      if (mensajesUnicos.has(key)) {
        filasAEliminar.push(i + 1);
        Logger.log(`⚠️ Duplicado detectado en fila ${i + 1}`);
      } else {
        mensajesUnicos.add(key);
      }
    }

    // Eliminar filas en orden inverso (para no afectar los índices)
    for (let i = filasAEliminar.length - 1; i >= 0; i--) {
      sheet.deleteRow(filasAEliminar[i]);
    }

    Logger.log(`✅ Limpieza completada: ${filasAEliminar.length} filas eliminadas`);
    return { success: true, eliminadas: filasAEliminar.length };

  } catch (error) {
    Logger.log('❌ limpiarMensajesForo: ' + error);
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// 2. USUARIOS - Contraseñas
// ============================================================================
function changePassword(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.USUARIOS);

    if (!sheet) {
      throw new Error('Hoja "Usuarios" no encontrada');
    }

    const chapa = params.chapa.toString();
    const nuevaContrasena = params.nuevaContrasena.toString();

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const chapaCol = headers.indexOf('Chapa');
    const passCol = headers.indexOf('Contraseña');

    if (chapaCol === -1 || passCol === -1) {
      throw new Error('Columnas "Chapa" o "Contraseña" no encontradas');
    }

    // Buscar usuario existente
    for (let i = 1; i < data.length; i++) {
      if (data[i][chapaCol].toString() === chapa) {
        sheet.getRange(i + 1, passCol + 1).setValue(nuevaContrasena);
        Logger.log(`✅ Contraseña actualizada para chapa ${chapa}`);
        return jsonResponse(true, null, 'Contraseña actualizada');
      }
    }

    // Crear nuevo usuario si no existe
    sheet.appendRow([chapa, nuevaContrasena, '', '']);
    Logger.log(`✅ Usuario creado: ${chapa}`);
    return jsonResponse(true, null, 'Usuario creado');

  } catch (error) {
    Logger.log('❌ changePassword: ' + error);
    return jsonResponse(false, null, error.toString());
  }
}

// ============================================================================
// 3. CONFIGURACIÓN USUARIO - IRPF
// ============================================================================
function saveUserConfig(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.HOJAS.CONFIGURACION_USUARIO);

    // Crear hoja si no existe
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.HOJAS.CONFIGURACION_USUARIO);
      sheet.appendRow(['Chapa', 'IRPF_Porcentaje', 'Ultima_Actualizacion']);
      Logger.log('✅ Hoja Configuracion_Usuario creada');
    }

    const chapa = params.chapa;
    const irpf = params.irpf;
    const timestamp = new Date();

    const data = sheet.getDataRange().getValues();

    // Buscar y actualizar
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === chapa.toString()) {
        sheet.getRange(i + 1, 2, 1, 2).setValues([[irpf, timestamp]]);
        Logger.log(`✅ IRPF actualizado para chapa ${chapa}: ${irpf}%`);
        return jsonResponse(true, { chapa, irpf }, 'IRPF guardado correctamente');
      }
    }

    // Si no existe, crear
    sheet.appendRow([chapa, irpf, timestamp]);
    Logger.log(`✅ Nueva configuración creada para chapa ${chapa}: ${irpf}%`);
    return jsonResponse(true, { chapa, irpf }, 'IRPF guardado correctamente');

  } catch (error) {
    Logger.log('❌ saveUserConfig: ' + error);
    return jsonResponse(false, null, error.toString());
  }
}

function getUserConfig(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.CONFIGURACION_USUARIO);

    if (!sheet) {
      return jsonResponse(true, { irpf: 15 }, 'IRPF por defecto');
    }

    const chapa = params.chapa;
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === chapa.toString()) {
        return jsonResponse(true, { irpf: data[i][1] }, 'Configuración encontrada');
      }
    }

    return jsonResponse(true, { irpf: 15 }, 'IRPF por defecto');

  } catch (error) {
    Logger.log('❌ getUserConfig: ' + error);
    return jsonResponse(false, null, error.toString());
  }
}

// ============================================================================
// 4. PRIMAS PERSONALIZADAS (Prima, Movimientos, Relevo, Remate)
// ============================================================================
function savePrimaPersonalizada(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.HOJAS.PRIMAS_PERSONALIZADAS);

    // Crear hoja si no existe
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.HOJAS.PRIMAS_PERSONALIZADAS);
      sheet.appendRow(['Chapa', 'Fecha', 'Jornada', 'Prima_Personalizada', 'Movimientos_Personalizados', 'Relevo', 'Remate', 'Ultima_Actualizacion']);
      Logger.log('✅ Hoja Primas_Personalizadas creada');
    }

    const chapa = params.chapa;
    const fecha = params.fecha;
    const jornada = params.jornada;
    const prima = params.prima !== undefined ? params.prima : 0;
    const movimientos = params.movimientos !== undefined ? params.movimientos : 0;
    const relevo = params.relevo !== undefined ? params.relevo : 0;
    const remate = params.remate !== undefined ? params.remate : 0;
    const timestamp = new Date();

    // Validar parámetros requeridos
    if (!chapa || !fecha || !jornada) {
      throw new Error('Faltan parámetros requeridos: chapa, fecha, jornada');
    }

    const data = sheet.getDataRange().getValues();

    // Buscar registro existente (Chapa + Fecha + Jornada)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa && data[i][1] == fecha && data[i][2] == jornada) {
        sheet.getRange(i + 1, 4).setValue(prima);
        sheet.getRange(i + 1, 5).setValue(movimientos);
        sheet.getRange(i + 1, 6).setValue(relevo);
        sheet.getRange(i + 1, 7).setValue(remate);
        sheet.getRange(i + 1, 8).setValue(timestamp);
        Logger.log(`✅ Datos actualizados para chapa ${chapa}, ${fecha} ${jornada}`);
        return jsonResponse(true, { chapa, fecha, jornada, prima }, 'Datos guardados correctamente');
      }
    }

    // Si no existe, crear
    sheet.appendRow([chapa, fecha, jornada, prima, movimientos, relevo, remate, timestamp]);
    Logger.log(`✅ Nuevos datos guardados para chapa ${chapa}, ${fecha} ${jornada}`);
    return jsonResponse(true, { chapa, fecha, jornada, prima }, 'Datos guardados correctamente');

  } catch (error) {
    Logger.log('❌ savePrimaPersonalizada: ' + error);
    return jsonResponse(false, null, error.toString());
  }
}

function getPrimasPersonalizadas(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.PRIMAS_PERSONALIZADAS);

    if (!sheet) {
      return jsonResponse(true, [], 'Sin primas personalizadas');
    }

    const chapa = params.chapa;

    if (!chapa) {
      throw new Error('Falta parámetro requerido: chapa');
    }

    const data = sheet.getDataRange().getValues();
    const result = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa) {
        result.push({
          fecha: data[i][1],
          jornada: data[i][2],
          prima: data[i][3],
          movimientos: data[i][4],
          relevo: data[i][5],
          remate: data[i][6],
          ultimaActualizacion: data[i][7]
        });
      }
    }

    Logger.log(`✅ Recuperados ${result.length} registros para chapa ${chapa}`);
    return jsonResponse(true, result, `${result.length} primas encontradas`);

  } catch (error) {
    Logger.log('❌ getPrimasPersonalizadas: ' + error);
    return jsonResponse(false, null, error.toString());
  }
}

// ============================================================================
// 5. JORNALES MANUALES - GUARDAR EN JORNALES_HISTORICO_ACUMULADO
// ============================================================================
/**
 * Guarda jornal manual directamente en Jornales_Historico_Acumulado
 * De esta forma se lee automáticamente via CSV público sin problemas de CORS
 */
function saveJornalManual(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.JORNALES_HISTORICO);

    if (!sheet) {
      throw new Error('Hoja Jornales_Historico_Acumulado no encontrada');
    }

    const chapa = params.chapa;
    const fecha = params.fecha;
    const jornada = params.jornada;
    const tipo_dia = params.tipo_dia;
    const puesto = params.puesto;
    const empresa = params.empresa;
    const buque = params.buque || '--';
    const parte = params.parte || '1';

    // Validar parámetros requeridos
    if (!chapa || !fecha || !jornada || !puesto || !empresa) {
      throw new Error('Faltan parámetros requeridos');
    }

    // Verificar si ya existe (evitar duplicados)
    // Columnas: Fecha, Chapa, Puesto, Jornada, Empresa, Buque, Parte, Origen
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == fecha && data[i][1] == chapa && data[i][2] == puesto && data[i][3] == jornada) {
        Logger.log(`⚠️ Jornal duplicado detectado: ${chapa} ${fecha} ${jornada} ${puesto}`);
        return jsonResponse(false, null, 'Este jornal ya existe');
      }
    }

    // Añadir nueva fila DIRECTAMENTE a histórico
    // Columnas: Fecha, Chapa, Puesto, Jornada, Empresa, Buque, Parte, Origen
    sheet.appendRow([fecha, chapa, puesto, jornada, empresa, buque, parte, 'MANUAL']);
    Logger.log(`✅ Jornal manual guardado en histórico: ${chapa} ${fecha} ${jornada} ${puesto}`);

    return jsonResponse(true, null, 'Jornal guardado correctamente');

  } catch (error) {
    Logger.log(`❌ saveJornalManual: ${error.message}`);
    return jsonResponse(false, null, error.message);
  }
}

/**
 * Ya no usamos esta función - los jornales manuales se leen desde CSV público
 * La dejamos para compatibilidad pero devuelve vacío
 */
function getJornalesManuales(params) {
  Logger.log('ℹ️ getJornalesManuales: Los jornales manuales ahora se leen desde Jornales_Historico_Acumulado via CSV');
  return jsonResponse(true, [], 'Los jornales manuales se leen desde CSV público');
}

// ============================================================================
// 6. IMPORTACIÓN CSV AUTOMÁTICA (CADA 5 MIN) + PIVOT A HISTÓRICO
// ============================================================================

/**
 * Función automática que se ejecuta cada 5 minutos
 * Importa CSV y luego pivotea a histórico SIN DUPLICADOS
 */
function importarCSVAutomatico() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName(CONFIG.HOJAS.CONTRATA_GLIDE);

    if (!hoja) {
      Logger.log('❌ Hoja "contrata_glide" no encontrada');
      return { success: false, error: 'Hoja no encontrada' };
    }

    // 1. Importar CSV
    const respuesta = UrlFetchApp.fetch(CONFIG.CSV_URL);
    const datos = Utilities.parseCsv(respuesta.getContentText());

    if (datos.length === 0) {
      Logger.log('⚠️ CSV vacío');
      return { success: false, error: 'CSV vacío' };
    }

    hoja.clearContents();
    hoja.getRange(1, 1, datos.length, datos[0].length).setValues(datos);
    Logger.log(`✅ CSV importado: ${datos.length} filas`);

    // 2. Pivotar a histórico SIN DUPLICADOS
    const filasAgregadas = pivotContrataGlideToJornales();

    Logger.log(`✅ Proceso completo: ${datos.length} filas CSV, ${filasAgregadas} nuevas en histórico`);

    return {
      success: true,
      csvFilas: datos.length,
      historicFilasAgregadas: filasAgregadas
    };

  } catch (e) {
    Logger.log('❌ importarCSVAutomatico: ' + e);
    return { success: false, error: e.toString() };
  }
}

/**
 * Función manual desde el menú (misma lógica)
 */
function importarCSVManualmente() {
  const result = importarCSVAutomatico();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName(CONFIG.HOJAS.CONTRATA_GLIDE);

  if (hoja && result.success) {
    hoja.getRange("A1").setValue(`✅ Importado: ${result.csvFilas} filas CSV, ${result.historicFilasAgregadas} nuevas en histórico`);
  } else if (hoja) {
    hoja.getRange("A1").setValue("❌ Error al importar. Ver log.");
  }

  return result;
}

/**
 * Pivotea de contrata_glide a Jornales_Historico_Acumulado
 * Evita duplicados por clave: Fecha|Chapa|Puesto|Jornada
 * RETORNA número de filas agregadas
 */
function pivotContrataGlideToJornales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetOrigen = ss.getSheetByName(CONFIG.HOJAS.CONTRATA_GLIDE);
  const sheetDestino = ss.getSheetByName(CONFIG.HOJAS.JORNALES_HISTORICO);

  if (!sheetOrigen || !sheetDestino) {
    Logger.log('❌ Hojas no encontradas');
    return 0;
  }

  // Leer existentes
  const lastRowDestino = sheetDestino.getLastRow();
  const existingSet = new Set();

  if (lastRowDestino >= 2) {
    const existingData = sheetDestino.getRange(2, 1, lastRowDestino - 1, 4).getValues();
    existingData.forEach(row => {
      const [fecha, chapa, puesto, jornada] = row;
      if (fecha && chapa && puesto && jornada) {
        const fechaStr = fecha instanceof Date ? fecha.toISOString().split('T')[0] : String(fecha).trim();
        existingSet.add(`${fechaStr}|${String(chapa).trim()}|${String(puesto).trim()}|${String(jornada).trim()}`);
      }
    });
  }

  const lastRowOrigen = sheetOrigen.getLastRow();
  if (lastRowOrigen < 2) {
    Logger.log('ℹ️ No hay datos en contrata_glide');
    return 0;
  }

  // Leer datos origen (A-K = 11 columnas)
  const datos = sheetOrigen.getRange(2, 1, lastRowOrigen - 1, 11).getValues();
  const puestos = ["Trincador", "Trincador de coches", "Conductor de 1a", "Conductor de 2a", "Especialista"];
  const nuevas = [];

  datos.forEach(fila => {
    const [fecha, jornada, empresa, parte, buque, , t, tc, c, b, e] = fila;
    if (!fecha) return;

    [t, tc, c, b, e].forEach((chapa, i) => {
      if (!chapa) return;

      const fechaStr = fecha instanceof Date ? fecha.toISOString().split('T')[0] : String(fecha).trim();
      const jornadaStr = String(jornada).trim();
      const key = `${fechaStr}|${String(chapa).trim()}|${puestos[i]}|${jornadaStr}`;

      if (!existingSet.has(key)) {
        existingSet.add(key);
        nuevas.push([fecha, chapa, puestos[i], jornada, empresa, buque, parte, 'AUTO']);
      }
    });
  });

  // Escribir nuevas filas
  if (nuevas.length > 0) {
    const startRow = sheetDestino.getLastRow() + 1;
    sheetDestino.getRange(startRow, 1, nuevas.length, 8).setValues(nuevas);
    Logger.log(`✅ ${nuevas.length} filas añadidas al histórico`);
  } else {
    Logger.log('ℹ️ No hay filas nuevas');
  }

  return nuevas.length;
}

// ============================================================================
// 7. MENÚ PERSONALIZADO
// ============================================================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('🌀 Importación CSV')
    .addItem('📥 Actualizar "contrata_glide" AHORA', 'importarCSVManualmente')
    .addSeparator()
    .addItem('⚙️ Ver triggers activos', 'verTriggers')
    .addToUi();

  ui.createMenu('💬 Foro - Mantenimiento')
    .addItem('🔧 Corregir orden de columnas', 'corregirOrdenColumnasForo')
    .addItem('🧹 Limpiar mensajes duplicados/vacíos', 'limpiarMensajesForo')
    .addToUi();

  ui.createMenu('👤 Administración')
    .addItem('🔑 Ver todas las contraseñas', 'mostrarTodasLasContrasenas')
    .addItem('📊 Estadísticas de usuarios', 'mostrarEstadisticasUsuarios')
    .addToUi();
}

// ============================================================================
// 8. CONFIGURACIÓN DE TRIGGERS
// ============================================================================

/**
 * Configurar trigger para importar CSV cada 5 minutos
 * EJECUTA ESTA FUNCIÓN UNA SOLA VEZ manualmente
 */
function configurarTriggerImportacionCSV() {
  // Eliminar triggers existentes
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarCSVAutomatico') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Crear trigger cada 5 minutos
  ScriptApp.newTrigger('importarCSVAutomatico')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('✅ Trigger configurado: importarCSVAutomatico cada 5 min');

  // Ejecutar inmediatamente para probar
  const resultado = importarCSVAutomatico();
  Logger.log('📊 Resultado:', JSON.stringify(resultado));

  return resultado;
}

/**
 * Eliminar trigger de importación CSV
 */
function eliminarTriggerImportacionCSV() {
  let count = 0;
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarCSVAutomatico') {
      ScriptApp.deleteTrigger(trigger);
      count++;
    }
  });
  Logger.log(`🗑️ ${count} trigger(s) eliminado(s)`);
  return { eliminados: count };
}

/**
 * Ver todos los triggers activos
 */
function verTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const info = triggers.map(t => ({
    funcion: t.getHandlerFunction(),
    tipo: t.getEventType().toString()
  }));

  Logger.log('📋 Triggers actuales:', JSON.stringify(info, null, 2));

  // Mostrar en UI
  const ui = SpreadsheetApp.getUi();
  if (info.length === 0) {
    ui.alert('📋 Triggers', 'No hay triggers configurados', ui.ButtonSet.OK);
  } else {
    const mensaje = info.map((t, i) => `${i + 1}. ${t.funcion} (${t.tipo})`).join('\n');
    ui.alert('📋 Triggers Activos', mensaje, ui.ButtonSet.OK);
  }

  return info;
}

// ============================================================================
// 9. FUNCIONES DE ADMINISTRACIÓN
// ============================================================================

/**
 * Muestra todas las contraseñas de usuarios en una ventana emergente
 * Solo el administrador (propietario del Sheet) puede ejecutar esto
 */
function mostrarTodasLasContrasenas() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.USUARIOS);

    if (!sheet) {
      SpreadsheetApp.getUi().alert('❌ Error', 'Hoja "Usuarios" no encontrada', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const chapaCol = headers.indexOf('Chapa');
    const passCol = headers.indexOf('Contraseña');
    const nombreCol = headers.indexOf('Nombre');

    if (chapaCol === -1 || passCol === -1) {
      SpreadsheetApp.getUi().alert('❌ Error', 'Columnas no encontradas', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }

    // Recopilar usuarios con contraseñas
    const usuarios = [];
    for (let i = 1; i < data.length; i++) {
      const chapa = data[i][chapaCol];
      const password = data[i][passCol];
      const nombre = nombreCol >= 0 ? data[i][nombreCol] : '';

      if (chapa) {
        usuarios.push({
          chapa: chapa,
          nombre: nombre || '(sin nombre)',
          password: password || '(sin contraseña)'
        });
      }
    }

    // Ordenar por chapa
    usuarios.sort((a, b) => String(a.chapa).localeCompare(String(b.chapa)));

    // Generar mensaje para mostrar
    let mensaje = `TOTAL: ${usuarios.length} usuarios registrados\n\n`;
    mensaje += '═'.repeat(50) + '\n\n';

    usuarios.forEach((u, i) => {
      mensaje += `${i + 1}. Chapa ${u.chapa}\n`;
      if (u.nombre !== '(sin nombre)') {
        mensaje += `   Nombre: ${u.nombre}\n`;
      }
      mensaje += `   Contraseña: ${u.password}\n`;
      mensaje += '─'.repeat(40) + '\n';
    });

    // Mostrar en ventana emergente
    const ui = SpreadsheetApp.getUi();
    const htmlOutput = HtmlService.createHtmlOutput(
      `<style>
        body { font-family: monospace; white-space: pre-wrap; padding: 20px; font-size: 12px; }
        .header { font-weight: bold; color: #1a73e8; margin-bottom: 20px; }
        .user { margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
        .chapa { font-weight: bold; color: #202124; }
        .password { color: #d93025; font-weight: bold; }
      </style>
      <div class="header">🔑 CONTRASEÑAS DE USUARIOS (${usuarios.length} total)</div>
      ${usuarios.map((u, i) => `
        <div class="user">
          <div class="chapa">${i + 1}. Chapa ${u.chapa} ${u.nombre !== '(sin nombre)' ? '- ' + u.nombre : ''}</div>
          <div class="password">Contraseña: ${u.password}</div>
        </div>
      `).join('')}
      `
    )
      .setWidth(600)
      .setHeight(500);

    ui.showModalDialog(htmlOutput, '🔑 Panel de Contraseñas - CONFIDENCIAL');

    Logger.log(`✅ Contraseñas mostradas: ${usuarios.length} usuarios`);

  } catch (error) {
    Logger.log('❌ mostrarTodasLasContrasenas: ' + error);
    SpreadsheetApp.getUi().alert('❌ Error', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Muestra estadísticas de usuarios
 */
function mostrarEstadisticasUsuarios() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetUsuarios = ss.getSheetByName(CONFIG.HOJAS.USUARIOS);
    const sheetForo = ss.getSheetByName(CONFIG.HOJAS.FORO);

    if (!sheetUsuarios) {
      SpreadsheetApp.getUi().alert('❌ Error', 'Hoja "Usuarios" no encontrada', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }

    const dataUsuarios = sheetUsuarios.getDataRange().getValues();
    const totalUsuarios = dataUsuarios.length - 1; // Menos la cabecera

    // Contar usuarios con contraseña configurada
    const headers = dataUsuarios[0];
    const passCol = headers.indexOf('Contraseña');
    let usuariosConPassword = 0;
    let usuariosSinPassword = 0;

    for (let i = 1; i < dataUsuarios.length; i++) {
      const password = dataUsuarios[i][passCol];
      if (password && password.toString().trim() !== '') {
        usuariosConPassword++;
      } else {
        usuariosSinPassword++;
      }
    }

    // Contar mensajes del foro
    let totalMensajes = 0;
    if (sheetForo) {
      const dataForo = sheetForo.getDataRange().getValues();
      totalMensajes = dataForo.length > 0 ? dataForo.length - 1 : 0; // Menos cabecera si existe
    }

    // Generar estadísticas
    const mensaje = `
📊 ESTADÍSTICAS DEL PORTAL

═══════════════════════════════════════

👥 USUARIOS
   Total registrados: ${totalUsuarios}
   Con contraseña: ${usuariosConPassword}
   Sin contraseña: ${usuariosSinPassword}

💬 FORO
   Mensajes totales: ${totalMensajes}

📅 ÚLTIMA ACTUALIZACIÓN
   ${new Date().toLocaleString('es-ES')}

═══════════════════════════════════════
    `;

    SpreadsheetApp.getUi().alert('📊 Estadísticas del Portal', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);

    Logger.log('✅ Estadísticas mostradas');

  } catch (error) {
    Logger.log('❌ mostrarEstadisticasUsuarios: ' + error);
    SpreadsheetApp.getUi().alert('❌ Error', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}
