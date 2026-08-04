# Deployment Checklist — FlyRank AI Website Metadata Analyzer

Use this checklist before and after deploying to Vercel (or any Node.js host).

## 1. Pre-Deployment Checks

- [ ] `git status` is clean and on the intended branch
- [ ] No secrets/API keys are committed in code or config files
- [ ] `.env.local` is in `.gitignore`
- [ ] Dependencies install cleanly: `npm install`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Production build passes: `npm run build`
- [ ] No console errors in development server
- [ ] `vercel.json` exists and is valid
- [ ] `package.json` scripts and engines are correct

## 2. Environment Variables

Production environment variables must be set in the hosting platform.

| Variable | Required | Where Used |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Server-side only (`app/api/chat/route.js`) |

Vercel:
- Project Settings → Environment Variables → Add `OPENROUTER_API_KEY`
- Mark as **Secret** and **Production** + **Preview** environments

## 3. Build Verification

- [ ] `npm run build` completes with 0 errors
- [ ] Build output shows expected routes:
  - `/` — static
  - `/api/chat` — server-rendered dynamic
- [ ] First Load JS is within acceptable limits
- [ ] No missing assets or 404s in build output

## 4. Security Checks

- [ ] `.env.local` is ignored by Git
- [ ] No API keys, tokens, or passwords in committed files
- [ ] `OPENROUTER_API_KEY` is never exposed to the browser
- [ ] SSRF protection is active (`lib/url-security.js`)
- [ ] Tool input is validated with Zod (`lib/tools.js`)
- [ ] Error messages do not leak sensitive internal details
- [ ] External links use `rel="noopener noreferrer"` where applicable

## 5. Accessibility Check

- [ ] Keyboard navigation works for all interactive elements
- [ ] Icon-only buttons have `aria-label`
- [ ] Form validation uses `role="alert"` and `aria-describedby`
- [ ] Status updates use `aria-live`
- [ ] No horizontal overflow at 375px and 1280px
- [ ] Touch targets are ≥ 40×40px

## 6. Performance Check

- [ ] First Load JS is optimized
- [ ] No unnecessary client-side re-renders
- [ ] Streaming responses are used for AI output
- [ ] Shared chunks are reused across routes
- [ ] No heavy synchronous operations on the main thread

## 7. Production Verification

- [ ] Deploy to preview environment first
- [ ] Verify `/` loads without console errors
- [ ] Test the primary flow end-to-end:
  - Open homepage
  - Enter a URL (e.g. `https://example.com`)
  - Confirm validation accepts the URL
  - Confirm analysis starts
  - Confirm structured tool result renders
  - Confirm AI summary streams in
- [ ] Test error scenarios:
  - Invalid URL format
  - Non-HTTP scheme
  - Unreachable domain
- [ ] Test retry behavior on failure
- [ ] Test dark mode toggle
- [ ] Test on mobile viewport (375px)
- [ ] Verify OpenRouter streaming works with production API key

## 8. Rollback Procedure

If the production deployment introduces regressions:

1. Identify the last known-good commit on `main`.
2. Re-deploy that commit in Vercel:
   - Vercel Dashboard → Deployments → Promote last good deployment
   - Or use Vercel CLI: `vercel rollback`
3. Alternatively, rollback via Git:
   ```bash
   git revert <bad-commit>
   git push origin main
   ```
4. Notify stakeholders and investigate the issue in a preview environment.

---

# Quick Commands

```bash
npm install
npm run lint
npm test
npm run build
npm start
```

# Environment Variables Reference

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

# Support

- GitHub Issues: https://github.com/awaisaltaf5/Flyrank/issues
- Author: Muhammad Awais Altaf — https://github.com/awaisaltaf5