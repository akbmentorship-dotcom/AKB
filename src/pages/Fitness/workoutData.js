// Day-of-week schedule
export const SCHEDULE = {
mon: “basketball”,
tue: “workout”,
wed: “rest”,
thu: “workout”,
fri: “basketball”,
sat: “workout”,
sun: “workout”,
};

// ── BLOCK 1 — Weeks 1–4 | Mechanical Tension ─────────────────────────────────
export const WD = [
{
id: “tue”, lbl: “TUE”, full: “Tuesday”, title: “Upper — Strength”, sub: “Horizontal push & pull · Full gym”,
cv: “#f05a1a”, dim: “var(–orange-dim)”, brd: “var(–orange-border)”, type: “Strength”,
structure: [
{
t: “compound”, lbl: “Primary Compound”,
exs: [{ id: “bench”, name: “Barbell Bench Press”, sets: 4, reps: “4–6”, note: “Start at 70% honest 1RM. Last set AMRAP.” }],
},
{
t: “superset”, lbl: “Superset A — Push / Pull”, note: “No rest between A1+A2. 90 sec after the pair.”,
exs: [
{ id: “wpull”, name: “A1 — Weighted Pull-Up”, sets: 4, reps: “4–6”, note: “Add 10 lbs to start. Belt or DB between feet.” },
{ id: “brow”, name: “A2 — Barbell Row”, sets: 4, reps: “5–7”, note: “Drive elbows back. Brace hard, no jerking.” },
],
},
{
t: “superset”, lbl: “Superset B — Shoulder / Upper Back”, note: “No rest between B1+B2. 90 sec after the pair.”,
exs: [
{ id: “dpress”, name: “B1 — Seated DB Shoulder Press”, sets: 3, reps: “6–8”, note: “Controlled eccentric. No leg drive.” },
{ id: “face_pull”, name: “B2 — Cable Face Pull”, sets: 3, reps: “15–20”, note: “Every week. Non-negotiable for shoulder health.” },
],
},
{
t: “finisher”, lbl: “Finisher — Arms”, note: “Alternate back to back. 60 sec rest.”,
exs: [
{ id: “cgb”, name: “F1 — Close Grip Bench”, sets: 3, reps: “6–8”, note: “Tricep focus. Elbows tucked.” },
{ id: “ezcurl”, name: “F2 — EZ Bar Curl”, sets: 3, reps: “6–8”, note: “No swinging. Full supination at top.” },
],
},
],
},
{
id: “thu”, lbl: “THU”, full: “Thursday”, title: “Lower — Strength”, sub: “Squat & hinge pattern · Full gym”,
cv: “#3a9de8”, dim: “var(–blue-dim)”, brd: “var(–blue-border)”, type: “Strength”,
structure: [
{
t: “compound”, lbl: “Primary Compound”,
exs: [{ id: “squat”, name: “Barbell Back Squat”, sets: 4, reps: “4–6”, note: “Full depth. Start conservative — Week 1 is baseline setting.” }],
},
{
t: “superset”, lbl: “Superset A — Hinge / Knee”, note: “No rest between A1+A2. 90 sec after the pair.”,
exs: [
{ id: “rdl”, name: “A1 — Romanian Deadlift”, sets: 4, reps: “6–8”, note: “Feel the hamstring stretch. Do not ego load.” },
{ id: “leg_press”, name: “A2 — Leg Press”, sets: 3, reps: “8–10”, note: “Feet high for glutes and hams. Full range.” },
],
},
{
t: “superset”, lbl: “Superset B — Single Leg / Hamstring”, note: “No rest between B1+B2. 90 sec after the pair.”,
exs: [
{ id: “lunge”, name: “B1 — Walking Lunges”, sets: 3, reps: “10 each”, note: “Bodyweight Week 1. Add DB when form is locked.” },
{ id: “leg_curl”, name: “B2 — Leg Curl”, sets: 4, reps: “12–15”, note: “Pause at top. Full stretch at bottom.” },
],
},
{
t: “finisher”, lbl: “Finisher — Calves & Core”, note: “Alternate. 60 sec rest.”,
exs: [
{ id: “calf”, name: “F1 — Standing Calf Raise”, sets: 4, reps: “8–10”, note: “2 sec up, pause, 3 sec down. Deliberate.” },
{ id: “deadbug”, name: “F2 — Dead Bug”, sets: 3, reps: “8 slow/side”, note: “Exhale fully at bottom. Anti-extension core.” },
],
},
],
},
{
id: “sat”, lbl: “SAT”, full: “Saturday”, title: “Upper — Hypertrophy”, sub: “Volume & metabolic stress · Full gym”,
cv: “#c45fc4”, dim: “var(–purple-dim)”, brd: “var(–purple-border)”, type: “Hypertrophy”,
structure: [
{
t: “compound”, lbl: “Primary Compound”,
exs: [{ id: “incdb”, name: “Incline DB Press”, sets: 4, reps: “10–12”, note: “Squeeze at top. Full stretch at bottom.” }],
},
{
t: “superset”, lbl: “Superset A — Push / Pull”, note: “No rest between A1+A2. 60–90 sec after the pair.”,
exs: [
{ id: “cable_row”, name: “A1 — Cable Row (Neutral Grip)”, sets: 4, reps: “12–15”, note: “Full stretch on every rep. Control the eccentric.” },
{ id: “lat_raise”, name: “A2 — Lateral Raise”, sets: 4, reps: “15–20”, note: “Light and controlled. No swinging.” },
],
},
{
t: “superset”, lbl: “Superset B — Back / Shoulder Health”, note: “No rest between B1+B2. 60–90 sec after the pair.”,
exs: [
{ id: “csr”, name: “B1 — Chest-Supported Row”, sets: 3, reps: “12–15”, note: “No momentum. Squeeze hard at top.” },
{ id: “face_pull2”, name: “B2 — Face Pull”, sets: 3, reps: “20”, note: “Every week. Shoulder health. Never skip.” },
],
},
{
t: “finisher”, lbl: “Finisher — Arms”, note: “Alternate. 60 sec rest.”,
exs: [
{ id: “pushdown”, name: “F1 — Cable Tricep Pushdown”, sets: 3, reps: “15–20”, note: “Full extension at bottom.” },
{ id: “incurl”, name: “F2 — Incline DB Curl”, sets: 3, reps: “12–15”, note: “Full stretch at bottom. Slow eccentric.” },
],
},
],
},
{
id: “sun”, lbl: “SUN”, full: “Sunday”, title: “Lower — Hypertrophy”, sub: “Volume & metabolic stress · Full gym”,
cv: “#4caf82”, dim: “var(–green-dim)”, brd: “var(–green-border)”, type: “Hypertrophy”,
structure: [
{
t: “compound”, lbl: “Primary Compound”,
exs: [{ id: “legp”, name: “Leg Press”, sets: 4, reps: “12–15”, note: “Controlled descent. Feet high for posterior chain.” }],
},
{
t: “superset”, lbl: “Superset A — Hinge / Single Leg”, note: “No rest between A1+A2. 60–90 sec after the pair.”,
exs: [
{ id: “dbrdl”, name: “A1 — DB Romanian Deadlift”, sets: 4, reps: “12–15”, note: “Hamstring emphasis. Feel the stretch every rep.” },
{ id: “bss”, name: “A2 — Bulgarian Split Squat”, sets: 3, reps: “10–12 each”, note: “Bodyweight or light DB Week 1. Control the descent.” },
],
},
{
t: “superset”, lbl: “Superset B — Isolation”, note: “No rest between B1+B2. 60–90 sec after the pair.”,
exs: [
{ id: “lext”, name: “B1 — Leg Extension”, sets: 3, reps: “15–20”, note: “Terminal extension. Pause at top.” },
{ id: “lcurl”, name: “B2 — Leg Curl”, sets: 4, reps: “12–15”, note: “Pause at top. Full stretch at bottom.” },
],
},
{
t: “finisher”, lbl: “Finisher — Calves & Core”, note: “Alternate. 60 sec rest.”,
exs: [
{ id: “calf2”, name: “F1 — Seated Calf Raise”, sets: 4, reps: “15–20”, note: “Slow and deliberate. Full range.” },
{ id: “deadbug2”, name: “F2 — Dead Bug”, sets: 3, reps: “8 slow/side”, note: “Exhale fully at bottom. Protect the low back.” },
],
},
],
},
];

// ── ACTIVE WARMUP PROTOCOLS — No static holds, moving through all planes ──────
export const WU = {
tue: {
color: “#f05a1a”, dur: “10 min”, phases: [
{
lbl: “Phase 1 — Full Body Activation”, moves: [
{ name: “World”s Greatest Stretch”, planes: [“Sagittal”, “Transverse”], dose: “5 each side”, desc: “Lunge position, hand inside foot, rotate and reach to ceiling.”, cue: “Rotate and reach — do not just hold the position.” },
{ name: “Thoracic Open Books”, planes: [“Transverse”], dose: “8 each side”, desc: “Side-lying, top knee bent on floor. Rotate upper arm open to ceiling.”, cue: “Follow your hand with your eyes. Hips stay stacked.” },
],
},
{
lbl: “Phase 2 — Joint Mobilization”, moves: [
{ name: “Half-Kneeling Thoracic Rotation w/ Reach”, planes: [“Transverse”, “Sagittal”], dose: “8 each side”, desc: “Half-kneeling, reach one arm long and rotate through the thoracic spine.”, cue: “Reach long, return controlled. Lock the pelvis.” },
{ name: “Quadruped Rockback + Thread the Needle”, planes: [“Sagittal”, “Transverse”], dose: “6 each side”, desc: “Rock back to heels first, then thread one arm under and rotate open.”, cue: “Rock back first, then rotate. Two separate movements.” },
{ name: “Band Pull-Apart w/ Overhead Arc”, planes: [“Frontal”, “Sagittal”], dose: “15 reps”, desc: “Pull band apart, arc overhead, return — one continuous fluid motion.”, cue: “Pull apart, arc overhead, return. No stopping.” },
],
},
{
lbl: “Phase 3 — Core & Shoulder Activation”, moves: [
{ name: “Dead Bug w/ Contralateral Reach”, planes: [“Sagittal”], dose: “8 each side”, desc: “Lying, extend opposite arm and leg simultaneously. Exhale at bottom.”, cue: “Exhale fully at the bottom. Low back stays flat.” },
{ name: “Glute Bridge w/ March”, planes: [“Sagittal”], dose: “10 each side”, desc: “Hold the bridge, alternate driving knees up.”, cue: “Hold the bridge height. Do not let the hips drop.” },
{ name: “Ankle CARs”, planes: [“Multi-plane”], dose: “8 each side”, desc: “Seated or standing. Full controlled ankle circle, slow and deliberate.”, cue: “Full circle, slow. Own every degree of range.” },
],
},
],
},
thu: {
color: “#3a9de8”, dur: “10 min”, phases: [
{
lbl: “Phase 1 — Full Body Activation”, moves: [
{ name: “World”s Greatest Stretch”, planes: [“Sagittal”, “Transverse”], dose: “5 each side”, desc: “Lunge position, hand inside foot, rotate and reach to ceiling.”, cue: “Rotate and reach — do not just hold the position.” },
{ name: “Hip 90/90 Transitions”, planes: [“Frontal”, “Transverse”], dose: “10 slow”, desc: “Seated, both knees at 90°. Rotate hips and transition side to side.”, cue: “Drive the knee actively toward the floor. Own the range.” },
],
},
{
lbl: “Phase 2 — Hip & Ankle Mobilization”, moves: [
{ name: “Lateral Lunge w/ Hip Circle at Bottom”, planes: [“Frontal”, “Transverse”], dose: “6 each side”, desc: “Step wide into a lateral lunge, circle the hip at the bottom, drive back up.”, cue: “Sink, circle the hip fully, then drive back up.” },
{ name: “Ankle CARs”, planes: [“Multi-plane”], dose: “8 each side”, desc: “Full controlled ankle circle. Slow and deliberate.”, cue: “Full circle, slow, deliberate. Heel stays grounded.” },
],
},
{
lbl: “Phase 3 — Posterior Chain Activation”, moves: [
{ name: “Dead Bug w/ Contralateral Reach”, planes: [“Sagittal”], dose: “8 each side”, desc: “Extend opposite arm and leg. Exhale fully at the bottom.”, cue: “Exhale fully. Low back pressed to floor the whole time.” },
{ name: “Glute Bridge w/ March”, planes: [“Sagittal”], dose: “10 each side”, desc: “Hold the bridge, alternate driving knees up toward chest.”, cue: “Do not let the hips drop between reps. Stay up.” },
],
},
],
},
sat: {
color: “#c45fc4”, dur: “10 min”, phases: [
{
lbl: “Phase 1 — Full Body Activation”, moves: [
{ name: “World”s Greatest Stretch”, planes: [“Sagittal”, “Transverse”], dose: “5 each side”, desc: “Lunge, hand inside foot, rotate and reach to ceiling.”, cue: “Rotate and reach — do not just hold the position.” },
{ name: “Thoracic Open Books”, planes: [“Transverse”], dose: “8 each side”, desc: “Side-lying rotation. Top arm opens to ceiling.”, cue: “Follow your hand with your eyes.” },
],
},
{
lbl: “Phase 2 — Upper Body Mobilization”, moves: [
{ name: “Half-Kneeling Thoracic Rotation w/ Reach”, planes: [“Transverse”, “Sagittal”], dose: “8 each side”, desc: “Half-kneeling, reach and rotate through the thoracic spine.”, cue: “Reach long, return controlled.” },
{ name: “Band Pull-Apart w/ Overhead Arc”, planes: [“Frontal”, “Sagittal”], dose: “15 reps”, desc: “Pull apart, arc overhead, return — one continuous motion.”, cue: “No stopping. Fluid arc from front to overhead and back.” },
{ name: “Ankle CARs”, planes: [“Multi-plane”], dose: “8 each side”, desc: “Full controlled ankle circle.”, cue: “Full circle, slow, deliberate.” },
],
},
{
lbl: “Phase 3 — Shoulder & Core Activation”, moves: [
{ name: “Quadruped Rockback + Thread the Needle”, planes: [“Sagittal”, “Transverse”], dose: “6 each side”, desc: “Rock back to heels, then thread one arm under and rotate open.”, cue: “Rock back first, then rotate. Two movements.” },
{ name: “Dead Bug w/ Contralateral Reach”, planes: [“Sagittal”], dose: “8 each side”, desc: “Opposite arm and leg. Exhale at the bottom.”, cue: “Exhale fully. Low back stays flat throughout.” },
{ name: “Glute Bridge w/ March”, planes: [“Sagittal”], dose: “10 each side”, desc: “Hold the bridge, alternate knee drives.”, cue: “Hips stay level. March with control.” },
],
},
],
},
sun: {
color: “#4caf82”, dur: “10 min”, phases: [
{
lbl: “Phase 1 — Full Body Activation”, moves: [
{ name: “World”s Greatest Stretch”, planes: [“Sagittal”, “Transverse”], dose: “5 each side”, desc: “Lunge, hand inside foot, rotate and reach to ceiling.”, cue: “Rotate and reach — do not just hold.” },
{ name: “Hip 90/90 Transitions”, planes: [“Frontal”, “Transverse”], dose: “10 slow”, desc: “Rotate hips and transition side to side.”, cue: “Drive the knee to the floor actively.” },
],
},
{
lbl: “Phase 2 — Hip & Lower Body Mobilization”, moves: [
{ name: “Lateral Lunge w/ Hip Circle at Bottom”, planes: [“Frontal”, “Transverse”], dose: “6 each side”, desc: “Wide lateral lunge, circle the hip at the bottom, drive back up.”, cue: “Sink, circle the hip, drive back up.” },
{ name: “Ankle CARs”, planes: [“Multi-plane”], dose: “8 each side”, desc: “Full controlled ankle circle.”, cue: “Full circle, slow, deliberate.” },
],
},
{
lbl: “Phase 3 — Posterior Chain Activation”, moves: [
{ name: “Dead Bug w/ Contralateral Reach”, planes: [“Sagittal”], dose: “8 each side”, desc: “Opposite arm and leg. Exhale at the bottom.”, cue: “Exhale fully. Low back stays flat.” },
{ name: “Glute Bridge w/ March”, planes: [“Sagittal”], dose: “10 each side”, desc: “Hold the bridge, alternate knee drives.”, cue: “Hips stay up. Do not drop between reps.” },
{ name: “Ankle CARs”, planes: [“Multi-plane”], dose: “8 each side”, desc: “Full controlled ankle circle.”, cue: “Own every degree. Slow is the point.” },
],
},
],
},
};

// ── WEDNESDAY MOBILITY SESSION ────────────────────────────────────────────────
export const MOBILITY_WED = [
{ name: “Spinal Wave (standing)”, reps: “10”, plane: “Sagittal”, cue: “Segment every vertebra up and down.” },
{ name: “World”s Greatest Stretch w/ Rotation”, reps: “6 each side”, plane: “Multi-plane”, cue: “Full reach at top. Explore the range.” },
{ name: “Deep Squat Hip CARs”, reps: “5 each side”, plane: “Transverse”, cue: “In the bottom of a squat, circle the hip. Own every degree.” },
{ name: “Tall Kneeling Thoracic CARs”, reps: “5 each side”, plane: “Transverse”, cue: “Lock the pelvis. Move only the thoracic spine.” },
{ name: “Bear Crawl Forward / Backward”, reps: “20 yds each”, plane: “Sagittal”, cue: “Contralateral. Stay low. Hips level.” },
{ name: “Crab Reach”, reps: “8 each side”, plane: “Transverse + Frontal”, cue: “Drive the hip up, reach overhead. Full extension.” },
{ name: “Ankle CARs + Heel Raises”, reps: “8 each side”, plane: “Multi-plane”, cue: “Full circle then 10 slow raises. Own the ankle.” },
{ name: “Loaded Hip Airplane”, reps: “6 each side”, plane: “Transverse”, cue: “Single leg. Control the rotation. No compensation.” },
];

// ── ACTIVE COOLDOWN PROTOCOLS — No static holds ───────────────────────────────
export const COOLDOWN = {
upper: [
{ name: “Arm Circle Progressions”, reps: “10 each direction”, cue: “Small to large, then cross-body. Full range.” },
{ name: “Shoulder CARs”, reps: “5 each side”, cue: “Full controlled rotation of the shoulder joint. Slow.” },
{ name: “Lat Bias Cat-Cow”, reps: “10”, cue: “Reach long at the top, tuck hard at the bottom.” },
{ name: “Neck CARs”, reps: “5 each direction”, cue: “Slow, full range. No compensation through the shoulders.” },
{ name: “Box Breathing”, reps: “3 rounds”, cue: “4 in / 4 hold / 4 out. Non-negotiable. Drops cortisol.” },
],
lower: [
{ name: “Hip CARs Standing”, reps: “5 each side”, cue: “Full circle — maximize range without losing the pelvis.” },
{ name: “Reverse Lunge w/ Overhead Reach”, reps: “6 each side”, cue: “Front plane on the way down, sagittal on the reach.” },
{ name: “Lateral Step w/ Hip Hinge”, reps: “6 each side”, cue: “Step out, hinge, feel the inner groin load.” },
{ name: “Knee Circles Standing”, reps: “8 each side”, cue: “Hands on knees, draw full deliberate circles.” },
{ name: “Box Breathing”, reps: “3 rounds”, cue: “4 in / 4 hold / 4 out. Non-negotiable.” },
],
};

const PLANE_COLORS = {
“Sagittal”: “#f05a1a”,
“Frontal”: “#3a9de8”,
“Transverse”: “#3ecf82”,
“Multi-plane”: “#9d6ef5”,
“Transverse + Frontal”: “#c45fc4”,
};
export { PLANE_COLORS };

export const BLOCK_COLORS = { compound: “#f05a1a”, superset: “#3a9de8”, finisher: “#9d6ef5” };
