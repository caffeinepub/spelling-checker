import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlignLeft,
  ArrowRight,
  Bold,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Github,
  Globe,
  Italic,
  Linkedin,
  List,
  RotateCcw,
  Sparkles,
  Twitter,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type SpellError, checkSpelling } from "./lib/spellcheck";

const SAMPLE_TEXT = `Speling checkers are amazingly usefull tools for writting. They can help you identfy mistakkes and imporve the overal quality of your writen comunicaation. Wether you're writting a profesional email, a schoool esay, or a creatve peice, having a relible speling checker makes a huge diferrence.`;

// ─── Header ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = ["Product", "Features", "Pricing", "About"];
const TOOLBAR_ICONS = [Bold, Italic, AlignLeft, List];

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5" data-ocid="header.link">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-700 text-lg text-foreground tracking-tight">
            SpellCheck<span className="text-primary">.io</span>
          </span>
        </div>

        <nav
          className="hidden md:flex items-center gap-6"
          data-ocid="header.link"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="header.link"
            >
              {item}
              {item === "Product" && <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="header.link"
          >
            Login
          </button>
          <Button
            size="sm"
            className="rounded-lg"
            data-ocid="header.primary_button"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── Editor Card ─────────────────────────────────────────────────────────────
interface EditorProps {
  text: string;
  errors: SpellError[];
  isChecking: boolean;
  onTextChange: (t: string) => void;
  onCheck: () => void;
  onClear: () => void;
  onReplace: (original: string, replacement: string) => void;
}

function EditorCard({
  text,
  errors,
  isChecking,
  onTextChange,
  onCheck,
  onClear,
  onReplace,
}: EditorProps) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div
      className="bg-white rounded-2xl shadow-card border border-border overflow-hidden"
      data-ocid="editor.panel"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-border bg-secondary/40">
        <div className="flex items-center gap-0.5">
          {TOOLBAR_ICONS.map((Icon) => (
            <button
              key={Icon.displayName}
              type="button"
              className="p-1.5 rounded hover:bg-border transition-colors text-muted-foreground"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
        <Separator orientation="vertical" className="h-5 mx-1" />
        <span className="text-xs text-muted-foreground ml-1">
          Document Editor
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </div>

      {/* Two panes */}
      <div className="grid md:grid-cols-2 min-h-[300px]">
        {/* Left: textarea */}
        <div className="p-4 border-r border-border flex flex-col">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Your Text
          </p>
          <textarea
            className="flex-1 w-full resize-none text-sm leading-relaxed text-foreground bg-transparent outline-none placeholder:text-muted-foreground/60 min-h-[260px]"
            placeholder="Type or paste your text here…"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            data-ocid="editor.textarea"
          />
        </div>

        {/* Right: corrections */}
        <div className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Corrections
            </p>
            {errors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errors.length} {errors.length === 1 ? "issue" : "issues"}
              </Badge>
            )}
            {errors.length === 0 && text.trim() && !isChecking && (
              <Badge className="text-xs bg-success text-success-foreground">
                <Check className="w-3 h-3 mr-1" /> All good!
              </Badge>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto space-y-2"
            data-ocid="editor.panel"
          >
            <AnimatePresence>
              {errors.length === 0 && text.trim() === "" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-8 text-center"
                  data-ocid="editor.empty_state"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Start typing to see corrections
                  </p>
                </motion.div>
              )}

              {errors.map((err, i) => (
                <motion.div
                  key={err.word}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-secondary/30 p-3"
                  data-ocid={`editor.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-highlight text-xs font-semibold text-amber-900">
                      {err.word}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      → did you mean?
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {err.suggestions.slice(0, 4).map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => onReplace(err.word, sug)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors font-medium"
                        data-ocid="editor.button"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-t border-border bg-secondary/30">
        <span className="text-xs text-muted-foreground">
          <strong className="text-foreground">{wordCount}</strong> words
        </span>
        <span className="text-xs text-muted-foreground">
          <strong className="text-foreground">{text.length}</strong> characters
        </span>
        <span className="text-xs text-muted-foreground">
          <strong
            className={errors.length > 0 ? "text-destructive" : "text-success"}
          >
            {errors.length}
          </strong>{" "}
          {errors.length === 1 ? "error" : "errors"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs h-8"
            onClick={onClear}
            data-ocid="editor.secondary_button"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear
          </Button>
          <Button
            size="sm"
            className="rounded-lg text-xs h-8"
            onClick={onCheck}
            disabled={isChecking}
            data-ocid="editor.primary_button"
          >
            <Zap className="w-3 h-3 mr-1" />
            {isChecking ? "Checking…" : "Check Spelling"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [errors, setErrors] = useState<SpellError[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCheck = useCallback((t: string) => {
    setIsChecking(true);
    setTimeout(() => {
      setErrors(checkSpelling(t));
      setIsChecking(false);
    }, 50);
  }, []);

  useEffect(() => {
    runCheck(SAMPLE_TEXT);
  }, [runCheck]);

  const handleTextChange = useCallback(
    (t: string) => {
      setText(t);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runCheck(t), 500);
    },
    [runCheck],
  );

  const handleCheck = useCallback(() => runCheck(text), [text, runCheck]);

  const handleClear = useCallback(() => {
    setText("");
    setErrors([]);
  }, []);

  const handleReplace = useCallback(
    (original: string, replacement: string) => {
      setText((prev) => {
        const regex = new RegExp(`\\b${original}\\b`, "i");
        const next = prev.replace(regex, replacement);
        setTimeout(() => runCheck(next), 50);
        return next;
      });
    },
    [runCheck],
  );

  return (
    <section
      className="relative pt-20 pb-16 px-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f7fbff 0%, #ffffff 60%)" }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.1 250), transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge
            className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
            variant="outline"
          >
            <Sparkles className="w-3 h-3 mr-1" /> Free spell checker
          </Badge>
          <h1 className="font-display text-5xl md:text-6xl font-800 text-foreground tracking-tight leading-tight mb-4">
            Check Your Spelling
            <br />
            <span className="text-primary">Instantly</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Paste or type your text below and get real-time spelling corrections
            with smart suggestions.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-xl text-base h-12 px-6"
              data-ocid="hero.primary_button"
            >
              Try It Free <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-xl text-base h-12"
              data-ocid="hero.secondary_button"
            >
              See how it works
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <EditorCard
            text={text}
            errors={errors}
            isChecking={isChecking}
            onTextChange={handleTextChange}
            onCheck={handleCheck}
            onClear={handleClear}
            onReplace={handleReplace}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Strip ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap,
    title: "Real-time Checking",
    desc: "Instant feedback as you type with sub-second latency",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    desc: "Context-aware replacements powered by Levenshtein distance",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Globe,
    title: "Multiple Languages",
    desc: "Support for English and expanding to 20+ languages soon",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: BookOpen,
    title: "Word Count & Stats",
    desc: "Track word count, character count, and error density",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

function FeaturesStrip() {
  return (
    <section
      className="py-16 px-6 border-y border-border bg-white"
      data-ocid="features.section"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-white hover:shadow-card-hover transition-shadow"
              data-ocid={`features.item.${i + 1}`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center`}
              >
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "SpellCheck.io has dramatically improved the quality of our team's written communications. The real-time suggestions are incredibly accurate.",
    name: "Sarah Mitchell",
    handle: "@sarahm_writes",
    initials: "SM",
    color: "bg-primary/20 text-primary",
  },
  {
    quote:
      "I use this every day for my blog posts. Catching typos before publishing has saved me so much embarrassment. Absolutely love it!",
    name: "James Okafor",
    handle: "@jameswrites",
    initials: "JO",
    color: "bg-success/20 text-success",
  },
  {
    quote:
      "The clean interface and instant feedback make it the best spelling tool I've tried. My students use it for their essays too.",
    name: "Dr. Elena Vasquez",
    handle: "@drvasquez_edu",
    initials: "EV",
    color: "bg-amber-100 text-amber-700",
  },
];

function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      className="py-20 px-6 bg-secondary/30"
      data-ocid="testimonials.section"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            Loved by writers
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-700 text-foreground">
            What our users say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-6 border border-border shadow-xs cursor-pointer transition-shadow ${
                active === i ? "shadow-card-hover border-primary/30" : ""
              }`}
              onClick={() => setActive(i)}
              data-ocid={`testimonials.item.${i + 1}`}
            >
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className={`text-xs font-bold ${t.color}`}>
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.handle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full transition-all ${
                active === i
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-border hover:bg-muted-foreground"
              }`}
              data-ocid="testimonials.toggle"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Benefits Section ─────────────────────────────────────────────────────────
const BENEFITS = [
  "Catch spelling errors before they embarrass you",
  "Smart context-aware word suggestions",
  "Works entirely in your browser — no data sent to servers",
  "Supports contractions, hyphenated words, and proper nouns",
  "Instant one-click word replacement",
  "Clean, distraction-free writing environment",
];

function BenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white" data-ocid="benefits.section">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-secondary/30 p-6 shadow-card">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Live Demo
              </p>
              <div className="space-y-2 font-mono text-sm">
                <p>
                  <span className="text-foreground">The quick brwon fox </span>
                  <span className="bg-highlight px-1 rounded text-amber-900 font-semibold">
                    jmps
                  </span>
                  <span className="text-foreground"> over the lazy dog.</span>
                </p>
                <div className="mt-4 rounded-xl bg-white border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Suggestion for <strong>jmps</strong>:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {["jumps", "jams", "jobs"].map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-success" />2 errors found
                &middot; 3 suggestions each
              </div>
            </div>
            <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              100% Private
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
              Why SpellCheck.io
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-700 text-foreground mb-6">
              Write with confidence,
              <br />
              every time
            </h2>
            <ul className="space-y-3">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                  data-ocid={`benefits.item.${i + 1}`}
                >
                  <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  {b}
                </motion.li>
              ))}
            </ul>
            <Button
              className="mt-8 rounded-xl"
              size="lg"
              data-ocid="benefits.primary_button"
            >
              Start Checking Free <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_LINKS: Record<string, string[]> = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "API", "Community", "Support"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

const SOCIAL_ICONS = [
  { Icon: Twitter, label: "Twitter" },
  { Icon: Github, label: "GitHub" },
  { Icon: Linkedin, label: "LinkedIn" },
];

function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-secondary/40 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-700 text-base text-foreground">
                SpellCheck<span className="text-primary">.io</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
              The fastest, most accurate free spelling checker on the web.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                {group}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year}. Built with ❤️ using{" "}
            <a
              href={utm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_ICONS.map(({ Icon, label }) => (
              <a
                key={label}
                href="/"
                aria-label={label}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                data-ocid="footer.link"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesStrip />
        <TestimonialsSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
