# Methodology

## Research question

What skills are companies looking for when hiring content designers in 2026, and how do those expectations vary by geography, seniority, company type, and the presence of AI?

## Data collection

### Sources
Job postings were collected from:
- **Greenhouse job boards** (direct company career pages)
- **LinkedIn** (job listings)
- **WorkingInContent.com** (content-specific job board)
- **Glassdoor and Indeed** (aggregators)
- **Direct company career pages** (Google Careers, Meta Careers, Stripe Jobs, etc.)

### Inclusion criteria
A posting was included if it met ALL of the following:
- Title contains "Content Designer", "UX Writer", "Content Strategist" (product/UX-focused), or a close variant
- The role is primarily about product/UX content (not marketing content, SEO content, or graphic design)
- The posting includes enough detail to extract skill requirements (at minimum: responsibilities OR requirements section)
- The role is based in the United States, United Kingdom, or Western Europe (or remote for those regions)

### Exclusion criteria
A posting was excluded if:
- The title says "Content Designer" but the role is actually graphic design, video production, or marketing content creation
- The posting is an internship (we focus on mid-level through staff/lead)
- There is insufficient text to analyze (e.g., just a title and location)

### Data capture process
1. Search for postings using targeted queries across multiple platforms
2. Fetch the full text of each posting where possible
3. For expired postings, use the best available text from search snippets
4. Structure each posting into the JSON schema defined in the README
5. Mark each posting's `status` as "live" or "expired"

## Analysis approach

### Skill taxonomy design
The taxonomy was built iteratively:
1. Read the first ~20 postings manually and note recurring skills and themes
2. Group related skills into clusters
3. Define specific keyword patterns for each skill within each cluster
4. Run the analysis and review edge cases
5. Add missed keywords and refine cluster boundaries

### Keyword matching
- All matching is **case-insensitive**
- Each posting's text is formed by concatenating: `title + full_text + responsibilities + requirements + nice_to_have`
- Each skill keyword is matched using `String.includes()` — simple substring matching
- Skills are **deduplicated per posting**: if "accessibility" appears 5 times in a posting, it counts as 1 match for that skill in that posting
- Multiple keywords can map to the same skill ID (e.g., "accessibility" and "accessible" both map to `accessibility`)

### Aggregation
- **Cluster frequency**: What percentage of postings mention at least one skill in each cluster
- **Top skills per cluster**: Which specific skills within each cluster appear most often
- **By region**: Same frequency analysis, filtered by geographic region
- **By seniority**: Same frequency analysis, filtered by seniority level
- **AI deep dive**: Detailed breakdown of which AI-specific skills appear and at which companies

## Known limitations

1. **Keyword matching misses context.** A posting mentioning "AI" in the phrase "we use AI responsibly" is counted the same as one saying "you will build AI products." The analysis doesn't distinguish between these.

2. **The taxonomy reflects our judgment.** Another researcher might group skills differently or choose different keywords. The taxonomy is published in the analysis code so others can evaluate and modify it.

3. **Not all postings have equal text depth.** Live postings fetched in full have more text to match against than expired postings captured from search snippets. This could inflate skill counts for postings with more text.

4. **Company representation is uneven.** Stripe has 4 postings in the dataset; some companies have 1. This means Stripe's patterns weigh more heavily in aggregate numbers.

5. **Temporal snapshot.** Job postings are ephemeral. Some postings were live when captured but may have expired by the time you read this. URLs may no longer work.
