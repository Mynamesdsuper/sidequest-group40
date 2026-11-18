import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

// Builds the single OpenAPI 3.1 document served at /api/docs from shared/openapi/common.yaml plus
// one fragment per module (modules/<name>/<name>.openapi.yaml). Fails loudly on duplicate keys,
// so two modules can never silently overwrite each other's paths or schemas.

export type OpenApiDoc = Record<string, unknown> & {
  info?: Record<string, unknown>;
  paths?: Record<string, unknown>;
  components?: Record<string, Record<string, unknown>>;
  tags?: Array<{ name: string } & Record<string, unknown>>;
};

export interface Fragment {
  source: string;
  doc: OpenApiDoc;
}

function mergeKeys(
  target: Record<string, unknown>,
  add: Record<string, unknown> | undefined,
  where: string,
  source: string,
  owners: Map<string, string>,
): void {
  for (const [key, value] of Object.entries(add ?? {})) {
    const id = `${where}.${key}`;
    if (key in target)
      throw new Error(`OpenAPI merge: duplicate ${id} in ${source} (already defined in ${owners.get(id)})`);
    target[key] = value;
    owners.set(id, source);
  }
}

export function mergeOpenApi(base: Fragment, fragments: Fragment[]): OpenApiDoc {
  const owners = new Map<string, string>();
  const out: OpenApiDoc = { ...base.doc, info: {}, paths: {}, components: {}, tags: [] };
  const tagNames = new Map<string, string>();
  for (const { source, doc } of [base, ...fragments]) {
    mergeKeys(out.info!, doc.info, 'info', source, owners);
    mergeKeys(out.paths!, doc.paths, 'paths', source, owners);
    for (const [section, entries] of Object.entries(doc.components ?? {})) {
      out.components![section] ??= {};
      mergeKeys(out.components![section], entries, `components.${section}`, source, owners);
    }
    for (const tag of doc.tags ?? []) {
      if (tagNames.has(tag.name)) {
        throw new Error(
          `OpenAPI merge: duplicate tag "${tag.name}" in ${source} (already defined in ${tagNames.get(tag.name)})`,
        );
      }
      tagNames.set(tag.name, source);
      out.tags!.push(tag);
    }
  }
  return out;
}

const readYaml = (file: string): Fragment => ({
  source: path.basename(file),
  doc: YAML.parse(fs.readFileSync(file, 'utf8')) as OpenApiDoc,
});

/** Reads common.yaml and every modules/<name>/<name>.openapi.yaml (in directory order) and merges them. */
export function loadOpenApi(srcDir = path.resolve(__dirname, '../..')): OpenApiDoc {
  const modulesDir = path.join(srcDir, 'modules');
  const fragments = fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(modulesDir, d.name, `${d.name}.openapi.yaml`))
    .filter((f) => fs.existsSync(f))
    .map(readYaml);
  return mergeOpenApi(readYaml(path.join(srcDir, 'shared/openapi/common.yaml')), fragments);
}
