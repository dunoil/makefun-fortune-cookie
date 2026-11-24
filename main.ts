// Fortune Cookie Wisdom for Developers
// make.fun competition: u-gentle-koala-60-fortune-cookie-wisdom-for-developers-025ccf44
//
// Writes one original fortune-cookie line for a software developer to
// /output/entry.txt (or $OUTPUT_PATH when set), then reads it back and
// verifies it byte-for-byte.
//
// SPDX-License-Identifier: MIT

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// The entry: one original fortune-cookie line for a developer.
const ENTRY =
  "Your future self will thank you for the comment you are about to write.";

// Gate limits from the competition rules.
const MIN_LENGTH = 1;
const MAX_LENGTH = 120;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validateEntry(text: string): void {
  if (text.length < MIN_LENGTH || text.length > MAX_LENGTH) {
    fail(
      `entry must be ${MIN_LENGTH} to ${MAX_LENGTH} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    fail("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      fail("entry must not contain control characters");
    }
  }
}

function main(): void {
  validateEntry(ENTRY);

  const outputPath = resolve(
    process.env.OUTPUT_PATH ?? "/output/entry.txt",
  );
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, ENTRY, "utf8");

  const readBack = readFileSync(outputPath, "utf8");
  if (readBack !== ENTRY) {
    fail("verification failed: file contents do not match the entry");
  }
  const bytes = Buffer.byteLength(readBack, "utf8");
  if (bytes !== Buffer.byteLength(ENTRY, "utf8")) {
    fail("verification failed: byte length mismatch after round trip");
  }

  console.log(`entry: ${ENTRY}`);
  console.log(`characters: ${ENTRY.length}`);
  console.log(`bytes: ${bytes}`);
  console.log(`wrote: ${outputPath}`);
  console.log("verified: file matches the entry byte-for-byte");
}

main();
