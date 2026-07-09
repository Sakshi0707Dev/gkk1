import { useEffect, useState, useCallback } from 'react';
import adminApi from '../../utils/adminApi';

const BrandModal = ({ brand, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: brand?.name || '',
    description: brand?.description || '',
    active: brand?.active !== false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(brand?._id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    try {
      if (isEditing) {
        const res = await adminApi.put(`/brands/${brand._id}`, form);
        onSave(res.data?.data?.brand);
      } else {
        const res = await adminApi.post('/brands', form);
        onSave(res.data?.data?.brand);
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">{isEditing ? 'Edit Brand' : 'Add Brand'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green/25 focus:border-agri-green outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea rows="2" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green/25 focus:border-agri-green outline-none resize-none" />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-agri-green focus:ring-agri-green" />
              <span className="text-sm font-bold text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-agri-green hover:bg-green-700 disabled:opacity-60">
              {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/brands');
      setBrands(res.data?.data?.brands || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    try {
      await adminApi.delete(`/brands/${id}`);
      setBrands((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="p-8">
      {editing && <BrandModal brand={editing} onSave={(b) => { setBrands((prev) => prev.map((x) => x._id === b._id ? b : x)); setEditing(null); }} onClose={() => setEditing(null)} />}
      {showAdd && <BrandModal brand={null} onSave={(b) => { setBrands((prev) => [...prev, b]); }} onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Brands</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product brands.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-xl font-bold text-white bg-agri-green hover:bg-green-700 text-sm">+ Add Brand</button>
      </div>

      {loading && <div className="bg-white border rounded-2xl p-6 text-gray-600">Loading...</div>}
      {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-semibold">{error}</div>}

      {!loading && !error && brands.length === 0 && (
        <div className="bg-white border rounded-2xl p-6 text-gray-600">No brands yet.</div>
      )}

      {!loading && brands.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase">Name</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase">Description</th>
                <th className="text-center px-4 py-3 font-bold text-gray-600 text-xs uppercase">Products</th>
                <th className="text-center px-4 py-3 font-bold text-gray-600 text-xs uppercase">Status</th>
                <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{brand.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{brand.description || '\u2014'}</td>
                  <td className="px-4 py-3 text-center"><span className="font-bold text-gray-700">{brand.productCount ?? 0}</span></td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${brand.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {brand.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditing(brand)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100">Edit</button>
                      <button onClick={() => handleDelete(brand._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
