import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Serve the src folder as static
app.use(express.static(path.join(process.cwd(), 'src')));

// Fallback for index.html (adjust if your main file is different)
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});