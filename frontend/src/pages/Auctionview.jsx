import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AuctionView = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/auctions/${id}`);
        setAuction(res.data);
      } catch (e) {
        alert('Failed to load auction');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!auction) return <div className="p-4">Not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Link to="/auctions" className="underline text-blue-700">&larr; Back</Link>
      <h1 className="text-3xl font-bold">{auction.title}</h1>
      <p className="text-gray-700 whitespace-pre-line">{auction.description || 'No description'}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Current Price</div>
          <div className="text-2xl font-bold">${auction.currentPrice?.toFixed(2)}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Ends</div>
          <div className="text-lg">{new Date(auction.endDate).toLocaleString()}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Status</div>
          <div className="text-lg">{auction.status}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Owner</div>
          <div className="text-lg">{auction.createdBy?.name || '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default AuctionView;