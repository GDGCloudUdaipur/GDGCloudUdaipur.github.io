/* ==========================================================================
   CCD Udaipur 2026 — site content.
   Everything an organiser needs to edit lives in this one file.
   Links, date, venue, agenda, speakers, partners, FAQ.
   ========================================================================== */
window.CCD = {
  event: {
    name: "Google Cloud Community Days Udaipur 2026",
    short: "CCD Udaipur '26",
    tagline: "From attendees to builders.",
    // ISO start/end in IST. Keep the +05:30 offset.
    start: "2026-12-06T09:00:00+05:30",
    end: "2026-12-06T18:30:00+05:30",
    // While false, the date shows a small "tentative" tag everywhere.
    dateConfirmed: true,
    expected: "300+",
  },

  links: {
    // Tickets are sold on KonfHub
    register: "https://konfhub.com/google-cloud-community-days-udaipur-2026",
    tickets: "https://konfhub.com/google-cloud-community-days-udaipur-2026",
    // The official event / chapter page on the GDG community platform
    event: "https://gdg.community.dev/gdg-cloud-udaipur/",
    cfp: "https://gdg.community.dev/gdg-cloud-udaipur/",
    volunteer: "https://gdg.community.dev/gdg-cloud-udaipur/",
    sponsor: "https://gdg.community.dev/gdg-cloud-udaipur/",
    community: "https://gdg.community.dev/gdg-cloud-udaipur/",
    // Leave "" to hide the email buttons.
    email: "",
  },

  venue: {
    name: "Venue reveal soon",
    area: "Udaipur, Rajasthan",
    address: "Shortlist: a lakeside 5-star hotel or a builder-friendly community space in the city",
    lat: 24.5764,
    lng: 73.6813,
    confirmed: false,
  },

  stats: [
    { value: 2000, suffix: "+", label: "members in GDG Cloud Udaipur" },
    { value: 3000, suffix: "+", label: "developers reached across Rajasthan" },
    { value: 300, suffix: "+", label: "builders expected on the day" },
    { value: 4, suffix: "", label: "stops on the road to CCD" },
  ],

  journey: [
    { when: "6 Sep 2026", title: "Build with AI", place: "Kickoff", text: "Beginner-friendly Gemini and AI introductions that opened the season.", done: true, color: "blue" },
    { when: "Sep – Oct 2026", title: "Code for Communities 2.0", place: "Hackathon", text: "Teams solving real problems for local Udaipur businesses, with mentoring from the chapter.", done: true, color: "green" },
    { when: "Oct – Nov 2026", title: "Awareness workshops", place: "Colleges & cafés", text: "Small hands-on sessions across the city to warm up for the big day.", done: false, color: "yellow" },
    { when: "6 Dec 2026", title: "Cloud Community Days", place: "The main event", text: "300+ developers learning, building and shipping together in the City of Lakes.", done: false, color: "red" },
  ],

  tracks: {
    ai:    { label: "AI & Agents",       color: "blue" },
    cloud: { label: "Cloud & Data",      color: "green" },
    lab:   { label: "Build Labs",        color: "yellow" },
    lead:  { label: "Leadership",        color: "red" },
    all:   { label: "Everyone",          color: "ink" },
  },

  // The agenda is announced soon. While this list is empty the page shows a
  // sealed "being written" card. Add sessions and the full planner (filters,
  // stars, calendar export, live banner) switches on by itself:
  // { id: "s01", start: "09:30", end: "10:00", track: "all", room: "Durbar Hall",
  //   title: "Opening keynote", desc: "…", level: "All", speaker: "sp1" },
  agenda: [],

  // Speakers are revealed soon. While this list is empty, `speakerSlots`
  // sealed jharokha windows show "Revealing soon". Example entry:
  // { id: "sp1", name: "Ada Lovelace", role: "GDE, Cloud", company: "Analytical Engines",
  //   photo: "assets/img/speakers/ada.jpg", bio: "…", links: { linkedin: "https://…" }, seal: "blue" },
  speakers: [],
  speakerSlots: 8,

  // Where Mewar meets Google
  mewar: [
    { icon: "lake", place: "Lake Pichola", product: "BigQuery", color: "blue", text: "Vast, deep and calm on the surface. Ask it anything and the answer comes up from the depths." },
    { icon: "boat", place: "The shikaras", product: "Cloud Run", color: "green", text: "Dozens of boats at sunset, none at 2 a.m. Scales out with the crowd and back to zero." },
    { icon: "diya", place: "Diyas on the ghat", product: "Firebase", color: "yellow", text: "Light one flame and the whole ghat sees it at once. Realtime, the Udaipur way." },
    { icon: "puppet", place: "Bagore ki Haveli", product: "Gemini", color: "blue", text: "Every evening the haveli tells old Mewar stories. Gemini tells yours, in every language." },
    { icon: "ropeway", place: "Karni Mata ropeway", product: "ADK agents", color: "red", text: "Why climb the hill yourself? Agents built with ADK do the climb and bring back the view." },
    { icon: "fort", place: "The walls of Mewar", product: "Cloud Security", color: "green", text: "Mewar built walls that run for kilometres. Google Cloud watches every gate of yours." },
  ],

  formats: [
    { icon: "spark", title: "End-to-end builds", text: "Lab tracks where you follow along and leave with a complete, deployed project, not a slide deck." },
    { icon: "half", title: "Rapid hacks", text: "Two 30-minute mini hackathons in the middle of the day. Surprise prompt, three people, one working demo." },
    { icon: "flower", title: "Live quizzes", text: "Cloud Ka Sawaal, a game-show round on Cloud, AI and Udaipur with instant prizes for the top scorers." },
    { icon: "star", title: "AI playground", text: "A booth of strange, delightful Gemini builds from local hackathon winners. Try them, break them, fork them." },
    { icon: "spark", title: "Leadership room", text: "CEOs and founders, not just engineers, on leading and hiring through a fast-changing decade." },
    { icon: "half", title: "Hallway track", text: "Hiring teams, GDEs and Googlers at lunch. The conversation that starts your next thing." },
  ],

  sponsorTiers: [
    { tier: "Title partner", slots: 1, perks: ["Naming on stage and all media", "Keynote slot", "Premium booth", "20 passes"] },
    { tier: "Gold", slots: 3, perks: ["Logo on stage and site", "Booth in the courtyard", "Lab or talk slot", "10 passes"] },
    { tier: "Silver", slots: 4, perks: ["Logo on site and banners", "Table in the hallway", "5 passes"] },
    { tier: "Community", slots: 6, perks: ["Logo on site", "Social shout-out", "2 passes"] },
  ],
  sponsors: [
    // { tier: "Gold", name: "Company", logo: "assets/img/sponsors/company.svg", url: "https://…" },
  ],

  team: [
    // { name: "…", role: "Organiser", photo: "assets/img/team/….jpg", link: "https://…" },
  ],

  explore: [
    { kind: "Getting here", title: "By air", text: "Maharana Pratap Airport (UDR) is about 22 km from the city, with direct flights from Delhi, Mumbai, Bengaluru and Hyderabad." },
    { kind: "Getting here", title: "By train", text: "Udaipur City station connects to Delhi, Jaipur, Ahmedabad and Mumbai. The Old City is 10 minutes by auto." },
    { kind: "Getting here", title: "By road", text: "About 4 hours from Ahmedabad and 6 from Jaipur on good highways. Plenty of Volvo sleepers overnight." },
    { kind: "Eat", title: "Dal baati churma", text: "The Mewari classic. Save room for kachori at breakfast and a glass of kesar milk after dark." },
    { kind: "Eat", title: "Lakeside rooftops", text: "Gangaur Ghat and Lal Ghat rooftops at sunset, with the City Palace lighting up across the water." },
    { kind: "See", title: "City Palace & Lake Pichola", text: "Walk the palace in the morning, take the boat to Jag Mandir in the afternoon." },
    { kind: "See", title: "Sajjangarh at sunset", text: "The Monsoon Palace on the Aravalli ridge has the best sunset view over the lakes." },
    { kind: "See", title: "Fateh Sagar evenings", text: "The city's favourite promenade. Camel rides, corn on the cob and a breeze off the lake." },
    { kind: "Know", title: "December weather", text: "Warm, sunny days in the mid-20s °C and cool evenings by the lake. Bring a light jacket for the sunset photo." },
    { kind: "Stay", title: "Where to stay", text: "Old City havelis near Lal Ghat for the vibe, Fateh Sagar side for quiet, Hiran Magri for budget and bike rentals." },
  ],

  faq: [
    { q: "Who is this for?", a: "Developers, students, architects, data people, founders and anyone curious about building with Google Cloud and AI. The agenda is announced soon, with every session marked by level and Build Labs that start from zero." },
    { q: "Where do I buy a ticket?", a: "Tickets are sold on KonfHub. The ticket page has current prices, student passes and any group or community discounts. The GDG Cloud Udaipur event page has all the official updates." },
    { q: "Do I need to bring a laptop?", a: "For Build Labs and Rapid Hacks, yes. Cloud credits are provided, so you do not need a billing account. The talk tracks need nothing but curiosity." },
    { q: "Will there be food?", a: "Breakfast, a Mewari lunch, and chai with snacks twice. Tell us about dietary needs when you register." },
    { q: "Can I speak?", a: "Yes. The call for speakers is open for talks, labs and lightning demos. First-time speakers from Rajasthan are especially welcome and we will pair you with a mentor." },
    { q: "Can I volunteer?", a: "Please do. Volunteers get a team T-shirt, a front-row seat to how events are made and our lasting gratitude." },
    { q: "Is there a code of conduct?", a: "Yes. CCD Udaipur follows the Google Developer Groups community guidelines. Everyone deserves a harassment-free, welcoming day." },
    { q: "When will the agenda and speakers be announced?", a: "Soon. Speakers are revealed first, then the full agenda. Follow GDG Cloud Udaipur to hear the moment they drop." },
    { q: "I'm coming from outside Udaipur. Any help?", a: "See the Explore Udaipur section for travel, stays and food. December is peak wedding and tourist season, so book early." },
  ],

  quiz: [
    { q: "Which Google Cloud service runs containers serverlessly and scales to zero?", o: ["Compute Engine", "Cloud Run", "Cloud Storage", "Cloud DNS"], a: 1 },
    { q: "Udaipur is best known as the…", o: ["Pink City", "Blue City", "City of Lakes", "Golden City"], a: 2 },
    { q: "Google's open-source framework for building multi-agent systems is called…", o: ["Agent Development Kit (ADK)", "TensorFlow Lite", "Flutter", "Angular"], a: 0 },
    { q: "The City Palace stands on the banks of which lake?", o: ["Fateh Sagar", "Udai Sagar", "Lake Pichola", "Badi Lake"], a: 2 },
    { q: "What does MCP stand for in the agent world?", o: ["Multi Cloud Platform", "Model Context Protocol", "Managed Compute Pool", "Machine Code Parser"], a: 1 },
    { q: "Sajjangarh Palace on the Aravalli hills is also called the…", o: ["Monsoon Palace", "Lake Palace", "Wind Palace", "Mirror Palace"], a: 0 },
    { q: "Google Cloud's serverless, petabyte-scale data warehouse is…", o: ["Bigtable", "Spanner", "BigQuery", "Firestore"], a: 2 },
    { q: "Which protocol lets AI agents from different vendors talk to each other?", o: ["A2A (Agent2Agent)", "HTTP/3", "gRPC-Web", "WebRTC"], a: 0 },
    { q: "Who founded Udaipur in 1559?", o: ["Maharana Pratap", "Maharana Udai Singh II", "Rana Sanga", "Bappa Rawal"], a: 1 },
    { q: "Google's managed Kubernetes service is…", o: ["GKE", "EKS", "AKS", "Cloud Functions"], a: 0 },
  ],

  hack: {
    problems: [
      "help boat operators on Lake Pichola predict how busy the next hour will be",
      "let Shilpgram artisans list a handicraft by just taking one photo",
      "find a quiet chai spot in the Old City for a tourist right now",
      "flag litter on Fateh Sagar from photos people already post",
      "retell Mewari folk tales for kids, in Hindi and English",
      "help a marble trader track stock across three godowns",
      "turn a school's WhatsApp notices into a weekly parent digest",
      "plan a 2-hour heritage walk around whatever time you have left",
      "help a dhaba owner price the thali when vegetable costs change",
      "match volunteers to lake clean-up drives this weekend",
      "tell a first-time visitor which ghat has the best sunset today",
      "translate a street-food menu and explain every dish",
    ],
    tools: ["the Gemini API", "an ADK agent", "Cloud Run", "Firebase", "BigQuery", "Vertex AI Search", "the Gemini Live API", "Imagen", "Firestore", "Maps Platform"],
    twists: [
      "It has to work on a patchy 2G connection.",
      "Your users only speak Hindi.",
      "No typing allowed. Voice or camera only.",
      "Under 100 lines of code.",
      "It must show something on a map.",
      "Explain it so your nani would use it.",
      "It must be useful offline.",
      "Demo it without touching the keyboard.",
    ],
  },

  personas: {
    ai:       { title: "Weaver of Agents",      line: "You see the whole loom. Agents, tools and prompts, woven into something that works on its own." },
    cloud:    { title: "Keeper of the Clusters", line: "Calm under load. You make things scale while everyone else is still reading the pricing page." },
    data:     { title: "Scout of the Lakes",     line: "You find the signal under the surface. Data is your Lake Pichola and you know every current." },
    web:      { title: "Artisan of Interfaces",  line: "Like the painters of Mewar, you make the detail matter. People feel your work before they read it." },
    security: { title: "Guardian of the Fort",   line: "Nobody gets past the Tripolia gate without you knowing. You make the whole kingdom safe to build in." },
    lead:     { title: "Rana of Roadmaps",       line: "You see the ridge and the path to it. Teams follow because you make the next step obvious." },
  },

  // The glory of Mewar: the scroll story with Maharana Pratap and Chetak.
  // `at` is the scroll progress (0–1) at which each card appears.
  glory: [
    { at: 0.1, when: "8th century", title: "Bappa Rawal", text: "The rule of Mewar begins at Chittor, and with it a line that would guard these hills for more than a thousand years." },
    { at: 0.22, when: "15th century", title: "Rana Kumbha", text: "The Vijay Stambh rises at Chittor and the great walls of Kumbhalgarh run for kilometres across the Aravallis." },
    { at: 0.34, when: "1559", title: "Maharana Udai Singh II", text: "A new capital is founded on the banks of Lake Pichola. Udaipur, the City of Lakes, is born." },
    { at: 0.45, when: "18 June 1576", title: "Haldighati", text: "Maharana Pratap rides into the yellow pass on Chetak, the horse masked with an elephant's trunk so the war elephants would take him for one of their own." },
    { at: 0.56, when: "The leap", title: "Chetak's leap", text: "Wounded, Chetak carries Pratap out of the battle and, as the story goes, clears a stream no horse should have cleared." },
    { at: 0.8, when: "Haldighati", title: "Chetak Smarak", text: "A memorial stands near where Chetak fell. Mewar still tells the story of the horse that saved its king." },
    { at: 0.93, when: "6 December 2026", title: "The builders of Mewar", text: "The same hills, a new kind of courage. Hundreds of builders gather in Udaipur to make something that lasts." },
  ],

  // Iconic places for the horizontal gallery. `scene` picks the drawing in js/places.js.
  places: [
    { scene: "fatehsagar", name: "Fateh Sagar & Moti Magri", hi: "फतह सागर", tag: "Lake · Memorial", text: "The city's favourite lake, with Nehru Garden on its island and the Maharana Pratap memorial watching from Moti Magri.", q: "Moti Magri Udaipur" },
    { scene: "saheliyon", name: "Saheliyon ki Bari", hi: "सहेलियों की बाड़ी", tag: "Garden · 18th century", text: "The garden of the maidens: marble elephants, lotus pools and fountains that still sing in the afternoon.", q: "Saheliyon ki Bari Udaipur" },
    { scene: "jagdish", name: "Jagdish Temple", hi: "जगदीश मंदिर", tag: "Temple · 1651", text: "A carved Indo-Aryan temple at the heart of the Old City, climbed by 32 marble steps between stone elephants.", q: "Jagdish Temple Udaipur" },
    { scene: "sajjangarh", name: "Sajjangarh Monsoon Palace", hi: "सज्जनगढ़", tag: "Palace · 1884", text: "A white palace on the Aravalli ridge, built to watch the monsoon clouds roll in over the lakes.", q: "Sajjangarh Monsoon Palace" },
    { scene: "bagore", name: "Bagore ki Haveli & Gangaur Ghat", hi: "बागोर की हवेली", tag: "Haveli · Ghat", text: "Lamps on the ghat, folk dance in the courtyard and the whole haveli reflected in Pichola after dark.", q: "Bagore ki Haveli Udaipur" },
  ],

  // Google products that float up in "Beneath the lake"
  products: [
    { id: "gemini", name: "Gemini", line: "Multimodal models for everything you build" },
    { id: "cloud", name: "Google Cloud", line: "The platform under it all" },
    { id: "vertex", name: "Vertex AI", line: "Train, tune and ship models" },
    { id: "firebase", name: "Firebase", line: "Apps with auth, data and hosting" },
    { id: "bigquery", name: "BigQuery", line: "Ask your data anything" },
    { id: "run", name: "Cloud Run", line: "Containers that scale to zero" },
    { id: "gke", name: "GKE", line: "Kubernetes, managed" },
    { id: "android", name: "Android", line: "Apps in billions of pockets" },
    { id: "flutter", name: "Flutter", line: "One codebase, every screen" },
    { id: "maps", name: "Maps Platform", line: "Put Udaipur on the map" },
    { id: "adk", name: "ADK", line: "Build agents that act" },
    { id: "colab", name: "Colab", line: "Notebooks in the browser" },
  ],

  // What Moti, the Udaipur bot, says in each section
  bot: {
    top: ["Khamma ghani! I'm Moti, your guide to CCD Udaipur.", "Tap a kite in the sky. I dare you."],
    story: ["Keep scrolling. The whole day passes over the lake."],
    glory: ["Hukum! This is Mewar's story. Scroll slowly.", "Chetak's leap is coming up…"],
    mewar: ["Five hundred years of scaling, storing and securing. Very cloud-native."],
    places: ["Swipe through the city. Every place opens in Google Maps."],
    dive: ["Holding my breath… glub glub.", "These bubbles are all things you can build with."],
    journey: ["Two stops done, two to go."],
    agenda: ["The seal breaks soon. Add the date to your calendar!"],
    speakers: ["Someone is behind every window. Revealing soon!"],
    play: ["Make a Shahi Pass. It looks great on LinkedIn."],
    explore: ["Try the dal baati churma. Trust me."],
    venue: ["Venue reveal soon. Somewhere with a view, I hope."],
    partners: ["Partner with us and I'll wave your flag."],
    faq: ["Ask away. I'm a very helpful bot."],
    register: ["Tickets are on KonfHub. Go go go!"],
    click: ["Beep! Build something great.", "Moustache calibrated.", "I run on chai and Cloud Run.", "Padharo mhare des!", "Did you find all seven lotuses?", "My turban is 100% leheriya."],
  },

  // The seven lakes of the hidden hunt (order = discovery badges).
  lakes: ["Pichola", "Fateh Sagar", "Udai Sagar", "Swaroop Sagar", "Rang Sagar", "Doodh Talai", "Badi"],
};
