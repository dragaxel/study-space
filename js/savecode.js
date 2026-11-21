// Save codes: progress packed into a copy-pasteable string.
// Format: "SS1-" + base64url(deflate(JSON)) + "-" + 8-char checksum.
// The checksum catches typos and partial pastes; it is not anti-cheat.

const SAVE_PREFIX = "SS1-";

function checksum(str) {            // FNV-1a, 32-bit, as 8 hex chars
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, "0");
}

async function pipe(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}

const toB64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64 = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function makeSaveCode() {
  const packed = await pipe(new TextEncoder().encode(serializeState(state)), new CompressionStream("deflate-raw"));
  const body = toB64(packed);
  return SAVE_PREFIX + body + "-" + checksum(body);
}

async function readSaveCode(code) {
  code = code.replace(/\s+/g, "");
  if (!code.startsWith(SAVE_PREFIX)) throw new Error("That doesn't look like a Study Space code.");
  const rest = code.slice(SAVE_PREFIX.length);
  const cut = rest.lastIndexOf("-");
  const body = rest.slice(0, cut), sum = rest.slice(cut + 1);
  if (cut < 0 || checksum(body) !== sum) throw new Error("Code is incomplete or has a typo. Copy the whole thing.");
  const json = new TextDecoder().decode(await pipe(fromB64(body), new DecompressionStream("deflate-raw")));
  const data = JSON.parse(json);
  if (typeof data !== "object" || typeof data.coins !== "number") throw new Error("Code didn't contain a save.");
  return data;
}

document.getElementById("btn-make-code").onclick = async () => {
  const out = document.getElementById("save-code-out");
  out.value = await makeSaveCode();
  out.select();
  document.getElementById("btn-copy-code").disabled = false;
};

document.getElementById("btn-copy-code").onclick = async (e) => {
  const out = document.getElementById("save-code-out");
  try { await navigator.clipboard.writeText(out.value); }
  catch { out.select(); document.execCommand("copy"); }
  e.target.textContent = "Copied";
  setTimeout(() => (e.target.textContent = "Copy"), 1500);
};

document.getElementById("btn-load-code").onclick = async () => {
  const msg = document.getElementById("save-code-msg");
  try {
    const data = await readSaveCode(document.getElementById("save-code-in").value);
    if (!confirm("Replace the progress on this browser with this code?")) return;
    state = { ...defaultState(), ...data };
    saveState();
    applyTheme();
    renderAll();
    msg.textContent = `Loaded: ${state.coins.toLocaleString()} coins, ${state.gems} gems, ${state.assignments.length} assignment${state.assignments.length === 1 ? "" : "s"}.`;
  } catch (err) {
    msg.textContent = err.message.startsWith("Code") || err.message.startsWith("That") ? err.message : "Couldn't read that code.";
  }
};
