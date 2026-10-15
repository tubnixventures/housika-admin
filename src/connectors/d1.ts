import { D1Database, D1PreparedStatement } from '../types/env';

export class InMemoryD1 implements D1Database {
  constructor(private name: string, private tables: Map<string, any[]>) {}

  prepare(query: string): D1PreparedStatement {
    let vals: unknown[] = [];
    const db = this;

    const stmt: D1PreparedStatement = {
      bind(...v: unknown[]) { vals = v; return stmt; },
      async first<T = unknown>(col?: string): Promise<T | null> {
        const { results } = await stmt.all<T>();
        if (!results.length) return null;
        return col ? (results[0] as any)[col] : results[0];
      },
      async all<T = unknown>() {
        return { results: db.query<T>(query, vals), success: true };
      },
      async run() {
        return { success: true, meta: { changes: db.mutate(query, vals), last_row_id: Date.now() } };
      },
    };
    return stmt;
  }

  async batch(stmts: D1PreparedStatement[]) {
    return Promise.all(stmts.map((s) => s.run()));
  }

  async exec(query: string) { return this.prepare(query).run(); }

  private query<T>(q: string, vals: unknown[]): T[] {
    const table = (q.match(/(?:FROM|INTO|UPDATE)\s+([a-zA-Z0-9_]+)/i)?.[1] || '').toLowerCase();
    const rows = this.tables.get(table) || [];
    if (!q.toLowerCase().includes('where')) return [...rows] as T[];
    return rows.filter((r) => this.matches(q, r, vals)) as T[];
  }

  private mutate(q: string, vals: unknown[]): number {
    const table = (q.match(/(?:FROM|INTO|UPDATE)\s+([a-zA-Z0-9_]+)/i)?.[1] || '').toLowerCase();
    const rows = this.tables.get(table) || [];
    if (q.trim().toUpperCase().startsWith('INSERT')) {
      const cols = q.match(/\((.*?)\)\s*VALUES/i)?.[1].split(',').map((c) => c.trim()) || [];
      const row: Record<string, any> = {};
      cols.forEach((c, i) => { row[c] = vals[i] ?? null; });
      rows.push(row);
      this.tables.set(table, rows);
      return 1;
    }
    if (q.trim().toUpperCase().startsWith('UPDATE')) {
      const setMatch = q.match(/SET\s+(.*?)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*\?/i);
      if (!setMatch) return 0;
      const setCols = setMatch[1].split(',').map((c) => c.split('=')[0].trim());
      const whereCol = setMatch[2], whereVal = vals[vals.length - 1];
      let count = 0;
      rows.forEach((r) => {
        if (r[whereCol] === whereVal) {
          setCols.forEach((col, i) => { r[col] = vals[i]; });
          count++;
        }
      });
      return count;
    }
    if (q.trim().toUpperCase().startsWith('DELETE')) {
      const initLen = rows.length;
      this.tables.set(table, rows.filter((r) => !this.matches(q, r, vals)));
      return initLen - (this.tables.get(table)?.length || 0);
    }
    return 0;
  }

  private matches(q: string, row: any, vals: unknown[]): boolean {
    const m = q.match(/WHERE\s+([a-zA-Z0-9_]+)\s*(=|LIKE)\s*\?/i);
    if (!m || !vals.length) return true;
    const [_, key, op] = m;
    const val = vals[0];
    if (op.toUpperCase() === 'LIKE') {
      return String(row[key] || '').toLowerCase().includes(String(val).replace(/%/g, '').toLowerCase());
    }
    return row[key] === val;
  }
}
