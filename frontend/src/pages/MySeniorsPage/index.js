import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Empty, Table } from 'antd';
import Loader from '../../shared/Components/Loader';
import { fetchAllUsers } from '../../reducers/User.slice';
import { fetchAllInternshipRequest, selectAllInternshipRequests } from '../../reducers/InternshipRequest.slice';
import { selectSessionUser } from '../../reducers/Session.slice';

function MySeniorsPage() {
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectSessionUser);
  const internshipRequests = useSelector(selectAllInternshipRequests);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllInternshipRequest());
    dispatch(fetchAllUsers());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const myInternshipRequest = internshipRequests
    ?.filter((request) => request.intern?._id === currentUser._id && request.status === 'accepted')
    .map((request, index) => ({
      key: index,
      _id: request?._id,
      internship: request?.internship,
    }));

  const managerColumns = [
    {
      title: 'Prénom',
      dataIndex: 'internship',
      render: (record) => record?.manager?.firstName,
    },
    {
      title: 'Nom',
      dataIndex: 'internship',
      render: (record) => record?.manager?.lastName,
    },
    {
      title: 'Email',
      dataIndex: 'internship',
      render: (record) => record?.manager?.email,
    },
    {
      title: 'Numéro de téléphone',
      dataIndex: 'internship',
      render: (record) => record?.manager?.phoneNumber,
    },
    {
      render: (record) => (
        <div style={{ marginRight: '10px' }}>
          <a href={`mailto:${record?.internship?.manager?.email}`}>
            <Button>Contact Manager</Button>
          </a>
        </div>
      ),
    },
  ];

  const supervisorColumns = [
    {
      title: 'Prénom',
      dataIndex: 'internship',
      render: (record) => record?.supervisor?.firstName,
    },
    {
      title: 'Nom',
      dataIndex: 'internship',
      render: (record) => record?.supervisor?.lastName,
    },
    {
      title: 'Email',
      dataIndex: 'internship',
      render: (record) => record?.supervisor?.email,
    },
    {
      title: 'Numéro de téléphone',
      dataIndex: 'internship',
      render: (record) => record?.supervisor?.phoneNumber,
    },
    {
      render: (record) => (
        <div style={{ marginRight: '10px' }}>
          <a href={`mailto:${record?.internship?.supervisor?.email}`}>
            <Button>Contact Supervisor</Button>
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {myInternshipRequest?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description="Pas d'encadrant ou de manager pour le moment."
            />
          ) : (
            <>
              <h2>Mon Manager</h2>
              <Table columns={managerColumns} dataSource={myInternshipRequest} />

              <h2>Mon Encadrant</h2>
              <Table columns={supervisorColumns} dataSource={myInternshipRequest} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MySeniorsPage;
