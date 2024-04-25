/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// UI Components
import { Row, Col, Typography, Statistic } from 'antd';

// Local Components
import Loader from '../../shared/Components/Loader';

// reducers
import { fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';
import { fetchAllCompanies, selectAllCompanies } from '../../reducers/Companies.slice';
import { fetchAllInternship, selectAllInternships } from '../../reducers/Internship.slice';
import { fetchAllInternshipRequest, selectAllInternshipRequests } from '../../reducers/InternshipRequest.slice';

// Consts
const { Title } = Typography;

/* -------------------------------------------------------------------------- */
/*                                  Home Page                                 */
/* -------------------------------------------------------------------------- */
function Home() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [loading, setLoading] = useState(true);
  // Selectors
  const users = useSelector(selectAllUsers);
  const companies = useSelector(selectAllCompanies);
  const internships = useSelector(selectAllInternships);
  const internshipRequests = useSelector(selectAllInternshipRequests);
  const dispatch = useDispatch();

  /* --------------------------------- EFFECT --------------------------------- */
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllCompanies());
    dispatch(fetchAllInternship());
    dispatch(fetchAllInternshipRequest());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  /* --------------------------------- CONSTS --------------------------------- */
  const USERS = users ? users.users : [];
  const COMPANIES = companies ? companies.companies : [];
  const INTERNSHIPS = internships ? internships.internships : [];
  const INTERNSHIP_REQUESTS = internshipRequests ?? [];
  const donnees = {
    totalUtilisateurs: USERS?.length,
    totalManagers: USERS?.filter((user) => user.role === 'manager').length,
    totalStagiaires: USERS?.filter((user) => user.role === 'intern').length,
    totalSuperviseurs: USERS?.filter((user) => user.role === 'supervisor').length,
    totalEntreprises: COMPANIES?.length,
    totalStages: INTERNSHIPS?.length,
    totalStagesDemandes: INTERNSHIP_REQUESTS?.length,
  };

  /* -------------------------------- RENDERING ------------------------------- */
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Loader />
      </div>
    );
  }
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>
        Tableau de Bord
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Utilisateurs" value={donnees.totalUtilisateurs} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Managers" value={donnees.totalManagers} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Stagiaires" value={donnees.totalStagiaires} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Encadrants" value={donnees.totalSuperviseurs} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Entreprises" value={donnees.totalEntreprises} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Stages" value={donnees.totalStages} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Stages Demandés" value={donnees.totalStagesDemandes} />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
