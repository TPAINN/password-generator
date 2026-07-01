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

function App() {
  // --- state επιλογών: τι θέλει ο χρήστης να περιέχει ο κωδικός ---
  const [length, setLength] = useState(16)
  const [useUpperCase, setUseUpperCase] = useState(true)
  const [useLowerCase, setUseLowerCase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  // --- state αποτελέσματος ---
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState([]) // τελευταίοι 5 κωδικοί που παράχθηκαν
  const [copied, setCopied] = useState(false) // true για ~1.5s μετά από αντιγραφή

  // κρατάει το ID του setTimeout ώστε να μπορούμε να το ακυρώσουμε αν ο
  // χρήστης πατήσει "Αντιγραφή" ξανά πριν προλάβει να λήξει το προηγούμενο
  const copyTimeoutRef = useRef(null)

  const generatePassword = useCallback(() => {
    // 1. σύνθεσε το pool χαρακτήρων από τα ενεργά toggles
    let charSet = ''
    if (useUpperCase) charSet += CHAR_SETS.uppercase
    if (useLowerCase) charSet += CHAR_SETS.lowercase
    if (useNumbers) charSet += CHAR_SETS.numbers
    if (useSymbols) charSet += CHAR_SETS.symbols

    // 2. αφαίρεσε τους χαρακτήρες που μοιάζουν, αν το ζήτησε ο χρήστης
    if (excludeAmbiguous) {
      charSet = charSet.replace(new RegExp(`[${AMBIGUOUS_CHARS}]`, 'g'), '')
    }

    // αν ο χρήστης απενεργοποίησε όλα τα toggles, δεν υπάρχει pool -> σταμάτα
    if (!charSet) return

    // 3. crypto.getRandomValues (ΟΧΙ Math.random!) — παράγει κρυπτογραφικά
    // ασφαλή τυχαία bytes, απαραίτητο για κωδικούς. Το Math.random δεν
    // είναι σχεδιασμένο για ασφάλεια και μπορεί να προβλεφθεί.
    const randomValues = new Uint8Array(length)
    crypto.getRandomValues(randomValues)

    // κάθε byte (0-255) γίνεται index μέσα στο charSet με modulo
    const newPassword = Array.from(randomValues, (b) => charSet[b % charSet.length]).join('')

    // 4. αποθήκευσε τον νέο κωδικό και βάλε τον ΠΑΛΙΟ στο ιστορικό
    setPassword(newPassword)
    setHistory((h) => [newPassword, ...h].slice(0, 5))
  }, [length, useUpperCase, useLowerCase, useNumbers, useSymbols, excludeAmbiguous])

  const strength = calculateStrength(password)

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(password)
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      // το clipboard API μπορεί να αποτύχει (π.χ. χωρίς HTTPS/permission)
      console.error('Αποτυχία αντιγραφής στο clipboard:', error)
    }
  }, [password])

  // δημιούργησε έναν κωδικό στο πρώτο mount ώστε η οθόνη να μην είναι άδεια
  useEffect(() => {
    generatePassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
