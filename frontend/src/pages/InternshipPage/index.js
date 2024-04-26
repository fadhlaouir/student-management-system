/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useMemo, useState } from 'react';

// Redux
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

// UI Components
import { Table, Row, Col, Button, Modal, notification, Empty, Skeleton } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// reducers
import { deleteInternship, fetchAllInternship, selectAllInternships } from '../../reducers/Internship.slice';

// local components
import InternshipForm from '../../components/InternshipForm/index';
import { localMoment } from '../../common/helpers';
import { selectSessionUser } from '../../reducers/Session.slice';

/* -------------------------------------------------------------------------- */
/*                               Internship Page                              */
/* -------------------------------------------------------------------------- */
function InternshipPage() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  // Selectors
  const InternshipObject = useSelector(selectAllInternships);
  const currentUser = useSelector(selectSessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllInternship());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);
  const canCreateOrDeleteOrUpdate = currentUserRole === 'admin' || currentUserRole === 'manager';

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  /**
   *
   * @param {object} entry data entry from form
   */
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
  const INTERNSHIPS = InternshipObject && InternshipObject.internships;

  function getFullName(user) {
    return `${user?.firstName} ${user?.lastName}`;
  }

  const INTERNSHIP_DATA = INTERNSHIPS?.map((internship, index) => ({
    key: index,
    _id: internship?._id,
    title: internship?.title,
    subject: internship?.subject,
    startDate: internship?.startDate,
    endDate: internship?.endDate,
    company: internship?.company,
    supervisor: internship.supervisor,
    status: internship?.status,
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
      render: (record) => record?.name || 'Non assigné',
    },
    {
      title: 'Superviseur',
      key: 'supervisor',
      dataIndex: 'supervisor',
      render: (record) => (record.supervisor !== null ? getFullName(record) : 'Non assigné'),
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
              {canCreateOrDeleteOrUpdate && <InternshipForm label="Créer un stage" isCreatedForm />}
            </Empty>
          ) : (
            <>
              {canCreateOrDeleteOrUpdate && <InternshipForm label="Créer un stage" isCreatedForm />}
              <Table columns={INTERNSHIP_COLUMN} dataSource={INTERNSHIP_DATA} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default InternshipPage;
