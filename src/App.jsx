import { useState, useEffect, useRef } from "react";

const SCENARIO_PATHS = [
  { icon: "👨‍🍳", label: "Gordon Ramsay's Kitchen", sub: "Michelin-star pressure", id: "gordon" },
  { icon: "🌴", label: "Love Island", sub: "Villa drama & vibes", id: "loveisland" },
  { icon: "🪖", label: "SAS: Who Dares Wins", sub: "Elite military selection", id: "sas" },
  { icon: "💼", label: "The Apprentice", sub: "Boardroom warfare", id: "apprentice" },
  { icon: "🚀", label: "Startup Grind", sub: "18 months, no salary", id: "startup" },
  { icon: "🧘", label: "Silent Retreat", sub: "30 days, no phone", id: "retreat" },
];

const CAREER_PATHS = [
  { icon: "⚽", label: "Premier League Footballer", sub: "Age, pace, technical ability", id: "football" },
  { icon: "🎧", label: "DJ", sub: "Music ear, hustle, persona", id: "dj" },
  { icon: "🎤", label: "Stand-up Comedian", sub: "Timing, confidence, skin", id: "standup" },
  { icon: "💡", label: "Startup Founder", sub: "Grit, vision, resilience", id: "founder" },
  { icon: "🍽️", label: "Professional Chef", sub: "Craft, stamina, ego", id: "chef" },
  { icon: "💪", label: "Personal Trainer", sub: "Discipline, empathy, look", id: "pt" },
];

const ALL_PATHS = [...SCENARIO_PATHS, ...CAREER_PATHS];

const QUESTIONS = {
  gordon: [
    { tag: "CURRENT ABILITY", q: "How would you honestly rate your cooking skills right now?", opts: ["Can follow a basic recipe", "Confident home cook", "Self-taught to a serious level", "Professionally trained or equivalent"] },
    { tag: "DAILY ROUTINE", q: "How often do you actually cook from scratch at home?", opts: ["Rarely — mostly takeaways", "A few times a week", "Most days, I enjoy it", "Every day, it's a ritual"] },
    { tag: "KNIFE SKILLS", q: "Your knife work — be honest:", opts: ["Slow and a bit cautious", "Decent but inconsistent", "Confident and fairly fast", "Sharp, clean, chef-level"] },
    { tag: "STAMINA", q: "How long can you stay on your feet, fully focused, in a hot environment?", opts: ["A few hours max", "Half a day before it hurts", "Most of a shift", "All day, no issue"] },
    { tag: "PRESSURE", q: "Service is in the weeds — three tickets backed up, pass screaming. You:", opts: ["Freeze and slow down", "Try to rush and make mistakes", "Stay methodical under the heat", "Lock in — this is when I'm best"] },
    { tag: "TEMPERAMENT", q: "Head chef publicly destroys your dish in front of the team. You:", opts: ["Walk out", "Go quiet and stew", "Take it on the chin", "Use it as fuel"] },
    { tag: "CREATIVITY", q: "You're handed random leftover ingredients and told to make something in 20 minutes. You:", opts: ["Panic completely", "Produce something edible", "Get creative and enjoy it", "This is my favourite type of challenge"] },
    { tag: "HYGIENE", q: "How strict are you about food safety and cleanliness as a habit?", opts: ["Could be more careful", "Fairly careful when it matters", "Consistently strict", "Non-negotiable — always"] },
    { tag: "SCHEDULE", q: "Your current relationship with early starts, late finishes, and weekend work:", opts: ["I need my evenings and weekends", "Occasionally fine", "Used to shift patterns", "This is already my life"] },
    { tag: "PASSION", q: "After a 12-hour day on your feet, how do you feel about cooking?", opts: ["Never want to see a kitchen again", "Could tolerate it for the money", "Still enjoy it genuinely", "It's all I'd ever want to do"] },
  ],
  loveisland: [
    { tag: "CURRENT ROUTINE", q: "How much time do you currently spend on your appearance and presentation daily?", opts: ["Barely any", "30 mins — basic", "An hour — I make the effort", "It's a whole thing, always have"] },
    { tag: "SOCIAL STAMINA", q: "How are you in big group social situations right now?", opts: ["Drain me fast", "Fine for a few hours", "Fairly comfortable", "I come alive — love a crowd"] },
    { tag: "EMOTIONAL OPENNESS", q: "How easy do you find it to talk about your feelings face to face?", opts: ["Completely shut down", "Awkward but can do it", "Pretty open when needed", "Very expressive — always"] },
    { tag: "CONFIDENCE", q: "How would you rate your overall self-confidence day to day?", opts: ["Low, working on it", "Depends heavily on the day", "Generally confident", "Very high, consistent"] },
    { tag: "DRAMA", q: "Someone is openly flirting with your partner in front of you. You:", opts: ["Say nothing and stew", "Go quiet and exit", "Address it calmly", "Call it out immediately"] },
    { tag: "LOYALTY", q: "A stunningly attractive new person arrives and shows interest in you. You:", opts: ["Instantly tempted", "Flattered but hold back", "Loyal, no question", "Don't even notice — too focused"] },
    { tag: "BOREDOM TOLERANCE", q: "No phone, no internet — just 15 people in a villa for 8 weeks. You:", opts: ["Would spiral within days", "Hard but could manage", "Fine — I run on people", "This is genuinely the dream"] },
    { tag: "CAMERA COMFORT", q: "Your natural comfort level with being filmed and watched constantly:", opts: ["Hate it", "Self-conscious but could adapt", "Generally fine", "Thrive on attention"] },
    { tag: "STRATEGY", q: "How much would you play the game versus being fully yourself?", opts: ["100% myself — no performance", "Mostly me, slight awareness", "Strategic but with real feelings", "Full game mode, all the way"] },
    { tag: "TV APPEAL", q: "How would you honestly describe your watchability?", opts: ["I'd be background noise", "Decent in small doses", "Probably good TV", "I was built for this"] },
  ],
  sas: [
    { tag: "CURRENT FITNESS", q: "What does your training routine actually look like right now?", opts: ["Nothing structured", "2–3 sessions a week", "Training 5+ times a week seriously", "Athlete or ex-military level"] },
    { tag: "PHYSICAL BASELINE", q: "How far could you run right now, without stopping?", opts: ["Maybe a mile or two", "5K without too much trouble", "10K fairly comfortably", "Half marathon or more"] },
    { tag: "COLD TOLERANCE", q: "Your experience with cold water or extreme physical discomfort:", opts: ["Avoid it at all costs", "Unpleasant but I'd try", "Have done it before", "Regular part of my training"] },
    { tag: "SLEEP DISCIPLINE", q: "Your current sleep schedule and how you'd handle 4 hours a night for weeks:", opts: ["I need 8+ hours to function", "Manageable for a few days", "Used to running on less", "Doesn't affect my performance much"] },
    { tag: "MENTAL TOUGHNESS", q: "When things get genuinely hard — not just uncomfortable — you:", opts: ["Want out", "Push through but barely", "Find another gear", "Get stronger as it gets worse"] },
    { tag: "AUTHORITY", q: "An instructor is in your face, screaming, no reason given. Your instinct:", opts: ["Answer back", "Crumble or freeze", "Absorb it and stay still", "Find it almost funny — no effect"] },
    { tag: "NAVIGATION", q: "Your actual ability to navigate outdoors with a map and compass:", opts: ["Never tried it", "Basic idea, would be slow", "Fairly capable", "Done it in training or the field"] },
    { tag: "TEAM UNDER PRESSURE", q: "Your teammate is slowing the whole group down on a 20-mile march. You:", opts: ["Internally abandon them", "Quietly resent it", "Encourage and help carry them", "Take charge and redistribute the load"] },
    { tag: "SCHEDULE", q: "Your current relationship with early mornings, physical discomfort, and routine:", opts: ["I like comfort and routine", "Can push when I have to", "Regularly push myself", "I seek discomfort — it's how I grow"] },
    { tag: "QUITTING", q: "If you could tap out right now, no shame, how likely would you be?", opts: ["Very tempted honestly", "At my lowest maybe", "Unlikely unless injured", "The thought genuinely wouldn't cross my mind"] },
  ],
  apprentice: [
    { tag: "CURRENT ABILITY", q: "How would you honestly rate your business and commercial awareness right now?", opts: ["Pretty limited", "Basic understanding", "Fairly strong", "It's what I do / study"] },
    { tag: "DAILY HABITS", q: "Do you currently read business news, follow markets, or track industries?", opts: ["Never", "Occasionally", "Pretty regularly", "Every day without fail"] },
    { tag: "PRESENTING", q: "Your current comfort level presenting or pitching to a room of people:", opts: ["Genuinely terrifying", "Nervous but get through it", "Fairly confident", "Born for it"] },
    { tag: "NETWORKING", q: "How are you right now at walking into a room of strangers and working it?", opts: ["Dread it", "Push through it awkwardly", "Fairly natural", "In my element"] },
    { tag: "NUMBERS", q: "Your actual ability with financial data — P&L, margins, basic maths under pressure:", opts: ["Would be completely lost", "Could scrape something together", "Handle it solidly", "Numbers are genuinely my thing"] },
    { tag: "LEADERSHIP", q: "You're suddenly in charge — team is falling apart, deadline in an hour. You:", opts: ["Freeze and defer", "Muddle through", "Step up and direct", "Thrive — I live for this"] },
    { tag: "POLITICS", q: "Your teammate takes credit for your idea in the boardroom in front of everyone. You:", opts: ["Let it go", "Seethe but say nothing", "Calmly set the record straight", "Correct it immediately and firmly"] },
    { tag: "RISK", q: "Bold idea — could win the task or backfire completely. Your instinct:", opts: ["Play it safe every time", "Dilute it first", "Go for it with a contingency", "All in, no plan B"] },
    { tag: "SCHEDULE", q: "Your current capacity for long hours, high stress, and zero downtime:", opts: ["I need balance — this sounds rough", "Fine in short bursts", "Used to working hard", "This is already my default"] },
    { tag: "COMPOSURE", q: "Lord Sugar is grilling you aggressively on live TV. Right now, honestly:", opts: ["Would go red and stumble", "Nervous but hold it together", "Stay calm and measured", "Enjoy the confrontation"] },
  ],
  startup: [
    { tag: "CURRENT IDEA", q: "Do you have a real problem you obsess over right now?", opts: ["Not really", "Something vague is floating around", "Yes — clearly defined", "Yes — I've already started building"] },
    { tag: "DAILY HABITS", q: "How much of your current day goes toward building something, learning, or creating?", opts: ["Almost none", "An hour here and there", "A few hours most days", "Most of my waking hours"] },
    { tag: "FINANCIAL REALITY", q: "Your actual financial situation for going without income for 12+ months:", opts: ["Not realistic at all", "Very tight but possible", "Have savings that could cover it", "Already in this situation"] },
    { tag: "WORK RATE", q: "Right now, how many hours a week do you work or study toward a goal?", opts: ["Standard 9–5 and that's it", "A bit extra occasionally", "Regularly putting in extra", "I don't really switch off"] },
    { tag: "REJECTION", q: "You get 20 no's in a row — investors, users, whoever. You:", opts: ["Take it personally and consider quitting", "Take a break and reassess", "Adjust approach and keep going", "Use it as data — I expected this"] },
    { tag: "FEEDBACK", q: "Someone tears apart your idea in front of others. Your actual reaction:", opts: ["Get defensive", "Take it personally but hear it later", "Listen, process, improve", "This is exactly what I want — give me more"] },
    { tag: "EXECUTION SPEED", q: "If you had a great idea today, how fast could you get something in front of real users?", opts: ["Weeks of planning first", "A few months", "Within weeks", "Days — I move fast"] },
    { tag: "CO-FOUNDER CONFLICT", q: "Your co-founder wants to pivot everything. You disagree. You:", opts: ["Cave to keep the peace", "Long argument, probably cave", "Find a real compromise", "Hold your ground — split if needed"] },
    { tag: "SCHEDULE", q: "Your current tolerance for working evenings, weekends, and skipping social plans:", opts: ["That's not sustainable for me", "Okay in short bursts", "I already do this regularly", "What social plans?"] },
    { tag: "RESILIENCE", q: "Version 1 completely flops. Zero users, zero traction. Your honest response:", opts: ["Shut it down", "Take a long break", "Analyse, rebuild, go again", "I expected this — already planning v2"] },
  ],
  retreat: [
    { tag: "PHONE HABITS", q: "How many times do you actually check your phone per day right now?", opts: ["Constantly — every few minutes", "Every hour or so", "A handful of times", "Rarely — it doesn't run me"] },
    { tag: "CURRENT STILLNESS", q: "When did you last sit in silence for 30 minutes with no input — no music, no scroll, nothing?", opts: ["Can't remember", "Maybe a few weeks ago", "Fairly recently", "I do this regularly"] },
    { tag: "SLEEP ROUTINE", q: "What does your current sleep schedule actually look like?", opts: ["Irregular — up late most nights", "Midnight-ish, inconsistent", "Fairly consistent 10–11pm", "Early nights, early rises — already there"] },
    { tag: "DIET RIGHT NOW", q: "Your current diet and relationship with caffeine, alcohol, and processed food:", opts: ["Pretty unrestricted", "Moderate — some habits I know aren't great", "Generally clean", "Already minimal — no alcohol, clean eating"] },
    { tag: "MEDITATION", q: "Your actual experience with meditation or breathwork right now:", opts: ["Never tried it", "Tried a few times, found it hard", "Have a light practice", "Regular — daily or near daily"] },
    { tag: "EMOTIONAL PROCESSING", q: "How do you usually handle difficult emotions or mental health in your current life?", opts: ["Distract myself — music, scroll, food", "Talk to someone occasionally", "Have some tools that help", "Actively work on it — therapy, journalling, reflection"] },
    { tag: "COMMUNITY", q: "Sharing a living space with 20 strangers 24/7 — your honest reaction:", opts: ["Would crack within days", "Very hard but manageable", "Fine — I like people", "I thrive in community settings"] },
    { tag: "MIND", q: "If all distractions disappeared for 30 days, what would actually happen to your mental state?", opts: ["It would be genuinely scary", "Challenging — a lot would come up", "I think I'd be okay", "I've been waiting for this honestly"] },
    { tag: "PURPOSE", q: "Why would you actually go — what's really going on?", opts: ["Trendy thing to try", "Escaping something", "Genuine curiosity", "Deep personal or spiritual practice"] },
    { tag: "SCHEDULE", q: "Your current relationship with structure — early mornings, no spontaneity, set routines:", opts: ["I need flexibility and freedom", "Fine in short doses", "I respond well to structure", "Already live by a strict routine"] },
  ],
  football: [
    { tag: "CURRENT LEVEL", q: "What level do you actually play at right now?", opts: ["5-a-side with mates occasionally", "Regular amateur / Sunday league", "Semi-competitive local league", "Semi-pro, academy, or regional level"] },
    { tag: "TRAINING ROUTINE", q: "How many times a week do you train with a ball right now?", opts: ["Rarely or never", "Once or twice", "3–4 times", "5+ times — it's my main focus"] },
    { tag: "PHYSICAL CONDITIONING", q: "Your current sprint speed and fitness honestly:", opts: ["Not especially quick or fit", "Average — keeping up", "Quick and in decent shape", "Fast — I've tested it, I know my numbers"] },
    { tag: "TECHNICAL ABILITY", q: "Ball control, first touch, and passing under pressure right now:", opts: ["Sunday league level", "Decent amateur", "Strong — semi-pro quality", "Professional or close to it"] },
    { tag: "DIET AND LIFESTYLE", q: "How seriously do you take nutrition, sleep, and recovery as a current habit?", opts: ["Not particularly — I eat what I want", "Fairly casual", "Fairly disciplined", "Athlete-level — it's non-negotiable for me"] },
    { tag: "SCHEDULE", q: "6am training, six days a week, no late nights. Your current lifestyle versus that reality:", opts: ["Way off — completely different life", "Would require big changes", "Fairly close already", "This is basically my life now"] },
    { tag: "COACHABILITY", q: "A coach pulls you aside and says your positioning and movement are consistently wrong. You:", opts: ["Get defensive", "Hear it but resist inside", "Listen and work on it", "Obsess over the feedback until it's fixed"] },
    { tag: "MENTALITY", q: "Penalty shootout, cup final, you're up. Honestly:", opts: ["Would try to avoid it", "Nervous — take it anyway", "Want it — been ready for this", "Already visualised this exact moment countless times"] },
    { tag: "VISION", q: "Reading the game — spotting space and movement before the ball arrives:", opts: ["Reactive — I respond to what's in front of me", "Getting better at reading it", "Good footballing brain", "I see things others miss regularly"] },
    { tag: "LONGEVITY", q: "Setbacks, injuries, years potentially in the lower leagues first. Can you genuinely commit?", opts: ["I want it now or not at all", "Probably not if it takes too long", "Yes — if I believe I have a chance", "Nothing on earth would stop me"] },
  ],
  dj: [
    { tag: "CURRENT EXPERIENCE", q: "What does your actual DJ experience look like right now?", opts: ["Never touched equipment", "Home practice only", "Played events or nights out", "Regular gigs — this is my thing"] },
    { tag: "MUSIC KNOWLEDGE", q: "How deep does your music knowledge actually go right now?", opts: ["Charts and mainstream only", "Know a few genres well", "Deep into specific scenes — obsessive", "Record collection is basically my personality"] },
    { tag: "TECHNICAL SKILL", q: "Beatmatching by ear — your current ability:", opts: ["No idea what that means practically", "Can do it slowly with effort", "Fairly reliable", "Second nature — automatic"] },
    { tag: "PRACTICE ROUTINE", q: "How often do you actually sit behind decks and practice right now?", opts: ["Rarely or never", "Occasionally when I feel like it", "Regular sessions — few times a week", "Every day or close to it"] },
    { tag: "CROWD READING", q: "Crowd isn't responding to your set at all. You:", opts: ["Panic and stick rigidly to the plan", "Slowly and awkwardly adjust", "Switch direction confidently", "Feed off the challenge — I love solving this live"] },
    { tag: "NETWORKING", q: "Your current comfort level with industry networking — promoters, agents, other DJs:", opts: ["Genuinely hate it", "Push myself to do it", "Fairly natural by now", "Already building those relationships actively"] },
    { tag: "ONLINE PRESENCE", q: "Your current social media and content output as a DJ:", opts: ["Nothing — not on it", "Occasional posts", "Building it — fairly consistent", "Content strategy is already part of how I work"] },
    { tag: "ENDURANCE", q: "A 4-hour set starting at midnight in a packed, sweaty room. How does your body handle that right now?", opts: ["Would really struggle physically and mentally", "Tough but could get through it", "Can do it", "This is genuinely what I live for"] },
    { tag: "ORIGINALITY", q: "How would you describe your actual sound right now?", opts: ["Playing what people expect", "Mostly mainstream with my own flavour", "Distinctly mine — people recognise it", "No one sounds like me right now"] },
    { tag: "RESILIENCE", q: "You play to 10 people on a Tuesday. What actually happens to your energy?", opts: ["Devastating — hard to recover from", "Disappointing but I perform", "Same energy regardless", "I'd play the best set of my life for 10 people"] },
  ],
  standup: [
    { tag: "CURRENT EXPERIENCE", q: "How much stand-up have you actually done so far?", opts: ["None — just thought about it", "Tried an open mic or two", "Done it a few times, still finding feet", "Regular open mics or paid gigs"] },
    { tag: "NATURAL HUMOUR", q: "How often do you make people properly laugh in everyday conversation?", opts: ["Rarely — not really known for it", "Sometimes, situationally", "Pretty often — people come to expect it", "Constantly — it's just how I communicate"] },
    { tag: "WRITING HABIT", q: "Do you currently write jokes, bits, or observations — even just for yourself?", opts: ["Never", "Occasionally when something funny happens", "Fairly regularly", "Every day — I'm always capturing stuff"] },
    { tag: "STAGE COMFORT", q: "Your actual current comfort with standing in front of a live audience:", opts: ["Genuinely terrifying to me", "Nerve-wracking but I'd try", "Fairly comfortable", "Energised by it — born for a stage"] },
    { tag: "SKIN THICKNESS", q: "You do a minute of material and it completely dies. Room is silent. You:", opts: ["Die inside and can't recover", "Get flustered and rush", "Acknowledge it and move on", "Make the silence the next bit — I've trained for this"] },
    { tag: "SELF-AWARENESS", q: "How honest are you with yourself about what's actually funny versus what you think is funny?", opts: ["I think everything I write is good", "Hard to tell honestly", "Pretty self-critical about it", "Ruthlessly honest — I kill most of my ideas"] },
    { tag: "HECKLERS", q: "Someone heckles you mid-set. Your honest reaction:", opts: ["Completely thrown — can't recover", "Flustered but continue", "Handle it nervously but get through", "Love it — use it as material immediately"] },
    { tag: "SCHEDULE", q: "5 open mics a week for two years with no pay and probably small crowds. Your current tolerance for that:", opts: ["I'd last months at most", "Maybe — if I really believed in it", "Yes — I understand that's the grind", "Already doing something close to this"] },
    { tag: "ORIGINALITY", q: "Your comedy voice right now — how distinctive is it?", opts: ["Not developed yet", "Still finding it", "Pretty clear — people get my style", "Unmistakably mine"] },
    { tag: "REJECTION", q: "Comedy clubs and bookers ignore or reject you for 18 months straight. You:", opts: ["Quit", "Take a long break and reassess", "Analyse, adjust, keep going", "That becomes material — I use it"] },
  ],
  founder: [
    { tag: "CURRENT IDEA", q: "Do you have a real problem you think about obsessively right now?", opts: ["Not really", "Something vague floating around", "Yes — clearly defined problem", "Yes — already building something"] },
    { tag: "DAILY HABITS", q: "How much of your current day goes toward building, learning, or creating something of your own?", opts: ["Almost nothing", "An hour here and there", "A few hours most days", "Most of my waking hours — I'm obsessed"] },
    { tag: "FINANCIAL REALITY", q: "Your actual financial runway for going without income:", opts: ["No savings — not realistic right now", "A few months at best", "Could live lean for 12+ months", "Already not taking a salary"] },
    { tag: "EXECUTION", q: "If you had a great idea today, how fast could you get something real in front of users?", opts: ["Months of planning first", "A few months", "Weeks — I'd ship fast", "Days — I move immediately"] },
    { tag: "FEEDBACK", q: "Someone publicly tears your idea apart. Your honest reaction:", opts: ["Get defensive and dismiss it", "Take it personally but hear it later", "Listen, process, use it", "This is exactly what I want"] },
    { tag: "SCHEDULE", q: "Evenings, weekends, skipped plans — your current tolerance for this being your normal:", opts: ["I need my downtime — this sounds rough", "Okay in short stretches", "Already working extra most weeks", "What's a weekend?"] },
    { tag: "PEOPLE", q: "How good are you right now at convincing people to back something you believe in?", opts: ["Struggle with it", "Getting better", "Strong at it", "People follow my lead naturally"] },
    { tag: "FOCUS", q: "10 good opportunities in front of you right now. What happens?", opts: ["Chase all of them", "Struggle to choose", "Narrow it to 2–3", "Lock onto one and block everything else out"] },
    { tag: "RISK", q: "Leaving your current situation for something uncertain — where are you honestly:", opts: ["Not ready and probably never will be", "Only with a solid safety net", "Would do it with the right idea", "Already did it or in the process"] },
    { tag: "RESILIENCE", q: "Your current tolerance for sustained failure with no validation:", opts: ["A few months before I'd need results", "1–2 years if I really believed", "3–5 years — I play long", "As long as it takes — genuinely"] },
  ],
  chef: [
    { tag: "CURRENT SKILL", q: "What's your actual cooking ability right now?", opts: ["Basic home cooking — following recipes", "Confident home cook — improvise a lot", "Self-taught to a serious level", "Trained or have worked in kitchens"] },
    { tag: "DAILY HABITS", q: "How often do you actually cook from scratch and push your skills at home?", opts: ["Rarely — takeaways mostly", "A few times a week", "Most days, intentionally", "Every day — it's how I decompress"] },
    { tag: "PALATE", q: "How refined is your palate honestly — can you identify flavour, balance, seasoning issues?", opts: ["Fairly standard — it tastes fine or it doesn't", "Notice things but can't always identify them", "Good — I pick up most things", "Professional-level — I taste in layers"] },
    { tag: "KNIFE SKILLS", q: "Your knife work right now:", opts: ["Slow and cautious", "Decent but inconsistent", "Confident, fairly quick", "Fast, precise, chef-level"] },
    { tag: "STAMINA", q: "How long can you work standing in heat, moving fast, fully focused?", opts: ["A few hours before it gets tough", "Half a day reasonably", "Most of a long shift", "All day — I've done it"] },
    { tag: "SCHEDULE", q: "Your current relationship with late nights, weekend work, and giving up evenings:", opts: ["I value my evenings and weekends too much", "Could tolerate it short term", "Already work irregular hours", "This is already my life"] },
    { tag: "CREATIVITY", q: "Three new dishes, one week, seasonal constraints. Right now, could you do it?", opts: ["Would need a lot of help", "Struggle but produce something", "Enjoy this kind of challenge", "This is when I'm at my absolute best"] },
    { tag: "PRESSURE", q: "Kitchen is in the weeds — tickets backing up, head chef shouting. You:", opts: ["Freeze and slow down", "Rush and start making mistakes", "Stay methodical", "Lock in — performs better under pressure"] },
    { tag: "LEADERSHIP", q: "Two juniors are working behind you on your section. Right now, how ready are you for that?", opts: ["Not ready at all", "Would be very nervous", "Could manage it", "Natural leader — already mentored people"] },
    { tag: "PASSION", q: "At the end of a brutal 14-hour shift, how do you feel about cooking?", opts: ["Never want to see a kitchen again", "Would do it for the money", "Still genuinely enjoy it", "It's the only thing I ever want to do"] },
  ],
  pt: [
    { tag: "OWN TRAINING", q: "What does your current training routine actually look like?", opts: ["Sporadic — a few times a month", "2–3 times a week, fairly casual", "5+ times a week with a plan", "Training is my primary focus — daily"] },
    { tag: "KNOWLEDGE", q: "Your actual current knowledge of anatomy, programming, and nutrition:", opts: ["Basic gym-goer level", "Above average — self-taught", "Formally studied or certified", "Specialist — this is what I read about daily"] },
    { tag: "SCHEDULE", q: "5am alarm, 6 sessions before midday — your current lifestyle versus that reality:", opts: ["Impossible — I'm not a morning person", "Would require a complete overhaul", "Could adjust fairly quickly", "Already up early — this is close to my life now"] },
    { tag: "PEOPLE SKILLS", q: "How are you right now with reading people, building rapport, and adjusting your energy?", opts: ["Find it draining and hard", "Can do it with effort", "Fairly natural", "Energised by people — it's my strength"] },
    { tag: "EMPATHY", q: "A client breaks down crying mid-session — grief, stress, burnout. Your current ability to handle that:", opts: ["Completely out of my depth", "Would try but feel uncomfortable", "Can sit with it and support them", "This is a core part of coaching I love"] },
    { tag: "PROGRAMMING", q: "Writing a 12-week progressive programme for a client with specific goals from scratch — right now:", opts: ["No idea where to start", "Could produce something basic", "Solid — I've done this", "Could write it in my sleep"] },
    { tag: "PHYSICAL LOOK", q: "Do you currently look like someone who could credibly coach fitness?", opts: ["Not really — still on my own journey", "Average fitness", "Fit and clearly healthy", "People regularly ask me about my training"] },
    { tag: "CLIENT PRESSURE", q: "A client wants to quit halfway through a tough session. You:", opts: ["Awkwardly push through it", "Let it slide to keep the peace", "Find out what's actually going on", "Immediately adapt the session to meet them where they are"] },
    { tag: "BUSINESS SIDE", q: "Pricing, contracts, invoicing, admin — your current capacity for running the business side:", opts: ["Would hate all of that", "Would figure it out eventually", "Already handle this kind of thing", "Have systems and processes ready to go"] },
    { tag: "RETENTION", q: "Keeping clients motivated and coming back for 6+ months — your honest ability right now:", opts: ["They'd get bored of me eventually", "Hard to sustain long term", "Pretty good at it — I think they'd stay", "My clients would stay for years — I know how to keep them engaged"] },
  ],
};

const INITIAL_STATS = { played: 0, passes: 0, fails: 0, maybes: 0, totalScore: 0 };

function scoreColor(s) {
  if (s >= 70) return "#4ade80";
  if (s >= 40) return "#fbbf24";
  return "#f87171";
}

// Donut/pie chart component
function FitDonut({ score, verdict }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  const vc = verdict === "PASS" ? "#4ade80" : verdict === "FAIL" ? "#f87171" : "#fbbf24";

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const dash = (animated / 100) * circ;
  const gap = circ - dash;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={130} height={130} viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14} />
        <circle
          cx={65} cy={65} r={r} fill="none"
          stroke={vc} strokeWidth={14}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{ position: "relative", marginTop: -100, marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: vc, lineHeight: 1 }}>{score}<span style={{ fontSize: "1rem", opacity: 0.5 }}>%</span></div>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>fit score</div>
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [screen, setScreen] = useState("home");
  const [selectedPath, setSelectedPath] = useState(null);
  const [customPath, setCustomPath] = useState("");
  const [customPathObj, setCustomPathObj] = useState(null);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [openText, setOpenText] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [modal, setModal] = useState(null);
  const [animIn, setAnimIn] = useState(true);
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bfi_stats") || "null") || INITIAL_STATS; } catch { return INITIAL_STATS; }
  });

  const isCustom = selectedPath === "__custom__";
  const activeQuestions = isCustom ? (customQuestions || []) : (selectedPath ? QUESTIONS[selectedPath] : []);
  const questions = activeQuestions;
  const totalQ = questions.length;
  const pathObj = isCustom ? customPathObj : (selectedPath ? ALL_PATHS.find(p => p.id === selectedPath) : null);
  const isCareer = isCustom ? true : (selectedPath ? CAREER_PATHS.some(p => p.id === selectedPath) : false);

  const d = darkMode;

  // Light mode: Detroit Pistons — white base, red primary, royal blue secondary
  // Dark mode: LA Clippers — deep navy base, red primary, light blue secondary
  const c = {
    bg:         d ? "#0e1c3d" : "#ffffff",
    surface:    d ? "rgba(255,255,255,0.05)" : "rgba(200,16,46,0.04)",
    border:     d ? "rgba(255,255,255,0.10)" : "rgba(0,28,96,0.12)",
    text:       d ? "#ffffff" : "#001060",
    textMuted:  d ? "rgba(255,255,255,0.70)" : "rgba(0,16,96,0.65)",
    textFaint:  d ? "rgba(255,255,255,0.35)" : "rgba(0,16,96,0.35)",
    accent:     "#c8102e",                    // NBA red — both teams share it
    accentBg:   d ? "rgba(200,16,46,0.12)"  : "rgba(200,16,46,0.06)",
    accentText: "#ffffff",
    secondary:  d ? "#1d42b0" : "#1d42b0",   // royal blue
    secondaryBg:d ? "rgba(29,66,176,0.15)"  : "rgba(29,66,176,0.08)",
    modalBg:    d ? "#0a1428" : "#ffffff",
    navBorder:  d ? "rgba(255,255,255,0.08)" : "rgba(0,28,96,0.10)",
  };

  function saveStats(ns) {
    setStats(ns);
    try { localStorage.setItem("bfi_stats", JSON.stringify(ns)); } catch {}
  }

  function transition(fn) {
    setAnimIn(false);
    setTimeout(() => { fn(); setAnimIn(true); }, 220);
  }

  async function generateCustomQuestions() {
    if (!customPath.trim()) return;
    setGeneratingQuestions(true);
    const prompt = `You are a research and quiz expert for "Am I Built For It?", a quiz for 16–30 year olds.
The user wants to be assessed on their dream of becoming: "${customPath}"

Generate a research-backed set of questions for this dream. Use your knowledge to assess whether someone is genuinely built for it.

Return ONLY raw JSON, no markdown:
{
  "label": "<clean path name>",
  "icon": "<single relevant emoji>",
  "sub": "<5-7 word description of what this dream involves>",
  "questions": {
    "multiple_choice": [
      {"tag": "<SHORT TAG>", "q": "<question about current ability, routine, or scenario>", "opts": ["<weakest>", "<below avg>", "<above avg>", "<strongest>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]},
      {"tag": "<TAG>", "q": "<question>", "opts": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"]}
    ],
    "open_ended": [
      {"tag": "<TAG>", "q": "<open question requiring a detailed personal answer>"},
      {"tag": "<TAG>", "q": "<second open question — different angle>"}
    ]
  }
}
Mix questions across: current ability, daily routine/habits, and scenario responses. Be specific to this exact path.`;

    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);

      setCustomPathObj({ id: "__custom__", label: parsed.label, icon: parsed.icon, sub: parsed.sub });

      // Flatten MC + open-ended into unified question format
      const mcQs = (parsed.questions.multiple_choice || []).map(q => ({
        tag: q.tag, q: q.q, opts: q.opts, type: "mc"
      }));
      const oeQs = (parsed.questions.open_ended || []).map(q => ({
        tag: q.tag, q: q.q, opts: null, type: "open"
      }));
      const combined = [...mcQs];
      combined.splice(5, 0, oeQs[0]);
      if (oeQs[1]) combined.push(oeQs[1]);
      setCustomQuestions(combined);
      setGeneratingQuestions(false);
      return true;
    } catch (e) {
      console.error("Question generation failed", e);
      setGeneratingQuestions(false);
      return false;
    }
  }

  function startQuestions() {
    transition(() => { setCurrentQ(0); setAnswers({}); setSelectedOpt(null); setOpenText(""); setScreen("questions"); });
  }

  function goBack() { transition(() => { setScreen("home"); setSelectedOpt(null); setOpenText(""); }); }

  function nextQuestion() {
    const q = questions[currentQ];
    const answerVal = q.type === "open" ? openText.trim() : selectedOpt;
    const na = answerVal ? { ...answers, [q.tag]: answerVal } : answers;
    setAnswers(na);
    setSelectedOpt(null);
    setOpenText("");
    if (currentQ + 1 >= totalQ) {
      transition(() => fetchVerdict(na));
    } else {
      transition(() => setCurrentQ(currentQ + 1));
    }
  }

  function skipQuestion() {
    setSelectedOpt(null);
    setOpenText("");
    if (currentQ + 1 >= totalQ) {
      transition(() => fetchVerdict(answers));
    } else {
      transition(() => setCurrentQ(currentQ + 1));
    }
  }

  async function fetchVerdict(finalAnswers) {
    setScreen("verdict");
    setVerdict(null);
    setLoading(true);
    setShowAnswers(false);
    const modeLabel = isCareer ? "Could I Go Pro?" : "Would I Make It?";
    const prompt = `You are a brutally honest, entertaining judge for "Am I Built For It?" — a quiz aimed at 16–30 year olds. Keep language punchy, direct, and relatable. Do NOT use slang like "bro", "dude", or similar.
${userName ? `The user's name is ${userName}. Address them by name once in the breakdown naturally.` : ""}
Mode: ${modeLabel}
Path: ${pathObj.label}
Answers: ${JSON.stringify(finalAnswers)}
Return ONLY raw JSON, no markdown:
{
  "verdict": "PASS"|"FAIL"|"MAYBE",
  "score": <0-100>,
  "oneliner": "<punchy funny max 10 words — no waffle, no slang>",
  "breakdown": "<2-3 sentences, personalised to their specific answers, brutally honest but entertaining, no slang>",
  "answer_scores": {"<TAG>": <0-100>},
  "advice": [{"tag": "<TAG>", "tip": "<1-2 sentence actionable advice for improving this specific area, direct and no-nonsense>"}]
}
Only include advice for tags where the score is below 60. Max 4 advice items. If all scores are high, return an empty array.`;
    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);
      setVerdict(parsed);
      const ns = {
        played: stats.played + 1,
        passes: stats.passes + (parsed.verdict === "PASS" ? 1 : 0),
        fails: stats.fails + (parsed.verdict === "FAIL" ? 1 : 0),
        maybes: stats.maybes + (parsed.verdict === "MAYBE" ? 1 : 0),
        totalScore: stats.totalScore + parsed.score,
      };
      saveStats(ns);
    } catch {
      setVerdict({ verdict: "FAIL", score: 0, oneliner: "Something broke. Not ideal.", breakdown: "Try again.", answer_scores: {}, advice: [] });
    }
    setLoading(false);
  }

  function reset() {
    transition(() => {
      setScreen("home"); setSelectedPath(null); setCustomPath(""); setCustomPathObj(null);
      setCustomQuestions(null); setCurrentQ(0); setAnswers({}); setSelectedOpt(null);
      setOpenText(""); setVerdict(null); setShowAnswers(false);
      // keep userName so greeting persists between rounds
    });
  }
  const avgScore = stats.played > 0 ? Math.round(stats.totalScore / stats.played) : 0;
  const winPct = stats.played > 0 ? Math.round((stats.passes / stats.played) * 100) : 0;

  const vColors = {
    PASS:     { bg: "rgba(74,222,128,0.08)",  color: "#4ade80", border: "rgba(74,222,128,0.2)"  },
    FAIL:     { bg: "rgba(248,113,113,0.08)", color: "#f87171", border: "rgba(248,113,113,0.2)" },
    MAYBE:    { bg: "rgba(251,191,36,0.08)",  color: "#fbbf24", border: "rgba(251,191,36,0.2)"  },
    STRUGGLE: { bg: "rgba(248,113,113,0.08)", color: "#f87171", border: "rgba(248,113,113,0.2)" },
  };

  // Map FAIL → STRUGGLE for display
  const displayVerdict = (v) => v === "FAIL" ? "STRUGGLE" : v;

  const iconBtn = (label, title, onClick) => (
    <button onClick={onClick} title={title} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, color: c.textMuted, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {label}
    </button>
  );

  const sectionLabel = (txt) => (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: c.textFaint, marginBottom: 10 }}>{txt}</div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: c.bg, minHeight: "100vh", color: c.text, transition: "background 0.3s, color 0.3s", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-10px); } }
        @keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.92)} 60%{transform:scale(1.03)} 100%{opacity:1;transform:scale(1)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .screen { animation: slideUp 0.3s ease forwards; }
        .screen-out { animation: slideDown 0.2s ease forwards; }
        .pop { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        button { font-family: 'DM Sans', sans-serif; cursor: pointer; }

        /* Desktop: icons inline with title, mobile row hidden */
        .header-icons-mobile { display: none !important; }
        .header-icons-desktop { display: flex !important; }

        /* Custom input rows always stacked, full width */
        .custom-input-row { display: flex; gap: 8px; flex-direction: column; }
        .custom-input-row input,
        .custom-input-row textarea,
        .custom-input-row button { width: 100%; }

        @media (max-width: 600px) {
          /* Header: icons move above title */
          .header-icons-mobile { display: flex !important; }
          .header-icons-desktop { display: none !important; }

          /* Taller textarea on mobile */
          .custom-input-row textarea { min-height: 56px; }

          /* Answers: hide the middle answer text column */
          .answer-val-col { display: none !important; }
        }
      `}</style>

      {/* GENERATING QUESTIONS OVERLAY */}
      {generatingQuestions && (
        <div style={{ position: "fixed", inset: 0, background: d ? "rgba(14,28,61,0.97)" : "rgba(255,255,255,0.97)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
          {/* Spinner */}
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${c.border}` }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid transparent`, borderTopColor: c.accent, animation: "spin 0.85s linear infinite" }} />
            <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `2px solid transparent`, borderTopColor: c.secondary, animation: "spin 1.3s linear infinite reverse" }} />
          </div>

          {/* Text */}
          <div style={{ textAlign: "center", maxWidth: 280 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: c.text, marginBottom: 8 }}>
              Researching {customPath}
            </div>
            <div style={{ fontSize: "0.82rem", color: c.textMuted, lineHeight: 1.6 }}>
              Building 12 questions tailored to your dream. This takes a few seconds.
            </div>
          </div>

          {/* Animated dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 0.2, 0.4, 0.6].map((delay, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent, animation: `pulse 1.4s ${delay}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} className="pop" style={{ background: c.modalBg, borderRadius: 20, border: `1px solid ${c.border}`, padding: "26px 26px 22px", maxWidth: 400, width: "100%", maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: c.text }}>
                {modal === "howtoplay" ? "How to play" : "Your stats"}
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: c.textMuted, fontSize: "1.1rem", lineHeight: 1 }}>✕</button>
            </div>

            {modal === "howtoplay" && (<>
              <p style={{ fontSize: "0.85rem", color: c.textMuted, lineHeight: 1.65, marginBottom: 20 }}>
                Pick a path. Answer <strong style={{ color: c.text }}>10 questions</strong> honestly. The AI judges you. No cap.
              </p>
              {[["Pick your dream", "Scroll through the scenarios and career dreams. Pick the one you'd most want to make it in — or the one you're most curious about."],
                ["Answer honestly", "Answer based on who you actually are right now — your real routine, current ability, and honest reactions. Not your ideal self."],
                ["Get the verdict", "You'll get a PASS, FAIL or MAYBE with a fit score, a sharp one-liner, and a personalised breakdown."],
                ["See your weak spots", "After the verdict, check your answer breakdown and the advice section to see exactly where you'd need to improve."]
              ].map(([t, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: c.accent, color: "#fff", fontSize: "0.72rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: c.text, marginBottom: 3 }}>{t}</div>
                    <div style={{ fontSize: "0.82rem", color: c.textMuted, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setModal(null)} style={{ marginTop: 8, width: "100%", padding: "13px", borderRadius: 11, border: "none", background: c.accent, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Let's go</button>
            </>)}

            {modal === "stats" && (<>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                {[
                  ["Played", String(stats.played)],
                  ["Pass rate", stats.played > 0 ? winPct + "%" : "—"],
                  ["Avg score", stats.played > 0 ? avgScore + "%" : "—"],
                  ["Passes", String(stats.passes)],
                  ["Struggles", String(stats.fails)],
                  ["Maybes", String(stats.maybes)],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, height: 76, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: c.accent, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: c.textFaint }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => saveStats(INITIAL_STATS)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: "0.82rem" }}>Reset</button>
                <button onClick={() => setModal(null)} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: c.accent, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>Close</button>
              </div>
            </>)}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", padding: "0 28px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <header style={{ padding: "40px 0 20px", borderBottom: `1px solid ${c.border}`, marginBottom: 36 }}>
          {/* Icons row — always on top on mobile, hidden on desktop (shown inline below) */}
          <div className="header-icons-mobile" style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            {iconBtn("?", "How to play", () => setModal("howtoplay"))}
            {iconBtn("📊", "Statistics", () => setModal("stats"))}
            {iconBtn(darkMode ? "☀️" : "🌙", "Toggle theme", () => setDarkMode(!darkMode))}
          </div>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div onClick={reset} style={{ cursor: "pointer" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.04em", textTransform: "uppercase", color: c.text }}>
                Am I <span style={{ color: c.accent }}>Built</span> For It
              </div>
              <div style={{ fontSize: "0.62rem", color: c.textFaint, letterSpacing: "0.06em", marginTop: 2 }}>find out if you'd actually survive.</div>
            </div>
            {/* Icons — desktop only, inline with title */}
            <div className="header-icons-desktop" style={{ display: "flex", gap: 6 }}>
              {iconBtn("?", "How to play", () => setModal("howtoplay"))}
              {iconBtn("📊", "Statistics", () => setModal("stats"))}
              {iconBtn(darkMode ? "☀️" : "🌙", "Toggle theme", () => setDarkMode(!darkMode))}
            </div>
          </div>
        </header>

        {/* HOME */}
        {screen === "home" && (
          <div className={animIn ? "screen" : "screen-out"}>

            {/* Name greeting / input */}
            {!nameSubmitted ? (
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: c.text, marginBottom: 6, lineHeight: 1.2 }}>
                  What should we call you?
                </div>
                <div style={{ fontSize: "0.85rem", color: c.textMuted, marginBottom: 18 }}>First name or nickname.</div>
                <div className="custom-input-row" style={{ display: "flex", gap: 8 }}>
                  <textarea
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && nameInput.trim()) { e.preventDefault(); setUserName(nameInput.trim()); setNameSubmitted(true); } }}
                    placeholder="e.g. Thomas, T, Tommo..."
                    rows={2}
                    style={{ flex: 1, padding: "13px 16px", borderRadius: 11, border: `1.5px solid ${c.border}`, background: c.surface, color: c.text, fontSize: "0.92rem", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.5 }}
                    autoFocus
                  />
                  <button
                    onClick={() => { if (nameInput.trim()) { setUserName(nameInput.trim()); setNameSubmitted(true); } }}
                    style={{ padding: "13px 22px", borderRadius: 11, border: "none", background: nameInput.trim() ? c.accent : c.border, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.04em", cursor: nameInput.trim() ? "pointer" : "not-allowed" }}>
                    Let's go →
                  </button>
                </div>
                <div style={{ marginTop: 10 }}>
                  <button onClick={() => { setUserName(""); setNameSubmitted(true); }} style={{ background: "none", border: "none", color: c.textFaint, fontSize: "0.75rem", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer", padding: 0 }}>
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Greeting */}
                {userName && (
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: c.text, lineHeight: 1.15 }}>
                      Hi {userName}. <span style={{ color: c.accent }}>Are you actually built for it?</span>
                    </div>
                    <div style={{ fontSize: "0.88rem", color: c.textMuted, marginTop: 8 }}>Pick a dream or type your own. Any career, lifestyle, or challenge. No sugarcoating.</div>
                  </div>
                )}

                {/* Custom path — prominent, at top */}
                <div style={{ marginBottom: 28 }}>
                  <div className="custom-input-row" style={{ display: "flex", gap: 8 }}>
                    <input
                      value={customPath}
                      onChange={e => { setCustomPath(e.target.value); if (selectedPath !== "__custom__") setSelectedPath(null); }}
                      onFocus={() => setSelectedPath(null)}
                      onKeyDown={e => { if (e.key === "Enter" && customPath.trim() && !generatingQuestions) { setSelectedPath("__custom__"); generateCustomQuestions().then(ok => { if (ok) startQuestions(); }); } }}
                      placeholder="e.g. Formula 1 Driver, Marine, Tattoo Artist..."
                      style={{ flex: 1, padding: "14px 16px", borderRadius: 11, border: `1.5px solid ${customPathObj ? c.accent : c.border}`, background: c.surface, color: c.text, fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <button
                      onClick={async () => { setSelectedPath("__custom__"); const ok = await generateCustomQuestions(); if (ok) startQuestions(); }}
                      disabled={!customPath.trim() || generatingQuestions}
                      style={{ padding: "14px 22px", borderRadius: 11, border: "none", background: customPath.trim() && !generatingQuestions ? c.accent : c.border, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.04em", cursor: customPath.trim() && !generatingQuestions ? "pointer" : "not-allowed", whiteSpace: "nowrap", minWidth: 100 }}>
                      {generatingQuestions ? (
                        <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
                          {[0, 0.15, 0.3].map((delay, i) => <span key={i} style={{ display: "block", width: 4, height: 4, borderRadius: "50%", background: "#fff", animation: `pulse 1.2s ${delay}s infinite` }} />)}
                        </span>
                      ) : "Generate →"}
                    </button>
                  </div>
                  {generatingQuestions && null}
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: c.border }} />
                  <div style={{ fontSize: "0.7rem", color: c.textFaint, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>or choose a dream</div>
                  <div style={{ flex: 1, height: 1, background: c.border }} />
                </div>

                {/* 4 curated cards — clicking goes straight to questions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { id: "football", icon: "⚽", label: "Premier League Footballer", sub: "Age, pace, technical ability" },
                    { id: "loveisland", icon: "🌴", label: "Love Island", sub: "Villa drama & vibes" },
                    { id: "gordon", icon: "👨‍🍳", label: "Gordon Ramsay's Kitchen", sub: "Michelin-star pressure" },
                    { id: "standup", icon: "🎤", label: "Stand-up Comedian", sub: "Timing, confidence, skin" },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPath(p.id);
                        setCustomPath(""); setCustomPathObj(null); setCustomQuestions(null);
                        transition(() => { setCurrentQ(0); setAnswers({}); setSelectedOpt(null); setOpenText(""); setScreen("questions"); });
                      }}
                      style={{ padding: "20px 18px", borderRadius: 16, border: `1.5px solid ${c.border}`, background: c.surface, cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 10, transition: "all 0.18s", position: "relative", overflow: "hidden" }}
                      onMouseEnter={e => { e.currentTarget.style.border = `1.5px solid ${c.accent}`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.border = `1.5px solid ${c.border}`; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{p.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: c.text, lineHeight: 1.3, marginBottom: 4 }}>{p.label}</div>
                        <div style={{ fontSize: "0.7rem", color: c.textFaint }}>{p.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* QUESTIONS */}
        {screen === "questions" && (
          <div className={animIn ? "screen" : "screen-out"} key={currentQ}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: c.textMuted, fontSize: "0.82rem", padding: 0 }}>← Back</button>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: totalQ }, (_, i) => (
                  <div key={i} style={{ height: 2, width: 18, borderRadius: 2, background: i < currentQ ? c.accent : i === currentQ ? c.textMuted : c.border, transition: "background 0.3s" }} />
                ))}
              </div>
              <div style={{ fontSize: "0.68rem", color: c.textFaint, fontWeight: 600 }}>{currentQ + 1}/{totalQ}</div>
            </div>

            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, marginBottom: 10 }}>
              {questions[currentQ].tag}
              {questions[currentQ].type === "open" && <span style={{ marginLeft: 8, color: c.secondary, fontSize: "0.58rem", letterSpacing: "0.1em" }}>OPEN QUESTION</span>}
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: c.text, lineHeight: 1.45, marginBottom: 22 }}>
              {questions[currentQ].q}
            </div>

            {questions[currentQ].type === "open" ? (
              <div style={{ marginBottom: 24 }}>
                <textarea
                  value={openText}
                  onChange={e => setOpenText(e.target.value)}
                  placeholder="Write your answer here — be honest and specific..."
                  rows={5}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${openText.trim() ? c.accent : c.border}`, background: c.surface, color: c.text, fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, resize: "none", outline: "none", transition: "border-color 0.15s" }}
                />
                <div style={{ fontSize: "0.68rem", color: c.textFaint, marginTop: 6 }}>
                  The more specific you are, the more accurate your verdict will be.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {(questions[currentQ].opts || []).map(opt => (
                  <button key={opt} onClick={() => setSelectedOpt(opt)} style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${selectedOpt === opt ? c.accent : c.border}`, background: selectedOpt === opt ? c.accent : c.surface, color: selectedOpt === opt ? "#fff" : c.textMuted, fontSize: "0.87rem", fontWeight: selectedOpt === opt ? 600 : 400, textAlign: "left", transition: "all 0.14s", transform: selectedOpt === opt ? "scale(1.01)" : "scale(1)" }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={skipQuestion} style={{ background: "none", border: "none", color: c.textFaint, fontSize: "0.78rem", textDecoration: "underline", textUnderlineOffset: 3, padding: 0 }}>Skip</button>
              {(() => {
                const q = questions[currentQ];
                const hasAnswer = q.type === "open" ? openText.trim().length > 0 : !!selectedOpt;
                return (
                  <button onClick={nextQuestion} disabled={!hasAnswer} style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: hasAnswer ? c.accent : c.border, color: hasAnswer ? "#fff" : c.textFaint, fontFamily: "'Syne', sans-serif", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s", cursor: hasAnswer ? "pointer" : "not-allowed" }}>
                    {currentQ + 1 === totalQ ? "Get verdict" : "Next →"}
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* VERDICT */}
        {screen === "verdict" && (
          <div className={animIn ? "screen" : "screen-out"}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "56px 0", color: c.textMuted, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 0.2, 0.4].map((delay, i) => <span key={i} style={{ display: "block", width: 5, height: 5, borderRadius: "50%", background: c.accent, animation: `pulse 1.2s ${delay}s infinite` }} />)}
                </div>
                Evaluating your answers...
              </div>
            ) : verdict && (() => {
              const vc = vColors[verdict.verdict] || vColors.FAIL;
              const weakSpots = (verdict.advice || []);
              return (
                <>
                  {/* Name + path heading */}
                  {userName && (
                    <div style={{ fontSize: "0.78rem", color: c.textFaint, marginBottom: 6, fontWeight: 500 }}>
                      {userName}'s verdict
                    </div>
                  )}
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: c.text, lineHeight: 1.2, marginBottom: 10 }}>
                    {pathObj?.label}
                  </div>

                  {/* Verdict badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 6, background: vc.bg, color: vc.color, border: `1px solid ${vc.border}` }}>
                      {displayVerdict(verdict.verdict)}
                    </div>
                  </div>

                  {/* Donut + score */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                    <FitDonut score={verdict.score} verdict={verdict.verdict} />
                  </div>

                  {/* One-liner */}
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.45rem", fontWeight: 800, color: c.text, lineHeight: 1.25, marginBottom: 14 }}>
                    {verdict.oneliner}
                  </div>

                  {/* Breakdown */}
                  <div style={{ fontSize: "0.87rem", color: c.textMuted, lineHeight: 1.75, marginBottom: 24 }}>
                    {verdict.breakdown}
                  </div>

                  {/* Advice section */}
                  {weakSpots.length > 0 && (
                    <>
                      <div style={{ height: 1, background: c.border, marginBottom: 20 }} />
                      {sectionLabel("Where to level up")}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                        {weakSpots.map(({ tag, tip }) => (
                          <div key={tag} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ flexShrink: 0, marginTop: 1, width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", marginTop: 6 }} />
                            <div>
                              <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: c.accent, marginBottom: 4 }}>{tag}</div>
                              <div style={{ fontSize: "0.84rem", color: c.textMuted, lineHeight: 1.6 }}>{tip}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Answer breakdown — always visible */}
                  {Object.keys(answers).length > 0 && (
                    <>
                      <div style={{ height: 1, background: c.border, marginBottom: 20 }} />
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: c.text, marginBottom: 14, letterSpacing: "0.01em" }}>Your answers</div>
                      <div style={{ borderRadius: 12, border: `1px solid ${c.border}`, overflow: "hidden", marginBottom: 20 }}>
                        {Object.entries(answers).map(([tag, val], i, arr) => {
                          const s = verdict.answer_scores?.[tag];
                          return (
                            <div key={tag} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: i % 2 === 0 ? c.surface : "transparent", borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : "none" }}>
                              <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: c.textFaint, minWidth: 85 }}>{tag}</span>
                              <span className="answer-val-col" style={{ fontSize: "0.82rem", color: c.textMuted, flex: 1 }}>{val}</span>
                              {s !== undefined && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                  <div style={{ width: 36, height: 4, borderRadius: 2, background: c.border, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: s + "%", background: scoreColor(s), borderRadius: 2 }} />
                                  </div>
                                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: scoreColor(s), minWidth: 26, textAlign: "right" }}>{s}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <button onClick={reset} style={{ width: "100%", padding: 13, borderRadius: 12, border: `1px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: "0.85rem", transition: "all 0.2s" }}>
                    Try a different dream
                  </button>
                </>
              );
            })()}
          </div>
        )}

        <div style={{ height: 52 }} />
      </div>
    </div>
  );
}
