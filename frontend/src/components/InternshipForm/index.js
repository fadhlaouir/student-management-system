/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

// UI Components
import { Form, Button, Modal, notification, Row } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';

// reducers
import { createInternship, fetchAllInternship, updateInternship } from '../../reducers/Internship.slice';
import { fetchAllCompanies, selectAllCompanies } from '../../reducers/Companies.slice';
import { fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';
import { selectSessionUser } from '../../reducers/Session.slice';

/* -------------------------------------------------------------------------- */
/*                               Internship Form                              */
/* -------------------------------------------------------------------------- */
function InternshipForm({ onChange, onlyFormItems, isCreatedForm, label, record }) {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const companies = useSelector(selectAllCompanies);
  const users = useSelector(selectAllUsers);

  const currentUser = useSelector(selectSessionUser);

  const currentUserCompnay = useMemo(() => currentUser?.company, [currentUser]);

  useEffect(() => {
    dispatch(fetchAllInternship());
    dispatch(fetchAllUsers());
    dispatch(fetchAllCompanies());
  }, []);

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  const [form] = Form.useForm();

  /**
   *
   * @param {object} entry data entry from form
   */
  const onClickSubmit = (entry) => {
    const dataToEnter = {
      company: currentUserCompnay?.name,
      manager: currentUser?._id,
      ...entry,
    };

    if (record) {
      dispatch(
        updateInternship({
          _id: record._id,
          fields: {
            ...entry,
          },
        }),
      )
        .then(() => {
          notification.success({
            message: 'Stage',
            description: 'Stage Mis à jour avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllInternship());
        })
        .catch((error) =>
          notification.error({
            message: 'Stage',
            description: error.message,
          }),
        )
        .then(unwrapResult);
      form.resetFields();
    } else {
      dispatch(
        createInternship({
          ...dataToEnter,
        }),
      )
        .then(unwrapResult)
        .then(() => {
          notification.success({
            message: 'Stage',
            description: 'Stage est créées avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllInternship());
        })
        .catch((error) =>
          notification.error({
            message: 'Stage',
            description: error.message,
          }),
        );
      form.resetFields();
    }
  };

  function getFullName(user) {
    return `${user?.firstName} ${user?.lastName}`;
  }
  const supervisorOptions =
    users?.users
      ?.filter((user) => user.role === 'supervisor')
      .map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user._id,
      })) || [];

  const companiesOptions =
    companies?.companies?.map((company) => ({
      label: company.name,
      value: company._id,
    })) || [];

  /* -------------------------------- CONSTANTS ------------------------------- */
  const FIELDS = {
    columns: 2,
    fields: [
      {
        key: 'title',
        placeholder: 'Titre de stage',
        label: 'Titre de stage',
        initialValue: record?.title,
        rules: [
          {
            required: true,
            message: 'Titre de stage est obligatoire',
          },
        ],

        disabled: currentUser?.role === 'admin',
      },
      {
        key: 'subject',
        placeholder: 'Sujet',
        label: 'Sujet',
        initialValue: record?.subject,
        widget: 'textarea',
        rules: [
          {
            required: true,
            message: 'Sujet est obligatoire',
          },
        ],

        disabled: currentUser?.role === 'admin',
      },
      currentUser?.role === 'admin' && {
        key: 'supervisor',
        label: 'Encadrant',
        widget: 'select',
        initialValue: record?.supervisor ? getFullName(record?.supervisor) : null,
        options: supervisorOptions,
      },
      // {
      //   key: 'company',
      //   label: 'Entreprise',
      //   widget: 'select',
      //   initialValue: record?.company ? record.company?.name : null,
      //   options: companiesOptions,
      // },
      {
        key: 'startDate',
        label: 'Date de début',
        widget: 'date-picker',
        initialValue: record?.startDate ? moment.tz(record.startDate, 'Africa/Tunis') : null,
        rules: [{ required: true, message: 'Date de début est obligatoire' }],

        disabled: currentUser?.role === 'admin',
      },
      {
        key: 'endDate',
        label: 'Date de fin',
        widget: 'date-picker',
        initialValue: record?.endDate ? moment.tz(record.endDate, 'Africa/Tunis') : null,
        rules: [
          { required: true, message: 'Date de fin est obligatoire' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const startDate = getFieldValue('startDate');
              if (!startDate || !value || startDate.isBefore(value)) {
                // Check if endDate is more than one year after startDate
                const oneYearAfterStartDate = moment(startDate).add(1, 'years');
                if (value.isBefore(oneYearAfterStartDate)) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prettier/prettier
                return Promise.reject(new Error('End Date should not be more than one year after Start Date'));
              }
              return Promise.reject(new Error('End Date should be after Start Date'));
            },
          }),
        ],

        disabled: currentUser?.role === 'admin',
      },

      {
        key: 'status',
        label: 'Status',
        widget: 'select',
        initialValue: record?.status,
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
        ],

        disabled: currentUser?.role === 'admin',
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

InternshipForm.propTypes = {
  record: PropTypes.object,
  label: PropTypes.string,
  isCreatedForm: PropTypes.bool,
  onChange: PropTypes.func,
  onlyFormItems: PropTypes.bool,
};

InternshipForm.defaultProps = {
  isCreatedForm: false,
};

export default InternshipForm;
