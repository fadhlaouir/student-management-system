import React from 'react';
import { Row, Col, Typography, Statistic } from 'antd';

const { Title } = Typography;

function Home() {
  const donnees = {
    totalUtilisateurs: 1000,
    totalManagers: 200,
    totalStagiaires: 300,
    totalSuperviseurs: 150,
    totalEntreprises: 50,
    totalStages: 80,
    totalStagesDemandes: 120,
  };

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
