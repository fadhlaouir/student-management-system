/* eslint-disable no-shadow */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import axios from 'axios';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

// UI Components
import { Form, Button, Modal, notification, Row, Upload, message } from 'antd';
import { EditOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';

// reducers
import { fetchAllInternship, updateInternship } from '../../reducers/Internship.slice';
import { fetchAllCompanies } from '../../reducers/Companies.slice';
import { fetchAllUsers, selectAllUsers } from '../../reducers/User.slice';
import { selectSessionUser } from '../../reducers/Session.slice';
import { API_ENDPOINT } from '../../common/config';

/* -------------------------------------------------------------------------- */
/*                               Internship Form                              */
/* -------------------------------------------------------------------------- */
function InternshipForm({ onChange, onlyFormItems, isCreatedForm, label, record }) {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const users = useSelector(selectAllUsers);
  const [fileList, setFileList] = useState([]);

  const currentUser = useSelector(selectSessionUser);

  const currentUserCompany = useMemo(() => currentUser?.company, [currentUser]);

  useEffect(() => {
    dispatch(fetchAllInternship());
    dispatch(fetchAllUsers());
    dispatch(fetchAllCompanies());
  }, []);

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  const [form] = Form.useForm();

  const fileProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        message.error('You can only upload PDF files!');
      }
      setFileList([file]);
      return false;
    },
    onChange: (info) => {
      let fileList = [...info.fileList];

      // 1. Limit the number of uploaded files
      fileList = fileList.slice(-1);

      // 2. Read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          // eslint-disable-next-line no-param-reassign
          file.url = file.response.url;
        }
        return file;
      });

      setFileList(fileList);
    },
  };

  /**
   *
   * @param {object} entry data entry from form
   */
  const onClickSubmit = (entry) => {
    const formData = new FormData();
    formData.append('file', fileList[0]?.originFileObj);
    Object.entries(entry).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('company', currentUserCompany?.name);
    formData.append('manager', currentUser?._id);

    const requestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    };

    if (record) {
      dispatch(updateInternship({ _id: record._id, fields: entry }))
        .then(() => {
          notification.success({ message: 'Stage', description: 'Stage Mis à jour avec succès' });
          setShowModal(!showModal);
          dispatch(fetchAllInternship());
        })
        .catch((error) => notification.error({ message: 'Stage', description: error.message }))
        .then(unwrapResult);
      form.resetFields();
    } else {
      axios
        .post(`${API_ENDPOINT}/v1/api/internship`, formData, requestConfig)
        .then(() => {
          notification.success({ message: 'Stage', description: 'Stage est créées avec succès' });
          setShowModal(!showModal);
          dispatch(fetchAllInternship());
        })
        .catch((error) => notification.error({ message: 'Stage', description: error.message }));
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
          ({ getFieldValue }) => ({
            validator(_, value) {
              const startDate = getFieldValue('startDate');
              if (!startDate || !value || startDate.isBefore(value)) {
                // Check if endDate is more than one year after startDate
                const oneMonthAfterStartDate = moment(startDate).add(1, 'months');
                if (value.isAfter(oneMonthAfterStartDate)) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prettier/prettier
                return Promise.reject(new Error('End Date should be more than one month after Start Date'));
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

  const SUPERVISOR_FIELD = {
    columns: 2,
    fields: [
      {
        key: 'supervisor',
        label: 'Encadrant',
        widget: 'select',
        initialValue: record?.supervisor ? getFullName(record?.supervisor) : null,
        options: supervisorOptions,
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
          {!record && (
            <Form.Item name="file" label="Upload PDF File">
              <Upload.Dragger {...fileProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Upload.Dragger>
            </Form.Item>
          )}
          {record && record?.file && (
            <Form.Item name="Description de stage" label="Description de stage">
              <a href={`${API_ENDPOINT}/${record.file}`} target="_blank" rel="noopener noreferrer">
                Télécharger le Description de stage
              </a>
            </Form.Item>
          )}
          {currentUser?.role === 'admin' && <FormBuilder form={form} meta={SUPERVISOR_FIELD} />}

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
