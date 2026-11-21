import { Bot, Check, Copy, ExternalLink, UserRound } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ role, content , images }) {
  const isUser = role === "user";
  const [lightbox, setLightbox] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(""), 2000);
  };

  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="mb-3 mt-5 text-xl font-semibold text-slate-100">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-2 mt-4 text-lg font-semibold text-slate-100">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-3 text-base font-semibold text-slate-100">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="my-2 whitespace-pre-wrap leading-6 text-slate-300">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="pl-1">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-3 border-l-2 border-indigo-400/40 pl-3 text-slate-400">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full border-collapse text-left text-xs">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-white/10 bg-white/[0.05] px-3 py-2 text-slate-100">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-white/[0.07] px-3 py-2 text-slate-300">
        {children}
      </td>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
      >
        {children}
        <ExternalLink size={14} />
      </a>
    ),
    code: ({ className, children }) => {
      const language = className?.replace("language-", "") || "";
      const value = String(children).replace(/\n$/, "");

      if (!language) {
        return (
          <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[13px] text-pink-300">
            {value}
          </code>
        );
      }

      return (
        <div className="my-3 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {language}
            </span>
            <button
              type="button"
              onClick={() => copyCode(value)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              {copiedCode === value ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "16px",
              background: "#111318",
              fontSize: "13px",
            }}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      );
    },
  };

  return (
    <>
      <article
        className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      >
      <div
        className={`chat-message-avatar ${
          isUser ? "chat-message-avatar-user" : ""
        }`}
      >
        {isUser ? <UserRound size={15} /> : <Bot size={15} />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "whitespace-pre-wrap rounded-tr-md bg-indigo-500/15 text-indigo-50"
            : "rounded-tl-md bg-white/[0.045] text-slate-300"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <>
            <div className="chat-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </div>
            {Array.isArray(images) && images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <img
                    key={image || index}
                    src={image}
                    alt=""
                    loading="lazy"
                    onError={(event) => event.currentTarget.remove()}
                    onClick={() => setLightbox(image)}
                    className="h-[200px] w-[200px] cursor-zoom-in rounded-lg border border-white/10 object-cover"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      </article>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl text-white hover:bg-black/80"
            aria-label="Close image"
          >
            &times;
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-h-[80vh] max-w-[90vw] rounded-2xl border border-white/10 shadow-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default MessageBubble;
