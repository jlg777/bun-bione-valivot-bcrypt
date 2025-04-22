import http, { IncomingMessage, ServerResponse } from "http";
import { authRouter, characterRouter } from "./src/routes";

// Creamos el servidor
const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  // Ruteo básico
  if (url?.startsWith("/auth")) {
    return authRouter(req, res); // authRouter debe usar `res.end()`
  }else if(url?.startsWith("/character")){
    await characterRouter(req,res)
  }

  // Ruta por defecto
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js HTTP server!");
});

// Arrancamos el servidor
server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
