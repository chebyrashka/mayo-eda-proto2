# Prototype 2 — AXIS Console

A local starting point imported from the supplied `axis-entry-v3.html`, maintained independently alongside `../platform-explore/`. The original design, sector pages, sample content, and scripted chat are retained.

## Development

Requires Node.js 20+ and Python 3. There are no package dependencies to install.

- `npm run dev`: serve the prototype at http://127.0.0.1:4330.
- `npm run check`: check the application JavaScript syntax.
- `npm run build`: check JavaScript and copy the public site to `dist/`.
- `npm run preview`: serve the build at the same address; stop the development server first.

## Source

- `public/index.html`: console markup.
- `public/styles.css`: styles extracted from the supplied file.
- `public/app.js`: scripted chat and sector navigation.
- `public/particles.js`: previous floating particle experiment, retained but not loaded by the page.
- `public/assets/background.mp4`: original decoded video, displayed behind the interface with a translucent blue overlay, soft blur, and reduced saturation and brightness. It shows blue particle trails, a horizontal glow, and a visible timecode in the source. Stacking places it above the page background and below the interface. Playback pauses in hidden tabs; reduced-motion mode uses the static blue background.
- `reference/axis-entry-v3.html`: unchanged original for comparison, excluded from the public build.

The import separates the original single file into editable assets. Chat messages now render as text to prevent typed HTML from becoming executable markup. The input and conversation log have accessible labels.

## Prototype limitations

Chat uses keyword matching and sample replies, with no AI service or backend. Statistics and testimonials are supplied demo content. Detail-page calls to action remain placeholders; the fourth sector is intentionally disabled. Conversation state resets on reload. Google Fonts requires internet access; system font fallbacks are provided.

## Deployment

Not deployed. For a Netlify site using this folder as its project root, `netlify.toml` sets `npm run build` and the `dist` publish directory. If connecting a repository containing both prototypes, set the Netlify base directory to `prototype2` (or its repository-relative path).

## Environment

No environment variables, API keys, CMS, database, or authentication are required. See `.env.example`.
