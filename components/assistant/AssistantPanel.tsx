'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { answerQuestion, SUGGESTED_QUESTIONS, type KnowledgeEntry } from '@/lib/assistant'
import { track } from '@/components/analytics/track'

type Message = { id: number; question: string; answer: KnowledgeEntry }

// Minimal typing for the Web Speech API (not in lib.dom for all browsers).
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/**
 * "Ask Ring Lot" — answers only from approved site data (lib/assistant.ts).
 * Voice: requires an explicit click, shows a visible listening state with a stop control,
 * and degrades to keyboard input when unsupported or denied. Nothing is recorded or sent anywhere.
 */
export default function AssistantPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId()
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [speakAnswers, setSpeakAnswers] = useState(false)
  const [voiceSupported] = useState(() => getRecognition() !== null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const ask = useCallback(
    (question: string, via: 'text' | 'voice' = 'text') => {
      const trimmed = question.trim()
      if (!trimmed) return
      const answer = answerQuestion(trimmed)
      setMessages((current) => [...current, { id: Date.now(), question: trimmed, answer }])
      setQuery('')
      track('assistant_query', { matched: answer.id !== 'fallback', via })
      if (speakAnswers && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer.answer))
      }
    },
    [speakAnswers],
  )

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      recognitionRef.current?.stop()
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [onClose])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  const startVoice = () => {
    const Recognition = getRecognition()
    if (!Recognition) return
    setVoiceError(null)
    const recognition = new Recognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      if (transcript) ask(transcript, 'voice')
    }
    recognition.onerror = (event) => {
      setVoiceError(
        event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'Microphone access was not allowed. You can type your question instead.'
          : 'Voice input did not work this time. You can type your question instead.',
      )
    }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    track('assistant_voice', { action: 'start' })
    recognition.start()
  }

  const stopVoice = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(640px,calc(100dvh-5rem))] flex-col overflow-hidden rounded-xl border border-navy-700 bg-navy-900 text-white shadow-lift sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <p id={titleId} className="font-semibold">
            Ask Ring Lot
          </p>
          <p className="mt-0.5 text-xs text-silver-500">Answers come only from information published on this site.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full p-1.5 text-silver-300 hover:bg-white/10 hover:text-white">
          <span className="sr-only">Close assistant</span>
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4" aria-live="polite">
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-silver-300">Try one of these:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <li key={question}>
                  <button
                    type="button"
                    onClick={() => ask(question)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-left text-xs text-white hover:border-emerald-400"
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <p className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-white/10 px-3 py-2 text-sm">{message.question}</p>
              <div className="max-w-[92%] rounded-lg rounded-bl-sm border border-white/10 bg-navy-850 px-3 py-2.5 text-sm leading-relaxed text-silver-300">
                <p>{message.answer.answer}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.answer.links.map((link) =>
                    link.href.startsWith('/') ? (
                      <Link key={link.href} href={link.href} onClick={onClose} className="text-emerald-300 underline underline-offset-2 hover:text-emerald-400">
                        {link.label}
                      </Link>
                    ) : (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener" className="text-emerald-300 underline underline-offset-2 hover:text-emerald-400">
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
                <p className="mt-2 label-mono text-[0.58rem] text-silver-500">Source · {message.answer.source}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        {listening ? (
          <div className="mb-2 flex items-center justify-between rounded-md bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300" role="status">
            <span className="flex items-center gap-2">
              <span className="status-dot h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" /> Listening… speak your question
            </span>
            <button type="button" onClick={stopVoice} className="font-medium underline">
              Stop
            </button>
          </div>
        ) : null}
        {voiceError ? (
          <p className="mb-2 text-xs text-silver-300" role="alert">
            {voiceError}
          </p>
        ) : null}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            ask(query)
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Your question
          </label>
          <input
            ref={inputRef}
            id="assistant-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={200}
            placeholder="Ask about services, process, proof…"
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-navy-950 px-4 py-2.5 text-sm text-white placeholder:text-silver-500 focus:border-emerald-400 focus:outline-none"
            autoComplete="off"
          />
          {voiceSupported ? (
            <button
              type="button"
              onClick={listening ? stopVoice : startVoice}
              aria-pressed={listening}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${listening ? 'border-emerald-400 bg-emerald-400 text-navy-950' : 'border-white/15 text-white hover:border-emerald-400'}`}
            >
              <span className="sr-only">{listening ? 'Stop voice input' : 'Ask by voice (uses your microphone)'}</span>
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <rect x="7" y="2.5" width="6" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4.5 9.5a5.5 5.5 0 0011 0M10 15v2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
          <button type="submit" className="inline-flex h-10 shrink-0 items-center rounded-full bg-emerald-400 px-4 text-sm font-medium text-navy-950 hover:bg-emerald-300">
            Ask
          </button>
        </form>
        {'speechSynthesis' in (typeof window !== 'undefined' ? window : {}) ? (
          <label className="mt-2 flex items-center gap-2 text-xs text-silver-500">
            <input type="checkbox" checked={speakAnswers} onChange={(event) => setSpeakAnswers(event.target.checked)} className="accent-emerald-400" />
            Read answers aloud
          </label>
        ) : null}
      </div>
    </div>
  )
}
