import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Button, notification, Row, Col } from 'antd';
import FormBuilder from 'antd-form-builder';
import { $login, selectSessionLoading } from '../../reducers/Session.slice';
import './index.css';

// Import your image
import IMAGE from '../../assets/images/background.jpg';

function LoginPage() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectSessionLoading);
  const history = useHistory();
  const [form] = Form.useForm();

  const loginFormFields = useMemo(
    () => ({
      fields: [
        {
          key: 'email',
          placeholder: 'Adresse e-mail',
          rules: [
            { type: 'email', message: "L'entrée n'est pas valide E-mail!" },
            { required: true, message: 'Veuillez saisir votre e-mail !' },
          ],
        },
        {
          key: 'password',
          placeholder: 'Mot de passe',
          widget: 'password',
          rules: [{ required: true, message: 'Veuillez saisir votre mot de passe !' }],
        },
      ],
    }),
    [],
  );

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

  return (
    <Row align="middle" justify="end">
      <Col xs={24} md={12}>
        <img src={IMAGE} alt="Your Image" style={{ width: '100%', height: 'auto' }} />
      </Col>
      <Col xs={24} md={12}>
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
          <Button htmlType="submit" type="primary" className="login-button" loading={isLoading}>
            CONNEXION
          </Button>
        </Form>
        <Row style={{ marginTop: '40px' }} align="middle">
          Le bouton connexion ne fonctionne pas ?
          <Button
            style={{ marginLeft: '20px' }}
            type="primary"
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            Rafraîchir la page
          </Button>
        </Row>
      </Col>
    </Row>
  );
}

export default LoginPage;
