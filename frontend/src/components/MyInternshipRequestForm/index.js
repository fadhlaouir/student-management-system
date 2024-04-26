/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

// UI Components
import { Form, Button, Modal, notification, Row } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import FormBuilder from 'antd-form-builder';

// reducers
import {
  createInternshipRequest,
  fetchAllInternshipRequest,
  updateInternshipRequest,
} from '../../reducers/InternshipRequest.slice';
import { fetchAllInternship, selectAllInternships } from '../../reducers/Internship.slice';
import { fetchAllUsers } from '../../reducers/User.slice';
import { selectSessionUser } from '../../reducers/Session.slice';

/* -------------------------------------------------------------------------- */
/*                               Internship Form                              */
/* -------------------------------------------------------------------------- */
function MyInternshipRequestForm({ onChange, onlyFormItems, isCreatedForm, label, record }) {
  /* ---------------------------------- HOOKS --------------------------------- */
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const stages = useSelector(selectAllInternships);
  const currentUser = useSelector(selectSessionUser);

  const currentUserId = useMemo(() => currentUser?._id, [currentUser]);

  useEffect(() => {
    dispatch(fetchAllInternship());
    dispatch(fetchAllUsers());
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
        updateInternshipRequest({
          _id: record._id,
          fields: {
            intern: currentUserId,
            ...entry,
          },
        }),
      )
        .then(() => {
          notification.success({
            message: 'Demande',
            description: 'Demande Mis à jour avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllInternshipRequest());
        })
        .catch((error) =>
          notification.error({
            message: 'Demande',
            description: error.message,
          }),
        )
        .then(unwrapResult);
      form.resetFields();
    } else {
      dispatch(
        createInternshipRequest({
          intern: currentUserId,
          ...entry,
        }),
      )
        .then(unwrapResult)
        .then(() => {
          notification.success({
            message: 'Demande',
            description: 'Demande est créées avec succès',
          });
          setShowModal(!showModal);
          dispatch(fetchAllInternshipRequest());
        })
        .catch((error) =>
          notification.error({
            message: 'Demande',
            description: error.message,
          }),
        );
      form.resetFields();
    }
  };

  const stagesOptions =
    stages?.internships?.map((stage) => ({
      label: stage.title,
      value: stage._id,
    })) || [];

  /* -------------------------------- CONSTANTS ------------------------------- */
  const FIELDS = {
    columns: 2,
    fields: [
      {
        key: 'internship',
        label: 'Titre de stage',
        widget: 'select',
        options: stagesOptions,
        initialValue: record?.title,
        rules: [
          {
            required: true,
            message: 'Titre de stage est obligatoire',
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

MyInternshipRequestForm.propTypes = {
  record: PropTypes.object,
  label: PropTypes.string,
  isCreatedForm: PropTypes.bool,
  onChange: PropTypes.func,
  onlyFormItems: PropTypes.bool,
};

MyInternshipRequestForm.defaultProps = {
  isCreatedForm: false,
};

export default MyInternshipRequestForm;
