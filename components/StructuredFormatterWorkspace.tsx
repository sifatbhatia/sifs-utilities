"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import {
  CheckCircle2,
  Clipboard,
  Download,
  Eraser,
  FileUp,
  Loader2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { LineCounter, parseDocument, stringify as stringifyYaml } from "yaml";
import PremiumBackground from "@/components/PremiumBackground";
import { useTheme } from "@/components/theme/ThemeProvider";
import { workspaceChrome } from "@/lib/marketingChrome";
import { downloadBlob } from "@/lib/download";

type FormatterMode = "json" | "yaml";
type IndentChoice = "2" | "4" | "tab";
type Status = {
  kind: "idle" | "success" | "error";
  message: string;
};

type StructuredFormatterWorkspaceProps = {
  mode: FormatterMode;
};

const sampleInput = {
  json: '{ "name": "Sif", "tools": ["compress", "format"], "local": true }',
  yaml: "name: Sif\ntools:\n  - compress\n  - format\nlocal: true\n",
};

function indentValue(choice: IndentChoice) {
  return choice === "tab" ? "\t" : Number(choice);
}

function lineAndColumnFromOffset(source: string, offset: number) {
  const safeOffset = Math.max(0, Math.min(source.length, offset));
  const before = source.slice(0, safeOffset);
  const lines = before.split(/\r\n|\r|\n/);
  return {
    line: lines.length,
    col: lines[lines.length - 1].length + 1,
  };
}

function jsonErrorMessage(error: unknown, source: string) {
  const raw = error instanceof Error ? error.message : "Invalid JSON";
  const match = raw.match(/position\s+(\d+)/i);
  if (!match) return raw;
  const pos = Number(match[1]);
  if (!Number.isFinite(pos)) return raw;
  const { line, col } = lineAndColumnFromOffset(source, pos);
  return `${raw} (line ${line}, column ${col})`;
}

function yamlErrorMessage(error: { message: string; linePos?: { line: number; col: number }[] }) {
  const first = error.linePos?.[0];
  if (!first) return error.message;
  return `${error.message} (line ${first.line}, column ${first.col})`;
}

function formatInput(mode: FormatterMode, source: string, indent: IndentChoice, compact: boolean) {
  if (!source.trim()) {
    throw new Error("Input is empty");
  }

  if (mode === "json") {
    try {
      const parsed = JSON.parse(source);
      return JSON.stringify(parsed, null, compact ? 0 : indentValue(indent));
    } catch (error) {
      throw new Error(jsonErrorMessage(error, source));
    }
  }

  const lineCounter = new LineCounter();
  const doc = parseDocument(source, { lineCounter });
  if (doc.errors.length > 0) {
    throw new Error(yamlErrorMessage(doc.errors[0]));
  }

  const value = doc.toJSON();
  return stringifyYaml(value, {
    indent: indent === "tab" ? 2 : Number(indent),
    collectionStyle: compact ? "flow" : "block",
  }).trimEnd();
}

export default function StructuredFormatterWorkspace({ mode }: StructuredFormatterWorkspaceProps) {
  const { theme } = useTheme();
  const w = workspaceChrome(theme);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState(sampleInput[mode]);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentChoice>("2");
  const [status, setStatus] = useState<Status>({
    kind: "idle",
    message: "Ready",
  });
  const [isBusy, setIsBusy] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const extension = mode === "json" ? "json" : "yaml";
  const title = mode === "json" ? "JSON" : "YAML";

  const runFormat = (compact = false) => {
    setIsBusy(true);
    setCopyState("idle");
    try {
      const nextOutput = formatInput(mode, input, indent, compact);
      setOutput(nextOutput);
      setStatus({
        kind: "success",
        message: compact ? `${title} compacted` : `${title} formatted`,
      });
    } catch (error) {
      setOutput("");
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Format failed",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1200);
    } catch {
      setStatus({
        kind: "error",
        message: "Clipboard permission was blocked",
      });
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: mode === "json" ? "application/json" : "application/yaml" });
    downloadBlob(blob, `formatted.${extension}`);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setStatus({ kind: "idle", message: "Ready" });
    setCopyState("idle");
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setInput(await file.text());
    setOutput("");
    setStatus({ kind: "idle", message: file.name });
    setCopyState("idle");
  };

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      <PremiumBackground />
      <input
        ref={fileInputRef}
        type="file"
        accept={mode === "json" ? ".json,application/json" : ".yaml,.yml,application/yaml,text/yaml,text/x-yaml"}
        className="hidden"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-1 flex-col gap-4 p-2 sm:p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:px-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => runFormat(false)}
              className={clsx(w.runPrimary, "min-h-11 rounded-xl px-4 text-[10px]")}
            >
              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Format
            </button>
            <button
              type="button"
              onClick={() => runFormat(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-4 text-[10px] font-bold uppercase tracking-tight text-zinc-700 transition-colors hover:bg-white"
            >
              <Minimize2 className="h-4 w-4" />
              Compact
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-4 text-[10px] font-bold uppercase tracking-tight text-zinc-700 transition-colors hover:bg-white"
            >
              <FileUp className="h-4 w-4" />
              Upload
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 text-[10px] font-bold uppercase tracking-tight text-zinc-500">
              Indent
              <select
                value={indent}
                onChange={(event) => setIndent(event.target.value as IndentChoice)}
                className="bg-transparent text-zinc-900 outline-none"
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="tab">Tab</option>
              </select>
            </label>
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-4 text-[10px] font-bold uppercase tracking-tight text-zinc-700 transition-colors hover:bg-white disabled:opacity-35"
            >
              {copyState === "copied" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clipboard className="h-4 w-4" />}
              {copyState === "copied" ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={downloadOutput}
              disabled={!output}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-4 text-[10px] font-bold uppercase tracking-tight text-zinc-700 transition-colors hover:bg-white disabled:opacity-35"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-4 text-[10px] font-bold uppercase tracking-tight text-zinc-700 transition-colors hover:bg-white"
            >
              <Eraser className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="flex min-h-[18rem] flex-col overflow-hidden rounded-2xl border border-black/10 bg-zinc-950 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <div className="flex min-h-11 items-center justify-between border-b border-white/10 px-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Input</h2>
              <span className="font-mono text-[10px] uppercase tracking-tight text-white/35">.{extension}</span>
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              className="min-h-0 flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-6 text-white outline-none placeholder:text-white/25"
              placeholder={`${title} input`}
            />
          </section>

          <section className="flex min-h-[18rem] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/85 shadow-[0_18px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            <div className="flex min-h-11 items-center justify-between border-b border-black/10 px-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Output</h2>
              <span
                className={clsx(
                  "max-w-[70%] truncate rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-tight",
                  status.kind === "success" && "bg-emerald-100 text-emerald-700",
                  status.kind === "error" && "bg-red-100 text-red-700",
                  status.kind === "idle" && "bg-zinc-100 text-zinc-500",
                )}
              >
                {status.message}
              </span>
            </div>
            <textarea
              value={output}
              readOnly
              spellCheck={false}
              className={clsx(
                "min-h-0 flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-6 outline-none",
                status.kind === "error" ? "text-red-700" : "text-zinc-900",
              )}
              placeholder={status.kind === "error" ? status.message : `${title} output`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
