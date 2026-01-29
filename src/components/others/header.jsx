import "./header.css";

const Header = () => {
  return (
    <div className="navbar-desktop">
      <div className="navbar-left-desktop">
        <div className="navbar-logo">
          {/* <img
            src={`${process.env.PUBLIC_URL}/images/enerwise.svg`}
            alt="Logo"
            className="navbar-logo-image"
          /> */}
          NotSEWBOT
        </div>
        <div className="navbar-icon">
          <nav className="navbar-menu">
            {/* <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              {t("analysis")}
            </Link>
            <Link
              to="/history"
              className={location.pathname === "/history" ? "active" : ""}
            >
              {t("history")}
            </Link>
            <Link
              to="/chatbot"
              className={location.pathname === "/chatbot" ? "active" : ""}
            >
              {t("chatbot")}
            </Link> */}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;