
import React, { useState } from 'react';
import { useAuth } from '../../store/useAuth';
import { apiRequest } from '../../helpers/apiRequest';

export default function LogoutButton() {
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const openModal = () => {
    setIsOpen(true);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentPassword("");
    setPassword("");
    setRetypePassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  const changePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !password || !retypePassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (password !== retypePassword) {
      setPasswordError("New Password and Re-typed Password do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await apiRequest(
        'auth/changePassword',
        true,
        'POST',
        { currentPassword, password, retypePassword }
      );

      if (result.result) {
        setPasswordSuccess(result.message);
      } else {
        setPasswordError(result.message);
      }

    } catch {
      setPasswordError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('auth/logout', true, 'POST');
      await logout();
    } catch {
      await logout();
    }
  };

  return (
    <>
      <div className="dropdown">
        <a
          className="btn dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person-circle fs-3" />
        </a>

        <ul className="dropdown-menu">
          <li>
            <span className="dropdown-item" onClick={handleLogout}>
              Logout
            </span>
          </li>

          <li>
            <span className="dropdown-item" onClick={openModal}>
              Change Password
            </span>
          </li>
        </ul>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
          />

          {/* Modal */}
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{
              zIndex: 1055,
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    Change Password
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">

                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      New Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="retypePassword" className="form-label">
                      Re-type New Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      id="retypePassword"
                      placeholder="Re-type new password"
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  {passwordError && (
                    <div className="pb-3 text-danger">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="pb-3 text-success">
                      {passwordSuccess}
                    </div>
                  )}

                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={changePassword}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
