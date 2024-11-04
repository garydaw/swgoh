import React, { useContext, useState } from 'react'
import { GlobalContext } from '../store/GlobalStore';
import { apiRequest } from '../helpers/ApiRequest';

export default function UserAdmin() {
  const data = useContext(GlobalContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const resetPassword = async (ally_name, ally_code) => {
    const answer = confirm("Are you sure you want to reset password for "+ally_name + "?");
    if(answer){
      setShowToast(false);
      await apiRequest('auth/passwordReset', true, 'POST', { ally_code });
      setToastMessage("Password reset");
      setShowToast(true);
    }
  }

  const changeAdmin = async (ally_name, ally_code, access) => {
    let newAccess = 0;
    if(access === 0){
      newAccess = 1
    }
    const answer = confirm("Are you sure you want to change "+ally_name + " admin access?");
    if(answer){
      setShowToast(false);
      await apiRequest('auth/changeAdmin', true, 'POST', { ally_code, newAccess});
      await data.getAllies();
      setToastMessage(ally_name + " admin access has been updated");
      setShowToast(true);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>User Admin</h2>
      </div>

      <div
        className={`toast position-fixed top-0 start-50 translate-middle-x p-2 ${showToast ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ minWidth: '200px' }}
      >
        <div className="toast-header">
          <strong className="me-auto">Notification</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowToast(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
          {toastMessage}
        </div>
      </div>

      <div className='container'>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Ally Name</th>
              <th scope="col">Admin</th>
              <th scope="col">Reset Password</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {data.allies.map((ally, itemIndex) => (
              <tr key={"ally_"+itemIndex}>
                <td scope="row">{itemIndex+1}</td>
                <td>{ally.ally_name}</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    checked={ally.access === 1}
                    onChange={() => changeAdmin(ally.ally_name, ally.ally_code, ally.access)}/>
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => resetPassword(ally.ally_name, ally.ally_code)}>
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div> 
    </div>
  )
}
