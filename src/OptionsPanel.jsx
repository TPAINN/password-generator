// Όλα τα controls που καθορίζουν πώς θα φτιαχτεί ο κωδικός:
// slider μήκους + 5 checkboxes. Κάθε τιμή και το αντίστοιχο "on...Change"
// handler έρχονται ως ζευγάρι props από το App.jsx (controlled inputs —
// το React input δεν κρατάει μόνο του state, απλά δείχνει την τιμή που
// του δίνουμε και ειδοποιεί το γονικό component όταν αλλάζει).
function OptionsPanel({
  length,
  useUpperCase,
  useLowerCase,
  useNumbers,
  useSymbols,
  excludeAmbiguous,
  onLengthChange,
  onUseUpperCaseChange,
  onUseLowerCaseChange,
  onUseNumbersChange,
  onUseSymbolsChange,
  onExcludeAmbiguousChange,
}) {
  return (
    <div className="options-panel">
      <label className="length-control">
        Μήκος: {length}
        <input
          type="range"
          min={4}
          max={64}
          value={length}
          // το value του range είναι πάντα string, το μετατρέπουμε σε Number
          onChange={(e) => onLengthChange(Number(e.target.value))}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={useUpperCase}
          onChange={(e) => onUseUpperCaseChange(e.target.checked)}
        />
        Κεφαλαία (A-Z)
      </label>

      <label>
        <input
          type="checkbox"
          checked={useLowerCase}
          onChange={(e) => onUseLowerCaseChange(e.target.checked)}
        />
        Πεζά (a-z)
      </label>

      <label>
        <input
          type="checkbox"
          checked={useNumbers}
          onChange={(e) => onUseNumbersChange(e.target.checked)}
        />
        Αριθμοί (0-9)
      </label>

      <label>
        <input
          type="checkbox"
          checked={useSymbols}
          onChange={(e) => onUseSymbolsChange(e.target.checked)}
        />
        Σύμβολα (!@#...)
      </label>

      <label>
        <input
          type="checkbox"
          checked={excludeAmbiguous}
          onChange={(e) => onExcludeAmbiguousChange(e.target.checked)}
        />
        Εξαίρεση χαρακτήρων που μοιάζουν (l, 1, I, O, 0)
      </label>
    </div>
  )
}

export default OptionsPanel
