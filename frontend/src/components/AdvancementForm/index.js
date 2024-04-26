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
import { Form, Button, Modal, notification, Row } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';

// reducers
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

  const ALLACCEPTEDINTERNSHIP = stages.filter((stage) => stage.status === 'accepted');
  console.log('stages', ALLACCEPTEDINTERNSHIP);
  /* ----------------------------- RENDER HELPERS ----------------------------- */
  const [form] = Form.useForm();

  /**
   *
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

  const internships = ALLACCEPTEDINTERNSHIP.map((stage) => ({
    label: stage.internship?.title,
    value: stage.internship?._id,
  }));

  const interns = ALLACCEPTEDINTERNSHIP.map((stage) => ({
    label: stage.intern?.email,
    value: stage.intern?._id,
  }));

  /* -------------------------------- CONSTANTS ------------------------------- */
  const FIELDS = {
    columns: 1,
    fields: [
      {
        key: 'internship',
        label: 'Internship',
        widget: 'select',
        options: internships,
      },
      {
        key: 'intern',
        label: 'Intern',
        widget: 'select',
        options: interns,
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
