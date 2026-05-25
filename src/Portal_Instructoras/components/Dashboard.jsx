import { useNavigate } from 'react-router-dom';
import {
  Table,
  Tag,
  Button,
  Modal,
  Space,
  Card,
  Tooltip,
} from 'antd';

import {
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';

import 'antd/dist/reset.css';

import '../styles/Dashboard.css';

import HorarioModal from './HorarioModal';

import { useAuth } from '../../auth/hooks/useAuth';

import {
  formatearFecha,
  formatearFechaCompleta,
  formatearRangoFechas,
  getActividadTagColor,
  getDiaSemana,
  getInitials,
} from './dashboard.helpers';

import { useDashboardController } from '../hooks/useDashboardController';

function Dashboard() {
  const navigate = useNavigate();

  const { canAccessView } = useAuth();

  const { user, data, ui, actions } =
    useDashboardController();

  const canAccessAdministrativo =
    canAccessView('ADMINISTRATIVO');

  const {
    puntosVenta,
    horariosDetalles,
    horariosData,
    infoSemana,
    totalHoras,
  } = data;

  const {
    showProfileModal,
    showPreviewModal,
    semanaPreview,
    modalEditar,
    showMoreMotivos,
    filaExpandida,
    formDataModal,
  } = ui;

  const handleDescargarPDF = (
    semana
  ) => {
    const documentStyles = Array.from(
      document.querySelectorAll(
        'style, link[rel="stylesheet"]'
      )
    )
      .map((node) => node.outerHTML)
      .join('\n');

    const filas = horariosDetalles
      .map(
        (h) => `
      <tr>
        <td><strong>${getDiaSemana(
          h.fecha
        )}</strong></td>
        <td>${formatearFechaCompleta(
          h.fecha
        )}</td>
        <td>${h.actividad}</td>
        <td>
          ${
            h.horaInicio === '00:00:00'
              ? 'Todo el día'
              : `${h.horaInicio.substring(
                  0,
                  5
                )} - ${h.horaFin.substring(
                  0,
                  5
                )}`
          }
        </td>
        <td>${h.pdv}</td>
      </tr>
    `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Programación Semanal</title>
        ${documentStyles}
      </head>

      <body class="dashboard-print">

        <div class="dashboard-print__header">
          <h1 class="dashboard-print__title">
            Programación Semanal de Capacitaciones
          </h1>

          <p>
            <strong>Instructora:</strong>
            ${user?.nombre || 'N/A'}
          </p>
        </div>

        <div class="dashboard-print__summary">
          <p>
            <strong>Período:</strong>
            ${formatearRangoFechas(
              semana.fechaInicio,
              semana.fechaFin
            )}
          </p>

          <p>
            <strong>Total de horas programadas:</strong>
            ${semana.totalHoras.toFixed(1)} horas
          </p>
        </div>

        <table class="dashboard-print__table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Fecha</th>
              <th>Actividad</th>
              <th>Hora</th>
              <th>Punto de Venta</th>
            </tr>
          </thead>

          <tbody>
            ${
              horariosDetalles.length > 0
                ? filas
                : `
                <tr>
                  <td colspan="5">
                    <em>
                      No hay programación registrada
                    </em>
                  </td>
                </tr>
              `
            }
          </tbody>
        </table>

        <div class="dashboard-print__footer">
          <p>
            Generado el
            ${new Date().toLocaleDateString(
              'es-CO',
              {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }
            )}
          </p>
        </div>

      </body>
      </html>
    `;

    const win = window.open(
      '',
      '',
      'width=900,height=700'
    );

    win.document.write(html);
    win.document.close();

    setTimeout(() => {
      win.print();
    }, 500);
  };

  return (
    <div className="dashboard-container">

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">

          <div className="navbar-left">

            <button
              className="profile-button-avatar"
              onClick={() =>
                actions.setShowProfileModal(
                  true
                )
              }
            >
              {user?.foto ? (
                <img
                  src={user.foto}
                  alt="Perfil"
                  className="profile-avatar"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      'none';
                  }}
                />
              ) : (
                <div className="profile-avatar-initials">
                  {getInitials(user?.nombre)}
                </div>
              )}
            </button>

            <div className="navbar-titles">
              <h1 className="navbar-title">
                MIS HORARIOS
              </h1>

              <span className="navbar-subtitle">
                Gestión de Disponibilidad
              </span>
            </div>
          </div>

          <div className="navbar-actions">
            <button
              className="btn-volver"
              onClick={() =>
                navigate('/menu')
              }
            >
              Volver
            </button>
          </div>

        </div>
      </nav>

      {/* MAIN */}
      <main className="dashboard-main">

        <div className="welcome-section">
          <h2 className="welcome-greeting">
            ¡Hola, {
              user?.nombre?.split(' ')[0]
            }!
          </h2>
        </div>

        {/* TABLA */}
        <div className="horarios-table-section">

          <div className="table-header">

            <div>
              <h3 className="table-title">
                Horarios Programados
              </h3>

              {infoSemana && (
                <p className="table-period-text">
                  {formatearFecha(
                    infoSemana.fechaInicio
                  )}{' '}
                  -{' '}
                  {formatearFecha(
                    infoSemana.fechaFin
                  )}
                </p>
              )}
            </div>

            <div className="table-stats">
              <Tag color="green">
                Total:{' '}
                {totalHoras.toFixed(1)}h
              </Tag>
            </div>

          </div>

          <Card className="dashboard-table-card">

            <Table
              dataSource={horariosData}
              pagination={false}
              bordered
              columns={[
                {
                  title: 'Fechas',

                  key: 'fechas',

                  render: (_, r) =>
                    formatearRangoFechas(
                      r.fechaInicio,
                      r.fechaFin
                    ),
                },

                {
                  title: 'Total Horas',

                  dataIndex: 'totalHoras',

                  key: 'totalHoras',

                  render: (h) => (
                    <Tag color="cyan">
                      {h.toFixed(1)}h
                    </Tag>
                  ),
                },

                {
                  title: 'Acciones',

                  key: 'acciones',

                  render: (_, record) => (
                    <Space size="small">

                      <Tooltip title="Ver detalle">
                        <Button
                          type="text"
                          icon={
                            <EyeOutlined />
                          }
                          onClick={() =>
                            actions.verSemana(
                              record
                            )
                          }
                        />
                      </Tooltip>

                      <Tooltip title="Descargar PDF">
                        <Button
                          type="text"
                          icon={
                            <DownloadOutlined />
                          }
                          onClick={() =>
                            handleDescargarPDF(
                              record
                            )
                          }
                        />
                      </Tooltip>

                    </Space>
                  ),
                },
              ]}
            />

          </Card>

        </div>

      </main>

      {/* MODAL PERFIL */}
      {showProfileModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            actions.setShowProfileModal(
              false
            )
          }
        >
          <div
            className="modal-content profile-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="profile-avatar-modal">
              {user?.foto ? (
                <img
                  src={user.foto}
                  alt="Perfil"
                  className="profile-avatar-modal-image"
                />
              ) : (
                getInitials(user?.nombre)
              )}
            </div>

            <h2 className="profile-name-modal">
              {user?.nombre}
            </h2>

            <button
              className="logout-button-modal"
              onClick={() => {
                actions.setShowProfileModal(
                  false
                );

                actions.logout();

                navigate(
                  '/cap/cafe',
                  {
                    replace: true,
                  }
                );
              }}
            >
              Cerrar Sesión
            </button>

          </div>
        </div>
      )}

      {/* MODAL PREVIEW */}
      <Modal
        title="Programación Semanal"
        open={
          showPreviewModal &&
          !!semanaPreview
        }
        onCancel={() =>
          actions.setShowPreviewModal(
            false
          )
        }
        footer={null}
        centered
        width={900}
      >
        {semanaPreview && (
          <div>
            Vista previa
          </div>
        )}
      </Modal>

      {/* MODAL HORARIO */}
      <HorarioModal
        open={modalEditar}
        formData={formDataModal}
        puntosVenta={puntosVenta}
        showMoreMotivos={
          showMoreMotivos
        }
        onClose={
          actions.cerrarModal
        }
        onSave={
          actions.guardarEdicion
        }
        onFieldChange={
          actions.fieldChange
        }
        onSelectMotivo={
          actions.selectMotivo
        }
        onToggleMotivos={() =>
          actions.setShowMoreMotivos(
            (prev) => !prev
          )
        }
        variant="buttons"
        title="Editar Actividad"
        centered
      />

    </div>
  );
}

export default Dashboard;