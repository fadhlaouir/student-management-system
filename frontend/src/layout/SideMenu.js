import React, { useMemo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  FileOutlined,
  TeamOutlined,
  UserAddOutlined,
  IdcardOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectSessionUser } from '../reducers/Session.slice';

import './index.css';

const { Sider } = Layout;

function SideMenu() {
  const location = useLocation();
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = useSelector(selectSessionUser);

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);

  const routes = useMemo(() => {
    // Define routes based on user role
    switch (currentUserRole) {
      case 'admin':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '2', path: '/supervisors', name: 'Liste des encadrants', icon: <TeamOutlined /> },
          { key: '3', path: '/interns', name: 'Liste des stagiaires', icon: <UserAddOutlined /> },
          { key: '4', path: '/managers', name: 'Liste des managers', icon: <IdcardOutlined /> },
          { key: '5', path: '/companies', name: 'Liste des sociétés', icon: <ShopOutlined /> },
          { key: '6', path: '/programs', name: 'Liste des stages', icon: <FileOutlined /> },
          { key: '7', path: '/all-requests', name: 'Demandes de stage', icon: <FileOutlined /> },
          { key: '8', path: '/advancements', name: 'Tache et avancement', icon: <UserAddOutlined /> },
        ];
      case 'manager':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '3', path: '/interns', name: 'Liste des stagiaires', icon: <UserAddOutlined /> },
          { key: '6', path: '/programs', name: 'Liste des stages', icon: <FileOutlined /> },
          { key: '7', path: '/all-requests', name: 'Demandes de stage', icon: <FileOutlined /> },
          { key: '8', path: '/my-interns', name: 'Mes etudiants', icon: <UserAddOutlined /> },
          { key: '9', path: '/advancements', name: 'Tache et avancement', icon: <UserAddOutlined /> },
        ];
      case 'intern':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '5', path: '/companies', name: 'Liste des sociétés', icon: <ShopOutlined /> },
          { key: '6', path: '/programs', name: 'Liste des stages', icon: <FileOutlined /> },
          { key: '7', path: '/my-requests', name: 'Mes Demandes', icon: <FileOutlined /> },
          { key: '8', path: '/my-seniors', name: 'Mes managers et encadrants', icon: <UserAddOutlined /> },
          { key: '9', path: '/advancements', name: 'Tache et avancement', icon: <UserAddOutlined /> },
          { key: '10', path: '/me', name: 'Mes Documents', icon: <UserAddOutlined /> },
        ];
      case 'supervisor':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '3', path: '/interns', name: 'Liste des stagiaires', icon: <UserAddOutlined /> },
          { key: '5', path: '/companies', name: 'Liste des sociétés', icon: <ShopOutlined /> },
          { key: '6', path: '/my-requests', name: 'Mes Stages associe', icon: <FileOutlined /> },
          { key: '7', path: '/my-interns', name: 'Mes etudiants', icon: <UserAddOutlined /> },
        ];
      default:
        return [{ key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> }];
    }
  }, [currentUser?.role]);

  const selectedKey = useMemo(
    () => routes.find((item) => location.pathname.startsWith(item.path))?.key,
    [location.pathname, routes],
  );

  const onClickMenu = (item) => {
    const clicked = routes.find((_item) => _item.key === item.key);
    history.push(clicked.path);
  };

  // eslint-disable-next-line no-shadow
  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Sider
      id="sider-menu"
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      breakpoint="lg"
      collapsedWidth="0"
      trigger={null}
      width={260}
    >
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} selectedKeys={[selectedKey]} onClick={onClickMenu}>
        {routes.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.name}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default SideMenu;
