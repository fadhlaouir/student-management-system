/* eslint-disable no-shadow */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

// UI Components
import { Form, Button, Modal, notification, Row, message } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';

// Reducers
import { createAdvancement, fetchAllAdvancements, updateAdvancement } from '../../reducers/Advancement.slice';
import { fetchAllInternshipRequest, selectAllInternshipRequests } from '../../reducers/InternshipRequest.slice';

/* -------------------------------------------------------------------------- */
/*                               Advancement Form                              */
/* -------------------------------------------------------------------------- */
function AdvancementForm({ onChange, onlyFormItems, isCreatedForm, label, record }) {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [showModal, setShowModal] = useState(false);
  const stages = useSelector(selectAllInternshipRequests);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllAdvancements());
    dispatch(fetchAllInternshipRequest());
  }, []);

  const allAcceptedInternship = stages.filter((stage) => stage.status === 'accepted');

  const uniqueInternships = Array.from(new Set(allAcceptedInternship.map((stage) => stage.internship?._id))).map(
    (id) => {
      const stage = allAcceptedInternship.find((stage) => stage.internship?._id === id);
      return { label: stage.internship?.title, value: stage.internship?._id };
    },
  );

  const uniqueInterns = Array.from(new Set(allAcceptedInternship.map((stage) => stage.intern?._id))).map((id) => {
    const stage = allAcceptedInternship.find((stage) => stage.intern?._id === id);
    return { label: stage.intern?.email, value: stage.intern?._id };
  });

  /* ----------------------------- RENDER HELPERS ----------------------------- */
  const [form] = Form.useForm();

  const filteredInterns = (internshipId) => {
    const selectedInternship = allAcceptedInternship.find((stage) => stage.internship?._id === internshipId);
    return selectedInternship
      ? [{ label: selectedInternship.intern?.email, value: selectedInternship.intern?._id }]
      : [];
  };

  /**
   * @param {object} entry data entry from form
   */
  const onClickSubmit = (entry) => {
    if (record) {
      dispatch(
        updateAdvancement({
          _id: record._id,
          ...entry,
        }),
      )
        .then(() => {
          notification.success({
            message: 'Advancement',
            description: 'Advancement updated successfully',
          });
          setShowModal(!showModal);
          dispatch(fetchAllAdvancements());
        })
        .catch((error) =>
          notification.error({
            message: 'Advancement',
            description: error.message,
          }),
        )
        .then(unwrapResult);
      form.resetFields();
    } else {
      dispatch(
        createAdvancement({
          ...entry,
        }),
      )
        .then(unwrapResult)
        .then(() => {
          notification.success({
            message: 'Advancement',
            description: 'Advancement created successfully',
          });
          setShowModal(!showModal);
          dispatch(fetchAllAdvancements());
        })
        .catch((error) =>
          notification.error({
            message: 'Advancement',
            description: error.message,
          }),
        );
      form.resetFields();
    }
  };

  /* -------------------------------- CONSTANTS ------------------------------- */
  const FIELDS = {
    columns: 1,
    fields: [
      {
        key: 'internship',
        label: 'Internship',
        widget: 'select',
        options: uniqueInternships,
        onChange: (internshipId) => {
          form.setFieldsValue({ intern: null });
          form.setFieldsValue({ intern: filteredInterns(internshipId) });
        },
        rules: [
          {
            required: true,
            message: 'Internship is required',
          },
        ],
      },
      {
        key: 'intern',
        label: 'Intern',
        widget: 'select',
        options: uniqueInterns,
        rules: [
          {
            required: true,
            message: 'Intern is required',
          },
        ],
      },
      {
        key: 'title',
        placeholder: 'Title',
        label: 'Title',
        initialValue: record?.title,
        rules: [
          {
            required: true,
            message: 'Title is required',
          },
        ],
      },
      {
        key: 'description',
        placeholder: 'Description',
        label: 'Description',
        initialValue: record?.description,
        widget: 'textarea',
        rules: [
          {
            required: true,
            message: 'Description is required',
          },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        widget: 'select',
        initialValue: record?.status,
        options: [
          { label: 'Todo', value: 'todo' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Done', value: 'done' },
        ],
      },
    ],
  };

  const UPDATE_FIELDS = {
    columns: 1,
    fields: [
      {
        key: 'status',
        label: 'Status',
        widget: 'select',
        initialValue: record?.status,
        options: [
          { label: 'Todo', value: 'todo' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Done', value: 'done' },
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
        width={800}
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
          <FormBuilder form={form} meta={record ? UPDATE_FIELDS : FIELDS} />

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

AdvancementForm.propTypes = {
  record: PropTypes.object,
  label: PropTypes.string,
  isCreatedForm: PropTypes.bool,
  onChange: PropTypes.func,
  onlyFormItems: PropTypes.bool,
};

AdvancementForm.defaultProps = {
  isCreatedForm: false,
};

export default AdvancementForm;
