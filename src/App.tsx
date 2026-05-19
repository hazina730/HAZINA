import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

const youtubeUrl = "https://www.youtube.com/@Hazina";
const instagramUrl = "https://www.instagram.com/hazina";
const tiktokUrl = "https://www.tiktok.com/@hazina";
const contactEmail = "hello@hazina.co.ke";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "The Channel", path: "/channel" },
  { label: "For Creators", path: "/creators" },
  { label: "For Partners", path: "/partners" },
  { label: "Contact", path: "/contact" },
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
    title: "Hazina - Your Language. Your Treasure.",
    description:
      "Kenya's first animated cultural platform for children, sharing songs, stories, and rhymes in Kenya's indigenous languages.",
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
  }, [page]);

  const navigate = (nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(normalizePath(nextPath));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <SkipLink />
      <Header currentPath={path} onNavigate={navigate} />
      <main id="main-content">
        {page === "home" && <HomePage onNavigate={navigate} />}
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
  const clean = path.replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
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

  const go = (path: string) => {
    setOpen(false);
    onNavigate(path);
  };

  return (
    <header className="site-header">
      <nav className="nav-wrap" aria-label="Main navigation">
        <button className="brand-link" onClick={() => go("/")} aria-label="Hazina home">
          HAZINA
        </button>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={open ? "nav-panel is-open" : "nav-panel"}>
          <div className="nav-links">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={currentPath === item.path ? "nav-link is-active" : "nav-link"}
                onClick={() => go(item.path)}
              >
                {item.label}
              </button>
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
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-wordmark">HAZINA</div>
          <p>Your language. Your treasure.</p>
          <p className="footer-small">Built for Kenya's children, languages, and future.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => onNavigate(item.path)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="social-links">
          <a href={youtubeUrl}>YouTube</a>
          <a href={instagramUrl}>Instagram</a>
          <a href={tiktokUrl}>TikTok</a>
        </div>
      </div>
      <p className="copyright">Copyright {new Date().getFullYear()} Hazina. All rights reserved.</p>
    </footer>
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
  large,
}: {
  title: string;
  caption?: string;
  large?: boolean;
}) {
  return (
    <div className={large ? "video-block video-large" : "video-block"}>
      <div className="video-frame" role="img" aria-label={`${title} video placeholder`}>
        <div className="play-button" aria-hidden="true" />
        <p>{title}</p>
        <span>YouTube embed placeholder</span>
      </div>
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

function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
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
            <Button variant="outline" onClick={() => onNavigate("/partners")}>
              Partner With Us
            </Button>
          </div>
        </div>
        <div className="hero-video-wrap reveal">
          <VideoEmbedPlaceholder title="Hazina pilot episode" large />
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

      <Section tone="white" eyebrow="Featured video" title="Start with hello.">
        <div className="featured-video-layout">
          <VideoEmbedPlaceholder
            title="Hello in all 42 Kenyan languages"
            caption="Watch our first episode - hello in all 42 Kenyan languages."
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
          <VideoEmbedPlaceholder title="Latest Hazina video" large />
          <aside className="subscriber-panel">
            <span>Subscriber count</span>
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
            <a href={youtubeUrl}>YouTube placeholder</a>
            <a href={instagramUrl}>Instagram placeholder</a>
            <a href={tiktokUrl}>TikTok placeholder</a>
          </aside>
        </div>
      </Section>
    </>
  );
}

export default App;
