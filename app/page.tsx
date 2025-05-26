"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Share2, Heart, MessageCircle } from "lucide-react"
import pairsData from "@/data/pairs.json"

interface Pair {
  id: number
  realThought: string
  hrVersion: string
  color: string
}

const colorClasses = {
  red: "from-red-400 via-red-500 to-red-600",
  blue: "from-blue-400 via-blue-500 to-blue-600",
  purple: "from-purple-400 via-purple-500 to-purple-600",
  green: "from-green-400 via-green-500 to-green-600",
  orange: "from-orange-400 via-orange-500 to-orange-600",
  teal: "from-teal-400 via-teal-500 to-teal-600",
  pink: "from-pink-400 via-pink-500 to-pink-600",
  indigo: "from-indigo-400 via-indigo-500 to-indigo-600",
  yellow: "from-yellow-400 via-yellow-500 to-yellow-600",
}

// Enhanced character scenarios with more expressive emojis
const getCharacterScenario = (pairId: number, realThought: string, hrVersion: string) => {
  const scenarios = [
    {
      honest: "🤬",
      diplomatic: "😇",
      context: "Meeting Hell",
      bgEmoji: "🔥",
    },
    {
      honest: "💀",
      diplomatic: "🌈",
      context: "Performance Review",
      bgEmoji: "📊",
    },
    {
      honest: "🤡",
      diplomatic: "🎭",
      context: "Email Drama",
      bgEmoji: "📧",
    },
    {
      honest: "🙃",
      diplomatic: "🤖",
      context: "Presentation Disaster",
      bgEmoji: "📽️",
    },
    {
      honest: "😵",
      diplomatic: "⚡",
      context: "Deadline Chaos",
      bgEmoji: "⏰",
    },
    {
      honest: "🤪",
      diplomatic: "🧠",
      context: "Training Torture",
      bgEmoji: "📚",
    },
    {
      honest: "😤",
      diplomatic: "🕊️",
      context: "Team Drama",
      bgEmoji: "👥",
    },
    {
      honest: "🫨",
      diplomatic: "✨",
      context: "Client Madness",
      bgEmoji: "💼",
    },
    {
      honest: "🤯",
      diplomatic: "💡",
      context: "Brainstorm Chaos",
      bgEmoji: "🧩",
    },
    {
      honest: "👹",
      diplomatic: "👼",
      context: "Boss Mode",
      bgEmoji: "👑",
    },
  ]

  const lowerThought = realThought.toLowerCase()

  if (lowerThought.includes("presentation")) return scenarios[3]
  if (lowerThought.includes("idea") || lowerThought.includes("mind")) return scenarios[8]
  if (lowerThought.includes("time") || lowerThought.includes("deadline")) return scenarios[4]
  if (lowerThought.includes("talk") || lowerThought.includes("clue")) return scenarios[2]
  if (lowerThought.includes("self") || lowerThought.includes("others")) return scenarios[6]
  if (lowerThought.includes("work") || lowerThought.includes("potential")) return scenarios[1]
  if (lowerThought.includes("meeting") || lowerThought.includes("email")) return scenarios[0]
  if (lowerThought.includes("problem") || lowerThought.includes("solution")) return scenarios[5]
  if (lowerThought.includes("priority") || lowerThought.includes("focus")) return scenarios[9]

  return scenarios[pairId % scenarios.length]
}

export default function HRTranslatorApp() {
  const [displayedPairs, setDisplayedPairs] = useState<Pair[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedPairs, setLikedPairs] = useState<Set<number>>(new Set())

  const loadMorePairs = useCallback(() => {
    if (loading || !hasMore) return

    setLoading(true)

    setTimeout(() => {
      const nextPairs = pairsData.slice(currentIndex, currentIndex + 3)

      if (nextPairs.length === 0) {
        setHasMore(false)
      } else {
        setDisplayedPairs((prev) => [...prev, ...nextPairs])
        setCurrentIndex((prev) => prev + 3)
      }

      setLoading(false)
    }, 500)
  }, [currentIndex, loading, hasMore])

  useEffect(() => {
    loadMorePairs()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePairs()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMorePairs])

  const toggleLike = (pairId: number) => {
    setLikedPairs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(pairId)) {
        newSet.delete(pairId)
      } else {
        newSet.add(pairId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">💼</div>
        <div className="absolute top-40 right-20 text-4xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>
          📊
        </div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>
          🎭
        </div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-float" style={{ animationDelay: "3s" }}>
          ⚡
        </div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-5 animate-float" style={{ animationDelay: "0.5s" }}>
          🔥
        </div>
        <div className="absolute top-1/3 right-1/3 text-5xl opacity-5 animate-float" style={{ animationDelay: "1.5s" }}>
          💀
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-16">
          <div className="animate-float mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 leading-tight">
              HR TRANSLATOR
            </h1>
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">🤬 ➡️ 😇</div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            What your brain screams vs. what your mouth says at work
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 rounded-full text-white font-bold text-sm animate-pulse-glow">
              🔥 VIRAL WORKPLACE CONTENT
            </div>
          </div>
        </header>

        <div className="space-y-16 max-w-5xl mx-auto">
          {displayedPairs.map((pair, index) => {
            const scenario = getCharacterScenario(pair.id, pair.realThought, pair.hrVersion)
            const isLiked = likedPairs.has(pair.id)

            return (
              <div
                key={pair.id}
                className={`relative bg-gradient-to-br ${colorClasses[pair.color as keyof typeof colorClasses]} p-1 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500 animate-pulse-glow`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 text-6xl animate-wiggle">{scenario.bgEmoji}</div>
                    <div className="absolute bottom-4 left-4 text-4xl animate-wiggle" style={{ animationDelay: "1s" }}>
                      💭
                    </div>
                  </div>

                  {/* Context Badge */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <span className="text-sm font-black text-gray-800 uppercase tracking-wider">
                        {scenario.context}
                      </span>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="absolute top-4 right-4 flex space-x-2 z-20">
                    <button
                      onClick={() => toggleLike(pair.id)}
                      className={`p-2 rounded-full transition-all duration-300 ${isLiked ? "bg-red-500 text-white animate-shake" : "bg-white/20 text-white hover:bg-white/30"}`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all duration-300">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Character Avatars */}
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-4 border-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform animate-wiggle">
                        <div className="text-3xl">{scenario.honest}</div>
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-lg">
                        INNER DEMON
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="relative">
                      <div
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform animate-wiggle"
                        style={{ animationDelay: "0.5s" }}
                      >
                        <div className="text-3xl">{scenario.diplomatic}</div>
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-lg">
                        PR ANGEL
                      </div>
                    </div>
                  </div>

                  {/* Speech Bubbles */}
                  <div className="mb-12 ml-20 mr-20 mt-12">
                    {/* Honest Thought */}
                    <div className="relative mb-8">
                      <div
                        className="bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-300 p-6 rounded-2xl shadow-xl relative transform hover:rotate-1 transition-transform duration-300"
                        style={{
                          clipPath: "polygon(0 0, calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%)",
                        }}
                      >
                        <h3 className="text-red-800 font-black text-xs uppercase tracking-widest mb-4 text-center">
                          🔥 WHAT I REALLY WANT TO SAY 🔥
                        </h3>
                        <p className="text-gray-900 text-xl font-bold leading-relaxed text-center">
                          "{pair.realThought}"
                        </p>
                      </div>

                      {/* Speech tail */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6">
                        <div className="w-0 h-0 border-t-[15px] border-b-[15px] border-r-[20px] border-t-transparent border-b-transparent border-r-red-300"></div>
                        <div className="absolute -left-1 top-0 w-0 h-0 border-t-[15px] border-b-[15px] border-r-[20px] border-t-transparent border-b-transparent border-r-red-100"></div>
                      </div>
                    </div>

                    {/* Transformation Effect */}
                    <div className="flex justify-center items-center my-8 relative">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 shadow-xl animate-pulse-glow">
                        <div className="text-white text-2xl animate-wiggle">✨🪄✨</div>
                      </div>
                      <div className="absolute -top-12 bg-white px-4 py-2 rounded-full text-sm font-black text-gray-800 shadow-lg animate-float">
                        MAGIC TRANSLATION
                      </div>
                    </div>

                    {/* HR Version */}
                    <div className="relative">
                      <div
                        className="bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 p-6 rounded-2xl shadow-xl relative transform hover:-rotate-1 transition-transform duration-300"
                        style={{ clipPath: "polygon(25px 0, 100% 0, 100% 100%, 25px 100%, 0 50%)" }}
                      >
                        <h3 className="text-green-800 font-black text-xs uppercase tracking-widest mb-4 text-center">
                          😇 HR APPROVED VERSION 😇
                        </h3>
                        <p className="text-gray-900 text-xl font-bold leading-relaxed text-center">
                          "{pair.hrVersion}"
                        </p>
                      </div>

                      {/* Speech tail */}
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6">
                        <div className="w-0 h-0 border-t-[15px] border-b-[15px] border-l-[20px] border-t-transparent border-b-transparent border-l-green-300"></div>
                        <div className="absolute -right-1 top-0 w-0 h-0 border-t-[15px] border-b-[15px] border-l-[20px] border-t-transparent border-b-transparent border-l-green-100"></div>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex justify-center space-x-6 mt-6 text-white/80">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-bold">{Math.floor(Math.random() * 1000) + 100}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-bold">{Math.floor(Math.random() * 100) + 10}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-bold">{Math.floor(Math.random() * 50) + 5}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
            </div>
            <span className="ml-4 text-white text-xl font-bold animate-pulse">Loading more workplace chaos...</span>
          </div>
        )}

        {!hasMore && displayedPairs.length > 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-wiggle">🎉</div>
            <p className="text-white text-2xl font-bold mb-4">You've survived all the workplace drama!</p>
            <p className="text-gray-300 text-lg">Share this with your coworkers (if you dare) 😈</p>
          </div>
        )}
      </div>
    </div>
  )
}
