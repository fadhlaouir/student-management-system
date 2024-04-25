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
import {
  deleteInternshipRequest,
  fetchAllInternshipRequest,
  selectAllInternshipRequests,
} from '../../reducers/InternshipRequest.slice';

// local components
import InternshipRequestForm from '../../components/InternshipRequestForm/index';
import { selectSessionUser } from '../../reducers/Session.slice';

/* -------------------------------------------------------------------------- */
/*                               Internship Page                              */
/* -------------------------------------------------------------------------- */
function InternshipRequestPage() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  // Selectors
  const currentUser = useSelector(selectSessionUser);
  const InternshipRequestObject = useSelector(selectAllInternshipRequests);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllInternshipRequest());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);
  /* ----------------------------- RENDER HELPERS ----------------------------- */
  /**
   *
   * @param {object} entry data entry from form
   */
  const removeCompany = (data) => {
    confirm({
      title: 'Voulez-vous vraiment supprimer cette demande ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(deleteInternshipRequest(data._id))
          .then(unwrapResult)
          .then(() => {
            notification.success({
              message: 'Supprimer le stage',
              description: 'le stage à été supprimées avec succès',
            });
            dispatch(fetchAllInternshipRequest());
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

  const INTERNSHIP_DATA =
    currentUserRole === 'intern'
      ? InternshipRequestObject &&
        InternshipRequestObject?.filter((request) => request.intern._id === currentUser._id).map((request, index) => ({
          key: index,
          _id: request?._id,
          status: request?.status,
          intern: request?.intern,
          internship: request?.internship,
        }))
      : InternshipRequestObject &&
        InternshipRequestObject?.map((request, index) => ({
          key: index,
          _id: request?._id,
          status: request?.status,
          intern: request?.intern,
          internship: request?.internship,
        }));

  function getFullName(user) {
    return `${user?.firstName} ${user?.lastName}`;
  }

  const INTERNSHIP_COLUMN = [
    {
      title: 'Nom du Stagiare',
      key: 'intern',
      dataIndex: 'intern',
      render: (record) => getFullName(record) || 'Non assigné',
    },
    {
      title: 'Titre du Stage',
      key: 'internship',
      dataIndex: 'internship',
      render: (record) => record?.title ?? 'Non assigné',
    },
    {
      title: 'Nom de la société',
      key: 'internship',
      dataIndex: 'internship',
      render: (record) => record?.company?.name ?? 'Non assigné',
    },
    {
      title: "Nom de l'encadrant",
      key: 'internship',
      dataIndex: 'internship',
      render: (record) => getFullName(record?.supervisor) || 'Non assigné',
    },
    {
      title: 'Statut',
      key: 'status',
      dataIndex: 'status',
    },
    {
      render: (record) => (
        <Row align="middle" justify="end">
          <Col>Show More</Col>
          <Col>
            <InternshipRequestForm record={record} />
          </Col>
          <Col className="mr">
            <Button type="danger" onClick={() => removeCompany(record)} danger>
              <DeleteOutlined />
            </Button>
          </Col>
        </Row>
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
              description="aucun demande de stage n'a été trouvée"
            >
              {currentUserRole === 'intern' && (
                <InternshipRequestForm label="Créer un demande de stage" isCreatedForm />
              )}
            </Empty>
          ) : (
            <>
              {currentUserRole === 'intern' && (
                <h1>
                  <strong>Mes demandes</strong>
                </h1>
              )}
              <Table columns={INTERNSHIP_COLUMN} dataSource={INTERNSHIP_DATA} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default InternshipRequestPage;
