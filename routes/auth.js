const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = []; // Armazenamento em memória (temporário)

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

// Registro de usuário
router.post('/register', async (req, res) => {
  const { nome, senha } = req.body;

  const existingUser = users.find(user => user.nome === nome);
  if (existingUser) return res.status(400).json({ mensagem: 'Usuário já existe' });

  const hashedSenha = await bcrypt.hash(senha, 10);
  users.push({ nome, senha: hashedSenha });

  res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  const user = users.find(user => user.nome === nome);
  if (!user) return res.status(400).json({ mensagem: 'Usuário não encontrado' });

  const isSenhaValida = await bcrypt.compare(senha, user.senha);
  if (!isSenhaValida) return res.status(401).json({ mensagem: 'Senha incorreta' });

  const token = jwt.sign({ nome: user.nome }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
