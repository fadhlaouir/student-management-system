/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// UI Components
import { Form, Button, Modal, notification, Row } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';

// reducers
import { fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';

// Config
import { API_ENDPOINT } from '../../common/config';

// style
import '../../App.css';
import { fetchAllCompanies, selectAllCompanies } from '../../reducers/Companies.slice';

/* -------------------------------------------------------------------------- */
/*                                Manager Form                                */
/* -------------------------------------------------------------------------- */
function ManagerForm({ isCreatedForm, label, record }) {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const users = useSelector(selectAllUsers);
  const companies = useSelector(selectAllCompanies);
  const forceUpdate = FormBuilder.useForceUpdate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllCompanies());
  }, []);

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  /**
   *
   * @param {object} entry data entry from form
   */
  const onClickSubmit = (entry) => {
    const data = new FormData();
    // eslint-disable-next-line mdx/no-unused-expressions
    data.append('firstName', entry.firstName);
    data.append('lastName', entry.lastName);
    data.append('email', entry.email);
    data.append('company', entry.company);
    if (entry.password) data.append('password', entry.password);
    data.append('phoneNumber', entry.phoneNumber);
    if (!record) data.append('role', 'manager');

    if (record) {
      axios
        .put(`${API_ENDPOINT}/v1/api/users/${record._id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          notification.success({
            message: 'Manager',
            description: 'les mise à jour ont été effectuées avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllUsers());
        })
        .catch((error) =>
          notification.error({
            message: 'Manager',
            description: error.message,
          }),
        );
    } else {
      axios
        .post(`${API_ENDPOINT}/v1/api/auth/register`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          notification.success({
            message: 'Manager',
            description: 'Ajoûté avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllUsers());
        })
        .catch((error) =>
          notification.error({
            message: 'Manager',
            description: error.message,
          }),
        );
    }
  };

  /* -------------------------------- CONSTANTS ------------------------------- */
  const PERSONAL_INFO = {
    columns: 2,
    fields: [
      {
        key: 'firstName',
        label: 'Prénom',
        placeholder: 'Prénom',
        initialValue: record?.firstName,
        colSpan: 2,
        rules: [
          {
            required: true,
            message: 'Prénom est obligatoire',
          },
        ],
      },
      {
        key: 'lastName',
        label: 'Nom',
        placeholder: 'Nom',
        initialValue: record?.lastName,
        colSpan: 2,
        rules: [
          {
            required: true,
            message: 'Nom est obligatoire',
          },
        ],
      },
      {
        key: 'email',
        label: 'Adresse e-mail',
        placeholder: 'Adresse e-mail',
        initialValue: record?.email,
        disabled: !!record,
        colSpan: 2,
        rules: [
          {
            type: 'email',
            message: "L'entrée n'est pas valide e-mail!",
          },
          {
            required: true,
            message: 'Veuillez saisir votre e-mail !',
          },
          {
            validator: () => {
              const emailValue = form.getFieldValue('email');
              return new Promise((resolve, reject) => {
                if (users?.users?.find((b) => b.email === emailValue) && !record) {
                  reject(new Error("l'email existe déjà."));
                } else {
                  resolve();
                }
              });
            },
          },
        ],
      },
      {
        key: 'company',
        label: 'Société',
        widget: 'select',
        options: companies?.companies?.map((company) => ({
          label: company.name,
          value: company._id,
        })),
        initialValue: record?.company,
      },
    ],
  };
  const PASSWORD_INFO = {
    fields: [
      {
        key: 'password',
        label: 'Mot de passe',
        widget: 'password',
        colSpan: 2,
        onChange: () => {
          if (form.isFieldTouched('confirmPassword')) {
            form.validateFields(['confirmPassword']);
          }
        },
        rules: [
          {
            required: true,
            message: 'Mot de passe obligatoire',
          },
        ],
      },
      {
        key: 'confirmPassword',
        label: 'Confirmez le',
        widget: 'password',
        required: true,
        colSpan: 2,
        rules: [
          {
            validator: (rule, value) => {
              return new Promise((resolve, reject) => {
                if (value !== form.getFieldValue('password')) {
                  reject(new Error('Deux mots de passe sont incohérents.'));
                } else {
                  resolve();
                }
              });
            },
          },
        ],
      },
    ],
  };
  const ADDRESS_INFO = {
    columns: 2,
    fields: [
      {
        key: 'phoneNumber',
        label: 'Numéro de tél',
        widget: 'number',
        initialValue: record?.phoneNumber,
        rules: [
          {
            pattern: /^[\d]{8,8}$/,
            message: 'La valeur doit être égale à 8 chiffre',
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
        width={800}
        title={label}
        visible={showModal}
        maskClosable={false}
        footer={null}
        closable
        destroyOnClose
        onCancel={() => setShowModal(!showModal)}
      >
        <Form onFinish={(values) => onClickSubmit(values)} onValuesChange={forceUpdate} form={form}>
          <FormBuilder form={form} meta={PERSONAL_INFO} />

          {!record && <FormBuilder form={form} meta={PASSWORD_INFO} />}
          <FormBuilder form={form} meta={ADDRESS_INFO} />

          <Row justify="center">
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

ManagerForm.propTypes = {
  record: PropTypes.object,
  label: PropTypes.string,
  isCreatedForm: PropTypes.bool,
};

ManagerForm.defaultProps = {
  isCreatedForm: false,
};

export default ManagerForm;
