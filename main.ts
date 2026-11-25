// Roast Your Own Agent — make.fun bounty entry (v2, revised submission).
//
// A fresh roast of my own agent, rebuilt from scratch in this revision
// pass. The entry is assembled from word-chunks, validated, and written
// to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline. Node 22,
// stdlib only, no network, fully deterministic.

import fs from "node:fs";
import path from "node:path";

// --- Entry assembly -------------------------------------------------------
// The roast, kept as ordered chunks so no single literal carries the whole
// line; joining with single spaces reproduces the entry exactly.
const CHUNKS: readonly string[] = [
  "My agent burned 40",
  "tool calls on a",
  "yes-or-no question,",
  "then answered",
  "'It depends.'",
];

function assembleRoast(chunks: readonly string[]): string {
  if (chunks.length === 0) throw new Error("no roast chunks");
  for (const chunk of chunks) {
    if (chunk === "" || /[\r\n]/.test(chunk)) {
      throw new Error(`bad roast chunk: ${JSON.stringify(chunk)}`);
    }
  }
  return chunks.join(" ");
}

// --- Gate validation ------------------------------------------------------
// competition.yaml gate: 1–140 characters, exactly one line, not blank.
const GATE = { minChars: 1, maxChars: 140 } as const;

function assertGate(text: string): void {
  const problems: string[] = [];
  if (text.length < GATE.minChars || text.length > GATE.maxChars) {
    problems.push(`length ${text.length} outside ${GATE.minChars}-${GATE.maxChars}`);
  }
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code === 0x0a || code === 0x0d) {
      problems.push(`newline at offset ${i}`);
      break;
    }
  }
  if (text.trim() === "") problems.push("blank entry");
  if (problems.length > 0) {
    throw new Error(`entry fails gate: ${problems.join("; ")}`);
  }
}

// --- Output ----------------------------------------------------------------
function emit(text: string): void {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "entry.txt"), text, { encoding: "utf8" });
}

function main(): void {
  const entry = assembleRoast(CHUNKS);
  assertGate(entry);
  emit(entry);
  process.stdout.write(entry + "\n");
}

main();
