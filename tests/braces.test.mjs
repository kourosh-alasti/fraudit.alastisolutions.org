import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { test } from "node:test";
import vm from "node:vm";

// Resolve the actual transitive dependency used by Next's lint toolchain.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("eslint-config-next"));
const pluginRequire = createRequire(
  nextRequire.resolve("@next/eslint-plugin-next"),
);
const globRequire = createRequire(pluginRequire.resolve("fast-glob"));
const matchRequire = createRequire(globRequire.resolve("micromatch"));
const braces = matchRequire("braces");
const expand = require(`${dirname(matchRequire.resolve("braces"))}/lib/expand`);

// Based on https://github.com/micromatch/braces/pull/72
for (const [open, close] of [
  ["{", "}"],
  ["(", ")"],
]) {
  test(`accepts depth 100 and rejects depth 101 for ${open}${close}`, () => {
    for (const method of ["parse", "compile", "expand", "stringify"]) {
      const atLimit = open.repeat(100) + "a" + close.repeat(100);
      assert.doesNotThrow(() => braces[method](atLimit));
      assert.throws(
        () => braces[method](open.repeat(101) + "a" + close.repeat(101)),
        /exceeds max depth/,
      );
      assert.throws(
        () =>
          braces[method](open.repeat(101) + "a" + close.repeat(101), {
            maxDepth: 10000,
          }),
        /exceeds max depth/,
      );
    }
  });
}

test("enforces stricter and fractional depth limits", () => {
  assert.doesNotThrow(() => braces.parse("{a,b}", { maxDepth: 1.5 }));
  assert.throws(
    () => braces.parse("{{a,b},c}", { maxDepth: 1.5 }),
    /exceeds max depth/,
  );
  assert.throws(
    () => braces.parse("((a))", { maxDepth: 1 }),
    /exceeds max depth/,
  );
});

test("rejects caller-supplied deeply nested ASTs", () => {
  for (const method of ["compile", "expand", "stringify"]) {
    let ast = { type: "text", value: "a" };
    for (let i = 0; i < 101; i++) ast = { type: "brace", nodes: [ast] };
    assert.throws(
      () => braces[method]({ type: "root", nodes: [ast] }),
      /exceeds max depth/,
    );
  }
});

test("preserves expansion and escapeInvalid compatibility", () => {
  assert.deepEqual(braces.expand("foo/({a,b})"), ["foo/(a)", "foo/(b)"]);
  for (const pattern of ["{{a}}", "{a,{b}}", "{{x}y}", "{a,{b,{c}}", "{}{a}"]) {
    assert.equal(
      braces.stringify(braces.parse(pattern), { escapeInvalid: true }),
      pattern,
    );
  }
});

test("rejects cyclic AST parents without hanging", () => {
  const ast = { type: "paren", nodes: [{ type: "text", value: "a" }] };
  ast.parent = ast;
  assert.throws(
    () => vm.runInNewContext("expand(ast)", { expand, ast }, { timeout: 1000 }),
    /parent chain contains a cycle/,
  );
  const parent = { type: "paren", parent: ast };
  ast.parent = parent;
  assert.throws(
    () => vm.runInNewContext("expand(ast)", { expand, ast }, { timeout: 1000 }),
    /parent chain contains a cycle/,
  );
});
