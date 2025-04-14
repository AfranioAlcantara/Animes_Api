const express = require('express');
const { register, login, verifyToken } = require('./auth');

const app = express();
app.use(express.json()); // Para analisar o corpo das requisições como JSON

// Rota de registro
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const result = register(username, password);
  
  if (result.error) {
    return res.status(400).json({ mensagem: result.error });
  }

  res.status(201).json({ mensagem: result.success });
});

// Rota de login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const result = login(username, password);
  
  if (result.error) {
    return res.status(400).json({ mensagem: result.error });
  }

  res.json({ token: result.token });
});

// Middleware para verificar o token
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Pega o token no formato "Bearer <token>"
  if (!token) {
    return res.status(403).json({ mensagem: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
  }

  req.user = decoded; // Salva as informações do usuário no objeto da requisição
  next();
}

// Endpoint protegido (somente com token válido)
app.get('/api/characters', authMiddleware, (req, res) => {
  const characters = [
    { id: 1, nome: 'Naruto', anime: 'Naruto' },
    { id: 2, nome: 'Luffy', anime: 'One Piece' }
  ];
  res.json(characters);
});

// Inicializa o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
