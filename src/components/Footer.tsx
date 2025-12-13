import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-4 bg-[#020511]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="h-7 w-7 rounded-lg overflow-hidden">
              <img 
                src="/download.png" 
                alt="Bear Robotics" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold">Bear Universe</div>
              <div className="text-xs text-white/50">Bearrobotics.ai</div>
            </div>
          </Link>
          <div className="text-sm text-white/50 text-center sm:text-right">
            <div>© 2025 Bear Robotics Operations Platform.</div>
            <div className="mt-0.5">Developed by George Oprea</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

