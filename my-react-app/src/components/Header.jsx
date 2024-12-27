import React from "react";

function Header() {
  const scrollToNavBar = () => {
    const navbar = document.getElementsByClassName("container"); // Get the navbar element
    if (navbar) {
      const navbarPosition = navbar.getBoundingClientRect().top + window.scrollY; // Calculate position
      window.scrollTo({
        top: navbarPosition,
        behavior: "smooth", // Smooth scrolling
      });
    }
  };
  return (
    <header className="mainHeader" >
        <div id="logoContainer">
            <img src="images/logo.png" alt="Club Logo" id="logo" />
        </div>
        <span class="material-symbols-outlined" >
          <a href="/">keyboard_arrow_down</a>
       </span>
      <div className="container" >
        <nav>
          <ul className="listItems">
            <li id="navLogo"> <img src="images/logo.png" height={'80px'} width={'80px'} alt="Club Logo" /></li>
            <li id="aboutUs"><a href="#about">About Us</a></li>
            <li id="events"><a href="#events">Events</a></li>
            <li id="members"><a href="#members">Members</a></li>
            <li id="joinUs"><a href="#join">Join Us</a></li>
            <li id="gallery"><a href="#gallery">Gallery</a></li>
            <li id="contact"><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
