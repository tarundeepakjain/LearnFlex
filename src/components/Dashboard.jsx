import React,{ useEffect,useState } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth,db } from "../firebase";
import { Link,useNavigate } from 'react-router-dom';
import { doc,getDoc,setDoc } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

function Dashboard() {
  const [gfgStats, setGfgStats] = useState([]);
  const [gfgError, setGfgError] = useState(null);
  const [user, setUser] = useState(null);
  const [leetcodeHandle, setLeetcodeHandle] = useState("");
  const [gfgHandle, setGfgHandle] = useState("");
  const [leetcodeStats, setLeetcodeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLeetcodeHandle(data.leetcode || "");
          setGfgHandle(data.gfg || "");
        }

        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (leetcodeHandle) {
      fetchLeetCodeStats(leetcodeHandle);
    }

    if (gfgHandle) {
      fetchGfgStats(gfgHandle);
    }
  }, [leetcodeHandle, gfgHandle]);


  const fetchLeetCodeStats = async (username) => {
    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const result = await response.json();
      console.log("✅ LeetCode API Response:", result);

      const rawStats = [
        { difficulty: "Easy", count: result.easySolved },
        { difficulty: "Medium", count: result.mediumSolved },
        { difficulty: "Hard", count: result.hardSolved }
      ];

      setLeetcodeStats(rawStats);
    } catch (err) {
      console.error("❌ Error fetching LeetCode stats:", err);
      setError("Failed to load LeetCode data.");
    }
  };

    const fetchGfgStats = async (username) => {
      try {
        const url = `https://geeks-for-geeks-stats-api.vercel.app/?raw=y&userName=${username}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch GFG stats.");

        const data = await response.json();
        console.log("✅ GFG Stats API:", data);

        const statsArr = [
          { difficulty: "School", count: data.School },
          { difficulty: "Basic", count: data.Basic },
          { difficulty: "Easy", count: data.Easy },
          { difficulty: "Medium", count: data.Medium },
          { difficulty: "Hard", count: data.Hard },
        ];

        setGfgStats(statsArr);
        setGfgError("");
      } catch (err) {
        console.error("❌ Error fetching GFG stats:", err);
        setGfgError("Failed to load GFG data.");
      }
    };




  const handleSaveHandles = async () => {
    if (!leetcodeHandle || !gfgHandle) {
      alert("Both handles are required!");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        leetcode: leetcodeHandle,
        gfg: gfgHandle,
      });

      alert("Handles saved successfully!");
    } catch (error) {
      console.error("Error saving handles:", error);
      alert("Failed to save handles.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading || !user) {
    return <p className="text-center mt-20 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full shadow mb-4" />
      <h1 className="text-2xl font-bold text-blue-600">Welcome, {user.displayName}!</h1>
      <p className="text-gray-600 mt-2">{user.email}</p>

      {(!leetcodeHandle || !gfgHandle) && (
        <div className="mt-8 w-full max-w-md bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Enter Your Coding Handles
          </h2>

          <label className="block mb-2 font-medium text-sm">LeetCode Username</label>
          <input
            type="text"
            value={leetcodeHandle}
            onChange={(e) => setLeetcodeHandle(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="e.g. tarunjain123"
          />

          <label className="block mb-2 font-medium text-sm">GFG Username</label>
          <input
            type="text"
            value={gfgHandle}
            onChange={(e) => setGfgHandle(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="e.g. tarun_jain"
          />

          <button
            onClick={handleSaveHandles}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Save Handles
          </button>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {leetcodeStats.length > 0 && (
        <div className="mt-10 w-full max-w-xl bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">LeetCode Stats</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leetcodeStats}
                dataKey="count"
                nameKey="difficulty"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {leetcodeStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    {gfgStats.length > 0 && (
      <div className="mt-10 w-full max-w-xl bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">GFG Stats</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={gfgStats}
              dataKey="count"
              nameKey="difficulty"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {gfgStats.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}



      <button
        onClick={handleLogout}
        className="mt-10 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
