# Offer Ladder

**Quest Log** (original prototype B) is live at the base URL.

```bash
npm run dev
```

Open http://127.0.0.1:5173/ — light parchment UI, character sheet, main/side quests, **Study + interview calendar**.

Data persists in localStorage (XP run + study catch-up).

## Push to GitHub (UpdatingSG, no account switching)

This repo is configured to use **UpdatingSG** over HTTPS with credentials stored **only for this repo path** (office `gh` / git can stay on your work account elsewhere).

1. **Create a token** (once): GitHub → **UpdatingSG** → Settings → Developer settings → [Fine-grained token](https://github.com/settings/personal-access-tokens) with access to `offer-ladder`, or a classic token with `repo` scope.
2. **Push** from this folder:
   ```bash
   git push origin master
   ```
   When macOS prompts for a password, paste the **token** (not your GitHub password). Keychain remembers it for `UpdatingSG/offer-ladder` only.

Optional: store via CLI without a prompt (replace `ghp_…` locally, never commit it):

```bash
printf 'protocol=https\nhost=github.com\npath=UpdatingSG/offer-ladder\nusername=UpdatingSG\npassword=YOUR_TOKEN\n' | git credential-osxkeychain store
```
