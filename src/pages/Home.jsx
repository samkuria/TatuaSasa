import React from "react";

function Home() {
  const styles = {
    page: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      minHeight: "100vh",
    },

    navbar: {
      backgroundColor: "#1e3a8a",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 60px",
    },

    navLinks: {
      display: "flex",
      gap: "25px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },

    hero: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "80px 60px",
      flexWrap: "wrap",
    },

    heroText: {
      width: "45%",
      minWidth: "300px",
    },

    heroImage: {
      width: "45%",
      minWidth: "300px",
    },

    image: {
      width: "100%",
      borderRadius: "10px",
    },

    button: {
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px 25px",
      fontSize: "16px",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "20px",
    },

    features: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      padding: "60px",
      gap: "20px",
    },

    card: {
      backgroundColor: "white",
      width: "300px",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      textAlign: "center",
    },

    footer: {
      backgroundColor: "#1e293b",
      color: "white",
      textAlign: "center",
      padding: "25px",
      marginTop: "40px",
    },
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2>TechNova</h2>

        <ul style={styles.navLinks}>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
            Welcome to TechNova
          </h1>

          <p style={{ fontSize: "18px", color: "#555", lineHeight: "1.6" }}>
            We create modern web applications that are fast, scalable,
            and user-friendly. Let's build something amazing together.
          </p>

          <button style={styles.button}>
            Get Started
          </button>
        </div>

        <div style={styles.heroImage}>
          <img
            src="https://picsum.photos/600/400"
            alt="Hero"
            style={styles.image}
          />
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div style={styles.card}>
          <h2>⚡ Fast</h2>
          <p>
            Lightning-fast applications built with modern technologies.
          </p>
        </div>

        <div style={styles.card}>
          <h2>🔒 Secure</h2>
          <p>
            Security-first architecture to keep your data protected.
          </p>
        </div>

        <div style={styles.card}>
          <h2>🚀 Scalable</h2>
          <p>
            Grow your business with software that scales effortlessly.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 TechNova. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;