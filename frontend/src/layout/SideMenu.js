import React, { useMemo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import './index.css';

const { Sider } = Layout;

function SideMenu() {
  const location = useLocation();
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);

  const routes = useMemo(
    () => [
      {
        key: '1',
        path: '/acceuil',
        name: 'Accueil',
        icon: <HomeOutlined />,
      },
      {
        key: '2',
        path: '/supervisors',
        name: 'Liste des encadrants',
        icon: <TeamOutlined />,
      },
      {
        key: '3',
        path: '/interns',
        name: 'Liste des stagiaires',
        icon: <UsergroupAddOutlined />,
      },
      {
        key: '4',
        path: '/managers',
        name: 'Liste des managers',
        icon: <SolutionOutlined />,
      },
      {
        key: '5',
        path: '/companies',
        name: 'Liste des sociétés',
        icon: <ShopOutlined />,
      },
      {
        key: '6',
        path: '/internship-offers',
        name: 'Demandes de stage',
        icon: <FileTextOutlined />,
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
