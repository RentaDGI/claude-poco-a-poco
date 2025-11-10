/**
 * APPS SCRIPT PORTAL - VERSIÓN SUPABASE SYNC + EDIT/DELETE
 *
 * NUEVO: Ahora sincroniza automáticamente con Supabase
 * - Mantiene Google Sheets como backup
 * - Escribe jornales en Supabase tabla "jornales"
 * - PWA lee directamente de Supabase (más rápido)
 * - Soporta edición y eliminación de jornales manuales
 */

// ============================================================================
// CONFIGURACIÓN SUPABASE
// ============================================================================
const SUPABASE_CONFIG = {
  URL: 'https://icszzxkdxatfytpmoviq.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc3p6eGtkeGF0Znl0cG1vdmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mzk2NjUsImV4cCI6MjA3ODIxNTY2NX0.hmQWNB3sCyBh39gdNgQLjjlIvliwJje-OYf0kkPObVA',
  ENDPOINTS: {
    JORNALES: '/rest/v1/jornales',
    CONTRATACIONES: '/rest/v1/contrataciones',
    PRIMAS: '/rest/v1/primas_personalizadas',
    CONFIG_USUARIO: '/rest/v1/configuracion_usuario'
  }
};

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
// FUNCIONES AUXILIARES SUPABASE
// ============================================================================

/**
 * Envía datos a Supabase usando REST API
 */
function enviarASupabase(endpoint, datos, metodo = 'POST') {
  try {
    // VALIDAR PARÁMETROS
    if (!endpoint || endpoint === 'undefined') {
      const errorMsg = 'Error: endpoint no definido. Debe llamar con SUPABASE_CONFIG.ENDPOINTS.JORNALES';
      Logger.log(`❌ ${errorMsg}`);
      return { success: false, error: errorMsg };
    }

    if (!datos) {
      const errorMsg = 'Error: datos no definidos';
      Logger.log(`❌ ${errorMsg}`);
      return { success: false, error: errorMsg };
    }

    // Construir URL
    const url = SUPABASE_CONFIG.URL + endpoint;
    Logger.log(`🔗 URL: ${url}`);

    const opciones = {
      method: metodo,
      headers: {
        'apikey': SUPABASE_CONFIG.ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      payload: JSON.stringify(datos),
      muteHttpExceptions: true
    };

    const respuesta = UrlFetchApp.fetch(url, opciones);
    const codigo = respuesta.getResponseCode();

    if (codigo === 200 || codigo === 201 || codigo === 204) {
      Logger.log(`✅ Datos enviados a Supabase: ${endpoint}`);
      return { success: true };
    } else {
      Logger.log(`⚠️ Error Supabase (${codigo}): ${respuesta.getContentText()}`);
      return { success: false, error: respuesta.getContentText() };
    }

  } catch (error) {
    Logger.log(`❌ Error al enviar a Supabase: ${error}`);
    return { success: false, error: error.toString() };
  }
}

/**
 * Elimina un registro de Supabase
 */
function eliminarDeSupabase(endpoint, filtros) {
  try {
    // Construir query string con filtros
    const queryParams = Object.entries(filtros)
      .map(([key, value]) => `${key}=eq.${encodeURIComponent(value)}`)
      .join('&');

    const url = `${SUPABASE_CONFIG.URL}${endpoint}?${queryParams}`;
    Logger.log(`🔗 DELETE URL: ${url}`);

    const opciones = {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_CONFIG.ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.ANON_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };

    const respuesta = UrlFetchApp.fetch(url, opciones);
    const codigo = respuesta.getResponseCode();

    if (codigo === 200 || codigo === 204) {
      Logger.log(`✅ Registro eliminado de Supabase: ${endpoint}`);
      return { success: true };
    } else {
      Logger.log(`⚠️ Error eliminando de Supabase (${codigo}): ${respuesta.getContentText()}`);
      return { success: false, error: respuesta.getContentText() };
    }

  } catch (error) {
    Logger.log(`❌ Error al eliminar de Supabase: ${error}`);
    return { success: false, error: error.toString() };
  }
}

/**
 * Actualiza un registro en Supabase
 */
function actualizarEnSupabase(endpoint, filtros, datosNuevos) {
  try {
    // Construir query string con filtros
    const queryParams = Object.entries(filtros)
      .map(([key, value]) => `${key}=eq.${encodeURIComponent(value)}`)
      .join('&');

    const url = `${SUPABASE_CONFIG.URL}${endpoint}?${queryParams}`;
    Logger.log(`🔗 PATCH URL: ${url}`);

    const opciones = {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_CONFIG.ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      payload: JSON.stringify(datosNuevos),
      muteHttpExceptions: true
    };

    const respuesta = UrlFetchApp.fetch(url, opciones);
    const codigo = respuesta.getResponseCode();

    if (codigo === 200 || codigo === 204) {
      Logger.log(`✅ Registro actualizado en Supabase: ${endpoint}`);
      return { success: true };
    } else {
      Logger.log(`⚠️ Error actualizando en Supabase (${codigo}): ${respuesta.getContentText()}`);
      return { success: false, error: respuesta.getContentText() };
    }

  } catch (error) {
    Logger.log(`❌ Error al actualizar en Supabase: ${error}`);
    return { success: false, error: error.toString() };
  }
}

/**
 * Valida y convierte una fecha a formato ISO (YYYY-MM-DD)
 * Retorna null si la fecha es inválida
 */
function validarYConvertirFecha(fecha) {
  if (!fecha) return null;

  // Si es objeto Date
  if (fecha instanceof Date) {
    if (isNaN(fecha.getTime())) return null;
    return Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  // Si es string
  const fechaStr = String(fecha).trim().toUpperCase();

  // Rechazar valores no válidos como "FC", "N/A", etc.
  if (fechaStr.length < 8 || fechaStr === 'FC' || fechaStr === 'N/A' || fechaStr === '--') {
    return null;
  }

  // Intentar parsear formato DD/MM/YYYY
  const partes = fechaStr.split('/');
  if (partes.length === 3) {
    const [dia, mes, año] = partes.map(p => parseInt(p, 10));

    // Validar que sean números válidos
    if (isNaN(dia) || isNaN(mes) || isNaN(año)) return null;
    if (año < 1900 || año > 2100) return null;
    if (mes < 1 || mes > 12) return null;
    if (dia < 1 || dia > 31) return null;

    return `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  // Intentar parsear formato YYYY-MM-DD
  const partesISO = fechaStr.split('-');
  if (partesISO.length === 3) {
    const [año, mes, dia] = partesISO.map(p => parseInt(p, 10));

    if (isNaN(dia) || isNaN(mes) || isNaN(año)) return null;
    if (año < 1900 || año > 2100) return null;
    if (mes < 1 || mes > 12) return null;
    if (dia < 1 || dia > 31) return null;

    return fechaStr;
  }

  return null;
}

/**
 * Envía batch de jornales a Supabase usando UPSERT
 */
function enviarJornalesASupabase(jornales) {
  if (!jornales || jornales.length === 0) {
    Logger.log('ℹ️ No hay jornales para enviar a Supabase');
    return { success: true, count: 0 };
  }

  try {
    Logger.log(`📊 Encontrados ${jornales.length} jornales históricos`);

    // Convertir y VALIDAR formato: [fecha, chapa, puesto, jornada, empresa, buque, parte, origen]
    const datosSupabase = [];
    let descartados = 0;

    for (let i = 0; i < jornales.length; i++) {
      const jornal = jornales[i];
      const [fecha, chapa, puesto, jornada, empresa, buque, parte, origen] = jornal;

      // VALIDAR FECHA - Rechazar fechas inválidas como "FC"
      const fechaISO = validarYConvertirFecha(fecha);
      if (!fechaISO) {
        descartados++;
        if (descartados <= 10) { // Mostrar solo los primeros 10 errores
          Logger.log(`⚠️ Jornal #${i + 1} descartado: fecha inválida "${fecha}"`);
        }
        continue;
      }

      // VALIDAR CHAPA (requerida)
      const chapaStr = String(chapa || '').trim();
      if (!chapaStr) {
        descartados++;
        continue;
      }

      // Truncar valores largos para evitar error VARCHAR
      const jornadaStr = String(jornada || '').trim().substring(0, 100);
      const origenStr = String(origen || 'AUTO').trim().substring(0, 50);

      datosSupabase.push({
        fecha: fechaISO,
        chapa: chapaStr,
        puesto: String(puesto || '').trim().substring(0, 50),
        jornada: jornadaStr,
        empresa: String(empresa || '').trim().substring(0, 100),
        buque: String(buque || '--').trim().substring(0, 100),
        parte: String(parte || '1').trim().substring(0, 50),
        origen: origenStr
      });
    }

    if (descartados > 0) {
      Logger.log(`⚠️ Total descartados: ${descartados} jornales (fechas inválidas o datos incompletos)`);
    }

    if (datosSupabase.length === 0) {
      Logger.log('⚠️ No hay jornales válidos para enviar');
      return { success: true, count: 0, descartados: descartados };
    }

    Logger.log(`✅ Preparados ${datosSupabase.length} jornales válidos para Supabase`);

    // Enviar en lotes de 100 (límite de Supabase)
    const BATCH_SIZE = 100;
    let totalEnviados = 0;
    let erroresLote = 0;

    for (let i = 0; i < datosSupabase.length; i += BATCH_SIZE) {
      const lote = datosSupabase.slice(i, i + BATCH_SIZE);
      const resultado = enviarASupabase(SUPABASE_CONFIG.ENDPOINTS.JORNALES, lote, 'POST');

      if (resultado.success) {
        totalEnviados += lote.length;
      } else {
        erroresLote++;
        Logger.log(`⚠️ Error lote (${resultado.error ? JSON.parse(resultado.error).code : 'desconocido'}): ${resultado.error}`);
      }

      // Evitar rate limiting
      Utilities.sleep(500);
    }

    Logger.log(`✅ Enviados ${totalEnviados}/${jornales.length} a Supabase`);
    Logger.log(`✅ Sincronización completada: ${totalEnviados}/${jornales.length}`);

    return {
      success: true,
      count: totalEnviados,
      descartados: descartados,
      erroresLote: erroresLote
    };

  } catch (error) {
    Logger.log(`❌ Error en enviarJornalesASupabase: ${error}`);
    return { success: false, error: error.toString() };
  }
}

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
      'getJornalesManuales': getJornalesManuales,
      'deleteJornalManual': deleteJornalManual,
      'updateJornalManual': updateJornalManual
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
    message: 'Apps Script funcionando con Supabase Sync + Edit/Delete',
    timestamp: new Date().toISOString(),
    version: '4.1-supabase-sync-edit-delete'
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

    sheet.appendRow([timestamp, chapa, texto]);
    Logger.log(`✅ Mensaje añadido: ${chapa}`);
    return jsonResponse(true, null, 'Mensaje agregado');

  } catch (error) {
    Logger.log('❌ addMessage: ' + error);
    return jsonResponse(false, null, error.toString());
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
// 4. PRIMAS PERSONALIZADAS
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
// 5. JORNALES MANUALES - GUARDAR EN SHEETS + SUPABASE
// ============================================================================
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
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == fecha && data[i][1] == chapa && data[i][2] == puesto && data[i][3] == jornada) {
        Logger.log(`⚠️ Jornal duplicado detectado: ${chapa} ${fecha} ${jornada} ${puesto}`);
        return jsonResponse(false, null, 'Este jornal ya existe');
      }
    }

    // Añadir nueva fila a Sheets
    sheet.appendRow([fecha, chapa, puesto, jornada, empresa, buque, parte, 'MANUAL']);
    Logger.log(`✅ Jornal manual guardado en Sheets: ${chapa} ${fecha} ${jornada} ${puesto}`);

    // NUEVO: Enviar a Supabase
    const jornalData = [[fecha, chapa, puesto, jornada, empresa, buque, parte, 'MANUAL']];
    const resultadoSupabase = enviarJornalesASupabase(jornalData);

    if (resultadoSupabase.success) {
      Logger.log(`✅ Jornal manual también guardado en Supabase`);
    } else {
      Logger.log(`⚠️ Error guardando en Supabase: ${resultadoSupabase.error}`);
    }

    return jsonResponse(true, null, 'Jornal guardado correctamente');

  } catch (error) {
    Logger.log(`❌ saveJornalManual: ${error.message}`);
    return jsonResponse(false, null, error.message);
  }
}

/**
 * NUEVO: Elimina un jornal manual del histórico acumulado (Sheets + Supabase)
 */
function deleteJornalManual(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.JORNALES_HISTORICO);

    if (!sheet) {
      throw new Error('Hoja Jornales_Historico_Acumulado no encontrada');
    }

    const chapa = params.chapa;
    const fecha = params.fecha;
    const jornada = params.jornada;
    const puesto = params.puesto;

    // Validar parámetros requeridos
    if (!chapa || !fecha || !jornada || !puesto) {
      throw new Error('Faltan parámetros requeridos para eliminar');
    }

    // Buscar y eliminar la fila en Sheets
    const data = sheet.getDataRange().getValues();
    let filaEliminada = false;

    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] == fecha &&
          data[i][1] == chapa &&
          data[i][2] == puesto &&
          data[i][3] == jornada &&
          data[i][7] == 'MANUAL') {
        sheet.deleteRow(i + 1);
        filaEliminada = true;
        Logger.log(`✅ Jornal manual eliminado de Sheets: ${chapa} ${fecha} ${jornada} ${puesto}`);
        break;
      }
    }

    if (!filaEliminada) {
      return jsonResponse(false, null, 'No se encontró el jornal para eliminar');
    }

    // NUEVO: Eliminar de Supabase
    const fechaISO = validarYConvertirFecha(fecha);
    if (fechaISO) {
      const resultadoSupabase = eliminarDeSupabase(
        SUPABASE_CONFIG.ENDPOINTS.JORNALES,
        {
          fecha: fechaISO,
          chapa: chapa,
          puesto: puesto,
          jornada: jornada,
          origen: 'MANUAL'
        }
      );

      if (resultadoSupabase.success) {
        Logger.log(`✅ Jornal manual también eliminado de Supabase`);
      } else {
        Logger.log(`⚠️ Error eliminando de Supabase: ${resultadoSupabase.error}`);
      }
    }

    return jsonResponse(true, null, 'Jornal eliminado correctamente');

  } catch (error) {
    Logger.log(`❌ deleteJornalManual: ${error.message}`);
    return jsonResponse(false, null, error.message);
  }
}

/**
 * NUEVO: Actualiza un jornal manual en el histórico acumulado (Sheets + Supabase)
 */
function updateJornalManual(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.JORNALES_HISTORICO);

    if (!sheet) {
      throw new Error('Hoja Jornales_Historico_Acumulado no encontrada');
    }

    // Parámetros originales (para identificar la fila)
    const chapaOriginal = params.chapaOriginal;
    const fechaOriginal = params.fechaOriginal;
    const jornadaOriginal = params.jornadaOriginal;
    const puestoOriginal = params.puestoOriginal;

    // Nuevos valores
    const chapa = params.chapa;
    const fecha = params.fecha;
    const jornada = params.jornada;
    const tipo_dia = params.tipo_dia;
    const puesto = params.puesto;
    const empresa = params.empresa;
    const buque = params.buque || '--';
    const parte = params.parte || '1';

    // Validar parámetros
    if (!chapaOriginal || !fechaOriginal || !jornadaOriginal || !puestoOriginal) {
      throw new Error('Faltan parámetros originales para identificar el jornal');
    }

    if (!chapa || !fecha || !jornada || !puesto || !empresa) {
      throw new Error('Faltan parámetros nuevos requeridos');
    }

    // Buscar y actualizar la fila en Sheets
    const data = sheet.getDataRange().getValues();
    let filaActualizada = false;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == fechaOriginal &&
          data[i][1] == chapaOriginal &&
          data[i][2] == puestoOriginal &&
          data[i][3] == jornadaOriginal &&
          data[i][7] == 'MANUAL') {

        sheet.getRange(i + 1, 1, 1, 7).setValues([[fecha, chapa, puesto, jornada, empresa, buque, parte]]);
        filaActualizada = true;
        Logger.log(`✅ Jornal manual actualizado en Sheets: ${chapa} ${fecha} ${jornada} ${puesto}`);
        break;
      }
    }

    if (!filaActualizada) {
      return jsonResponse(false, null, 'No se encontró el jornal para actualizar');
    }

    // NUEVO: Actualizar en Supabase
    const fechaOriginalISO = validarYConvertirFecha(fechaOriginal);
    const fechaNuevaISO = validarYConvertirFecha(fecha);

    if (fechaOriginalISO && fechaNuevaISO) {
      const resultadoSupabase = actualizarEnSupabase(
        SUPABASE_CONFIG.ENDPOINTS.JORNALES,
        {
          fecha: fechaOriginalISO,
          chapa: chapaOriginal,
          puesto: puestoOriginal,
          jornada: jornadaOriginal,
          origen: 'MANUAL'
        },
        {
          fecha: fechaNuevaISO,
          chapa: chapa,
          puesto: puesto,
          jornada: jornada,
          empresa: empresa,
          buque: buque,
          parte: parte
        }
      );

      if (resultadoSupabase.success) {
        Logger.log(`✅ Jornal manual también actualizado en Supabase`);
      } else {
        Logger.log(`⚠️ Error actualizando en Supabase: ${resultadoSupabase.error}`);
      }
    }

    return jsonResponse(true, null, 'Jornal actualizado correctamente');

  } catch (error) {
    Logger.log(`❌ updateJornalManual: ${error.message}`);
    return jsonResponse(false, null, error.message);
  }
}

function getJornalesManuales(params) {
  Logger.log('ℹ️ getJornalesManuales: Los jornales manuales ahora se leen desde Supabase');
  return jsonResponse(true, [], 'Los jornales manuales se leen desde Supabase');
}

// ============================================================================
// 6. IMPORTACIÓN CSV AUTOMÁTICA + SINCRONIZACIÓN SUPABASE
// ============================================================================

/**
 * Función automática que se ejecuta cada 5 minutos
 * AHORA TAMBIÉN ESCRIBE EN SUPABASE
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

    // 2. Pivotar a histórico (Sheets) Y Supabase
    const resultado = pivotContrataGlideToJornales();

    Logger.log(`✅ Proceso completo: ${datos.length} filas CSV, ${resultado.sheetsNuevas} en Sheets, ${resultado.supabaseEnviados} en Supabase`);

    return {
      success: true,
      csvFilas: datos.length,
      sheetsNuevas: resultado.sheetsNuevas,
      supabaseEnviados: resultado.supabaseEnviados
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
    hoja.getRange("A1").setValue(`✅ Importado: ${result.csvFilas} filas CSV | ${result.sheetsNuevas} nuevas en Sheets | ${result.supabaseEnviados} enviadas a Supabase`);
  } else if (hoja) {
    hoja.getRange("A1").setValue("❌ Error al importar. Ver log.");
  }

  return result;
}

/**
 * Pivotea de contrata_glide a SHEETS + SUPABASE
 * MODIFICADO para enviar también a Supabase
 */
function pivotContrataGlideToJornales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetOrigen = ss.getSheetByName(CONFIG.HOJAS.CONTRATA_GLIDE);
  const sheetDestino = ss.getSheetByName(CONFIG.HOJAS.JORNALES_HISTORICO);

  if (!sheetOrigen || !sheetDestino) {
    Logger.log('❌ Hojas no encontradas');
    return { sheetsNuevas: 0, supabaseEnviados: 0 };
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
    return { sheetsNuevas: 0, supabaseEnviados: 0 };
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

  let sheetsNuevas = 0;
  let supabaseEnviados = 0;

  // Escribir nuevas filas
  if (nuevas.length > 0) {
    // 1. Guardar en Sheets
    const startRow = sheetDestino.getLastRow() + 1;
    sheetDestino.getRange(startRow, 1, nuevas.length, 8).setValues(nuevas);
    sheetsNuevas = nuevas.length;
    Logger.log(`✅ ${nuevas.length} filas añadidas a Sheets`);

    // 2. NUEVO: Enviar a Supabase
    const resultadoSupabase = enviarJornalesASupabase(nuevas);
    supabaseEnviados = resultadoSupabase.count || 0;

    if (resultadoSupabase.success) {
      Logger.log(`✅ ${supabaseEnviados} jornales enviados a Supabase`);
    } else {
      Logger.log(`⚠️ Error enviando a Supabase: ${resultadoSupabase.error}`);
    }

  } else {
    Logger.log('ℹ️ No hay filas nuevas');
  }

  return { sheetsNuevas, supabaseEnviados };
}

// ============================================================================
// 7. MENÚ PERSONALIZADO
// ============================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌀 Importación CSV + Supabase')
    .addItem('📥 Actualizar AHORA (CSV → Sheets → Supabase)', 'importarCSVManualmente')
    .addSeparator()
    .addItem('🔄 SINCRONIZACIÓN INICIAL (ejecutar UNA vez)', 'sincronizarTodosLosJornalesASupabase')
    .addSeparator()
    .addItem('⚙️ Ver triggers activos', 'verTriggers')
    .addItem('🧪 Probar conexión Supabase', 'probarConexionSupabase')
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

  Logger.log('✅ Trigger configurado: importarCSVAutomatico cada 5 min + Supabase sync');

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

/**
 * Probar conexión con Supabase
 */
function probarConexionSupabase() {
  Logger.log('🧪 Probando conexión con Supabase...');

  const datoPrueba = {
    fecha: '2025-01-01',
    chapa: 'TEST',
    puesto: 'PRUEBA',
    jornada: 'TEST',
    empresa: 'TEST',
    buque: 'TEST',
    parte: '1',
    origen: 'TEST'
  };

  const resultado = enviarASupabase(SUPABASE_CONFIG.ENDPOINTS.JORNALES, [datoPrueba], 'POST');

  const ui = SpreadsheetApp.getUi();
  if (resultado.success) {
    Logger.log('✅ Conexión Supabase OK');
    ui.alert('✅ Conexión Supabase', 'La conexión con Supabase funciona correctamente', ui.ButtonSet.OK);
  } else {
    Logger.log('❌ Error conexión Supabase: ' + resultado.error);
    ui.alert('❌ Error Supabase', 'Error: ' + resultado.error, ui.ButtonSet.OK);
  }

  return resultado;
}

// ============================================================================
// 9. SINCRONIZACIÓN INICIAL - EJECUTAR UNA SOLA VEZ
// ============================================================================

/**
 * FUNCIÓN DE SINCRONIZACIÓN INICIAL - EJECUTAR UNA SOLA VEZ
 *
 * Sincroniza TODOS los jornales históricos existentes a Supabase
 * Esta función debe ejecutarse manualmente UNA VEZ después de implementar el nuevo código
 */
function sincronizarTodosLosJornalesASupabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.HOJAS.JORNALES_HISTORICO);

  if (!sheet) {
    Logger.log('❌ Hoja Jornales_Historico_Acumulado no encontrada');
    const ui = SpreadsheetApp.getUi();
    ui.alert('❌ Error', 'Hoja "Jornales_Historico_Acumulado" no encontrada', ui.ButtonSet.OK);
    return { success: false, error: 'Hoja no encontrada' };
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log('ℹ️ No hay datos históricos para sincronizar');
    const ui = SpreadsheetApp.getUi();
    ui.alert('ℹ️ Sin datos', 'No hay datos históricos para sincronizar', ui.ButtonSet.OK);
    return { success: true, count: 0, message: 'No hay datos' };
  }

  // Leer TODOS los datos (saltando el encabezado)
  // Columnas: Fecha, Chapa, Puesto, Jornada, Empresa, Buque, Parte, Origen
  const datos = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  Logger.log(`📊 Encontrados ${datos.length} jornales históricos para sincronizar`);

  // Mostrar confirmación antes de empezar
  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.alert(
    '🔄 Sincronización Inicial',
    `Se encontraron ${datos.length} jornales históricos.\n\n` +
    `¿Desea sincronizarlos todos a Supabase?\n\n` +
    `(Esto puede tardar 5-10 minutos)`,
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    Logger.log('❌ Sincronización cancelada por el usuario');
    return { success: false, cancelled: true };
  }

  // Enviar en lotes
  const resultado = enviarJornalesASupabase(datos);

  Logger.log(`✅ Sincronización inicial completada: ${resultado.count}/${datos.length} jornales enviados`);

  // Mostrar resultado en la UI
  if (resultado.count > 0) {
    ui.alert(
      '✅ Sincronización Completa',
      `Se sincronizaron ${resultado.count} de ${datos.length} jornales históricos a Supabase.\n\n` +
      `${resultado.descartados || 0} registros descartados (fechas inválidas).\n\n` +
      `Ahora el trigger automático mantendrá todo sincronizado cada 5 minutos.`,
      ui.ButtonSet.OK
    );
  } else {
    ui.alert(
      '⚠️ Sincronización Incompleta',
      `No se pudo sincronizar ningún jornal.\n\n` +
      `Descartados: ${resultado.descartados || 0}\n` +
      `Errores de lote: ${resultado.erroresLote || 0}\n\n` +
      `Revisa los logs para más detalles.`,
      ui.ButtonSet.OK
    );
  }

  return {
    success: true,
    total: datos.length,
    enviados: resultado.count,
    descartados: resultado.descartados || 0
  };
}
