import { useEffect, useState } from 'react';
import { ApiClient } from '../api/client';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { useThemeLang } from '../contexts/ThemeLangContext';

export function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ full_name: '', company_name: '', email: '', phone: '' });
  const { showToast } = useToast();
  const { t } = useThemeLang();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const res = await ApiClient.get('/customers');
    if (res.success) setCustomers(res.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editId) {
      res = await ApiClient.put(`/customers/${editId}`, formData);
    } else {
      res = await ApiClient.post('/customers', formData);
    }
    setLoading(false);
    
    if (res.success) {
      setIsAddOpen(false);
      setEditId(null);
      setFormData({ full_name: '', company_name: '', email: '', phone: '' });
      showToast(editId ? 'Customer updated!' : 'Customer saved successfully!', 'success');
      loadCustomers();
    } else {
      showToast(res.error || 'Failed to save customer', 'error');
    }
  };

  const openEdit = (c: any) => {
    setEditId(c.id);
    setFormData({
      full_name: c.full_name || '',
      company_name: c.company_name || '',
      email: c.email || '',
      phone: c.phone || ''
    });
    setIsAddOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({ full_name: '', company_name: '', email: '', phone: '' });
    setIsAddOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    const res = await ApiClient.delete(`/customers/${id}`);
    if (res.success) {
      showToast('Customer deleted!', 'success');
      loadCustomers();
    } else {
      showToast(res.error || 'Failed to delete customer', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('Customers')}</h1>
        <button className="btn" onClick={openAdd}>
          <Plus size={20} /> {t('Add Customer')}
        </button>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Email')}</th>
              <th>{t('Phone')}</th>
              <th>{t('Status')}</th>
              <th>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{c.full_name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{c.company_name}</div>
                </td>
                <td>{c.email}</td>
                <td>{c.phone || '-'}</td>
                <td>
                  <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                    {t(c.status)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(c)} className="btn-outline" style={{ padding: '0.5rem', border: 'none', color: 'var(--info)', cursor: 'pointer', background: 'transparent' }} title="Edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="btn-outline" style={{ padding: '0.5rem', border: 'none', color: 'var(--danger)', cursor: 'pointer', background: 'transparent' }} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t('No customers found.')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={editId ? t("Edit Customer") : t("Add Customer")}>
        <form onSubmit={handleAdd}>
          <div className="input-group">
            <label>{t('Name')}</label>
            <input className="input" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>{t('Company')}</label>
            <input className="input" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>{t('Email')}</label>
            <input type="email" className="input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <label>{t('Phone')}</label>
            <input className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)} disabled={loading}>{t('Cancel')}</button>
            <button type="submit" className="btn" disabled={loading}>{loading ? t('Saving...') : t('Save Customer')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
