/**
 * Apps Script para Portal Estiba Valencia - VERSIÓN ACTUALIZADA
 * Maneja persistencia de datos de usuario (IRPF, primas, movimientos, relevo, remate)
 *
 * HOJAS REQUERIDAS:
 * - Configuracion_Usuario: Chapa, IRPF_Porcentaje, Ultima_Actualizacion
 * - Primas_Personalizadas: Chapa, Fecha, Jornada, Prima_Personalizada, Movimientos_Personalizados, Relevo, Remate, Ultima_Actualizacion
 */

const CONFIG = {
  HOJAS: {
    CONFIGURACION_USUARIO: 'Configuracion_Usuario',
    PRIMAS_PERSONALIZADAS: 'Primas_Personalizadas'
  }
};

/**
 * Endpoint GET para verificar que el servicio está funcionando
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Apps Script funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '2.0-actualizado'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint principal para recibir peticiones POST
 */
function doPost(e) {
  try {
    // Validar que hay datos
    if (!e.postData || !e.postData.contents) {
      return createJsonResponse({
        success: false,
        error: 'No se recibieron datos'
      });
    }

    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    Logger.log(`📨 Acción recibida: ${action}`);

    const handlers = {
      'saveUserConfig': saveUserConfig,
      'getUserConfig': getUserConfig,
      'savePrimaPersonalizada': savePrimaPersonalizada,
      'getPrimasPersonalizadas': getPrimasPersonalizadas
    };

    const handler = handlers[action];
    if (!handler) {
      return createJsonResponse({
        success: false,
        error: `Acción no válida: ${action}`
      });
    }

    const result = handler(params);
    return createJsonResponse(result);

  } catch (error) {
    Logger.log(`❌ Error en doPost: ${error.message}`);
    return createJsonResponse({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}

/**
 * Helper para crear respuestas JSON
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ==========================================
 * GESTIÓN DE CONFIGURACIÓN DE USUARIO (IRPF)
 * ==========================================
 */

/**
 * Guarda la configuración del usuario (IRPF) en Google Sheets
 */
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
    const fecha = new Date();

    // Buscar si ya existe la chapa
    const data = sheet.getDataRange().getValues();
    let filaExistente = -1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa) {
        filaExistente = i + 1;
        break;
      }
    }

    if (filaExistente > 0) {
      // Actualizar fila existente
      sheet.getRange(filaExistente, 2).setValue(irpf);
      sheet.getRange(filaExistente, 3).setValue(fecha);
      Logger.log(`✅ IRPF actualizado para chapa ${chapa}: ${irpf}%`);
    } else {
      // Añadir nueva fila
      sheet.appendRow([chapa, irpf, fecha]);
      Logger.log(`✅ Nueva configuración creada para chapa ${chapa}: ${irpf}%`);
    }

    return {
      success: true,
      message: 'IRPF guardado correctamente',
      data: { chapa: chapa, irpf: irpf }
    };

  } catch (error) {
    Logger.log(`❌ Error en saveUserConfig: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Obtiene la configuración del usuario (IRPF) desde Google Sheets
 */
function getUserConfig(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.CONFIGURACION_USUARIO);

    if (!sheet) {
      return {
        success: false,
        message: 'Hoja Configuracion_Usuario no encontrada'
      };
    }

    const chapa = params.chapa;
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa) {
        return {
          success: true,
          data: {
            chapa: chapa,
            irpf: data[i][1],
            fecha: data[i][2]
          }
        };
      }
    }

    return {
      success: false,
      message: 'Configuración no encontrada para la chapa especificada'
    };

  } catch (error) {
    Logger.log(`❌ Error en getUserConfig: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * ==========================================
 * GESTIÓN DE PRIMAS PERSONALIZADAS
 * (Incluye: Prima, Movimientos, Relevo, Remate)
 * ==========================================
 */

/**
 * Guarda datos personalizados de un jornal específico
 *
 * Estructura de la hoja Primas_Personalizadas:
 * Columna A: Chapa
 * Columna B: Fecha (formato DD/MM/YYYY)
 * Columna C: Jornada (ej: "08-14")
 * Columna D: Prima_Personalizada
 * Columna E: Movimientos_Personalizados
 * Columna F: Relevo (horas)
 * Columna G: Remate (horas)
 * Columna H: Ultima_Actualizacion
 */
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
    const fechaActualizacion = new Date();

    // Validar parámetros requeridos
    if (!chapa || !fecha || !jornada) {
      throw new Error('Faltan parámetros requeridos: chapa, fecha, jornada');
    }

    const data = sheet.getDataRange().getValues();
    let filaExistente = -1;

    // Buscar si ya existe este jornal específico (misma chapa, fecha y jornada)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa && data[i][1] == fecha && data[i][2] == jornada) {
        filaExistente = i + 1;
        break;
      }
    }

    if (filaExistente > 0) {
      // Actualizar fila existente
      sheet.getRange(filaExistente, 4).setValue(prima);
      sheet.getRange(filaExistente, 5).setValue(movimientos);
      sheet.getRange(filaExistente, 6).setValue(relevo);
      sheet.getRange(filaExistente, 7).setValue(remate);
      sheet.getRange(filaExistente, 8).setValue(fechaActualizacion);

      Logger.log(`✅ Datos actualizados para chapa ${chapa}, ${fecha} ${jornada}`);
    } else {
      // Añadir nueva fila
      sheet.appendRow([
        chapa,
        fecha,
        jornada,
        prima,
        movimientos,
        relevo,
        remate,
        fechaActualizacion
      ]);

      Logger.log(`✅ Nuevos datos guardados para chapa ${chapa}, ${fecha} ${jornada}`);
    }

    return {
      success: true,
      message: 'Datos guardados correctamente'
    };

  } catch (error) {
    Logger.log(`❌ Error en savePrimaPersonalizada: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Obtiene todas las primas personalizadas de un usuario
 */
function getPrimasPersonalizadas(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.PRIMAS_PERSONALIZADAS);

    if (!sheet) {
      return {
        success: true,
        message: 'Hoja Primas_Personalizadas no encontrada',
        data: []
      };
    }

    const chapa = params.chapa;

    if (!chapa) {
      throw new Error('Falta parámetro requerido: chapa');
    }

    const data = sheet.getDataRange().getValues();
    const primas = [];

    // Recorrer todas las filas y recopilar datos del usuario
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa) {
        primas.push({
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

    Logger.log(`✅ Recuperados ${primas.length} registros para chapa ${chapa}`);

    return {
      success: true,
      data: primas
    };

  } catch (error) {
    Logger.log(`❌ Error en getPrimasPersonalizadas: ${error.message}`);
    return { success: false, message: error.message };
  }
}
