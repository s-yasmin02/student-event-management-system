import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';
import './EventForm.css';

export default function EventForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    date: '',
    registrationDeadline: '',
    capacity: 0,
    description: '',
    status: 'Upcoming',
    isDraft: true,
    isFeatured: false
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const { data } = await api.get('/events');
        const found = data.find(e => e._id === id);
        if (found) {
          setFormData({
            title: found.title || '',
            category: found.category || '',
            location: found.location || '',
            date: found.date ? found.date.split('T')[0] : '',
            registrationDeadline: found.registrationDeadline ? found.registrationDeadline.split('T')[0] : '',
            capacity: found.capacity || 0,
            description: found.description || '',
            status: found.status || 'Upcoming',
            isDraft: found.isDraft ?? true,
            isFeatured: found.isFeatured ?? false
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (isEditing) {
      fetchEventData();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!formData.date || !formData.registrationDeadline) {
      setDateError('');
      return;
    }

    const eventDate = new Date(formData.date);
    const deadline = new Date(formData.registrationDeadline);

    if (deadline > eventDate) {
      setDateError('Registration deadline cannot be later than event date.');
      return;
    }

    setDateError('');
  }, [formData.date, formData.registrationDeadline]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateError) {
      alert(dateError);
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/events/${id}`, formData);
      } else {
        const formPayload = new FormData();
        Object.keys(formData).forEach(key => {
          formPayload.append(key, formData[key]);
        });
        if (imageFile) {
          formPayload.append('image', imageFile);
        }
        await api.post('/events', formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-page container animate-fade-in">
      <Link to="/" className="back-link"><ArrowLeft size={18} /> Back</Link>
      
      <div className="form-container glass-panel">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
          <p className="text-muted">Fill out the details below to {isEditing ? 'update' : 'publish'} the event.</p>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
            </div>

            <div className="input-group">
              <label className="input-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field" required>
                <option value="">Select Category</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" required />
            </div>

            <div className="input-group">
              <label className="input-label">Capacity *</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="input-field" min="1" required />
            </div>

            <div className="input-group">
              <label className="input-label">Event Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                min={formData.registrationDeadline || undefined}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Registration Deadline *</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="input-field"
                max={formData.date || undefined}
                required
              />
            </div>

            {isEditing && (
              <div className="input-group">
                <label className="input-label">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}

            {!isEditing && (
              <div className="input-group">
                <label className="input-label">Event Image</label>
                <input type="file" name="image" onChange={handleFileChange} className="input-field file-input" accept="image/*" />
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="input-field text-area" rows="4" required></textarea>
          </div>

          {dateError && <p className="form-error-message">{dateError}</p>}

          <div className="checkbox-group-container">
            <label className="checkbox-label">
              <input type="checkbox" name="isDraft" checked={formData.isDraft} onChange={handleChange} />
              <span>Save as Draft (Hidden from public)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              <span>Feature this event</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !!dateError}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
