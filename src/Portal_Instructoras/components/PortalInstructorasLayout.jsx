import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarOutlined,
  HomeOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../auth/hooks/useAuth';
import './PortalInstructorasLayout.css';

const NAV_ITEMS = [
  {
    view: 'PROGRAMACION',
    label: 'Mis horarios',
    route: '/portal-instructoras/dashboard',
    icon: <HomeOutlined />,
  },
  {
    view: 'PROGRAMACION',
    label: 'Programacion',
    route: '/portal-instructoras/programacion',
    icon: <CalendarOutlined />,
  },
  {
    view: 'ADMINISTRATIVO',
    label: 'Vista administrativa',
    route: '/portal-instructoras/vista-administrativa',
    icon: <ScheduleOutlined />,
  },
  {
    view: 'GESTION_LINEAS_INSTRUCTORAS',
    label: 'Lineas instructora',
    route: '/portal-instructoras/gestion-lineas-instructoras',
    icon: <TeamOutlined />,
  },
];

const getInitials = (name = '') => {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return words[0]?.[0]?.toUpperCase() || 'U';
};

function PortalInstructorasLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, canAccessView, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="portal-instructoras-shell">
      <aside className="portal-instructoras-sidebar">
        <div className="portal-instructoras-sidebar__top">
          <div className="portal-instructoras-brand">
            <h2>Portal C&W</h2>
            <p>Instructoras</p>
          </div>

          <div className="portal-instructoras-user">
            {user?.foto ? (
              <img
                src={user.foto}
                alt="Perfil"
                className="portal-instructoras-user__image"
              />
            ) : (
              <div className="portal-instructoras-user__initials">
                {getInitials(user?.nombre)}
              </div>
            )}
            <div className="portal-instructoras-user__text">
              <strong>{user?.nombre || 'Usuario'}</strong>
              <span>{user?.cargo || user?.perfil || 'Instructoras'}</span>
            </div>
          </div>
        </div>

        <nav className="portal-instructoras-menu">
          {NAV_ITEMS.filter((item) => canAccessView(item.view)).map((item) => {
            const isActive = location.pathname === item.route;

            return (
              <button
                key={item.route}
                type="button"
                className={`portal-instructoras-menu__item ${
                  isActive ? 'portal-instructoras-menu__item--active' : ''
                }`}
                onClick={() => navigate(item.route)}
              >
                <span className="portal-instructoras-menu__icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="portal-instructoras-sidebar__bottom">
          <button
            type="button"
            className="portal-instructoras-menu__item"
            onClick={() => navigate('/menu')}
          >
            <span className="portal-instructoras-menu__icon"><HomeOutlined /></span>
            <span>Menu principal</span>
          </button>
          <button
            type="button"
            className="portal-instructoras-logout"
            onClick={handleLogout}
          >
            <LogoutOutlined />
            <span>Cerrar sesion</span>
          </button>
        </div>
      </aside>

      <main className="portal-instructoras-content">
        {children}
      </main>
    </div>
  );
}

export default PortalInstructorasLayout;
