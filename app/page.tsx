import Image from "next/image"
import logo from "@/assets/the_arc_no_background.png"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8 text-slate-800">
      <div className="max-w-4xl text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src={logo}
            alt="The Arc Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        <p className="mb-8 text-xl text-slate-600">
          Shape the future across 40 years as you guide your community through
          an AI-driven narrative experience
        </p>

        <div className="mb-12 grid grid-cols-1 gap-8 text-left md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-indigo-600">
              Your Legacy Awaits
            </h2>
            <p className="text-slate-700">
              Become one of four leaders with a secret vision for your region.
              Will you create a haven for mythical creatures or establish a
              culinary paradise?
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-indigo-600">
              Dynamic AI World
            </h2>
            <p className="text-slate-700">
              Every tile tells a story written by AI historians. Influence these
              narratives through strategic actions and alliances with NPCs.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-indigo-600">
              Time is Power
            </h2>
            <p className="text-slate-700">
              As your character ages, shift from direct action to subtle
              influence. Guide NPCs and leverage the Elder Council to realize
              your vision.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-indigo-600">
              Strategic Depth
            </h2>
            <p className="text-slate-700">
              Master the art of influence using letters as your resource. Every
              message shapes the future, but choose wisely - your legacy depends
              on it.
            </p>
          </div>
        </div>

        <Button
          className="rounded-full bg-indigo-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-700"
          asChild
        >
          <Link href="/new-game">Begin Your Journey</Link>
        </Button>
      </div>
    </main>
  )
}
