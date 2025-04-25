<div> <p style="text-align:center"> <img align="center" src="./programador.png" alt="JuveYell" width="300px"> </p> </div> <h2 align="center" style="color:#CD5C5C">JLG'777' <img src="https://github.com/blackcater/blackcater/raw/main/images/Hi.gif" height="22" /></h2> <p align="center"> <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&duration=4000&pause=1000&multiline=true&random=false&width=435&lines=Un+proyecto+creado+por+J0RG1T0" alt="Typing SVG" /></a> </p> <hr>

## 📧 Conéctate conmigo:

[![GMAIL](https://img.shields.io/badge/Gmail-Gmail?style=white&logo=Gmail&logoColor=white&color=%23EA4335)](proyectojlg777@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-LinkedIn?style=white&logo=LinkedIn&logoColor=white&color=%230A66C2)](https://linkedin.com/in/)
[![Discord](https://img.shields.io/badge/Discord-Discord?style=white&logo=Discord&logoColor=white&color=%235865F2)](jorgeg777#9720)

---

## 🛡️ Node.js API - Autenticación y Gestión de Personajes

_Este proyecto es un servidor HTTP hecho con Node.js y TypeScript (usando Bun) que ofrece funcionalidades de autenticación y una API REST para gestionar personajes. No depende de frameworks como Express; todo está construido utilizando http nativo._

La API permite realizar operaciones CRUD (Crear, Obtener, Actualizar, Eliminar) sobre las tareas.

---

## 🪢 Características

**Operaciones CRUD**:

- 🔐 **JWT Authentication** (login, register, logout)
- 🧍‍♂️ **Roles:** admin y user
- 📦 **CRUD para personajes** (crear, leer, actualizar, eliminar)
- 🛡️ Middleware de autenticación/autorización
- 🧪 Validación con `valibot`
- 🔒 Tokens revocados para mayor seguridad
- 🧹 Lint, format y check con **Biome**

## 📁 Estructura del proyecto

```BASH
.
├── index.ts               # Entry point del servidor
├── src/
│   ├── routes/            # Rutas para auth y characters
│   ├── middlewares/       # Autenticación y autorización
│   ├── models/            # Usuarios, personajes, esquemas
│   ├── utils/             # Utilidades como parserBody
├── config.ts              # Configuraciones (JWT secret, etc.)
├── package.json
└── tsconfig.json
```

## 🧪 Validaciones
- Emails deben terminar en **@example.com**
- Contraseñas de mínimo **6 caracteres**
- Personajes deben tener name y lastname de al menos 6 caracteres


## 🚀 Comenzando

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

### 📦 Requisitos previos

* Bun >= 1.0.0
* Node.js >= 18.x (solo si deseas comparar)
* TypeScript >= 5.0
(Opcional) Extensión REST Client para probar rutas directamente desde el editor

### 📬 Endpoints principales
#### 🔐 Autenticación (/auth)
- POST /auth/register – Registrar un nuevo usuario (@example.com requerido)
- POST /auth/login – Login y obtención de accessToken + refreshToken
- POST /auth/logout – Cierra sesión y revoca token
#### 👤 Characters (/characters)
Todas las rutas requieren autenticación con JWT
* GET /characters – Obtener todos los personajes
* GET /characters/:id – Obtener un personaje por ID
* POST /characters – Crear un nuevo personaje (valida nombre y apellido)
* PATCH /characters/:id – Actualizar personaje existente
* DELETE /characters/:id – Eliminar personaje por ID

#### 🔑 Ejemplo de token
```bash
Authorization: Bearer <accessToken>
🧪 Validaciones y Esquemas
Correos deben terminar en @example.com
Contraseñas mín. 6 caracteres
Personajes deben tener name y lastname de al menos 6 caracteres
```


#### 🧍‍♂️ Clonar el repositorio

```bash
git clone https://github.com/jlg777/12.bun-biome-auth-rest-api.git

```

#### 🚢 Navegar al directorio del proyecto

```bash
cd 12.bun-biome-auth-rest-api
```

#### 🚨 Instalar dependencias

```bash
bun install
```


#### 🪂 Iniciar la aplicación

Para el desarrollo:

```bash
bun run dev
Esto iniciará el servidor en http://localhost:3001.
```

Para producción:

```bash
bun run build
bun run start
```

#### 🚧 Uso

Una vez que el servidor esté en ejecución, puedes interactuar con la API a través de las siguientes rutas:


#### 🧰 Scripts disponibles

Todos los comandos se ejecutan desde la raíz del proyecto, desde una terminal:

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `bun install`   | Installs dependencies                        |
| `bun run dev`   | Starts local dev server at `localhost:3000`  |
| `bun run lint`  | Linter                                       |
| `bun run check` | Analisis del proyecto                        |

## ✒️ Autores

**Jorge Grandía** - _Trabajo Inicial_ - [JLG777](https://github.com/jlg777)
**Jorge Grandía** - _Documentación_ - [JLG777](#jlg777)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo LICENSE.md para detalles.

## 🎁 Expresiones de Gratitud

- Comenta a otros sobre este proyecto 📢
- Invita una cerveza 🍺 o un café ☕ a alguien del equipo.
- Da las gracias públicamente 🤓.
- Dona con cripto a esta dirección:
  - (btc) 16ApGFxMXfF8ktysSkmLBzLEJPHubtwKjp
  - (btc-SegWit) bc1q0v8fvv3gvga02h9xspcg7npghjfyny20lavc37
  - (Ethereum) 0x1ee2842c194c95bc54473c6b27d602fc0bfc81a9

---

⌨️ con ❤️ por JLG777 😊

_Copyright (c) [2025] [jlg777]_
