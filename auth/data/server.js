import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// To get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST route to add movie
app.post('/add-movie', (req, res) => {
  const newMovie = req.body;

  const filePath = path.join(__dirname, 'movies.json');
  let movies = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    movies = JSON.parse(data);
  }

  movies.push(newMovie);
  fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
  res.json({ message: "✅ Movie added to JSON!" });
});

// DELETE movie by original_title
app.delete('/delete-movie/:title', (req, res) => {
  const titleToDelete = decodeURIComponent(req.params.title).trim().toLowerCase();
  const filePath = path.join(__dirname, 'movies.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "❌ Movie file not found." });
  }

  let movies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const initialLength = movies.length;

  movies = movies.filter(movie => {
    if (
      typeof movie.original_title === 'string' &&
      movie.original_title.trim().toLowerCase() === titleToDelete
    ) {
      return false; // Remove this movie
    }
    return true; // Keep others
  });

  if (movies.length === initialLength) {
    return res.status(404).json({ message: `❌ Movie "${req.params.title}" not found.` });
  }

  fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
  return res.json({ message: `✅ Movie "${req.params.title}" deleted successfully.` });
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


