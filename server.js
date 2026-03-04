import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 8080;

const server = createServer(async (req, res) => {
  let filePath = join(__dirname, 'src', req.url === '/' ? 'index.html' : req.url);

  try {
    const data = await readFile(filePath);
    res.writeHead(200);
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});