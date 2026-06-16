# SpoolMate

A static prototype for drawing pipe spools in a 2D isometric view and exporting clearer 3D-style images.

See [`CHANGELOG.md`](CHANGELOG.md) for the update log through the current app version.

## Run

Open `index.html` in a browser.

No build step is required. The 3D viewport tries to load Three.js from a CDN; if that is unavailable, the app keeps working with the built-in canvas 3D preview.

For PWA testing, serve the folder over `http://localhost` instead of opening `index.html` as a `file://` URL. Service workers cannot run from `file://`.

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Install On iPad Or Android

SpoolMate is set up as a Progressive Web App with:

- `manifest.webmanifest`
- `sw.js`
- app icons in `icons/`
- offline app-shell caching

To install it on devices, host this folder on HTTPS using Netlify, Cloudflare Pages, GitHub Pages, Vercel, or similar.

### Quick Local Network Test

1. On the PC, open PowerShell in this folder.
2. Run `python -m http.server 8000`.
3. Find the PC IP address with `ipconfig`.
4. On the iPad/Android device, open `http://YOUR-PC-IP:8000`.

This is only for testing on the same Wi-Fi network. It is not installable as a proper PWA unless served from HTTPS or localhost.

### Simple Hosting With Netlify

1. Go to Netlify.
2. Create a new site using drag-and-drop deploy.
3. Drop this whole project folder into Netlify.
4. Open the Netlify HTTPS URL on the iPad or Android phone.

### Install On Device

iPad:

1. Open the HTTPS app URL in Safari.
2. Tap Share.
3. Tap Add to Home Screen.

Android:

1. Open the HTTPS app URL in Chrome.
2. Tap Install app, or Add to Home screen.

Each device keeps its own browser storage. Use the Import and Export project buttons to move spool jobs between PC, iPad, and phone.

## Touch Help

On iPad or phone, tap **Select**, then press and hold on a pipe run, fitting or note to open its action menu. To change a flange, press and hold directly on the flange marker, choose **Flange standard**, then pick the required type. The app also has a built-in **Menu > Help** panel with iPad/phone, Draw, Edit, Review, Export and Account instructions.

## Current features

- Draw snapped isometric pipe runs by clicking on the drawing canvas.
- Each click adds a straight run from the current yellow endpoint toward the closest isometric axis.
- Add precise X, Y, and Z runs with millimetre lengths.
- Add angled runs in X-Y, X-Z, or Y-Z planes.
- Select a run and edit its section length in millimetres.
- Select a run and nominate its own carbon steel NB size.
- Shift/Ctrl-click runs to multi-select them, then change all selected pipe sizes together.
- Scale 3D pipe, elbows, nodes, fittings, and fallback preview widths by nominated NB size.
- Place flanges with bolt-hole detail, valves, weld bands, and reducers on existing runs.
- Right-click the drawing to edit pipe length, bend angle, pipe size, add single flanges, double flanges, reducers, and text notes at the picked spot.
- Press Enter while drawing to stop drawing and return to selection.
- Create tee points on existing pipe sections and draw new branch runs from them.
- Show tee connections as tee bodies and draw open pipe ends with flush cut caps.
- Place text notes on the isometric drawing.
- Label every pipe section size and length in the 3D preview.
- Switch the 3D preview between carbon steel, red review, ghosted, and red outline views.
- Collapse or expand each middle control section.
- Select common carbon steel NB pipe sizes up to NB 300.
- Estimate Schedule 40 / Standard Weight pipe cut lengths, bend take-offs, and carbon steel pipe weight from Atlas Steels data.
- Show bend take-off notes for each bend.
- Show pipe lengths in mm and bend angle labels.
- Render smooth rounded elbows in the isometric drawing and 3D preview.
- View the same spool in a carbon-steel styled 3D preview.
- Export PNG images of the 3D preview and the isometric drawing.
- Save the current spool in browser local storage.
- Install as a PWA when hosted on HTTPS.
- Export and import project files between devices.
