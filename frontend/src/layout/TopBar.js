import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Layout, Divider, Button } from 'antd';
import { selectSessionUser, $logout } from '../reducers/Session.slice';

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

  const handleLogout = useCallback(() => {
    dispatch($logout());
    history.push('/login');
  }, [dispatch, history]);

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
            {userName && windowWidthRef.current > 800 && (
              <Col>
                <h1 className="user-name">{userName}</h1>
              </Col>
            )}
            <Col>
              <Button className="top-bar-button" icon={<LogoutOutlined />} onClick={handleLogout} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
}

export default TopBar;
