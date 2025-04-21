// app/src/router/Router.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import About from '../components/About';
import Login from '../components/Login'; // Nhập component Login
import NotFound from '../components/NotFound';

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} /> {/* Thêm route cho Login */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};