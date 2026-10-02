/**
 * AI Matchmaker Engine for Waste2Worth
 * Performs semantic material pairing, industrial symbiosis compatibility scoring,
 * quantity/budget alignment, and produces clear, actionable rationales.
 */

// Industrial Symbiosis Knowledge Graph: known industrial circular pairings
const SYMBIOSIS_PATTERNS = [
  {
    wasteKeywords: ['iron scrap', 'steel scrap', 'metal scrap', 'iron', 'steel'],
    requirementKeywords: ['iron scrap', 'steel scrap', 'metal scrap', 'iron', 'steel', 'metal', 'construction'],
    synergy: 'Recycled iron scrap directly replaces raw iron ore, saving smelting energy and raw material costs.',
    defaultCategory: 'Metals & Metallurgy',
    co2Factor: 0.9
  },
  {
    wasteKeywords: ['wood waste', 'sawdust', 'timber waste', 'wood scrap', 'wood'],
    requirementKeywords: ['wood waste', 'sawdust', 'wood scrap', 'paper', 'pulp', 'biomass', 'composite'],
    synergy: 'Wood waste provides clean organic fiber for paper pulp and composite manufacturing.',
    defaultCategory: 'Wood & Biomass',
    co2Factor: 0.5
  },
  {
    wasteKeywords: ['plastic waste', 'plastic scrap', 'plastic', 'polymers'],
    requirementKeywords: ['plastic waste', 'plastic scrap', 'plastic', 'packaging', 'composite'],
    synergy: 'Recycled plastic waste replaces virgin plastic resins, cutting petroleum consumption.',
    defaultCategory: 'Plastics & Polymers',
    co2Factor: 1.1
  },
  {
    wasteKeywords: ['paper waste', 'cardboard waste', 'paper scrap', 'paper'],
    requirementKeywords: ['paper waste', 'cardboard waste', 'paper', 'packaging'],
    synergy: 'Clean paper waste is repulped into cartons and molded packaging boxes.',
    defaultCategory: 'Paper & Packaging',
    co2Factor: 0.8
  },
  {
    wasteKeywords: ['fly ash', 'coal ash', 'boiler ash', 'cement dust'],
    requirementKeywords: ['fly ash', 'cement', 'concrete', 'pozzolan', 'brick'],
    synergy: 'Fly ash replaces Portland cement up to 30-40%, improving strength and reducing emissions.',
    defaultCategory: 'Minerals & Construction',
    co2Factor: 0.8
  },
  {
    wasteKeywords: ['fly ash', 'coal ash', 'boiler ash'],
    requirementKeywords: ['cement', 'concrete', 'pozzolan', 'brick', 'geopolymer', 'structural fill'],
    synergy: 'Fly ash replaces Portland cement up to 30-40%, improving concrete workability, long-term compressive strength, and durability.',
    defaultCategory: 'Minerals & Construction',
    co2Factor: 0.8
  },
  {
    wasteKeywords: ['spent grain', 'brewer grain', 'brewery mash', 'malt residue', 'yeast slurry'],
    requirementKeywords: ['animal feed', 'cattle feed', 'livestock', 'protein fodder', 'mushroom substrate', 'compost', 'biogas'],
    synergy: 'Spent brewer grains are rich in digestible protein (~28%) and dietary fiber, ideal for ruminant cattle feed and mushroom growing substrate.',
    defaultCategory: 'Agriculture & Food',
    co2Factor: 0.4
  },
  {
    wasteKeywords: ['sawdust', 'wood chips', 'wood shaving', 'timber scrap', 'bark'],
    requirementKeywords: ['particle board', 'pellet', 'biofuel', 'wood composite', 'mdf', 'paper pulp', 'bedding', 'biochar'],
    synergy: 'Clean untreated wood sawdust is prime feedstock for compressed biomass pellets, MDF boards, and composite structural materials.',
    defaultCategory: 'Wood & Biomass',
    co2Factor: 0.5
  },
  {
    wasteKeywords: ['pet flakes', 'plastic scrap', 'hdpe regrind', 'polymer scrap', 'recycled plastic'],
    requirementKeywords: ['plastic resin', 'synthetic fiber', 'moulding resin', 'packaging material', 'polyester', 'composite'],
    synergy: 'Clean reground polymers directly substitute for virgin fossil-based resin pellets, slashing energy consumption by up to 75%.',
    defaultCategory: 'Plastics & Polymers',
    co2Factor: 1.2
  },
  {
    wasteKeywords: ['citrus peel', 'fruit pulp', 'pomace', 'bagasse', 'sugarcane residue'],
    requirementKeywords: ['pectin', 'bio-fuel', 'organic fertilizer', 'citric acid', 'cellulose', 'packaging pulp'],
    synergy: 'Agro-processing pulp yields high-value pectin, essential oils, and organic soil amendments, diverting wet mass from methane-emitting landfills.',
    defaultCategory: 'Agriculture & Food',
    co2Factor: 0.45
  },
  {
    wasteKeywords: ['foundry sand', 'spent silica sand'],
    requirementKeywords: ['asphalt', 'paving', 'subbase', 'pipe bedding', 'flowable fill'],
    synergy: 'Thermally recycled foundry sand has uniform grain size meeting DOT standards for asphalt paving subbase.',
    defaultCategory: 'Minerals & Construction',
    co2Factor: 0.3
  },
  {
    wasteKeywords: ['cardboard scrap', 'corrugated waste', 'paper trimmings'],
    requirementKeywords: ['recycled paper', 'pulp', 'carton packaging', 'insulation', 'hydro-mulch'],
    synergy: 'Corrugated cardboard fibers can be repulped into strong packaging liners or converted into hydro-mulch for soil stabilization.',
    defaultCategory: 'Paper & Packaging',
    co2Factor: 0.7
  }
];

function normalize(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
}

/**
 * Calculates a match score between a Company's Requirement and a Seller's Waste Listing
 * @param {Object} requirement - What the buyer needs
 * @param {Object} wasteListing - What the seller has
 * @returns {Object|null} Match details or null if no correlation
 */
export function scoreRequirementToWaste(requirement, wasteListing) {
  // Can't match against own company
  if (requirement.companyId === wasteListing.companyId) {
    return null;
  }

  const reqTitle = normalize(requirement.title);
  const reqDesc = normalize(requirement.description);
  const reqCategory = normalize(requirement.category);

  const wasteTitle = normalize(wasteListing.title);
  const wasteDesc = normalize(wasteListing.description);
  const wasteCategory = normalize(wasteListing.category);

  let score = 0;
  let reasons = [];
  let synergyInsight = '';
  let symbiosisMatch = false;

  // 1. Check direct textual match
  const reqWords = `${reqTitle} ${reqDesc}`.split(/\s+/).filter(w => w.length > 3);
  const wasteText = `${wasteTitle} ${wasteDesc}`;
  
  let keywordMatches = 0;
  for (const word of reqWords) {
    if (wasteText.includes(word)) {
      keywordMatches++;
    }
  }

  if (keywordMatches > 0) {
    const directPoints = Math.min(45, keywordMatches * 15);
    score += directPoints;
    reasons.push(`Direct material keywords aligned ("${wasteListing.title}" matches your need for "${requirement.title}")`);
  }

  // 2. Check Industrial Symbiosis knowledge graph
  for (const pattern of SYMBIOSIS_PATTERNS) {
    const matchesWastePattern = pattern.wasteKeywords.some(kw => wasteText.includes(kw));
    const matchesReqPattern = pattern.requirementKeywords.some(kw => `${reqTitle} ${reqDesc}`.includes(kw));

    if (matchesWastePattern && matchesReqPattern) {
      score += 40;
      symbiosisMatch = true;
      synergyInsight = pattern.synergy;
      reasons.push('High-affinity Industrial Symbiosis match discovered by AI material graph');
      break;
    }
  }

  // 3. Category match
  if (reqCategory && wasteCategory && (reqCategory.includes(wasteCategory) || wasteCategory.includes(reqCategory))) {
    score += 15;
    reasons.push(`Aligned under same industrial sector: ${requirement.category}`);
  }

  // 4. Budget / Price compatibility
  if (requirement.maxPricePerUnit && wasteListing.pricePerUnit) {
    if (wasteListing.pricePerUnit <= requirement.maxPricePerUnit) {
      score += 10;
      const savingsPercent = Math.round(((requirement.maxPricePerUnit - wasteListing.pricePerUnit) / requirement.maxPricePerUnit) * 100);
      if (savingsPercent > 0) {
        reasons.push(`Priced at ₹${wasteListing.pricePerUnit}/${wasteListing.unit} (${savingsPercent}% below your max budget of ₹${requirement.maxPricePerUnit})`);
      } else {
        reasons.push(`Priced within budget at ₹${wasteListing.pricePerUnit}/${wasteListing.unit}`);
      }
    } else {
      score -= 10;
      reasons.push(`Seller asking price (₹${wasteListing.pricePerUnit}) is higher than your listed budget (₹${requirement.maxPricePerUnit}) - negotiable`);
    }
  }

  // 5. Quantity suitability
  if (requirement.quantityNeeded && wasteListing.quantity) {
    const ratio = wasteListing.quantity / requirement.quantityNeeded;
    if (ratio >= 0.8 && ratio <= 2.5) {
      score += 10;
      reasons.push(`Available volume (${wasteListing.quantity} ${wasteListing.unit}) closely meets your target volume (${requirement.quantityNeeded} ${requirement.unit})`);
    } else if (ratio < 0.8) {
      reasons.push(`Seller can supply partial volume (${wasteListing.quantity} of ${requirement.quantityNeeded} ${requirement.unit})`);
    }
  }

  // 6. Location proximity note
  if (requirement.location && wasteListing.location) {
    if (normalize(requirement.location) === normalize(wasteListing.location)) {
      score += 10;
      reasons.push(`Same industrial zone / city (${wasteListing.location}) — minimal freight emissions & freight costs!`);
    }
  }

  // Minimum threshold to count as a match
  if (score < 30 && !symbiosisMatch) {
    return null;
  }

  // Cap between 40% and 99%
  const finalScore = Math.min(99, Math.max(45, score));

  // Environmental impact estimation
  const qty = Math.min(wasteListing.quantity || 10, requirement.quantityNeeded || 10);
  const estimatedCo2SavedTonnes = Math.round(qty * 0.65 * 10) / 10;
  const estimatedSavings = requirement.maxPricePerUnit && wasteListing.pricePerUnit && requirement.maxPricePerUnit > wasteListing.pricePerUnit
    ? Math.round((requirement.maxPricePerUnit - wasteListing.pricePerUnit) * qty)
    : Math.round((wasteListing.pricePerUnit || 50) * 0.3 * qty);

  return {
    id: `match_${requirement.id}_${wasteListing.id}`,
    matchScore: finalScore,
    requirement,
    wasteListing,
    sellerCompany: {
      id: wasteListing.companyId,
      name: wasteListing.companyName,
      email: wasteListing.companyEmail,
      location: wasteListing.location
    },
    buyerCompany: {
      id: requirement.companyId,
      name: requirement.companyName,
      email: requirement.companyEmail,
      location: requirement.location
    },
    reasons,
    synergyInsight: synergyInsight || `This byproduct directly addresses your raw material requirement for ${requirement.title}.`,
    estimatedCo2SavedTonnes,
    estimatedSavings
  };
}

/**
 * Finds all best AI matches for a specific company
 * 1. Matches this company's Requirements with other companies' Waste Listings (Buyer Matches)
 * 2. Matches other companies' Requirements with this company's Waste Listings (Seller Matches)
 */
export function getMatchesForCompany(companyId, allRequirements, allWasteListings) {
  const myRequirements = allRequirements.filter(r => r.companyId === companyId);
  const otherWaste = allWasteListings.filter(w => w.companyId !== companyId);

  const myWaste = allWasteListings.filter(w => w.companyId === companyId);
  const otherRequirements = allRequirements.filter(r => r.companyId !== companyId);

  // 1. Matches where I am the Buyer (I buy someone else's waste to satisfy my requirement)
  const buyerMatches = [];
  for (const req of myRequirements) {
    for (const waste of otherWaste) {
      const match = scoreRequirementToWaste(req, waste);
      if (match) {
        buyerMatches.push({
          ...match,
          direction: 'BUY',
          headline: `AI found waste you can buy for "${req.title}"`
        });
      }
    }
  }

  // 2. Matches where I am the Seller (Someone needs what I have listed as waste)
  const sellerMatches = [];
  for (const waste of myWaste) {
    for (const req of otherRequirements) {
      const match = scoreRequirementToWaste(req, waste);
      if (match) {
        sellerMatches.push({
          ...match,
          direction: 'SELL',
          headline: `${req.companyName} is looking to buy your "${waste.title}"`
        });
      }
    }
  }

  // Combine and sort by highest match score
  const allMatches = [...buyerMatches, ...sellerMatches].sort((a, b) => b.matchScore - a.matchScore);

  return {
    buyerMatches: buyerMatches.sort((a, b) => b.matchScore - a.matchScore),
    sellerMatches: sellerMatches.sort((a, b) => b.matchScore - a.matchScore),
    topMatches: allMatches.slice(0, 8)
  };
}
