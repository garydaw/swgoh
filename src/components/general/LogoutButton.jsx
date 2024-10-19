import React, {useState} from 'react'
import { useAuth } from '../../store/useAuth';
import { apiRequest } from '../../helpers/ApiRequest';

export default function LogoutButton() {
  const {logout} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Function to open modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  //call logout api to invalidate cookie
  const changePassword = async (e) => {
    setPasswordError("");
    setPasswordSuccess("");

    if(password === ""){
      setPasswordError('Passwords cannot be blank.');
      return;
    }

    if(password !== retypePassword){
      setPasswordError("New Password and Re-typed Password do not match.");
      return;
    }

    try {
      const result = await apiRequest('auth/changePassword', true, 'POST', { currentPassword, password, retypePassword })
      if(result.result){
        setPasswordSuccess(result.message);
      } else {
        setPasswordError(result.message);
      }
    } catch {
      setPasswordError("Something went wrong!");
    }
  }

  //call logout api to invalidate cookie
  const handleLogout = async (e) => {
    try{
      await apiRequest('auth/logout', true, 'POST');
      await logout();
    } catch(error){
      //still call logout
      await logout();
    }
  }

  return (
    <>
    <div className="dropdown">
      <a className="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <i className="bi bi-person-circle fs-3"/>
      </a>

      <ul className="dropdown-menu">
        <li><span className="dropdown-item" onClick={handleLogout}>Logout</span></li>
        <li><span className="dropdown-item" onClick={openModal}>Change Password</span></li>
      </ul>
    </div>

    {/* Modal */}
    {isOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                
              </div>
              <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Current Password</label>
                <input type="password" 
                        className="form-control"
                        id="currentPassword"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required></input>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">New Password</label>
                <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required></input>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Re-type New Password</label>
                <input type="password"
                        className="form-control"
                        id="retypePassword"
                        placeholder="Re-type new password"
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        required></input>
            </div>
            <div className={passwordError === "" ? "d-none" : "d-show pb-3 text-danger"}>
              {passwordError}
            </div>
            <div className={passwordSuccess === "" ? "d-none" : "d-show pb-3 text-success"}>
              {passwordSuccess}
            </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={changePassword}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && <div className="modal-backdrop fade show"></div>}
    </>
  )
}
