import { useEffect, useState } from 'react';
import { ApiClient } from '../api/client';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { useThemeLang } from '../contexts/ThemeLangContext';

export function Receivables() {
  const [receivables, setReceivables] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', customer_id: '', amount: '', currency: 'VND', due_date: '', rule_ids: [] as string[], status: 'pending' });
  const { showToast } = useToast();
  const { t } = useThemeLang();

  useEffect(() => {
    loadReceivables();
    ApiClient.get('/customers').then(res => {
      if (res.success) setCustomers(res.data);
    });
    ApiClient.get('/rules').then(res => {
      if (res.success) setRules(res.data);
    });
  }, []);

  const loadReceivables = async () => {
    const res = await ApiClient.get('/receivables');
    if (res.success) setReceivables(res.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: formData.title,
      customer_id: formData.customer_id,
      amount_cents: Math.round(parseFloat(formData.amount) * 100),
      currency: formData.currency,
      due_date: formData.due_date,
      rule_ids: formData.rule_ids,
      status: formData.status
    };
    
    let res;
    if (editId) {
      res = await ApiClient.put(`/receivables/${editId}`, payload);
    } else {
      res = await ApiClient.post('/receivables', payload);
    }
    
    setLoading(false);

    if (res.success) {
      setIsAddOpen(false);
      setEditId(null);
      setFormData({ title: '', customer_id: '', amount: '', currency: 'VND', due_date: '', rule_ids: [], status: 'pending' });
      showToast(editId ? 'Receivable updated!' : 'Receivable added successfully!', 'success');
      loadReceivables();
    } else {
      showToast(res.error || 'Failed to add receivable', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this receivable?')) return;
    const res = await ApiClient.delete(`/receivables/${id}`);
    if (res.success) {
      showToast('Receivable deleted!', 'success');
      loadReceivables();
    } else {
      showToast(res.error || 'Failed to delete receivable', 'error');
    }
  };

  const formatCurrency = (amount_cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format((amount_cents || 0) / 100);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  const openEdit = (r: any) => {
    setEditId(r.id);
    setFormData({
      title: r.title || '',
      customer_id: r.customer_id || '',
      amount: ((r.amount_cents || 0) / 100).toString(),
      currency: r.currency || 'VND',
      due_date: r.due_date || '',
      rule_ids: r.rule_ids || [],
      status: r.status || 'pending'
    });
    setIsAddOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({ title: '', customer_id: '', amount: '', currency: 'VND', due_date: '', rule_ids: [], status: 'pending' });
    setIsAddOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'overdue': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('Receivables')}</h1>
        <button className="btn" onClick={openAdd}>
          <Plus size={20} /> {t('Add Receivable')}
        </button>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>{t('Customer')}</th>
              <th>{t('Amount')}</th>
              <th>{t('Due Date')}</th>
              <th>{t('Status')}</th>
              <th>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {receivables.map(r => {
              const c = customers.find(x => x.id === r.customer_id);
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{c?.full_name || r.customer_id}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(r.amount_cents, r.currency)}</td>
                  <td>{formatDate(r.due_date)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(r.status)}`}>
                      {t(r.status)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(r)} className="btn-outline" style={{ padding: '0.5rem', border: 'none', color: 'var(--info)', cursor: 'pointer', background: 'transparent' }} title="Edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="btn-outline" style={{ padding: '0.5rem', border: 'none', color: 'var(--danger)', cursor: 'pointer', background: 'transparent' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {receivables.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t('No receivables found.')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={editId ? t("Edit Receivable") : t("Add Receivable")}>
        <form onSubmit={handleAdd}>
          <div className="input-group">
            <label>{t('Title / Description')}</label>
            <input type="text" className="input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Website Development Phase 1" />
          </div>
          <div className="input-group">
            <label>{t('Customer')}</label>
            <select className="input" required value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})}>
              <option value="">-- Select --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.full_name}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>{t('Amount')}</label>
            <input type="number" step="0.01" className="input" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
          </div>
          <div className="input-group">
            <label>{t('Currency')}</label>
            <select className="input" required value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
              <option value="USD">USD</option>
              <option value="VND">VND</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="input-group">
            <label>{t('Due Date')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text"
                placeholder="dd/mm/yyyy"
                className="input" 
                readOnly
                value={formData.due_date ? `${formData.due_date.split('-')[2]}/${formData.due_date.split('-')[1]}/${formData.due_date.split('-')[0]}` : ''} 
              />
              <Calendar style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="date"
                required
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                value={formData.due_date}
                onChange={e => setFormData({...formData, due_date: e.target.value})}
              />
            </div>
          </div>
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>{t('Auto-Reminders (Assigned Rules)')}</label>
            <div style={{ display: 'grid', gap: '0.5rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {rules.map(rule => (
                <label key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.rule_ids.includes(rule.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, rule_ids: [...formData.rule_ids, rule.id]});
                      } else {
                        setFormData({...formData, rule_ids: formData.rule_ids.filter((id: string) => id !== rule.id)});
                      }
                    }}
                  />
                  <span>{rule.name}</span>
                </label>
              ))}
              {rules.length === 0 && <span style={{ color: 'var(--text-muted)' }}>{t('No rules available to assign.')}</span>}
            </div>
          </div>
          {editId && (
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label>{t('Status')}</label>
              <select className="input" required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="pending">{t('pending')}</option>
                <option value="paid">{t('paid')}</option>
                <option value="overdue">{t('overdue')}</option>
                <option value="cancelled">{t('cancelled')}</option>
              </select>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)} disabled={loading}>{t('Cancel')}</button>
            <button type="submit" className="btn" disabled={loading}>{loading ? t('Saving...') : t('Save Receivable')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
