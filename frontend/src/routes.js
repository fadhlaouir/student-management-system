/* eslint-disable camelcase */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// route components
import SupervisorPage from './pages/SupervisorPage';
import NotFoundPage from './pages/NotFoundPage';
import CompanyPage from './pages/CompanyPage';
import ManagerPage from './pages/ManagerPage';
import InternPage from './pages/InternPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import App from './App';
import InternshipPage from './pages/InternshipPage';

/* ---------------------------------- CONST --------------------------------- */
// eslint-disable-next-line consistent-return
const getSessionToken = () => {
  if (localStorage.getItem('access_token')) {
    const JWT_TOKEN_DECODED = jwt_decode(localStorage.getItem('access_token'));
    if (JWT_TOKEN_DECODED.exp * 1000 < Date.now()) {
      localStorage.clear();
    }
    return localStorage.getItem('access_token');
  }
};

/* -------------------------------------------------------------------------- */
/*                                Layout Route                                */
/* -------------------------------------------------------------------------- */
// eslint-disable-next-line react/prop-types
function LayoutRoute({ component: Component, layout: Layout, ...rest }) {
  /* ---------------------------------- CONST --------------------------------- */
  const AuthRoute = (props) => {
    if (!getSessionToken()) {
      return <Redirect to="/login" />;
    }
    return <Route {...props} />;
  };
  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <AuthRoute
      {...rest}
      render={(props) => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                Render Routes                               */
/* -------------------------------------------------------------------------- */
export const renderRoutes = () => (
  /* -------------------------------- RENDERING ------------------------------- */
  <Router>
    <Switch>
      <Route
        exact
        path="/login"
        render={() =>
          getSessionToken() && getSessionToken() !== null ? <Redirect exact from="/login" to="/" /> : <LoginPage />
        }
      />

      <LayoutRoute exact path="/acceuil" component={Home} layout={App} />
      <LayoutRoute exact path="/supervisors" component={SupervisorPage} layout={App} />
      <LayoutRoute exact path="/managers" component={ManagerPage} layout={App} />
      <LayoutRoute exact path="/interns" component={InternPage} layout={App} />
      <LayoutRoute exact path="/companies" component={CompanyPage} layout={App} />
      <LayoutRoute exact path="/programs" component={InternshipPage} layout={App} />

      <Redirect exact from="/" to="/acceuil" />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);
