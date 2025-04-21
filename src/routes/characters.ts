import type { IncomingMessage, ServerResponse } from "http";
import { authenticateToken, type AuthenticatedRequest } from "../middlewares/authentications";
import {
    addCharacters,
    CharactersSchema,
    getAllCharacters,
    getCharactersByID,
    HttpMethod,
    Role,
    updateCharacters,
    type Character
} from "../models";
import { authorizeRoles } from "../middlewares/authorizations";
import { parserBody } from "../utils/parserBody";
import { safeParse } from "valibot";

/**
 * Router para manejar todas las rutas relacionadas con "characters".
 * 
 * Soporta:
 * - GET /characters
 * - GET /characters/:id
 * - POST /characters
 * - PATCH /characters/:id
 * 
 * Cada ruta requiere autenticación con token, y algunas requieren autorización por rol.
 * 
 * @param {IncomingMessage} req - Objeto de solicitud HTTP.
 * @param {ServerResponse} res - Objeto de respuesta HTTP.
 * 
 * @returns {Promise<void>}
 */
export const characterRouter = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const { method, url } = req;

    try {
        // 🔐 Autenticación del usuario
        const isAuthenticated = await authenticateToken(req as AuthenticatedRequest, res);
        if (!isAuthenticated) {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: "Unauthorized" }));
            return;
        }

        // 📄 GET /characters - Obtener todos los personajes
        if (url === "/characters" && method === HttpMethod.GET) {
            const characters = getAllCharacters();
            res.statusCode = 200;
            res.end(JSON.stringify(characters));
            return;
        }

        // 🔍 GET /characters/:id - Obtener un personaje por ID
        const characterByIdMatch = url?.match(/^\/characters\/(\d+)$/);
        if (characterByIdMatch && method === HttpMethod.GET) {
            const id = parseInt(characterByIdMatch[1], 10);
            const character = getCharactersByID(id);

            if (!character) {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Character not found" }));
                return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify(character));
            return;
        }

        // ➕ POST /characters - Crear un nuevo personaje
        if (url == '/characters' && method == HttpMethod.POST) {
            const isAuthorized = await authorizeRoles(Role.ADMIN, Role.USER)(
                req as AuthenticatedRequest,
                res
            );
            if (!isAuthorized) return;

            const body = await parserBody(req);
            const result = safeParse(CharactersSchema, body);

            if (result.issues) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: result.issues }));
                return;
            }

            const characters: Character = body;
            addCharacters(characters);
            res.statusCode = 201;
            res.end(JSON.stringify(characters));
            return;
        }

        // ✏️ PATCH /characters/:id - Actualizar un personaje existente
        if (url?.match(/^\/characters\/(\d+)$/) && method === HttpMethod.PATCH) {
            const isAuthorized = await authorizeRoles(Role.ADMIN, Role.USER)(
                req as AuthenticatedRequest,
                res
            );
            if (!isAuthorized) return;

            // Extrae el ID del personaje desde la URL
            const characterId = parseInt(url.split("/").pop() as string, 10);
            if (isNaN(characterId)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Invalid character ID' }));
                return;
            }

            let body;

            // Intenta parsear el JSON del cuerpo
            try {
                body = await parserBody(req);
            } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Invalid JSON body' }));
                return;
            }

            // Valida el cuerpo contra el esquema definido
            const result = safeParse(CharactersSchema, body);
            if (result.issues) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: result.issues }));
                return;
            }

            // Busca si el personaje existe
            const existingCharacter = getCharactersByID(characterId);
            if (!existingCharacter) {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Character not found' }));
                return;
            }

            // Actualiza el personaje
            const updatedCharacter = updateCharacters(characterId, result.output);

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(updatedCharacter));
            return;
        }

        // 🚫 Ruta no encontrada
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));

    } catch (error) {
        console.error("Error en characterRouter:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
};
