import { useState, useEffect } from "react";

const PILLARS = [
  { day: "Mon", label: "Parenting", icon: "👶", color: "#f05a1a" },
  { day: "Tue", label: "Marriage", icon: "💍", color: "#e84393" },
  { day: "Wed", label: "Entrepreneurship", icon: "💼", color: "#3a9de8" },
  { day: "Thu", label: "Fitness", icon: "💪", color: "#3ecf82" },
  { day: "Fri", label: "Faith", icon: "✝️", color: "#9d6ef5" },
  { day: "Sat/Sun", label: "Rest / Review", icon: "🔄", color: "#555" },
];

const BUCKETS = [
  { id: "feels", label: "He Feels It", sub: "The Tension", color: "#e84040", emoji: "🔴", desc: "Mirrors the gap your guy is already living. The unnamed weight. You don't explain it — you reflect it back so perfectly he stops scrolling." },
  { id: "sees", label: "He Sees It", sub: "The Pursuit", color: "#f5a623", emoji: "🟡", desc: "You living the aligned life in real time. Not highlights — the unglamorous daily build. He follows because he wants what you have." },
  { id: "gets", label: "He Gets It", sub: "The Tools", color: "#3ecf82", emoji: "🟢", desc: "Practical, specific, grounded in your story. Not theory. Every tools post ends with a relational pull — not just a tip." },
];

const FORMATS = [
  { label: "Story Reel (3-clip arc)", type: "standard", desc: "Setup → Turn → Payoff. 2–3x per week. Highest emotional impact." },
  { label: "Standard Reel", type: "standard", desc: "Single hook, single message. Most common format. B-roll + text on screen." },
  { label: "Static Image", type: "standard", desc: "Brand-defining moments. High-quality single image or quote graphic." },
  { label: "Carousel", type: "standard", desc: "Checklist, list, or educational content. Great for saves and shares." },
  { label: "Before / After 🧪", type: "experiment", desc: "Two clips or text labels showing a clear contrast. Drives saves + DMs." },
  { label: "Split Screen 🧪", type: "experiment", desc: "Two simultaneous clips showing tension. Stops the scroll visually. Trial first." },
  { label: "Checklist / Audit 🧪", type: "experiment", desc: "✅ / ❌ list format. Screenshot content — gets saved and sent between friends." },
  { label: "Bad / Good / Best 🧪", type: "experiment", desc: "Three-tier progression. Gets screenshotted and shared between men." },
];

const FILMING_SCHEDULE = [
  {
    week: "Week 1", days: "Days 12–18", theme: "Return & Tension",
    film: "Desk side angle (multiple clips) · Gym/lifting shots · Family outdoor walk candid · You + son eye-level · Morning notebook close-up · Speaking event clip · Still/reflective face shot",
    edit: "Tue — Edit & schedule Days 12, 13, 14\nWed — Edit & schedule Days 15, 16, 17, 18",
    notes: "Day 13 is your trial reel. Day 15 format experiment goes straight in.",
  },
  {
    week: "Week 2", days: "Days 19–25", theme: "Pursuit & Tools",
    film: "You + son candid (morning light) · You + wife candid (not staged) · Morning routine (coffee, notebook) · Desk in two setups (Before/After energy) · Outdoor walking · Close-up face shot",
    edit: "Tue — Edit & schedule Days 19, 20, 21\nWed — Edit & schedule Days 22, 23, 24, 25",
    notes: "Day 21 split screen runs as trial first. Day 24 Bad/Good/Best can be text-only — no extra filming.",
  },
  {
    week: "Week 3", days: "Days 26–32", theme: "Legacy & Faith",
    film: "You + son quiet moment · Speaking event clip (already have) · Fresh desk clip · Outdoor early morning (faith angle) · Bible/journal close-up · You + wife candid · Gym clip",
    edit: "Tue — Edit & schedule Days 26, 27, 28\nWed — Edit & schedule Days 29, 30, 31, 32",
    notes: "Day 28 checklist built in Canva — no filming. Day 31 before/after runs as trial.",
  },
  {
    week: "Week 4", days: "Days 33–41", theme: "Momentum & Identity",
    film: "Family joyful outdoor clip · You + wife real conversation clip · You walking strong and calm · Montage clips (pull from all 4 weeks if possible) · Strongest single image for Day 41 static",
    edit: "Tue — Edit & schedule Days 33, 34, 35, 36\nFri — Edit & schedule Days 37, 38, 39, 40, 41",
    notes: "Day 37 split screen goes straight to main feed. Day 40 runs main + trial simultaneously. Day 41 is brand-defining — choose your best image.",
  },
];

const DAYS = [
  {
    num: 12, title: "Return & Showing Up", format: "Standard Reel", bucket: "sees", pillar: "Entrepreneurship",
    broll: ["You at your desk — side angle, wedding ring visible, focused and present", "You walking with your son outdoors — candid, not staged", "Close-up of your hand writing in your notebook (no face needed)"],
    hooks: [
      { text: "Day 12. Missed a few days. Showing up anyway.", why: "Breaks the perfect-streak expectation. Makes you human. Your guy has missed days too." },
      { text: "Consistency doesn't mean perfect. It means you keep coming back.", why: "Reframes failure as part of the process. Emotionally disarming." },
      { text: "For the man who stopped and started again — this one's for you.", why: "Calls out your guy directly. Makes him feel seen before you say anything else." },
    ],
    caption: "Day 12. The gap between knowing and doing is where most guys stay. I'm not staying there. Back to the build.",
    tags: "#entrepreneurdad #fatherhood #lifeofchoice #onlineincome #intentionalliving",
    trials: ["Same B-roll. Hook: \"The easiest thing to do was quit. I didn't.\" — Outcome hook.", "Same B-roll. Text only: \"Day 12\" — no explanation. Let the silence speak."],
  },
  {
    num: 13, title: "Why My Wife Is Still Working", format: "Story Reel (3-clip arc)", bucket: "sees", pillar: "Entrepreneurship", star: true,
    broll: ["Family clip first — you, wife, and son outdoors together (candid, morning light)", "Desk side angle — you working, notebook open, ring visible", "Speaking event clip (already have) — you in front of a room", "You writing in notebook — close-up, intentional"],
    arc: { setup: "\"I've made money online for 8 years. So why is my wife still working?\"", turn: "\"I gave myself 6 months to change that. Month 2. Finally in the right rooms.\"", payoff: "\"I stopped figuring it out alone. That changed everything.\"" },
    hooks: [
      { text: "I've made money online for 8 years. So why is my wife still working?", why: "Instant intrigue. Honest contradiction that stops the scroll." },
      { text: "8 years. Still not there. Here's what changed.", why: "The word 'still' creates immediate tension. Short and punchy." },
      { text: "I knew how to make money. I just didn't know how to make enough.", why: "Vulnerability loop — he admitted the gap, now they want the resolution." },
    ],
    caption: "Most dads know what they want. They just don't know where to start. Find someone living the life you want — then find out how they got there. Month 2 of 6. Following the whole build. 👇",
    tags: "#onlineincome #workfromhome #financialfreedom #entrepreneurdad #retireyourwife #6months",
    trials: ["Same clips. Swap hook to: \"POV: You gave yourself 6 months to retire your wife with online income.\"", "Same clips. Lead with speaking event clip instead of family. Test credibility-first vs emotion-first."],
  },
  {
    num: 14, title: "Are You Building The Life You Want?", format: "Standard Reel", bucket: "feels", pillar: "Parenting",
    broll: ["You walking outdoors holding your son's hand — candid, natural light", "You watching your son play — you're present, not on your phone", "Wide shot of you two in a park or backyard — life feeling captured, not posed"],
    hooks: [
      { text: "88% of dads are building a life their kids will inherit — not one they chose.", why: "Emotionally charged stat-style hook. Creates urgency without shame." },
      { text: "For the dad who's winning at work and losing at home.", why: "Hyper-specific. If this is him, he stops immediately." },
      { text: "The life you're building right now — is it the one you actually want?", why: "Open question. Creates internal tension. He can't scroll past it." },
    ],
    caption: "Most dads don't choose their life. They just end up in it. Work harder. Provide more. Be present somehow. The problem isn't effort. It's direction. Are you building the life you want or just a busy one?",
    tags: "#intentionalliving #fatherhoodmotivation #purposedrivenlife #presentdad #lifeofchoice #freedomdad",
    trials: ["Same B-roll. Hook: \"The moment I realized I was building a life I didn't choose.\" — Storytelling hook.", "Same B-roll. Text only, no music: \"Are you living on purpose or by default?\" — Minimalist version."],
  },
  {
    num: 15, title: "Before / After", format: "Before / After 🧪", bucket: "gets", pillar: "Entrepreneurship", experiment: true,
    broll: ["Desk clip A — you alone, head down, no clarity or direction visible (the 'before' energy)", "Desk clip B — same desk, notebook open, ring visible, posture open and intentional (the 'after' energy)", "Film both in the same Monday session — two different setups of the same desk"],
    script: "BEFORE: \"I spent 8 years figuring it out alone. No mentor. No room. Just me and the internet.\"\nAFTER: \"Then I got around people already living what I wanted. That one shift changed everything — business, family, fitness.\"\nNo voiceover needed. Text on screen only.",
    caption: "8 years alone vs. one conversation with the right person. The gap wasn't strategy. It wasn't effort. It was proximity. Who are you getting close to right now?",
    tags: "#mentorship #entrepreneurdad #beforeandafter #lifeofchoice #onlineincome #growthmindset",
    hooks: [],
    trials: [],
  },
  {
    num: 16, title: "Discipline Without Direction", format: "Story Reel (3-clip arc)", bucket: "feels", pillar: "Fitness", star: true,
    broll: ["Gym clip — you lifting, focused, intense (no smiling, real effort)", "Desk clip — same focused energy but different context (shirt change if possible)", "Still shot or slow zoom on your face — quiet, reflective"],
    arc: { setup: "\"You wake up at 5am. You train hard. You show up.\"", turn: "\"But at the end of the day — does your family feel it?\"", payoff: "\"Discipline without direction is just exhaustion.\"" },
    hooks: [
      { text: "There are 2 types of dads. The ones who use their kids as an excuse. And the ones who use them as fuel.", why: "Polarizing. Forces the viewer to pick a side." },
      { text: "For the dad who's disciplined in the gym but chaotic everywhere else.", why: "Hyper-specific. If he lifts and has a messy home life — he stops." },
      { text: "The most disciplined men I know are failing at the thing that matters most.", why: "Creates tension. He needs to watch to find out what the thing is." },
    ],
    caption: "Discipline is easy to fake. You can be disciplined at the gym. Disciplined at work. And still completely absent from the life you're supposed to be building. Discipline in the right direction is rare. That's what we're after.",
    tags: "#dadfitness #5amclub #discipline #fatherhoodmotivation #dadlife #intentionaldad #presentdad",
    trials: ["Same clips reversed — desk first, gym second. Test work-to-fitness vs fitness-to-work story.", "Same B-roll. Hook: \"The problem isn't that you're lazy. It's that you're disciplined in the wrong direction.\""],
  },
  {
    num: 17, title: "Checklist / Audit — Marriage Alignment", format: "Checklist / Audit 🧪", bucket: "feels", pillar: "Marriage", experiment: true,
    broll: ["Carousel slides or Reel with text beats — high contrast, bold, readable at a glance", "No extra filming needed — can be built entirely in Canva on edit day"],
    script: "\"5 signs your marriage is aligned — not just surviving:\"\n✅ You have a shared vision of what your life looks like in 3 years\n✅ You talk about the future more than you argue about the present\n✅ She knows your why — not just your what\n✅ Your schedule reflects both of your priorities\n✅ You're building something together, not just beside each other\nFinal beat: \"Alignment isn't a feeling. It's a conversation you keep having.\"",
    caption: "The most important partnership in your life isn't your business. It's your marriage. Most couples have a plan for the bills. Almost none have a plan for the life. Which of these do you need to work on? 👇",
    tags: "#marriagegoals #intentionalmarriage #husbandlife #alignedliving #lifeofchoice #entrepreneurcouple",
    hooks: [],
    trials: [],
  },
  {
    num: 18, title: "Month 2 Real Update", format: "Standard Reel", bucket: "sees", pillar: "Entrepreneurship",
    broll: ["Desk clip — you working, real environment, side or slightly overhead angle", "Close-up of notebook — open to a real page you've been writing in", "Quick outdoor clip — you walking alone, thinking (30 seconds is enough)"],
    hooks: [
      { text: "Month 2. Here's what's actually happening.", why: "Raw update hook. Followers are waiting for this. Cold audiences are curious." },
      { text: "I thought month 2 would feel different. It does — just not how I expected.", why: "Vulnerability loop. Honest. Creates emotional investment." },
      { text: "No highlight reel. No wins only. Here's the real month 2 update.", why: "Raw honesty is the pattern interrupt in a world of polished content." },
    ],
    caption: "Month 2 of 6. Here's what's true right now: The work is real. The progress is slower than I wanted. And I'm more clear on the path than I've ever been. That's what getting in the right rooms does. Following the whole build. 👇",
    tags: "#entrepreneurjourney #month2 #buildingonline #onlineincome #6monthchallenge #freedomlifestyle",
    trials: ["Same B-roll. Reframe as a question: \"What does month 2 of chasing something big actually feel like?\"", "Same B-roll. Lead with the hardest truth of month 2. What didn't go as planned? That's the hook."],
  },
  {
    num: 19, title: "What My Son Actually Needs", format: "Story Reel (3-clip arc)", bucket: "feels", pillar: "Parenting", star: true,
    broll: ["Your son playing — eye level, candid, morning light if possible", "You watching him from a few feet away — you're present, not performing", "Quiet close shot of your face — still, reflective (no words needed from you in this clip)"],
    arc: { setup: "\"He doesn't need my wins.\"", turn: "\"He needs to see me lose and still show up.\"", payoff: "\"That's the legacy. Not the business. The behavior.\"" },
    hooks: [
      { text: "The most important thing I will ever teach my son has nothing to do with money.", why: "Emotionally disarming. Every dad stops for this." },
      { text: "I used to tie my worth to what I accomplished. Then my son looked at me and I realized something.", why: "Personal revelation loop. Vulnerable and specific." },
      { text: "For the dad who worries he's not doing enough — you need to hear this.", why: "Speaks directly to his deepest fear. Names the thing he carries alone." },
    ],
    caption: "My son doesn't need me to be perfect. He needs me to be present. He needs to see me fail and get back up. He needs to know his value isn't tied to his output. Because I'm still learning that myself.",
    tags: "#legacydad #fatherhoodmotivation #intentionaldad #dadson #raisingboys #presentdad #lifeofchoice",
    trials: ["Same B-roll. Lead with: \"88% of men receive their first flowers at their funeral.\" Then pivot to legacy.", "Reframe for marriage angle: \"The man your kids become starts with the husband you are right now.\""],
  },
  {
    num: 20, title: "The One Morning Question", format: "Standard Reel", bucket: "gets", pillar: "Faith",
    broll: ["Morning routine — coffee being poured or in hand (close-up works great)", "Notebook open on a table — pen in hand, writing or about to write", "You sitting quietly before the house wakes up — window light, calm energy"],
    hooks: [
      { text: "The one question I ask every morning that keeps me building the right thing.", why: "Promises a simple, repeatable tool. High save rate." },
      { text: "Before I open my phone. Before I check anything. I ask myself this.", why: "Creates intrigue through a ritual reveal." },
      { text: "Most men start their day reacting. This one question makes you intentional.", why: "Contrasts reactive vs intentional living." },
    ],
    caption: "Every morning before anything else: \"Am I building the life I want, or just surviving the day?\" Some days the answer is uncomfortable. But that discomfort is the compass. What's your first question every morning? Drop it below. 👇",
    tags: "#morningroutine #intentionalliving #dailyhabits #entrepreneurmindset #purposedrivenlife #dadmorning",
    trials: ["Same B-roll. Turn it into a list: \"3 questions I ask every morning to make sure I'm building the right life.\"", "Same B-roll. Reframe around evening: \"The one question I ask before I go to sleep.\" — Test morning vs night."],
  },
  {
    num: 21, title: "Split Screen — Present vs. Absent", format: "Split Screen 🧪", bucket: "feels", pillar: "Parenting", experiment: true, trialFirst: true,
    broll: ["LEFT SIDE: You at your desk — head down, clearly working, no eye contact with camera", "RIGHT SIDE: Your son playing alone in the background — same room, same moment", "Film both angles in one session — set up camera once for each side", "No words needed for the first 3 seconds — let the visual tension land first"],
    script: "No text for 3 seconds.\nLEFT label: \"What I told myself I was doing\"\nRIGHT label: \"What he saw\"\nFinal beat (full screen): \"The most important meeting of my day is the one I keep cancelling.\"",
    caption: "I wasn't absent. I was right there. Just not present. There's a difference. And my son knows it before I do.",
    tags: "#presentdad #intentionaldad #splitscreen #fatherhoodmotivation #lifeofchoice #dadson",
    hooks: [],
    trials: [],
  },
  {
    num: 22, title: "What I'm Actually Building This For", format: "Standard Reel", bucket: "feels", pillar: "Faith",
    broll: ["You alone outdoors — walking, quiet, early morning or golden hour light", "Notebook open — a prayer, a verse, or a line you wrote that week", "Overhead desk shot — Bible or journal open alongside your work notebook"],
    hooks: [
      { text: "I used to build for the income. Now I build for something bigger than me.", why: "Shifts the frame from hustle to purpose." },
      { text: "The moment I stopped asking 'what do I want' and started asking 'what am I called to' — everything changed.", why: "Faith-meets-entrepreneurship angle. Deeply personal." },
      { text: "For the man who's grinding but still feels empty — this might be why.", why: "Names the unnamed weight. Your guy carries this and no one talks about it." },
    ],
    caption: "The business is a vehicle. Not the destination. I'm building toward something my kids will feel long after I'm gone. That's what keeps me showing up when it's slow.",
    tags: "#faithandbusiness #christianentrepreneur #purposedrivenlife #lifeofchoice #intentionalliving #legacy",
    trials: ["Same B-roll. Lead with a specific Bible verse that anchors the post. Let the verse be the hook.", "Same B-roll. Reframe for the non-faith audience: \"The man who knows his why is unstoppable.\""],
  },
  {
    num: 23, title: "What She Actually Needs", format: "Standard Reel", bucket: "sees", pillar: "Marriage",
    broll: ["You and your wife — candid moment, not staged (walking, talking, laughing in the kitchen)", "You two sitting together — she doesn't need to be looking at the camera", "You alone at desk — wedding ring clearly visible, intentional shot"],
    hooks: [
      { text: "My wife doesn't need a bigger house. She needs a more present husband.", why: "Simple contrast that lands hard. Every man understands this tension." },
      { text: "I was providing everything. And still missing the point.", why: "Honest and disarming. He's been there." },
      { text: "For the husband who's doing everything right and still getting it wrong.", why: "Names the confusion without blame. He stops because it's him." },
    ],
    caption: "She didn't marry the income. She married me. The version of me that was present, curious, and all in. Building the income is part of the plan. But so is being the man she chose.",
    tags: "#intentionalmarriage #husbandlife #marriagegoals #presenthusband #lifeofchoice #entrepreneurcouple",
    trials: ["Same B-roll. Reframe: \"3 things I stopped doing that changed our marriage.\" — List format.", "Same B-roll. Lead with the wife clip first. Let her presence be the hook before any text."],
  },
  {
    num: 24, title: "Bad / Good / Best — Presence", format: "Bad / Good / Best 🧪", bucket: "gets", pillar: "Parenting", experiment: true,
    broll: ["3 short clips OR text-only beats over a single desk clip — no extra filming needed", "If using clips: Clip 1 — you distracted/on phone near son. Clip 2 — you present but surface level. Clip 3 — you fully engaged, eye level with him", "Each beat labeled BAD / GOOD / BEST — keep each under 3 seconds"],
    script: "BAD: \"Being physically present but mentally elsewhere.\"\nGOOD: \"Putting the phone down when he walks in the room.\"\nBEST: \"Getting on the floor. His level. His world. Fully there.\"\nFinal beat: \"Most dads are stuck between BAD and GOOD. BEST is a decision, not a feeling.\"",
    caption: "Presence isn't a personality trait. It's a practice. BAD is easy. GOOD feels like enough. BEST is where the legacy gets built. Which one are you in right now? 👇",
    tags: "#intentionaldad #presentdad #fatherhoodmotivation #lifeofchoice #dadson #raisingboys",
    hooks: [],
    trials: [],
  },
  {
    num: 25, title: "The Week 2 Build Update", format: "Standard Reel", bucket: "sees", pillar: "Entrepreneurship",
    broll: ["Morning routine clip — coffee, notebook, early quiet (sets the tone)", "Desk clip — you in work mode, real and unglamorous", "One candid family clip — you + wife or son, showing the integration"],
    hooks: [
      { text: "Week 2. Here's what's actually different.", why: "Continuation hook. Your followers want the update. New viewers get pulled in." },
      { text: "Nobody tells you how slow the beginning actually feels.", why: "Honest tension. He's in a beginning somewhere. He stops." },
      { text: "I don't share this for the wins. I share it so you know what it actually looks like.", why: "Authenticity hook. Disarms the highlight reel expectation." },
    ],
    caption: "Week 2. Still building. Still showing up. The income hasn't changed yet. The belief has. And belief is where everything starts. Following the whole build? 👇",
    tags: "#entrepreneurjourney #buildingonline #onlineincome #6monthchallenge #lifeofchoice #freedomlifestyle",
    trials: ["Same B-roll. Reframe: \"What I wish someone told me before week 2 of building online.\"", "Same B-roll. Lead with the hardest moment of the week. Honesty is the hook."],
  },
  {
    num: 26, title: "He's Watching How I Handle What I Don't Win", format: "Story Reel (3-clip arc)", bucket: "feels", pillar: "Parenting", star: true,
    broll: ["Your son playing quietly — candid, you watching from a distance", "You watching him — still, present, not performing anything", "Quiet close shot — your face, reflective, no forced expression"],
    arc: { setup: "\"He doesn't need my wins.\"", turn: "\"He needs to see me lose and still show up.\"", payoff: "\"That's the legacy. Not the business. The behavior.\"" },
    hooks: [
      { text: "My son is not watching what I achieve. He's watching how I handle what I don't.", why: "Reframes legacy from outcomes to behavior. Emotionally devastating in the best way." },
      { text: "I used to think building a legacy meant building a business. My son taught me otherwise.", why: "Personal revelation structure. Vulnerable." },
      { text: "For the father who's putting pressure on himself to be more — this will reset you.", why: "Offers relief. Your guy is exhausted from trying to be everything." },
    ],
    caption: "Everything I'm building right now is for him. But not in the way I used to think. He doesn't need the money. He needs to watch his dad decide something is hard — and do it anyway. I'm still learning that myself. And that's okay.",
    tags: "#legacydad #fatherhoodmotivation #raisingboys #intentionaldad #dadson #presentdad #lifeofchoice",
    trials: ["Lead with: \"The most important thing I will ever teach my son costs nothing.\" — Curiosity gap.", "Reframe for broader audience: \"For every man who grew up believing his worth was tied to his output.\""],
  },
  {
    num: 27, title: "The 3 Fitness Shifts That Changed Everything", format: "Standard Reel", bucket: "gets", pillar: "Fitness",
    broll: ["Gym clip — you lifting, focused intensity (not for show, for documentation)", "Morning routine clip — coffee or pre-workout, journal open", "Outdoor movement clip — walking, stretching, or a simple bodyweight movement"],
    hooks: [
      { text: "I've been training for years. These 3 shifts are the only ones that actually stuck.", why: "List promise with credibility. High save rate content." },
      { text: "Most men train their body. Almost none train their discipline to show up.", why: "Reframes fitness as character, not just physique." },
      { text: "The gym didn't change my body first. It changed my mind.", why: "Unexpected take. Makes him keep watching for the explanation." },
    ],
    caption: "Fitness isn't the goal. It's the training ground. For discipline. For showing up when you don't feel like it. For proving to yourself every morning that you keep the promises you make to yourself. That's the real workout.",
    tags: "#dadfitness #discipline #morningroutine #intentionalliving #fitdad #lifeofchoice #mindsetshift",
    trials: ["Same B-roll. Format as Bad/Good/Best: Bad = training for looks. Good = training for health. Best = training for character.", "Same B-roll. Hook: \"What happens to a man who never misses a workout for 90 days.\" — Outcome hook."],
  },
  {
    num: 29, title: "Why I Build With Faith In The Process", format: "Standard Reel", bucket: "sees", pillar: "Faith",
    broll: ["You outdoors early morning — walking or standing still, golden light", "Bible or journal open — close-up of a specific page or passage (real, not staged)", "Family clip — you with your wife and son, the fruit of what you're building toward"],
    hooks: [
      { text: "I don't grind because I'm motivated. I show up because I'm called.", why: "Faith + entrepreneurship intersection that few people articulate." },
      { text: "The hardest months of building taught me more about faith than a church pew ever did.", why: "Unexpected angle. Makes faith feel real, not religious." },
      { text: "For the man who believes in something bigger but doesn't know how to build toward it.", why: "Names the gap between belief and action." },
    ],
    caption: "Faith without work is just wishful thinking. Work without faith is just exhaustion. I'm trying to build both. The business is an act of stewardship. Not just ambition.",
    tags: "#faithandbusiness #christianentrepreneur #lifeofchoice #purposedrivenlife #intentionalliving #stewardship",
    trials: ["Same B-roll. Lead with: \"What I pray for before I open my laptop every morning.\" — Ritual reveal hook.", "Reframe: \"The faith principle that changed how I approach every hard day in business.\""],
  },
  {
    num: 30, title: "Month 2 In The Right Rooms", format: "Standard Reel", bucket: "sees", pillar: "Entrepreneurship",
    broll: ["Speaking event clip — you in front of a room (already have this — use it here)", "Desk clip — you at work, intentional side angle", "Outdoor walking clip — movement, forward motion energy"],
    hooks: [
      { text: "Month 2. I'm in rooms I didn't know existed 60 days ago.", why: "Progress hook. Continuation of the 6-month build story." },
      { text: "You don't rise to your level of ambition. You rise to the level of the rooms you're in.", why: "Reframes the path. Proximity as the strategy." },
      { text: "I stopped trying to figure it out alone. Month 2 is what that looks like.", why: "Honest. Pulls back the curtain on the process." },
    ],
    caption: "The income hasn't changed yet. The rooms have. The conversations have. The belief has. That's month 2. Month 3 starts now.",
    tags: "#entrepreneurjourney #onlineincome #buildingonline #month2 #lifeofchoice #6monthchallenge #mentorship",
    trials: ["Lead with speaking clip. Test credibility-first to see if it outperforms emotion-first.", "Same B-roll. Hook: \"POV: You spent 60 days getting around people further ahead than you.\" — POV hook."],
  },
  {
    num: 37, title: "Split Screen — Marriage", format: "Split Screen 🧪", bucket: "feels", pillar: "Marriage", experiment: true,
    broll: ["LEFT SIDE: You at desk late — working, head down, wedding ring visible", "RIGHT SIDE: Your wife in the same house, different room — alone, doing something quiet", "Film both in one session — no words for first 3 seconds"],
    script: "No text for 3 seconds.\nLEFT label: \"Providing\"\nRIGHT label: \"What she actually needed\"\nFinal beat (full screen): \"You can't deposit presence into a bank account. But she's keeping score anyway.\"",
    caption: "I was doing everything right. And still missing the point. Providing isn't the same as being present. She didn't need more of what I was building. She needed more of me.",
    tags: "#intentionalmarriage #presenthusband #splitscreen #husbandlife #lifeofchoice #marriagegoals #entrepreneurdad",
    hooks: [],
    trials: [],
  },
  {
    num: 40, title: "Day 40. I'm Not The Same Man.", format: "Story Reel (Montage)", bucket: "sees", pillar: "Entrepreneurship", star: true,
    broll: ["Family clip — joyful, outdoor, candid energy", "Desk clip — you working, intentional", "Speaking event clip — you in front of a room", "Brief clip of you walking forward — movement, momentum energy"],
    arc: { setup: "\"Day 1. I didn't know if I could do this.\"", turn: "\"Day 30. I'm in rooms I didn't know existed.\"", payoff: "\"Day 40. I know exactly where this is going.\"" },
    hooks: [
      { text: "Day 1 of this I didn't know if it was possible. Day 40 I know it is. Here's the difference.", why: "Journey reflection. Shows growth without a big financial win." },
      { text: "30 days ago I started documenting this publicly. Here's what that forced me to do.", why: "Meta-reflection on the content journey itself. Authentic and self-aware." },
      { text: "The man who shows up publicly for 30 days becomes someone different. I'm proof.", why: "Transformation claim that doesn't require a financial win." },
    ],
    caption: "30 days of showing up publicly changed something. Not the income. Not yet. The belief. I know this works now. I know the path. I know the people. Month 2 complete. Month 3 starts now. Still following the whole build? Hit follow. 👇",
    tags: "#30daychallenge #entrepreneurjourney #onlineincome #buildingonline #month2 #freedomlifestyle #lifeofchoice",
    trials: ["FORMAT EXPERIMENT (trial alongside main post): Good/Better/Best — GOOD: \"Showing up for 30 days.\" BETTER: \"Showing up even when nothing was working.\" BEST: \"Becoming someone different because you refused to quit.\"", "Reframe as invitation: \"If you're thinking about starting something — this is your sign. Drop a ✋ below.\""],
  },
];

const BUCKET_COLORS = { feels: "#e84040", sees: "#f5a623", gets: "#3ecf82" };
const BUCKET_LABELS = { feels: "🔴 He Feels It", sees: "🟡 He Sees It", gets: "🟢 He Gets It" };

async function storageGet(key) { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function storageSet(key, value) { try { await window.storage.set(key, JSON.stringify(value)); } catch {} }

function SystemView() {
  return (
    <div>
      {/* Brand core */}
      <div style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 12 }}>Brand Core</div>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            { label: "Your Guy", val: "Men who know life is meant for more — but don't know how or what to do, and don't have relational guidance to get there" },
            { label: "Your Brand", val: "A man closing the gap between who he is and who he's decided to become" },
            { label: "The Question", val: "Am I living on purpose, or just by default?" },
            { label: "Post Filter", val: "Does this make my guy FEEL something — or just fill my feed?" },
            { label: "The Throughline", val: "Every post answers: Does he feel seen? Does he see the vision? Does he sense you have the map?" },
          ].map(item => (
            <div key={item.label} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "start" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", paddingTop: 1 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly pillar rhythm */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
        Weekly Pillar Rhythm <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        {PILLARS.map(p => (
          <div key={p.day} style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{p.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.day}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{p.label}</div>
          </div>
        ))}
      </div>

      {/* 3 Buckets */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
        3 Content Buckets <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        {BUCKETS.map(b => (
          <div key={b.id} style={{ background: "#161616", border: `1px solid ${b.color}33`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: b.color, marginBottom: 4 }}>{b.emoji} {b.label} — {b.sub}</div>
            <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5 }}>{b.desc}</div>
          </div>
        ))}
      </div>

      {/* Formats */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
        Formats <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
      </div>
      <div style={{ display: "grid", gap: 6, marginBottom: 20 }}>
        {FORMATS.map(f => (
          <div key={f.label} style={{ background: "#161616", border: `1px solid ${f.type === "experiment" ? "rgba(157,110,245,0.3)" : "#1e1e1e"}`, borderRadius: 6, padding: "10px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: f.type === "experiment" ? "#9d6ef5" : "#f05a1a", minWidth: 140, flexShrink: 0 }}>{f.label}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(157,110,245,0.08)", border: "1px solid rgba(157,110,245,0.25)", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#9d6ef5", marginBottom: 4 }}>
        🧪 Experiments: Run as trial reel first. If it clears your average views in 48hrs → push to main feed.
      </div>
    </div>
  );
}

function FilmingView() {
  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1e1e", borderRadius: 6, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#555" }}>
        <span style={{ color: "#f05a1a", fontWeight: 600 }}>Rule: </span>Film Mon. Edit Tue+Wed. Post daily. No filming on edit days.
        <span style={{ color: "#3a3a3a", marginLeft: 16 }}>Mix: 4–5 Reels/week + 1 Carousel + 1–2 Statics</span>
      </div>
      {FILMING_SCHEDULE.map((w, i) => (
        <div key={i} style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#f05a1a" }}>{w.week}</span>
              <span style={{ fontSize: 12, color: "#555", marginLeft: 10 }}>{w.days}</span>
            </div>
            <span style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>{w.theme}</span>
          </div>
          <div style={{ padding: "14px 16px", display: "grid", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f05a1a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>🎥 Film Monday</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{w.film}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#3a9de8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>✂️ Edit Schedule</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.8, whiteSpace: "pre-line" }}>{w.edit}</div>
            </div>
            <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 4, padding: "8px 12px" }}>
              <div style={{ fontSize: 11, color: "#f5a623" }}>📌 {w.notes}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarView({ onSelectDay }) {
  const weeks = [
    { label: "Week 1 — Return & Tension", days: DAYS.filter(d => d.num >= 12 && d.num <= 18) },
    { label: "Week 2 — Pursuit & Tools", days: DAYS.filter(d => d.num >= 19 && d.num <= 25) },
    { label: "Week 3 — Legacy & Faith", days: DAYS.filter(d => d.num >= 26 && d.num <= 32) },
    { label: "Week 4 — Momentum & Identity", days: DAYS.filter(d => d.num >= 33) },
  ];

  return (
    <div>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            {week.label} <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
          </div>
          {week.days.map(day => {
            const bc = BUCKET_COLORS[day.bucket];
            return (
              <div key={day.num} onClick={() => onSelectDay(day)} style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "14px 16px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#333"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#f05a1a", minWidth: 36, lineHeight: 1, opacity: 0.6 }}>{day.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
                    {day.star && <span style={{ color: "#f5a623", marginRight: 5 }}>★</span>}
                    {day.title}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: "#555", background: "#1a1a1a", padding: "2px 8px", borderRadius: 3 }}>{day.format}</span>
                    <span style={{ fontSize: 10, color: bc, background: `${bc}18`, padding: "2px 8px", borderRadius: 3, border: `1px solid ${bc}33` }}>{BUCKET_LABELS[day.bucket]}</span>
                    {day.experiment && <span style={{ fontSize: 10, color: "#9d6ef5", background: "rgba(157,110,245,0.12)", padding: "2px 8px", borderRadius: 3 }}>🧪 Experiment</span>}
                  </div>
                </div>
                <div style={{ fontSize: 16, color: "#333" }}>›</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DayDetail({ day, onBack }) {
  const bc = BUCKET_COLORS[day.bucket];
  const [copied, setCopied] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#f05a1a", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "0 0 16px", letterSpacing: "0.05em" }}>← Back to Calendar</button>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${bc}14, transparent)`, border: `1px solid ${bc}33`, borderRadius: 10, padding: "20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 800, opacity: 0.15, lineHeight: 1 }}>{day.num}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
            {day.star && <span style={{ color: "#f5a623", marginRight: 6 }}>★</span>}{day.title}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "#666", background: "#1a1a1a", padding: "2px 8px", borderRadius: 3 }}>{day.format}</span>
            <span style={{ fontSize: 10, color: bc, background: `${bc}18`, padding: "2px 8px", borderRadius: 3, border: `1px solid ${bc}33` }}>{BUCKET_LABELS[day.bucket]}</span>
            <span style={{ fontSize: 10, color: "#666", background: "#1a1a1a", padding: "2px 8px", borderRadius: 3 }}>{day.pillar}</span>
          </div>
        </div>
      </div>

      {/* B-Roll */}
      <Section label="🎥 B-Roll to Film Monday" color="#f05a1a">
        {day.broll.map((b, i) => (
          <div key={i} style={{ fontSize: 13, color: "#888", padding: "6px 0", borderBottom: "1px solid #1a1a1a", lineHeight: 1.5 }}>
            <span style={{ color: "#f05a1a", marginRight: 8 }}>·</span>{b}
          </div>
        ))}
      </Section>

      {/* Story Arc if present */}
      {day.arc && (
        <Section label="🎬 Story Arc" color="#3ecf82">
          {[["SETUP", day.arc.setup], ["TURN", day.arc.turn], ["PAYOFF", day.arc.payoff]].map(([beat, text]) => (
            <div key={beat} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1a1a", alignItems: "start" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#3ecf82", textTransform: "uppercase", letterSpacing: "0.1em", paddingTop: 1 }}>{beat}</div>
              <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{text}</div>
            </div>
          ))}
        </Section>
      )}

      {/* Script if present */}
      {day.script && (
        <Section label="📋 Script / Text on Screen" color="#9d6ef5">
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.8, whiteSpace: "pre-line" }}>{day.script}</div>
        </Section>
      )}

      {/* Hooks */}
      {day.hooks && day.hooks.length > 0 && (
        <Section label="🪝 Hook Options — Pick One" color="#f5a623">
          {day.hooks.map((h, i) => (
            <div key={i} style={{ background: "#1a1a1a", borderRadius: 6, padding: "12px 14px", marginBottom: 8, cursor: "pointer" }} onClick={() => copy(h.text, `hook-${i}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f2ede4", lineHeight: 1.4, flex: 1 }}>"{h.text}"</div>
                <div style={{ fontSize: 11, color: copied === `hook-${i}` ? "#3ecf82" : "#444", whiteSpace: "nowrap", flexShrink: 0 }}>{copied === `hook-${i}` ? "✓ Copied" : "Copy"}</div>
              </div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 6, fontStyle: "italic" }}>Why: {h.why}</div>
            </div>
          ))}
        </Section>
      )}

      {/* Caption */}
      {day.caption && (
        <Section label="🗒 Caption Angle" color="#3a9de8">
          <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "12px 14px", cursor: "pointer" }} onClick={() => copy(day.caption, "caption")}>
            <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.7 }}>{day.caption}</div>
            <div style={{ fontSize: 11, color: copied === "caption" ? "#3ecf82" : "#444", marginTop: 8 }}>{copied === "caption" ? "✓ Copied" : "Tap to copy"}</div>
          </div>
        </Section>
      )}

      {/* Tags */}
      {day.tags && (
        <Section label="🏷 SEO Tags" color="#555">
          <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "10px 14px", cursor: "pointer" }} onClick={() => copy(day.tags, "tags")}>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8 }}>{day.tags}</div>
            <div style={{ fontSize: 11, color: copied === "tags" ? "#3ecf82" : "#444", marginTop: 6 }}>{copied === "tags" ? "✓ Copied" : "Tap to copy"}</div>
          </div>
        </Section>
      )}

      {/* Trial reels */}
      {day.trials && day.trials.length > 0 && (
        <Section label="⚡ Trial Reel Options" color="#9d6ef5">
          {day.trials.map((t, i) => (
            <div key={i} style={{ fontSize: 13, color: "#777", padding: "8px 0", borderBottom: i < day.trials.length - 1 ? "1px solid #1a1a1a" : "none", lineHeight: 1.5 }}>
              <span style={{ color: "#9d6ef5", fontWeight: 700, marginRight: 8 }}>{String.fromCharCode(65 + i)}:</span>{t}
            </div>
          ))}
          <div style={{ fontSize: 11, color: "#444", marginTop: 10, fontStyle: "italic", borderTop: "1px solid #1a1a1a", paddingTop: 8 }}>
            {day.trialFirst ? "Run as trial first. Clear average views in 48hrs → push to main feed." : "Run alongside main post to test performance."}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ label, color, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
        {label} <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
      </div>
      <div style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8, padding: "12px 16px" }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("calendar");
  const [selectedDay, setSelectedDay] = useState(null);

  const VIEWS = [
    { id: "calendar", label: "Calendar" },
    { id: "filming", label: "Filming" },
    { id: "system", label: "System" },
  ];

  const handleSelectDay = (day) => { setSelectedDay(day); setActiveView("day"); };
  const handleBack = () => { setSelectedDay(null); setActiveView("calendar"); };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", color: "#f2ede4", fontFamily: "system-ui, sans-serif", fontSize: 15, lineHeight: 1.6 }}>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "20px 16px 0", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f05a1a", marginBottom: 6 }}>Align Living</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>Content Playbook</div>
        {activeView !== "day" && (
          <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
            {VIEWS.map(v => (
              <button key={v.id} onClick={() => setActiveView(v.id)} style={{ flex: "0 0 auto", padding: "10px 16px", background: "none", border: "none", borderBottom: `2px solid ${activeView === v.id ? "#f05a1a" : "transparent"}`, color: activeView === v.id ? "#f2ede4" : "#444", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>{v.label}</button>
            ))}
          </div>
        )}
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 80px" }}>
        {activeView === "calendar" && <CalendarView onSelectDay={handleSelectDay} />}
        {activeView === "day" && selectedDay && <DayDetail day={selectedDay} onBack={handleBack} />}
        {activeView === "filming" && <FilmingView />}
        {activeView === "system" && <SystemView />}
      </div>
    </div>
  );
}
