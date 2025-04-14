const express = require('express');
const app = express();

// Usa a porta do ambiente ou 3000 como fallback
const port = process.env.PORT || 3000;

const characters = require('./data/characters');

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.get('/api/characters', (req, res) => {
  res.json(characters);
});

app.get('/api/characters/:id', (req, res) => {
  const characterId = parseInt(req.params.id);
  const character = characters.find(c => c.id === characterId);

  if (!character) {
    return res.status(404).json({ mensagem: "Personagem não encontrado" });
  }

  res.json(character);
});

// Inicializa servidor na porta correta para Railway
app.listen(port, () => {
  console.log(`API de personagens de anime rodando na porta ${port}`);
  console.log(`Swagger disponível em /api-docs`);
});
