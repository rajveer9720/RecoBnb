import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import ConnectButtons from "../walletConnect";
import logoDefault from "../../assets/logo.svg";
const buttonBgColor = import.meta.env.VITE_APP_BUTTON_BG_COLOR || "";
const buttonTextColor = import.meta.env.VITE_APP_BUTTON_TEXT_COLOR || "";

const Navigation: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const navItems = [
    "Home",
    "Dashboard",
    "Referrals",
    "Leadership",
    "FAQ",
  ];
  const logoUrl = import.meta.env.VITE_APP_LOGO || logoDefault;
  const navBgColor = import.meta.env.VITE_APP_NAV_BG_COLOR || "";
  const navTextColor = import.meta.env.VITE_APP_NAV_TEXT_COLOR || "";

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={(next) => setExpanded(next)}
      className="navbar-dark"
      fixed="top"
      style={{ backgroundColor: navBgColor }}
    >
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <img
            src={logoUrl}
            alt="Company Logo"
            height="40"
            className="d-inline-block align-top me-2"
            onClick={() => (window.location.href = "/")}
            loading="lazy"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {navItems.map((item) => (
              <Nav.Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className=" mx-2"
                style={{ color: navTextColor }}
                onClick={() => setExpanded(false)}
              >
                {item}
              </Nav.Link>
            ))}

          </Nav>

          <div className="d-flex flex-row flex-wrap align-items-center ms-auto gap-2">
            <Button
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor, fontWeight: "bold", border: "none" }}
              onClick={() => {
                setExpanded(false);
                const target = document.getElementById("invest");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  window.location.hash = "#invest";
                }
              }}
              className="px-4 py-2 "
            >
              Invest
            </Button>

            <div className="d-inline-block" onClick={() => setExpanded(false)}>
              <ConnectButtons />
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
