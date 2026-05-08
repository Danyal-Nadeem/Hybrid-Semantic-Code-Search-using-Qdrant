import { useState, useEffect, useRef } from 'react';
import Icons from '../components/Icons';

// Simple Scroll Animation Wrapper
const AnimatedSection = ({ children, className = "", id }) => {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.15 }
		);

		const currentRef = sectionRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			id={id}
			className={`transition-all duration-1000 ease-out transform ${
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
			} ${className}`}
		>
			{children}
		</section>
	);
};

const LandingPage = ({ onGetStarted, onLogin }) => {
	const [activeSection, setActiveSection] = useState('hero');

	// Smooth scroll helper
	const scrollToSection = (id) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setActiveSection(id);
		}
	};

	// Track scroll to update active nav link
	useEffect(() => {
		const handleScroll = () => {
			const sections = ['hero', 'models', 'features', 'architecture'];
			const scrollPosition = window.scrollY + 100;

			for (const section of sections) {
				const el = document.getElementById(section);
				if (el) {
					const top = el.offsetTop;
					const height = el.offsetHeight;
					if (scrollPosition >= top && scrollPosition < top + height) {
						setActiveSection(section);
						break;
					}
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className="min-h-screen bg-[#0b0f1a] text-slate-100 overflow-x-hidden relative selection:bg-blue-500/30 selection:text-blue-200">
			
			{/* Ambient Glowing Orbs */}
			<div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-700/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse-slow"></div>
			<div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 blur-[130px] rounded-full pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
			<div className="fixed top-[40%] left-[30%] w-[30vw] h-[30vw] bg-cyan-800/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

			{/* Sticky Premium Navbar */}
			<header className="fixed top-0 left-0 right-0 h-20 z-50 glass-morphism border-b border-slate-800/40 backdrop-blur-md px-6 md:px-12 flex items-center justify-between transition-all duration-300">
				<div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
					<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
						<Icons.Logo />
					</div>
					<span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
						SCS PRO
					</span>
				</div>

				{/* Desktop Navigation Links */}
				<nav className="hidden md:flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-full border border-slate-800/60 backdrop-blur-lg">
					{[
						{ id: 'hero', label: 'Home' },
						{ id: 'models', label: 'AI Models' },
						{ id: 'features', label: 'Features' },
						{ id: 'architecture', label: 'Architecture' }
					].map((nav) => (
						<button
							key={nav.id}
							onClick={() => scrollToSection(nav.id)}
							className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
								activeSection === nav.id
									? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							{nav.label}
						</button>
					))}
				</nav>

				{/* Persistent Action Buttons */}
				<div className="flex items-center gap-3">
					<button
						onClick={onLogin}
						className="px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-xl border border-transparent hover:border-slate-800/80 transition-all active:scale-[0.98]"
					>
						Login
					</button>
					<button
						onClick={onGetStarted}
						className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all active:scale-[0.97]"
					>
						Get Started
					</button>
				</div>
			</header>

			{/* Hero Section */}
			<section
				id="hero"
				className="min-h-screen pt-32 pb-20 flex flex-col justify-center items-center text-center relative px-6 z-10"
			>
				<div className="absolute inset-0 bg-grid-white opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none"></div>

				<div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
					{/* Hybrid Semantic Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] uppercase tracking-[0.25em] font-black mx-auto shadow-inner shadow-blue-500/5">
						<span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse"></span>
						Hybrid semantic search pro
					</div>

					{/* Centered Big Headline */}
					<h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]">
						Search codebases <br />
						<span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent block mt-2">
							with hybrid intelligence
						</span>
					</h1>

					{/* Professional Description */}
					<p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
						Combine localized fast vector embedding retrieval, precise token keyword blending, 
						and advanced generative AI explanation in a state-of-the-art developer workspace.
					</p>

					{/* Hero CTAs */}
					<div className="flex flex-wrap justify-center items-center gap-4 pt-4">
						<button
							onClick={onGetStarted}
							className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
						>
							Start Exploring Free
						</button>
						<button
							onClick={() => scrollToSection('models')}
							className="px-8 py-4 bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl font-bold text-sm transition-all backdrop-blur"
						>
							Under the Hood
						</button>
					</div>

					{/* Pro Badges */}
					<div className="flex flex-wrap justify-center items-center gap-8 pt-10 text-xs font-semibold text-slate-400">
						<div className="flex items-center gap-2.5">
							<span className="text-cyan-400"><Icons.Shield size={16} /></span>
							Enterprise-Grade Security
						</div>
						<div className="flex items-center gap-2.5">
							<span className="text-blue-400"><Icons.Search size={16} /></span>
							Instant Hybrid Results
						</div>
						<div className="flex items-center gap-2.5">
							<span className="text-indigo-400"><Icons.Database size={16} /></span>
							Qdrant-Native Storage
						</div>
					</div>
				</div>

				
			</section>

			{/* AI Models Section */}
			<AnimatedSection
				id="models"
				className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10 border-t border-slate-900/60"
			>
				<div className="text-center space-y-4 mb-20">
					<div className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">Integrated Architecture</div>
					<h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
						Powered by Industry-Leading AI Models
					</h2>
					<p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
						SCS Pro blends three major building blocks to bring intelligent semantic understanding and flawless reasoning directly to your codebase.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{/* Gemini Card */}
					<div className="group bg-[#111827]/40 hover:bg-[#111827]/70 border border-slate-800/80 hover:border-indigo-500/30 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between">
						<div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500"></div>
						<div className="space-y-6">
							<div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
								<Icons.Help size={28} />
							</div>
							<div>
								<div className="flex items-center gap-2 mb-2">
									<h3 className="text-white font-black text-xl">Google Gemini 2.5 Flash</h3>
									<span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] uppercase font-bold">LLM Brain</span>
								</div>
								<p className="text-slate-400 text-sm leading-relaxed">
									Acts as the high-intelligence context reasoning engine. It translates semantic searches, explains matched code snippets comprehensively, answers natural language questions, and generates step-by-step logic workflows.
								</p>
							</div>
						</div>
						<div className="pt-8 border-t border-slate-800/60 mt-6 flex items-center justify-between text-xs font-bold text-indigo-400">
							<span>Active & Configured</span>
							<span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span>
						</div>
					</div>

					{/* FastEmbed Card */}
					<div className="group bg-[#111827]/40 hover:bg-[#111827]/70 border border-slate-800/80 hover:border-cyan-500/30 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between">
						<div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500"></div>
						<div className="space-y-6">
							<div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
								<Icons.Code size={28} />
							</div>
							<div>
								<div className="flex items-center gap-2 mb-2">
									<h3 className="text-white font-black text-xl">BAAI / bge-small-en-v1.5</h3>
									<span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[9px] uppercase font-bold">FastEmbed</span>
								</div>
								<p className="text-slate-400 text-sm leading-relaxed">
									Generates 384-dimensional dense vector embeddings locally. FastEmbed is designed for lightweight efficiency, running ONNX weights instantly without needing huge PyTorch or CPU/GPU system resources.
								</p>
							</div>
						</div>
						<div className="pt-8 border-t border-slate-800/60 mt-6 flex items-center justify-between text-xs font-bold text-cyan-400">
							<span>384-Dim Local Vector</span>
							<span className="w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]"></span>
						</div>
					</div>

					{/* Qdrant Card */}
					<div className="group bg-[#111827]/40 hover:bg-[#111827]/70 border border-slate-800/80 hover:border-blue-500/30 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between">
						<div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
						<div className="space-y-6">
							<div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
								<Icons.Database size={28} />
							</div>
							<div>
								<div className="flex items-center gap-2 mb-2">
									<h3 className="text-white font-black text-xl">Qdrant Vector DB</h3>
									<span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[9px] uppercase font-bold">Hybrid Search</span>
								</div>
								<p className="text-slate-400 text-sm leading-relaxed">
									The ultimate database engine. It merges dense vector similarity search and sparse token keyword matches (BM25) to return perfect hits inside complex structures, indexing code chunks instantly.
								</p>
							</div>
						</div>
						<div className="pt-8 border-t border-slate-800/60 mt-6 flex items-center justify-between text-xs font-bold text-blue-400">
							<span>Dense + Sparse Fusion</span>
							<span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
						</div>
					</div>
				</div>
			</AnimatedSection>

			{/* Core Features Section */}
			<AnimatedSection
				id="features"
				className="py-32 px-6 md:px-12 bg-slate-950/30 border-t border-b border-slate-900/60 relative z-10"
			>
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
						<div className="space-y-6">
							<div className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">Designed for Power Users</div>
							<h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
								Locate code as fast as you think.
							</h2>
							<p className="text-slate-400 text-sm sm:text-base leading-relaxed">
								Forget digging through directory trees or waiting for IDE global searches. SCS Pro delivers a beautiful interface, comprehensive indexing analytics, and automated explanation tools built to optimize developer productivity.
							</p>
							<div className="pt-4">
								<button
									onClick={onGetStarted}
									className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group"
								>
									Get Started Now
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</button>
							</div>
						</div>

						<div className="grid sm:grid-cols-2 gap-6">
							{/* Feature 1 */}
							<div className="bg-[#111827]/50 border border-slate-800/60 p-6 rounded-3xl relative overflow-hidden group">
								<div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-115 transition-transform">
									<Icons.Search />
								</div>
								<h3 className="text-white font-bold text-lg mb-2">Hybrid Query Blending</h3>
								<p className="text-slate-400 text-xs leading-relaxed">
									Search by conceptual meaning or exact keyword match. Fine-tune weights dynamically using simple sliders.
								</p>
							</div>

							{/* Feature 2 */}
							<div className="bg-[#111827]/50 border border-slate-800/60 p-6 rounded-3xl relative overflow-hidden group">
								<div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-115 transition-transform">
									<Icons.Ingestion />
								</div>
								<h3 className="text-white font-bold text-lg mb-2">Lightning Ingestion</h3>
								<p className="text-slate-400 text-xs leading-relaxed">
									Ingest complete code repositories easily. Configure exclusion lists, track chunks, and manage collection schemas instantly.
								</p>
							</div>

							{/* Feature 3 */}
							<div className="bg-[#111827]/50 border border-slate-800/60 p-6 rounded-3xl relative overflow-hidden group">
								<div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-115 transition-transform">
									<Icons.Analytics />
								</div>
								<h3 className="text-white font-bold text-lg mb-2">Deep Ingestion Analytics</h3>
								<p className="text-slate-400 text-xs leading-relaxed">
									Audit ingestion events, monitor collection statistics, measure search latency, and track usage adopting insights.
								</p>
							</div>

							{/* Feature 4 */}
							<div className="bg-[#111827]/50 border border-slate-800/60 p-6 rounded-3xl relative overflow-hidden group">
								<div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-115 transition-transform">
									<Icons.Clock />
								</div>
								<h3 className="text-white font-bold text-lg mb-2">Persistent Workspace</h3>
								<p className="text-slate-400 text-xs leading-relaxed">
									Secure personal dashboards, query histories, profile editing controls, and full application custom settings.
								</p>
							</div>
						</div>
					</div>
				</div>
			</AnimatedSection>

			{/* Interactive Pipeline / Architecture Section */}
			<AnimatedSection
				id="architecture"
				className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10"
			>
				<div className="text-center space-y-4 mb-20">
					<div className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">Platform Pipeline</div>
					<h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
						How the Hybrid Search Works
					</h2>
					<p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
						Experience high-speed code retrieval and synthesis. Follow the step-by-step query pipeline underneath.
					</p>
				</div>

				{/* Visual Flow Steps */}
				<div className="grid md:grid-cols-4 gap-6 relative">
					{/* Line joining them */}
					<div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-slate-800 pointer-events-none z-0"></div>

					{[
						{
							step: "01",
							title: "Natural Query Input",
							desc: "You submit search queries in plain English or specific keywords.",
							icon: <Icons.Search />,
							color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
						},
						{
							step: "02",
							title: "FastEmbed ONNX",
							desc: "Local FastEmbed generates high-precision 384d vector embeddings.",
							icon: <Icons.Code />,
							color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
						},
						{
							step: "03",
							title: "Qdrant Retrieval",
							desc: "Dense vectors & sparse token weights merge to locate matching code.",
							icon: <Icons.Database />,
							color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
						},
						{
							step: "04",
							title: "Gemini Explanation",
							desc: "Gemini 2.5 Flash analyzes results, providing instant logic explanations.",
							icon: <Icons.Help />,
							color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
						}
					].map((flow, i) => (
						<div key={i} className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-3xl relative z-10 group hover:border-slate-700 transition-colors">
							<div className="flex items-center justify-between mb-6">
								<div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${flow.color}`}>
									{flow.icon}
								</div>
								<span className="text-xs font-black tracking-widest text-slate-500">{flow.step}</span>
							</div>
							<h3 className="text-white font-bold text-base mb-2 group-hover:text-blue-400 transition-colors">{flow.title}</h3>
							<p className="text-slate-400 text-xs leading-relaxed">{flow.desc}</p>
						</div>
					))}
				</div>
			</AnimatedSection>

			{/* Beautiful Footer */}
			<footer className="border-t border-slate-900 bg-slate-950/40 py-12 px-6 md:px-12 relative z-10">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
							<Icons.Logo />
						</div>
						<span className="text-sm font-black tracking-tight text-white uppercase">SCS PRO</span>
					</div>
					<div className="text-slate-500 text-xs font-medium">
						&copy; {new Date().getFullYear()} SCS Pro. All rights reserved. Powered by Qdrant and Gemini.
					</div>
					<div className="flex gap-4">
						<button
							onClick={() => scrollToSection('hero')}
							className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
						>
							Back to Top
						</button>
					</div>
				</div>
			</footer>

		</div>
	);
};

export default LandingPage;
