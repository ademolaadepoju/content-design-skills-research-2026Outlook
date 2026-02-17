/**
 * Content Design Skills Analysis
 * 
 * Reads structured job posting data from /data/postings.json and
 * programmatically extracts skill mentions, counts frequencies,
 * and outputs findings by cluster, geography, seniority, and AI presence.
 * 
 * Usage: node analysis/analyze.js
 * Output: analysis/results.json + console summary
 */

const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────
// SKILL TAXONOMY
// Each cluster contains keywords/phrases to match
// against the combined text of each posting.
// Matching is case-insensitive.
// ──────────────────────────────────────────────

const SKILL_TAXONOMY = {
  "writing_craft": {
    label: "Writing Craft & UX Fundamentals",
    keywords: [
      { term: "clear, concise", id: "clarity" },
      { term: "microcopy", id: "microcopy" },
      { term: "UX copy", id: "ux_copy" },
      { term: "UX writing", id: "ux_writing" },
      { term: "in-product language", id: "in_product_language" },
      { term: "in-product copy", id: "in_product_copy" },
      { term: "interface copy", id: "interface_copy" },
      { term: "product flows", id: "product_flows" },
      { term: "voice and tone", id: "voice_tone" },
      { term: "voice & tone", id: "voice_tone" },
      { term: "tone of voice", id: "voice_tone" },
      { term: "brand voice", id: "brand_voice" },
      { term: "product naming", id: "product_naming" },
      { term: "nomenclature", id: "nomenclature" },
      { term: "taxonomy", id: "taxonomy" },
      { term: "editing", id: "editing" },
      { term: "proofreading", id: "proofreading" },
      { term: "onboarding", id: "onboarding_copy" },
      { term: "error message", id: "error_messages" },
      { term: "empty state", id: "empty_states" },
      { term: "notification", id: "notifications" },
      { term: "email", id: "email_copy" },
      { term: "end-to-end", id: "end_to_end" },
      { term: "user journey", id: "user_journey" },
      { term: "customer journey", id: "user_journey" },
      { term: "writing sample", id: "writing_samples" },
      { term: "portfolio", id: "portfolio" },
      { term: "storytelling", id: "storytelling" }
    ]
  },

  "systems_thinking": {
    label: "Systems Thinking & Content Systems",
    keywords: [
      { term: "systems thinking", id: "systems_thinking" },
      { term: "thinks in systems", id: "systems_thinking" },
      { term: "content system", id: "content_systems" },
      { term: "content design system", id: "content_systems" },
      { term: "design system", id: "design_systems" },
      { term: "content framework", id: "content_frameworks" },
      { term: "content pattern", id: "content_patterns" },
      { term: "reusable content", id: "content_patterns" },
      { term: "style guide", id: "style_guides" },
      { term: "content guidelines", id: "content_guidelines" },
      { term: "information architecture", id: "information_architecture" },
      { term: "content model", id: "content_modeling" },
      { term: "content structure", id: "content_structure" },
      { term: "content governance", id: "content_governance" },
      { term: "content audit", id: "content_audit" },
      { term: "scalable", id: "scalability" },
      { term: "at scale", id: "scalability" },
      { term: "content strategy", id: "content_strategy" },
      { term: "content standards", id: "content_standards" }
    ]
  },

  "collaboration": {
    label: "Cross-Functional Collaboration & Stakeholder Influence",
    keywords: [
      { term: "cross-functional", id: "cross_functional" },
      { term: "product manager", id: "work_with_pm" },
      { term: "product designer", id: "work_with_design" },
      { term: "engineer", id: "work_with_engineering" },
      { term: "researcher", id: "work_with_research" },
      { term: "marketing", id: "work_with_marketing" },
      { term: "stakeholder", id: "stakeholder_mgmt" },
      { term: "influence", id: "influence" },
      { term: "present work", id: "presenting" },
      { term: "present to", id: "presenting" },
      { term: "presenting", id: "presenting" },
      { term: "collaborate", id: "collaboration" },
      { term: "partner with", id: "collaboration" },
      { term: "partner closely", id: "collaboration" },
      { term: "agile", id: "agile" },
      { term: "sprint", id: "agile" }
    ]
  },

  "research_data": {
    label: "Research, Data & Measurement",
    keywords: [
      { term: "A/B test", id: "ab_testing" },
      { term: "experimentation", id: "experimentation" },
      { term: "content experiment", id: "experimentation" },
      { term: "user research", id: "user_research" },
      { term: "usability", id: "usability_testing" },
      { term: "data", id: "data_informed" },
      { term: "KPI", id: "kpis" },
      { term: "metric", id: "metrics" },
      { term: "measure", id: "measurement" },
      { term: "impact", id: "impact_oriented" },
      { term: "quantitative", id: "quantitative" },
      { term: "qualitative", id: "qualitative" },
      { term: "insight", id: "insights" },
      { term: "analytics", id: "analytics" }
    ]
  },

  "accessibility_inclusion": {
    label: "Accessibility, Inclusion & Localization",
    keywords: [
      { term: "accessibility", id: "accessibility" },
      { term: "accessible", id: "accessibility" },
      { term: "WCAG", id: "wcag" },
      { term: "Section 508", id: "section_508" },
      { term: "inclusive design", id: "inclusive_design" },
      { term: "inclusivity", id: "inclusive_design" },
      { term: "inclusive", id: "inclusive_design" },
      { term: "localization", id: "localization" },
      { term: "localisation", id: "localization" },
      { term: "multi-language", id: "multilingual" },
      { term: "multi-market", id: "multi_market" },
      { term: "global audience", id: "global_audience" },
      { term: "worldwide", id: "global_audience" },
      { term: "diverse user", id: "diverse_users" }
    ]
  },

  "ai_skills": {
    label: "AI Skills & AI Product Experience",
    keywords: [
      { term: "AI tool", id: "ai_tools" },
      { term: "AI fluency", id: "ai_fluency" },
      { term: "AI writing", id: "ai_writing" },
      { term: "AI-powered", id: "ai_powered" },
      { term: "AI capabilities", id: "ai_capabilities" },
      { term: " AI ", id: "ai_general" },
      { term: "artificial intelligence", id: "ai_general" },
      { term: "LLM", id: "llm" },
      { term: "Large Language Model", id: "llm" },
      { term: "generative AI", id: "genai" },
      { term: "GenAI", id: "genai" },
      { term: "prompt engineering", id: "prompt_engineering" },
      { term: "prompt", id: "prompts" },
      { term: "Claude", id: "claude" },
      { term: "ChatGPT", id: "chatgpt" },
      { term: "Gemini app", id: "gemini" },
      { term: "machine learning", id: "ml" },
      { term: "conversation design", id: "conversation_design" },
      { term: "conversational UI", id: "conversational_ui" },
      { term: "conversational user interface", id: "conversational_ui" },
      { term: "chatbot", id: "chatbot" },
      { term: "voice-driven", id: "voice_ui" },
      { term: "voice assistant", id: "voice_ui" }
    ]
  },

  "tools": {
    label: "Tools & Technical Skills",
    keywords: [
      { term: "Figma", id: "figma" },
      { term: "Sketch", id: "sketch" },
      { term: "InVision", id: "invision" },
      { term: "Contentful", id: "contentful" },
      { term: "CMS", id: "cms" },
      { term: "content management system", id: "cms" },
      { term: "prototype", id: "prototyping" },
      { term: "prototyping", id: "prototyping" },
      { term: "code", id: "code_literacy" },
      { term: "codebase", id: "code_literacy" },
      { term: "GitHub", id: "github" },
      { term: "Markdown", id: "markdown" },
      { term: "SEO", id: "seo" },
      { term: "Ditto", id: "ditto" },
      { term: "Frontitude", id: "frontitude" }
    ]
  }
};


// ──────────────────────────────────────────────
// ANALYSIS FUNCTIONS
// ──────────────────────────────────────────────

function getCombinedText(posting) {
  const parts = [
    posting.full_text || "",
    posting.title || "",
    ...(posting.responsibilities || []),
    ...(posting.requirements || []),
    ...(posting.nice_to_have || [])
  ];
  return parts.join(" ");
}

function matchSkills(text, taxonomy) {
  const results = {};
  const lowerText = text.toLowerCase();

  for (const [clusterId, cluster] of Object.entries(taxonomy)) {
    const matchedIds = new Set();
    const matchedTerms = [];

    for (const keyword of cluster.keywords) {
      if (lowerText.includes(keyword.term.toLowerCase())) {
        if (!matchedIds.has(keyword.id)) {
          matchedIds.add(keyword.id);
          matchedTerms.push({ id: keyword.id, matched_term: keyword.term });
        }
      }
    }

    results[clusterId] = {
      label: cluster.label,
      match_count: matchedIds.size,
      matched: matchedTerms
    };
  }

  return results;
}

function analyzePostings(postings, taxonomy) {
  const postingResults = [];

  // Per-posting analysis
  for (const posting of postings) {
    const text = getCombinedText(posting);
    const skills = matchSkills(text, taxonomy);

    postingResults.push({
      id: posting.id,
      company: posting.company,
      title: posting.title,
      region: posting.region,
      seniority: posting.seniority,
      status: posting.status,
      skills
    });
  }

  // Aggregate: cluster frequency (how many postings mention each cluster)
  const clusterFrequency = {};
  for (const clusterId of Object.keys(taxonomy)) {
    clusterFrequency[clusterId] = {
      label: taxonomy[clusterId].label,
      posting_count: 0,
      percentage: 0,
      top_skills: {}
    };
  }

  for (const result of postingResults) {
    for (const [clusterId, clusterResult] of Object.entries(result.skills)) {
      if (clusterResult.match_count > 0) {
        clusterFrequency[clusterId].posting_count++;
      }
      for (const match of clusterResult.matched) {
        if (!clusterFrequency[clusterId].top_skills[match.id]) {
          clusterFrequency[clusterId].top_skills[match.id] = 0;
        }
        clusterFrequency[clusterId].top_skills[match.id]++;
      }
    }
  }

  const total = postings.length;
  for (const clusterId of Object.keys(clusterFrequency)) {
    clusterFrequency[clusterId].percentage =
      Math.round((clusterFrequency[clusterId].posting_count / total) * 100);

    // Sort top_skills by frequency
    const sorted = Object.entries(clusterFrequency[clusterId].top_skills)
      .sort((a, b) => b[1] - a[1]);
    clusterFrequency[clusterId].top_skills = Object.fromEntries(sorted);
  }

  // By region
  const regions = [...new Set(postings.map(p => p.region))];
  const byRegion = {};
  for (const region of regions) {
    const regionPostings = postingResults.filter(p =>
      postings.find(op => op.id === p.id)?.region === region
    );
    byRegion[region] = {
      count: regionPostings.length,
      clusters: {}
    };
    for (const clusterId of Object.keys(taxonomy)) {
      const count = regionPostings.filter(p => p.skills[clusterId].match_count > 0).length;
      byRegion[region].clusters[clusterId] = {
        count,
        percentage: Math.round((count / regionPostings.length) * 100)
      };
    }
  }

  // By seniority
  const seniorityLevels = [...new Set(postings.map(p => p.seniority))];
  const bySeniority = {};
  for (const level of seniorityLevels) {
    const levelPostings = postingResults.filter(p =>
      postings.find(op => op.id === p.id)?.seniority === level
    );
    bySeniority[level] = {
      count: levelPostings.length,
      clusters: {}
    };
    for (const clusterId of Object.keys(taxonomy)) {
      const count = levelPostings.filter(p => p.skills[clusterId].match_count > 0).length;
      bySeniority[level].clusters[clusterId] = {
        count,
        percentage: Math.round((count / levelPostings.length) * 100)
      };
    }
  }

  // AI-specific deep dive
  const aiMentions = postingResults.filter(p => p.skills.ai_skills.match_count > 0);
  const aiAnalysis = {
    total_with_ai: aiMentions.length,
    percentage: Math.round((aiMentions.length / total) * 100),
    companies: aiMentions.map(p => ({
      company: p.company,
      title: p.title,
      ai_skills_found: p.skills.ai_skills.matched.map(m => m.id)
    })),
    specific_skills: {}
  };
  for (const p of aiMentions) {
    for (const match of p.skills.ai_skills.matched) {
      if (!aiAnalysis.specific_skills[match.id]) {
        aiAnalysis.specific_skills[match.id] = 0;
      }
      aiAnalysis.specific_skills[match.id]++;
    }
  }

  return {
    metadata: {
      total_postings: total,
      date_analyzed: new Date().toISOString().split('T')[0],
      regions: regions,
      seniority_levels: seniorityLevels,
      companies: [...new Set(postings.map(p => p.company))]
    },
    cluster_frequency: clusterFrequency,
    by_region: byRegion,
    by_seniority: bySeniority,
    ai_deep_dive: aiAnalysis,
    per_posting: postingResults
  };
}


// ──────────────────────────────────────────────
// CONSOLE REPORT
// ──────────────────────────────────────────────

function printReport(results) {
  const { metadata, cluster_frequency, by_region, by_seniority, ai_deep_dive } = results;

  console.log("\n" + "═".repeat(60));
  console.log("  CONTENT DESIGN SKILLS ANALYSIS — RESULTS");
  console.log("═".repeat(60));
  console.log(`  Postings analyzed: ${metadata.total_postings}`);
  console.log(`  Regions: ${metadata.regions.join(", ")}`);
  console.log(`  Companies: ${metadata.companies.length} unique`);
  console.log(`  Date: ${metadata.date_analyzed}`);
  console.log("═".repeat(60));

  console.log("\n📊 CLUSTER FREQUENCY (% of postings mentioning each cluster)\n");
  const sorted = Object.entries(cluster_frequency)
    .sort((a, b) => b[1].percentage - a[1].percentage);

  for (const [id, cluster] of sorted) {
    const bar = "█".repeat(Math.round(cluster.percentage / 2));
    console.log(`  ${cluster.label}`);
    console.log(`  ${bar} ${cluster.percentage}% (${cluster.posting_count}/${metadata.total_postings})`);

    const topSkills = Object.entries(cluster.top_skills).slice(0, 5);
    if (topSkills.length > 0) {
      console.log(`  Top: ${topSkills.map(([k, v]) => `${k} (${v})`).join(", ")}`);
    }
    console.log();
  }

  console.log("\n🌍 BY REGION\n");
  for (const [region, data] of Object.entries(by_region)) {
    console.log(`  ${region} (${data.count} postings):`);
    for (const [clusterId, clusterData] of Object.entries(data.clusters)) {
      const label = cluster_frequency[clusterId].label.substring(0, 30);
      console.log(`    ${label.padEnd(32)} ${clusterData.percentage}%`);
    }
    console.log();
  }

  console.log("\n📈 BY SENIORITY\n");
  for (const [level, data] of Object.entries(by_seniority)) {
    console.log(`  ${level} (${data.count} postings):`);
    for (const [clusterId, clusterData] of Object.entries(data.clusters)) {
      const label = cluster_frequency[clusterId].label.substring(0, 30);
      console.log(`    ${label.padEnd(32)} ${clusterData.percentage}%`);
    }
    console.log();
  }

  console.log("\n🤖 AI DEEP DIVE\n");
  console.log(`  Postings mentioning AI: ${ai_deep_dive.total_with_ai}/${metadata.total_postings} (${ai_deep_dive.percentage}%)`);
  console.log(`\n  Specific AI skills found:`);
  const aiSkillsSorted = Object.entries(ai_deep_dive.specific_skills)
    .sort((a, b) => b[1] - a[1]);
  for (const [skill, count] of aiSkillsSorted) {
    console.log(`    ${skill.padEnd(24)} ${count} postings`);
  }

  console.log(`\n  Companies with AI mentions:`);
  for (const entry of ai_deep_dive.companies) {
    console.log(`    ${entry.company} — ${entry.title}`);
    console.log(`      Skills: ${entry.ai_skills_found.join(", ")}`);
  }

  console.log("\n" + "═".repeat(60));
  console.log("  END OF REPORT");
  console.log("═".repeat(60) + "\n");
}


// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

const dataPath = path.join(__dirname, '..', 'data', 'postings.json');
const outputPath = path.join(__dirname, 'results.json');

const postings = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const results = analyzePostings(postings, SKILL_TAXONOMY);

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`\nResults written to ${outputPath}`);

printReport(results);
