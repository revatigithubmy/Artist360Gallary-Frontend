import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Upload, Image as ImageIcon, Tag, Type, Loader2, CheckCircle } from 'lucide-react';

const UploadArt = () => {
  const [file, setFile] = useState(null);
  const [details, setDetails] = useState({ title: '', description: '', tags: '' });
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', details.title);
    formData.append('description', details.description);
    formData.append('tags', details.tags);

    try {
      await api.post('/artworks/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      alert("Upload failed. Check your Cloudinary backend config.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-8 text-gradient">Upload Your Masterpiece</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-[#1E293B]/30 p-6 min-h-[400px]">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-[350px] rounded-lg shadow-xl" />
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
              <p>Select an image to see preview</p>
            </div>
          )}
          <input type="file" id="artInput" hidden onChange={handleFileChange} accept="image/*" />
          <label htmlFor="artInput" className="mt-6 cursor-pointer bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full transition-all flex items-center gap-2">
            <Upload size={18} /> Choose File
          </label>
        </div>
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2"><Type size={16}/> Title</label>
            <input 
              type="text" required
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              onChange={(e) => setDetails({...details, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description</label>
            <textarea 
              rows="4" required
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              onChange={(e) => setDetails({...details, description: e.target.value})}
            ></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2"><Tag size={16}/> Tags (comma separated)</label>
            <input 
              type="text" placeholder="digital, oil, abstract"
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              onChange={(e) => setDetails({...details, tags: e.target.value})}
            />
          </div>

          <button 
            disabled={uploading || !file}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-violet-500/20"
          >
            {uploading ? <Loader2 className="animate-spin" /> : <CheckCircle size={22} />}
            {uploading ? 'Processing with Cloudinary...' : 'Publish Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadArt;