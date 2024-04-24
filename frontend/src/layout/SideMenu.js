import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import HOME from '../assets/icons/home-icon.svg';
import USERS from '../assets/icons/users-icon.svg';
import ARTICALES from '../assets/icons/article-icon.svg';
import './index.css';

function SideMenu() {
  const { Sider } = Layout;
  const location = useLocation();
  const history = useHistory();
  const windowWidthRef = useRef(window.innerWidth);

  const routes = useMemo(
    () => [
      {
        key: '1',
        path: '/acceuil',
        name: 'Accueil',
        icon: <img src={HOME} alt="Liste des encadrants" />,
      },
      {
        key: '2',
        path: '/supervisors',
        name: 'Liste des encadrants',
        icon: <img src={USERS} alt="Liste des encadrants" />,
      },
      {
        key: '3',
        path: '/interns',
        name: 'Liste des stagiaires',
        icon: <img src={USERS} alt="home" />,
      },
      {
        key: '4',
        path: '/managers',
        name: 'Liste des managers',
        icon: <img src={USERS} alt="home" />,
      },
      {
        key: '5',
        path: '/companies',
        name: 'Liste des sociétés',
        icon: <img src={USERS} alt="home" />,
      },
      {
        key: '6',
        path: '/internship-offers',
        name: 'Demandes de stage',
        icon: <img src={ARTICALES} alt="home" />,
      },
    ],
    [],
  );

  const selectedKey = useMemo(
    () => routes.find((item) => location.pathname.startsWith(item.path))?.key,
    [location.pathname, routes],
  );

  const onClickMenu = (item) => {
    const clicked = routes.find((_item) => _item.key === item.key);
    history.push(clicked.path);
  };

  const handleResize = () => {
    windowWidthRef.current = window.innerWidth;
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {windowWidthRef.current > 850 && (
        <Sider id="sider-menu">
          <Menu defaultSelectedKeys={['0']} selectedKeys={[selectedKey]} mode="inline" onClick={onClickMenu}>
            {routes.map((item) => (
              <Menu.Item icon={item.icon} key={item.key}>
                <Link to={item.path}>{item.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      )}
    </>
  );
}

export default SideMenu;
