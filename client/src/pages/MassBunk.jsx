import React from "react";
import { useMassBunk } from "../context/MassBunkContext";
import { useAuth } from "../context/contextapi";
import "./MassBunk.css";

const MassBunkPage = () => {
  const { activePoll, history, createPoll, votePoll, closePoll } =
    useMassBunk();
  const { localuser } = useAuth();
  console.log("local user", localuser);

  const handleVote = (vote) => {
    votePoll(activePoll._id, vote);
  };

  return (
    <div className="mass-bunk-page">
      {localuser?.isAdmin && !activePoll && (
        <button
          className="create-poll"
          onClick={() => createPoll(prompt("Enter reason for mass bunk"))}
        >
          Start Mass Bunk Poll
        </button>
      )}

      {activePoll && (
        <div className="poll-card">
          <h2>Mass Bunk: {activePoll.reason}</h2>
          <p>Cast your vote:</p>
          <button className="vote-yes" onClick={() => handleVote("yes")}>
            ✅ Yes
          </button>
          <button className="vote-no" onClick={() => handleVote("no")}>
            ❌ No
          </button>
          {localuser?.isAdmin && (
            <button
              className="close-poll"
              onClick={() => closePoll(activePoll._id)}
            >
              Close Poll
            </button>
          )}
        </div>
      )}

      <div className="poll-stats">
        <h3>Past Polls</h3>
        {history.map((poll) => {
          const yesVotes = poll.votes.filter((v) => v.vote === "yes");
          const noVotes = poll.votes.filter((v) => v.vote === "no");
          const total = yesVotes.length + noVotes.length;
          return (
            <div key={poll._id} className="poll-history-card">
              <h4>{poll.reason}</h4>
              <p>{Math.round((yesVotes.length / total) * 100)}% said YES</p>
              <p>
                YES:{" "}
                {yesVotes.map((v) => v.userId?.name || "Unknown").join(", ")}
              </p>
              <p>
                NO: {noVotes.map((v) => v.userId?.name || "Unknown").join(", ")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MassBunkPage;
