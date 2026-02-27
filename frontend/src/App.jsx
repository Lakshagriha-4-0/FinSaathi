const learningPaths = [
  {
    title: 'Everyday Money Basics',
    level: 'Beginner',
    lessons: '8 short lessons',
    description: 'Understand income, expenses, and safe saving habits with local examples.',
  },
  {
    title: 'Debt & Credit Confidence',
    level: 'Intermediate',
    lessons: '6 guided lessons',
    description: 'Learn how interest works, avoid traps, and build healthy credit histories.',
  },
  {
    title: 'Family Goals Planning',
    level: 'Practical',
    lessons: '5 weekly plans',
    description: 'Set goals for education, healthcare, and emergencies with a simple plan.',
  },
]

const tools = [
  {
    title: 'Budget Companion',
    detail: 'Track daily spending with cash-first categories and reminders.',
  },
  {
    title: 'Savings Ladder',
    detail: 'Small goals that grow into an emergency cushion.',
  },
  {
    title: 'Benefits Finder',
    detail: 'See local aid programs and eligibility checks in minutes.',
  },
]

const stories = [
  {
    name: 'Sana, textile worker',
    quote: 'The weekly plan helped me save for my daughter’s school fees without stress.',
  },
  {
    name: 'Ravi, street vendor',
    quote: 'I now separate business and home cash, which stopped my weekly shortfalls.',
  },
  {
    name: 'Amina, caregiver',
    quote: 'I learned how to avoid debt traps and set a real emergency fund target.',
  },
]

function App() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="relative overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[var(--sun)] opacity-40 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[var(--mint)] opacity-40 blur-3xl" />

        <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[var(--ink)] text-[var(--paper)] grid place-items-center font-semibold">
              FS
            </div>
            <div>
              <p className="text-lg font-semibold">FinSaathi</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Community Finance</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a className="hover:text-[var(--ink-strong)]" href="#paths">Learning Paths</a>
            <a className="hover:text-[var(--ink-strong)]" href="#tools">Tools</a>
            <a className="hover:text-[var(--ink-strong)]" href="#stories">Stories</a>
            <a className="hover:text-[var(--ink-strong)]" href="#contact">Support</a>
          </nav>
          <button className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-[var(--paper)] shadow-soft">
            Join Free
          </button>
        </header>

        <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--paper)]">
              Built for marginalized communities
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Financial literacy that fits your life, language, and reality.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-[var(--ink-muted)]">
              Learn money skills with practical lessons, budget tools, and local resources. No jargon, no pressure—just clear steps toward stability.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-[var(--paper)] shadow-soft">
                Start Learning
              </button>
              <button className="rounded-full border border-[var(--ink)] px-6 py-3 text-sm font-semibold text-[var(--ink)]">
                Talk to a Guide
              </button>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-2xl font-semibold">20k+</p>
                <p className="text-[var(--ink-muted)]">Learners supported</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-2xl font-semibold">48</p>
                <p className="text-[var(--ink-muted)]">Local partners</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
                <p className="text-2xl font-semibold">12</p>
                <p className="text-[var(--ink-muted)]">Languages</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-white/80 p-8 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--ink-muted)]">Today’s Focus</p>
              <span className="rounded-full bg-[var(--sun)] px-3 py-1 text-xs font-semibold">New</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Cash Flow Snapshot</h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              A simple view of what came in and what went out this week.
            </p>
            <div className="mt-6 rounded-2xl bg-[var(--ink)] p-5 text-[var(--paper)]">
              <div className="flex items-center justify-between text-sm">
                <span>Income</span>
                <span className="font-semibold">₹ 8,400</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>Essentials</span>
                <span className="font-semibold">₹ 5,150</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>Family Goals</span>
                <span className="font-semibold">₹ 1,200</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/20">
                <div className="h-2 w-3/4 rounded-full bg-[var(--mint)]" />
              </div>
              <p className="mt-3 text-xs text-white/70">You are 74% on track this week.</p>
            </div>
          </div>
        </section>
      </div>

      <section id="paths" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--ink-muted)]">Learning Paths</p>
            <h2 className="mt-2 text-3xl font-semibold">Clear lessons. Local examples. Real progress.</h2>
          </div>
          <button className="rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-semibold">
            View all programs
          </button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {learningPaths.map((path) => (
            <div key={path.title} className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">{path.level}</p>
              <h3 className="mt-3 text-xl font-semibold">{path.title}</h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{path.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm font-semibold">
                <span>{path.lessons}</span>
                <span className="text-[var(--ink-strong)]">Start</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="bg-[var(--ink)] py-16 text-[var(--paper)]">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Tools that work offline</p>
            <h2 className="mt-3 text-3xl font-semibold">Practical tools designed for cash-first households.</h2>
            <p className="mt-4 text-white/70">
              Downloadable checklists, SMS reminders, and guided prompts for caregivers, workers, and entrepreneurs.
            </p>
          </div>
          <div className="grid gap-4">
            {tools.map((tool) => (
              <div key={tool.title} className="rounded-3xl border border-white/20 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">{tool.title}</h3>
                <p className="mt-2 text-sm text-white/70">{tool.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--ink-muted)]">Community Stories</p>
            <h2 className="mt-3 text-3xl font-semibold">Made for real people with real pressures.</h2>
            <p className="mt-4 text-[var(--ink-muted)]">
              Stories from learners who used FinSaathi to stabilize income, reduce debt, and build confidence.
            </p>
            <button className="mt-6 rounded-full bg-[var(--sun)] px-6 py-3 text-sm font-semibold text-[var(--ink)]">
              Read more stories
            </button>
          </div>
          <div className="grid gap-4">
            {stories.map((story) => (
              <div key={story.name} className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-card">
                <p className="text-sm text-[var(--ink-muted)]">{story.quote}</p>
                <p className="mt-3 text-sm font-semibold">{story.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-8 rounded-[32px] border border-[var(--border)] bg-white p-10 shadow-card md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--ink-muted)]">Get Support</p>
            <h2 className="mt-3 text-3xl font-semibold">Speak with a community guide.</h2>
            <p className="mt-4 text-[var(--ink-muted)]">
              Request a call or message in your language. We partner with local NGOs to provide safe, trusted guidance.
            </p>
          </div>
          <div className="grid gap-3 text-sm">
            <input className="w-full rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Full name" />
            <input className="w-full rounded-2xl border border-[var(--border)] px-4 py-3" placeholder="Phone or WhatsApp" />
            <select className="w-full rounded-2xl border border-[var(--border)] px-4 py-3">
              <option>Select language</option>
              <option>Hindi</option>
              <option>English</option>
              <option>Bangla</option>
              <option>Tamil</option>
            </select>
            <button className="rounded-2xl bg-[var(--ink)] px-4 py-3 font-semibold text-[var(--paper)]">
              Request support
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-white/70 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-[var(--ink-muted)]">
          <p>FinSaathi · Empowering communities through financial literacy</p>
          <div className="flex gap-4">
            <a href="#paths">Programs</a>
            <a href="#tools">Tools</a>
            <a href="#contact">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
