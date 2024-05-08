import React, { useEffect, useMemo, useState } from 'react';
import { Modal, notification, Table, Row, Col, Button, Empty, Skeleton } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  fetchAllInternshipRequest,
  deleteInternshipRequest,
  selectAllInternshipRequests,
} from '../../reducers/InternshipRequest.slice';
import { fetchAllInternship, selectAllInternships } from '../../reducers/Internship.slice';
import { selectSessionUser } from '../../reducers/Session.slice';
import MyInternshipRequestForm from '../../components/MyInternshipRequestForm';

function MyInternshipRequestPage() {
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectSessionUser);
  const internshipRequests = useSelector(selectAllInternshipRequests);
  const internships = useSelector(selectAllInternships);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllInternshipRequest());
    dispatch(fetchAllInternship());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [dispatch]);

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);
  const canDelete = currentUserRole === 'intern';

  const remoreRequest = (data) => {
    confirm({
      title: 'Voulez-vous vraiment supprimer cette demande ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(deleteInternshipRequest(data._id))
          .then(unwrapResult)
          .then(() => {
            notification.success({
              message: 'Supprimer le stage',
              description: 'Le stage a été supprimé avec succès',
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
  console.log('internshipRequests', internshipRequests);
  console.log('currentUser', currentUser);
  const internshipData = useMemo(() => {
    switch (currentUserRole) {
      case 'intern':
        return internshipRequests
          ?.filter((request) => request.intern?._id === currentUser._id)
          .map((request, index) => ({
            key: index,
            _id: request?._id,
            status: request?.status,
            intern: request?.intern,
            internship: request?.internship,
          }));
      case 'supervisor':
        return internshipRequests
          ?.filter(
            (request) => request?.internship?.supervisor?._id === currentUser._id && request?.status === 'accepted',
          )
          .map((request, index) => ({
            key: index,
            _id: request?._id,
            status: request?.status,
            intern: request?.intern,
            internship: request?.internship,
          }));
      case 'manager':
        return internshipRequests
          ?.filter((request) => request?.internship?.manager === currentUser._id && request?.status === 'accepted')
          .map((request, index) => ({
            key: index,
            _id: request?._id,
            status: request?.status,
            intern: request?.intern,
            internship: request?.internship,
          }));
      default:
        return [];
    }
  }, [currentUserRole, currentUser, internshipRequests]);

  const getFullName = (user) => `${user?.firstName} ${user?.lastName}`;

  const internshipColumns = [
    {
      title: 'Nom du Stagiaire',
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
      key: 'company',
      dataIndex: 'internship',
      render: (record) => record?.company ?? 'Non assigné',
    },
    {
      title: "Nom de l'encadrant",
      key: 'supervisor',
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
          <Col className="mr">
            {canDelete && (
              <Button type="danger" onClick={() => remoreRequest(record)} danger>
                <DeleteOutlined />
              </Button>
            )}
          </Col>
        </Row>
      ),
    },
  ];

  const intenshipLength = internships.internships?.length;
  console.log('internshipData', internshipData);
  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {internshipData.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description={
                intenshipLength === 0
                  ? "Actuellement, il n'y a pas de stage pour l'appliquer."
                  : "Aucune demande de stage n'a été trouvée"
              }
            >
              {currentUserRole === 'intern' && intenshipLength > 0 && (
                <MyInternshipRequestForm label="Créer une demande de stage" isCreatedForm />
              )}
            </Empty>
          ) : (
            <>
              {currentUserRole === 'intern' && (
                <h1>
                  <strong>Mes demandes</strong>
                </h1>
              )}
              <Table columns={internshipColumns} dataSource={internshipData} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MyInternshipRequestPage;
