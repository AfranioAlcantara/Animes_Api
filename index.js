const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Dados e rotas
const characters = require('./data/characters');
const authRoutes = require('./routes/auth');
const autenticarToken = require('./middleware/authMiddleware');

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware para ler JSON do corpo das requisições
app.use(express.json());

// Rota de documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas públicas (registro e login)
app.use('/auth', authRoutes);

// Rotas protegidas por autenticação
app.get('/api/characters', autenticarToken, (req, res) => {
  res.json(characters);
});

app.get('/api/characters/:id', autenticarToken, (req, res) => {
  const characterId = parseInt(req.params.id);
  const character = characters.find(c => c.id === characterId);

  if (!character) {
    return res.status(404).json({ mensagem: "Personagem não encontrado" });
  }

  res.json(character);
});

// Inicializa servidor
app.listen(port, () => {
  console.log(`🚀 API de personagens de anime rodando na porta ${port}`);
  console.log(`📚 Documentação Swagger disponível em http://localhost:${port}/api-docs`);
});
