const express = require('express');
const app = express();

// Porta dinâmica para Railway ou 3000 localmente
const port = process.env.PORT || 3000;

const characters = require('./data/characters');

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

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

// Inicializar servidor
app.listen(port, () => {
  console.log(`API de personagens de anime rodando na porta ${port}`);
  console.log(`Swagger disponível em /api-docs`);
});
