# Repository Guidelines

## Project Structure & Module Organization

This repository builds a zero-build, offline-friendly interactive study site for *Introduction to Algorithms*. `site/` is the application: `assets/core/` contains runtime modules, `assets/ui/` renders chapter shells and nine learning stages, `assets/viz/` holds visualizations, and `assets/algorithms/` contains animation generators and their assertions. Learning content lives in `site/chapters/chXX-*/`; register new chapters in `site/assets/chapters.js`.

`c/` is the canonical source for C examples. `data/` contains extracted book data, repaired pages, blocks, and figures. Use `tools/` for the extraction pipeline, level generation, validation, and browser smoke checks. Read `docs/开发规范.md` and `docs/关卡编写手册.md` before adding or changing a level.

## Build, Test, and Development Commands

The site has no build step and must be served over HTTP:

```powershell
cd site; python -m http.server 8317 --bind 127.0.0.1
npm run check                 # Validate JavaScript syntax
npm test                      # Run algorithm assertions
python tools/04_verify_level.py # Validate level content; requires 0 ERROR
```

Run `python tools/smoke_browser.py 8317` from the repository root after starting the local server to render-test routes. For content changes, also run `node tools/dump_levels.mjs` before the level verifier.

## Coding Style & Naming Conventions

Use native ES modules and preserve the existing formatting: two-space JavaScript/CSS indentation, semicolons, and descriptive `camelCase` identifiers. Keep chapter directories and files aligned with the established pattern, for example `ch04-divide-and-conquer/s05-the-master-method.js`. Use kebab-case for CSS classes and filenames. Comments should explain non-obvious decisions and be written in Chinese. Do not introduce dependencies, bundlers, or external network resources.

## Testing Guidelines

Keep algorithm generators deterministic and extend `site/assets/algorithms/__tests__.mjs` when their behavior changes. New learning levels must have all `【TODO …】` placeholders resolved and pass `04_verify_level.py`. Changes to pipeline scripts require their matching test, such as `python tools/test_repair.py`; rerun downstream steps whenever an upstream pipeline output changes.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit-style messages, such as `feat(ch04): build level 4.5` and `fix(tools): wire quote checker`. Use a scoped, imperative summary. Keep commits focused. Pull requests should explain the learner-facing change, list the commands run, link related issues, and include screenshots for visual or responsive UI changes. Do not mix edits to unrelated chapters or generated data.

## Content and Data Safety

Treat `data/pages_fixed.jsonl` and files in `c/` as sources of truth. Do not manually alter duplicate C snippets or quoted source text inside a level; use the repository's validation tooling to keep them synchronized.
