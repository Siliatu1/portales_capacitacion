
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenu } from "../services/menu.service";

export const useMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenu();
      setMenu(data);
      setLoading(false);
    };

    fetchMenu();
  }, []);

  const goTo = (route) => {
    navigate(route);
  };

  return {
    menu,
    loading,
    goTo
  };
};