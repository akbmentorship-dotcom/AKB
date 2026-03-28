// Day-of-week schedule
export const SCHEDULE = {
  mon: 'basketball',
  tue: 'workout',
  wed: 'basketball',
  thu: 'workout',
  fri: 'basketball',
  sat: 'workout',
  sun: 'rest',
};

// Workout day definitions (from existing app)
export const WD = [
  {
    id: 'tue', lbl: 'TUE', full: 'Tuesday', title: 'Upper A', sub: 'Horizontal push & pull · Full gym',
    cv: '#f05a1a', dim: 'var(--orange-dim)', brd: 'var(--orange-border)', type: 'Strength',
    structure: [
      { t: 'compound', lbl: 'Primary Compound', exs: [{ id: 'bench', name: 'Barbell Bench Press', sets: 4, reps: '4–6', note: '2 sec eccentric. Heaviest upper movement of the week.' }] },
      { t: 'superset', lbl: 'Superset A — Push / Pull', note: 'No rest between A1+A2. 90 sec after the pair.', exs: [{ id: 'incline_db', name: 'A1 — Incline DB Press', sets: 3, reps: '10–12', note: 'Push — upper chest' }, { id: 'cs_row', name: 'A2 — Chest-Supported DB Row', sets: 3, reps: '10–12', note: 'Pull — full stretch at bottom' }] },
      { t: 'superset', lbl: 'Superset B — Vertical Push / Rear Delt', note: 'No rest between B1+B2. 90 sec after the pair.', exs: [{ id: 'ohp', name: 'B1 — DB Overhead Press', sets: 3, reps: '10–12', note: 'Push — strict, no leg drive' }, { id: 'face_pull', name: 'B2 — Cable Face Pull', sets: 3, reps: '15–20', note: 'Pull — shoulder health, never skip' }] },
      { t: 'finisher', lbl: 'Finisher — Arms', note: 'Alternate back to back. 60 sec rest.', exs: [{ id: 'curl', name: 'F1 — Incline DB Curl', sets: 3, reps: '12–15', note: 'Bicep' }, { id: 'pushdown', name: 'F2 — Tricep Pushdown', sets: 3, reps: '12–15', note: 'Tricep' }] },
    ],
  },
  {
    id: 'thu', lbl: 'THU', full: 'Thursday', title: 'Lower A', sub: 'Quad & posterior chain · Full gym',
    cv: '#3a9de8', dim: 'var(--blue-dim)', brd: 'var(--blue-border)', type: 'Strength',
    structure: [
      { t: 'compound', lbl: 'Primary Compound', exs: [{ id: 'squat', name: 'Barbell Back Squat', sets: 4, reps: '4–6', note: 'Heaviest lower movement. Depth to parallel or below.' }] },
      { t: 'superset', lbl: 'Superset A — Hinge / Knee', note: 'No rest between A1+A2. 90 sec after the pair.', exs: [{ id: 'rdl', name: 'A1 — Romanian Deadlift', sets: 3, reps: '8–10', note: 'Hinge — feel the hamstring stretch' }, { id: 'leg_press', name: 'A2 — Leg Press', sets: 3, reps: '10–12', note: 'Knee dominant — full range' }] },
      { t: 'superset', lbl: 'Superset B — Single Leg / Hamstring', note: 'No rest between B1+B2. 90 sec after the pair.', exs: [{ id: 'lunge', name: 'B1 — Walking Lunges (DB)', sets: 3, reps: '10 each', note: 'Single leg stability' }, { id: 'leg_curl', name: 'B2 — Leg Curl', sets: 3, reps: '10–12', note: 'Hamstring isolation' }] },
      { t: 'finisher', lbl: 'Finisher — Calves & Core', note: 'Alternate. 60 sec rest.', exs: [{ id: 'calf', name: 'F1 — Calf Raise', sets: 4, reps: '15–20', note: 'Slow full range' }, { id: 'deadbug', name: 'F2 — Dead Bug', sets: 3, reps: '6 slow/side', note: 'Anti-extension core' }] },
    ],
  },
  {
    id: 'sat', lbl: 'SAT', full: 'Saturday', title: 'Lower B + Plyo', sub: 'Athletic development · Plyo first · Full gym',
    cv: '#3ecf82', dim: 'var(--green-dim)', brd: 'var(--green-border)', type: 'Athletic',
    structure: [
      { t: 'compound', lbl: 'Primary Compound — Do This Fresh', note: 'Plyo first. CNS needs to be fresh.', exs: [{ id: 'boxjump', name: 'Box Jump', sets: 4, reps: '4–5', note: 'Max effort every rep. Reset fully between reps.' }] },
      { t: 'superset', lbl: 'Superset A — Posterior Chain / Power', note: 'No rest between A1+A2. 90 sec after the pair.', exs: [{ id: 'trapbar', name: 'A1 — Trap Bar Deadlift', sets: 4, reps: '5–6', note: 'Hinge — posterior chain' }, { id: 'broadjump', name: 'A2 — Broad Jump', sets: 3, reps: '4–5', note: 'Horizontal power — land soft' }] },
      { t: 'superset', lbl: 'Superset B — Single Leg / Reactive', note: 'No rest between B1+B2. 90 sec after the pair.', exs: [{ id: 'bss', name: 'B1 — Bulgarian Split Squat', sets: 3, reps: '8 each', note: 'Single leg stability' }, { id: 'depthdrop', name: 'B2 — Depth Drop to Jump', sets: 3, reps: '4', note: 'Reactive — step off, absorb, jump' }] },
      { t: 'finisher', lbl: 'Finisher — Hip & Core', note: 'Alternate. 60 sec rest.', exs: [{ id: 'monster', name: 'F1 — Banded Monster Walk', sets: 2, reps: '15/side', note: 'Hip abductor' }, { id: 'pallof', name: 'F2 — Pallof Press', sets: 3, reps: '10/side', note: 'Anti-rotation core' }] },
    ],
  },
  {
    id: 'sun', lbl: 'SUN', full: 'Sunday', title: 'Upper B (Home)', sub: 'Vertical push & pull · Home gym',
    cv: '#9d6ef5', dim: 'var(--purple-dim)', brd: 'var(--purple-border)', type: 'Hypertrophy',
    structure: [
      { t: 'compound', lbl: 'Primary Compound', exs: [{ id: 'pullup', name: 'Weighted Pull-Up', sets: 4, reps: '6–8', note: 'Add weight at 4×8 clean. Bands to assist if needed.' }] },
      { t: 'superset', lbl: 'Superset A — Push / Pull', note: 'No rest between A1+A2. 90 sec after the pair.', exs: [{ id: 'db_press', name: 'A1 — DB Floor Press', sets: 3, reps: '10–12', note: 'Push — compact, no bench needed' }, { id: 'db_row', name: 'A2 — Single Arm DB Row', sets: 3, reps: '10–12 each', note: 'Pull — brace on knee, full range' }] },
      { t: 'superset', lbl: 'Superset B — Push / Pull', note: 'No rest between B1+B2. 90 sec after the pair.', exs: [{ id: 'arnold', name: 'B1 — Arnold Press (DB)', sets: 3, reps: '10–12', note: 'Push — all 3 delt heads' }, { id: 'band_pull', name: 'B2 — Band Pull-Apart', sets: 3, reps: '20', note: 'Pull — Y and W variations, rear delt health' }] },
      { t: 'finisher', lbl: 'Finisher — Arms', note: 'Alternate. 60 sec rest. Minimal space.', exs: [{ id: 'hammer', name: 'F1 — Hammer Curl (DB)', sets: 3, reps: '12–15', note: 'Bicep' }, { id: 'skull', name: 'F2 — DB Skull Crusher', sets: 3, reps: '12–15', note: 'Tricep — elbows in' }] },
    ],
  },
];

// Warm-up definitions (from existing app)
export const WU = {
  tue: {
    color: '#f05a1a', dur: '7–8 min', phases: [
      { lbl: 'Phase 1 — Raise Temperature', moves: [{ name: 'Arm Swing Crossovers + Reach', planes: ['Sagittal', 'Frontal', 'Transverse'], dose: '30 sec', desc: 'Forward/back, open wide, cross and reach.', cue: 'Let the reach drive rotation through your upper back.' }] },
      { lbl: 'Phase 2 — Joint Mobilization', moves: [
        { name: 'Thoracic Rotation (Quadruped)', planes: ['Transverse', 'Frontal'], dose: '8 each side', desc: 'Hand behind head. Rotate elbow to ground then open to ceiling.', cue: 'Hips stay square. All rotation through T-spine.' },
        { name: 'Wall Slide + Overhead Reach', planes: ['Sagittal', 'Frontal'], dose: '10 reps', desc: 'Forearms on wall, slide up then reach one arm overhead laterally.', cue: 'Ribs down — no arch in low back.' },
        { name: 'Shoulder CARs', planes: ['Multi-plane'], dose: '5 each dir', desc: 'Slow full-circle shoulder rotation. 3–4 seconds per revolution.', cue: 'Paint the biggest circle possible. Feel every degree.' },
        { name: 'Band Pull-Apart (3 positions)', planes: ['Frontal', 'Transverse'], dose: '10 each pos', desc: 'Standard, Y pull (30° above), W pull (30° below).', cue: "Squeeze shoulder blades at end range. Don't shrug." },
      ] },
      { lbl: 'Phase 3 — Activation', moves: [{ name: 'Scapular Push-Up', planes: ['Sagittal', 'Frontal'], dose: '10 slow', desc: 'Arms straight. Chest drops between blades, then push floor away.', cue: 'Scapula exercise — not chest. Control it.' }] },
    ],
  },
  thu: {
    color: '#3a9de8', dur: '7–8 min', phases: [
      { lbl: 'Phase 1 — Raise Temperature', moves: [{ name: 'Leg Swing — 3 Directions', planes: ['Sagittal', 'Frontal', 'Transverse'], dose: '10 each dir', desc: 'Forward/back, side-to-side, crossbody with rotation.', cue: "Let the swing take you to end range. Don't muscle it." }] },
      { lbl: 'Phase 2 — Joint Mobilization', moves: [
        { name: "World's Greatest Stretch", planes: ['Multi-plane'], dose: '5 each side', desc: 'Deep lunge, hand inside foot, rotate and reach ceiling, straighten back leg.', cue: 'Move slowly — exploring range, not a PR.' },
        { name: 'Hip 90/90 Rotations', planes: ['Transverse', 'Frontal'], dose: '8 each side', desc: 'Seated, both knees at 90°. Rotate hips side to side.', cue: "Sit tall. Go into the rotation — don't lean away." },
        { name: 'Ankle CARs + Wall Dorsiflexion', planes: ['Multi-plane', 'Sagittal'], dose: '10 + 10 reps', desc: 'Slow ankle circles, then toes 4" from wall, drive knee forward.', cue: "Heel stays down. That's the whole point." },
      ] },
      { lbl: 'Phase 3 — Glute Activation', moves: [{ name: 'Banded Clamshell + Glute Bridge', planes: ['Frontal', 'Sagittal'], dose: '10 each move', desc: 'Light band above knees. 10 clamshells each side, then 10 bridges.', cue: 'On bridges — squeeze hard at top and hold 1 second.' }] },
    ],
  },
  sat: {
    color: '#3ecf82', dur: '10 min', phases: [
      { lbl: 'Phase 1 — CNS Wake-Up', moves: [
        { name: 'Skipping Variations (3 types)', planes: ['Sagittal', 'Frontal', 'Transverse'], dose: '20m each', desc: 'Forward skip, lateral shuffle, carioca.', cue: 'Stay light. Waking up the nervous system.' },
        { name: 'Pogo Jumps', planes: ['Sagittal'], dose: '3 × 10 sec', desc: 'Small rapid jumps using only ankle plantarflexion. Knees nearly straight.', cue: 'Ankles are springs. Minimize ground contact time.' },
      ] },
      { lbl: 'Phase 2 — Hip & Ankle Mobility', moves: [
        { name: 'Hip CARs (standing)', planes: ['Multi-plane'], dose: '5 each dir/side', desc: 'Standing on one leg, draw the largest circle with your raised knee.', cue: 'Go slow. Own every degree. Range not speed.' },
        { name: 'Lateral Lunge + Adductor Rock', planes: ['Frontal', 'Transverse'], dose: '8 each side', desc: 'Wide lateral lunge, rock side to side shifting weight between hips.', cue: 'Non-loaded leg straight, foot flat. Chest stays tall.' },
        { name: 'Ankle Circles + Dorsiflexion', planes: ['Multi-plane', 'Sagittal'], dose: '10 + 10 reps', desc: 'Slow ankle circles then elevated heel dorsiflexion rocking forward.', cue: 'Knee tracks over pinky toe — not caving inward.' },
      ] },
      { lbl: 'Phase 3 — Plyo Ramp-Up', moves: [{ name: 'Progressive Jump Sequence', planes: ['Sagittal', 'Frontal'], dose: '1 sequence', desc: 'Tuck jump ×3 → lateral bound ×4 each → one sub-max box jump.', cue: 'Every landing: quiet feet, knees soft, hips back.' }] },
    ],
  },
  sun: {
    color: '#9d6ef5', dur: '6–7 min', phases: [
      { lbl: 'Phase 1 — Raise Temperature', moves: [{ name: 'Overhead Reach + Lateral Shift', planes: ['Sagittal', 'Frontal'], dose: '30 sec', desc: 'Both arms overhead, shift ribcage side to side.', cue: 'Reach long, not just up. Make yourself taller.' }] },
      { lbl: 'Phase 2 — Joint Mobilization', moves: [
        { name: 'Dead Hang + Shoulder Shrug', planes: ['Sagittal', 'Frontal'], dose: '8 cycles', desc: 'Hang from bar, alternate passive hang with active scapular pack (2 sec hold).', cue: "Packed position is where your pull-up starts. Own it here." },
        { name: 'Thoracic Extension + Rotation', planes: ['Sagittal', 'Transverse'], dose: '8 ext + 4 rot', desc: 'Edge of bench at mid-back. Extend back, then add rotation.', cue: 'Let gravity do the extension. Add rotation after settling.' },
        { name: 'Diagonal Band Pull-Down', planes: ['Transverse', 'Frontal'], dose: '10 each side', desc: 'Band anchored overhead. Pull diagonally across to opposite hip.', cue: 'Drive your elbow to your hip pocket — not straight down.' },
      ] },
      { lbl: 'Phase 3 — Activation', moves: [{ name: 'Band Pull-Apart — Y + W', planes: ['Frontal', 'Transverse'], dose: '12 each pos', desc: 'Standard, then overhead Y, then W at chest height.', cue: 'On Y — lead with pinkies and think armpit forward.' }] },
    ],
  },
};

const PLANE_COLORS = { 'Sagittal': '#f05a1a', 'Frontal': '#3a9de8', 'Transverse': '#3ecf82', 'Multi-plane': '#9d6ef5' };
export { PLANE_COLORS };

export const BLOCK_COLORS = { compound: '#f05a1a', superset: '#3a9de8', finisher: '#9d6ef5' };
