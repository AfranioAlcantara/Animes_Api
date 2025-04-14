const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Armazenamento em memória para simular um banco de dados
let users = []; // Lista de usuários

// Função para criar um novo usuário
function register(username, password) {
  // Verificar se o usuário já existe
  if (users.find(user => user.username === username)) {
    return { error: 'Usuário já existe' };
  }

  // Criptografar a senha
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Adicionar o novo usuário
  users.push({ username, password: hashedPassword });

  return { success: 'Usuário criado com sucesso' };
}

// Função para fazer login e retornar um token
function login(username, password) {
  // Procurar o usuário
  const user = users.find(u => u.username === username);
  if (!user) {
    return { error: 'Usuário não encontrado' };
  }

  // Verificar a senha
  if (!bcrypt.compareSync(password, user.password)) {
    return { error: 'Senha incorreta' };
  }

  // Gerar um token JWT
  const token = jwt.sign({ username: user.username }, 'secreta', { expiresIn: '1h' });
  return { token };
}

// Função para verificar o token JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'secreta');
    return decoded;
  } catch (err) {
    return null;
  }
}

module.exports = { register, login, verifyToken };
