/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, notification, Skeleton, Table, Button, Empty, Row, Col } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { deleteInternship, fetchAllInternship, selectAllInternships } from '../../reducers/Internship.slice';
import { selectSessionUser } from '../../reducers/Session.slice';

// local components
import InternshipForm from '../../components/InternshipForm/index';
import { localMoment } from '../../common/helpers';
import { API_ENDPOINT } from '../../common/config';

/* -------------------------------------------------------------------------- */
/*                               Internship Page                              */
/* -------------------------------------------------------------------------- */
function InternshipPage() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);

  // Selectors
  const internships = useSelector(selectAllInternships);
  const currentUser = useSelector(selectSessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllInternship());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);
  const canCreateOrDeleteOrUpdate = currentUserRole === 'manager' || currentUserRole === 'admin';

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  const removeCompany = (data) => {
    confirm({
      title: `Voulez-vous vraiment supprimer "${data?.title}"?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(deleteInternship(data._id))
          .then(unwrapResult)
          .then(() => {
            notification.success({
              message: 'Supprimer le stage',
              description: 'le stage à été supprimées avec succès',
            });
            dispatch(fetchAllInternship());
          })
          .catch((err) =>
            notification.error({
              message: 'Supprimer le stage',
              description: err.error.message,
            }),
          );
      },
    });
  };

  /* -------------------------------- CONSTANTS ------------------------------- */
  const INTERNSHIPS = internships && internships?.internships;

  function getFullName(user) {
    return user !== undefined ? `${user?.firstName} ${user?.lastName}` : 'Non assigne';
  }
  const INTERNSHIP_DATA = INTERNSHIPS?.filter(
    (int) =>
      (currentUser?.role === 'manager' && int?.manager === currentUser._id) ||
      currentUser?.role === 'admin' ||
      currentUser?.role === 'intern',
  ).map((internship, index) => ({
    key: index,
    _id: internship?._id,
    title: internship?.title,
    subject: internship?.subject,
    startDate: internship?.startDate,
    endDate: internship?.endDate,
    company: internship?.company,
    supervisor: internship?.supervisor,
    status: internship?.status,
    file: internship?.file,
  }));

  const INTERNSHIP_COLUMN = [
    {
      title: 'Titre',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Sujet',
      key: 'subject',
      dataIndex: 'subject',
    },
    {
      title: 'Entreprise',
      key: 'company',
      dataIndex: 'company',
    },
    {
      title: 'Superviseur',
      key: 'supervisor',
      dataIndex: 'supervisor',
      render: (record) => getFullName(record),
    },
    {
      title: 'Date de début',
      key: 'startDate',
      dataIndex: 'startDate',
      render: (record) => localMoment(record.startDate),
    },
    {
      title: 'Date de fin',
      key: 'endDate',
      dataIndex: 'endDate',
      render: (record) => localMoment(record.endDate),
    },
    {
      title: 'Description de stage',
      key: 'file',
      dataIndex: 'file',
      render: (record) => (
        <>
          {record ? (
            <a href={`${API_ENDPOINT}/${record}`} target="_blank" rel="noopener noreferrer">
              Télécharger le rapport de stage
            </a>
          ) : (
            'Aucun rapport de stage'
          )}
        </>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      dataIndex: 'status',
    },
    {
      render: (record) => (
        <>
          {canCreateOrDeleteOrUpdate && (
            <Row align="middle" justify="end">
              <Col>
                <InternshipForm record={record} />
              </Col>
              <Col className="mr">
                <Button type="danger" onClick={() => removeCompany(record)} danger>
                  <DeleteOutlined />
                </Button>
              </Col>
            </Row>
          )}
        </>
      ),
    },
  ];

  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {INTERNSHIP_DATA?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description="aucun stage n'a été trouvée"
            >
              {currentUserRole === 'manager' && <InternshipForm label="Créer un stage" isCreatedForm />}
            </Empty>
          ) : (
            <>
              {currentUserRole === 'manager' && <InternshipForm label="Créer un stage" isCreatedForm />}
              <Table columns={INTERNSHIP_COLUMN} dataSource={INTERNSHIP_DATA} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default InternshipPage;
