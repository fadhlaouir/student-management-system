/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
import React, { useEffect, useMemo, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// UI Components
import { Row, Col, Layout, Divider, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

// Redux
import { selectSessionUser, $logout } from '../reducers/Session.slice';

// Styles
import './index.css';

/* -------------------------------------------------------------------------- */
/*                                   Top Bar                                  */
/* -------------------------------------------------------------------------- */
function TopBar() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const { Header } = Layout;
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectSessionUser);
  const windowWidthRef = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      windowWidthRef.current = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const userName = useMemo(() => user?.email, [user]);
  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <Header id="top-bar" className="header">
      <Row align="middle" justify="space-between">
        <Col>
          <Link className="top-bar-link" to="/">
            Gestion de stage
          </Link>
          <Divider type="vertical" />
        </Col>
        <Col>
          <Row align="middle" justify="space-around">
            {userName && (
              <Col>
                {windowWidthRef.current > 800 && (
                  <Row align="middle" justify="space-between">
                    <h1 className="user-name">{userName}</h1>
                  </Row>
                )}
              </Col>
            )}
            <Col>
              <Button
                className="top-bar-button"
                icon={<LogoutOutlined />}
                onClick={() => {
                  dispatch($logout());
                  history.push('/login');
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
}

export default TopBar;
