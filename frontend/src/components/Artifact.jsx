import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import Editor from '@monaco-editor/react';
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCode2,
  Files,
  FolderCode,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Smartphone,
  Monitor,
} from "lucide-react";

const detectLanguage = (fileName = "") => {
  const name = fileName.toLowerCase();
  if (name.endsWith(".html")) return "html";
  if (name.endsWith(".css")) return "css";
  if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
  if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
  if (name.endsWith(".json")) return "json";
  if (name.endsWith(".md")) return "markdown";
  if (name.endsWith(".py")) return "python";
  if (name.endsWith(".java")) return "java";
  if (name.endsWith(".cpp") || name.endsWith(".c")) return "cpp";
  return "plaintext";
};

function Artifact() {
  const artifacts = useSelector((state) => state.message.artifacts);
  const [collapsed, setCollapsed] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState(0);
  const [activeFile, setActiveFile] = useState(0);
  const [tab, setTab] = useState("code");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setActiveArtifact(0);
    setActiveFile(0);
  }, [artifacts]);

  const artifact = artifacts[activeArtifact] || artifacts[0];
  const files = Array.isArray(artifact?.files) ? artifact.files : [];
  const file = files[activeFile] || files[0];
  const projectName =
    artifact?.title || artifact?.name || artifact?.type || "Project";

  const previewHtml = useMemo(() => {
    if (!files.length) return "";

    const htmlFile =
      files.find((item) => item.name?.toLowerCase() === "index.html") ||
      files.find((item) => item.name?.toLower?.().endsWith(".html"));
    const cssFiles = files.filter((item) =>
      item.name?.toLowerCase().endsWith(".css"),
    );
    const jsFiles = files.filter((item) =>
      item.name?.toLowerCase().endsWith(".js"),
    );

    if (!htmlFile) return "";

    const css = cssFiles.map((item) => item.content || "").join("\n");
    const js = jsFiles.map((item) => item.content || "").join("\n");
    let html = htmlFile.content || "";
    html = html.replace(
      /<\/head>/i,
      `<style>${css}</style></head>`,
    );
    html = html.replace(/<\/body>/i, `<script>${js}<\/script></body>`);
    return html;
  }, [files]);

  if (!artifacts?.length) return null;

  const copyFile = async () => {
    if (!file?.content) return;
    await navigator.clipboard.writeText(file.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const downloadFile = () => {
    if (!file?.name || file?.content == null) return;
    const blob = new Blob([file.content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openPreview = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
  };

  return (
    <motion.aside
      layout
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={`hidden h-screen shrink-0 border-l border-white/[0.06] bg-[#101217] lg:flex ${
        collapsed ? "w-[52px]" : "w-[420px]"
      }`}
    >
      {collapsed ? (
        <motion.button
          type="button"
          aria-label="Open artifact panel"
          onClick={() => setCollapsed(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="group flex h-full w-full flex-col items-center gap-3 border-0 bg-transparent py-4 text-slate-500"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] transition-colors group-hover:border-indigo-400/20 group-hover:text-indigo-300">
            <PanelRightOpen size={16} />
          </span>
          <span
            className="mt-2 truncate text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {projectName}
          </span>
        </motion.button>
      ) : (
        <motion.div
          key="artifact-panel"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18 }}
          className="flex h-full min-w-0 flex-1 flex-col"
        >
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] px-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-400/15 bg-indigo-500/10 text-indigo-300">
                <FolderCode size={15} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-slate-100">
                  {projectName}
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-600">
                  Generated artifact
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {previewHtml && (
                <button
                  type="button"
                  onClick={openPreview}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200"
                  title="Open preview"
                  aria-label="Open preview"
                >
                  <ExternalLink size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200"
                title="Collapse"
                aria-label="Collapse artifacts"
              >
                <PanelRightClose size={15} />
              </button>
            </div>
          </header>

          {artifacts.length > 1 && (
            <div className="flex shrink-0 gap-1.5 border-b border-white/[0.06] px-3 py-2">
              {artifacts.map((item, index) => (
                <button
                  key={item.id || item.title || index}
                  type="button"
                  onClick={() => {
                    setActiveArtifact(index);
                    setActiveFile(0);
                  }}
                  className={`h-1.5 flex-1 rounded-full border-0 transition-colors ${
                    index === activeArtifact
                      ? "bg-indigo-400"
                      : "bg-white/[0.08] hover:bg-white/[0.16]"
                  }`}
                  aria-label={`Artifact ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.06] px-3">
            <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-black/10 p-1">
              <button
                type="button"
                onClick={() => setTab("code")}
                className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium transition-colors ${
                  tab === "code"
                    ? "bg-indigo-500/15 text-indigo-200"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Code2 size={12} />
                Code
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium transition-colors ${
                  tab === "preview"
                    ? "bg-indigo-500/15 text-indigo-200"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Eye size={12} />
                Preview
              </button>
            </div>

            {tab === "preview" && previewHtml && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border-0 ${
                    previewMode === "desktop"
                      ? "bg-white/[0.08] text-slate-200"
                      : "text-slate-600"
                  }`}
                  title="Desktop preview"
                >
                  <Monitor size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border-0 ${
                    previewMode === "mobile"
                      ? "bg-white/[0.08] text-slate-200"
                      : "text-slate-600"
                  }`}
                  title="Mobile preview"
                >
                  <Smartphone size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewKey((value) => value + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border-0 text-slate-600 hover:bg-white/[0.05] hover:text-slate-300"
                  title="Refresh preview"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {tab === "code" ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.16 }}
                className="flex min-h-0 flex-1"
              >
                <div className="w-[126px] shrink-0 border-r border-white/[0.06] bg-[#0d0f14] px-2 py-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="mb-2 flex items-center gap-1.5 px-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    <Files size={11} />
                    Explorer
                  </div>
                  {files.map((item, index) => (
                    <button
                      key={`${item.name || "file"}-${index}`}
                      type="button"
                      onClick={() => setActiveFile(index)}
                      className={`mb-1 flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors ${
                        index === activeFile
                          ? "border-indigo-400/15 bg-indigo-500/10 text-slate-200"
                          : "border-transparent text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                      }`}
                    >
                      <FileCode2 size={12} className="shrink-0" />
                      <span className="truncate text-[10px]">
                        {item.name || `File ${index + 1}`}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  {file ? (
                    <>
                      <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/[0.06] px-3">
                        <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-slate-400">
                          <FileCode2 size={11} className="text-indigo-300" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={copyFile}
                            className="flex h-7 items-center gap-1.5 rounded-md border-0 bg-transparent px-2 text-[10px] text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                          >
                            {copied ? <Check size={11} /> : <Copy size={11} />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                          <button
                            type="button"
                            onClick={downloadFile}
                            className="flex h-7 w-7 items-center justify-center rounded-md border-0 bg-transparent text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                            aria-label={`Download ${file.name}`}
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="min-h-0 flex-1 bg-[#0d1117]">
                        <Editor
                          height="100%"
                          theme="nexivo-dark"
                          language={detectLanguage(file.name)}
                          value={file.content || ""}
                          beforeMount={(monaco) => {
                            monaco.editor.defineTheme("nexivo-dark", {
                              base: "vs-dark",
                              inherit: true,
                              rules: [],
                              colors: {
                                "editor.background": "#0d1117",
                                "editorLineNumber.foreground": "#596579",
                                "editorLineNumber.activeForeground": "#a5b4fc",
                                "editorCursor.foreground": "#818cf8",
                                "editor.selectionBackground": "#3730a33d",
                                "editor.lineHighlightBackground": "#ffffff08",
                                "editorIndentGuide.background1": "#ffffff0d",
                                "editorIndentGuide.activeBackground1": "#818cf84d",
                                "editorGutter.background": "#0d1117",
                                "scrollbarSlider.background": "#64748b20",
                                "scrollbarSlider.hoverBackground": "#64748b35",
                                "scrollbarSlider.activeBackground": "#64748b45",
                              },
                            });
                          }}
                          onMount={(editor) => {
                            editor.focus();
                          }}
                          options={{
                            readOnly: true,
                            automaticLayout: true,
                            minimap: { enabled: false },
                            fontSize: 12,
                            fontFamily:
                              "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
                            fontLigatures: true,
                            lineHeight: 20,
                            padding: { top: 12, bottom: 12 },
                            renderLineHighlight: "line",
                            renderLineHighlightOnlyWhenFocus: true,
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorSmoothCaretAnimation: "on",
                            cursorBlinking: "smooth",
                            wordWrap: "on",
                            folding: true,
                            foldingHighlight: true,
                            bracketPairColorization: { enabled: true },
                            guides: {
                              bracketPairs: true,
                              indentation: true,
                            },
                            glyphMargin: false,
                            lineNumbersMinChars: 3,
                            overviewRulerBorder: false,
                            hideCursorInOverviewRuler: true,
                            scrollbar: {
                              verticalScrollbarSize: 8,
                              horizontalScrollbarSize: 8,
                            },
                            tabSize: 2,
                            detectIndentation: true,
                            roundedSelection: true,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center text-[11px] text-slate-600">
                      No file selected
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.16 }}
                className="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-[#090b0e] p-2"
              >
                {previewHtml ? (
                  <motion.div
                    layout
                    transition={{ duration: 0.22 }}
                    className={`overflow-hidden bg-white shadow-[0_12px_40px_rgba(0,0,0,.28)] ${
                      previewMode === "mobile"
                        ? "h-[calc(100%-8px)] w-[214px] rounded-[16px]"
                        : "h-[calc(100%-8px)] w-full"
                    }`}
                  >
                    <iframe
                      key={previewKey}
                      title="Artifact preview"
                      srcDoc={previewHtml}
                      sandbox="allow-scripts"
                      className="h-full w-full border-0 bg-white"
                    />
                  </motion.div>
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-slate-600">
                    Preview requires an index.html file
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.aside>
  );
}

export default Artifact;
