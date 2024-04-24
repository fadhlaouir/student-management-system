import React, { useEffect, useMemo, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Layout, Divider, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { selectSessionUser, $logout } from '../reducers/Session.slice';
import './index.css';

function TopBar() {
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
