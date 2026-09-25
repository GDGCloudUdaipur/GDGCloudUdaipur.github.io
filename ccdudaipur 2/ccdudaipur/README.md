# Cloud Community Days Udaipur 2026

The website for Google Cloud Community Days Udaipur 2026 by GDG Cloud Udaipur.
Plain HTML, CSS and JavaScript. No build step and no dependencies, so it runs as-is on GitHub Pages.

## Put it on GitHub Pages

1. Create a repo (for example `ccd-udaipur`) and push the contents of this folder to `main`.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` publishes on every push to `main`.

If you'd rather not use Actions, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`. The `.nojekyll` file is already there.

**Custom domain:** add a `CNAME` file containing your domain (e.g. `ccd.gdgcloududaipur.com`) and point a DNS CNAME record at `<user>.github.io`.

## Edit the content

Almost everything lives in **`js/data.js`**:

| What | Where in `data.js` |
|---|---|
| Date and time | `event.start`, `event.end` (Sunday 6 Dec 2026, 9:00 – 18:30 IST) |
| Register, CFP, volunteer and sponsor links | `links` |
| Venue and map pin | `venue`. Set `confirmed: true` once it's final |
| Agenda | `agenda`. While it is empty the page shows the sealed "agenda revealing soon" card; add sessions and the planner switches on |
| Speakers | `speakers`. While empty, `speakerSlots` jharokha windows show "Revealing soon"; add entries with `name`, `role`, `company`, `photo` to reveal |
| Partners | `sponsors` (logos go in `assets/img/sponsors/`) |
| Team | `team` (the section stays hidden while this is empty) |
| FAQ, quiz questions, hack prompts | `faq`, `quiz`, `hack` |

Also update the date in the JSON-LD block in `index.html` so search engines show the right date.

After changing files, bump `CACHE` in `sw.js` (e.g. `v2`) so returning visitors get the new version.

## Features

- **A living Udaipur:** the hero is a full-screen, code-drawn Lake Pichola (City Palace, Lake Palace, Jag Mandir, Gangaur Ghat, Jagdish temple, Sajjangarh and the Karni Mata ropeway) that follows the real time in Udaipur. Dawn mist and aarti lamps, kites at noon (tap one to cut it), sunset on the ridge, and at night a gold-lit palace, floating diyas and wedding-season fireworks. Mouse parallax and a sky scrubber.
- **Google × Mewar:** toran bunting in Google colours, jharokha arches, jaali lattice, leheriya and bandhani patterns, and a "Where Mewar meets Google" section.
- **A day in Udaipur:** a scroll story from dawn at Gangaur Ghat to lamps at Fateh Sagar.
- **Plan your day:** filter by track, search, star sessions, export them to a calendar (.ics) or add one session at a time. On the day, a live "now / next" banner appears.
- **Revealing soon:** speakers appear in palace jharokha windows and the agenda is a sealed farman until they are announced.
- **Shahi Pass:** a personalised royal-invitation image (PNG) attendees can download and share.
- **30-minute hack roulette** with a countdown timer, and the **Cloud Ka Sawaal** quiz.
- **Seven lakes hunt:** seven lotuses are hidden around the page. Finding all of them turns the Shahi Pass gold.
- **Command palette** (⌘K, Ctrl+K or `/`), day/night theme, installable PWA with offline agenda, travel guide, map, FAQ, code of conduct, 404 page.

## Run locally

Open `index.html` directly, or serve the folder:

```bash
npx serve .
```
