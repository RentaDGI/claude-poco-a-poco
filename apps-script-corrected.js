/**
 * Apps Script para Portal Estiba Valencia
 * Corregido: Sin getUi() para compatibilidad con triggers automáticos
 */

const CONFIG = {
  HOJAS: {
    CONTRATA_GLIDE: 'contrata_glide',
    HISTORICO_JORNALES: 'historico_jornales_acumulado',
    CONFIGURACION_USUARIO: 'Configuracion_Usuario',
    PRIMAS_PERSONALIZADAS: 'Primas_Personalizadas',
    FORO: 'foro',
    PASSWORDS: 'passwords'
  },
  CSV_FOLDER_NAME: 'Contrata Portal Estibas',
  CAMPOS_HISTORICO: ['Fecha', 'Chapa', 'Empresa', 'Buque', 'Parte', 'Horario', 'Tipo_Jornada', 'Puesto', 'Procesado']
};

/**
 * Endpoint principal para recibir peticiones POST
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    Logger.log(`📨 Acción recibida: ${action}`);

    const handlers = {
      'addMessage': addMessage,
      'changePassword': changePassword,
      'saveUserConfig': saveUserConfig,
      'getUserConfig': getUserConfig,
      'savePrimaPersonalizada': savePrimaPersonalizada,
      'getPrimasPersonalizadas': getPrimasPersonalizadas
    };

    const handler = handlers[action];
    if (!handler) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Acción no válida' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const result = handler(params);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`❌ Error en doPost: ${error.message}`);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * FUNCIONALIDAD 1: Gestión de configuración de usuario (IRPF)
 */
function saveUserConfig(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.CONFIGURACION_USUARIO);

    if (!sheet) {
      throw new Error('Hoja Configuracion_Usuario no encontrada');
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

    return { success: true, chapa: chapa, irpf: irpf };

  } catch (error) {
    Logger.log(`❌ Error en saveUserConfig: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function getUserConfig(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.CONFIGURACION_USUARIO);

    if (!sheet) {
      return { success: false, error: 'Hoja no encontrada' };
    }

    const chapa = params.chapa;
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa) {
        return {
          success: true,
          chapa: chapa,
          irpf: data[i][1],
          fecha: data[i][2]
        };
      }
    }

    return { success: false, error: 'Configuración no encontrada' };

  } catch (error) {
    Logger.log(`❌ Error en getUserConfig: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * FUNCIONALIDAD 2: Gestión de primas personalizadas
 */
function savePrimaPersonalizada(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.PRIMAS_PERSONALIZADAS);

    if (!sheet) {
      throw new Error('Hoja Primas_Personalizadas no encontrada');
    }

    const { chapa, fecha, jornada, prima, movimientos } = params;
    const fechaActualizacion = new Date();

    sheet.appendRow([chapa, fecha, jornada, prima || 0, movimientos || 0, fechaActualizacion]);
    Logger.log(`✅ Prima personalizada guardada para chapa ${chapa}`);

    return { success: true };

  } catch (error) {
    Logger.log(`❌ Error en savePrimaPersonalizada: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function getPrimasPersonalizadas(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.PRIMAS_PERSONALIZADAS);

    if (!sheet) {
      return { success: false, error: 'Hoja no encontrada' };
    }

    const chapa = params.chapa;
    const data = sheet.getDataRange().getValues();
    const primas = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == chapa) {
        primas.push({
          fecha: data[i][1],
          jornada: data[i][2],
          prima: data[i][3],
          movimientos: data[i][4]
        });
      }
    }

    return { success: true, primas: primas };

  } catch (error) {
    Logger.log(`❌ Error en getPrimasPersonalizadas: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * FUNCIONALIDAD 3: Gestión del foro
 */
function addMessage(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.FORO);

    if (!sheet) {
      throw new Error('Hoja foro no encontrada');
    }

    const { user, text } = params;
    const timestamp = new Date();

    sheet.appendRow([timestamp, user, text]);
    Logger.log(`✅ Mensaje añadido al foro por usuario ${user}`);

    return { success: true, timestamp: timestamp };

  } catch (error) {
    Logger.log(`❌ Error en addMessage: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * FUNCIONALIDAD 4: Gestión de contraseñas
 */
function changePassword(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.HOJAS.PASSWORDS);

    if (!sheet) {
      throw new Error('Hoja passwords no encontrada');
    }

    const { user, newPassword } = params;
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == user) {
        sheet.getRange(i + 1, 2).setValue(newPassword);
        Logger.log(`✅ Contraseña cambiada para usuario ${user}`);
        return { success: true };
      }
    }

    return { success: false, error: 'Usuario no encontrado' };

  } catch (error) {
    Logger.log(`❌ Error en changePassword: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * FUNCIONALIDAD 5: Importación automática desde CSV
 */

/**
 * Función para trigger automático (cada 5 minutos)
 * Importa CSV y ejecuta pivot automáticamente
 */
function importarCSVAutomatico() {
  try {
    Logger.log('🔄 Iniciando importación automática de CSV...');

    const resultado = importarCSVAContrata();

    if (!resultado.success) {
      Logger.log(`❌ Error en importación CSV: ${resultado.error}`);
      return resultado;
    }

    Logger.log(`✅ CSV importado: ${resultado.csvFilas} filas`);

    // Ejecutar pivot automáticamente
    const resultadoPivot = pivotContrataGlideToJornales();

    if (!resultadoPivot.success) {
      Logger.log(`❌ Error en pivot: ${resultadoPivot.error}`);
      return resultadoPivot;
    }

    Logger.log(`✅ Pivot completado: ${resultadoPivot.historicFilasAgregadas} filas agregadas`);

    return {
      success: true,
      csvFilas: resultado.csvFilas,
      historicFilasAgregadas: resultadoPivot.historicFilasAgregadas
    };

  } catch (error) {
    Logger.log(`❌ Error en importarCSVAutomatico: ${error.message}\n${error.stack}`);
    return { success: false, error: error.message };
  }
}

/**
 * Función manual (ejecutable desde el editor o menú)
 * Útil para testing o importación manual
 */
function importarCSVManualmente() {
  try {
    Logger.log('🔄 Iniciando importación manual de CSV...');

    const resultado = importarCSVAutomatico();

    if (resultado.success) {
      Logger.log(`✅ Importación completada:\n- CSV: ${resultado.csvFilas} filas\n- Histórico: ${resultado.historicFilasAgregadas} filas agregadas`);
    } else {
      Logger.log(`❌ Error en importación: ${resultado.error}`);
    }

    return resultado;

  } catch (error) {
    Logger.log(`❌ Error en importarCSVManualmente: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Importa el último CSV de la carpeta a la hoja contrata_glide
 */
function importarCSVAContrata() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.HOJAS.CONTRATA_GLIDE);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.HOJAS.CONTRATA_GLIDE);
      Logger.log('✅ Hoja contrata_glide creada');
    }

    // Buscar carpeta por nombre
    const folders = DriveApp.getFoldersByName(CONFIG.CSV_FOLDER_NAME);
    if (!folders.hasNext()) {
      throw new Error(`Carpeta "${CONFIG.CSV_FOLDER_NAME}" no encontrada`);
    }

    const folder = folders.next();
    const files = folder.getFilesByType(MimeType.CSV);

    let latestFile = null;
    let latestDate = null;

    while (files.hasNext()) {
      const file = files.next();
      const fileDate = file.getLastUpdated();
      if (!latestDate || fileDate > latestDate) {
        latestDate = fileDate;
        latestFile = file;
      }
    }

    if (!latestFile) {
      throw new Error('No se encontró ningún archivo CSV en la carpeta');
    }

    Logger.log(`📁 Archivo CSV encontrado: ${latestFile.getName()}`);

    // Leer y parsear CSV
    const csvContent = latestFile.getBlob().getDataAsString('UTF-8');
    const rows = Utilities.parseCsv(csvContent, '\t');

    if (rows.length === 0) {
      throw new Error('El archivo CSV está vacío');
    }

    // Limpiar hoja y escribir datos
    sheet.clear();
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

    Logger.log(`✅ ${rows.length} filas importadas a contrata_glide`);

    return { success: true, csvFilas: rows.length - 1 }; // -1 para excluir encabezados

  } catch (error) {
    Logger.log(`❌ Error en importarCSVAContrata: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Pivotea datos de contrata_glide a historico_jornales_acumulado
 */
function pivotContrataGlideToJornales() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const contrataSheet = ss.getSheetByName(CONFIG.HOJAS.CONTRATA_GLIDE);
    const historicoSheet = ss.getSheetByName(CONFIG.HOJAS.HISTORICO_JORNALES);

    if (!contrataSheet) {
      throw new Error('Hoja contrata_glide no encontrada');
    }

    if (!historicoSheet) {
      throw new Error('Hoja historico_jornales_acumulado no encontrada');
    }

    const contrataData = contrataSheet.getDataRange().getValues();
    if (contrataData.length <= 1) {
      Logger.log('⚠️ No hay datos en contrata_glide para pivotar');
      return { success: true, historicFilasAgregadas: 0 };
    }

    // Obtener datos existentes del histórico
    const historicoData = historicoSheet.getDataRange().getValues();
    const historicSet = new Set();

    for (let i = 1; i < historicoData.length; i++) {
      const key = historicoData[i].slice(0, 8).join('|');
      historicSet.add(key);
    }

    // Procesar datos de contrata
    const nuevasFilas = [];
    const headers = contrataData[0];

    const indices = {
      fecha: headers.indexOf('Fecha'),
      chapa: headers.indexOf('Chapa'),
      empresa: headers.indexOf('Empresa'),
      buque: headers.indexOf('Buque'),
      parte: headers.indexOf('Parte'),
      horario: headers.indexOf('Horario'),
      tipoJornada: headers.indexOf('Tipo_Jornada'),
      puesto: headers.indexOf('Puesto')
    };

    // Validar que todos los campos existen
    for (const [campo, indice] of Object.entries(indices)) {
      if (indice === -1) {
        throw new Error(`Campo "${campo}" no encontrado en contrata_glide`);
      }
    }

    for (let i = 1; i < contrataData.length; i++) {
      const row = contrataData[i];
      const key = [
        row[indices.fecha],
        row[indices.chapa],
        row[indices.empresa],
        row[indices.buque],
        row[indices.parte],
        row[indices.horario],
        row[indices.tipoJornada],
        row[indices.puesto]
      ].join('|');

      if (!historicSet.has(key)) {
        nuevasFilas.push([
          row[indices.fecha],
          row[indices.chapa],
          row[indices.empresa],
          row[indices.buque],
          row[indices.parte],
          row[indices.horario],
          row[indices.tipoJornada],
          row[indices.puesto],
          'SI'  // Procesado
        ]);
      }
    }

    // Añadir nuevas filas al histórico
    if (nuevasFilas.length > 0) {
      historicoSheet.getRange(historicoSheet.getLastRow() + 1, 1, nuevasFilas.length, 9)
        .setValues(nuevasFilas);
      Logger.log(`✅ ${nuevasFilas.length} filas agregadas a historico_jornales_acumulado`);
    } else {
      Logger.log('⚠️ No hay filas nuevas para agregar');
    }

    return { success: true, historicFilasAgregadas: nuevasFilas.length };

  } catch (error) {
    Logger.log(`❌ Error en pivotContrataGlideToJornales: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Configurar trigger de importación automática (ejecutar UNA SOLA VEZ)
 */
function configurarTriggerImportacionCSV() {
  // Eliminar triggers existentes de importación
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarCSVAutomatico') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log('🗑️ Trigger antiguo eliminado');
    }
  });

  // Crear nuevo trigger cada 5 minutos
  ScriptApp.newTrigger('importarCSVAutomatico')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('✅ Trigger configurado: importarCSVAutomatico cada 5 minutos');
}
