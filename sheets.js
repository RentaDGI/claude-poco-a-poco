/**
 * Módulo de integración con Google Sheets
 * Gestiona la obtención y parseo de datos desde Google Sheets públicas
 *
 * --- ESTADO DE ROBUSTEZ (VERSIÓN "CENSO LIMPIO") ---
 * - getCenso: ROBUSTO (Lee por cabeceras desde censo_limpio)
 * - getPuertas: FRÁGIL (Depende de índices de columna)
 * - getContrataciones: FRÁGIL (Depende de índices de columna)
 * - getUsuarios: FRÁGIL (Depende de índices de columna)
 * - getForoMensajes: FRÁGIL (Parser manual)
 * - getJornales: ROBUSTO (Lee por cabeceras, pero app.js no lo usa para historial)
 */

// Configuración de las hojas de Google Sheets
const SHEETS_CONFIG = {
  // ID ÚNICO de la hoja de cálculo (TODAS las pestañas están en este mismo documento)
  SHEET_ID: '1j-IaOHXoLEP4bK2hjdn2uAYy8a2chqiQSOw4Nfxoyxc',

  // GIDs de las diferentes pestañas
  GID_JORNALES: '1885242510',      // Pestaña: Mis Jornales
  GID_JORNALES_HISTORICO: '418043978',  // Pestaña: Jornales_historico (NUEVA)
  GID_JORNALES_HISTORICO_ACUMULADO: '1604874350',  // Pestaña: Jornales_Historico_Acumulado (HISTÓRICO ROBUSTO)
  GID_CONTRATACION: '1304645770',  // Pestaña: Contrata_Glide
  GID_PUERTAS: '1650839211',       // Pestaña: Puertas (No se usa, getPuertas usa URL hardcodeada)
  GID_MAPEO_PUESTOS: '418043978',  // Pestaña: MAPEO_PUESTOS (Para Sueldómetro)
  GID_TABLA_SALARIOS: '1710373929', // Pestaña: TABLA_SALARIOS (Para Sueldómetro)

  // URL de la hoja "censo_limpio"
  URL_CENSO_LIMPIO: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTcJ5Irxl93zwDqehuLW7-MsuVtphRDtmF8Rwp-yueqcAYRfgrTtEdKDwX8WKkJj1m0rVJc8AncGN_A/pub?gid=1216182924&single=true&output=csv',

  // URLs del Sueldómetro (Añadidas para que las funciones las usen)
  URL_MAPEO_PUESTOS: 'https://docs.google.com/spreadsheets/d/1j-IaOHXoLEP4bK2hjdn2uAYy8a2chqiQSOw4Nfxoyxc/export?format=csv&gid=418043978',
  URL_TABLA_SALARIOS: 'https://docs.google.com/spreadsheets/d/1j-IaOHXoLEP4bK2hjdn2uAYy8a2chqiQSOw4Nfxoyxc/export?format=csv&gid=1710373929'
};

/**
 * Construye la URL para obtener datos en formato CSV
 */
function getSheetCSVUrl(sheetId, gid) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

/**
 * Parsea CSV a array de objetos
 */
function parseCSV(csv) {
  if (!csv || csv.trim() === '') {
    return [];
  }

  const lines = csv.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}

/**
 * Parsea una línea CSV manejando comillas y comas dentro de campos
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Obtiene datos de una hoja
 */
async function fetchSheetData(sheetId, gid, useCache = true) {
  const cacheKey = `sheet_${sheetId}_${gid}`;
  const cacheTimeKey = `sheet_${sheetId}_${gid}_time`;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  // Verificar cache
  if (useCache) {
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);

    if (cached && cacheTime) {
      const age = Date.now() - parseInt(cacheTime);
      if (age < CACHE_DURATION) {
        return JSON.parse(cached);
      }
    }
  }

  try {
    const url = getSheetCSVUrl(sheetId, gid);
    const response = await fetch(url, {
      headers: {
        'Accept-Charset': 'utf-8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Asegurar lectura UTF-8
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(buffer);
    const data = parseCSV(csv);

    // Guardar en cache
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheTimeKey, Date.now().toString());

    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);

    // Intentar devolver datos en cache aunque estén expirados
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.warn('Usando datos en cache expirados debido a error en la carga');
      return JSON.parse(cached);
    }

    throw error;
  }
}

/**
 * API principal para obtener datos
 */
const SheetsAPI = {
  /**
   * [FRÁGIL] Obtiene las puertas desde CSV directo
   */
  async getPuertas() {
    try {
      const puertasURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrQ5bGZDNShEWi1lwx_l1EvOxC0si5kbN8GBxj34rF0FkyGVk6IZOiGk5D91_TZXBHO1mchydFvvUl/pub?gid=3770623&single=true&output=csv';

      const response = await fetch(puertasURL, {
        headers: {
          'Accept-Charset': 'utf-8'
        },
        cache: 'no-store' // Evitar caché del navegador para puertas
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Asegurar lectura UTF-8
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const csvText = decoder.decode(buffer);
      console.log('=== PUERTAS CSV RAW (primeros 300 chars) ===');
      console.log(csvText.substring(0, 300));

      // Dividir en líneas y limpiar
      const lines = csvText.split('\n').map(l => l.trim()).filter(l => l !== '');

      // Definir el orden fijo de jornadas
      const jornadasOrdenadas = ['02-08', '08-14', '14-20', '20-02', 'Festivo'];

      // Inicializar objetos para almacenar las puertas de cada jornada
      const primeraPuertaPorJornada = {};  // Puerta SP (índice 3)
      const segundaPuertaPorJornada = {};  // Puerta OC (índice 4)
      jornadasOrdenadas.forEach(j => {
        primeraPuertaPorJornada[j] = '';
        segundaPuertaPorJornada[j] = '';
      });

      let fecha = '';

      // PRIMERO: Buscar la fecha en las primeras 5 líneas (sin importar el número de columnas)
      for (let idx = 0; idx < Math.min(5, lines.length) && !fecha; idx++) {
        const line = lines[idx];
        const columns = line.split(',').map(c => c.trim().replace(/"/g, ''));

        for (const col of columns) {
          if (col && /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(col)) {
            // Formatear fecha: 3/11/25 → 03/11/2025
            const parts = col.split('/');
            const dia = parts[0].padStart(2, '0');
            const mes = parts[1].padStart(2, '0');
            let anio = parts[2];
            // Convertir año de 2 dígitos a 4 dígitos
            if (anio.length === 2) {
              anio = '20' + anio;
            }
            fecha = `${dia}/${mes}/${anio}`;
            console.log('Fecha encontrada y formateada:', fecha, 'en línea', idx);
            break;
          }
        }
      }

      // SEGUNDO: Procesar las puertas
      for (const line of lines) {
        // Saltar líneas de advertencia
        if (line.includes('No se admiten') || line.includes('!!')) continue;

        // Dividir manualmente por comas y limpiar
        const columns = line.split(',').map(c => c.trim().replace(/"/g, ''));

        if (columns.length < 7) {
          continue;
        }

        const rawJornada = columns[2]; // La jornada está en la columna 3 (índice 2)
        if (!rawJornada) continue;

        let jornada = rawJornada.replace(/\s+.*/, ''); // limpia "Festivo " → "Festivo"

        // Solo procesar si es turno válido o Festivo
        if (jornadasOrdenadas.includes(jornada)) {
          // Tomar la PRIMERA puerta SP (índice 3 = columna 4)
          const primeraPuerta = columns[3];
          if (primeraPuerta && primeraPuerta !== '' && primeraPuertaPorJornada[jornada] === '') {
            // Solo asignar si aún no tiene valor
            primeraPuertaPorJornada[jornada] = primeraPuerta;
            console.log(`Jornada ${jornada}: puerta SP ${primeraPuerta}`);
          }

          // Tomar la SEGUNDA puerta OC (índice 4 = columna 5)
          const segundaPuerta = columns[4];
          if (segundaPuerta && segundaPuerta !== '' && segundaPuertaPorJornada[jornada] === '') {
            // Solo asignar si aún no tiene valor
            segundaPuertaPorJornada[jornada] = segundaPuerta;
            console.log(`Jornada ${jornada}: puerta OC ${segundaPuerta}`);
          }
        }
      }

      // Construir el array de puertas en el orden fijo
      const puertas = jornadasOrdenadas.map(jornada => ({
        jornada: jornada,
        puertaSP: primeraPuertaPorJornada[jornada],
        puertaOC: segundaPuertaPorJornada[jornada]
      }));

      console.log('=== PUERTAS FINALES ===');
      console.log('Fecha:', fecha);
      console.log('Puertas:', puertas);

      return {
        fecha: fecha || new Date().toLocaleDateString('es-ES'),
        puertas: puertas
      };

    } catch (error) {
      console.error('Error obteniendo puertas:', error);
      return this.getMockPuertas();
    }
  },

  /**
   * [FRÁGIL] Obtiene las asignaciones/contrataciones desde CSV directo con formato PIVOTADO
   */
  async getContrataciones(chapa = null) {
    try {
      const contratacionURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTtbkA94xqjf81lsR7bLKKtyES2YBDKs8J2T4UrSEan7e5Z_eaptShCA78R1wqUyYyASJxmHj3gDnY/pub?gid=1388412839&single=true&output=csv';

      const response = await fetch(contratacionURL, { cache: 'no-store' }); // Evitar caché
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      console.log('=== CONTRATACIÓN CSV RAW (primeros 300 chars) ===');
      console.log(csvText.substring(0, 300));

      // Dividir en líneas y limpiar
      const lines = csvText.split('\n').map(l => l.trim()).filter(l => l !== '');

      if (lines.length === 0) {
        throw new Error('CSV vacío');
      }

      // Mapeo de especialidades (según n8n)
      const puestoMap = {
        'T': 'Trincador',
        'TC': 'Trincador de Coches',
        'C1': 'Conductor de 1a',
        'B': 'Conductor de Coches',
        'E': 'Especialista'
      };

      // Parsear la primera línea para obtener los índices de las columnas
      const headerLine = lines[0];
      const headers = [];
      let current = '';
      for (let i = 0; i < headerLine.length; i++) {
        if (headerLine[i] === ',') {
          headers.push(current);
          current = '';
        } else {
          current += headerLine[i];
        }
      }
      headers.push(current);

      console.log('Headers:', headers);

      // Encontrar índices de las columnas relevantes
      const fechaIdx = headers.indexOf('Fecha');
      const jornadaIdx = headers.indexOf('Jornada');
      const empresaIdx = headers.indexOf('Empresa');
      const parteIdx = headers.indexOf('Parte');
      const buqueIdx = headers.indexOf('Buque');
      const tIdx = headers.indexOf('T');
      const tcIdx = headers.indexOf('TC');
      const c1Idx = headers.indexOf('C1');
      const bIdx = headers.indexOf('B');
      const eIdx = headers.indexOf('E');

      console.log('Índices:', { fechaIdx, jornadaIdx, empresaIdx, parteIdx, buqueIdx, tIdx, tcIdx, c1Idx, bIdx, eIdx });

      // Procesar filas (saltar la cabecera)
      const output = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        // Dividir manualmente la línea respetando comillas
        const fields = [];
        let current = '';
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        fields.push(current.trim());

        // Saltar si la fila no tiene suficientes columnas
        if (fields.length <= Math.max(eIdx, bIdx, c1Idx, tcIdx, tIdx)) continue;

        // Obtener valores de las columnas clave
        const fecha = fields[fechaIdx] || '';
        const jornada = fields[jornadaIdx] || '';
        const empresa = fields[empresaIdx] || '';
        const parte = fields[parteIdx] || '';
        const buque = fields[buqueIdx] || '';

        // Iterar sobre las columnas de puestos
        for (const [colKey, puestoNombre] of Object.entries(puestoMap)) {
          let idx;
          if (colKey === 'T') idx = tIdx;
          if (colKey === 'TC') idx = tcIdx;
          if (colKey === 'C1') idx = c1Idx;
          if (colKey === 'B') idx = bIdx;
          if (colKey === 'E') idx = eIdx;

          const chapaValue = fields[idx];
          if (chapaValue && chapaValue.trim() !== '') {
            output.push({
              fecha: fecha,
              chapa: chapaValue.trim(),
              puesto: puestoNombre,
              jornada: jornada,
              empresa: empresa,
              buque: buque,
              parte: parte
            });
          }
        }
      }

      console.log('=== CONTRATACIONES FINALES ===');
      console.log('Total:', output.length);

      // Filtrar por chapa si se proporciona
      if (chapa) {
        const filtered = output.filter(c => c.chapa === chapa.toString());
        console.log(`Contrataciones para chapa ${chapa}:`, filtered);
        return filtered;
      }

      return output;

    } catch (error) {
      console.error('Error obteniendo contrataciones:', error);
      return this.getMockContrataciones(chapa);
    }
  },

  /**
   * [ROBUSTO] Obtiene el censo de disponibilidad
   * Formato del CSV: lee la URL del censo limpio y parsea usando cabeceras.
   * Cabeceras esperadas: posicion, chapa, color
   */
  async getCenso() {
    // Clave de caché única para esta función
    const cacheKey = 'censo_limpio_data';
    const cacheTimeKey = 'censo_limpio_time';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    // 1. Verificar cache
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    if (cached && cacheTime) {
      const age = Date.now() - parseInt(cacheTime);
      if (age < CACHE_DURATION) {
        console.log('Usando censo desde caché');
        return JSON.parse(cached);
      }
    }

    try {
      console.log('Obteniendo censo desde la nueva URL...');
      // 2. Obtener el texto CSV
      const response = await fetch(SHEETS_CONFIG.URL_CENSO_LIMPIO, {
        cache: 'no-store' // No cachear esta petición
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const csvText = decoder.decode(buffer);

      // 3. Parsear el CSV usando la función robusta
      const data = parseCSV(csvText);
      
      // 4. Mapear y limpiar los datos
      const censoItems = data.map(item => {
        // Mapear código de color a nombre
        let colorName;
        // Limpiar el valor de color de '\r'
        const colorVal = item.color ? item.color.replace(/\r/g, '') : '';
        const colorNum = parseInt(colorVal);

        switch (colorNum) {
          case 4: colorName = 'green'; break;
          case 3: colorName = 'blue'; break;
          case 2: colorName = 'yellow'; break;
          case 1: colorName = 'orange'; break;
          case 0: colorName = 'red'; break;
          default: colorName = 'green'; // Fallback por si acaso
        }

        return {
          posicion: parseInt(item.posicion),
          chapa: item.chapa, // Mantener como string
          color: colorName
        };
      }).filter(item => item.chapa && item.color && !isNaN(item.posicion)); // Asegurar que los datos son válidos

      console.log('=== CENSO PROCESADO (NUEVO MÉTODO) ===');
      console.log('Total de chapas:', censoItems.length);
      
      // 5. Guardar en caché
      localStorage.setItem(cacheKey, JSON.stringify(censoItems));
      localStorage.setItem(cacheTimeKey, Date.now().toString());

      return censoItems;

    } catch (error) {
      console.error('Error obteniendo censo (nuevo método):', error);
      
      // Intentar devolver caché expirado si falla
      if (cached) {
        console.warn('Usando censo de caché expirado por error');
        return JSON.parse(cached);
      }
      
      // Si no hay caché y falla, lanzar error
      throw new Error('No se pudo cargar el censo.');
    }
  },

  /**
   * Obtiene la posición de una chapa específica en el censo
   * (Actualizado para usar el nuevo getCenso)
   */
  async getPosicionChapa(chapa) {
    try {
      const censo = await this.getCenso(); // Llama a la nueva función
      const item = censo.find(c => c.chapa === chapa);
      return item ? item.posicion : null;
    } catch (error) {
      console.error('Error obteniendo posición de chapa:', error);
      return null;
    }
  },

  /**
   * Calcula posiciones hasta contratación
   * (Actualizado para usar el nuevo getPosicionChapa y el nuevo getPuertas)
   */
  // ... (el resto del archivo sheets.js se mantiene igual)

  /**
   * Calcula posiciones hasta contratación (Laborable y Festiva)
   * (Actualizado para usar el nuevo getPosicionChapa y el nuevo getPuertas)
   * Devuelve un objeto: { laborable: X, festiva: Y }
   */
  async getPosicionesHastaContratacion(chapa) {
    try {
      // 1. Obtener Posición del Usuario y Tipo de Censo
      const posicionUsuario = await this.getPosicionChapa(chapa);
      if (!posicionUsuario) {
        return null;
      }

      const LIMITE_SP = 449;
      const INICIO_OC = 450;
      const FIN_OC = 535;

      const esUsuarioSP = posicionUsuario <= LIMITE_SP;

      // 2. Obtener Puertas
      const puertasResult = await this.getPuertas();
      const puertas = puertasResult.puertas;

      // --- 3. CÁLCULO PARA PUERTAS LABORABLES ---
      const puertasLaborables = puertas.filter(p => p.jornada !== 'Festivo');
      
      const puertasSP_Lab = puertasLaborables
        .map(p => parseInt(p.puertaSP))
        .filter(n => !isNaN(n) && n > 0);
      
      const puertasOC_Lab = puertasLaborables
        .map(p => parseInt(p.puertaOC))
        .filter(n => !isNaN(n) && n > 0);

      let posicionesLaborable = null;

      if (esUsuarioSP) {
        if (puertasSP_Lab.length > 0) {
          const ultimaPuertaSP_Lab = Math.max(...puertasSP_Lab);
          if (posicionUsuario > ultimaPuertaSP_Lab) {
            posicionesLaborable = posicionUsuario - ultimaPuertaSP_Lab;
          } else {
            posicionesLaborable = (LIMITE_SP - ultimaPuertaSP_Lab) + posicionUsuario;
          }
        }
      } else { // esUsuarioOC
        if (puertasOC_Lab.length > 0) {
          const ultimaPuertaOC_Lab = Math.max(...puertasOC_Lab);
          if (posicionUsuario > ultimaPuertaOC_Lab) {
            posicionesLaborable = posicionUsuario - ultimaPuertaOC_Lab;
          } else {
            posicionesLaborable = (FIN_OC - ultimaPuertaOC_Lab) + (posicionUsuario - INICIO_OC + 1);
          }
        }
      }

      // --- 4. CÁLCULO PARA PUERTAS FESTIVAS ---
      const puertasFestivas = puertas.filter(p => p.jornada === 'Festivo');
      
      const puertasSP_Fest = puertasFestivas
        .map(p => parseInt(p.puertaSP))
        .filter(n => !isNaN(n) && n > 0);

      const puertasOC_Fest = puertasFestivas
        .map(p => parseInt(p.puertaOC))
        .filter(n => !isNaN(n) && n > 0);
      
      let posicionesFestiva = null;

      if (esUsuarioSP) {
        if (puertasSP_Fest.length > 0) {
          const ultimaPuertaSP_Fest = Math.max(...puertasSP_Fest);
          if (posicionUsuario > ultimaPuertaSP_Fest) {
            posicionesFestiva = posicionUsuario - ultimaPuertaSP_Fest;
          } else {
            posicionesFestiva = (LIMITE_SP - ultimaPuertaSP_Fest) + posicionUsuario;
          }
        }
      } else { // esUsuarioOC
        if (puertasOC_Fest.length > 0) {
          const ultimaPuertaOC_Fest = Math.max(...puertasOC_Fest);
          if (posicionUsuario > ultimaPuertaOC_Fest) {
            posicionesFestiva = posicionUsuario - ultimaPuertaOC_Fest;
          } else {
            posicionesFestiva = (FIN_OC - ultimaPuertaOC_Fest) + (posicionUsuario - INICIO_OC + 1);
          }
        }
      }

      // 5. Devolver el objeto con ambos resultados
      return {
        laborable: posicionesLaborable,
        festiva: posicionesFestiva
      };

    } catch (error) {
      console.error('Error calculando posiciones hasta contratación:', error);
      return null;
    }
  },

  // ... (el resto de funciones de sheets.js se mantienen igual)

  /**
   * [FRÁGIL] Obtiene mensajes del foro desde Google Sheet
   */
  async getForoMensajes() {
    try {
      // URL del CSV del foro publicado
      const foroURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTcJ5Irxl93zwDqehuLW7-MsuVtphRDtmF8Rwp-yueqcAYRfgrTtEdKDwX8WKkJj1m0rVJc8AncGN_A/pub?gid=464918425&single=true&output=csv';

      const response = await fetch(foroURL, { cache: 'no-store' });
      if (!response.ok) {
        console.warn('⚠️ Foro sheet no disponible (HTTP ' + response.status + '). Asegúrate de publicar la pestaña "foro" como CSV en Archivo → Compartir → Publicar en la web');
        return null; // Fallback a localStorage
      }

      const csvText = await response.text();
      const mensajes = [];

      // Parser CSV robusto que maneja campos multilinea (con saltos de línea dentro de comillas)
      let inQuotes = false;
      let currentField = '';
      let currentRow = [];
      let skipHeader = true;

      for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Comilla escapada ("")
            currentField += '"';
            i++; // Saltar la siguiente comilla
          } else {
            // Toggle estado de comillas
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // Fin de campo
          currentRow.push(currentField);
          currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          // Fin de línea (fuera de comillas)
          if (currentField || currentRow.length > 0) {
            currentRow.push(currentField);
            currentField = '';

            // Procesar fila completada
            if (currentRow.length >= 3 && !skipHeader) {
              const timestamp = currentRow[0] ? currentRow[0].trim() : '';
              const chapa = currentRow[1] ? currentRow[1].trim() : '';
              const texto = currentRow[2] ? currentRow[2].trim() : '';

              if (timestamp && chapa && texto) {
                // Intentar parsear el timestamp
                let parsedDate = new Date(timestamp);

                // Si el timestamp no es válido, usar timestamp falso
                const id = parsedDate.getTime() && !isNaN(parsedDate.getTime())
                  ? parsedDate.getTime()
                  : Date.now() - mensajes.length * 1000;

                mensajes.push({
                  id: id,
                  timestamp: timestamp,
                  chapa: chapa,
                  texto: texto
                });
              }
            }

            skipHeader = false; // Después de la primera fila, no saltamos más
            currentRow = [];
          }
          // Saltar \r\n juntos
          if (char === '\r' && nextChar === '\n') {
            i++;
          }
        } else {
          // Carácter normal (incluyendo \n dentro de comillas)
          currentField += char;
        }
      }

      // Procesar última fila si existe
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        if (currentRow.length >= 3 && !skipHeader) {
          const timestamp = currentRow[0] ? currentRow[0].trim() : '';
          const chapa = currentRow[1] ? currentRow[1].trim() : '';
          const texto = currentRow[2] ? currentRow[2].trim() : '';

          if (timestamp && chapa && texto) {
            let parsedDate = new Date(timestamp);
            const id = parsedDate.getTime() && !isNaN(parsedDate.getTime())
              ? parsedDate.getTime()
              : Date.now() - mensajes.length * 1000;

            mensajes.push({
              id: id,
              timestamp: timestamp,
              chapa: chapa,
              texto: texto
            });
          }
        }
      }

      console.log('✅ Mensajes del foro compartido cargados:', mensajes.length);
      if (mensajes.length > 0) {
        console.log('Primer mensaje:', mensajes[0]);
      }
      return mensajes;

    } catch (error) {
      console.error('❌ Error obteniendo mensajes del foro:', error);
      return null; // Fallback a localStorage
    }
  },

  /**
   * Envía un mensaje al foro usando Google Apps Script
   * URL del Apps Script configurada automáticamente
   */
  async enviarMensajeForo(chapa, texto) {
    try {
      // URL del Google Apps Script Web App - Configuración automática
      let appsScriptURL = localStorage.getItem('foro_apps_script_url');

      // Si no está configurada en localStorage, usar la URL por defecto
      if (!appsScriptURL || appsScriptURL === '' || appsScriptURL === 'null') {
        appsScriptURL = 'https://script.google.com/macros/s/AKfycby7Cj08EDdVHXlzb1BKUXg0G5Zc_FuOMTp672U9_2K9tzgVy5p6q_sj4G8ctvHjR58hxg/exec';
        // Guardar en localStorage para futuros usos
        localStorage.setItem('foro_apps_script_url', appsScriptURL);
        console.log('✅ URL del Apps Script configurada automáticamente');
      }

      const response = await fetch(appsScriptURL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requiere no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addMessage',
          chapa: chapa,
          texto: texto,
          timestamp: new Date().toISOString()
        })
      });

      console.log('✅ Mensaje enviado al Apps Script del foro compartido');
      return true;

    } catch (error) {
      console.error('Error enviando mensaje al foro:', error);
      return false; // Fallback a localStorage
    }
  },

  /**
   * Cambia la contraseña de un usuario vía Apps Script
   * Esto actualiza el Google Sheet directamente
   */
  async cambiarContrasenaAppsScript(chapa, nuevaContrasena) {
    try {
      // URL del Google Apps Script Web App
      let appsScriptURL = localStorage.getItem('foro_apps_script_url');

      if (!appsScriptURL || appsScriptURL === '' || appsScriptURL === 'null') {
        appsScriptURL = 'https://script.google.com/macros/s/AKfycby7Cj08EDdVHXlzb1BKUXg0G5Zc_FuOMTp672U9_2K9tzgVy5p6q_sj4G8ctvHjR58hxg/exec';
      }

      console.log('🔐 Enviando cambio de contraseña a Apps Script...');

      const response = await fetch(appsScriptURL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requiere no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'changePassword',
          chapa: chapa,
          newPassword: nuevaContrasena
        })
      });

      console.log('✅ Contraseña actualizada en Google Sheets vía Apps Script');
      return { success: true };

    } catch (error) {
      console.error('Error cambiando contraseña en Apps Script:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sincroniza jornales al backup en Google Sheets
   * Envía todos los jornales de un usuario para guardarlos en Jornales_Historico
   */
  async sincronizarJornalesBackup(chapa, jornales) {
    try {
      let appsScriptURL = localStorage.getItem('foro_apps_script_url');

      if (!appsScriptURL || appsScriptURL === '' || appsScriptURL === 'null') {
        appsScriptURL = 'https://script.google.com/macros/s/AKfycby7Cj08EDdVHXlzb1BKUXg0G5Zc_FuOMTp672U9_2K9tzgVy5p6q_sj4G8ctvHjR58hxg/exec';
      }

      console.log(`📤 Sincronizando ${jornales.length} jornales al backup...`);

      await fetch(appsScriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sincronizarJornales',
          chapa: chapa,
          jornales: jornales
        })
      });

      console.log('✅ Jornales sincronizados al backup en Google Sheets');
      return { success: true };

    } catch (error) {
      console.error('Error sincronizando jornales:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtiene los jornales del backup en Google Sheets
   * Lee desde la pestaña Jornales_Historico
   */
  async obtenerJornalesBackup(chapa) {
    try {
      // Usar la misma función que getJornalesHistorico
      const data = await fetchSheetData(SHEETS_CONFIG.SHEET_ID, SHEETS_CONFIG.GID_JORNALES_HISTORICO);

      // Filtrar por chapa
      const jornalesChapa = data.filter(row => {
        const rowChapa = (row.Chapa || row.chapa || '').toString().trim();
        return rowChapa === chapa.toString().trim();
      }).map(row => ({
        chapa: row.Chapa || row.chapa || '',
        fecha: row.Fecha || row.fecha || '',
        puesto: row.Puesto || row.puesto || row.Puesto_Contratacion || row.puesto_contratacion || '',
        jornada: row.Jornada || row.jornada || '',
        empresa: row.Empresa || row.empresa || '',
        buque: row.Buque || row.buque || '',
        parte: row.Parte || row.parte || ''
      })).filter(item => item.fecha);

      console.log(`📥 Obtenidos ${jornalesChapa.length} jornales del backup`);
      return jornalesChapa;

    } catch (error) {
      console.error('Error obteniendo jornales del backup:', error);
      return [];
    }
  },

  /**
   * [FRÁGIL] Obtiene usuarios desde Google Sheet para validación de login
   */
  async getUsuarios() {
    try {
      const usuariosURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTcJ5Irxl93zwDqehuLW7-MsuVtphRDtmF8Rwp-yueqcAYRfgrTtEdKDwX8WKkJj1m0rVJc8AncGN_A/pub?gid=1704760412&single=true&output=csv';

      const response = await fetch(usuariosURL, {
        headers: {
          'Accept-Charset': 'utf-8'
        },
        cache: 'no-store' // No cachear usuarios
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Asegurar lectura UTF-8
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const csvText = decoder.decode(buffer);
      console.log('=== USUARIOS CSV (primeros 100 chars) ===');
      console.log(csvText.substring(0, 100));

      const lines = csvText.split('\n').filter(line => line.trim() !== '');
      const usuarios = [];

      // Saltar header (primera línea)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const fields = parseCSVLine(line);

        if (fields.length >= 2) {
          const contrasena = fields[0] ? fields[0].trim() : '';
          const chapa = fields[1] ? fields[1].trim() : '';
          const nombre = fields[2] ? fields[2].trim() : '';  // Nueva: columna C

          if (contrasena && chapa) {
            usuarios.push({
              chapa: chapa,
              contrasena: contrasena,
              nombre: nombre || `Chapa ${chapa}`  // Fallback si no hay nombre
            });
          }
        }
      }

      console.log('Total usuarios cargados:', usuarios.length);
      return usuarios;

    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  },

  /**
   * Obtiene el nombre de un usuario por su chapa
   * Primero busca en localStorage (cache), luego en el sheet
   */
  async getNombrePorChapa(chapa) {
    try {
      // Buscar en cache de localStorage primero
      const usuariosCache = JSON.parse(localStorage.getItem('usuarios_cache') || '{}');
      if (usuariosCache[chapa]) {
        return usuariosCache[chapa];
      }

      // Si no está en cache, obtener todos los usuarios
      const usuarios = await this.getUsuarios();
      const usuario = usuarios.find(u => u.chapa === chapa);

      if (usuario && usuario.nombre) {
        // Guardar en cache
        usuariosCache[chapa] = usuario.nombre;
        localStorage.setItem('usuarios_cache', JSON.stringify(usuariosCache));
        return usuario.nombre;
      }

      // Fallback
      return `Chapa ${chapa}`;

    } catch (error) {
      console.error('Error obteniendo nombre:', error);
      return `Chapa ${chapa}`;
    }
  },

  /**
   * [ROBUSTO] Obtiene TODOS los jornales de un estibador (Para el historial)
   * Esta función lee de la pestaña GID_JORNALES
   */
  async getJornales(chapa) {
    try {
      // Usa fetchSheetData, que es robusto y lee cabeceras
      const data = await fetchSheetData(SHEETS_CONFIG.SHEET_ID, SHEETS_CONFIG.GID_JORNALES);

      // Filtrar TODOS los registros por chapa
      const jornalesChapa = data.filter(row => {
        const rowChapa = (row.Chapa || row.chapa || '').toString().trim();
        return rowChapa === chapa.toString().trim();
      }).map(row => ({
        // Mapea usando los nombres de cabecera esperados
        fecha: row.Fecha || row.fecha || '',
        puesto: row.Puesto || row.puesto || '',
        jornada: row.Jornada || row.jornada || '',
        empresa: row.Empresa || row.empresa || '',
        buque: row.Buque || row.buque || '',
        parte: row.Parte || row.parte || ''
      })).filter(item => item.fecha); // Filtrar filas sin fecha

      return jornalesChapa;

    } catch (error) {
      console.error('Error obteniendo jornales:', error);
      // En caso de error, retornar array vacío en lugar de datos mock
      return [];
    }
  },

  /**
   * [ROBUSTO] Obtiene jornales históricos desde la hoja Jornales_historico
   * Columnas esperadas: Chapa, Fecha, Puesto, Jornada, Empresa, Buque, Parte, Logo_Empresa_URL
   */
  async getJornalesHistorico(chapa) {
    try {
      // Usa fetchSheetData, que es robusto y lee cabeceras
      const data = await fetchSheetData(SHEETS_CONFIG.SHEET_ID, SHEETS_CONFIG.GID_JORNALES_HISTORICO);

      // Filtrar TODOS los registros por chapa
      const jornalesChapa = data.filter(row => {
        const rowChapa = (row.Chapa || row.chapa || '').toString().trim();
        return rowChapa === chapa.toString().trim();
      }).map(row => ({
        // Mapea usando los nombres de cabecera esperados
        chapa: row.Chapa || row.chapa || '',
        fecha: row.Fecha || row.fecha || '',
        puesto: row.Puesto || row.puesto || '',
        jornada: row.Jornada || row.jornada || '',
        empresa: row.Empresa || row.empresa || '',
        buque: row.Buque || row.buque || '',
        parte: row.Parte || row.parte || '',
        logo_empresa_url: row.Logo_Empresa_URL || row.logo_empresa_url || ''
      })).filter(item => item.fecha); // Filtrar filas sin fecha

      console.log(`Jornales históricos para chapa ${chapa}:`, jornalesChapa.length);
      return jornalesChapa;

    } catch (error) {
      console.error('Error obteniendo jornales históricos:', error);
      return [];
    }
  },

  /**
   * [ROBUSTO] Obtiene contrataciones desde la hoja contrata_glide
   * Columnas esperadas: Fecha, Chapa, Puesto_Contratacion, Jornada, Empresa, Buque, Parte, Logo_Empresa_URL
   */
  async getContrataGlide(chapa = null) {
    try {
      // Usa fetchSheetData, que es robusto y lee cabeceras
      const data = await fetchSheetData(SHEETS_CONFIG.SHEET_ID, SHEETS_CONFIG.GID_CONTRATACION, false); // No usar cache para contrataciones

      // Mapear todas las filas
      const contrataciones = data.map(row => ({
        fecha: row.Fecha || row.fecha || '',
        chapa: (row.Chapa || row.chapa || '').toString().trim(),
        puesto: row.Puesto_Contratacion || row.puesto_contratacion || row.Puesto || row.puesto || '',
        jornada: row.Jornada || row.jornada || '',
        empresa: row.Empresa || row.empresa || '',
        buque: row.Buque || row.buque || '',
        parte: row.Parte || row.parte || '',
        logo_empresa_url: row.Logo_Empresa_URL || row.logo_empresa_url || ''
      })).filter(item => item.fecha && item.chapa); // Filtrar filas sin fecha o chapa

      // Filtrar por chapa si se proporciona
      if (chapa) {
        const filtered = contrataciones.filter(c => c.chapa === chapa.toString().trim());
        console.log(`Contrataciones glide para chapa ${chapa}:`, filtered.length);
        return filtered;
      }

      console.log('Total contrataciones glide:', contrataciones.length);
      return contrataciones;

    } catch (error) {
      console.error('Error obteniendo contrataciones glide:', error);
      return [];
    }
  },

  /**
   * [ROBUSTO] Obtiene jornales desde el histórico acumulado (Jornales_Historico_Acumulado)
   * Esta pestaña se alimenta automáticamente cada hora desde contrata_glide vía Apps Script
   * Columnas: Fecha, Chapa, Puesto_Contratacion, Jornada, Empresa, Buque, Parte, Logo_Empresa_URL, Timestamp_Guardado
   */
  async getJornalesHistoricoAcumulado(chapa) {
    try {
      // Usa fetchSheetData, robusto y lee cabeceras
      const data = await fetchSheetData(SHEETS_CONFIG.SHEET_ID, SHEETS_CONFIG.GID_JORNALES_HISTORICO_ACUMULADO, false); // No cache

      // Filtrar por chapa y mapear
      const jornalesChapa = data.filter(row => {
        const rowChapa = (row.Chapa || row.chapa || '').toString().trim();
        return rowChapa === chapa.toString().trim();
      }).map(row => ({
        chapa: row.Chapa || row.chapa || '',
        fecha: row.Fecha || row.fecha || '',
        puesto: row.Puesto_Contratacion || row.puesto_contratacion || row.Puesto || row.puesto || '',
        jornada: row.Jornada || row.jornada || '',
        empresa: row.Empresa || row.empresa || '',
        buque: row.Buque || row.buque || '',
        parte: row.Parte || row.parte || '',
        logo_empresa_url: row.Logo_Empresa_URL || row.logo_empresa_url || '',
        timestamp_guardado: row.Timestamp_Guardado || row.timestamp_guardado || ''
      })).filter(item => item.fecha && item.jornada); // Filtrar filas sin fecha o jornada

      console.log(`✅ Jornales históricos acumulados para chapa ${chapa}:`, jornalesChapa.length);
      return jornalesChapa;

    } catch (error) {
      console.error('❌ Error obteniendo jornales históricos acumulados:', error);
      return [];
    }
  },

  /**
   * [ROBUSTO] Obtiene el mapeo de puestos (Puesto → Grupo_Salarial + Tipo_Operativa)
   * Para el Sueldómetro
   * Columnas esperadas: Puesto, Grupo_Salarial, Tipo_Operativa
   */
  async getMapeoPuestos() {
    try {
      const data = await fetchSheetData(SHEETS_CONFIG.SHEET_ID, SHEETS_CONFIG.GID_MAPEO_PUESTOS);

      console.log('📋 Datos raw de mapeo_puestos:', data.slice(0, 3)); // Primeros 3 registros

      // Mapear los datos con las columnas esperadas
      const mapeo = data.map(row => {
        let grupoSalarial = row.Grupo_Salarial || row.grupo_salarial || '';

        // Normalizar "Grupo 1" → "G1", "Grupo 2" → "G2"
        if (grupoSalarial.includes('1')) grupoSalarial = 'G1';
        else if (grupoSalarial.includes('2')) grupoSalarial = 'G2';

        return {
          puesto: row.Puesto || row.puesto || '',
          grupo_salarial: grupoSalarial,
          tipo_operativa: row.Tipo_Operativa || row.tipo_operativa || ''
        };
      }).filter(item => item.puesto && item.grupo_salarial && item.tipo_operativa);

      console.log(`✅ Mapeo de puestos cargado: ${mapeo.length} registros`);
      if (mapeo.length > 0) {
        console.log('📝 Ejemplo de mapeo:', mapeo[0]);
      }
      return mapeo;

    } catch (error) {
      console.error('❌ Error obteniendo mapeo de puestos:', error);
      return [];
    }
  },

  /**
   * [ROBUSTO] Obtiene la tabla salarial (Clave_Jornada → Salarios base y primas)
   * Para el Sueldómetro
   * Columnas esperadas: Clave_Jornada, Jornal_Base_G1, Jornal_Base_G2, Prima_Minima_Coches, Coef_Prima_Mayor120
   */
  async getTablaSalarial() {
    try {
      const data = await fetchSheetData(SHEETS_CONFIG.SHEET_ID, SHEETS_CONFIG.GID_TABLA_SALARIOS);

      console.log('📋 Datos raw de tabla_salarios:', data.slice(0, 3)); // Primeros 3 registros

      // Función auxiliar para parsear números europeos (coma decimal)
      const parseEuropeanFloat = (value) => {
        if (!value) return 0;
        const str = value.toString().replace(',', '.');
        return parseFloat(str) || 0;
      };

      // Mapear los datos con las columnas esperadas
      const tablaSalarial = data.map(row => ({
        clave_jornada: row.Clave_Jornada || row.clave_jornada || '',
        jornal_base_g1: parseEuropeanFloat(row.Jornal_Base_G1 || row.jornal_base_g1),
        jornal_base_g2: parseEuropeanFloat(row.Jornal_Base_G2 || row.jornal_base_g2),
        prima_minima_coches: parseEuropeanFloat(row.Prima_Minima_Coches || row.prima_minima_coches),
        coef_prima_menor120: parseEuropeanFloat(row.Coef_Prima_Menor120 || row.coef_prima_menor120),
        coef_prima_mayor120: parseEuropeanFloat(row.Coef_Prima_Mayor120 || row.coef_prima_mayor120)
      })).filter(item => item.clave_jornada);

      console.log(`✅ Tabla salarial cargada: ${tablaSalarial.length} registros`);
      if (tablaSalarial.length > 0) {
        console.log('📝 Ejemplo de tabla salarial:', tablaSalarial[0]);
      }
      return tablaSalarial;

    } catch (error) {
      console.error('❌ Error obteniendo tabla salarial:', error);
      return [];
    }
  },

  /**
   * Datos mock para puertas (fallback)
   */
  getMockPuertas() {
    return {
      fecha: new Date().toLocaleDateString('es-ES'),
      puertas: [
        { jornada: '02-08', puertaSP: '153', puertaOC: '498' },
        { jornada: '08-14', puertaSP: '153', puertaOC: '498' },
        { jornada: '14-20', puertaSP: '', puertaOC: '' },
        { jornada: '20-02', puertaSP: '', puertaOC: '' },
        { jornada: 'Festivo', puertaSP: '173', puertaOC: '528' }
      ]
    };
  },

  /**
   * Datos mock para contrataciones (fallback)
   */
  getMockContrataciones(chapa = null) {
    const today = new Date().toLocaleDateString('es-ES');
    const allData = [
      { fecha: today, chapa: '221', puesto: 'Conductor de 1ª', jornada: '20-02', empresa: 'APM', buque: 'ODYSSEUS', parte: '1' },
      { fecha: today, chapa: '330', puesto: 'Conductor de 1ª', jornada: '20-02', empresa: 'APM', buque: 'ODYSSEUS', parte: '1' },
      { fecha: today, chapa: '190', puesto: 'Especialista', jornada: '14-20', empresa: 'MSC', buque: 'MSC SARA', parte: '2' },
      { fecha: today, chapa: '604', puesto: 'Trincador', jornada: '20-02', empresa: 'CSP', buque: 'CMA CGM', parte: '1' },
      { fecha: today, chapa: '221', puesto: 'Especialista', jornada: '08-14', empresa: 'MSC', buque: 'MSC OLIVIA', parte: '2' }
    ];

    if (chapa) {
      return allData.filter(c => c.chapa === chapa.toString());
    }
    return allData;
  },

  /**
   * Datos mock para censo (fallback)
   */
  getMockCenso() {
    console.error("--- ERROR: NO SE PUDO CARGAR CENSO, MOCK DESHABILITADO ---");
    throw new Error("El mock de Censo está deshabilitado. La carga real falló.");
  },

  /**
   * Datos mock para jornales (fallback)
   */
  getMockJornales(chapa) {
    const quincenas = [
      { quincena: 'Oct 1-15', jornales: 7, horas: 42, nocturnos: 2, festivos: 1 },
      { quincena: 'Oct 16-31', jornales: 9, horas: 54, nocturnos: 3, festivos: 0 },
      { quincena: 'Nov 1-15', jornales: 8, horas: 48, nocturnos: 2, festivos: 1 }
    ];

    return quincenas.map(q => ({ ...q, chapa }));
  }
};

/**
 * Limpia el cache de datos
 */
function clearSheetsCache() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('sheet_') || key.startsWith('censo_limpio_data')) {
      localStorage.removeItem(key);
    }
  });
  console.log('Cache de sheets limpiado');
}

// Exponer API globalmente
window.SheetsAPI = SheetsAPI;
window.clearSheetsCache = clearSheetsCache;


