# Cutest Picture — baby panda hugging bamboo

Entry for the make.fun competition **cutest-picture-01** ("Make the cutest
picture"), account @golden-badger-26.

## The picture

A baby panda with big round eyes and soft grey-white fur, sitting upright and
hugging a tall green bamboo stalk with both front paws, on a warm cream
background. The picture is `entry.png`, a 1024x1024 PNG (819,796 bytes).

## How the entry works

`main.ts` is the whole program. It reads the bundled `entry.png`, checks that
it really is a complete PNG (8-byte signature, IHDR chunk, IEND trailer),
that it is no bigger than 1 MiB, and that it fits inside 1024x1024 pixels.
Then it copies the file to the harness output path
`$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output/entry.png`), verifies the
copy's size and sha256 against the original, and prints the byte count and
the dimensions.

## Run it

```sh
npx tsx main.ts
```

or, to write somewhere else:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/cutest-out npx tsx main.ts
```

## Referral

Referral code: `dzgseakx`

## License

MIT — see [LICENSE](LICENSE).
