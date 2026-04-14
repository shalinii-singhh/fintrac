import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Transactions() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ amount: '', description: '', category: 'Food', type: 'expense', date: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/transactions');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/transactions', formData);
      setModalOpen(false);
      setFormData({ amount: '', description: '', category: 'Food', type: 'expense', date: '' });
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTx = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (cat) => {
    const icons = { 'Food': '🍔', 'Travel': '✈️', 'Bills': '⚡', 'Shopping': '🛒', 'Income': '💼', 'Health': '💊', 'Entertainment': '🎮' };
    return icons[cat] || '💰';
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div><div className="page-title">Transactions</div><div className="page-sub">All records</div></div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
          Add new
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', padding: '11px 18px', borderBottom: '0.5px solid var(--border)', fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>
          <span>Transaction</span><span>Category</span><span>Date</span><span>Status</span><span style={{ textAlign: 'right' }}>Amount</span><span></span>
        </div>
        <div>
          {data.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>No transactions found.</div>}
          {data.map(t => (
            <div key={t._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', padding: '12px 18px', borderBottom: '0.5px solid var(--border)', alignItems: 'center', cursor: 'pointer', transition: 'background 0.12s' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '20px' }}>{getIcon(t.category)}</span><div><div style={{ fontSize: '13.5px', fontWeight: '500' }}>{t.description}</div><div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{t.category}</div></div></span>
              <span><span className={`badge ${t.type === 'income' ? 'badge-green' : 'badge-amber'}`}>{t.category}</span></span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{new Date(t.date).toLocaleDateString()}</span>
              <span><span className="badge badge-green" style={{ fontSize: '10.5px' }}>Completed</span></span>
              <span style={{ textAlign: 'right', fontSize: '14px', fontWeight: '500', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>{t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', marginLeft: '10px' }} onClick={() => deleteTx(t._id)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '28px', width: '420px', maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>Add transaction</div>
              <button onClick={() => setModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--muted)' }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: 0, border: '0.5px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px' }}>
                <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })} style={{ flex: 1, padding: '9px', border: 'none', background: formData.type === 'expense' ? 'var(--danger)' : 'transparent', color: formData.type === 'expense' ? '#fff' : 'var(--muted)', fontSize: '13.5px', cursor: 'pointer' }}>Expense</button>
                <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })} style={{ flex: 1, padding: '9px', border: 'none', background: formData.type === 'income' ? 'var(--success)' : 'transparent', color: formData.type === 'income' ? '#fff' : 'var(--muted)', fontSize: '13.5px', cursor: 'pointer' }}>Income</button>
              </div>
              <div className="form-group"><label className="form-label">Amount (₹)</label><input type="number" required className="form-input" placeholder="0.00" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Description</label><input type="text" required className="form-input" placeholder="What was it for?" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Bills">Bills</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
              </div>
              <button type="submit" className="auth-btn" style={{ marginTop: '8px' }}>Save transaction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
