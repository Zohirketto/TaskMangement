import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const Settings = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(()=> {
    setDisplayName(user?.displayName || "");
    setEmail(user?.email || "");
    setPhotoURL(user?.photoURL || "");
  }, [user]);

  const saveProfile = async () => {
    setMessage(""); setError("");
    try {
      const prof = {};
      if (displayName !== user.displayName) prof.displayName = displayName;
      if ((photoURL || "") !== (user.photoURL || "")) prof.photoURL = photoURL || null;
      if (Object.keys(prof).length) await updateProfile(user, prof);
      if (email !== user.email) {
        if (!currentPassword) throw new Error("Enter current password to change email.");
        const cred = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, cred);
        await updateEmail(user, email);
      }
      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        photoURL: photoURL || null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setMessage("Profile updated.");
      setCurrentPassword("");
    } catch (e) {
      setError(e.message || "Failed to update profile.");
    }
  };

  const savePassword = async () => {
    setMessage(""); setError("");
    try {
      if (!currentPassword || !newPassword) throw new Error("Enter current and new password.");
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setMessage("Password updated.");
      setCurrentPassword(""); setNewPassword("");
    } catch (e) {
      setError(e.message || "Failed to update password.");
    }
  };

  const onSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="page pt-0">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account</p>
      </div>
      <div className="page-placeholder">
        <div className="placeholder-card w-full max-w-[900px] mx-auto">
          <div className="form">
            <div className="form-field">
              <label className="field-label">Display Name</label>
              <input className="input-field" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Photo URL</label>
              <input className="input-field" value={photoURL} onChange={(e)=>setPhotoURL(e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-field">
              <label className="field-label">Email</label>
              <input className="input-field" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="field-label">Current Password (required to change email)</label>
              <input className="input-field" type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onSignOut}>Sign Out</button>
              <button className="btn btn-primary" onClick={saveProfile}>Save Profile</button>
            </div>
          </div>
          <hr style={{ margin: "16px 0", borderColor: "var(--violet-100)" }} />
          <div className="form">
            <div className="form-field">
              <label className="field-label">New Password</label>
              <input className="input-field" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={savePassword}>Change Password</button>
            </div>
          </div>
          {message && <div className="success-text">{message}</div>}
          {error && <div className="error-text">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
