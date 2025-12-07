interface LogoProps {
  className?: string
  mode?: 'icon' | 'logotext'
  theme?: 'dark' | 'light'
}

export function Logo({ className = '', mode = 'logotext', theme = 'dark' }: LogoProps) {
  const isLight = theme === 'light'
  
  if (mode === 'icon') {
    return (
      <div className={`w-12 h-12 ${isLight ? 'bg-white/20' : 'bg-[#1A365D]'} rounded-full flex items-center justify-center ${className}`}>
        <span className={`text-2xl font-bold ${isLight ? 'text-white' : 'text-white'}`}>V</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`w-10 h-10 ${isLight ? 'bg-white/20' : 'bg-[#1A365D]'} rounded-full flex items-center justify-center`}>
        <span className={`text-xl font-bold ${isLight ? 'text-white' : 'text-white'}`}>V</span>
      </div>
      <span className={`text-2xl font-bold ${isLight ? 'text-white' : 'text-[#1A365D]'}`}>viazuri</span>
    </div>
  )
}