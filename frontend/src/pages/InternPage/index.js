/* eslint-disable no-alert */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useMemo, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';

// redux
import { useDispatch, useSelector } from 'react-redux';

// UI Components
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Modal, Row, Table, notification } from 'antd';

// Local Components
import InternForm from '../../components/InternForm';
import Loader from '../../shared/Components/Loader';

// reducers
import { deleteUser, fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';
import { selectSessionUser } from '../../reducers/Session.slice';

/* -------------------------------------------------------------------------- */
/*                                 Intern Page                                */
/* -------------------------------------------------------------------------- */
function InternPage() {
  /* ---------------------------------- CONST --------------------------------- */
  const [loading, setLoading] = useState(true);
  const { confirm } = Modal;
  // Selectors
  const users = useSelector(selectAllUsers);
  const currentUser = useSelector(selectSessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
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
  const removeUser = (data) => {
    confirm({
      title: `Voulez-vous vraiment supprimer "${data?.firstName} ${data?.lastName}" ?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(deleteUser(data._id))
          .then(unwrapResult)
          .then(() => {
            notification.success({
              message: "Supprimer l'stagiaire",
              description: 'Suppression effectuée avec succès',
            });
            dispatch(fetchAllUsers());
          })
          .catch((err) =>
            notification.error({
              message: "Supprimer l'stagiaire",
              description: err.error.message,
            }),
          );
      },
    });
  };

  /* -------------------------------- CONSTANTS ------------------------------- */

  const allUsers = users?.users?.filter((user) => user.role === 'intern');

  const InternPageData = allUsers?.map((user, index) => ({
    key: index,
    _id: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    speciality: user?.speciality,
  }));

  const INTERN_COLUMN = [
    {
      title: 'Prénom',
      key: 'firstName',
      dataIndex: 'firstName',
      fixed: 'left',
    },
    {
      title: 'Nom',
      key: 'lastName',
      dataIndex: 'lastName',
      fixed: 'left',
    },
    {
      title: 'E-mail',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Téléphone',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Specialité',
      key: 'speciality',
      dataIndex: 'speciality',
    },
    {
      render: (record) => (
        <Row align="middle" justify="space-between">
          <Col>
            <a href={`mailto:${record.email}`}>
              <Button>Contact</Button>
            </a>
          </Col>
          {canCreateOrDeleteOrUpdate && (
            <>
              <Col>
                <InternForm record={record} />
              </Col>
              <Col>
                <Button onClick={() => removeUser(record)} danger>
                  <DeleteOutlined />
                </Button>
              </Col>
            </>
          )}
        </Row>
      ),
    },
  ];
  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {allUsers?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description={"aucun stagiaire n'a été trouvé"}
            >
              {canCreateOrDeleteOrUpdate && <InternForm label={'créer un stagiaire'} isCreatedForm />}
            </Empty>
          ) : (
            <>
              {canCreateOrDeleteOrUpdate && <InternForm label={'créer un stagiaire'} isCreatedForm />}
              <Table columns={INTERN_COLUMN} dataSource={InternPageData} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default InternPage;
