// Falla el build si encuentra placeholders sin resolver (texto "[...]", "lorem") o href="#".
// Corre sobre pages/ y components/ — no sobre node_modules, .next, studio/.
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SCAN_DIRS = ['pages', 'components', 'lib']
const EXTENSIONS = ['.tsx', '.ts']

const PATTERNS = [
  { name: 'placeholder entre corchetes (ej. [FECHA], [TU-NUMERO])', re: /\[[A-ZÁÉÍÓÚÑ][^\]]{1,40}\]/ },
  { name: 'href="#" (enlace sin destino)', re: /href=["']#["']/ },
  { name: 'texto "lorem"', re: /lorem/i },
]

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(full, files)
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(full)
    }
  }
  return files
}

let failures = []

for (const dir of SCAN_DIRS) {
  const full = path.join(ROOT, dir)
  if (!fs.existsSync(full)) continue
  for (const file of walk(full)) {
    const content = fs.readFileSync(file, 'utf-8')
    const lines = content.split('\n')
    lines.forEach((line, i) => {
      for (const { name, re } of PATTERNS) {
        if (re.test(line)) {
          failures.push(`${path.relative(ROOT, file)}:${i + 1} — ${name}\n    ${line.trim().slice(0, 120)}`)
        }
      }
    })
  }
}

if (failures.length > 0) {
  console.error('\n🔴 Placeholders sin resolver encontrados:\n')
  console.error(failures.join('\n\n'))
  console.error(`\n${failures.length} problema(s). No se puede publicar así.\n`)
  process.exit(1)
}

console.log('✅ Sin placeholders ni href="#" — 0 coincidencias.')
