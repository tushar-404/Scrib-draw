"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Monitor } from "lucide-react";

export default function PhonePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 font-minefont">
      <main className="flex-grow flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-audiowide mb-4"
          >
            ScribDraw
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed"
          >
            Real-time collaborative drawing workspace. Doodle, sketch, and
            share ideas with friends or teammates. Mobile support is on the way.
          </motion.p>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col items-center gap-4 shadow-md"
          >
            <Monitor className="h-10 w-10 text-white" />
            <h2 className="text-xl font-semibold text-white font-audiowide">
              Best on Desktop
            </h2>
            <p className="text-slate-400 text-sm text-center">
              ScribDraw works smoothly on laptops or desktops. Join a session
              there to draw, collaborate, and have fun in real-time.
            </p>
            <p className="font-semibold text-white text-sm mt-2">
              Mobile support soon...canvas is bugging in Mobile Phones :)
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="text-center py-4 text-slate-500 text-xs"
      >
        <div className="flex justify-center items-center gap-4 mb-2">
          <a
            href="https://github.com/dotbillu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            dotbillu
          </a>
          <a
            href="https://dotbillu.github.io/Portfoliohtml/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Portfolio
          </a>
        </div>
        <p>© 2025 ScribDraw | MIT License</p>
      </motion.footer>
    </div>
  );
}

