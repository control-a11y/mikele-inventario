# 🍨 Mikele Inventario

Control de pesos de inventario para Mikele Gelato — Transferencias y Recepciones entre Laboratorio y Mikele.

## ✨ Características

- **Autenticación por email** con permisos por rol
- **Vista Laboratorio** (envíos) y **Vista Mikele** (recepciones)
- **Admin** puede acceder a ambas vistas
- **Diseño responsive** — funciona en móvil y desktop
- **Tiempo real** con Supabase

## 👥 Roles

| Email | Rol | Acceso |
|-------|-----|--------|
| `control@yoops.hn` | Admin 👑 | Ambas vistas |
| `administracion@yoops.hn` | Laboratorio 🔬 | Solo transferencias |
| `mikelempsps@gmail.com` | Mikele 🍨 | Solo recepciones |

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/mikele-inventario.git
cd mikele-inventario

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Iniciar en desarrollo
npm run dev
```

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## 🗄️ Base de Datos (Supabase)

### Tabla: `Transferencias`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid | Primary key |
| `articulo` | text | Nombre del producto |
| `peso_transferencia` | numeric | Peso registrado por Laboratorio |
| `peso_recepcion` | numeric | Peso registrado por Mikele |
| `creado_por_rol` | text | Quién creó el registro |
| `created_at` | timestamptz | Fecha de creación |

## 🛠️ Tech Stack

- **React** + **Vite**
- **Supabase** (Auth + Database)
- **React Router** v6
- **CSS** custom (dark theme)

## 📱 Flujo de Uso

1. **Laboratorio** crea un registro → aparece en Mikele para completar peso
2. **Mikele** crea un registro → aparece en Laboratorio para completar peso
3. Cuando ambos pesos están → ✅ Registro completado
