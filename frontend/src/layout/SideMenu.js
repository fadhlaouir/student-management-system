/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
import React, { useMemo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

// UI Components
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  ShopOutlined,
} from '@ant-design/icons';

// Styles
import './index.css';
import { useSelector } from 'react-redux';
import { selectSessionUser } from '../reducers/Session.slice';

// Consts
const { Sider } = Layout;

/* -------------------------------------------------------------------------- */
/*                                  Side Menu                                 */
/* -------------------------------------------------------------------------- */
function SideMenu() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const location = useLocation();
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = useSelector(selectSessionUser);

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);

  // Define routes based on user role
  const routes = useMemo(() => {
    switch (currentUserRole) {
      case 'admin':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '2', path: '/supervisors', name: 'Liste des encadrants', icon: <TeamOutlined /> },
          { key: '3', path: '/interns', name: 'Liste des stagiaires', icon: <UsergroupAddOutlined /> },
          { key: '4', path: '/managers', name: 'Liste des managers', icon: <SolutionOutlined /> },
          { key: '5', path: '/companies', name: 'Liste des sociétés', icon: <ShopOutlined /> },
          { key: '6', path: '/programs', name: 'Liste des stages', icon: <FileTextOutlined /> },
          { key: '7', path: '/all-requests', name: 'Demandes de stage', icon: <FileTextOutlined /> },
          { key: '8', path: '/advancements', name: 'Tache et avancement', icon: <UsergroupAddOutlined /> },
        ];
      case 'manager':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '2', path: '/supervisors', name: 'Liste des encadrants', icon: <TeamOutlined /> },
          { key: '3', path: '/interns', name: 'Liste des stagiaires', icon: <UsergroupAddOutlined /> },
          { key: '5', path: '/companies', name: 'Liste des sociétés', icon: <ShopOutlined /> },
          { key: '6', path: '/programs', name: 'Liste des stages', icon: <FileTextOutlined /> },
          { key: '7', path: '/all-requests', name: 'Demandes de stage', icon: <FileTextOutlined /> },
          { key: '8', path: '/advancements', name: 'Tache et avancement', icon: <UsergroupAddOutlined /> },
        ];
      case 'intern':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '5', path: '/companies', name: 'Liste des sociétés', icon: <ShopOutlined /> },
          { key: '6', path: '/programs', name: 'Liste des stages', icon: <FileTextOutlined /> },
          { key: '7', path: '/my-requests', name: 'Mes Demandes', icon: <FileTextOutlined /> },
          { key: '8', path: '/advancements', name: 'Tache et avancement', icon: <UsergroupAddOutlined /> },
          { key: '9', path: '/me', name: 'Mes Documents', icon: <UsergroupAddOutlined /> },
        ];
      case 'supervisor':
        return [
          { key: '1', path: '/acceuil', name: 'Accueil', icon: <HomeOutlined /> },
          { key: '3', path: '/interns', name: 'Liste des stagiaires', icon: <UsergroupAddOutlined /> },
          { key: '5', path: '/companies', name: 'Liste des sociétés', icon: <ShopOutlined /> },
          { key: '6', path: '/programs', name: 'Liste des stages', icon: <FileTextOutlined /> },
          { key: '7', path: '/my-requests', name: 'Mes Stages', icon: <FileTextOutlined /> },
          { key: '8', path: '/advancements', name: 'Tache et avancement', icon: <UsergroupAddOutlined /> },
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

  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <Sider
      id="sider-menu"
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      breakpoint="lg"
      collapsedWidth="0"
      trigger={null}
    >
      <div className="logo" />
      <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} selectedKeys={[selectedKey]} onClick={onClickMenu}>
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
