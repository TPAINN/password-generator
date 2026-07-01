// Δείχνει τη λίστα με τους τελευταίους κωδικούς που παράχθηκαν
// (το `history` array έρχεται από το App.jsx, ήδη περιορισμένο στους
// τελευταίους 5 μέσα στο setHistory(...).slice(0, 5)).
function HistoryPanel({ history }) {
  // αν δεν υπάρχει ακόμα ιστορικό, μην εμφανίσεις τίποτα
  if (history.length === 0) return null

  return (
    <div className="history-panel">
      <h3>Ιστορικό</h3>
      <ul>
        {/* χρησιμοποιούμε το index ως key επειδή οι κωδικοί μπορεί να
            επαναλαμβάνονται (δεν είναι μοναδικά IDs) — δεν είναι ιδανικό
            αλλά αρκεί εδώ αφού η λίστα δεν αναδιατάσσεται, μόνο προστίθενται
            νέα στοιχεία στην αρχή */}
        {history.map((pastPassword, index) => (
          <li key={index}>{pastPassword}</li>
        ))}
      </ul>
    </div>
  )
}

export default HistoryPanel
