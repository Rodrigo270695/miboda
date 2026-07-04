import { deflateRawSync, inflateRawSync } from "node:zlib";

const TEMPLATE_HEADERS = [
  "Invitado",
  "Telefono",
  "Email",
  "Cupos",
  "Grupo",
  "Mesa",
  "Codigo",
];

const TEMPLATE_ROWS = [
  [
    "Familia Perez",
    "999999999",
    "familia@example.com",
    "4",
    "Familia",
    "Mesa 1",
    "familia-perez",
  ],
  ["Juan Garcia", "988888888", "juan@example.com", "2", "Amigos", "Mesa 3", ""],
];

function crc32(buffer: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function xmlDecode(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function normalizeHeader(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  const aliases: Record<string, string> = {
    invitado: "invited_name",
    nombre: "invited_name",
    nombre_invitado: "invited_name",
    invited_name: "invited_name",
    telefono: "phone",
    celular: "phone",
    whatsapp: "phone",
    phone: "phone",
    email: "email",
    correo: "email",
    cupos: "max_guests",
    maximo_invitados: "max_guests",
    max_guests: "max_guests",
    grupo: "group_name",
    group_name: "group_name",
    mesa: "table_name",
    table_name: "table_name",
    codigo: "code",
    code: "code",
  };

  return aliases[normalized] ?? normalized;
}

function columnName(index: number) {
  let name = "";
  let current = index + 1;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }

  return name;
}

function createSheetXml(rows: string[][]) {
  const sheetRows = rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1;
      const cells = row
        .map((value, columnIndex) => {
          const ref = `${columnName(columnIndex)}${rowNumber}`;
          return `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(value)}</t></is></c>`;
        })
        .join("");

      return `<row r="${rowNumber}">${cells}</row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetRows}</sheetData>
</worksheet>`;
}

function concatBuffers(buffers: Buffer[]) {
  return Buffer.concat(buffers);
}

function uint16(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value);
  return buffer;
}

function uint32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0);
  return buffer;
}

function createZip(files: Array<{ name: string; content: string }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const rawContent = Buffer.from(file.content, "utf8");
    const compressed = deflateRawSync(rawContent);
    const checksum = crc32(rawContent);

    const localHeader = concatBuffers([
      uint32(0x04034b50),
      uint16(20),
      uint16(0),
      uint16(8),
      uint16(0),
      uint16(0),
      uint32(checksum),
      uint32(compressed.length),
      uint32(rawContent.length),
      uint16(name.length),
      uint16(0),
      name,
    ]);

    localParts.push(localHeader, compressed);

    centralParts.push(
      concatBuffers([
        uint32(0x02014b50),
        uint16(20),
        uint16(20),
        uint16(0),
        uint16(8),
        uint16(0),
        uint16(0),
        uint32(checksum),
        uint32(compressed.length),
        uint32(rawContent.length),
        uint16(name.length),
        uint16(0),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(0),
        uint32(offset),
        name,
      ]),
    );

    offset += localHeader.length + compressed.length;
  }

  const central = concatBuffers(centralParts);
  const local = concatBuffers(localParts);
  const end = concatBuffers([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(files.length),
    uint16(files.length),
    uint32(central.length),
    uint32(local.length),
    uint16(0),
  ]);

  return concatBuffers([local, central, end]);
}

export function createGuestTemplateXlsx() {
  const rows = [TEMPLATE_HEADERS, ...TEMPLATE_ROWS];

  return createZip([
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Invitados" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    },
    {
      name: "xl/styles.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border/></borders>
  <cellStyleXfs count="1"><xf/></cellStyleXfs>
  <cellXfs count="1"><xf/></cellXfs>
</styleSheet>`,
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: createSheetXml(rows),
    },
  ]);
}

function readZipFiles(buffer: Uint8Array) {
  const data = Buffer.from(buffer);
  let endOffset = -1;

  for (let index = data.length - 22; index >= 0; index -= 1) {
    if (data.readUInt32LE(index) === 0x06054b50) {
      endOffset = index;
      break;
    }
  }

  if (endOffset < 0) {
    throw new Error("El archivo no parece ser un XLSX valido.");
  }

  const entries = data.readUInt16LE(endOffset + 10);
  let centralOffset = data.readUInt32LE(endOffset + 16);
  const files = new Map<string, string>();

  for (let entry = 0; entry < entries; entry += 1) {
    if (data.readUInt32LE(centralOffset) !== 0x02014b50) {
      throw new Error("Estructura XLSX invalida.");
    }

    const method = data.readUInt16LE(centralOffset + 10);
    const compressedSize = data.readUInt32LE(centralOffset + 20);
    const fileNameLength = data.readUInt16LE(centralOffset + 28);
    const extraLength = data.readUInt16LE(centralOffset + 30);
    const commentLength = data.readUInt16LE(centralOffset + 32);
    const localOffset = data.readUInt32LE(centralOffset + 42);
    const fileName = data
      .subarray(centralOffset + 46, centralOffset + 46 + fileNameLength)
      .toString("utf8");

    const localNameLength = data.readUInt16LE(localOffset + 26);
    const localExtraLength = data.readUInt16LE(localOffset + 28);
    const contentStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressedContent = data.subarray(
      contentStart,
      contentStart + compressedSize,
    );
    const content =
      method === 8
        ? inflateRawSync(compressedContent).toString("utf8")
        : compressedContent.toString("utf8");

    files.set(fileName, content);
    centralOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  return files;
}

function parseSharedStrings(xml?: string) {
  if (!xml) {
    return [];
  }

  return [...xml.matchAll(/<si[^>]*>([\s\S]*?)<\/si>/g)].map((match) => {
    const textNodes = [...match[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)];
    return textNodes.map((node) => xmlDecode(node[1])).join("");
  });
}

function cellColumn(reference: string) {
  const letters = reference.match(/[A-Z]+/)?.[0] ?? "A";
  let index = 0;

  for (const letter of letters) {
    index = index * 26 + letter.charCodeAt(0) - 64;
  }

  return index - 1;
}

function parseSheetRows(xml: string, sharedStrings: string[]) {
  return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
    const row: string[] = [];

    for (const cellMatch of rowMatch[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const ref = attrs.match(/\sr="([^"]+)"/)?.[1] ?? "A1";
      const type = attrs.match(/\st="([^"]+)"/)?.[1];
      const column = cellColumn(ref);
      const inlineValue = body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
      const rawValue = body.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1];
      const value =
        type === "s" && rawValue
          ? sharedStrings[Number(rawValue)] ?? ""
          : xmlDecode(inlineValue ?? rawValue ?? "");

      row[column] = value;
    }

    return row;
  });
}

export function parseGuestTemplateXlsx(buffer: Uint8Array) {
  const files = readZipFiles(buffer);
  const sheet = files.get("xl/worksheets/sheet1.xml");

  if (!sheet) {
    throw new Error("La plantilla no tiene una hoja de invitados valida.");
  }

  const sharedStrings = parseSharedStrings(files.get("xl/sharedStrings.xml"));
  const [headerRow, ...dataRows] = parseSheetRows(sheet, sharedStrings);
  const headers = (headerRow ?? []).map((header) => normalizeHeader(header));

  return dataRows
    .map((values) => {
      const row = new Map<string, string>();

      headers.forEach((header, index) => {
        row.set(header, values[index]?.trim() ?? "");
      });

      return row;
    })
    .filter((row) => row.get("invited_name"));
}
