import { WeekendTheme } from '@/constants/event'
import React from 'react'

const ThemeBadge : React.FC<{ theme?: string }> = ({ theme })=> {
  if (!theme) {
      return null
    }
  
    const themeStyles = {
      [WeekendTheme.LAZY]: {
        bg: "bg-gradient-to-r from-purple-100 to-indigo-100",
        text: "text-purple-700",
        border: "border-purple-200",
        emoji: "🛋️",
        label: "Lazy Weekend"
      },
      [WeekendTheme.ADVENTUROUS]: {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        text: "text-green-700",
        border: "border-green-200",
        emoji: "🌍",
        label: "Adventurous Weekend"
      },
      [WeekendTheme.FAMILY]: {
        bg: "bg-gradient-to-r from-pink-100 to-rose-100",
        text: "text-pink-700",
        border: "border-pink-200",
        emoji: "👨‍👩‍👧",
        label: "Family Weekend"
      }
    }
  
    const style = themeStyles[theme as keyof typeof themeStyles]
  
    if (!style) return null;
  
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} shadow-sm`}>
        <span className="mr-1">{style.emoji}</span>
        {style.label}
      </div>
    )
}

export default ThemeBadge
