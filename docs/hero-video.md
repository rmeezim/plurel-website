# Plurel — hero film (Higgsfield prompt pack)

The home hero is a red room with a **distribution wall**: one story shown
as the seven surfaces it ships to (a reel, a search result, a brand film,
an AI answer, a feed post, a press feature, a billboard), hanging on the
wall and drifting slowly past.

The film is used twice, from a single video file:

1. **Behind everything**, full bleed, blurred and graded red: the room's
   ambient light.
2. **Inside the wall's film frames**, sharp and in true color, cropped
   live to 9:16 (reel), 16:9 (brand film), 1:1 (feed) and a wide
   billboard panel. Every crop shows the same frame in sync.

This doc covers what the film should feel like, how to generate it in
Higgsfield, how to export it, and where to drop the files so the site picks
them up. Until the files exist, the room and the frames run a stand-in
(warm light drifting through red), so nothing on the site waits on the
film.

---

## 1. The brief

**Feel:** alive, human, friendly, inviting. People doing thoughtful work
together in a warm studio, lit in Plurel red. It should feel like a real
place you'd want to walk into, not stock footage of "business".

**Grade:** deep crimson and oxblood ambient light (Plurel red is
`#bf3a36`), warm natural skin tones, low-key lighting, soft highlights,
fine film grain. In the wall's frames the film is shown as graded, with
no overlay, so it has to look finished on its own.

**Composition:** the frames crop the film to 9:16, 1:1, 16:9 and a wide
panel, so keep the action **center-safe**: the subject should still read
in a tight vertical crop through the middle of the frame. Avoid important
detail at the far left and right edges.

**Motion:** slow and continuous. A gentle push-in or lateral drift,
people moving naturally at half speed. No cuts, no whip pans, no one
looking into the lens.

**Never:** on-screen text, logos, screens with readable UI, recognizable
brands or real people's likeness.

**Technical targets**

| | Desktop | Mobile (optional) |
| --- | --- | --- |
| Aspect | 16:9 | 4:5 |
| Size | 1920 x 1080 | 1080 x 1350 |
| Length | 8 to 12 s, seamless loop | same clip, reframed |
| Frame rate | 24 fps | 24 fps |
| File budget | under 4 MB | under 2 MB |
| Audio | none | none |

---

## 2. Workflow in Higgsfield

1. **Generate the key frame as a still** with Higgsfield's image model,
   using one of the shot prompts below at 16:9. Make 4 to 8 variations and
   pick the one with the cleanest left side and the warmest light.
2. **Animate it with image-to-video.** Use the still as the first frame.
   If the model you pick supports a start frame *and* an end frame, use the
   same still for both: the clip then ends where it began and loops
   without a seam. Choose a slow camera move (slow push-in, slow dolly
   left, or static with subject motion). Generate 5 to 10 second clips.
3. **Make 3 or 4 takes** and judge them against the brief: is the motion
   calm, is the left side quiet, does the loop point disappear?
4. **If the loop has a visible jump,** close it with the crossfade command
   in section 4.
5. **Export** with the commands in section 4 and drop the files in
   `public/video/`.

---

## 3. Shot prompts

Copy a prompt as written, then adjust. Each is written for the still;
the motion line is for the image-to-video step.

### Shot A — The studio at dusk (recommended)

> Cinematic wide shot inside a warm creative studio at dusk, a small team
> of three gathered around a large wooden table covered in printed brand
> layouts and color swatches, one person leaning in pointing at a print,
> another laughing softly, soft deep crimson light spilling from a tall
> window on the right, oxblood shadows, practical lamps glowing warm,
> shallow depth of field, 35mm film look, soft halation, fine film grain,
> people grouped near the center of the frame so they read in a tight
> vertical crop, natural candid moment, no text, no logos

**Motion:** slow push-in toward the table, people moving naturally,
gentle shifts of light. **Negative:** text, logos, readable screens,
looking at camera, fast motion, harsh flash, cold blue light.

### Shot B — Hands on the work

> Close-up of hands arranging printed brand cards and typography proofs on
> a matte table, a pencil, a ruler, red paper samples, a coffee cup at the
> edge, warm crimson key light from the right, deep oxblood shadows,
> macro detail, shallow depth of field, cinematic, 50mm, film grain,
> subject centered with soft dark edges, no text legible, no logos

**Motion:** static camera, hands slide one card into place and adjust
another, slow and deliberate.

### Shot C — Window-light portrait

> Medium shot of a strategist in profile standing by a tall studio window
> at golden hour, looking at a wall of pinned printed work, a slight
> thoughtful smile, deep red sunset light washing across the scene,
> oxblood shadows, soft haze in the air, cinematic 35mm, shallow depth of
> field, fine grain, subject just right of center and still inside a
> vertical center crop, candid, no text, no logos

**Motion:** slow lateral dolly from left to right, subject turns their
head slightly toward the wall.

### Shot D — The red room (abstract, no people)

> Slow-moving warm light crossing a textured red plaster wall in an empty
> studio, soft shadows of leaves and window frames drifting across, dust
> particles floating in a beam of crimson light, deep oxblood corners,
> cinematic, anamorphic, fine film grain, minimal, calm, no text

**Motion:** static camera, light and shadows drift slowly across the wall.
Use this as a calmer alternative, or for the mobile cut.

---

## 4. Export commands

Run these on the chosen master (`master.mov` or `master.mp4`). They need
[ffmpeg](https://ffmpeg.org).

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

**Poster frame (recommended):** shown before the film loads and to
visitors who prefer reduced motion:

```bash
ffmpeg -ss 0 -i public/video/plurel-hero.mp4 -frames:v 1 -q:v 3 \
  public/video/plurel-hero-poster.jpg
```

---

## 5. Dropping it in

| File | Needed | Used for |
| --- | --- | --- |
| `public/video/plurel-hero.mp4` | yes | every browser |
| `public/video/plurel-hero.webm` | no | browsers that prefer WebM |
| `public/video/plurel-hero-mobile.mp4` | no | screens up to 767px wide |
| `public/video/plurel-hero-poster.jpg` | recommended | first paint, reduced motion |

`src/components/hero.tsx` checks for these files at build time. Add them,
rebuild, and the film replaces the stand-in scene. No code change needed.

**Tuning the room.** Behind the wall the film is blurred (`.hero-film` in
`globals.css`) and graded with a red multiply layer at 60% opacity
(`bg-brand opacity-60 mix-blend-multiply` in `hero.tsx`). If the room
reads too busy, raise the blur; if it reads too flat, lower the opacity.
Neither setting touches the wall's frames.

**Focal points.** Each film frame crops around a focal point (`focus` on
`Media` in `hero-wall.tsx`, 0 to 1 on each axis). Nudge them if the
subject drifts out of a crop.

**Behavior built in:** one video decode feeds every frame. The film
fades in once it can play, pauses when the hero scrolls out of view,
does not autoplay for visitors with reduced-motion or data-saver
settings, and the hero's pause control stops the film and the wall's
drift together.

---

## 6. Checklist before shipping

- [ ] Loop point is invisible on three consecutive plays
- [ ] The subject still reads in the 9:16 reel crop and the 1:1 feed crop
- [ ] No text, logos, readable screens, or real people's likeness
- [ ] Desktop file under 4 MB, mobile under 2 MB
- [ ] Poster frame exported and matches the first frame
- [ ] Checked on the site: the room behind (blurred, red) and the frames (sharp, true color)
