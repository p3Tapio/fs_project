import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Navbar, Nav, Col, Row,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { List } from 'react-bootstrap-icons';
import { logoutUser } from '../../state/reducers/RootReducer';
import { getUser } from '../../state/localStore';

interface NavProps {
  logged: boolean | undefined;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavProps> = ({ logged, setLogged }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [shake, setShake] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = getUser();

  const handleLogout = (): void => {
    dispatch(logoutUser());
    setLogged(false);
    history.push('/');
  };

  const menuElement = document.getElementById('overlayMenu');
  if (!showMenu && menuElement) menuElement.style.height = '0px';
  if (showMenu && menuElement) menuElement.style.height = '170px';

  return (
    <>
      <Navbar
        id="navigationBar"
        variant="dark"
        className="navBar openMenu"
        onClick={(): void => {
          setShowMenu(!showMenu);
          setShake(!shake);
        }}
        style={{ height: '60px' }}
      >
        <Navbar.Brand style={{ flex: 1 }} className="mt-3">
          <Row>
            <Col className="text-left">
              <p>
                <List size={28} className={shake ? 'mr-3 menuBurger' : 'mr-3'} />
                MapApp
              </p>
            </Col>
            {user
            && (
              <Col className="text-right">
                <p className="loggedUserName mt-2">{`${user.username} logged in`}</p>
              </Col>
            )}
          </Row>
        </Navbar.Brand>
        <Nav className="mr-auto ml-2">
          <div id="overlayMenu">
            <div className="menuItemsWrap">
              {showMenu && (
                <>
                  <Link to="/" className="navLink">
                    Home
                  </Link>
                  <Link to="/public" className="navLink" style={{ whiteSpace: 'nowrap' }}>
                    Location lists
                  </Link>
                </>
              )}
              {showMenu
                && (logged
                  ? (
                    <>
                      <Link to="/userpage" className="navLink">
                        Userpage
                      </Link>
                      <div className="menuDivider" />
                      <button type="button" className="navLink" onClick={handleLogout} style={{ marginLeft: '-5px' }}>Logout</button>
                    </>
                  )
                  : (
                    <>
                      <div className="menuDivider" />
                      <Link to="/register" className="navLink">
                        Register
                      </Link>
                      <Link to="/login" className="navLink">
                        Login
                      </Link>
                    </>
                  )
                )}
            </div>
          </div>
        </Nav>
      </Navbar>
    </>
  );
};

export default Navigation;
