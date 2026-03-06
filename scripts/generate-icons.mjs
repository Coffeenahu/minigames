import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// CRC32
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[i] = c;
}
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.allocUnsafe(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

// Draw dice icon: purple bg + white face + darker purple dots (6 dots)
function drawDiceIcon(size) {
  const px = new Uint8Array(size * size * 3);

  const BG   = [0xA1, 0xA1, 0xED]; // #A1A1ED
  const FACE  = [0xFF, 0xFF, 0xFF]; // white
  const DOT   = [0x6B, 0x58, 0xC8]; // darker purple

  // Fill background
  for (let i = 0; i < size * size; i++) {
    px[i*3] = BG[0]; px[i*3+1] = BG[1]; px[i*3+2] = BG[2];
  }

  const set = (x, y, c) => {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const i = (y * size + x) * 3;
    px[i] = c[0]; px[i+1] = c[1]; px[i+2] = c[2];
  };

  const fillCircle = (cx, cy, r, c) => {
    for (let y = cy - r - 1; y <= cy + r + 1; y++)
      for (let x = cx - r - 1; x <= cx + r + 1; x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(x, y, c);
  };

  const fillRoundRect = (rx, ry, rw, rh, cr, c) => {
    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) {
        let ok = true;
        if      (x < rx+cr      && y < ry+cr)       ok = (x-rx-cr)**2      + (y-ry-cr)**2      <= cr*cr;
        else if (x >= rx+rw-cr  && y < ry+cr)       ok = (x-rx-rw+cr)**2   + (y-ry-cr)**2      <= cr*cr;
        else if (x < rx+cr      && y >= ry+rh-cr)   ok = (x-rx-cr)**2      + (y-ry-rh+cr)**2   <= cr*cr;
        else if (x >= rx+rw-cr  && y >= ry+rh-cr)   ok = (x-rx-rw+cr)**2   + (y-ry-rh+cr)**2   <= cr*cr;
        if (ok) set(x, y, c);
      }
    }
  };

  // White dice face (with margin and rounded corners)
  const m  = Math.round(size * 0.10);
  const fw = size - m * 2;
  const cr = Math.round(fw * 0.20);
  fillRoundRect(m, m, fw, fw, cr, FACE);

  // 6 dots — standard dice layout
  const dotR = Math.round(size * 0.075);
  const p1   = Math.round(size * 0.30);
  const p2   = Math.round(size * 0.50);
  const p3   = Math.round(size * 0.70);

  for (const [dx, dy] of [
    [p1, p1], [p3, p1],
    [p1, p2], [p3, p2],
    [p1, p3], [p3, p3],
  ]) {
    fillCircle(dx, dy, dotR, DOT);
  }

  return Buffer.from(px);
}

function makePNG(size) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const pixels = drawDiceIcon(size);
  const rowSize = 1 + size * 3;
  const raw = Buffer.allocUnsafe(size * rowSize);
  for (let y = 0; y < size; y++) {
    raw[y * rowSize] = 0; // filter: None
    pixels.copy(raw, y * rowSize + 1, y * size * 3, (y + 1) * size * 3);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const outDir = join(__dirname, '../public');
writeFileSync(join(outDir, 'icon-192.png'), makePNG(192));
writeFileSync(join(outDir, 'icon-512.png'), makePNG(512));
console.log('Generated dice icons: icon-192.png, icon-512.png');
