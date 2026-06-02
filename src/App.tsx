import { FormEvent, MouseEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ContainerScrollAnimation from "./components/ContainerScrollAnimation";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const productionOrigin = "https://hazina730.github.io";

// TODO: Add analytics and conversion tracking once the production measurement stack is chosen.
const youtubeUrl = "https://www.youtube.com/@hazinahazina-kids";
const youtubeUploadsEmbedUrl = "https://www.youtube-nocookie.com/embed/videoseries?list=UUOyywF-5ihBwosB-L63nYeQ";
// TODO: Replace placeholder social links with final Hazina profiles.
const instagramUrl = "https://www.instagram.com/hazina";
const tiktokUrl = "https://www.tiktok.com/@hazina";
// TODO: Replace placeholder email if the production inbox changes.
const contactEmail = "hazinakids@gmail.com";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "The Channel", path: "/channel" },
  { label: "For Creators", path: "/creators" },
  { label: "For Partners", path: "/partners" },
  { label: "Contact", path: "/contact" },
];

type ImpactCard = {
  role: "Parent" | "Creator" | "Partner";
  quote: string;
  initials: string;
};

const impactCards: ImpactCard[] = [
  {
    role: "Parent",
    quote: "I want my child to hear our language before it disappears.",
    initials: "PA",
  },
  {
    role: "Creator",
    quote: "Hazina gives Kenyan artists a platform to create stories, songs, and characters for our own children.",
    initials: "CR",
  },
  {
    role: "Partner",
    quote: "One episode can put one Kenyan language on screen for the next generation.",
    initials: "PT",
  },
];

type PageKey = "home" | "about" | "channel" | "creators" | "partners" | "contact";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

type FormState = Record<string, string>;
type FormErrors = Record<string, string>;

const pageMeta: Record<PageKey, { title: string; description: string }> = {
  home: {
    title: "Hazina — Your Language. Your Treasure.",
    description:
      "Kenya’s first animated cultural platform for children, sharing songs, stories, and rhymes in Kenya’s indigenous languages.",
  },
  about: {
    title: "About Hazina - Where Kenya's Children Find Themselves",
    description:
      "The story, problem, and vision behind Hazina, a Kenyan social enterprise preserving indigenous languages through animated children's content.",
  },
  channel: {
    title: "Watch Hazina - Animated Kenyan Songs and Stories",
    description:
      "Subscribe to Hazina on YouTube for animated songs, stories, rhymes, and cultural celebrations in Kenyan indigenous languages.",
  },
  creators: {
    title: "Create With Hazina - Kenyan Artists and Voice Talent",
    description:
      "Hazina commissions Kenyan animators, songwriters, poets, illustrators, and voice artists to create original African children's content.",
  },
  partners: {
    title: "Partner With Hazina - Cultural Platform for the African Century",
    description:
      "Partner with Hazina to launch Kenya's first children's cultural platform for indigenous languages, artists, and education.",
  },
  contact: {
    title: "Contact Hazina - Your Language. Your Treasure.",
    description:
      "Contact Hazina for creator enquiries, partnerships, parent feedback, media, and support for Kenyan indigenous language content.",
  },
};

function App() {
  const [path, setPath] = useState(normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const page = routeToPage(path);

  useEffect(() => {
    const meta = pageMeta[page];
    document.title = meta.title;
    updateMeta("description", meta.description);
    updateOg("og:title", meta.title);
    updateOg("og:description", meta.description);
    updateCanonical(path);
  }, [page, path]);

  const navigate = (nextPath: string) => {
    const normalized = normalizePath(nextPath);
    window.history.pushState({}, "", getInternalHref(normalized));
    setPath(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <SkipLink />
      <Header currentPath={path} onNavigate={navigate} />
      <main id="main-content">
        {page === "home" && <HomePage />}
        {page === "about" && <AboutPage />}
        {page === "channel" && <ChannelPage />}
        {page === "creators" && <CreatorsPage />}
        {page === "partners" && <PartnersPage />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

function normalizePath(path: string) {
  const withoutBase =
    basePath && (path === basePath || path.startsWith(`${basePath}/`)) ? path.slice(basePath.length) || "/" : path;
  const clean = withoutBase.replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

function getInternalHref(path: string) {
  const normalized = normalizePath(path);
  return `${basePath}${normalized === "/" ? "/" : normalized}`;
}

function routeToPage(path: string): PageKey {
  if (path === "/about") return "about";
  if (path === "/channel") return "channel";
  if (path === "/creators") return "creators";
  if (path === "/partners") return "partners";
  if (path === "/contact") return "contact";
  return "home";
}

function updateMeta(name: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (element) element.content = content;
}

function updateOg(property: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (element) element.content = content;
}

function updateCanonical(path: string) {
  const href = `${productionOrigin}${getInternalHref(path)}`;
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
  updateOg("og:url", href);
}

function SkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
  );
}

function Header({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 900px)").matches);
  const menuId = "main-navigation-menu";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const onChange = () => setIsDesktop(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const go = (path: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setOpen(false);
    onNavigate(path);
  };

  return (
    <header className="site-header">
      <nav className="nav-wrap" aria-label="Main navigation">
        <a className="brand-link" href={getInternalHref("/")} onClick={(event) => go("/", event)} aria-label="Hazina home">
          HAZINA
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <div
          id={menuId}
          className={open ? "nav-panel is-open" : "nav-panel"}
          aria-hidden={!open && !isDesktop}
          inert={!open && !isDesktop ? true : undefined}
        >
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                key={item.path}
                className={currentPath === item.path ? "nav-link is-active" : "nav-link"}
                href={getInternalHref(item.path)}
                onClick={(event) => go(item.path, event)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <Button href={youtubeUrl} variant="gold" external>
            Watch on YouTube
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  const go = (path: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate(path);
  };

  const backToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-cta">
        <p>The treasures of our past must not be buried. They must be uploaded.</p>
        <div className="footer-cta-actions" aria-label="Footer calls to action">
          <a className="footer-cta-button footer-cta-button-gold" href={youtubeUrl}>
            Watch on YouTube
          </a>
          <a className="footer-cta-button" href={getInternalHref("/partners")} onClick={(event) => go("/partners", event)}>
            Partner With Us
          </a>
        </div>
      </div>

      <div className="footer-inner">
        <section className="footer-brand" aria-label="Hazina">
          <a className="footer-wordmark" href={getInternalHref("/")} onClick={(event) => go("/", event)}>
            HAZINA
          </a>
          <p className="footer-tagline">Your language. Your treasure.</p>
          <p>Animated songs, rhymes, and stories in Kenya's indigenous languages.</p>
        </section>

        <nav className="footer-links" aria-label="Footer navigation">
          <h2>Explore</h2>
          {navItems.map((item) => (
            <a key={item.path} href={getInternalHref(item.path)} onClick={(event) => go(item.path, event)}>
              {item.label}
            </a>
          ))}
        </nav>

        <section className="footer-connect" aria-labelledby="footer-connect-title">
          <h2 id="footer-connect-title">Connect</h2>
          <a className="footer-email" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          <div className="social-links" aria-label="Social links">
            <a href={youtubeUrl} aria-label="Hazina Kids on YouTube">
              <SocialLogo type="youtube" />
              <span>YouTube</span>
            </a>
            <a href={instagramUrl} aria-label="Hazina on Instagram">
              <SocialLogo type="instagram" />
              <span>Instagram</span>
            </a>
            <a href={tiktokUrl} aria-label="Hazina on TikTok">
              <SocialLogo type="tiktok" />
              <span>TikTok</span>
            </a>
          </div>
        </section>

        <section className="footer-mission" aria-labelledby="footer-mission-title">
          <h2 id="footer-mission-title">Mission</h2>
          <p>&ldquo;Where Kenya's children find themselves.&rdquo;</p>
        </section>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Hazina.</p>
        <p>Built for Kenya's children, languages, and future.</p>
        <a href="#main-content" onClick={backToTop}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

function SocialLogo({ type }: { type: "youtube" | "instagram" | "tiktok" }) {
  if (type === "youtube") {
    return (
      <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M21.58 7.18a2.76 2.76 0 0 0-1.94-1.96C17.93 4.75 12 4.75 12 4.75s-5.93 0-7.64.47a2.76 2.76 0 0 0-1.94 1.96A28.92 28.92 0 0 0 2 12a28.92 28.92 0 0 0 .42 4.82 2.76 2.76 0 0 0 1.94 1.96c1.71.47 7.64.47 7.64.47s5.93 0 7.64-.47a2.76 2.76 0 0 0 1.94-1.96A28.92 28.92 0 0 0 22 12a28.92 28.92 0 0 0-.42-4.82ZM10 15.35v-6.7L15.75 12 10 15.35Z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.8 2.75h8.4A5.06 5.06 0 0 1 21.25 7.8v8.4a5.06 5.06 0 0 1-5.05 5.05H7.8a5.06 5.06 0 0 1-5.05-5.05V7.8A5.06 5.06 0 0 1 7.8 2.75Zm0 1.8A3.25 3.25 0 0 0 4.55 7.8v8.4a3.25 3.25 0 0 0 3.25 3.25h8.4a3.25 3.25 0 0 0 3.25-3.25V7.8a3.25 3.25 0 0 0-3.25-3.25H7.8Zm4.2 3.32a4.13 4.13 0 1 1 0 8.26 4.13 4.13 0 0 1 0-8.26Zm0 1.8a2.33 2.33 0 1 0 0 4.66 2.33 2.33 0 0 0 0-4.66Zm4.46-2.86a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92Z" />
      </svg>
    );
  }

  return (
    <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15.7 2.75c.22 1.86 1.25 3.02 3.1 3.15v3.12a6.1 6.1 0 0 1-3.05-.88v5.78c0 4.03-2.2 6.33-5.55 6.33a5.12 5.12 0 0 1-5.1-5.19c0-3.18 2.33-5.31 5.76-5.31.29 0 .53.02.74.06v3.26a3.5 3.5 0 0 0-.88-.1 2.02 2.02 0 0 0-2.23 2.02 1.97 1.97 0 0 0 2.01 2.04c1.25 0 2.05-.8 2.05-2.42V2.75h3.15Z" />
    </svg>
  );
}

function Button({
  children,
  href,
  variant = "navy",
  external,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  variant?: "gold" | "navy" | "cream" | "outline";
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const className = `button button-${variant}`;
  if (href) {
    return (
      <a
        className={className}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function Section({
  children,
  tone = "cream",
  eyebrow,
  title,
  intro,
  className = "",
}: {
  children: ReactNode;
  tone?: "cream" | "navy" | "white";
  eyebrow?: string;
  title?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <section className={`section section-${tone} ${className}`}>
      <div className="section-inner reveal">
        {(eyebrow || title || intro) && (
          <div className="section-heading">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {intro && <p>{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function PageHero({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow?: string;
  title: string;
  copy: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero pattern-field">
      <div className="page-hero-inner reveal">
        {eyebrow && <p className="eyebrow gold-text">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{copy}</p>
        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function FeatureCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="feature-card reveal">
      <div className="feature-mark" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function ImpactSwipeStack() {
  const [cards, setCards] = useState<ImpactCard[]>(impactCards);

  const moveFrontToBack = () => {
    setCards(([frontCard, ...remainingCards]) => [...remainingCards, frontCard]);
  };

  return (
    <div className="impact-layout">
      <div className="impact-copy">
        <p className="eyebrow gold-text">Why It Matters</p>
        <h2>Little voices should hear home.</h2>
        <p>
          Hazina is for the child singing along, the parent smiling from the sofa, and the artist making a world that
          sounds like home.
        </p>
      </div>
      <div className="impact-controls">
        <div className="impact-stack" aria-label="Hazina impact story cards" aria-live="polite">
          {cards.map((card, index) => (
            <ImpactStoryCard
              key={card.role}
              card={card}
              stackIndex={index}
              isFront={index === 0}
              onSwipeAway={moveFrontToBack}
            />
          ))}
        </div>
        <div className="impact-actions" aria-label="Impact card controls">
          <button type="button" onClick={moveFrontToBack}>
            Swap
          </button>
        </div>
      </div>
    </div>
  );
}

function ImpactStoryCard({
  card,
  stackIndex,
  isFront,
  onSwipeAway,
}: {
  card: ImpactCard;
  stackIndex: number;
  isFront: boolean;
  onSwipeAway: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 180], [-8, 8]);
  const opacity = useTransform(x, [-220, 0, 220], [0.82, 1, 0.82]);
  const stackOffset = stackIndex * 14;

  return (
    <motion.article
      className={isFront ? "impact-card is-front" : "impact-card"}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={(_, info) => {
        if (isFront && Math.abs(info.offset.x) > 90) onSwipeAway();
      }}
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 1,
        zIndex: impactCards.length - stackIndex,
      }}
      animate={{
        y: stackOffset,
        scale: 1 - stackIndex * 0.045,
      }}
      transition={{ type: "spring", stiffness: 230, damping: 26 }}
      tabIndex={0}
      aria-hidden={!isFront}
      aria-label={`${card.role} impact story: ${card.quote}`}
    >
      {isFront && (
        <>
          <div className="impact-card-header">
            <span className="impact-badge" aria-hidden="true">
              {card.initials}
            </span>
            <div>
              <p>{card.role}</p>
              <span>Swipe or tap Swap</span>
            </div>
          </div>
          <blockquote>{card.quote}</blockquote>
        </>
      )}
    </motion.article>
  );
}

function HazinaChannelExperienceSection() {
  return (
    <ContainerScrollAnimation
      titleComponent={
        <>
          <p className="eyebrow">The channel experience</p>
          <h2>Watch Hazina come alive.</h2>
          <p>
            A child presses play. A greeting becomes a song. A language becomes a world they can see, hear, and
            remember.
          </p>
        </>
      }
    >
      <HazinaPreviewScreen />
    </ContainerScrollAnimation>
  );
}

function HazinaPreviewScreen() {
  const previewTiles = ["Songs", "Stories", "Greetings"];

  return (
    <article className="hazina-preview-screen" aria-label="Mock Hazina YouTube pilot episode preview">
      <div className="hazina-preview-pattern pattern-one" aria-hidden="true" />
      <div className="hazina-preview-pattern pattern-two" aria-hidden="true" />
      <div className="hazina-preview-header">
        <div>
          <p>Pilot episode preview</p>
          <h3>Hello in all 42 Kenyan languages</h3>
        </div>
        <button className="hazina-preview-play" type="button" aria-label="Preview play button for Hazina pilot mockup">
          <span aria-hidden="true" />
        </button>
      </div>
      <div className="hazina-preview-stage" aria-hidden="true">
        <div className="hazina-preview-sun" />
        <div className="hazina-preview-character">
          <span />
        </div>
        <div className="hazina-preview-caption">Jambo. Niaje. Ber ahinya.</div>
      </div>
      <div className="hazina-preview-grid">
        {previewTiles.map((tile) => (
          <div className="hazina-preview-tile" key={tile}>
            <span aria-hidden="true" />
            <p>{tile}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function PartnerCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="partner-card">
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function PlaylistCard({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="playlist-card">
      <div className="playlist-art" aria-hidden="true">
        <span />
      </div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

function TeamCard({ name, role, bio }: { name: string; role: string; bio: string }) {
  // TODO: Replace placeholder team images and bios with real founder/team details.
  return (
    <article className="team-card">
      <div className="team-photo" role="img" aria-label={`${name} placeholder portrait`} />
      <h3>{name}</h3>
      <p className="team-role">{role}</p>
      <p>{bio}</p>
    </article>
  );
}

function VideoEmbedPlaceholder({
  title,
  caption,
  embedUrl,
  large,
}: {
  title: string;
  caption?: string;
  embedUrl?: string;
  large?: boolean;
}) {
  // TODO: Replace the channel uploads embed with a specific pilot episode embed when the first video is published.
  return (
    <div className={large ? "video-block video-large" : "video-block"}>
      {embedUrl ? (
        <div className="video-embed-card">
          <div className="video-frame video-frame-embed">
            <iframe
              title={title}
              src={embedUrl}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <a className="video-channel-link" href={youtubeUrl}>
            Watch on Hazina Kids YouTube
          </a>
        </div>
      ) : (
        <div className="video-frame" role="img" aria-label={`${title} video placeholder`}>
          <div className="play-button" aria-hidden="true" />
          <p>{title}</p>
          <span>YouTube embed placeholder</span>
        </div>
      )}
      {caption && <p className="video-caption">{caption}</p>}
    </div>
  );
}

function ContactForm({
  title,
  fields,
  submitLabel,
  successMessage,
}: {
  title: string;
  fields: FieldConfig[];
  submitLabel: string;
  successMessage: string;
}) {
  const initialState = useMemo(
    () =>
      fields.reduce<FormState>((state, field) => {
        state[field.name] = "";
        return state;
      }, {}),
    [fields],
  );
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateFields(fields, values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    // TODO: Connect this placeholder handler to an email, CRM, or form service.
    setStatus("success");
    setValues(initialState);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <h2>{title}</h2>
      {fields.map((field) => {
        const errorId = `${field.name}-error`;
        return (
          <label className="form-field" key={field.name}>
            <span>
              {field.label}
              {field.required && <em> required</em>}
            </span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={values[field.name]}
                placeholder={field.placeholder}
                required={field.required}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? errorId : undefined}
                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                value={values[field.name]}
                required={field.required}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? errorId : undefined}
                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
              >
                <option value="">Select one</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type ?? "text"}
                name={field.name}
                value={values[field.name]}
                placeholder={field.placeholder}
                required={field.required}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? errorId : undefined}
                onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
              />
            )}
            {errors[field.name] && (
              <small id={errorId} className="form-error">
                {errors[field.name]}
              </small>
            )}
          </label>
        );
      })}
      {status === "success" && <p className="form-success">{successMessage}</p>}
      {status === "error" && <p className="form-error form-status">Please check the required fields.</p>}
      <p className="form-privacy">We'll only use your details to respond to your enquiry. No spam.</p>
      <Button type="submit" variant="gold">
        {submitLabel}
      </Button>
    </form>
  );
}

function validateFields(fields: FieldConfig[], values: FormState) {
  const errors: FormErrors = {};
  fields.forEach((field) => {
    const value = values[field.name]?.trim() ?? "";
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required.`;
    }
    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field.name] = "Enter a valid email address.";
    }
    if (field.type === "url" && value) {
      try {
        new URL(value);
      } catch {
        errors[field.name] = "Enter a valid link, including https://.";
      }
    }
  });
  return errors;
}

function HomePage() {
  return (
    <>
      <section className="home-hero pattern-field">
        <div className="home-hero-content reveal">
          <p className="eyebrow gold-text">Animated. Cultural. Yours.</p>
          <h1>Your language. Your treasure.</h1>
          <p>Kenya's first animated cultural platform for children - in their own languages.</p>
          <div className="hero-actions">
            <Button href={youtubeUrl} variant="gold" external>
              Watch on YouTube
            </Button>
            <Button href={getInternalHref("/partners")} variant="outline">
              Partner With Us
            </Button>
          </div>
        </div>
        <div className="hero-video-wrap reveal">
          <VideoEmbedPlaceholder title="Hello From Every Corner of Kenya" embedUrl={youtubeUploadsEmbedUrl} large />
        </div>
      </section>

      <Section
        eyebrow="The challenge"
        title="Kenyan children deserve to hear home on screen."
        intro="Kenya has over 42 indigenous languages. But many children are growing up watching content in English, learning nursery rhymes written for children in other countries. Generation Alpha is spending 4-5 hours a day on screens - but almost none of that time is spent hearing their own language. Hazina is changing that."
      >
        <div className="stat-grid">
          <StatCard value="42+" label="indigenous languages" />
          <StatCard value="4-5 hrs" label="daily screen time" />
          <StatCard value="80%+" label="children under 12 watch YouTube" />
          <StatCard value="18M+" label="active streaming users in Kenya" />
        </div>
        <p className="source-note">
          Sources include SOAS language research, UNESCO language classifications, and public digital media usage
          estimates. Final citations to be confirmed before launch.
        </p>
      </Section>

      <Section eyebrow="What is Hazina" title="A cultural platform made for the children building tomorrow.">
        <div className="card-grid three">
          <FeatureCard title="The Platform">
            Animated songs, stories, and rhymes in Kenyan indigenous languages on YouTube.
          </FeatureCard>
          <FeatureCard title="The Creators">
            Kenyan animators, songwriters, poets, illustrators, and voice artists creating original African content.
          </FeatureCard>
          <FeatureCard title="The Mission">
            Preserving Kenya's languages and ways of thinking for the generation that will build the African Century.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="navy" className="impact-section">
        <ImpactSwipeStack />
      </Section>

      <HazinaChannelExperienceSection />

      <Section tone="white" eyebrow="Featured video" title="Start with hello.">
        <div className="featured-video-layout">
          <VideoEmbedPlaceholder
            title="Hello From Every Corner of Kenya"
            caption="Watch our first episode - hello in all 42 Kenyan languages."
            embedUrl={youtubeUploadsEmbedUrl}
            large
          />
          <div className="featured-copy">
            <p>
              Each episode is designed to feel familiar, musical, and proudly Kenyan, with language as the doorway into
              identity.
            </p>
            <Button href={youtubeUrl} variant="navy" external>
              Subscribe on YouTube
            </Button>
          </div>
        </div>
      </Section>

      <section className="closing-band pattern-field">
        <p>The treasures of our past must not be buried. They must be uploaded.</p>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Where Kenya's children find themselves."
        title="The story behind Hazina"
        copy="Hazina began with a child, a tablet, a grandmother's voice, and a question Kenya could no longer postpone."
      />
      <Section eyebrow="The story" title="Why not one for Kinza?">
        <div className="narrative">
          <p>
            Dorothy watched her baby cousin Kinza mesmerized by Miss Rachel on a tablet. Across the room, her
            grandmother spoke in her native tongue. In that moment, Dorothy realized Kinza was learning to navigate a
            world that did not sound like her home.
          </p>
          <p>
            The question that started Hazina was simple: Why is there a Miss Rachel for every Western child - but not
            one for Kinza?
          </p>
        </div>
      </Section>
      <Section tone="white" eyebrow="The problem" title="Language is leaving the living room.">
        <div className="bullet-panel">
          <p>Nearly 60% of people in Nairobi do not speak the mother tongue of either parent at home.</p>
          <p>Kenya has 42+ indigenous languages.</p>
          <p>Several are already classified as endangered by UNESCO.</p>
          <p>Children are spending more time on digital platforms than ever before.</p>
        </div>
      </Section>
      <Section eyebrow="Our vision" title="A platform Kinza deserves.">
        <div className="vision-quote">
          <p>
            "We are building the platform that Kinza deserves. A place where Kenyan children hear their first words in
            Dholuo through an animated song. Where a child in Nairobi finally laughs at a Kalenjin riddle because
            someone made it fun. Where clicking play supports a Kenyan artist."
          </p>
        </div>
      </Section>
      <Section tone="white" eyebrow="Team" title="The people carrying the treasure.">
        <div className="card-grid three">
          <TeamCard
            name="Founder name placeholder"
            role="Founder / Creative Lead"
            bio="Short founder bio placeholder. Add the founder's story, language background, and creative mission here."
          />
          <TeamCard
            name="Team member placeholder"
            role="Animation Lead"
            bio="Short bio placeholder for the artist shaping Hazina's warm, child-friendly animated world."
          />
          <TeamCard
            name="Team member placeholder"
            role="Language & Culture Advisor"
            bio="Short bio placeholder for the advisor helping each episode respect language, context, and oral tradition."
          />
        </div>
      </Section>
    </>
  );
}

function ChannelPage() {
  return (
    <>
      <PageHero
        eyebrow="The African Century, uploaded."
        title="Watch Hazina"
        copy="All Hazina content lives on our YouTube channel. Subscribe to be notified every time a new episode drops."
      >
        <Button href={youtubeUrl} variant="gold" external>
          Subscribe on YouTube
        </Button>
      </PageHero>
      <Section title="New episodes, old treasures, bright screens.">
        <div className="channel-layout">
          <VideoEmbedPlaceholder title="Latest Hazina Kids uploads" embedUrl={youtubeUploadsEmbedUrl} large />
          <aside className="subscriber-panel">
            <span>Subscriber count</span>
            {/* TODO: Replace placeholder subscriber count with a real YouTube API value. */}
            <strong>Coming soon</strong>
            <p>Replace this with the live YouTube count when the channel API is connected.</p>
            <Button href={youtubeUrl} variant="gold" external>
              Subscribe
            </Button>
          </aside>
        </div>
      </Section>
      <Section tone="white" eyebrow="Playlists" title="Explore the channel.">
        <div className="card-grid three">
          <PlaylistCard title="Language Songs" copy="Original songs that help children hear, repeat, and love Kenyan words." />
          <PlaylistCard title="Stories & Folklore" copy="Animated tales from oral traditions, retold for small hands and curious minds." />
          <PlaylistCard title="Cultural Celebrations" copy="Episodes celebrating names, greetings, food, riddles, dance, and belonging." />
        </div>
      </Section>
    </>
  );
}

const creatorFields: FieldConfig[] = [
  { name: "fullName", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  {
    name: "role",
    label: "Skill / role",
    type: "select",
    required: true,
    options: ["Animator", "Songwriter", "Poet/Storyteller", "Voice Artist", "Illustrator", "Other"],
  },
  { name: "languages", label: "Languages you work in or speak", required: true },
  { name: "portfolio", label: "Link to portfolio or work samples", type: "url", required: true },
  { name: "message", label: "Short message", type: "textarea", placeholder: "Tell us what you would love to make." },
];

function CreatorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Built by Kenyan artists, for Kenyan children."
        title="Create with Hazina"
        copy="Hazina commissions original animated episodes, songs, stories, and rhymes - and pays creators from day one."
      />
      <Section>
        <div className="split-layout">
          <div className="story-copy">
            <h2>We want work that sounds like home.</h2>
            <p>
              Hazina is built by Kenyan artists, for Kenyan children. We commission original content - animated
              episodes, songs, stories - and we pay our creators from day one. If you are an animator, songwriter, poet,
              illustrator, or voice artist with a love for Kenyan culture, we want to hear from you.
            </p>
          </div>
          <div className="bullet-panel compact">
            <p>2D or 3D animators with a warm, child-friendly style</p>
            <p>Songwriters who write original children's songs in Kenyan indigenous languages</p>
            <p>Poets and storytellers with knowledge of Kenyan folklore and oral traditions</p>
            <p>Voice artists who are native or fluent speakers of Kenyan languages</p>
            <p>Illustrators for background art and character design</p>
          </div>
        </div>
      </Section>
      <Section tone="white" eyebrow="How it works" title="Clear commissions, cultural care.">
        <div className="card-grid four">
          <FeatureCard title="Per episode">We commission work on a per-episode basis.</FeatureCard>
          <FeatureCard title="Creator credit">You retain credit on all content you create.</FeatureCard>
          <FeatureCard title="Shared growth">As the channel grows, we move to a revenue-sharing model.</FeatureCard>
          <FeatureCard title="African first">Hazina should feel African, not like a Western format with Kenyan names swapped in.</FeatureCard>
        </div>
      </Section>
      <Section title="Expression of interest">
        <ContactForm
          title="Tell us what you create"
          fields={creatorFields}
          submitLabel="Submit interest"
          successMessage="Thank you. Your creator interest has been recorded locally for now."
        />
      </Section>
    </>
  );
}

const partnerFields: FieldConfig[] = [
  { name: "name", label: "Name", required: true },
  { name: "organisation", label: "Organisation", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  {
    name: "interest",
    label: "Type of partnership interest",
    type: "select",
    required: true,
    options: ["Sponsorship", "Institutional Partnership", "Media Partnership", "Other"],
  },
  { name: "message", label: "Message", type: "textarea", required: true },
];

function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Professional, credible, warm."
        title="Partner with Hazina"
        copy="Hazina is a social enterprise seeking founding partners to help launch Kenya's first children's cultural platform."
      >
        <Button href={`mailto:${contactEmail}`} variant="gold">
          Email Hazina
        </Button>
      </PageHero>
      <Section
        eyebrow="The opportunity"
        title="The audience is already watching."
        intro="Kenya has 18 million+ active streaming users. Generation Alpha children are spending over 4 hours per day on screens. Over 80% of children under 12 watch YouTube daily. The audience is there. The habit is there. What does not exist yet is the content - and Hazina is building it."
      >
        <div className="partner-statement">
          <p>
            We are not asking for charity - we are offering the opportunity to be part of the cultural foundation of the
            African Century.
          </p>
        </div>
      </Section>
      <Section tone="white" eyebrow="Partner types" title="Three ways to stand with the future.">
        <div className="card-grid three">
          <PartnerCard title="Founding Sponsors">
            Brands or foundations willing to sponsor our first content series. One episode = one Kenyan language
            preserved on screen.
          </PartnerCard>
          <PartnerCard title="Institutional Partners">
            KICD, county governments, education NGOs, and UN agencies. Hazina supports mother-tongue learning and
            cultural preservation.
          </PartnerCard>
          <PartnerCard title="Media Partners">
            Kenyan TV stations, radio, and digital media who want to co-distribute or amplify the content.
          </PartnerCard>
        </div>
      </Section>
      <Section eyebrow="Business model" title="A mission with practical revenue paths.">
        <div className="card-grid four">
          <FeatureCard title="YouTube ad revenue">Audience growth creates an owned media channel.</FeatureCard>
          <FeatureCard title="Brand sponsorships">Partners can underwrite language-first content series.</FeatureCard>
          <FeatureCard title="Institutional partnerships">Education and culture partners can fund reach and impact.</FeatureCard>
          <FeatureCard title="Content licensing">Schools and education apps can license episodes and learning assets.</FeatureCard>
        </div>
      </Section>
      <Section tone="white" title="Partnership enquiry">
        <ContactForm
          title="Start the conversation"
          fields={partnerFields}
          submitLabel="Send enquiry"
          successMessage="Thank you. Your partnership enquiry has been recorded locally for now."
        />
      </Section>
    </>
  );
}

const contactFields: FieldConfig[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "message", label: "Message", type: "textarea", required: true },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Talk to Hazina"
        title="We would love to hear from you."
        copy="Whether you are a creator, a partner, a parent, or just someone who believes in what we are doing."
      />
      <Section>
        <div className="contact-layout">
          <ContactForm
            title="Send a message"
            fields={contactFields}
            submitLabel="Submit"
            successMessage="Thank you. Your message has been recorded locally for now."
          />
          <aside className="contact-details">
            <h2>Contact details</h2>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <a href={youtubeUrl}>Hazina Kids on YouTube</a>
            <a href={instagramUrl}>Instagram placeholder</a>
            <a href={tiktokUrl}>TikTok placeholder</a>
          </aside>
        </div>
      </Section>
    </>
  );
}

export default App;
