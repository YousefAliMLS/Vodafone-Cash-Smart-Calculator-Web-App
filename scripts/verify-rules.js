import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const excludedDirs = ['node_modules', 'dist', '.git'];
const excludedFiles = ['package-lock.json', 'favicon.ico'];
const allowedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.yml', '.yaml'];

// Regex for em dash (U+2014) and en dash (U+2013)
const dashRegex = /[\u2013\u2014]/;

// Regex for emoji characters
const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u;

let violations = 0;

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      if (!excludedDirs.includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (excludedFiles.includes(entry.name)) continue;
      const ext = path.extname(entry.name);
      if (!allowedExtensions.includes(ext)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');

      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (dashRegex.test(line)) {
          console.error(`Violation [EM/EN DASH] in ${relPath}:${index + 1} -> ${line.trim()}`);
          violations++;
        }
        if (emojiRegex.test(line)) {
          console.error(`Violation [EMOJI] in ${relPath}:${index + 1} -> ${line.trim()}`);
          violations++;
        }
      });
    }
  }
}

console.log('Scanning codebase for strict formatting rules (no emojis, no em/en dashes)...');
scanDirectory(rootDir);

if (violations === 0) {
  console.log('SUCCESS: Zero emojis and zero em/en dashes found in all scanned files.');
  process.exit(0);
} else {
  console.error(`FAILURE: Found ${violations} rule violation(s).`);
  process.exit(1);
}
