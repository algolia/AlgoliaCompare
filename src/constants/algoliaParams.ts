/**
 * Search query-time API parameters for Algolia Search API.
 * Use this constant to power autocomplete/intellisense when editing Algolia search parameters.
 *
 * For the latest parameter documentation, see:
 * https://www.algolia.com/doc/api-reference/search-api-parameters/
 */

export type AlgoliaParam = {
  name: string;
  type: string;
  readonly?: boolean;
};

export const ALGOLIA_SEARCH_QUERY_PARAMS: AlgoliaParam[] = [
  // Core query
  { name: "query", type: "string" },
  { name: "similarQuery", type: "string" },

  // Filtering
  { name: "filters", type: "string" },
  { name: "facetFilters", type: "string | string[][]" },
  { name: "optionalFilters", type: "string | string[][]" },
  { name: "numericFilters", type: "string | string[][]" },
  { name: "tagFilters", type: "string | string[][]" },
  { name: "sumOrFiltersScores", type: "boolean" },
  { name: "restrictSearchableAttributes", type: "string[]" },

  // Faceting
  { name: "facets", type: "string[]" },
  { name: "facetingAfterDistinct", type: "boolean" },
  { name: "maxValuesPerFacet", type: "number" },
  { name: "sortFacetValuesBy", type: `"count" | "alpha"` },

  // Pagination
  { name: "page", type: "number" },
  { name: "offset", type: "number" },
  { name: "length", type: "number" },
  { name: "hitsPerPage", type: "number" },
  { name: "nbHits", type: "number", readonly: true },
  { name: "nbPages", type: "number", readonly: true },

  // Geo-search
  { name: "aroundLatLng", type: "string" },
  { name: "aroundLatLngViaIP", type: "boolean" },
  { name: "aroundRadius", type: "number | \"all\"" },
  { name: "aroundPrecision", type: "number | { from: number; value: number }[]" },
  { name: "minimumAroundRadius", type: "number" },
  { name: "insideBoundingBox", type: "string | number[][] | null" },
  { name: "insidePolygon", type: "number[][]" },

  // Languages / NLP
  { name: "naturalLanguages", type: "string[]" },
  { name: "queryLanguages", type: "string[]" },
  { name: "ignorePlurals", type: "boolean | \"true\" | \"false\" | string[]" },
  { name: "removeStopWords", type: "boolean | string[]" },
  { name: "decompoundQuery", type: "boolean" },

  // Rules
  { name: "ruleContexts", type: "string[]" },
  { name: "enableRules", type: "boolean" },

  // Personalization
  { name: "personalizationImpact", type: "number" },
  { name: "userToken", type: "string" },
  { name: "enablePersonalization", type: "boolean" },

  // Ranking / relevance
  { name: "getRankingInfo", type: "boolean" },
  { name: "ranking", type: "string[]" },
  { name: "relevancyStrictness", type: "number" },
  { name: "distinct", type: "boolean | number" },
  { name: "minProximity", type: "number" },
  { name: "attributeCriteriaComputedByMinProximity", type: "boolean" },
  { name: "enableReRanking", type: "boolean" },
  { name: "reRankingApplyFilter", type: "string | string[][] | null" },

  // Typo tolerance
  { name: "minWordSizefor1Typo", type: "number" },
  { name: "minWordSizefor2Typos", type: "number" },
  { name: "typoTolerance", type: "boolean | \"min\" | \"strict\" | \"true\" | \"false\"" },
  { name: "allowTyposOnNumericTokens", type: "boolean" },
  { name: "disableTypoToleranceOnAttributes", type: "string[]" },

  // Query strategy
  { name: "queryType", type: "\"prefixLast\" | \"prefixAll\" | \"prefixNone\"" },
  { name: "removeWordsIfNoResults", type: "\"none\" | \"lastWords\" | \"firstWords\" | \"allOptional\"" },
  { name: "advancedSyntax", type: "boolean" },
  { name: "advancedSyntaxFeatures", type: "string[]" },
  { name: "optionalWords", type: "string | string[] | null" },
  { name: "disableExactOnAttributes", type: "string[]" },
  { name: "exactOnSingleWordQuery", type: "\"attribute\" | \"none\" | \"word\"" },
  { name: "alternativesAsExact", type: "string[]" },
  { name: "mode", type: "\"neuralSearch\" | \"keywordSearch\"" },
  { name: "semanticSearch", type: "{ eventSources?: string[] | null }" },

  // Highlighting & snippeting
  { name: "attributesToRetrieve", type: "string[]" },
  { name: "attributesToHighlight", type: "string[]" },
  { name: "attributesToSnippet", type: "string[]" },
  { name: "highlightPreTag", type: "string" },
  { name: "highlightPostTag", type: "string" },
  { name: "snippetEllipsisText", type: "string" },
  { name: "restrictHighlightAndSnippetArrays", type: "boolean" },
  { name: "replaceSynonymsInHighlight", type: "boolean" },

  // Analytics
  { name: "clickAnalytics", type: "boolean" },
  { name: "analytics", type: "boolean" },
  { name: "analyticsTags", type: "string[]" },
  { name: "percentileComputation", type: "boolean" },
  { name: "enableABTest", type: "boolean" },

  // Response shaping / advanced
  { name: "responseFields", type: "string[]" },
  { name: "renderingContent", type: "object" },
  { name: "facets_stats", type: "object", readonly: true },
  { name: "processingTimeMS", type: "number", readonly: true },
  { name: "serverTimeMS", type: "number", readonly: true },
] as const;
