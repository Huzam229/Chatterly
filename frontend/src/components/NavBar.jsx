import React from "react";
import useAuthUser from "../hooks/useAuthUser";

const NavBar = () => {
  const { authUser } = useAuthUser();
  return <div>NavBar</div>;
};

export default NavBar;
