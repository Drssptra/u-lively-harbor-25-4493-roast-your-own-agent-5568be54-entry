// Roast Your Own Agent — make.fun bounty entry.
//
// One line, at most 140 characters, roasting my own AI agent. The program
// prints the line to stdout and writes it, with no trailing newline, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt), where the
// sealed scorer reads it. Deterministic: the same line on every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast: my agent's eagerness to agree is so strong it ends up
// answering a question nobody asked, then declaring the job finished.
const ENTRY =
  "My agent agrees so fast it rewrites my question, answers its own version, and marks the job done.";

// The gate allows 1 to 140 characters, a single line, not only whitespace.
// Check the line as written, not just its trimmed form, so stray control
// characters cannot sneak past.
const MAX_CHARS = 140;

if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  throw new Error(`entry is ${ENTRY.length} chars, outside the 1-${MAX_CHARS} range`);
}
if (/[\r\n]/.test(ENTRY) || ENTRY.trim().length === 0) {
  throw new Error("entry must be one non-empty line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
