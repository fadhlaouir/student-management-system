/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Empty, Row, Col, Upload, Button, message, PageHeader } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../../reducers/User.slice';
import { selectSessionUser } from '../../reducers/Session.slice';
import { localMoment } from '../../common/helpers';
import { API_ENDPOINT } from '../../common/config';
import Loader from '../../shared/Components/Loader';

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentUser = useSelector(selectSessionUser);
  const userData = useSelector(selectUser);
  const user = userData?.user;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [cv, setCv] = useState(null);

  useEffect(() => {
    dispatch(fetchUser(id || currentUser?._id))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch, id, currentUser]);

  const onClickUpload = () => {
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      axios
        .put(`${API_ENDPOINT}/v1/api/users/${user._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            message.loading({ content: `Téléchargement en cours: ${progress}%`, key: 'upload-progress' });
          },
        })
        .then(() => {
          message.success({ content: 'Fichier téléchargé avec succès', key: 'upload-progress' });
          dispatch(fetchUser(user._id));
        })
        .catch(() => {
          message.error({ content: 'Erreur lors du téléchargement du fichier', key: 'upload-progress' });
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  const onClickUploadCV = () => {
    if (cv) {
      setCvUploading(true);
      const formData = new FormData();
      formData.append('cv', cv);

      axios
        .put(`${API_ENDPOINT}/v1/api/users/${user._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            message.loading({ content: `Téléchargement en cours: ${progress}%`, key: 'upload-progress' });
          },
        })
        .then(() => {
          message.success({ content: 'Fichier téléchargé avec succès', key: 'upload-progress' });
          dispatch(fetchUser(user._id));
        })
        .catch(() => {
          message.error({ content: 'Erreur lors du téléchargement du fichier', key: 'upload-progress' });
        })
        .finally(() => {
          setCvUploading(false);
        });
    }
  };

  const uploadSingleFile = (data) => {
    setFile(data.fileList[0]?.originFileObj);
  };

  const uploadSingleCV = (data) => {
    setCv(data.fileList[0]?.originFileObj);
  };

  const props = useMemo(
    () => ({
      beforeUpload: () => false,
    }),
    [],
  );

  const canUploadFile = useMemo(
    () => currentUser?.role === 'intern' && currentUser?._id === user?._id,
    [currentUser, user],
  );

  const manager = currentUser?.role === 'manager';
  const supervisor = currentUser?.role === 'supervisor';

  return (
    <div>
      <PageHeader ghost={false} onBack={() => window.history.back()} title="Accueil" />
      {loading ? (
        <Loader />
      ) : user ? (
        <div className="profile-container">
          <Row justify="center" align="middle">
            <Col span={24}>
              <Descriptions title="Informations utilisateur" bordered column={1}>
                <Descriptions.Item label="Nom">{user?.firstName}</Descriptions.Item>
                <Descriptions.Item label="Prénom">{user?.lastName}</Descriptions.Item>
                <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                <Descriptions.Item label="Numéro de téléphone">{user?.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Date de création">{localMoment(user?.joined_at)}</Descriptions.Item>
                <Descriptions.Item label="Rôle">{user?.role}</Descriptions.Item>
                <Descriptions.Item label="Spécialité">{user?.speciality}</Descriptions.Item>
                {(manager || canUploadFile) && (
                  <Descriptions.Item label="CV" className="upload-item">
                    <Row align="middle" justify="space-between">
                      <Col>
                        {user?.cv ? (
                          <a href={`${API_ENDPOINT}/${user?.cv}`} target="_blank" rel="noopener noreferrer">
                            Télécharger le CV
                          </a>
                        ) : (
                          'Aucun CV'
                        )}
                      </Col>
                      {canUploadFile && (
                        <Col>
                          <Upload onChange={uploadSingleCV} {...props} accept="pdf" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Cliquez pour changer ou ajouter le CV</Button>
                          </Upload>
                          <Button onClick={onClickUploadCV} loading={cvUploading} className="upload-button">
                            Envoyer
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Descriptions.Item>
                )}
                {(supervisor || canUploadFile) && (
                  <Descriptions.Item label="Rapport de stage" className="upload-item">
                    <Row align="middle" justify="space-between">
                      <Col>
                        {user?.file ? (
                          <a href={`${API_ENDPOINT}/${user?.file}`} target="_blank" rel="noopener noreferrer">
                            Télécharger le rapport de stage
                          </a>
                        ) : (
                          'Aucun rapport de stage'
                        )}
                      </Col>
                      {canUploadFile && (
                        <Col>
                          <Upload onChange={uploadSingleFile} {...props} accept="pdf" maxCount={1}>
                            <Button icon={<UploadOutlined />}>
                              Cliquez pour changer ou ajouter le rapport de stage
                            </Button>
                          </Upload>
                          <Button onClick={onClickUpload} loading={uploading} className="upload-button">
                            Envoyer
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Col>
          </Row>
        </div>
      ) : (
        <Empty description="Aucun utilisateur trouvé" />
      )}
    </div>
  );
};

export default Profile;
