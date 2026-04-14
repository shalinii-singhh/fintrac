import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

function Dashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ balance: 0, income: 0, expenses: 0, savingsRate: 0 });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/transactions');
      const tx = res.data;
      setData(tx);

      let inc = 0; let exp = 0;
      const cats = {};
      const monthly = {};

      tx.forEach(t => {
        if (t.type === 'income') inc += t.amount;
        if (t.type === 'expense') {
          exp += t.amount;
          cats[t.category] = (cats[t.category] || 0) + t.amount;
        }

        const date = new Date(t.date);
        const monthYear = date.toLocaleString('default', { month: 'short' });
        if (!monthly[monthYear]) monthly[monthYear] = { name: monthYear, Income: 0, Expense: 0 };
        if (t.type === 'income') monthly[monthYear].Income += t.amount;
        else monthly[monthYear].Expense += t.amount;
      });

      setStats({ balance: inc - exp, income: inc, expenses: exp, savingsRate: inc ? Math.round(((inc - exp) / inc) * 100) : 0 });

      // Pie data
      const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const pData = Object.keys(cats).map((cat, i) => ({
        name: cat,
        value: cats[cat],
        color: COLORS[i % COLORS.length]
      })).sort((a,b)=>b.value-a.value);
      setPieData(pData);

      // Bar data (sort by typical month order)
      const bData = Object.values(monthly);
      setBarData(bData);

    } catch (err) {
      console.error(err);
    }
  };

  const recentTx = data.slice(0, 5);

  const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

  const getIcon = (cat) => {
    const icons = { 'Food': '🍔', 'Travel': '✈️', 'Bills': '⚡', 'Shopping': '🛒', 'Income': '💼', 'Health': '💊', 'Entertainment': '🎮' };
    return icons[cat] || '💰';
  };

  return (
    <div className="screen" style={{ padding: '22px' }}>
      <div className="topbar">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Overview</div>
        </div>
        <div className="topbar-right">
          <Link to="/transactions" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
            Add transaction
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="stat-label">Total balance</div>
            <div className="stat-icon si-blue"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          </div>
          <div className="stat-value">{formatCurrency(stats.balance)}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="stat-label">Total income</div>
            <div className="stat-icon si-green"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><path d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg></div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{formatCurrency(stats.income)}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="stat-label">Total expenses</div>
            <div className="stat-icon si-red"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2"><path d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg></div>
          </div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{formatCurrency(stats.expenses)}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="stat-label">Savings rate</div>
            <div className="stat-icon si-amber"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
          </div>
          <div className="stat-value">{stats.savingsRate}%</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-title">Income vs expenses</div>
          <div className="card-sub">Monthly breakdown</div>
          <div style={{ height: '180px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                <Tooltip cursor={{fill: 'var(--bg)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Expense" fill="#fca5a5" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bar-legend" style={{ justifyContent: 'center' }}>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }}></span>Income</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#fca5a5' }}></span>Expenses</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-title">Expense breakdown</div>
          <div className="card-sub">By Category</div>
          <div className="pie-wrap" style={{ marginTop: '10px' }}>
            {pieData.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--muted)', width: '100%', textAlign: 'center' }}>No expenses logged</div>
            ) : (
              <>
                <div style={{ width: '100px', height: '100px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={35} outerRadius={45} paddingAngle={2} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="pie-legend">
                  {pieData.slice(0, 4).map(d => (
                    <div className="pie-item" key={d.name}>
                      <span style={{ display: 'flex', alignItems: 'center' }}><span className="pie-dot" style={{ background: d.color }}></span>{d.name}</span>
                      <span style={{ fontWeight: '500' }}>{Math.round((d.value/stats.expenses)*100)}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div className="card-title">Recent transactions</div>
            <div className="card-sub" style={{ marginBottom: 0 }}>Last 5 entries</div>
          </div>
          <Link to="/transactions" className="btn" style={{ fontSize: '12px', textDecoration: 'none' }}>View all</Link>
        </div>
        <div className="tx-list">
          {recentTx.length === 0 && <div style={{ fontSize: '13px', color: 'var(--muted)' }}>No transactions found</div>}
          {recentTx.map(tx => (
            <div className="tx-item" key={tx._id}>
              <div className="tx-icon" style={{ background: '#fef3c7', fontSize: '18px' }}>{getIcon(tx.category)}</div>
              <div className="tx-info"><div className="tx-name">{tx.description}</div><div className="tx-cat">{tx.category}</div></div>
              <div>
                <div className={`tx-amount ${tx.type === 'income' ? 'up' : 'down'}`}>
                  {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                </div>
                <div className="tx-date">{new Date(tx.date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
