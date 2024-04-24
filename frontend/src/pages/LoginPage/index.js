import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Button, notification, Row } from 'antd';
import FormBuilder from 'antd-form-builder';
import { $login, selectSessionLoading } from '../../reducers/Session.slice';

import './index.css';

function LoginPage() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectSessionLoading);
  const history = useHistory();
  const windowWidthRef = useRef(window.innerWidth);
  const [form] = Form.useForm();

  const loginFormFields = {
    fields: [
      {
        key: 'email',
        placeholder: 'Adresse e-mail',
        rules: [
          {
            type: 'email',
            message: "L'entrée n'est pas valide E-mail!",
          },
          {
            required: true,
            message: 'Veuillez saisir votre e-mail !',
          },
        ],
      },
      {
        key: 'password',
        placeholder: 'Mot de passe',
        widget: 'password',
        rules: [
          {
            required: true,
            message: 'Veuillez saisir votre mot de passe !',
          },
        ],
      },
    ],
  };

  const onSubmit = (values) => {
    dispatch($login(values))
      .then(unwrapResult)
      .then(() => {
        notification.success({
          message: 'Utilisateur',
          description: "L'utilisateur s'est connecté avec succès",
        });
        history.push('/acceuil');
      })
      .catch((error) =>
        notification.error({
          message: 'Utilisateur',
          description: error.message,
        }),
      );
  };

  const handleResize = () => {
    windowWidthRef.current = window.innerWidth;
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Row align="center" justify="center">
        <Form
          name="login-form"
          onFinish={onSubmit}
          form={form}
          initialValues={{ remember: true }}
          className="login-page-layout"
        >
          <p className="form-title">Bienvenue</p>
          <p className="form-description">Connectez-vous au tableau de bord</p>
          <FormBuilder form={form} meta={loginFormFields} className="mb-0" />

          <Form.Item>
            <Button htmlType="submit" type="primary" className="login-button" loading={isLoading}>
              CONNEXION
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </>
  );
}

export default LoginPage;
