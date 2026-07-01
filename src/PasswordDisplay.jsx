// Εμφανίζει τον τρέχοντα κωδικό και το κουμπί αντιγραφής.
// Δεν κρατάει δικό του state — παίρνει τα πάντα ως props από το App.jsx
// (αυτό λέγεται "controlled component": το component είναι απλά "χαζό"
// και το App αποφασίζει τι δείχνει).
function PasswordDisplay({ password, copied, onCopy }) {
  return (
    <div className="password-display">
      {/* αν δεν έχει παραχθεί ακόμα κωδικός, δείξε placeholder κείμενο */}
      <span className="password-text">{password || 'Πάτα Generate'}</span>

      <button onClick={onCopy} disabled={!password}>
        {/* το κουμπί αλλάζει κείμενο στιγμιαία όταν copied === true,
            το onCopy (γίνεται handleCopy στο App) φροντίζει να το
            επαναφέρει σε false μετά από ~1.5s */}
        {copied ? 'Αντιγράφηκε!' : 'Αντιγραφή'}
      </button>
    </div>
  )
}

export default PasswordDisplay
