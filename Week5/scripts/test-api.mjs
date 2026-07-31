import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, "test-chat.json");
const body = readFileSync(jsonPath, "utf-8").trim();

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));

    const text = await res.text();
    // Print first 2000 chars
    console.log("Body (first 2000 chars):");
    console.log(text.substring(0, 2000));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();