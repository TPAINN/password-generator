import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import PasswordDisplay from './PasswordDisplay'
import StrengthMeter from './StrengthMeter'
import OptionsPanel from './OptionsPanel'
import GenerateButton from './GenerateButton'
import HistoryPanel from './HistoryPanel'

// Σύνολα χαρακτήρων που συνθέτουν το "pool" απ' όπου διαλέγουμε τυχαία.
// Μένουν έξω από το component ώστε να μη ξαναδημιουργούνται σε κάθε render.
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}
// χαρακτήρες που μοιάζουν οπτικά μεταξύ τους (π.χ. l/1/I, O/0) — αφαιρούνται
// αν ο χρήστης ενεργοποιήσει το "excludeAmbiguous"
const AMBIGUOUS_CHARS = 'l1IO0'

// Επιλέγει χαρακτήρες από το charSet με ομοιόμορφη κατανομή. Το απλό
// `byte % charSet.length` ευνοεί τους πρώτους χαρακτήρες όταν το 256 δεν
// διαιρείται ακριβώς με το μήκος του set (modulo bias) — εδώ απορρίπτουμε τα
// bytes που πέφτουν έξω από το τελευταίο πλήρες "παράθυρο" και ξαναρίχνουμε.
function randomChars(charSet, count) {
  const limit = Math.floor(256 / charSet.length) * charSet.length
  const out = []
  const buffer = new Uint8Array(count)
  while (out.length < count) {
    crypto.getRandomValues(buffer)
    for (const b of buffer) {
      if (b >= limit) continue
      out.push(charSet[b % charSet.length])
      if (out.length === count) break
    }
  }
  return out.join('')
}

function buildCharSet({ useUpperCase, useLowerCase, useNumbers, useSymbols, excludeAmbiguous }) {
  let charSet = ''
  if (useUpperCase) charSet += CHAR_SETS.uppercase
  if (useLowerCase) charSet += CHAR_SETS.lowercase
  if (useNumbers) charSet += CHAR_SETS.numbers
  if (useSymbols) charSet += CHAR_SETS.symbols
  if (excludeAmbiguous) {
    charSet = charSet.replace(new RegExp(`[${AMBIGUOUS_CHARS}]`, 'g'), '')
  }
  return charSet
}

// Αρχικές επιλογές — μοιράζονται ανάμεσα στο initial state και στον πρώτο κωδικό,
// ώστε η οθόνη να μην ξεκινά άδεια χωρίς να χρειάζεται effect στο mount.
const DEFAULTS = {
  length: 16,
  useUpperCase: true,
  useLowerCase: true,
  useNumbers: true,
  useSymbols: true,
  excludeAmbiguous: false,
}
const FIRST_PASSWORD = randomChars(buildCharSet(DEFAULTS), DEFAULTS.length)

function App() {
  // --- state επιλογών: τι θέλει ο χρήστης να περιέχει ο κωδικός ---
  const [length, setLength] = useState(DEFAULTS.length)
  const [useUpperCase, setUseUpperCase] = useState(DEFAULTS.useUpperCase)
  const [useLowerCase, setUseLowerCase] = useState(DEFAULTS.useLowerCase)
  const [useNumbers, setUseNumbers] = useState(DEFAULTS.useNumbers)
  const [useSymbols, setUseSymbols] = useState(DEFAULTS.useSymbols)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(DEFAULTS.excludeAmbiguous)

  // --- state αποτελέσματος ---
  const [password, setPassword] = useState(FIRST_PASSWORD)
  const [history, setHistory] = useState([FIRST_PASSWORD]) // τελευταίοι 5 κωδικοί
  const [copied, setCopied] = useState(false) // true για ~1.5s μετά από αντιγραφή

  // κρατάει το ID του setTimeout ώστε να μπορούμε να το ακυρώσουμε αν ο
  // χρήστης πατήσει "Αντιγραφή" ξανά πριν προλάβει να λήξει το προηγούμενο
  const copyTimeoutRef = useRef(null)

  const generatePassword = useCallback(() => {
    // 1. σύνθεσε το pool χαρακτήρων από τα ενεργά toggles
    const charSet = buildCharSet({
      useUpperCase, useLowerCase, useNumbers, useSymbols, excludeAmbiguous,
    })

    // αν ο χρήστης απενεργοποίησε όλα τα toggles, δεν υπάρχει pool -> σταμάτα
    if (!charSet) return

    // 2. crypto.getRandomValues (ΟΧΙ Math.random!) — κρυπτογραφικά ασφαλή bytes,
    // χωρίς modulo bias (βλ. randomChars)
    const newPassword = randomChars(charSet, length)

    // 3. αποθήκευσε τον νέο κωδικό και βάλε τον ΠΑΛΙΟ στο ιστορικό
    setPassword(newPassword)
    setHistory((h) => [newPassword, ...h].slice(0, 5))
  }, [length, useUpperCase, useLowerCase, useNumbers, useSymbols, excludeAmbiguous])

  const strength = calculateStrength(password)

  const handleCopy = useCallback(async () => {
    // το clipboard API απορρίπτει το promise χωρίς HTTPS/permission — το try
    // γύρω από ένα μη-awaited writeText δεν έπιανε ποτέ αυτή την περίπτωση
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Αποτυχία αντιγραφής στο clipboard:', error)
    }
  }, [password])

  // καθάρισε το pending timeout αν φύγει το component
  useEffect(() => () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
  }, [])

  return (
    <div className="app">
      <div className="glass-card">
        <PasswordDisplay password={password} copied={copied} onCopy={handleCopy} />
        <StrengthMeter strength={strength} />
        <OptionsPanel
          length={length}
          useUpperCase={useUpperCase}
          useLowerCase={useLowerCase}
          useNumbers={useNumbers}
          useSymbols={useSymbols}
          excludeAmbiguous={excludeAmbiguous}
          onLengthChange={setLength}
          onUseUpperCaseChange={setUseUpperCase}
          onUseLowerCaseChange={setUseLowerCase}
          onUseNumbersChange={setUseNumbers}
          onUseSymbolsChange={setUseSymbols}
          onExcludeAmbiguousChange={setExcludeAmbiguous}
        />
        <GenerateButton onClick={generatePassword} />
        <HistoryPanel history={history} />
      </div>
    </div>
  )
}

// Απλή ευριστική βαθμολόγηση δύναμης κωδικού: μετράει πόσες "κατηγορίες"
// χαρακτήρων περιέχει (πεζά/κεφαλαία/αριθμοί/σύμβολα) + bonus για μήκος.
// Δεν είναι πραγματικός υπολογισμός εντροπίας, αλλά αρκεί για οπτική ένδειξη.
function calculateStrength(password) {
  if (!password) return 'weak'

  let variety = 0
  if (/[a-z]/.test(password)) variety++
  if (/[A-Z]/.test(password)) variety++
  if (/[0-9]/.test(password)) variety++
  if (/[^A-Za-z0-9]/.test(password)) variety++

  let score = variety
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  if (score <= 2) return 'weak'
  if (score <= 4) return 'fair'
  if (score <= 5) return 'strong'
  return 'very-strong'
}

export default App
