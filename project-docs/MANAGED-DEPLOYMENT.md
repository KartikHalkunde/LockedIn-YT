# Managed Deployment (Enterprise / Family Policy)

LockedIn supports **managed storage**, so an administrator (a parent on a shared
family computer, a school, or an IT admin) can **force and lock** any setting.
This is useful when you want a setting to be enforced and *not* be user-toggleable
- for example, permanently blocking YouTube Shorts on a child's account.

## How it works

- Settings are pushed to the browser via standard **enterprise policy**
  (`storage.managed`).
- **Any key present in managed storage is both forced and locked.** Its value is
  applied on every YouTube page, and its toggle in the popup is disabled and shown
  with a lock badge ("Enforced by your administrator").
- Effective value precedence is: **managed (wins) → sync (your normal saved
  settings) → built-in defaults.**
- Keys you do *not* put in policy keep working exactly as before (user-controlled,
  saved to `storage.sync`).

No data ever leaves the device - managed storage is local policy read by the
browser, not a network feature. See `PRIVACY.md`.

## Available keys

All keys are optional. Booleans unless noted. See `src/managed-schema.json` for
the authoritative list (Chrome requires this schema, which is bundled in the
extension). Common ones:

| Key | Effect |
|-----|--------|
| `hideShortsGlobally` | Hide Shorts on all pages |
| `redirectShorts` | Redirect Shorts to the normal watch page |
| `hideShortsHomepage` | Hide Shorts on the homepage |
| `hideShortsSearch` | Hide Shorts in search results |
| `hideSidebarShorts` | Hide Shorts in the watch-page sidebar |
| `hideFeed` | Hide the homepage feed |
| `redirectToSubs` | Redirect the homepage to Subscriptions (with `hideFeed`) |
| `hideRecommended` | Hide recommended videos |
| `disableAutoplay` | Turn autoplay off |
| `hideComments` | Hide comments |
| `hideVideoThumbnails` | Thumbnail mode. The managed value must be a string: `off`, `hidden`, `reveal-on-hover`, `blurred`, or `solid-color` (Chrome's policy schema does not accept a boolean here) |
| `extensionEnabled` | Force the extension on (`true`) or off (`false`) |
| `language` | Force popup language (string, e.g. `en`, `es`, `de`) |
| `appearance` | Force popup theme (string: `auto`, `light`, `dark`) |

## Chrome / Chromium

Extension ID (Chrome Web Store): `ddpdgiidmcljefnhnfpgndbdnimbhdgh`

Example policy JSON (forces Shorts hidden + redirect, both locked):

```json
{
  "3rdparty": {
    "extensions": {
      "ddpdgiidmcljefnhnfpgndbdnimbhdgh": {
        "hideShortsGlobally": true,
        "redirectShorts": true
      }
    }
  }
}
```

Where to put it:

- **Linux (Chrome)**: `/etc/opt/chrome/policies/managed/lockedin.json`
- **Linux (Chromium)**: `/etc/chromium/policies/managed/lockedin.json`
- **macOS**: deliver via a configuration profile / `defaults` under
  `com.google.Chrome` → `ExtensionSettings` / `3rdparty`.
- **Windows**: registry under
  `HKLM\Software\Policies\Google\Chrome\3rdparty\extensions\ddpdgiidmcljefnhnfpgndbdnimbhdgh`
  with each setting as a value (booleans as REG_DWORD `0`/`1`).

Verify at `chrome://policy` (click **Reload policies**). The keys appear under
the extension once loaded.

### Microsoft Edge

Edge uses the **Edge Add-ons** extension ID `hibjbjgfbmhpiaapeccnfddnpabnlklj`
and the `Microsoft\Edge` policy path, e.g. on Windows:
`HKLM\Software\Policies\Microsoft\Edge\3rdparty\extensions\hibjbjgfbmhpiaapeccnfddnpabnlklj`.
The JSON `3rdparty` shape is identical - just swap the ID. Verify at `edge://policy`.

## Firefox

Add-on ID: `kartik@lockedin.com`

Firefox reads managed storage from **`policies.json`** (or the equivalent GPO /
configuration profile). Example:

```json
{
  "policies": {
    "3rdparty": {
      "Extensions": {
        "kartik@lockedin.com": {
          "hideShortsGlobally": true,
          "redirectShorts": true
        }
      }
    }
  }
}
```

Where to put `policies.json`:

- **Linux**: `/etc/firefox/policies/policies.json` (or the `distribution/` folder
  next to the Firefox binary).
- **macOS**: `Firefox.app/Contents/Resources/distribution/policies.json` or an
  enterprise configuration profile.
- **Windows**: `policies.json` in a `distribution` folder next to `firefox.exe`,
  or the corresponding GPO under `Software\Policies\Mozilla\Firefox`.

Verify at `about:policies` → **Active** tab.

## Notes

- To leave a setting user-controlled, simply omit it from policy.
- To change an enforced value, edit the policy and reload policies; LockedIn
  applies managed changes live (it listens for `storage.managed` changes) - no
  extension reinstall needed.
- Chrome **requires** the bundled `managed-schema.json`; without a schema Chrome
  ignores managed policy for an extension. It is harmless on Firefox.
