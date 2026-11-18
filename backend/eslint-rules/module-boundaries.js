// ESLint rule local/module-boundaries (ADR 0002): a file in src/modules/<x>/ may import another
// module <y> only through its public API, src/modules/<y>/index.ts. Deep imports such as
// '../teams/services/team.service' are reported. Written by hand to avoid a plugin dependency.
const path = require('node:path');

/** "modules/<name>/<rest>" parts of an absolute path, or null when it is not inside src/modules/<name>/. */
function moduleOf(file) {
  const parts = path.normalize(file).split(path.sep);
  const i = parts.lastIndexOf('modules');
  if (i < 1 || parts[i - 1] !== 'src' || parts.length < i + 3) return null;
  return { name: parts[i + 1], rest: parts.slice(i + 2).join('/') };
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Modules may import other modules only through their index.ts' },
    messages: {
      deep: "Module '{{from}}' must not import '{{target}}' from module '{{to}}': import from '{{to}}' (its index.ts) instead.",
    },
    schema: [],
  },
  create(context) {
    const from = moduleOf(context.filename);
    if (!from) return {};
    function check(node) {
      const spec = node.source && node.source.value;
      if (typeof spec !== 'string' || !spec.startsWith('.')) return;
      const target = path.resolve(path.dirname(context.filename), spec);
      // The import may name a folder (resolved to its index) or a file without extension.
      const to = moduleOf(path.join(target, 'index.ts'));
      if (!to || to.name === from.name) return;
      if (to.rest === 'index.ts' || to.rest === 'index/index.ts') return;
      context.report({ node, messageId: 'deep', data: { from: from.name, to: to.name, target: spec } });
    }
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
};
