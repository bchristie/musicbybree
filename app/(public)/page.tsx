import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bree-with-bass.jpg"
          alt="Bree performing with bass"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center space-y-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight drop-shadow-2xl">
            Welcome to My Repertoire
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
            Explore my collection of vocal performances, from classic standards to contemporary hits.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Link
            href="/repertoire"
            className="px-8 py-4 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto text-center text-lg"
          >
            Browse Repertoire
          </Link>
          <Link
            href="/performances"
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto text-center text-lg"
          >
            Past Performances
          </Link>
        </div>
      </div>
    </main>
  );
}
