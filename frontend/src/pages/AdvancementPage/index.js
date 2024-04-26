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
import { deleteAdvancement, fetchAllAdvancements, selectAllAdvencements } from '../../reducers/Advancement.slice';

// local components
import AdvancementForm from '../../components/AdvancementForm/index';
import { selectSessionUser } from '../../reducers/Session.slice';

/* -------------------------------------------------------------------------- */
/*                              Advancement Page                              */
/* -------------------------------------------------------------------------- */
function AdvancementPage() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  // Selectors
  const advancementObject = useSelector(selectAllAdvencements);
  const currentUser = useSelector(selectSessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllAdvancements());
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
  const removeAdvancement = (data) => {
    confirm({
      title: `Are you sure you want to delete "${data?.title}"?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(deleteAdvancement(data._id))
          .then(unwrapResult)
          .then(() => {
            notification.success({
              message: 'Delete Advancement',
              description: 'Advancement has been deleted successfully',
            });
            dispatch(fetchAllAdvancements());
          })
          .catch((err) =>
            notification.error({
              message: 'Delete Advancement',
              description: err.error.message,
            }),
          );
      },
    });
  };

  /* -------------------------------- CONSTANTS ------------------------------- */
  const ADVANCEMENTS = advancementObject && advancementObject;

  const ADVANCEMENT_DATA = ADVANCEMENTS?.filter(
    (avc) => avc.intern?.email === currentUser.email || canCreateOrDeleteOrUpdate,
  ).map((advancement, index) => ({
    key: index,
    _id: advancement?._id,
    title: advancement?.title,
    description: advancement?.description,
    status: advancement?.status,
    intern: advancement?.intern?.email,
    internship: advancement?.internship?.title,
  }));

  const ADVANCEMENT_COLUMN = [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Intern',
      key: 'intern',
      dataIndex: 'intern',
    },
    {
      title: 'Internship',
      key: 'internship',
      dataIndex: 'internship',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
    },
    {
      render: (record) => (
        <>
          <Row align="middle" justify="end">
            <Col>
              <AdvancementForm record={record} />
            </Col>
            {canCreateOrDeleteOrUpdate && (
              <Col className="mr">
                <Button type="danger" onClick={() => removeAdvancement(record)} danger>
                  <DeleteOutlined />
                </Button>
              </Col>
            )}
          </Row>
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
          {ADVANCEMENT_DATA?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description="No advancement found"
            >
              {canCreateOrDeleteOrUpdate && <AdvancementForm label="Create an advancement" isCreatedForm />}
            </Empty>
          ) : (
            <>
              {canCreateOrDeleteOrUpdate && <AdvancementForm label="Create an advancement" isCreatedForm />}
              <Table columns={ADVANCEMENT_COLUMN} dataSource={ADVANCEMENT_DATA} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdvancementPage;
