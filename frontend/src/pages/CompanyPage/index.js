/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useState } from 'react';

// Redux
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

// UI Components
import { Table, Row, Col, Button, Modal, notification, Empty, Skeleton } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// reducers
import { deleteCompany, fetchAllCompanies, selectAllCompanies } from '../../reducers/Companies.slice';

// local components
import CompanyForm from '../../components/CompanyForm/index';

/* -------------------------------------------------------------------------- */
/*                          Question And Answer Page                          */
/* -------------------------------------------------------------------------- */
function CompanyPage() {
  /* ---------------------------------- HOOKS --------------------------------- */
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  // Selectors
  const CompaniesObject = useSelector(selectAllCompanies);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCompanies());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  /**
   *
   * @param {object} entry data entry from form
   */
  const removeCompany = (data) => {
    confirm({
      title: `Voulez-vous vraiment supprimer "${data?.name}"?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dispatch(deleteCompany(data._id))
          .then(unwrapResult)
          .then(() => {
            notification.success({
              message: 'Supprimer la société',
              description: 'La société à été supprimées avec succès',
            });
            dispatch(fetchAllCompanies());
          })
          .catch((err) =>
            notification.error({
              message: 'Supprimer la société',
              description: err.error.message,
            }),
          );
      },
    });
  };

  /* -------------------------------- CONSTANTS ------------------------------- */
  const COMPANY = CompaniesObject && CompaniesObject.companies;

  const COMPANY_DATA = COMPANY?.map((compnay, index) => ({
    // in common
    key: index,
    _id: compnay._id,
    name: compnay.name,
    address: compnay.address,
    phoneNumber: compnay.phoneNumber,
    faxNumber: compnay.faxNumber,
    email: compnay.email,
  }));

  const COMPANY_COLUMN = [
    {
      title: 'Nom de la société',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Adresse',
      key: 'address',
      dataIndex: 'address',
    },
    {
      title: 'Numéro de téléphone',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Numéro de fax',
      key: 'faxNumber',
      dataIndex: 'faxNumber',
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      render: (record) => (
        <Row align="middle" justify="end">
          <Col>
            <CompanyForm record={record} />
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
          {COMPANY_DATA?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 250,
              }}
              description="aucune société n'a été trouvée"
            >
              <CompanyForm label="Créer une société" isCreatedForm />
            </Empty>
          ) : (
            <>
              <CompanyForm label="Créer une société" isCreatedForm />
              <Table columns={COMPANY_COLUMN} dataSource={COMPANY_DATA} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyPage;
