import React from "react";

// Starry background generator function
const generateBoxShadow = (n) => {
  let value = `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
  for (let i = 1; i < n; i++) {
    value += `, ${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
  }
  return value;
};

// Define CSS as JavaScript objects
const styles = {
  html: {
    height: "100%",
    background: "radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)",
    overflow: "hidden",
  },
  stars: {
    width: "1px",
    height: "1px",
    background: "transparent",
    boxShadow: generateBoxShadow(700),
    animation: "animStar 50s linear infinite",
  },
  starsAfter: {
    content: " ",
    position: "absolute",
    top: "2000px",
    width: "1px",
    height: "1px",
    background: "transparent",
    boxShadow: generateBoxShadow(700),
  },
  stars2: {
    width: "2px",
    height: "2px",
    background: "transparent",
    boxShadow: generateBoxShadow(200),
    animation: "animStar 100s linear infinite",
  },
  stars2After: {
    content: " ",
    position: "absolute",
    top: "2000px",
    width: "2px",
    height: "2px",
    background: "transparent",
    boxShadow: generateBoxShadow(200),
  },
  stars3: {
    width: "3px",
    height: "3px",
    background: "transparent",
    boxShadow: generateBoxShadow(100),
    animation: "animStar 150s linear infinite",
  },
  stars3After: {
    content: " ",
    position: "absolute",
    top: "2000px",
    width: "3px",
    height: "3px",
    background: "transparent",
    boxShadow: generateBoxShadow(100),
  },
  title: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    color: "#FFF",
    textAlign: "center",
    fontFamily: "'Lato', sans-serif",
    fontWeight: 300,
    fontSize: "50px",
    letterSpacing: "10px",
    marginTop: "-60px",
    paddingLeft: "10px",
    background: "-webkit-linear-gradient(white, #38495a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  "@keyframes animStar": {
    from: { transform: "translateY(0px)" },
    to: { transform: "translateY(-2000px)" },
  },
};

const StarryBackground = () => {
  return (
    <div style={styles.html}>
      <div style={styles.stars}>
        <div style={styles.starsAfter}></div>
      </div>
      <div style={styles.stars2}>
        <div style={styles.stars2After}></div>
      </div>
      <div style={styles.stars3}>
        <div style={styles.stars3After}></div>
      </div>
      <div style={styles.title}>
        <span>PURE CSS</span>
        <br />
        <span>PARALLAX PIXEL STARS</span>
      </div>
    </div>
  );
};

export default StarryBackground;
