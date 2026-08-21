# Safe GitHub upload

SpoolMate's source code belongs in GitHub. Raw recordings, rendered videos,
narration, temporary files and secrets do not. Tutorial and promotional videos
used by the app are hosted in Supabase Storage.

## Prepare a safe upload folder

Open PowerShell in this project directory and run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\prepare-github-upload.ps1
```

This bypass applies only to that single command; it does not change your
computer's permanent PowerShell policy.

The script creates a new timestamped folder inside the neighbouring
`UPLOAD-TO-GITHUB` directory. It copies only approved source files and checks
that no video, audio, archive or `.env` file is present.

Open the timestamped folder, select its **contents**, and drag those contents
onto GitHub's `upload/main` page. Do not drag the `isodrawing`,
`video-production`, or `UPLOAD-TO-GITHUB` folder itself.

## Important limitation

`.gitignore` protects normal Git commits and command-line pushes. It cannot stop
GitHub's website from accepting a file that is manually selected or dragged
into the browser. For browser uploads, always use the folder produced by the
script.
