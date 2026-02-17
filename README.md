# Content Design Skills Research 2026

**What 100 Job Postings Reveal About the Skills Companies Want From Content Designers in 2026**

## What is this?

This is an open, reproducible research project analyzing the skills companies are hiring for in content design roles across the US and Europe. Instead of just summarizing what we found, we're publishing the raw data—every job posting—and the code that analyzed it.

You can verify every claim in the article by running the analysis yourself.

## Repository structure

```
content-design-skills-research/
├── data/
│   └── postings.json          # Structured dataset of all job postings
├── analysis/
│   ├── analyze.js             # Analysis script (skill extraction + frequency counts)
│   └── results.json           # Output from the analysis (generated)
├── docs/
│   └── methodology.md         # Detailed methodology notes
└── README.md
```

## How to run the analysis

```bash
# Clone the repo
git clone https://github.com/[your-username]/content-design-skills-research.git
cd content-design-skills-research

# Run the analysis (requires Node.js)
node analysis/analyze.js
```

This will:
1. Read all postings from `data/postings.json`
2. Run keyword-based skill extraction against a defined taxonomy
3. Output `analysis/results.json` with full results
4. Print a summary report to the console

## The dataset

Each posting in `data/postings.json` includes:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier |
| `company` | Company name |
| `title` | Job title |
| `location` | Posted location |
| `region` | Geographic region (US, UK, EU, APAC, Canada) |
| `seniority` | Level (mid, senior, staff, lead) |
| `employment_type` | Full-time, contract, etc. |
| `url` | Original posting URL |
| `source` | Where the posting was found |
| `date_captured` | When we captured the data |
| `status` | Whether the posting was live or expired at capture |
| `salary_range` | Compensation if listed |
| `full_text` | Full or best-available text of the posting |
| `responsibilities` | Listed responsibilities |
| `requirements` | Listed requirements |
| `nice_to_have` | Listed preferred qualifications |

## Methodology

### Scope
- **Target**: 100 job postings for Content Designer, UX Writer, Content Strategist (product-focused), and related titles
- **Geography**: United States, United Kingdom, and Western Europe
- **Company types**: Big tech, AI-native, fintech, SaaS, healthtech, govtech, agencies
- **Seniority**: Mid-level through Staff/Lead

### Skill taxonomy
The analysis uses a keyword-based taxonomy organized into seven clusters:

1. **Writing Craft & UX Fundamentals** — microcopy, voice/tone, product naming, end-to-end journeys
2. **Systems Thinking & Content Systems** — content frameworks, design systems, information architecture, governance
3. **Cross-Functional Collaboration** — working with PMs, designers, engineers, stakeholder influence
4. **Research, Data & Measurement** — A/B testing, user research, KPIs, analytics
5. **Accessibility, Inclusion & Localization** — WCAG, inclusive design, multi-language, global audiences
6. **AI Skills & AI Product Experience** — LLMs, prompt engineering, AI tools, conversation design
7. **Tools & Technical Skills** — Figma, CMS, prototyping, code literacy

Each cluster contains specific keywords that are matched case-insensitively against the combined text of each posting (title + full text + responsibilities + requirements + nice-to-haves). Skills are deduplicated per posting so each skill is counted once regardless of how many times it appears.

### Limitations
- **Job postings are not job descriptions.** They reflect what companies *say* they want, which isn't always what they actually need or what the day-to-day work involves.
- **Keyword matching has limits.** Some skills may be described in language our taxonomy doesn't capture. We've tried to include common variations but this isn't exhaustive.
- **Expired postings.** Some postings were captured from search snippets after the original listing expired. These have `status: "expired"` and may have less complete text.
- **Sample bias.** The dataset skews toward larger companies and English-language postings. Smaller companies and non-English European postings are underrepresented.
- **Point in time.** This data was captured in February 2026. The job market changes.

### What this research is NOT
- It's not interviews or surveys of practicing content designers
- It's not an analysis of what content designers actually *do* day-to-day
- It doesn't capture skills that are important but rarely written into job postings (e.g., ethical judgment, navigating ambiguity, "managing up")

## Contributing

This is a living dataset. If you'd like to contribute:

1. **Add postings**: Add new entries to `data/postings.json` following the existing schema
2. **Improve the taxonomy**: Suggest new keywords or clusters by opening an issue
3. **Challenge the methodology**: If you think the analysis misses something, open an issue or PR

## License

The analysis code is MIT licensed. The job posting data is sourced from publicly available job listings and is included here for research purposes.

## About

This research accompanies the article: *"What 100 Job Postings Reveal About the Skills Companies Want From Content Designers in 2026."*

Built by [Your Name]. Questions or feedback? Open an issue or reach out at [your contact].
