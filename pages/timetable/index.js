import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { timetableAPI } from '../../services/api';
import PrivateRoute from '../components/Layout/PrivateRoute';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const TimetablePage = () => {
  return (
    <PrivateRoute>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="page-header">
            <h2>📅 Timetable</h2>
            <p>Class schedule and timetable</p>
          </div>
          <div className="timetable-container">
            <p>Timetable will be displayed here.</p>
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default TimetablePage;