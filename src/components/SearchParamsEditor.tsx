import Editor, { Monaco } from "@monaco-editor/react";
//import { ALGOLIA_SEARCH_QUERY_PARAMS } from '@/assets/ALGOLIA_SEARCH_QUERY_PARAMS';

// Your completions list (can be imported from another file)
// export const ALGOLIA_SEARCH_QUERY_PARAMS = [
//   // Core query
//   { name: "query", type: "string" },
//   { name: "similarQuery", type: "string" },
//   // ...rest of your params
// ] as const;

// Search query-time API parameters for Algolia Search API.
// Drop this into your web app and feed it into your autocomplete.
//
// If you want to update this list in the future, see:
// https://www.algolia.com/doc/api-reference/search-api-parameters/

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


type Range = {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
};

type AlgoliaParam = {
  name: string;
  type: string;
  readonly?: boolean;
};

function getJsonDepth(text: string, offset: number): number {
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < offset; i++) {
    const ch = text[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (ch === "{") depth++;
      else if (ch === "}") depth = Math.max(0, depth - 1);
    }
  }

  return depth;
}


// v1, cleanup please!
// function registerAlgoliaCompletionProvider(monaco: Monaco) {
//   const createSuggestions = (range: Range) =>
//     ALGOLIA_SEARCH_QUERY_PARAMS.map((param) => ({
//       label: param.name,
//       kind: monaco.languages.CompletionItemKind.Property,
//       detail: param.type + (param.readonly ? " (read-only)" : ""),
//       documentation: `Algolia search param: ${param.name}`,
//       insertText: `"${param.name}": $1`,
//       insertTextRules:
//         monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//       range,
//     }));

//   monaco.languages.registerCompletionItemProvider("json", {
//     triggerCharacters: ['"', ' ', '\n', '\t'],
//     provideCompletionItems(model, position) {
//       const word = model.getWordUntilPosition(position);

//       const range: Range = {
//         startLineNumber: position.lineNumber,
//         endLineNumber: position.lineNumber,
//         startColumn: word.startColumn,
//         endColumn: word.endColumn,
//       };

//       return {
//         suggestions: createSuggestions(range),
//       };
//     },
//   });
// }

function registerAlgoliaCompletionProvider(monaco: any) {
  const createSuggestions = (range: Range) =>
    ALGOLIA_SEARCH_QUERY_PARAMS.map((param) => ({
      label: param.name,
      kind: monaco.languages.CompletionItemKind.Property,
      detail: param.type + (param.readonly ? " (read-only)" : ""),
      documentation: `Algolia search param: ${param.name}`,
      insertText: `${param.name}`,//: $1`,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range,
    }));

  monaco.languages.registerCompletionItemProvider("json", {
    triggerCharacters: ['"'], // only trigger on quote for keys
    provideCompletionItems(model: any, position: any) {
      const lineContent = model.getLineContent(position.lineNumber);
      const textBeforeCursor = lineContent.slice(0, position.column - 1);

      // 1) If there's a ':' before the cursor on this line, you're in a value → no suggestions
      if (textBeforeCursor.includes(":")) {
        return { suggestions: [] };
      }

      // 2) Only suggest at top-level (depth === 1 inside the root object)
      const fullText = model.getValue();
      const offset = model.getOffsetAt(position) - 1; // before the just-typed char
      const depth = getJsonDepth(fullText, Math.max(0, offset));

      if (depth !== 1) {
        return { suggestions: [] };
      }

      // 3) Normal suggestion range
      const word = model.getWordUntilPosition(position);
      const range: Range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: createSuggestions(range),
      };
    },
  });
}
// function registerAlgoliaCompletionProvider(monaco: any) {
//   const createSuggestions = (range: Range) =>
//     ALGOLIA_SEARCH_QUERY_PARAMS.map((param) => ({
//       label: param.name,
//       kind: monaco.languages.CompletionItemKind.Property,
//       detail: param.type + (param.readonly ? " (read-only)" : ""),
//       documentation: `Algolia search param: ${param.name}`,
//       // This writes `"filters": ` and puts the cursor at the value position
//       insertText: `"${param.name}": ${1}`,
//       insertTextRules:
//         monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//       range,
//     }));

//   monaco.languages.registerCompletionItemProvider("json", {
//     triggerCharacters: ['"'],
//     provideCompletionItems(model: any, position: any) {
//       const lineContent: string = model.getLineContent(position.lineNumber);
//       const column = position.column; // 1-based
//       const textBeforeCursor = lineContent.slice(0, column - 1);

//       // Don't offer completions in value position (after :)
//       if (textBeforeCursor.includes(":")) {
//         return { suggestions: [] };
//       }

//       // Only top-level keys (depth === 1)
//       const fullText = model.getValue();
//       const offset = model.getOffsetAt(position) - 1;
//       const depth = getJsonDepth(fullText, Math.max(0, offset));
//       if (depth !== 1) {
//         return { suggestions: [] };
//       }

//       const word = model.getWordUntilPosition(position);

//       // Default range: just the word
//       let startColumn = word.startColumn;
//       let endColumn = word.endColumn;

//       // Look at characters around the cursor
//       const charBefore = lineContent[column - 2] ?? ""; // opening quote
//       const charAt = lineContent[column - 1] ?? "";     // usually closing quote

//       // If we are between existing quotes: "▌"
//       // extend the range to cover both of them so we replace them entirely.
//       if (charBefore === '"') {
//         startColumn = Math.min(startColumn, column - 1);
//       }
//       if (charAt === '"') {
//         endColumn = Math.max(endColumn, column);
//       }

//       const range: Range = {
//         startLineNumber: position.lineNumber,
//         endLineNumber: position.lineNumber,
//         startColumn,
//         endColumn,
//       };

//       return {
//         suggestions: createSuggestions(range),
//       };
//     },
//   });
// }

type Props = {
  panel: { queryParams: unknown };
  onPanelChange: (value: any) => void;
  editorTheme?: string;
};


export function AlgoliaParamsEditor({
  panel,
  onPanelChange,
  editorTheme,
}: Props) {
  const handleBeforeMount = (monaco: Monaco) => {
    registerAlgoliaCompletionProvider(monaco);
  };

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <Editor
        height="200px"
        defaultLanguage="json"
        value={JSON.stringify(panel.queryParams, null, 2)}
        beforeMount={handleBeforeMount}
        onChange={(value) => {
          if (value !== undefined) {
            try {
              const parsed = JSON.parse(value);
              onPanelChange({ ...panel, queryParams: parsed });
            } catch {
              // Invalid JSON - keep the text but don't update queryParams
            }
          }
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 12,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 2,
          automaticLayout: true,
        }}
        theme={editorTheme}
      />
    </div>
  );
}

export default AlgoliaParamsEditor;
