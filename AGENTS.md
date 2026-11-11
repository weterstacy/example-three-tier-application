# Repository guidelines

For changes to docs/security-fixture.md, run this focused documentation test from the repository root before finishing:

```sh
node -e "const fs=require('fs');const text=fs.readFileSync('docs/security-fixture.md','utf8');if(!text.includes('The browser talks to the API.'))process.exit(1);process.stdout.write('fixture-doc-check: passed\n');"
```

Keep documentation edits limited to the requested sentence.
