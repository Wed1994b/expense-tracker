import { useState, useEffect } from 'react'

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense-tracker-data')
    return saved ? JSON.parse(saved) : []
  })
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')

  useEffect(() => {
    localStorage.setItem('expense-tracker-data', JSON.stringify(transactions))
  }, [transactions])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const formatNumber = (num) => {
    return num.toLocaleString('lo-LA') + ' ກີບ'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim() || !amount || Number(amount) <= 0) return

    const newTransaction = {
      id: Date.now(),
      description: description.trim(),
      amount: Number(amount),
      type,
      date: new Date().toLocaleDateString('lo-LA')
    }

    setTransactions([newTransaction, ...transactions])
    setDescription('')
    setAmount('')
  }

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  return (
    <div className="container">
      <h1>ບັນທຶກລາຍຮັບ-ລາຍຈ່າຍ</h1>

      <div className="balance-card">
        <h2>ຍອດເງິນຄົງເຫຼືອ</h2>
        <div className="amount">{formatNumber(balance)}</div>
      </div>

      <div className="summary">
        <div className="summary-item income">
          <div className="value">+{formatNumber(totalIncome)}</div>
          <div className="label">ລາຍຮັບ</div>
        </div>
        <div className="summary-item expense">
          <div className="value">-{formatNumber(totalExpense)}</div>
          <div className="label">ລາຍຈ່າຍ</div>
        </div>
      </div>

      <form className="form-section" onSubmit={handleSubmit}>
        <h3>ເພີ່ມລາຍການ</h3>
        <div className="type-toggle">
          <button
            type="button"
            className={type === 'income' ? 'active-income' : ''}
            onClick={() => setType('income')}
          >
            ລາຍຮັບ
          </button>
          <button
            type="button"
            className={type === 'expense' ? 'active-expense' : ''}
            onClick={() => setType('expense')}
          >
            ລາຍຈ່າຍ
          </button>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="ລາຍລະອຽດ (ເຊັ່ນ: ເງິນເດືອນ, ຄ່າອາຫານ)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="ຈຳນວນເງິນ (ກີບ)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </div>
        <button type="submit" className="btn-add">ເພີ່ມລາຍການ</button>
      </form>

      <div className="transactions">
        <h3>ປະຫວັດລາຍການ</h3>
        {transactions.length === 0 ? (
          <div className="empty-state">ຍັງບໍ່ມີລາຍການ</div>
        ) : (
          transactions.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="transaction-info">
                <div className="name">{t.description}</div>
                <div className="date">{t.date}</div>
              </div>
              <div className={`transaction-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}{formatNumber(t.amount)}
                <button className="btn-delete" onClick={() => handleDelete(t.id)}>x</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
