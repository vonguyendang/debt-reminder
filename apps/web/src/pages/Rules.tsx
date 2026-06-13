import { useEffect, useState } from 'react';
import { ApiClient } from '../api/client';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { useThemeLang } from '../contexts/ThemeLangContext';

export function Rules() {
  const [rules, setRules] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', trigger_type: 'before_due', offset_days: '', recurring_preset: 'once', recurring_interval_days: '', template_id: '' });
  const { showToast } = useToast();
  const { t } = useThemeLang();

  useEffect(() => {
    loadRules();
    ApiClient.get('/templates').then(res => {
      if (res.success) setTemplates(res.data);
    });
  }, []);

  const loadRules = async () => {
    const res = await ApiClient.get('/rules');
    if (res.success) setRules(res.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: formData.name,
      trigger_type: formData.trigger_type,
      offset_minutes: parseInt(formData.offset_days) * 24 * 60,
      recurring_interval_minutes: formData.recurring_interval_days ? parseInt(formData.recurring_interval_days) * 24 * 60 : undefined,
      template_id: formData.template_id,
      is_active: 1
    };
    
    let res;
    if (editId) {
      res = await ApiClient.put(`/rules/${editId}`, payload);
    } else {
      res = await ApiClient.post('/rules', payload);
    }
    
    setLoading(false);

    if (res.success) {
      setIsAddOpen(false);
      setEditId(null);
      setFormData({ name: '', trigger_type: 'before_due', offset_days: '', recurring_preset: 'once', recurring_interval_days: '', template_id: '' });
      showToast(editId ? 'Rule updated!' : 'Rule added successfully!', 'success');
      loadRules();
    } else {
      showToast(res.error || 'Failed to save rule', 'error');
    }
  };

  const openEdit = (r: any) => {
    setEditId(r.id);
    let preset = 'once';
    let days = '';
    if (r.recurring_interval_minutes) {
      days = (r.recurring_interval_minutes / (24 * 60)).toString();
      if (['1', '2', '7', '30', '365'].includes(days)) {
        preset = days;
      } else {
        preset = 'custom';
      }
    }
    setFormData({
      name: r.name || '',
      trigger_type: r.trigger_type || 'before_due',
      offset_days: r.offset_minutes ? (r.offset_minutes / (24 * 60)).toString() : '',
      recurring_preset: preset,
      recurring_interval_days: days,
      template_id: r.template_id || ''
    });
    setIsAddOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({ name: '', trigger_type: 'before_due', offset_days: '', recurring_preset: 'once', recurring_interval_days: '', template_id: '' });
    setIsAddOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    const res = await ApiClient.delete(`/rules/${id}`);
    if (res.success) {
      showToast('Rule deleted!', 'success');
      loadRules();
    } else {
      showToast(res.error || 'Failed to delete rule', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('Reminder Rules')}</h1>
        <button className="btn" onClick={openAdd}>
          <Plus size={20} /> {t('Add Rule')}
        </button>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Trigger Days')}</th>
              <th>{t('Action')}</th>
              <th>{t('Status')}</th>
              <th>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(r => {
              const t = templates.find(x => x.id === r.template_id);
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{r.name}</div>
                  </td>
                  <td>
                    {r.offset_minutes ? (r.offset_minutes / (24 * 60)) : 0} {t('days ' + r.trigger_type)}
                    {r.recurring_interval_minutes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {t('Repeats every')} {r.recurring_interval_minutes / (24 * 60)} {t('days')}
                      </div>
                    )}
                  </td>
                  <td>Email ({t?.name || 'Unknown Template'})</td>
                  <td>
                    <span className={`badge ${r.is_active ? 'badge-success' : 'badge-neutral'}`}>
                      {r.is_active ? t('active') : t('inactive')}
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
            {rules.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>{t('No rules configured.')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={editId ? t("Edit Rule") : t("Add Rule")}>
        <form onSubmit={handleAdd}>
          <div className="input-group">
            <label>{t('Rule Name')}</label>
            <input className="input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., 3 Days Before" />
          </div>
          <div className="input-group">
            <label>{t('Trigger Type')}</label>
            <select className="input" required value={formData.trigger_type} onChange={e => setFormData({...formData, trigger_type: e.target.value})}>
              <option value="before_due">{t('Before Due')}</option>
              <option value="on_due">{t('On Due')}</option>
              <option value="after_due">{t('After Due')}</option>
            </select>
          </div>
          <div className="input-group">
            <label>{t('Offset Days')}</label>
            <input type="number" className="input" required value={formData.offset_days} onChange={e => setFormData({...formData, offset_days: e.target.value})} placeholder="e.g., 3" />
          </div>
          <div className="input-group">
            <label>{t('Chu kỳ lặp lại (Repeat Interval)')}</label>
            <select 
              className="input" 
              value={formData.recurring_preset} 
              onChange={e => {
                const val = e.target.value;
                if (val === 'once') setFormData({...formData, recurring_preset: val, recurring_interval_days: ''});
                else if (val === 'custom') setFormData({...formData, recurring_preset: val});
                else setFormData({...formData, recurring_preset: val, recurring_interval_days: val});
              }}
            >
              <option value="once">{t('Chỉ một lần (Once)')}</option>
              <option value="1">{t('Mỗi 1 ngày')}</option>
              <option value="2">{t('Mỗi 2 ngày')}</option>
              <option value="7">{t('Mỗi tuần')}</option>
              <option value="30">{t('Mỗi tháng')}</option>
              <option value="365">{t('Mỗi năm')}</option>
              <option value="custom">{t('Tùy chỉnh số ngày...')}</option>
            </select>
          </div>
          {formData.recurring_preset === 'custom' && (
            <div className="input-group" style={{ marginTop: '-1rem' }}>
              <input 
                type="number" 
                className="input" 
                required
                value={formData.recurring_interval_days} 
                onChange={e => setFormData({...formData, recurring_interval_days: e.target.value})} 
                placeholder={t('Nhập số ngày cụ thể (e.g., 14)')} 
              />
            </div>
          )}
          <div className="input-group">
            <label>{t('Template')}</label>
            <select className="input" required value={formData.template_id} onChange={e => setFormData({...formData, template_id: e.target.value})}>
              <option value="">{t('Select an email template')}</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)} disabled={loading}>{t('Cancel')}</button>
            <button type="submit" className="btn" disabled={loading}>{loading ? t('Saving...') : t('Save Rule')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
