// ESLint rule local/feature-boundaries (ADR 0002): a file in src/app/features/<x>/ may import another
// feature <y> only through its public API, src/app/features/<y>/public-api.ts. Deep imports such as
// '../teams/team-list' are reported. Written by hand to avoid a plugin dependency (same as the backend rule).
const path = require('node:path');

/** "features/<name>/<rest>" parts of an absolute path, or null when it is not inside app/features/<name>/. */
function featureOf(file) {
  const parts = path.normalize(file).split(path.sep);
  const i = parts.lastIndexOf('features');
  if (i < 1 || parts[i - 1] !== 'app' || parts.length < i + 3) return null;
  return { name: parts[i + 1], rest: parts.slice(i + 2).join('/') };
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Features may import other features only through their public-api.ts' },
    messages: {
      deep: "Feature '{{from}}' must not import '{{target}}' from feature '{{to}}': import from '{{to}}/public-api' instead.",
    },
    schema: [],
  },
  create(context) {
    const from = featureOf(context.filename);
    if (!from) return {};
    function check(node) {
      const spec = node.source && node.source.value;
      if (typeof spec !== 'string' || !spec.startsWith('.')) return;
      const to = featureOf(path.resolve(path.dirname(context.filename), spec, '_'));
      if (!to || to.name === from.name) return;
      if (to.rest === 'public-api/_') return;
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
