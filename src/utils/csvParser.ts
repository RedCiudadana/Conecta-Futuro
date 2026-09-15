export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

export function parseCSV(text: string): ParsedCSV {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',' || ch === ';' || ch === '\t') {
          result.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase());
  const rows = lines.slice(1).map(parseLine).filter(r => r.some(c => c));

  return { headers, rows };
}

export interface ColumnMapping {
  first_name: number;
  last_name: number;
  email: number;
  phone: number;
  dpi: number;
  department: number;
  municipality: number;
  gender: number;
  organization: number;
  digital_skill_level: number;
  how_found_us: number;
}

const COLUMN_ALIASES: Record<keyof ColumnMapping, string[]> = {
  first_name: ['nombre', 'first_name', 'primer nombre', 'nombres', 'name', 'first name'],
  last_name: ['apellido', 'last_name', 'apellidos', 'last name', 'surname'],
  email: ['email', 'correo', 'correo electrónico', 'correo electronico', 'e-mail', 'mail'],
  phone: ['teléfono', 'telefono', 'phone', 'celular', 'móvil', 'movil', 'tel', 'número', 'numero'],
  dpi: ['dpi', 'cui', 'documento', 'identidad', 'identificación', 'identificacion', 'no. dpi'],
  department: ['departamento', 'department', 'depto', 'depto.'],
  municipality: ['municipio', 'municipality', 'ciudad', 'city'],
  gender: ['género', 'genero', 'gender', 'sexo'],
  organization: ['organización', 'organizacion', 'organization', 'empresa', 'institución', 'institucion', 'company'],
  digital_skill_level: ['nivel digital', 'nivel', 'skill level', 'nivel de habilidad', 'competencia digital'],
  how_found_us: ['cómo nos encontró', 'como nos encontro', 'referencia', 'fuente', 'how found', 'canal'],
};

export function autoMapColumns(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES) as [keyof ColumnMapping, string[]][]) {
    const idx = headers.findIndex(h =>
      aliases.some(alias => h === alias || h.includes(alias))
    );
    if (idx !== -1) {
      mapping[field] = idx;
    }
  }

  if (mapping.first_name === undefined && mapping.last_name === undefined) {
    const nameIdx = headers.findIndex(h =>
      h === 'nombre completo' || h === 'full name' || h === 'nombre y apellido'
    );
    if (nameIdx !== -1) {
      mapping.first_name = nameIdx;
    }
  }

  return mapping;
}

export function normalizeGender(raw: string): string | null {
  const v = raw.toLowerCase().trim();
  if (['m', 'masculino', 'male', 'hombre'].includes(v)) return 'masculino';
  if (['f', 'femenino', 'female', 'mujer'].includes(v)) return 'femenino';
  if (['otro', 'other', 'nb', 'no binario'].includes(v)) return 'otro';
  if (v.includes('prefiero') || v.includes('prefer')) return 'prefiero_no_decir';
  return null;
}

export function normalizeSkillLevel(raw: string): string | null {
  const v = raw.toLowerCase().trim();
  if (['basico', 'básico', 'basic', 'beginner', 'principiante', '1'].includes(v)) return 'basico';
  if (['intermedio', 'intermediate', 'medio', '2'].includes(v)) return 'intermedio';
  if (['avanzado', 'advanced', 'alto', '3'].includes(v)) return 'avanzado';
  return null;
}
