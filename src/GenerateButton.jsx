// Απλό κουμπί που πυροδοτεί την παραγωγή νέου κωδικού.
// Είναι ξεχωριστό component (αντί για ένα απλό <button> μέσα στο App)
// ώστε αργότερα να μπορούμε να του βάλουμε δικό του styling/animation
// (π.χ. εφέ όταν πατιέται) χωρίς να μπερδεύουμε το App.jsx.
function GenerateButton({ onClick }) {
  return (
    <button className="generate-button" onClick={onClick}>
      Δημιουργία κωδικού
    </button>
  )
}

export default GenerateButton
