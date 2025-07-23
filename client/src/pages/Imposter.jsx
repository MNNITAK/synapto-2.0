import React, { useState } from "react";
import { useMassBunk } from "../context/MassBunkContext";
import { useAuth } from "../context/contextapi";
import "./Imposter.css";

const ImposterPage = () => {
  const { history, markImposter } = useMassBunk();
  const { localuser } = useAuth();

  const [showStats, setShowStats] = useState(false);

  return (
    <div className="imposter-page">
      <h2>🕵️ Imposter Control Panel</h2>

      {localuser?.isAdmin ? (
  <>
    <div className="imposter-mark-section">
      <h3>🚨 Mark Imposters</h3>
      <button className="mark-button" onClick={() => setShowStats(!showStats)}>
        {showStats ? "🔙 Back to Marking" : "📊 View Imposter Stats"}
      </button>

      {!showStats &&
        history.map((poll) => (
          <div key={poll._id} className="poll-imposter-card">
            <h4>Poll: {poll.reason}</h4>
            <p>YES Voters:</p>
            {poll.votes
              .filter((v) => v.vote === "yes" && v.userId && v.userId._id)
              .map((v) => (
                <button
                  key={v.userId._id}
                  onClick={() =>
                    markImposter(poll._id, v.userId._id, localuser)
                  }
                  className="mark-button"
                >
                  🚫 {v.userId.name || "Unknown"}
                </button>
              ))}
          </div>
        ))}
    </div> {/* ✅ Close this here! */}
  </>
) : null}


     
      {(showStats || !localuser.isAdmin) && (
        <div className="imposter-stats-section">
          <h3>📊 Imposter Stats</h3>
          {history.map((poll) => {
            const yesVoters = poll.votes.filter((v) => v.vote === "yes");
            const imposters = poll.imposters.map((u) => u._id?.toString?.());
            const safeVoters = yesVoters.filter(
              (v) => v.userId && !imposters.includes(v.userId._id)
            );

            return (
              <div key={poll._id} className="poll-imposter-stats-card">
                <h4>{poll.reason}</h4>

                <div>
                  <strong>❌ Imposters:</strong>
                  <ul>
                    {poll.imposters.map((u) => (
                      <li key={u._id}>{u.name || "Unknown"}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>✅ Safe Zone:</strong>
                  <ul>
                    {safeVoters.map((v) => (
                      <li key={v.userId?._id}>
                        {v.userId?.name || "Unknown"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImposterPage;
