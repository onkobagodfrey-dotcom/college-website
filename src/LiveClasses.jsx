export default function LiveClasses({
  courses,
  liveClasses,
  toggleLiveClass
}) {

  // ONLY ACTIVE LIVE CLASS
  const activeLive = liveClasses.find(
    (l) => l.isLive === true
  );

  return (
    <div>
      <h3>🎥 Live Classes</h3>

      {courses.map((c) => {

        // TRUE ONLY FOR CURRENT ACTIVE CLASS
        const isLive =
          activeLive &&
          activeLive.course === c.name;

        return (
          <div
            key={c.id}
            style={{ marginBottom: 10 }}
          >
            <b>{c.name}</b>

            <button
              onClick={() => toggleLiveClass(c.name)}
              style={{
                marginLeft: 10,
                padding: "5px 10px",
                background: isLive ? "red" : "green",
                color: "white",
                border: "none"
              }}
            >
              {isLive
                ? "STOP LIVE"
                : "START LIVE"}
            </button>

            {isLive && (
              <span style={{ marginLeft: 10 }}>
                🔴 LIVE
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}