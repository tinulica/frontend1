import { useState, useEffect } from 'react';
import api from '../api';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function EntriesPage() {
  const tabs = ['Glovo','Bringo','Tazz'];
  const [active, setActive] = useState('Glovo');
  const [entries, setEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    fullName:'',email:'',phone:'',entryType:'ANGAJAT',platform:active
  });

  async function fetch() {
    try {
      const { data } = await api.get('/entries');
      setEntries(data.filter(e=>e.platform===active));
    } catch(err){ console.error(err); }
  }

  useEffect(fetch, [active]);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append('file',file);
    fd.append('company', active);
    await api.post('/entries/import', fd);
    fetch();
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/entries', { ...form, platform:active });
    setModalOpen(false);
    fetch();
  };

  return (
    <div className="page">
      <div className="tabs">
        {tabs.map(t=>(
          <button
            key={t}
            className={t===active?'active':''}
            onClick={()=>{setActive(t); setForm(f=>({...f,platform:t}));}}
          >{t}</button>
        ))}
        <label className="import-btn">
          Import…
          <input type="file" onChange={handleImport}/>
        </label>
        <button className="add-btn" onClick={()=>setModalOpen(true)}>+ Add</button>
      </div>

      <table className="entries-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e=>(
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.fullName}</td>
              <td>{e.email}</td>
              <td>{e.phone}</td>
              <td>{e.entryType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalOpen}
        onRequestClose={()=>setModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add Entry</h2>
        <form onSubmit={submit}>
          {['fullName','email','phone'].map(field=>(
            <div className="field" key={field}>
              <label>{field}</label>
              <input
                name={field}
                value={form[field]}
                onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
                required={field==='fullName'||field==='email'}
              />
            </div>
          ))}
          <div className="field">
            <label>Type</label>
            <select
              name="entryType"
              value={form.entryType}
              onChange={e=>setForm(f=>({...f,entryType:e.target.value}))}
            >
              <option>ANGAJAT</option>
              <option>PFA</option>
              <option>SRL</option>
            </select>
          </div>
          <div className="actions">
            <button type="submit" className="save">Save</button>
            <button type="button"className="cancel" onClick={()=>setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
