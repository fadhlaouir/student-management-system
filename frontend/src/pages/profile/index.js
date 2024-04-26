import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Empty, Row, Col, Upload, Button, message, PageHeader } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../../reducers/User.slice';
import { selectSessionUser } from '../../reducers/Session.slice';
import { localMoment } from '../../common/helpers';
import { API_ENDPOINT } from '../../common/config';

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentUser = useSelector(selectSessionUser);
  const userData = useSelector(selectUser);
  const [singleFile, setSingleFile] = useState(null);
  const [uploading, setUploading] = useState(false); // state pour suivre l'état de l'upload
  const user = userData?.user;
  const getId = id ?? currentUser?._id;

  useEffect(() => {
    dispatch(fetchUser(getId));
  }, [dispatch, getId]);

  const onClickUpload = () => {
    if (singleFile) {
      const formData = new FormData();
      formData.append('file', singleFile);

      axios
        .put(`${API_ENDPOINT}/v1/api/users/${getId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            message.loading({ content: `Téléchargement en cours: ${progress}%`, key: 'upload-progress' });
          },
        })
        .then((res) => {
          message.success({ content: 'Fichier téléchargé avec succès', key: 'upload-progress' });
          dispatch(fetchUser(getId));
          setUploading(false); // Mettre à jour l'état de l'upload
        })
        .catch((err) => {
          message.error({ content: 'Erreur lors du téléchargement du fichier', key: 'upload-progress' });
          setUploading(false); // Mettre à jour l'état de l'upload en cas d'erreur
        });
    }
  };

  const uploadSingleFile = (data) => {
    setSingleFile(data.fileList[0]?.originFileObj);
  };

  const props = {
    beforeUpload: () => false,
  };

  return (
    <div>
      <PageHeader ghost={false} onBack={() => window.history.back()} title="Acceuil" />
      {user ? (
        <div className="content-to-export" style={{ padding: '20px' }}>
          <Row justify="center" align="middle">
            <Col span={24}>
              <Descriptions title="Informations utilisateur" bordered column={1}>
                <Descriptions.Item label="Nom">{user.firstName}</Descriptions.Item>
                <Descriptions.Item label="Prénom">{user.lastName}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Numéro de téléphone">{user.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Date de création">{localMoment(user.joined_at)}</Descriptions.Item>
                <Descriptions.Item label="Rôle">{user.role}</Descriptions.Item>
                <Descriptions.Item label="Spécialité">{user.speciality}</Descriptions.Item>
                <Descriptions.Item label="Rapport de stage">
                  <Row align="middle" justify="space-between">
                    <Col>
                      {user.file ? (
                        <a href={`${API_ENDPOINT}/${user.file}`} target="_blank" rel="noopener noreferrer">
                          Télécharger le rapport de stage
                        </a>
                      ) : (
                        'Aucun rapport de stage'
                      )}
                    </Col>
                    {currentUser && currentUser.role === 'intern' && currentUser._id === user._id && (
                      <Col>
                        <Upload onChange={uploadSingleFile} {...props} accept="pdf" maxCount={1}>
                          <Button icon={<UploadOutlined />}>Cliquez pour changer ou ajouter le rapport de stage</Button>
                        </Upload>
                        <Button onClick={() => setUploading(true)}>Envoyer</Button>
                      </Col>
                    )}
                  </Row>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      ) : (
        <Empty description="Aucun utilisateur trouvé" />
      )}
      {uploading && onClickUpload()} {/* Appel de onClickUpload lorsque uploading est true */}
    </div>
  );
};

export default Profile;
