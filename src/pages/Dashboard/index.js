import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo/logo.png';

const Dashboard = () => {
  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.hero,
          backgroundImage: `url(${logo})`,
        }}
      />

      <div style={styles.buttonsWrapper}>
        <Link to="/despesas" style={styles.button}>
          Despesas
        </Link>

        <Link to="/controle-despesas" style={styles.button}>
          Controle de Despesas
        </Link>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box',
  },
  hero: {
    width: '100%',
    maxWidth: '1200px',
    height: '400px',
    backgroundSize: 'contain', // 🔁 antes era 'cover'
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
  },
  buttonsWrapper: {
    marginTop: '40px',
    display: 'flex',
    gap: '160px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px', // 👉 menos arredondado
    border: 'none',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  },
};

export default Dashboard;
