import { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [subjects, setSubjects] = useState([
    { name: "Electromagnetic Theory (ECN13101)", total: 0, present: 0 },
    { name: "Signals and Systems (ECN13102)", total: 0, present: 0 },
    { name: "Data Structures and Operating Systems (CSN13404)", total: 0, present: 0 },
    { name: "Networks and Systems (EEN13401)", total: 0, present: 0 },
    { name: "Microprocessor and Its Applications (ECN13103)", total: 0, present: 0 },
    { name: "Solid State Devices and Circuits (ECN13104)", total: 0, present: 0 },
    { name: "Business Economics (HSN13602)", total: 0, present: 0 },
    { name: "Extra Academic Activity-B-II (EAN13700)", total: 0, present: 0 },
  ]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("synapto_token");
        const res = await axios.get("http://localhost:5050/api/attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedSubjects = subjects.map((subject) => {
          const records = res.data.filter((r) => r.subject === subject.name);
          const total = records.length;
          const present = records.filter((r) => r.status === "present").length;
          return { ...subject, total, present };
        });

        setSubjects(updatedSubjects);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      }
    };
    fetchAttendance();
  }, []);

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const markAttendance = async (index, isPresent) => {
    const date = selectedDate;
    const subject = subjects[index].name;
    const status = isPresent ? "present" : "absent";

    try {
      const token = localStorage.getItem("synapto_token");
      await axios.post(
        "http://localhost:5050/api/attendance",
        { subject, date, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubjects((prev) =>
        prev.map((subj, i) =>
          i === index
            ? {
                ...subj,
                total: subj.total + 1,
                present: isPresent ? subj.present + 1 : subj.present,
              }
            : subj
        )
      );
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to mark attendance.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#04071D] via-[#0b0c2a] to-black text-white px-6 py-10 font-orbitron">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-purple-400 drop-shadow-md tracking-wide">
        🚀 Attendance Tracker
      </h2>

      <div className="flex justify-center mb-10">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="bg-[#0f1125] text-white px-4 py-2 rounded-lg border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-md"
        />
      </div>

      {/* Scrollable container for subjects */}
      <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scroll space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => {
            const percentage =
              subject.total > 0
                ? Math.round((subject.present / subject.total) * 100)
                : 0;

            return (
              <div
                key={index}
                className="bg-[#0c0f27]/70 backdrop-blur-md border border-[#2a2a5a] rounded-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:scale-[1.02] transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-cyan-300 mb-3 tracking-tight">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-300 mb-1">
                  📘 Total Classes: <span className="text-white">{subject.total}</span>
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  ✅ Present Days: <span className="text-white">{subject.present}</span>
                </p>
                <p className="text-sm mb-4 text-gray-300">
                  📊 Attendance:{" "}
                  <span className="text-green-400 font-bold">{percentage}%</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => markAttendance(index, true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black px-3 py-1.5 text-sm rounded-md font-semibold shadow-md transition-all"
                  >
                    Mark Present
                  </button>
                  <button
                    onClick={() => markAttendance(index, false)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white px-3 py-1.5 text-sm rounded-md font-semibold shadow-md transition-all"
                  >
                    Mark Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
