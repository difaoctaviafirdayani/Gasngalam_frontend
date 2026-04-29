import { useNavigate } from 'react-router-dom';

export default function LoginModal({ msg, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="modal-overlay open">
      <div className="modal-box">
        <div className="modal-icon">🔒</div>
        <div className="modal-title">Login Diperlukan</div>
        <div className="modal-sub">{msg}</div>
        <div className="modal-btns">
          <button className="btn-primary" style={{justifyContent:'center'}} onClick={() => { onClose(); navigate('/login'); }}>Login</button>
          <button className="btn-secondary" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}
