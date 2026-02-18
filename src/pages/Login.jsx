import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const ensureUserDoc = async (user) => {
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(cred.user);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        await ensureUserDoc(cred.user);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const code = err?.code || "";
      let msg = err?.message || "Authentication failed";
      if (code === "auth/operation-not-allowed") {
        msg = "Email/Password sign-in is not enabled in Firebase Authentication.";
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        msg = "Invalid email or password.";
      } else if (code === "auth/user-not-found") {
        msg = "No user found with this email.";
      } else if (code === "auth/invalid-email") {
        msg = "Invalid email address.";
      }
      setError(`${code || "auth/error"}: ${msg}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="placeholder-card auth-card" style={{ maxWidth: 420, width: "100%" }}>
        <div className="auth-title">{mode === "login" ? "Sign In" : "Create Account"}</div>
        <form onSubmit={onSubmit} className="form">
          {mode === "register" && (
            <div className="form-field">
              <label className="field-label">Display Name</label>
              <input className="input-field" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
          )}
          <div className="form-field">
            <label className="field-label">Email</label>
            <div className="input-with-icon">
              <Mail size={16}/>
              <input className="input-field" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16}/>
              <input className="input-field" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="********" />
            </div>
          </div>
          <div className="auth-row">
            <label className="auth-remember">
              <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <button type="button" className="link">Forgot password?</button>
          </div>
          {error && <div className="error-text">{error}</div>}
          <div className="auth-actions">
            <button type="submit" className="btn btn-primary auth-submit">
              {mode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
          <div className="auth-toggle">
            <button type="button" className="link" onClick={()=>setMode(mode==="login"?"register":"login")}>
              {mode === "login" ? "Don't have an account? Create" : "Have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
