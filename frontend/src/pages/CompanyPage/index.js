import React, { useEffect, useMemo, useState } from 'react';
import { Modal, notification, Skeleton, Table, Row, Col, Button, Empty } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCompany, fetchAllCompanies, selectAllCompanies } from '../../reducers/Companies.slice';
import CompanyForm from '../../components/CompanyForm/index';
import { selectSessionUser } from '../../reducers/Session.slice';

const { confirm } = Modal;

function CompanyPage() {
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectSessionUser);
  const dispatch = useDispatch();
  const CompaniesObject = useSelector(selectAllCompanies);

  useEffect(() => {
    dispatch(fetchAllCompanies()).then(() => setLoading(false));
  }, [dispatch]);

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);
  const canCreateOrDeleteOrUpdateIntern = currentUserRole === 'admin' || currentUserRole === 'manager';

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
              description: 'La société a été supprimée avec succès',
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

  const COMPANY = CompaniesObject?.companies || [];

  const COMPANY_DATA = useMemo(
    () =>
      COMPANY.map((company, index) => ({
        key: index,
        _id: company._id,
        name: company.name,
        address: company.address,
        phoneNumber: company.phoneNumber,
        faxNumber: company.faxNumber,
        email: company.email,
      })),
    [COMPANY],
  );

  const COMPANY_COLUMN = useMemo(
    () => [
      { title: 'Nom de la société', key: 'name', dataIndex: 'name' },
      { title: 'Adresse', key: 'address', dataIndex: 'address' },
      { title: 'Numéro de téléphone', key: 'phoneNumber', dataIndex: 'phoneNumber' },
      { title: 'Numéro de fax', key: 'faxNumber', dataIndex: 'faxNumber' },
      { title: 'Email', key: 'email', dataIndex: 'email' },
      {
        render: (record) => (
          <>
            {canCreateOrDeleteOrUpdateIntern && (
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
            )}
          </>
        ),
      },
    ],
    [canCreateOrDeleteOrUpdateIntern, removeCompany],
  );

  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {COMPANY_DATA.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 250 }}
              description="Aucune société n'a été trouvée"
            >
              {canCreateOrDeleteOrUpdateIntern && <CompanyForm label="Créer une société" isCreatedForm />}
            </Empty>
          ) : (
            <>
              {canCreateOrDeleteOrUpdateIntern && <CompanyForm label="Créer une société" isCreatedForm />}
              <Table columns={COMPANY_COLUMN} dataSource={COMPANY_DATA} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyPage;
