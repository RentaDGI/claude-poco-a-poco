# ⚠️ SEGURIDAD URGENTE - INFORMACIÓN PERSONAL EXPUESTA

## 🚨 PROBLEMA CRÍTICO

Has detectado que alguien está leyendo tu Google Sheet donde hay:
- Contraseñas de usuarios
- Información personal (chapas, nombres)
- Datos laborales sensibles

⚠️ **SOLUCIÓN ELEGIDA:** Opción C - Sheet PRIVADO + Apps Script PÚBLICO

## 📋 ACCIONES INMEDIATAS (HACER AHORA)

### 1. Revisar quién tiene acceso al Google Sheet

1. Abre el Google Sheet del portal
2. Haz clic en **Compartir** (arriba a la derecha)
3. Revisa la lista de personas con acceso
4. **Elimina** a cualquier persona que no debería tener acceso
5. Cambia el acceso general de "Cualquiera con el enlace" a **"Restringido"**

### 2. Configurar Apps Script como Web App PÚBLICA (pero segura)

1. En el Google Sheet: **Extensiones** > **Apps Script**
2. Clic en **Implementar** > **Gestionar implementaciones**
3. Edita la implementación activa (icono de lápiz):
   - **Ejecutar como:** **Yo (tu email)** ← CRÍTICO
   - **Quién tiene acceso:** **Cualquiera** ← Permite que los usuarios llamen al script
4. Clic en **Implementar**

⚠️ **IMPORTANTE:** Con "Ejecutar como: Yo", el script usa TUS permisos para leer el Sheet privado, aunque los usuarios no tengan acceso directo.

### 3. Verificar que la PWA sigue funcionando

Prueba desde la PWA:
- ✅ Iniciar sesión
- ✅ Enviar mensaje al foro
- ✅ Ver jornales

Si todo funciona correctamente, el Sheet está seguro pero la PWA opera normalmente.

### 4. Cambiar contraseñas comprometidas (OPCIONAL)

⚠️ **Si alguien no autorizado tuvo acceso:**

Opciones:
- Pide a los usuarios afectados que cambien su contraseña desde la PWA
- Resetea manualmente las contraseñas desde el Sheet (solo tú puedes verlas ahora)

---

## 🔒 CONFIGURACIÓN ACTUAL (Opción C implementada)

### ✅ Arquitectura de Seguridad

```
┌─────────────────────────────────────────────────┐
│  Google Sheet: PRIVADO (solo tú)               │
│  - Usuarios y contraseñas                      │
│  - Configuración                               │
│  - Datos sensibles                             │
└────────────────┬────────────────────────────────┘
                 │
                 │ Solo tú puedes leer/escribir
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Apps Script: PÚBLICO (como API)               │
│  - Ejecutar como: TÚ (con tus credenciales)    │
│  - Quién tiene acceso: Cualquiera              │
│  - Funciona como intermediario seguro          │
└────────────────┬────────────────────────────────┘
                 │
                 │ Endpoint público
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  PWA (usuarios finales)                        │
│  - Pueden llamar funciones del Apps Script     │
│  - NO pueden ver el Sheet directamente         │
│  - NO pueden ver contraseñas de otros          │
└─────────────────────────────────────────────────┘
```

### 🎯 Ventajas de esta configuración

✅ **Seguridad:**
- Solo TÚ puedes ver el Google Sheet
- Contraseñas en texto plano (solo tú las ves)
- Nadie más puede leer datos sensibles

✅ **Funcionalidad:**
- La PWA sigue funcionando perfectamente
- Apps Script actúa con tus credenciales
- No afecta a los usuarios

✅ **Administración:**
- Puedes ver todas las contraseñas cuando necesites
- Menú de administración en Google Sheets:
  - 🔑 Ver todas las contraseñas
  - 📊 Estadísticas de usuarios

---

## 🔧 PANEL DE ADMINISTRACIÓN

Después de actualizar el Apps Script con el código modificado, tendrás un nuevo menú en Google Sheets:

### Cómo usar:

1. Abre el Google Sheet
2. Actualiza el código del Apps Script (`apps-script-completo.js`)
3. Recarga el Sheet (F5)
4. Verás un nuevo menú: **👤 Administración**

### Funciones disponibles:

#### 🔑 Ver todas las contraseñas
- Muestra una ventana emergente con todas las contraseñas
- Formato ordenado y legible
- Solo tú puedes ejecutar esto (Sheet privado)

**Ejemplo:**
```
🔑 CONTRASEÑAS DE USUARIOS (45 total)

1. Chapa 816 - Viking
   Contraseña: mipass123

2. Chapa 768 - Negro
   Contraseña: 768segura

...
```

#### 📊 Estadísticas de usuarios
- Total de usuarios registrados
- Usuarios con/sin contraseña
- Total de mensajes del foro
- Última actualización

---

## 🔍 VERIFICAR ACCESO ACTUAL

### Ver historial de revisiones

1. Google Sheet > **Archivo** > **Historial de versiones** > **Ver historial de versiones**
2. Revisa quién hizo cambios recientes
3. Si hay actividad sospechosa, restaura una versión anterior

---

## ✅ CHECKLIST DE SEGURIDAD

- [ ] Revisar y eliminar accesos no autorizados al Google Sheet
- [ ] Cambiar acceso general a **"Restringido"**
- [ ] Configurar Apps Script: **Ejecutar como: Yo** + **Quién tiene acceso: Cualquiera**
- [ ] Verificar que la PWA sigue funcionando (login, foro, jornales)
- [ ] Actualizar código del Apps Script con funciones de administración
- [ ] Revisar historial de versiones del Sheet
- [ ] (Opcional) Cambiar contraseñas comprometidas
- [ ] Documentar quién debe tener acceso al Sheet (idealmente solo tú)

---

## 📞 SIGUIENTE PASO

1. **AHORA:** Configurar el Sheet como PRIVADO (pasos arriba)
2. **AHORA:** Configurar Apps Script como "Ejecutar como: Yo"
3. **Después:** Actualizar el código del Apps Script
4. **Verificar:** Probar que la PWA funciona correctamente

**La configuración es simple y la PWA seguirá funcionando normalmente.**
