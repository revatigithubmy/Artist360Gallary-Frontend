import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UploadArt = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file is an image
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an image to upload');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('description', formData.description.trim());
      uploadFormData.append('tags', formData.tags.trim());

      await api.post('/artworks/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setFormData({ title: '', description: '', tags: '' });
      setFile(null);
      setPreview(null);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setFormData({ title: '', description: '', tags: '' });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
          <Upload className="text-violet-500" size={40} /> Upload Artwork
        </h1>
        <p className="text-slate-400">Share your creative masterpiece with the world</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-500" size={20} />
          <div>
            <p className="text-green-400 font-bold">Upload successful!</p>
            <p className="text-green-300 text-sm">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
        
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-bold text-white mb-3">Image File *</label>
          
          {preview ? (
            // Preview Mode
            <div className="relative group">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full max-h-96 object-cover rounded-lg border border-white/10"
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Change Image
                </button>
              </div>
            </div>
          ) : (
            // Upload Placeholder
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-violet-500 rounded-lg p-8 text-center cursor-pointer transition-colors"
            >
              <ImageIcon className="mx-auto text-slate-400 mb-3" size={48} />
              <p className="text-white font-semibold mb-1">Click to select image</p>
              <p className="text-slate-400 text-sm">or drag and drop</p>
              <p className="text-slate-500 text-xs mt-2">Supported: JPG, PNG, GIF, WEBP (Max 10MB)</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-white mb-2">
            Artwork Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Sunset over the Mountains"
            maxLength={200}
            disabled={loading}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          <p className="text-slate-400 text-xs mt-1">{formData.title.length}/200 characters</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-white mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell the story behind your artwork..."
            rows={5}
            maxLength={1000}
            disabled={loading}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none transition-colors"
          />
          <p className="text-slate-400 text-xs mt-1">{formData.description.length}/1000 characters</p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-bold text-white mb-2">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., landscape, nature, sunset"
            maxLength={200}
            disabled={loading}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          <p className="text-slate-400 text-xs mt-1">Helps others discover your work</p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !file}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload Artwork
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-sm">
          💡 <strong>Tip:</strong> Use clear titles and detailed descriptions to increase visibility. Add relevant tags to help artists and collectors discover your work!
        </p>
      </div>
    </div>
  );
};

export default UploadArt;
