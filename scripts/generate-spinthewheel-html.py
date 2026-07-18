import re
import os
from collections import defaultdict

INPUT = r"d:\picker-wheel-appv19v\app\spinthewheel.md"
OUTPUT = r"d:\picker-wheel-appv19v\app\spinthewheel-tools.html"

with open(INPUT, "r", encoding="utf-8") as f:
    content = f.read()

urls = re.findall(r"<loc>(https://spinthewheel\.app/([^<]+))</loc>", content)

# Deduplicate while preserving order
seen = set()
deduped = []
for full, path in urls:
    if full not in seen:
        seen.add(full)
        deduped.append((full, path))
urls = deduped

OFFICIAL_TOOLS = {
    "spin-the-wheel-random-picker": "Spin the Wheel Random Picker",
    "the-wheel-of-fortune": "The Wheel of Fortune",
    "magic-8-ball": "Magic 8 Ball",
    "slime-challenge": "Slime Challenge",
    "what-to-do": "What To Do",
    "yes-or-no": "Yes or No",
    "wheel-of-colors": "Wheel of Colors",
    "twister-wheel": "Twister Wheel",
    "random-number-picker": "Random Number Picker",
    "flip-a-coin": "Flip a Coin",
}

SITE_PAGES = {
    "contact-us": "Contact Us",
    "help": "Help",
    "privacy-policy": "Privacy Policy",
    "terms-and-conditions": "Terms and Conditions",
    "wheels": "Wheels Directory",
}

CATEGORY_KEYWORDS = {
    "Animals and Nature": [
        "animal", "dog", "cat", "bird", "fish", "horse", "pet", "nature", "zoo",
        "wildlife", "dinosaur", "shark", "wolf", "bear", "lion", "tiger", "elephant",
        "penguin", "unicorn", "dragon", "creature", "insect", "bug", "farm", "jungle",
        "forest", "ocean", "sea", "whale", "dolphin", "snake", "frog", "bunny",
        "rabbit", "deer", "fox", "monkey", "gorilla", "panda", "koala", "sloth",
        "bee", "butterfly", "owl", "eagle", "parrot", "hamster", "turtle", "lizard",
        "reptile", "mammal", "habitat", "ecosystem", "plant", "tree", "flower", "garden",
    ],
    "Board Games": [
        "board-game", "monopoly", "chess", "checkers", "scrabble", "uno", "card-game",
        "dice", "dungeons", "dnd", "d-and-d", "tabletop", "clue", "risk", "catan",
        "poker", "blackjack", "solitaire", "jenga", "trivia", "puzzle-game",
        "game-of-life", "battleship", "yahtzee",
    ],
    "Chance and Fortune": [
        "luck", "lucky", "fortune", "fate", "destiny", "chance", "probability",
        "percent", "rng", "random", "roulette", "lottery", "jackpot", "win", "lose",
        "casino", "bet", "odds", "tarot", "zodiac", "horoscope", "aura", "psychic",
        "future", "prediction", "oracle", "hexagram", "yi-jing", "crystal", "mystic",
        "superstition", "omen",
    ],
    "Comedy and Fun": [
        "funny", "comedy", "meme", "joke", "lol", "haha", "silly", "weird", "crazy",
        "bored", "boredom", "random-fun", "prank", "roast", "cringe", "chaos",
        "goofy", "hilarious", "laugh", "humor", "ridiculous", "nonsense", "derp",
        "troll", "wtf", "oof", "bruh",
    ],
    "Entertainment": [
        "movie", "film", "tv", "show", "series", "netflix", "disney", "marvel", "dc",
        "actor", "actress", "celebrity", "singer", "band", "artist", "song",
        "music-video", "concert", "album", "pop", "rock", "rap", "hip-hop", "kpop",
        "k-pop", "idol", "drama", "anime", "manga", "cartoon", "character",
        "streamer", "youtube", "tiktok", "influencer", "fandom", "fan", "ship",
        "otp", "harry-potter", "star-wars", "pixar", "dreamworks", "horror-movie",
        "romance", "sitcom", "reality-tv", "broadway", "musical", "theater",
    ],
    "Food and Drink": [
        "food", "drink", "eat", "meal", "lunch", "dinner", "breakfast", "snack",
        "dessert", "candy", "chocolate", "pizza", "burger", "sushi", "taco", "pasta",
        "coffee", "tea", "soda", "juice", "restaurant", "fastfood", "fast-food",
        "cuisine", "recipe", "cooking", "bake", "fruit", "vegetable", "meat",
        "seafood", "ice-cream", "cake", "cookie", "cereal", "chip", "ramen", "noodle",
        "sandwich", "salad", "soup", "steak", "chicken", "bbq", "grill", "vegan",
        "vegetarian", "starbucks", "mcdonald", "kfc", "subway",
    ],
    "Party and Games": [
        "party", "game", "truth", "dare", "charades", "spin-bottle", "drinking",
        "celebration", "birthday-party", "sleepover", "icebreaker", "challenge",
        "minigame", "group-game", "family-game", "kids-game", "classroom", "school",
        "teacher", "student", "camp", "scout", "team-building", "hangout", "friend",
        "bff", "never-have-i", "would-you-rather", "hot-seat", "spin-challenge",
        "elimination", "punishment", "forfeit",
    ],
    "Music": [
        "music", "song", "singer", "band", "album", "artist", "pop", "rock", "rap",
        "hip-hop", "country-music", "jazz", "classical", "edm", "dj", "beat", "lyric",
        "concert", "tour", "grammy", "billboard", "spotify", "playlist",
        "taylor-swift", "bts", "beatles", "drake", "eminem", "kanye", "ariana",
        "billie", "olivia", "sabrina", "blink-182", "metallica", "nirvana", "queen",
        "michael-jackson", "beyonce", "rihanna", "justin", "weeknd", "coldplay",
        "radiohead",
    ],
    "Sports": [
        "sport", "nba", "nfl", "mlb", "nhl", "soccer", "football", "basketball",
        "baseball", "hockey", "tennis", "golf", "cricket", "rugby", "volleyball",
        "wrestling", "boxing", "mma", "ufc", "olympic", "fifa", "world-cup",
        "premier-league", "champion-league", "player", "team", "athlete", "coach",
        "stadium", "league", "match", "tournament", "super-bowl", "playoff", "draft",
        "fantasy-sport", "espn", "sport-team",
    ],
    "Tools": [
        "picker", "random-picker", "name-picker", "number-picker", "letter",
        "alphabet", "color-picker", "decision", "selector", "generator", "tool",
        "utility", "spinner", "wheel-of-names", "weighted", "timer", "counter",
        "calculator", "list", "choice", "option", "assign", "group", "split",
        "team-picker", "classroom-tool", "teacher-tool",
    ],
    "Travel and World": [
        "country", "countries", "state", "states", "city", "cities", "capital",
        "continent", "world", "travel", "nation", "island", "flag", "geography",
        "map", "europe", "asia", "africa", "america", "australia", "canada",
        "mexico", "brazil", "india", "china", "japan", "korea", "france", "germany",
        "italy", "spain", "uk", "england", "vacation", "destination", "landmark",
        "passport", "culture", "territory",
    ],
    "Video Games": [
        "game", "gaming", "video-game", "minecraft", "roblox", "fortnite", "pokemon",
        "pokmon", "valorant", "genshin", "league-of-legends", "lol", "apex",
        "call-of-duty", "cod", "gta", "zelda", "mario", "sonic", "among-us",
        "fall-guys", "overwatch", "csgo", "dota", "steam", "xbox", "playstation",
        "nintendo", "switch", "ps5", "skin", "champion", "character", "boss",
        "weapon", "item", "loot", "rarity", "npc", "quest", "map", "mode",
        "brawlstars", "brawl-stars", "clash", "mobile-legends", "mlbb", "sims",
        "animal-crossing", "stardew", "terraria", "undertale", "fnaf",
        "five-nights", "danganronpa", "hazbin", "roblox-tower", "tower-defense",
        "skyblock", "blox-fruit", "adopt-me", "royale-high", "honkai", "arknights",
        "fate", "fire-emblem", "persona", "final-fantasy", "resident-evil",
        "silent-hill", "horror-game", "rpg", "mmo", "fps", "battle-royale",
        "survival", "sandbox", "simulator", "tycoon", "obby", "parkour",
    ],
}


def slug_to_title(slug: str) -> str:
    name = slug.split("/")[-1]
    name = re.sub(r"-[0-9A-Za-z]{3,6}$", "", name)
    name = name.replace("--", " - ").replace("-", " ").strip()
    return name.title() if name else slug


def classify(path: str) -> str:
    low = path.lower()
    best_cat = "Other"
    best_score = 0
    for cat, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in low)
        if score > best_score:
            best_score = score
            best_cat = cat
    return best_cat


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


classified = defaultdict(list)
official_list = []
site_list = []
articles = []

for full, path in urls:
    path = path.rstrip("/")
    if not path:
        site_list.append(("Homepage", full, ""))
        continue
    if path.startswith("articles/"):
        articles.append((slug_to_title(path), full, path))
        continue
    if path.startswith("wheels/"):
        continue
    if path in OFFICIAL_TOOLS:
        official_list.append((OFFICIAL_TOOLS[path], full, path))
        continue
    if path in SITE_PAGES:
        site_list.append((SITE_PAGES[path], full, path))
        continue
    title = slug_to_title(path)
    cat = classify(path)
    classified[cat].append((title, full, path))

official_list.sort(key=lambda x: x[0].lower())
site_list.sort(key=lambda x: x[0].lower())
articles.sort(key=lambda x: x[0].lower())
for cat in classified:
    classified[cat].sort(key=lambda x: x[0].lower())

category_order = [
    "Video Games",
    "Sports",
    "Entertainment",
    "Party and Games",
    "Food and Drink",
    "Music",
    "Travel and World",
    "Animals and Nature",
    "Chance and Fortune",
    "Comedy and Fun",
    "Board Games",
    "Tools",
    "Other",
]

community_count = sum(len(v) for v in classified.values())

html_parts = [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    "  <title>SpinTheWheel.app - Tools by Category</title>",
    "  <style>",
    "    * { box-sizing: border-box; margin: 0; padding: 0; }",
    "    body { font-family: Segoe UI, system-ui, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.5; }",
    "    .wrap { max-width: 1200px; margin: 0 auto; padding: 24px; }",
    "    h1 { font-size: 2rem; margin-bottom: 8px; color: #f8fafc; }",
    "    .meta { color: #94a3b8; margin-bottom: 24px; }",
    "    .search { width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #f1f5f9; font-size: 1rem; margin-bottom: 24px; }",
    "    .search:focus { outline: none; border-color: #3b82f6; }",
    "    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }",
    "    .stat { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; text-align: center; }",
    "    .stat .num { font-size: 1.5rem; font-weight: 700; color: #3b82f6; }",
    "    .stat .lbl { font-size: 0.8rem; color: #94a3b8; }",
    "    .category { background: #1e293b; border: 1px solid #334155; border-radius: 12px; margin-bottom: 16px; overflow: hidden; }",
    "    .category-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; cursor: pointer; user-select: none; }",
    "    .category-header:hover { background: #273449; }",
    "    .category-header h2 { font-size: 1.1rem; color: #f1f5f9; }",
    "    .badge { background: #3b82f6; color: white; padding: 2px 10px; border-radius: 999px; font-size: 0.85rem; font-weight: 600; }",
    "    .badge.official { background: #10b981; }",
    "    .badge.site { background: #8b5cf6; }",
    "    .badge.article { background: #f59e0b; }",
    "    .tools { display: none; padding: 0 20px 16px; }",
    "    .category.open .tools { display: block; }",
    "    .category.open .arrow { transform: rotate(90deg); }",
    "    .arrow { display: inline-block; transition: transform 0.2s; color: #94a3b8; margin-right: 8px; }",
    "    .tool-list { list-style: none; columns: 2; column-gap: 24px; }",
    "    @media (max-width: 768px) { .tool-list { columns: 1; } }",
    "    .tool-list li { break-inside: avoid; padding: 4px 0; border-bottom: 1px solid rgba(51,65,85,0.25); }",
    "    .tool-list a { color: #93c5fd; text-decoration: none; font-size: 0.9rem; }",
    "    .tool-list a:hover { color: #60a5fa; text-decoration: underline; }",
    "    .slug { color: #64748b; font-size: 0.75rem; display: block; }",
    "    .hidden { display: none !important; }",
    "  </style>",
    "</head>",
    "<body>",
    '<div class="wrap">',
    "  <h1>SpinTheWheel.app &mdash; Tools by Category</h1>",
    f'  <p class="meta">Extracted from sitemap &bull; {len(urls):,} total URLs &bull; Generated July 6, 2026</p>',
    '  <div class="stats">',
    f'    <div class="stat"><div class="num">{len(official_list)}</div><div class="lbl">Official Tools</div></div>',
    f'    <div class="stat"><div class="num">{community_count:,}</div><div class="lbl">Community Wheels</div></div>',
    f'    <div class="stat"><div class="num">{len(category_order)}</div><div class="lbl">Categories</div></div>',
    f'    <div class="stat"><div class="num">{len(articles)}</div><div class="lbl">Articles</div></div>',
    "  </div>",
    '  <input type="text" class="search" id="search" placeholder="Search tools..." oninput="filterTools(this.value)">',
]


def render_category(name, items, badge_class="", open_default=False):
    if not items:
        return
    open_cls = " open" if open_default else ""
    html_parts.append(f'  <div class="category{open_cls}">')
    html_parts.append('    <div class="category-header" onclick="this.parentElement.classList.toggle(\'open\')">')
    html_parts.append(f"      <h2><span class=\"arrow\">&#9654;</span>{esc(name)}</h2>")
    html_parts.append(f'      <span class="badge {badge_class}">{len(items):,}</span>')
    html_parts.append("    </div>")
    html_parts.append('    <div class="tools">')
    html_parts.append('      <ul class="tool-list">')
    for title, url, slug in items:
        search_text = f"{title} {slug}".lower()
        html_parts.append(
            f'        <li data-name="{esc(search_text)}">'
            f'<a href="{esc(url)}" target="_blank" rel="noopener">{esc(title)}</a>'
            f'<span class="slug">/{esc(slug)}</span></li>'
        )
    html_parts.append("      </ul>")
    html_parts.append("    </div>")
    html_parts.append("  </div>")


render_category("Official Built-in Tools", official_list, "official", True)
render_category("Site Pages", site_list, "site", True)
render_category("Articles", articles, "article", True)

for cat in category_order:
    render_category(cat, classified.get(cat, []))

html_parts.extend([
    "</div>",
    "<script>",
    "function filterTools(q) {",
    "  q = q.toLowerCase().trim();",
    '  document.querySelectorAll(".category").forEach(function(cat) {',
    "    var any = false;",
    '    cat.querySelectorAll(".tool-list li").forEach(function(li) {',
    "      var match = !q || li.dataset.name.includes(q);",
    '      li.classList.toggle("hidden", !match);',
    "      if (match) any = true;",
    "    });",
    '    cat.classList.toggle("hidden", !any);',
    '    if (q && any) cat.classList.add("open");',
    "  });",
    "}",
    "</script>",
    "</body>",
    "</html>",
])

with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(html_parts))

size_mb = os.path.getsize(OUTPUT) / 1024 / 1024
print(f"Written: {OUTPUT}")
print(f"Size: {size_mb:.2f} MB")
print(f"Official tools: {len(official_list)}")
print(f"Community wheels: {community_count:,}")
for cat in category_order:
    print(f"  {cat}: {len(classified.get(cat, [])):,}")
