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
import ManagerForm from '../../components/ManagerForm';
import Loader from '../../shared/Components/Loader';

// reducers
import { deleteUser, fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';

/* -------------------------------------------------------------------------- */
/*                                Manager Page                                */
/* -------------------------------------------------------------------------- */
function ManagerPage() {
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
              message: 'Supprimer Manager',
              description: 'Suppression effectuée avec succès',
            });
            dispatch(fetchAllUsers());
          })
          .catch((err) =>
            notification.error({
              message: 'Supprimer Manager',
              description: err.error.message,
            }),
          );
      },
    });
  };

  /* -------------------------------- CONSTANTS ------------------------------- */

  const allUsers = users?.users?.filter((user) => user.role === 'manager');

  const ManagerData = allUsers?.map((user, index) => ({
    key: index,
    _id: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    company: user?.company ? user?.company?.name : '-',
    internship: user?.internship ? user?.internship?.title : '-',
    phoneNumber: user?.phoneNumber,
  }));

  const MANAGER_COLUMN = [
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
      title: 'Societé',
      key: 'company',
      dataIndex: 'company',
    },
    {
      title: 'Téléphone',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
    },
    {
      render: (record) => (
        <Row align="middle" justify="end">
          <Col>
            <ManagerForm record={record} />
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
              description={"aucun manager n'a été trouvé"}
            >
              <ManagerForm label={'créer un manager'} isCreatedForm />
            </Empty>
          ) : (
            <>
              <ManagerForm label={'créer un manager'} isCreatedForm />
              <Table columns={MANAGER_COLUMN} dataSource={ManagerData} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ManagerPage;
