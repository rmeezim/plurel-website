# Plurel — hero film (Higgsfield prompt pack)

The home hero plays a muted, looping background film behind the headline.
This doc covers what the film should feel like, how to generate it in
Higgsfield, how to export it, and where to drop the files so the site picks
them up.

Until the files exist, the hero runs a stand-in scene (warm light drifting
through a red room), so nothing on the site waits on the film.

---

## 1. The brief

**Feel:** alive, human, friendly, inviting. People doing thoughtful work
together in a warm studio, lit in Plurel red. It should feel like a real
place you'd want to walk into, not stock footage of "business".

**Grade:** deep crimson and oxblood ambient light (Plurel red is
`#bf3a36`), warm natural skin tones, low-key lighting, soft highlights,
fine film grain. The site adds a red multiply layer on top, so footage
that is already warm-red works best.

**Composition:** the headline sits on the **left 45%** of the frame.
Keep that side darker and quiet (background, shadow, out-of-focus space).
Put people and motion in the **right two-thirds**.

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
> people on the right two-thirds of the frame, left third falls into soft
> dark red shadow, natural candid moment, no text, no logos

**Motion:** slow push-in toward the table, people moving naturally,
gentle shifts of light. **Negative:** text, logos, readable screens,
looking at camera, fast motion, harsh flash, cold blue light.

### Shot B — Hands on the work

> Close-up of hands arranging printed brand cards and typography proofs on
> a matte table, a pencil, a ruler, red paper samples, a coffee cup at the
> edge, warm crimson key light from the right, deep oxblood shadows,
> macro detail, shallow depth of field, cinematic, 50mm, film grain,
> subject on the right side of frame, left side soft and dark, no text
> legible, no logos

**Motion:** static camera, hands slide one card into place and adjust
another, slow and deliberate.

### Shot C — Window-light portrait

> Medium shot of a strategist in profile standing by a tall studio window
> at golden hour, looking at a wall of pinned printed work, a slight
> thoughtful smile, deep red sunset light washing across the scene,
> oxblood shadows, soft haze in the air, cinematic 35mm, shallow depth of
> field, fine grain, subject placed right of center, left of frame falls
> into soft dark red, candid, no text, no logos

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

**Tuning the grade.** The hero lays a red multiply layer over the film at
45% opacity (`bg-brand opacity-45 mix-blend-multiply` in `hero.tsx`).
If your footage is already deeply red, lower it to `opacity-25`; if it
reads too neutral, raise it to `opacity-60`.

**Behavior built in:** the film fades in once it can play, pauses when
the hero scrolls out of view, does not autoplay for visitors with
reduced-motion or data-saver settings, and has a pause/play control.

---

## 6. Checklist before shipping

- [ ] Loop point is invisible on three consecutive plays
- [ ] Left 45% of the frame is calm enough for the headline at 1440px and 390px
- [ ] No text, logos, readable screens, or real people's likeness
- [ ] Desktop file under 4 MB, mobile under 2 MB
- [ ] Poster frame exported and matches the first frame
- [ ] Checked with the red overlay on (the site, not the raw file)
