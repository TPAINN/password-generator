// Δείχνει οπτικά πόσο δυνατός είναι ο κωδικός, με βάση το `strength`
// string που έρχεται από το calculateStrength() στο App.jsx
// (π.χ. 'weak' | 'fair' | 'strong' | 'very-strong').

// αντιστοιχία κάθε επιπέδου -> ελληνική ετικέτα, χρώμα και πόσο "γεμάτη"
// είναι η μπάρα (0 έως 1)
const STRENGTH_LEVELS = {
  weak: { label: 'Αδύναμος', color: '#e74c3c', fill: 0.25 },
  fair: { label: 'Μέτριος', color: '#f39c12', fill: 0.5 },
  strong: { label: 'Δυνατός', color: '#2ecc71', fill: 0.75 },
  'very-strong': { label: 'Πολύ δυνατός', color: '#27ae60', fill: 1 },
}

function StrengthMeter({ strength }) {
  // fallback σε 'weak' αν έρθει κάτι απροσδόκητο, ώστε να μη σκάσει
  const level = STRENGTH_LEVELS[strength] ?? STRENGTH_LEVELS.weak

  return (
    <div className="strength-meter">
      <div className="strength-bar-track">
        {/* το πλάτος της μπάρας αλλάζει δυναμικά ανάλογα με το επίπεδο */}
        <div
          className="strength-bar-fill"
          style={{ width: `${level.fill * 100}%`, backgroundColor: level.color }}
        />
      </div>
      <span className="strength-label" style={{ color: level.color }}>
        {level.label}
      </span>
    </div>
  )
}

export default StrengthMeter
