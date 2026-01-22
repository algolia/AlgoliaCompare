import Editor, { Monaco } from "@monaco-editor/react";
import { ALGOLIA_SEARCH_QUERY_PARAMS, AlgoliaParam } from '@/constants/algoliaParams';

type Range = {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
};

/**
 * Calculates the JSON nesting depth at a given character offset.
 * Used to determine if we're at the top level of the JSON object.
 *
 * @param text - The full JSON text
 * @param offset - Character offset to check depth at
 * @returns The nesting depth (0 = outside any object, 1 = top level, etc.)
 */
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

/**
 * Registers Monaco editor completion provider for Algolia search parameters.
 * Provides autocomplete suggestions when editing JSON search parameters.
 * Only triggers at the top level of the JSON object.
 *
 * @param monaco - Monaco editor instance
 */
function registerAlgoliaCompletionProvider(monaco: Monaco) {
  const createSuggestions = (range: Range) =>
    ALGOLIA_SEARCH_QUERY_PARAMS.map((param: AlgoliaParam) => ({
      label: param.name,
      kind: monaco.languages.CompletionItemKind.Property,
      detail: param.type + (param.readonly ? " (read-only)" : ""),
      documentation: `Algolia search param: ${param.name}`,
      insertText: `${param.name}`,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range,
    }));

  monaco.languages.registerCompletionItemProvider("json", {
    triggerCharacters: ['"'], // only trigger on quote for keys
    provideCompletionItems(model, position) {
      const lineContent = model.getLineContent(position.lineNumber);
      const textBeforeCursor = lineContent.slice(0, position.column - 1);

      // Don't offer completions in value position (after ':')
      if (textBeforeCursor.includes(":")) {
        return { suggestions: [] };
      }

      // Only suggest at top-level (depth === 1 inside the root object)
      const fullText = model.getValue();
      const offset = model.getOffsetAt(position) - 1;
      const depth = getJsonDepth(fullText, Math.max(0, offset));

      if (depth !== 1) {
        return { suggestions: [] };
      }

      // Normal suggestion range
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

type Props = {
  panel: { queryParams: unknown };
  onPanelChange: (value: any) => void;
  editorTheme?: string;
};

/**
 * Monaco editor component for editing Algolia search query parameters as JSON.
 * Provides autocomplete suggestions for valid Algolia parameter names.
 */
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
