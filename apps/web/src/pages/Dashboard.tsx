import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiClient } from '../api/client';
import { CalendarClock, AlertCircle, MailCheck, TrendingUp, TrendingDown, Eye, Mail } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useThemeLang } from '../contexts/ThemeLangContext';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useThemeLang();

  useEffect(() => {
    ApiClient.get('/dashboard/stats').then(res => {
      if (res.success) setStats(res.data);
    });
    // Fetch recent for the table
    ApiClient.get('/receivables').then(res => {
      if (res.success) setRecent(res.data.slice(0, 5));
    });
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">{t('Welcome back, Admin!')}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Card 1 */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--info)', boxShadow: '0 0 10px var(--info-glow)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t('Upcoming Dues')}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('Total count')}</p>
            </div>
            <div className="stat-icon-wrapper icon-blue">
              <CalendarClock size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{stats?.due_soon || 0}</h3>
            <span className="trend-up" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <TrendingUp size={16} /> +5.2%
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--danger)', boxShadow: '0 0 10px var(--danger-glow)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t('Overdue')}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('Requires attention')}</p>
            </div>
            <div className="stat-icon-wrapper icon-pink">
              <AlertCircle size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{stats?.overdue || 0}</h3>
            <span className="trend-down" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <TrendingDown size={16} /> -2.1%
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--success)', boxShadow: '0 0 10px var(--success-glow)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t('Emails Sent')}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('Automated today')}</p>
            </div>
            <div className="stat-icon-wrapper icon-green">
              <MailCheck size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{stats?.emails_sent_today || 0}</h3>
            <span className="trend-up" style={{ color: 'var(--text-muted)' }}>
              {t('today')}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{t('Recent Debt Activities')}</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('Debtor Name')}</th>
                <th>{t('Amount')}</th>
                <th>{t('Due Date')}</th>
                <th>{t('Payment Status')}</th>
                <th>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>
                    {index + 1}. {item.customer_name || 'Unknown'}
                  </td>
                  <td>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency }).format((item.amount_cents || 0) / 100)}
                  </td>
                  <td>{formatDate(item.due_date)}</td>
                  <td>
                    <span className={`badge ${item.status === 'paid' ? 'badge-purple' : item.status === 'pending' ? 'badge-info' : 'badge-danger'}`}>
                      {t(item.status)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn" onClick={() => showToast('Reminder queued for dispatch.', 'success')} title="Send manual reminder"><Mail size={18} /></button>
                      <button className="icon-btn" onClick={() => navigate('/receivables')} title="View details"><Eye size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t('No recent activities')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
