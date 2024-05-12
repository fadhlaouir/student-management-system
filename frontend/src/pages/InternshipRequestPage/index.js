/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useMemo, useState } from 'react';

// Redux
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

// UI Components
import { Table, Row, Col, Button, notification, Empty, Skeleton, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// reducers
import {
  deleteInternshipRequest,
  fetchAllInternshipRequest,
  selectAllInternshipRequests,
  updateInternshipRequest,
} from '../../reducers/InternshipRequest.slice';

// local components
import InternshipRequestForm from '../../components/InternshipRequestForm/index';
import { selectSessionUser } from '../../reducers/Session.slice';

/* -------------------------------------------------------------------------- */
/*                               Internship Page                              */
/* -------------------------------------------------------------------------- */
function InternshipRequestPage() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [loading, setLoading] = useState(true);
  const { confirm } = Modal;
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

  const remoreRequest = (data) => {
    confirm({
      title: 'Êtes-vous sûr de vouloir rejeter cette demande de stage ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(deleteInternshipRequest(data._id))
          .then(unwrapResult)
          .then(() => {
            notification.success({
              message: 'Supprimer la demande',
              description: 'La demande a été rejeter avec succès',
            });
            dispatch(fetchAllInternshipRequest());
          })
          .catch((err) =>
            notification.error({
              message: 'Supprimer la demande',
              description: err.error.message,
            }),
          );
      },
    });
  };

  /**
   *
   * @param {object} entry data entry from form
   */
  // Dispatch update request directly for 'accepted' type
  const acceptRequest = (data, type) => {
    dispatch(
      updateInternshipRequest({
        _id: data._id,
        status: type,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        notification.success({
          message: 'Demande de stage',
          description: 'La demande a été accepté avec succès',
        });
        dispatch(fetchAllInternshipRequest());
      })
      .catch((err) =>
        notification.error({
          message: 'Demande de stage',
          description: err.error.message,
        }),
      );
  };

  /* -------------------------------- CONSTANTS ------------------------------- */

  const INTERNSHIP_DATA =
    InternshipRequestObject &&
    InternshipRequestObject?.filter((rq) => rq.internship.manager._id === currentUser._id).map((request, index) => ({
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
      render: (record) => record?.company ?? 'Non assigné',
    },
    {
      title: "Nom de l'encadrant",
      key: 'internship',
      dataIndex: 'internship',
      render: (record) => getFullName(record?.supervisor) || 'Non assigné',
    },
    {
      title: 'Nom du Manager',
      key: 'internship',
      dataIndex: 'internship',
      render: (record) => getFullName(record?.manager) || 'Non assigné',
    },
    {
      title: 'Statut',
      key: 'status',
      dataIndex: 'status',
    },
    {
      render: (record) => (
        <Row align="middle" justify="end">
          <Col>
            <Button
              type="default"
              onClick={() => acceptRequest(record, 'accepted')}
              disabled={record.status === 'accepted'}
            >
              Accepter
            </Button>
          </Col>
          <Col className="mr">
            <Button type="danger" onClick={() => remoreRequest(record)} danger disabled={record.status === 'accepted'}>
              Refuser
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
