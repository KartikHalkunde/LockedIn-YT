# Privacy Policy

**Last updated:** 07/09/2026      
**Applies to:** LockedIn browser extension (Chrome, Firefox, Edge)

## Summary

**LockedIn collects zero data, period.** It runs entirely inside your browser,
on YouTube pages only, and never talks to any server, not ours, not anyone
else's. There is no account, no sign-in, no analytics SDK, and nothing is
ever sent off your device.

## What LockedIn Does NOT Do

-  Does not make any network requests of any kind
-  Does not collect, log, or transmit personal data
-  Does not use analytics, telemetry, or crash reporting
-  Does not track your browsing history or viewing habits
-  Does not read or store the content of YouTube pages beyond what's
  needed to hide/show UI elements in real time
-  Does not use cookies, fingerprinting, or any cross-site tracking
-  Does not share, sell, or have any way to share data with third parties.
  There is simply no mechanism for it to do so

## What LockedIn Actually Does

LockedIn is a **content script** that runs locally in your browser on
`youtube.com` pages. Based on the toggles you set in the popup, it hides or
shows specific page elements (Shorts, homepage feed, recommendations,
comments, autoplay, etc.) by manipulating the page's DOM/CSS directly in
your browser. That's the entire mechanism: no server round-trip, no
external processing.

## Data Storage

| | |
|---|---|
| **What's stored** | Your toggle preferences (e.g. hide feed, block Shorts, disable autoplay) |
| **Where** | Locally, via your browser's built-in `storage` API |
| **Who can access it** | Only you, on your own device |
| **Does LockedIn ever see it** | No. We (the developers) have no access to this data; it never leaves your browser |
| **Sync across devices** | Only if *you* have browser sync enabled (Chrome Sync, Firefox Sync, Edge Sync). This is handled entirely by your browser vendor's own encrypted sync infrastructure; LockedIn has no involvement and no visibility into it |

## Permissions Explained

LockedIn requests the minimum permissions required to function, nothing more:

| Permission | Why It's Needed | What It Does NOT Allow |
|---|---|---|
| `storage` | Saves your toggle preferences locally so they persist across sessions | Does not grant access to browsing history, other sites, or data outside the extension |
| `*://www.youtube.com/*` (host permission) | Lets the content script run on YouTube pages to hide/show elements | Does not grant access to any other website; LockedIn has no visibility into non-YouTube tabs |

No `tabs`, `webRequest`, `history`, `cookies`, or other broad-access
permissions are requested, because none are needed for the extension to work.

## How It Works, Step by Step

1. You toggle a setting in the popup (e.g. "Hide Shorts").
2. That preference is saved locally via `browser.storage`.
3. The content script, running only on YouTube pages, reads that preference
   and applies or removes the corresponding CSS/DOM change instantly.
4. Nothing about this process involves a network request. Everything
   happens on your machine, in your browser, for as long as the tab is open.

## Children's Privacy

LockedIn does not knowingly collect any data from anyone, of any age, because
it does not collect data at all. There is nothing for a child (or anyone
else) to submit, and no mechanism for personal information to be gathered.

## Changes to This Policy

If this policy is ever updated, for example if a future feature changes
how data is handled, the "Last updated" date above will be revised, and
material changes will be noted in the [CHANGELOG](./CHANGELOG.md).

## Open Source & Verification

You don't have to take our word for any of this. The entire source code is
public on [GitHub](https://github.com/KartikHalkunde/LockedIn-YT): every
content script, every permission, every line. You're welcome (and
encouraged) to read it yourself, or have someone technical review it, to
confirm nothing described above has changed.

## Questions or Concerns?

Open an issue on [GitHub](https://github.com/KartikHalkunde/LockedIn-YT/issues)
and it'll be addressed directly. There's no support ticket system, no
data request process to worry about, because there's no data to request.
