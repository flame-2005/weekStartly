import { MoodType } from '@/constants/event'
import React from 'react'

const MoodBadge: React.FC<{ mood?: string }> = ({ mood }) => {
    if (!mood) {
        return null
    }

    const moodStyles = {
        [MoodType.HAPPY]: {
            bg: "bg-gradient-to-r from-yellow-100 to-orange-100",
            text: "text-orange-700",
            border: "border-orange-200",
            emoji: "😄",
            label: "Happy"
        },
        [MoodType.RELAXED]: {
            bg: "bg-gradient-to-r from-blue-100 to-indigo-100",
            text: "text-blue-700",
            border: "border-blue-200",
            emoji: "😌",
            label: "Relaxed"
        },
        [MoodType.ENERGETIC]: {
            bg: "bg-gradient-to-r from-red-100 to-pink-100",
            text: "text-red-700",
            border: "border-red-200",
            emoji: "⚡",
            label: "Energetic"
        }
    }

    const style = moodStyles[mood as keyof typeof moodStyles]

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} shadow-sm`}>
            <span className="mr-1 text-sm">{style.emoji}</span>
            {style.label}
        </div>
    )
}

export default MoodBadge
