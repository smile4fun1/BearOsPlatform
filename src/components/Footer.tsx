export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg overflow-hidden">
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
          </div>
          <div className="text-sm text-white/50 text-center sm:text-right">
            <div>© 2025 Bear Robotics Operations Platform.</div>
            <div className="mt-1">Developed by George Oprea</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

