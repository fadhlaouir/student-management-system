import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Empty, Table } from 'antd';
import Loader from '../../shared/Components/Loader';
import { fetchAllUsers } from '../../reducers/User.slice';
import { fetchAllInternshipRequest, selectAllInternshipRequests } from '../../reducers/InternshipRequest.slice';
import { selectSessionUser } from '../../reducers/Session.slice';

function MyInternsPage() {
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

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]); // should return manager or supervisor

  function verifyRoleId(request) {
    if (currentUserRole === 'manager') {
      return request.internship.manager?._id === currentUser._id;
    }
    return request.internship.supervisor?._id === currentUser._id;
  }
  const myStudents = internshipRequests
    ?.filter((request) => verifyRoleId(request) && request.status === 'accepted')
    .map((request, index) => ({
      key: index,
      _id: request?._id,
      intern: request?.intern,
    }));

  const internColumns = [
    {
      title: 'Prénom',
      dataIndex: 'intern',
      render: (record) => record?.firstName,
    },
    {
      title: 'Nom',
      dataIndex: 'intern',
      render: (record) => record?.lastName,
    },
    {
      title: 'Email',
      dataIndex: 'intern',
      render: (record) => record?.email,
    },
    {
      title: 'Numéro de téléphone',
      dataIndex: 'intern',
      render: (record) => record?.phoneNumber,
    },
    {
      render: (record) => (
        <div style={{ marginRight: '10px' }}>
          <a href={`mailto:${record?.intern?.email}`}>
            <Button>Contact intern</Button>
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
          {myStudents?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description="Tu a pas des stagiaire pour le moment."
            />
          ) : (
            <>
              <Table columns={internColumns} dataSource={myStudents} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MyInternsPage;
