import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Auctions = () => {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAuctions = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/auctions`, { params: { q, status, page, limit: 10 } });
      setData(res.data);
    } catch (e) {
      alert('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuctions(1); /* eslint-disable-next-line */ }, []);

  const handleDelete = async (id) => {
    if (!user?.token) { alert('Login required'); navigate('/login'); return; }
    if (!window.confirm('Delete this auction?')) return;
    try {
      await axiosInstance.delete(`/api/auctions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchAuctions(data.page);
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Auctions</h1>
        <Link to="/auctions/new" className="bg-blue-600 text-white px-3 py-2 rounded">+ New</Link>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title..." className="border p-2 flex-1"/>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="border p-2">
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="ENDED">Ended</option>
        </select>
        <button onClick={()=>fetchAuctions(1)} className="bg-gray-800 text-white px-3 rounded">Filter</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Current</th>
                <th className="p-2 border">Ends</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Owner</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map(a => (
                <tr key={a._id} className="hover:bg-gray-50">
                  <td className="p-2 border"><Link to={`/auctions/${a._id}`} className="text-blue-700 underline">{a.title}</Link></td>
                  <td className="p-2 border">${a.currentPrice?.toFixed(2)}</td>
                  <td className="p-2 border">{new Date(a.endDate).toLocaleString()}</td>
                  <td className="p-2 border">{a.status}</td>
                  <td className="p-2 border">{a.createdBy?.name || '-'}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <Link to={`/auctions/${a._id}/edit`} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</Link>
                      <button onClick={()=>handleDelete(a._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr><td className="p-4 text-center" colSpan="6">No auctions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button disabled={data.page<=1} onClick={()=>fetchAuctions(data.page-1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span>Page {data.page} / {data.pages}</span>
        <button disabled={data.page>=data.pages} onClick={()=>fetchAuctions(data.page+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Auctions;