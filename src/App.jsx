import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTasks } from "./features/TaskSlice";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar"
import { auth, db, firebaseAvailable } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where, orderBy } from "firebase/firestore";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));


const App = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rulesError, setRulesError] = useState("");

  useEffect(() => {
    if (!firebaseAvailable) { setLoading(false); return; }
    let unsubTasks = null;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (!user) { setLoading(false); return; }
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            displayName: user.displayName || null,
            email: user.email || null,
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } else {
          await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true });
        }
      } catch (err) {
        const code = err?.code || "firestore/error";
        const msg = err?.message || "Firestore permissions blocked access to your profile document. Update your security rules for users/{uid}.";
        setRulesError(`${code}: ${msg}`);
      }
      if (unsubTasks) unsubTasks();
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      unsubTasks = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          dispatch(setTasks(items));
        },
        (err) => {
          const code = err?.code || "firestore/error";
          const msg = err?.message || "Firestore permissions blocked access to your tasks. Update rules for tasks collection.";
          setRulesError(`${code}: ${msg}`);
        }
      );
      setLoading(false);
    });
    return () => {
      if (unsubTasks) unsubTasks();
      if (unsubAuth) unsubAuth();
    };
  }, [dispatch]);

  if (loading) {
    return <div className="page"><div className="page-placeholder"><div className="placeholder-card"><div className="placeholder-title">Loading…</div></div></div></div>;
  }

  return (
    <Router>
      {!firebaseAvailable ? (
        <div className="page">
          <div className="page-placeholder">
            <div className="placeholder-card">
              <div className="placeholder-title">Firebase configuration required</div>
              <div className="placeholder-desc">
                Set Firebase env vars locally in .env.local or in Vercel Project Settings → Environment Variables (VITE_FIREBASE_*) and redeploy.
              </div>
            </div>
          </div>
        </div>
      ) : rulesError ? (
        <div className="page">
          <div className="page-placeholder">
            <div className="placeholder-card">
              <div className="placeholder-title">Permissions error</div>
              <div className="placeholder-desc">
                {rulesError}
              </div>
            </div>
          </div>
        </div>
      ) : user ? (
        <div className="app-container">
          <Sidebar />
          <Navbar/>
          <div className="main-content p-0 mt-0 bg-white">
            <Suspense fallback={<div className="page"><div className="page-placeholder"><div className="placeholder-card"><div className="placeholder-title">Loading…</div></div></div></div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/calendar" element={<Calendar/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/login" element={<Navigate to="/dashboard" replace/>}/>
              </Routes>
            </Suspense>
          </div>
        </div>
      ) : (
        <Suspense fallback={<div className="page"><div className="page-placeholder"><div className="placeholder-card"><div className="placeholder-title">Loading…</div></div></div></div>}>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="*" element={<Navigate to="/login" replace/>}/>
          </Routes>
        </Suspense>
      )}
    </Router>
  );
};

export default App;
