import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Typography, Statistic, Card } from 'antd';
import { UserOutlined, TeamOutlined, UsergroupAddOutlined, ShopOutlined, FileTextOutlined } from '@ant-design/icons';
import Loader from '../../shared/Components/Loader';

// reducers
import { fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';
import { fetchAllCompanies, selectAllCompanies } from '../../reducers/Companies.slice';
import { fetchAllInternship, selectAllInternships } from '../../reducers/Internship.slice';
import { fetchAllInternshipRequest, selectAllInternshipRequests } from '../../reducers/InternshipRequest.slice';

const { Title } = Typography;

function Home() {
  const dispatch = useDispatch();

  // Fetch data from Redux store
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllCompanies());
    dispatch(fetchAllInternship());
    dispatch(fetchAllInternshipRequest());
  }, [dispatch]);

  // Select data from Redux store
  const { users, companies, internships, internshipRequests } = useSelector((state) => ({
    users: selectAllUsers(state),
    companies: selectAllCompanies(state),
    internships: selectAllInternships(state),
    internshipRequests: selectAllInternshipRequests(state),
  }));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users && companies && internships && internshipRequests) {
      setLoading(false);
    }
  }, [users, companies, internships, internshipRequests]);

  // Calculate statistics
  const data = useMemo(() => {
    const USERS = users?.users || [];
    const COMPANIES = companies?.companies || [];
    const INTERNSHIPS = internships?.internships || [];
    const INTERNSHIP_REQUESTS = internshipRequests || [];
    return {
      totalUsers: USERS.length,
      totalManagers: USERS.filter((user) => user.role === 'manager').length,
      totalInterns: USERS.filter((user) => user.role === 'intern').length,
      totalSupervisors: USERS.filter((user) => user.role === 'supervisor').length,
      totalCompanies: COMPANIES.length,
      totalInternships: INTERNSHIPS.length,
      totalInternshipRequests: INTERNSHIP_REQUESTS.length,
    };
  }, [users, companies, internships, internshipRequests]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home-container">
      <Title level={2} className="home-title">
        Tableau de Bord
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Utilisateurs" value={data.totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Managers" value={data.totalManagers} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Stagiaires" value={data.totalInterns} prefix={<UsergroupAddOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="home-row" style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Encadrants" value={data.totalSupervisors} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Entreprises" value={data.totalCompanies} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Stages" value={data.totalInternships} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="home-row" style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Stages Demandés"
              value={data.totalInternshipRequests}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
