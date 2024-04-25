/* eslint-disable no-alert */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';

// redux
import { useDispatch, useSelector } from 'react-redux';

// UI Components
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Modal, Row, Table, notification } from 'antd';

// Local Components
import SupervisorForm from '../../components/SupervisorForm';
import Loader from '../../shared/Components/Loader';

// reducers
import { deleteUser, fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';

/* -------------------------------------------------------------------------- */
/*                                 Super Visor                                */
/* -------------------------------------------------------------------------- */
function SuperVisor() {
  /* ---------------------------------- CONST --------------------------------- */
  const [loading, setLoading] = useState(true);
  const { confirm } = Modal;
  // Selectors
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
              message: "Supprimer l'encadrant",
              description: 'Suppression effectuée avec succès',
            });
            dispatch(fetchAllUsers());
          })
          .catch((err) =>
            notification.error({
              message: "Supprimer l'encadrant",
              description: err.error.message,
            }),
          );
      },
    });
  };

  /* -------------------------------- CONSTANTS ------------------------------- */

  const allUsers = users?.users?.filter((user) => user.role === 'supervisor');

  const supervisorData = allUsers?.map((user, index) => ({
    key: index,
    _id: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    speciality: user?.speciality,
  }));

  const SUPERVISOR_COLUMN = [
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
        <Row align="middle" justify="end">
          <Col>
            <SupervisorForm record={record} />
          </Col>
          <Col className="mr">
            <Button onClick={() => removeUser(record)} danger>
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
        <Loader />
      ) : (
        <>
          {allUsers?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description={"aucun encadrant n'a été trouvé"}
            >
              <SupervisorForm label={'créer un encadrant'} isCreatedForm />
            </Empty>
          ) : (
            <>
              <SupervisorForm label={'créer un encadrant'} isCreatedForm />
              <Table columns={SUPERVISOR_COLUMN} dataSource={supervisorData} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SuperVisor;
