# Biossmann — Agente IA Equipamiento Médico

Plataforma de levantamiento de equipamiento quirúrgico con IA.

## Despliegue en Replit via GitHub

### Paso 1: Sube a GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `biossmann-agente-equipamiento` (o el que quieras)
3. Privado o público, como prefieras
4. **No** inicialices con README (ya viene incluido)
5. Click "Create repository"
6. GitHub te mostrará comandos. Desde tu terminal:

```bash
cd biossmann-agente-equipamiento
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/biossmann-agente-equipamiento.git
git push -u origin main
```

### Paso 2: Importa en Replit

1. Ve a [replit.com](https://replit.com) y logueate
2. Click **"+ Create Repl"**
3. Selecciona la pestaña **"Import from GitHub"**
4. Pega la URL de tu repo: `https://github.com/TU_USUARIO/biossmann-agente-equipamiento`
5. Click **"Import from GitHub"**
6. Replit detectará que es un proyecto Node.js

### Paso 3: Configura la API Key

1. En Replit, click el icono de 🔒 **"Secrets"** en el panel izquierdo (o busca "Secrets" en Tools)
2. Agrega un nuevo secret:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-xxxxxxxxxxxxxxx` (tu clave de [console.anthropic.com](https://console.anthropic.com/))
3. Click "Add Secret"

### Paso 4: Instala y ejecuta

1. En la terminal de Replit (Shell), ejecuta:
```bash
npm install
```
2. Click el botón verde **"Run"** (o ejecuta `npm run dev`)
3. Replit abrirá el Webview con tu app funcionando
4. La URL pública será algo como: `https://biossmann-agente-equipamiento.TU_USUARIO.repl.co`

### Paso 5: Comparte

La URL de Replit es pública y accesible. Puedes compartirla directamente para la demo.
El micrófono funcionará en Chrome ya que Replit sirve con HTTPS.

---

## Estructura del proyecto

```
├── .replit              # Configuración de Replit
├── replit.nix           # Dependencias del entorno
├── package.json         # Dependencias Node.js
├── vite.config.js       # Servidor dev + proxy API
├── index.html           # HTML base
└── src/
    ├── main.jsx         # Entry point React
    └── App.jsx          # App completa (datos, chat guiado, analytics)
```

## ¿Cómo funciona la API Key?

- La API key se guarda como **Secret** en Replit (nunca se expone al navegador)
- `vite.config.js` configura un **proxy**: el browser llama a `/api/claude` → Vite intercepta y reenvía a `api.anthropic.com` agregando la key en el servidor
- El código del frontend **nunca** contiene la key

## Solución de problemas

**"npm install" falla:**
Ejecuta `npm install --legacy-peer-deps`

**La app carga pero Claude no responde:**
Verifica que el Secret `ANTHROPIC_API_KEY` esté bien configurado. Revisa la consola del navegador (F12 → Console) para ver errores.

**El micrófono no funciona:**
Requiere HTTPS (Replit lo incluye) y Chrome/Edge. Safari tiene soporte limitado.

**Quiero actualizar el código:**
Edita en Replit directamente o haz push a GitHub y en Replit: Shell → `git pull`
