/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Redux
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

// UI Components
import { Form, Button, Modal, notification, Row } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';

// reducers
import { createCompnay, fetchAllCompanies, updateCompany } from '../../reducers/Companies.slice';

/* -------------------------------------------------------------------------- */
/*                          Question And Answer Form                          */
/* -------------------------------------------------------------------------- */
function CompanyForm({ onChange, onlyFormItems, isCreatedForm, label, record }) {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, []);

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  const [form] = Form.useForm();

  /**
   *
   * @param {object} entry data entry from form
   */
  const onClickSubmit = (entry) => {
    if (record) {
      dispatch(
        updateCompany({
          _id: record._id,
          fields: {
            ...entry,
          },
        }),
      )
        .then(() => {
          notification.success({
            message: 'Société',
            description: 'Société Mis à jour avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllCompanies());
        })
        .catch((error) =>
          notification.error({
            message: 'Société',
            description: error.message,
          }),
        )
        .then(unwrapResult);
      form.resetFields();
    } else {
      dispatch(
        createCompnay({
          ...entry,
        }),
      )
        .then(unwrapResult)
        .then(() => {
          notification.success({
            message: 'Société',
            description: 'Société à été créées avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllCompanies());
        })
        .catch((error) =>
          notification.error({
            message: 'Société',
            description: error.message,
          }),
        );
      form.resetFields();
    }
  };

  /* -------------------------------- CONSTANTS ------------------------------- */
  const FIELDS = {
    columns: 2,
    fields: [
      {
        key: 'name',
        placeholder: 'Nom de la société',
        label: 'Nom de la société',
        initialValue: record?.name,
        rules: [
          {
            required: true,
            message: 'Nom de la société est obligatoire',
          },
        ],
      },
      {
        key: 'address',
        placeholder: 'Adresse',
        label: 'Adresse',
        initialValue: record?.address,
        rules: [
          {
            required: true,
            message: 'Adresse est obligatoire',
          },
        ],
      },
      {
        key: 'phoneNumber',
        placeholder: 'Numéro de téléphone',
        label: 'Numéro de téléphone',
        initialValue: record?.phoneNumber,
      },
      {
        key: 'faxNumber',
        placeholder: 'Numéro de fax',
        label: 'Numéro de fax',
        initialValue: record?.faxNumber,
      },
      {
        key: 'email',
        placeholder: 'Email',
        label: 'Email',
        initialValue: record?.email,
        rules: [
          {
            required: true,
            message: 'Email est obligatoire',
          },
          {
            type: 'email',
            message: 'Email est invalide',
          },
        ],
      },
    ],
  };

  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <div>
      <Button type="primary" onClick={() => setShowModal(!showModal)}>
        {isCreatedForm && <PlusOutlined />}
        {label ?? <EditOutlined />}
      </Button>
      <Modal
        transitionName=""
        maskTransitionName=""
        title={label}
        width={1000}
        visible={showModal}
        maskClosable={false}
        footer={null}
        closable
        destroyOnClose
        onCancel={() => setShowModal(!showModal)}
      >
        <Form
          layout="horizontal"
          onFinish={(values) => onClickSubmit(values)}
          onValuesChange={onChange}
          form={form}
          encType="multipart/form-data"
        >
          <FormBuilder form={form} meta={FIELDS} />

          <Row align="middle" justify="center">
            {!onlyFormItems && (
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Form.Item>
            )}
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

CompanyForm.propTypes = {
  record: PropTypes.object,
  label: PropTypes.string,
  isCreatedForm: PropTypes.bool,
  onChange: PropTypes.func,
  onlyFormItems: PropTypes.bool,
};

CompanyForm.defaultProps = {
  isCreatedForm: false,
};

export default CompanyForm;
