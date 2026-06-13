import { useEffect, useState } from 'react';
import { ApiClient } from '../api/client';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { useThemeLang } from '../contexts/ThemeLangContext';

export function Templates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', subject_template: '', html_template: '', is_active: 1 });
  const { showToast } = useToast();
  const { t } = useThemeLang();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const res = await ApiClient.get('/templates');
    if (res.success) setTemplates(res.data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let res;
    if (editId) {
      res = await ApiClient.put(`/templates/${editId}`, formData);
    } else {
      res = await ApiClient.post('/templates', formData);
    }
    setLoading(false);

    if (res.success) {
      setIsAddOpen(false);
      setEditId(null);
      setFormData({ name: '', subject_template: '', html_template: '', is_active: 1 });
      showToast(editId ? 'Template updated!' : 'Template saved successfully!', 'success');
      loadTemplates();
    } else {
      showToast(res.error || 'Failed to save template', 'error');
    }
  };

  const openEdit = (tpl: any) => {
    setEditId(tpl.id);
    setFormData({
      name: tpl.name || '',
      subject_template: tpl.subject_template || '',
      html_template: tpl.html_template || '',
      is_active: tpl.is_active !== undefined ? tpl.is_active : 1
    });
    setIsAddOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({ name: '', subject_template: '', html_template: '', is_active: 1 });
    setIsAddOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    const res = await ApiClient.delete(`/templates/${id}`);
    if (res.success) {
      showToast('Template deleted!', 'success');
      loadTemplates();
    } else {
      showToast(res.error || 'Failed to delete template', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('Email Templates')}</h1>
        <button className="btn" onClick={openAdd}>
          <Plus size={20} /> {t('Add Template')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {templates.map(tpl => (
          <div key={tpl.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{tpl.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
              {t('Subject')}: {tpl.subject_template}
            </p>
            <div style={{ position: 'relative', flex: 1, marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', height: '150px', overflow: 'hidden' }}>
                {tpl.html_template}
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, var(--bg-dark))', pointerEvents: 'none', borderRadius: '0 0 0.5rem 0.5rem' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => openEdit(tpl)} style={{ flex: 1 }}>{t('Edit Template')}</button>
              <button className="btn-outline" onClick={() => handleDelete(tpl.id)} style={{ padding: '0.5rem', color: 'var(--danger)', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer' }} title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            {t('No templates configured.')}
          </div>
        )}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={editId ? t("Edit Template") : t("Add Template")}>
        <form onSubmit={handleAdd}>
          <div className="input-group">
            <label>{t('Name')}</label>
            <input className="input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Reminder 3 Days Before" />
          </div>
          <div className="input-group">
            <label>{t('Subject')}</label>
            <input className="input" required value={formData.subject_template} onChange={e => setFormData({...formData, subject_template: e.target.value})} placeholder="Upcoming Payment Reminder" />
          </div>
          <div className="input-group">
            <label>{t('HTML Body')}</label>
            <textarea className="input" required rows={6} value={formData.html_template} onChange={e => setFormData({...formData, html_template: e.target.value})} placeholder="Dear {{customer_name}}, your payment of {{amount}} is due on {{due_date}}." style={{ resize: 'vertical' }} />
          </div>
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              id="template_is_active"
              checked={formData.is_active === 1} 
              onChange={e => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
              style={{ width: '1.25rem', height: '1.25rem' }}
            />
            <label htmlFor="template_is_active" style={{ marginBottom: 0, cursor: 'pointer' }}>{t('Hoạt động (Active)')}</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)} disabled={loading}>{t('Cancel')}</button>
            <button type="submit" className="btn" disabled={loading}>{loading ? t('Saving...') : t('Save Template')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
