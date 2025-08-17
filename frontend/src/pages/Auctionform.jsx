import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const AuctionForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title:'', description:'', startingPrice:'', endDate:'' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/auctions/${id}`);
        const a = res.data;
        setForm({
          title: a.title || '',
          description: a.description || '',
          startingPrice: a.startingPrice?.toString() || '',
          endDate: a.endDate ? new Date(a.endDate).toISOString().slice(0,16) : ''
        });
      } catch (e) {
        alert('Failed to load auction');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const onChange = (e)=> setForm(f => ({...f, [e.target.name]: e.target.value}));

  const onSubmit = async (e)=>{
    e.preventDefault();
    if (!user?.token) { alert('Login required'); navigate('/login'); return; }
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        startingPrice: parseFloat(form.startingPrice),
        endDate: new Date(form.endDate)
      };
      if (!payload.title || isNaN(payload.startingPrice) || !payload.endDate) {
        alert('Please fill title, starting price and end date');
        return;
      }
      if (isEdit) {
        await axiosInstance.put(`/api/auctions/${id}`, payload, { headers: { Authorization: `Bearer ${user.token}` }});
      } else {
        await axiosInstance.post(`/api/auctions`, payload, { headers: { Authorization: `Bearer ${user.token}` }});
      }
      navigate('/auctions');
    } catch (e) {
      alert(e?.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Auction' : 'New Auction'}</h1>
      {loading ? <p>Loading...</p> : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input name="title" value={form.title} onChange={onChange} className="border p-2 w-full" required />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} className="border p-2 w-full" rows="4" />
          </div>
          <div>
            <label className="block font-medium">Starting Price (AUD)</label>
            <input name="startingPrice" type="number" step="0.01" value={form.startingPrice} onChange={onChange} className="border p-2 w-full" required />
          </div>
          <div>
            <label className="block font-medium">End Date</label>
            <input name="endDate" type="datetime-local" value={form.endDate} onChange={onChange} className="border p-2 w-full" required />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEdit ? 'Update' : 'Create'}</button>
            <button type="button" onClick={()=>navigate(-1)} className="border px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuctionForm;