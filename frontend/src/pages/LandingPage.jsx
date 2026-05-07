import { useEffect, useState } from 'react';
import Icons from '../components/Icons';

const LandingPage = ({ onGetStarted, onLogin }) => {
	const [showSticky, setShowSticky] = useState(false);

	useEffect(() => {
		const elements = Array.from(document.querySelectorAll('.js-reveal'));
		if (!elements.length) {
			return undefined;
		}

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			elements.forEach((element) => element.classList.add('is-visible'));
			return undefined;
		}

		const observer = new IntersectionObserver(
			(entries, activeObserver) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						activeObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
		);

		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setShowSticky(window.scrollY > 240);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const marqueeLogos = [
		'NORTHWIND',
		'VECTORLAB',
		'STACKNINE',
		'CLOUDTHREAD',
		'LUMINARY',
		'PATCHWORK',
		'MOONLIGHT'
	];

	const testimonials = [
		{
			quote: 'We cut triage time by half. The metadata filters are lifesavers.',
			byline: 'Maya, Platform Lead'
		},
		{
			quote: 'It feels like having a map of the whole system, always updated.',
			byline: 'Andre, Staff Engineer'
		},
		{
			quote: 'Our onboarding docs used to be stale. Now it is live knowledge.',
			byline: 'Keiko, Product Ops'
		}
	];

	const renderLogoRow = (rowId) => (
		<div className="flex items-center gap-10 px-6 text-slate-400 text-sm font-semibold">
			{marqueeLogos.map((logo) => (
				<span key={`${logo}-${rowId}`} className="tracking-[0.3em]">
					{logo}
				</span>
			))}
		</div>
	);

	return (
		<div className="flex flex-col min-h-screen bg-[#0b0f1a] overflow-x-hidden relative">
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900/60 to-slate-950"></div>
				<div className="absolute inset-0 bg-grid-white opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
				<div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-800 opacity-10 blur-[120px] rounded-full animate-pulse-slow"></div>
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900 opacity-10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

				<main className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center px-6 sm:px-10 lg:px-20 py-16">
					<section className="space-y-8 max-w-xl landing-fade-up js-reveal" style={{ animationDelay: '0.05s' }}>
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/20 border border-blue-800/40 text-blue-200 text-[11px] uppercase tracking-[0.2em] font-black">
							<span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]"></span>
							Hybrid semantic search
						</div>
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95]">
							Search codebases
							<span className="block text-blue-300">like a power user</span>
						</h1>
						<p className="text-lg text-slate-300 leading-relaxed">
							Combine semantic retrieval, metadata filtering, and fast vector search in a single workspace.
							SCS Pro helps teams find answers inside massive codebases in seconds.
						</p>
						<div className="flex flex-wrap items-center gap-3">
							<button
								onClick={onGetStarted}
								className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-black rounded-xl shadow-[0_12px_30px_rgba(30,64,175,0.35)] transition-all active:scale-[0.98]"
							>
								Get Started
							</button>
							<button
								onClick={onLogin}
								className="px-6 py-3 bg-slate-900/60 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl font-semibold transition-all"
							>
								Login
							</button>
						</div>
						<div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
							<div className="flex items-center gap-2">
								<span className="text-blue-400"><Icons.Shield size={14} /></span>
								Enterprise-grade security
							</div>
							<div className="flex items-center gap-2">
								<span className="text-blue-400"><Icons.Search size={14} /></span>
								Instant hybrid results
							</div>
							<div className="flex items-center gap-2">
								<span className="text-blue-400"><Icons.Clock size={14} /></span>
								Live sync in minutes
							</div>
						</div>
					</section>

					<section className="grid gap-4 landing-fade-right js-reveal" style={{ animationDelay: '0.2s' }}>
						<div className="bg-[#111827]/70 border border-slate-800/60 rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-2xl bg-blue-900/30 border border-blue-800/40 flex items-center justify-center text-blue-300">
									<Icons.Code size={22} />
								</div>
								<div>
									<h3 className="text-white font-black text-lg">Semantic + keyword blending</h3>
									<p className="text-slate-400 text-sm">Search by intent, not just strings.</p>
								</div>
							</div>
						</div>

						<div className="bg-[#111827]/70 border border-slate-800/60 rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-2xl bg-blue-900/30 border border-blue-800/40 flex items-center justify-center text-blue-300">
									<Icons.Database size={22} />
								</div>
								<div>
									<h3 className="text-white font-black text-lg">Qdrant-native indexing</h3>
									<p className="text-slate-400 text-sm">Scale to millions of chunks safely.</p>
								</div>
							</div>
						</div>

						<div className="bg-[#111827]/70 border border-slate-800/60 rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-2xl bg-blue-900/30 border border-blue-800/40 flex items-center justify-center text-blue-300">
									<Icons.Analytics size={22} />
								</div>
								<div>
									<h3 className="text-white font-black text-lg">Team-ready analytics</h3>
									<p className="text-slate-400 text-sm">Track adoption and query outcomes.</p>
								</div>
							</div>
						</div>
					</section>
				</main>

				<div className="relative z-10 px-6 sm:px-10 lg:px-20 pb-12 landing-fade-up js-reveal">
					<div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
						<span className="h-px flex-1 bg-slate-800"></span>
						Trusted by teams shipping daily
						<span className="h-px flex-1 bg-slate-800"></span>
					</div>
					<div className="mt-6 overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/40">
						<div className="landing-marquee py-4">
							{renderLogoRow('a')}
							{renderLogoRow('b')}
						</div>
					</div>
				</div>
			</section>

			<section className="px-6 sm:px-10 lg:px-20 py-20">
				<div className="max-w-6xl mx-auto grid gap-12">
					<div className="landing-fade-up js-reveal">
						<p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Why it feels fast</p>
						<h2 className="text-3xl sm:text-4xl font-black text-white mt-3">A hybrid stack that reads the room</h2>
						<p className="text-slate-400 mt-3 max-w-2xl">
							SCS Pro blends semantic vectors, keyword signals, and repository metadata so every search is grounded in context.
							You get ranked answers, citation paths, and the reasoning behind each result.
						</p>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						<div className="landing-card landing-fade-up js-reveal" style={{ animationDelay: '0.1s' }}>
							<div className="landing-icon"><Icons.Search /></div>
							<h3 className="text-white font-black text-lg">Intent-aware ranking</h3>
							<p className="text-slate-400 text-sm mt-2">Blend embeddings with lexical precision to surface the right file on the first try.</p>
						</div>
						<div className="landing-card landing-fade-up js-reveal" style={{ animationDelay: '0.2s' }}>
							<div className="landing-icon"><Icons.Database /></div>
							<h3 className="text-white font-black text-lg">Confident citations</h3>
							<p className="text-slate-400 text-sm mt-2">Trace answers back to files, commits, and owners with rich metadata trails.</p>
						</div>
						<div className="landing-card landing-fade-up js-reveal" style={{ animationDelay: '0.3s' }}>
							<div className="landing-icon"><Icons.PieChart /></div>
							<h3 className="text-white font-black text-lg">Adaptive relevance</h3>
							<p className="text-slate-400 text-sm mt-2">Tune weighting per repo or team, with real-time impact metrics.</p>
						</div>
					</div>
				</div>
			</section>

			<section className="px-6 sm:px-10 lg:px-20 py-20 bg-[#0e1422]">
				<div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
					<div className="landing-fade-left js-reveal">
						<p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Workflow</p>
						<h2 className="text-3xl sm:text-4xl font-black text-white mt-3">From repo to results in three moves</h2>
						<div className="mt-8 grid gap-6">
							<div className="landing-step">
								<div className="landing-step-index">01</div>
								<div>
									<h3 className="text-white font-black">Connect and index</h3>
									<p className="text-slate-400 text-sm mt-2">Securely link repos, segment by file type, and push to Qdrant with one pipeline.</p>
								</div>
							</div>
							<div className="landing-step">
								<div className="landing-step-index">02</div>
								<div>
									<h3 className="text-white font-black">Search with context</h3>
									<p className="text-slate-400 text-sm mt-2">Blend prompt intent, file metadata, and keyword anchors for higher precision.</p>
								</div>
							</div>
							<div className="landing-step">
								<div className="landing-step-index">03</div>
								<div>
									<h3 className="text-white font-black">Explain and share</h3>
									<p className="text-slate-400 text-sm mt-2">Send results to teammates with audit trails, summaries, and decisions.</p>
								</div>
							</div>
						</div>
					</div>
					<div className="landing-fade-right js-reveal">
						<div className="landing-terminal">
							<div className="landing-terminal-bar">
								<span></span><span></span><span></span>
							</div>
							<div className="text-xs text-slate-300 font-mono">
								<p><span className="text-blue-400">query</span>: "cache invalidation strategy"</p>
								<p><span className="text-blue-400">filters</span>: repo=platform, owner=infra</p>
								<p><span className="text-blue-400">results</span>:</p>
								<p className="text-slate-400">- docs/architecture/cache.md</p>
								<p className="text-slate-400">- services/cache/README.md</p>
								<p className="text-slate-400">- apps/gateway/src/cache.ts</p>
							</div>
							<div className="mt-4 rounded-xl bg-slate-900/60 border border-slate-800/70 p-4">
								<p className="text-sm text-slate-300">Answer summary</p>
								<p className="text-xs text-slate-400 mt-2">Cache invalidation uses tagged keys plus a 15 min TTL. Owners: infra team.</p>
							</div>
						</div>
						<div className="landing-stat-grid">
							<div>
								<p className="text-2xl font-black text-white">12x</p>
								<p className="text-xs text-slate-400">Faster answers</p>
							</div>
							<div>
								<p className="text-2xl font-black text-white">98%</p>
								<p className="text-xs text-slate-400">Precision target</p>
							</div>
							<div>
								<p className="text-2xl font-black text-white">3.1s</p>
								<p className="text-xs text-slate-400">Median query time</p>
							</div>
							<div>
								<p className="text-2xl font-black text-white">24/7</p>
								<p className="text-xs text-slate-400">Repository sync</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="px-6 sm:px-10 lg:px-20 py-20">
				<div className="max-w-6xl mx-auto grid gap-12">
					<div className="landing-fade-up js-reveal">
						<p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Use cases</p>
						<h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Built for engineers, product, and security teams</h2>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						<div className="landing-card landing-fade-up js-reveal" style={{ animationDelay: '0.1s' }}>
							<h3 className="text-white font-black text-lg">Onboarding</h3>
							<p className="text-slate-400 text-sm mt-2">New hires find architecture, patterns, and owners without digging.</p>
						</div>
						<div className="landing-card landing-fade-up js-reveal" style={{ animationDelay: '0.2s' }}>
							<h3 className="text-white font-black text-lg">Incident response</h3>
							<p className="text-slate-400 text-sm mt-2">Instantly locate runbooks, configs, and recent changes during outages.</p>
						</div>
						<div className="landing-card landing-fade-up js-reveal" style={{ animationDelay: '0.3s' }}>
							<h3 className="text-white font-black text-lg">Compliance</h3>
							<p className="text-slate-400 text-sm mt-2">Audit evidence with traceability across repos and data stores.</p>
						</div>
					</div>
				</div>
			</section>

			<section className="px-6 sm:px-10 lg:px-20 py-20 bg-[#0e1422]">
				<div className="max-w-6xl mx-auto grid gap-10">
					<div className="landing-fade-up js-reveal">
						<p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">What teams say</p>
						<h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Real feedback from real workflows</h2>
					</div>
					<div className="grid gap-6 lg:grid-cols-3">
						{testimonials.map((item, index) => (
							<div
								key={item.byline}
								className="landing-card landing-fade-up js-reveal"
								style={{ animationDelay: `${0.1 + index * 0.1}s` }}
							>
								<p className="text-slate-300 text-sm">"{item.quote}"</p>
								<p className="text-xs text-slate-500 mt-4">{item.byline}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="px-6 sm:px-10 lg:px-20 py-20">
				<div className="max-w-5xl mx-auto landing-cta">
					<div className="landing-fade-up js-reveal">
						<p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">Ready to explore</p>
						<h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Make your codebase feel searchable again</h2>
						<p className="text-slate-300 mt-4">Start with a single repo or roll out across your org. SCS Pro scales with you.</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<button
								onClick={onGetStarted}
								className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-[0_12px_30px_rgba(30,64,175,0.35)] transition-all"
							>
								Start indexing
							</button>
							<button
								onClick={onLogin}
								className="px-6 py-3 bg-slate-900/60 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-xl font-semibold transition-all"
							>
								Talk to sales
							</button>
						</div>
					</div>
				</div>
			</section>

			<footer className="px-6 sm:px-10 lg:px-20 py-12 border-t border-slate-800/70 text-slate-500 text-sm">
				<div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-3 text-slate-400">
						<span className="text-blue-400"><Icons.Logo /></span>
						<span className="font-semibold">SCS Pro</span>
					</div>
					<div className="flex flex-wrap items-center gap-4">
						<span>Security</span>
						<span>Docs</span>
						<span>Careers</span>
						<span>Support</span>
					</div>
					<span>May 2026 release</span>
				</div>
			</footer>

			<div className={`landing-sticky ${showSticky ? 'is-visible' : ''}`}>
				<div className="landing-sticky-inner">
					<div className="landing-sticky-copy">
						<span className="landing-sticky-badge">SOC 2 ready</span>
						<span className="text-sm text-slate-200 font-semibold">Start indexing in minutes</span>
						<span className="text-xs text-slate-400">Live demo and rollout support included</span>
					</div>
					<div className="landing-sticky-actions">
						<button
							onClick={onGetStarted}
							className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-[0_10px_24px_rgba(30,64,175,0.35)] transition-all"
						>
							Get Started
						</button>
						<button
							onClick={onLogin}
							className="px-4 py-2 bg-slate-900/70 hover:bg-slate-900 text-slate-200 border border-slate-800 rounded-lg font-semibold transition-all"
						>
							Login
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
