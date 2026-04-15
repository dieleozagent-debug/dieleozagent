// github.js — Integración con GitHub: leer repo, commits, issues, archivos
'use strict';

const { Octokit } = require('@octokit/rest');

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER || 'dieleozagent-debug';
const REPO  = process.env.GITHUB_REPO  || 'LFC2';

function cliente() {
  return new Octokit({ auth: TOKEN });
}

// ── Info general del repo ─────────────────────────────────────────────────────
async function infoRepo(owner = OWNER, repo = REPO) {
  const { data } = await cliente().repos.get({ owner, repo });
  return {
    nombre:      data.full_name,
    descripcion: data.description || '(sin descripción)',
    rama:        data.default_branch,
    estrellas:   data.stargazers_count,
    actualizado: new Date(data.updated_at).toLocaleDateString('es-CO'),
    url:         data.html_url,
  };
}

// ── Últimos N commits ─────────────────────────────────────────────────────────
async function ultimosCommits(n = 5, owner = OWNER, repo = REPO) {
  const { data } = await cliente().repos.listCommits({ owner, repo, per_page: n });
  return data.map(c => ({
    sha:     c.sha.substring(0, 7),
    mensaje: c.commit.message.split('\n')[0],
    autor:   c.commit.author.name,
    fecha:   new Date(c.commit.author.date).toLocaleDateString('es-CO'),
  }));
}

// ── Issues abiertos ───────────────────────────────────────────────────────────
async function issuesAbiertos(n = 5, owner = OWNER, repo = REPO) {
  const { data } = await cliente().issues.listForRepo({
    owner, repo, state: 'open', per_page: n
  });
  return data.map(i => ({
    num:    i.number,
    titulo: i.title,
    autor:  i.user.login,
    fecha:  new Date(i.created_at).toLocaleDateString('es-CO'),
    url:    i.html_url,
  }));
}

// ── Leer archivo del repo ─────────────────────────────────────────────────────
async function leerArchivo(rutaArchivo, owner = OWNER, repo = REPO) {
  const { data } = await cliente().repos.getContent({ owner, repo, path: rutaArchivo });
  if (data.type !== 'file') throw new Error(`${rutaArchivo} no es un archivo`);
  return Buffer.from(data.content, 'base64').toString('utf8');
}

// ── Listar archivos de una carpeta ────────────────────────────────────────────
async function listarCarpeta(ruta = '', owner = OWNER, repo = REPO) {
  const { data } = await cliente().repos.getContent({ owner, repo, path: ruta });
  if (!Array.isArray(data)) throw new Error('La ruta no es un directorio');
  return data.map(f => `${f.type === 'dir' ? '📁' : '📄'} ${f.name}`);
}

// ── Formateadores para Telegram ───────────────────────────────────────────────
function formatearInfo(info) {
  return (
    `📦 *${info.nombre}*\n` +
    `📝 ${info.descripcion}\n` +
    `🌿 Rama: \`${info.rama}\`\n` +
    `⭐ Estrellas: ${info.estrellas}\n` +
    `📅 Actualizado: ${info.actualizado}\n` +
    `🔗 ${info.url}`
  );
}

function formatearCommits(commits) {
  if (!commits.length) return '📭 Sin commits';
  return commits.map(c =>
    `\`${c.sha}\` *${c.mensaje}*\n👤 ${c.autor} · 📅 ${c.fecha}`
  ).join('\n\n');
}

function formatearIssues(issues) {
  if (!issues.length) return '[SICC OK] Sin issues abiertos';
  return issues.map(i =>
    `#${i.num} *${i.titulo}*\n👤 ${i.autor} · 📅 ${i.fecha}`
  ).join('\n\n');
}

module.exports = {
  infoRepo, ultimosCommits, issuesAbiertos, leerArchivo, listarCarpeta,
  formatearInfo, formatearCommits, formatearIssues,
  OWNER, REPO,
};
