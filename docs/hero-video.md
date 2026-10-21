# Plurel: the hero film (shot list)

**The rule: real, shot footage of real work. Nothing generated.** No
text-to-video, no image-to-video, no generated stills animated into a
loop, no generative fill, no stock. Plurel sells real work made by real
people, and a generated film is the first thing a buyer learns to spot.
Every frame on the site is shot on a camera, of the team or of work it
actually did (with the client's permission).

Until that footage exists, the site runs its stand-in: a code-drawn red
film behind the glass. It is finished on its own, so nothing waits on the
shoot, and a stand-in is always better than a generated clip.

Footage goes in one place: **the film behind the glass**
(`public/video/plurel-hero.*`), used by the fluted glass band in the hero
and again at the closing chapter.

---

## 1. The film behind the glass

### How the site uses it

`src/lib/film.ts` looks for the files at build time and hands them to
`GlassBand` (`src/components/glass-band.tsx`), which `hero.tsx` and
`closing-chapter.tsx` both render. The band draws the film into a tiny
canvas, 192px wide, so it arrives soft, then refracts it through nine
cool glass flutes. Visitors never see the film sharp. What they see is
its color, its light and its movement.

It loops muted with no control (the owner's call), stops when the band is
off screen or the tab is hidden, and visitors with reduced motion or data
saver get the poster as a still frame.

### The brief

**Subject:** a real working day at Plurel, filmed on site. The people in
frame are the team, or have signed a release. Client work appears only
with the client's permission.

**Feel:** alive, human, unhurried. People doing careful work together in
a warm room, lit red. It should feel like a place you'd want to walk
into, never like stock footage of "business".

**Grade:** deep crimson and oxblood light (Plurel red is `#bf3a36`),
warm natural skin tones, low-key lighting, soft highlights, fine grain.
Get the red in camera where you can: a red gel on a practical, red film
on a window, a red wall bouncing the key.

**Composition:** keep the action in the middle of the frame. The flutes
slice the film into vertical strips, so broad shapes of light and dark
read best; small detail disappears.

**Motion:** slow and continuous. A slow push-in or lateral drift on a
slider, or a locked-off camera with people moving naturally. No cuts, no
whip pans, nobody looking into the lens.

**Never:** readable screens, on-screen text, logos, client material
without written permission, or a shot of anyone who hasn't agreed to it.

### Shot list

Shoot all four if you can; any one of them works on its own.

**Shot A: the review at dusk (recommended).** Three people around a large
table covered in printed layouts and color swatches, mid-review: one
leans in and points at a print, another laughs. Red light from a tall
window on the right, practical lamps warm in the background. 35mm, wide,
shallow depth of field. People grouped near the center.
*Camera:* slow push-in toward the table on a slider.

**Shot B: hands on the work.** Close-up of hands arranging printed proofs
and type specimens on a matte table: a pencil, a ruler, red paper
samples, a coffee cup at the edge. Warm red key from the right, deep
shadow, 50mm or macro. *Camera:* locked off; the hands slide one card
into place and adjust another.

**Shot C: the strategist at the wall.** A real member of the team in
profile by a tall window at the end of the day, looking at a wall of
pinned work, a small thoughtful smile. Red sunset light, a little haze.
Subject just right of center. *Camera:* slow lateral move, left to
right; the subject turns slightly toward the wall.

**Shot D: the red room (no people).** Warm light crossing a textured red
wall in the empty studio, shadows of window frames and leaves drifting
across, dust in the beam. The easiest to get: one clear afternoon and a
tripod. *Camera:* locked off. Good as the calmer option and for the
mobile cut.

### Shooting notes

- 24 fps for real-time motion, or 48/50 fps conformed to 24 for a
  half-speed feel. Lock exposure, white balance and focus.
- Take 20 to 30 seconds per take, and several takes per shot, so there
  is room to find a loop.
- For a clean loop on a moving camera, end the move where it began, or
  plan to close the seam with the crossfade in section 3.

### Technical targets

| | Desktop | Mobile (optional) |
| --- | --- | --- |
| Aspect | 16:9 | 4:5 |
| Size | 1920 x 1080 | 1080 x 1350 |
| Length | 8 to 12 s, looping cleanly | same clip, reframed |
| Frame rate | 24 fps | 24 fps |
| File budget | under 4 MB | under 2 MB |
| Audio | none | none |

The band draws the film small, so a modest bitrate costs nothing you can
see. Stay well under budget.

---

## 2. Export commands

They need [ffmpeg](https://ffmpeg.org). Run them on the graded master
(`master.mov` or `master.mp4`).

**Close a visible loop seam with a 1-second crossfade.** Set `D` to the
clip length in seconds; the result is 1 second shorter and loops cleanly:

```bash
D=10
ffmpeg -i master.mp4 -filter_complex \
  "[0]fps=24,format=yuv420p,split[a][b]; \
   [a]trim=start=1,setpts=PTS-STARTPTS[main]; \
   [b]trim=0:1,setpts=PTS-STARTPTS[head]; \
   [main][head]xfade=transition=fade:duration=1:offset=$((D-2))[out]" \
  -map "[out]" -an loop.mp4
```

**Desktop MP4 (required), H.264, under 4 MB:**

```bash
ffmpeg -i loop.mp4 -an -vf "scale=1920:-2,fps=24" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart \
  public/video/plurel-hero.mp4
```

Raise `-crf` (27, 28) if the file is over budget; lower it if you see
banding in the shadows.

**Desktop WebM (optional, smaller in Chrome and Firefox):**

```bash
ffmpeg -i loop.mp4 -an -vf "scale=1920:-2,fps=24" \
  -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 \
  public/video/plurel-hero.webm
```

**Mobile cut (optional), 4:5 center crop, under 2 MB:**

```bash
ffmpeg -i loop.mp4 -an -vf "crop=ih*4/5:ih,scale=1080:-2,fps=24" \
  -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart \
  public/video/plurel-hero-mobile.mp4
```

If the subject sits right of center, shift the crop: `crop=ih*4/5:ih:iw*0.4:0`.

**Poster frame (recommended):** the still shown before the film plays,
and to visitors who prefer reduced motion or save data:

```bash
ffmpeg -ss 0 -i public/video/plurel-hero.mp4 -frames:v 1 -q:v 3 \
  public/video/plurel-hero-poster.jpg
```


---

## 3. Dropping it in

| File | Needed | Used for |
| --- | --- | --- |
| `public/video/plurel-hero.mp4` | yes | every browser |
| `public/video/plurel-hero.webm` | no | browsers that prefer WebM |
| `public/video/plurel-hero-mobile.mp4` | no | screens up to 767px wide |
| `public/video/plurel-hero-poster.jpg` | recommended | first paint, reduced motion, data saver |

Add the files and rebuild. No code change is needed: the film replaces
the stand-in behind both glass bands.

**Tuning.** The glass sets its own cast over whatever is behind it
(`CAST`, `SLATE` and `SKY` in the shader in `src/lib/glass.ts`). If the
red reads too strong or too flat through the flutes, regrade the footage
first; touch the shader only if every clip has the same problem.

---

## 4. Checklist before shipping

- [ ] Every frame was shot on a camera; nothing generated or stock
- [ ] Everyone in frame is on the team or has signed a release
- [ ] Client work appears only with written permission
- [ ] No readable screens, text or logos behind the glass
- [ ] Loop point is invisible on three consecutive plays
- [ ] Desktop file under 4 MB, mobile under 2 MB
- [ ] Poster frame exported and matches the first frame
- [ ] Checked on the site, in the hero and at the closing glass, with
      motion on and with reduced motion
